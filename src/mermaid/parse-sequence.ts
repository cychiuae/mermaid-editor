import type {
  SeqParticipant,
  ParticipantType,
  SeqEvent,
  SeqArrowType,
  SeqActivation,
  NotePosition,
  FragmentType,
  FragmentSection,
} from '../types/sequence';
import { SEQ_ARROW_SYNTAX } from '../types/sequence';
import {
  generateParticipantId,
  generateSeqEventId,
  generateActivationId,
} from '../utils/id-generator';
import { desanitizeLabel } from './desanitize';

export interface SequenceParseResult {
  participants: SeqParticipant[];
  events: SeqEvent[];
  activations: SeqActivation[];
  autoNumber: boolean;
}

// Build reverse arrow lookup: arrow syntax → SeqArrowType, sorted longest first
const ARROW_ENTRIES: [string, SeqArrowType][] = Object.entries(SEQ_ARROW_SYNTAX)
  .map(([type, syntax]) => [syntax, type as SeqArrowType] as [string, SeqArrowType])
  .sort((a, b) => b[0].length - a[0].length);

function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// Build message regex: FROM<arrow>TO: label
// We build one big alternation with the arrows sorted longest-first
const arrowAlternation = ARROW_ENTRIES.map(([syntax]) => escapeRegex(syntax)).join('|');
const MESSAGE_REGEX = new RegExp(
  `^(\\S+?)\\s*(${arrowAlternation})\\s*(\\S+?)\\s*:\\s*(.*)$`
);

const PARTICIPANT_REGEX = /^(participant|actor)\s+(\S+)(?:\s+as\s+(.+))?$/;
const ACTIVATE_REGEX = /^activate\s+(\S+)$/;
const DEACTIVATE_REGEX = /^deactivate\s+(\S+)$/;
const NOTE_REGEX = /^Note\s+(left of|right of|over)\s+([^:]+):\s*(.*)$/;
const FRAGMENT_START_REGEX = /^(loop|alt|opt|par|critical|break|rect)\s+(.*)$/;
const SECTION_DIVIDER_REGEX = /^(else|and|option)\s*(.*)$/;
const END_REGEX = /^end$/;

const FRAGMENT_TYPE_SET = new Set<FragmentType>([
  'loop', 'alt', 'opt', 'par', 'critical', 'break', 'rect',
]);

function lookupArrowType(syntax: string): SeqArrowType | null {
  for (const [arrow, type] of ARROW_ENTRIES) {
    if (arrow === syntax) return type;
  }
  return null;
}

interface FragmentFrame {
  id: string;
  type: FragmentType;
  label: string;
  color?: string;
  sections: FragmentSection[];
  currentSectionIndex: number;
}

export function parseSequence(code: string): SequenceParseResult {
  const lines = code.split('\n').map((l) => l.trim()).filter(Boolean);

  const participants: SeqParticipant[] = [];
  const topLevelEvents: SeqEvent[] = [];
  const activations: SeqActivation[] = [];
  let autoNumber = false;

  // Maps participant name/id → participant id
  const participantLookup = new Map<string, string>();

  // Fragment nesting stack
  const fragmentStack: FragmentFrame[] = [];

  // Track activations: participantId → { startIndex, activationId }
  const activeActivations = new Map<string, { startIndex: number; id: string }>();
  let eventIndex = 0;

  function resolveParticipant(name: string): string {
    const existing = participantLookup.get(name);
    if (existing) return existing;
    // Auto-create participant
    const id = generateParticipantId();
    participants.push({ id, alias: name, type: 'participant' });
    participantLookup.set(name, id);
    return id;
  }

  function addEventToCurrentScope(event: SeqEvent): void {
    if (fragmentStack.length > 0) {
      const frame = fragmentStack[fragmentStack.length - 1];
      frame.sections[frame.currentSectionIndex].eventIds.push(event.id);
    }
    // Always push to topLevelEvents — the generator filters nested ones
    topLevelEvents.push(event);
  }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Skip header
    if (/^sequenceDiagram$/i.test(line)) continue;

    // Auto-number
    if (/^autonumber$/i.test(line)) {
      autoNumber = true;
      continue;
    }

    // Participant/actor
    const partMatch = line.match(PARTICIPANT_REGEX);
    if (partMatch) {
      const [, keyword, name, aliasRaw] = partMatch;
      const type: ParticipantType = keyword === 'actor' ? 'actor' : 'participant';
      const alias = aliasRaw ? desanitizeLabel(aliasRaw.trim()) : name;
      const id = generateParticipantId();
      participants.push({ id, alias, type });
      participantLookup.set(name, id);
      continue;
    }

    // Activate
    const actMatch = line.match(ACTIVATE_REGEX);
    if (actMatch) {
      const pid = resolveParticipant(actMatch[1]);
      const aid = generateActivationId();
      activeActivations.set(pid, { startIndex: eventIndex, id: aid });
      continue;
    }

    // Deactivate
    const deactMatch = line.match(DEACTIVATE_REGEX);
    if (deactMatch) {
      const pid = resolveParticipant(deactMatch[1]);
      const active = activeActivations.get(pid);
      if (active) {
        activations.push({
          id: active.id,
          participantId: pid,
          startEventIndex: active.startIndex,
          endEventIndex: eventIndex - 1,
        });
        activeActivations.delete(pid);
      }
      continue;
    }

    // End (close fragment)
    if (END_REGEX.test(line)) {
      if (fragmentStack.length > 0) {
        const frame = fragmentStack.pop()!;
        const fragmentEvent: SeqEvent = {
          id: frame.id,
          type: 'fragment',
          fragment: {
            type: frame.type,
            label: frame.label,
            sections: frame.sections,
            ...(frame.color ? { color: frame.color } : {}),
          },
        };
        addEventToCurrentScope(fragmentEvent);
      }
      continue;
    }

    // Section divider (else, and, option)
    const dividerMatch = line.match(SECTION_DIVIDER_REGEX);
    if (dividerMatch && fragmentStack.length > 0) {
      const [, , labelRaw] = dividerMatch;
      const frame = fragmentStack[fragmentStack.length - 1];
      frame.sections.push({ label: desanitizeLabel(labelRaw?.trim() || ''), eventIds: [] });
      frame.currentSectionIndex = frame.sections.length - 1;
      continue;
    }

    // Fragment start
    const fragMatch = line.match(FRAGMENT_START_REGEX);
    if (fragMatch) {
      const [, typeStr, labelRaw] = fragMatch;
      const fType = typeStr as FragmentType;
      if (FRAGMENT_TYPE_SET.has(fType)) {
        const frame: FragmentFrame = {
          id: generateSeqEventId(),
          type: fType,
          label: fType === 'rect' ? '' : desanitizeLabel(labelRaw.trim()),
          ...(fType === 'rect' ? { color: labelRaw.trim() || 'rgb(200, 220, 255)' } : {}),
          sections: [{ label: '', eventIds: [] }],
          currentSectionIndex: 0,
        };
        fragmentStack.push(frame);
        continue;
      }
    }

    // Note
    const noteMatch = line.match(NOTE_REGEX);
    if (noteMatch) {
      const [, posRaw, participantsRaw, textRaw] = noteMatch;
      const position = posRaw as NotePosition;
      const pIds = participantsRaw.split(',').map((p) => resolveParticipant(p.trim()));
      const noteEvent: SeqEvent = {
        id: generateSeqEventId(),
        type: 'note',
        note: {
          position,
          participants: pIds,
          text: desanitizeLabel(textRaw.trim()),
        },
      };
      addEventToCurrentScope(noteEvent);
      eventIndex++;
      continue;
    }

    // Message
    const msgMatch = line.match(MESSAGE_REGEX);
    if (msgMatch) {
      const [, fromName, arrowSyntax, toName, labelRaw] = msgMatch;
      const arrowType = lookupArrowType(arrowSyntax);
      if (arrowType) {
        const from = resolveParticipant(fromName);
        const to = resolveParticipant(toName);
        const message: SeqEvent = {
          id: generateSeqEventId(),
          type: 'message',
          from,
          to,
          arrowType,
          label: desanitizeLabel(labelRaw.trim()),
        };
        addEventToCurrentScope(message);
        eventIndex++;
      }
      continue;
    }
  }

  // Close any unclosed activations
  for (const [pid, active] of activeActivations) {
    activations.push({
      id: active.id,
      participantId: pid,
      startEventIndex: active.startIndex,
      endEventIndex: Math.max(0, eventIndex - 1),
    });
  }

  return { participants, events: topLevelEvents, activations, autoNumber };
}
