import type { SequenceDiagramData, SeqEvent, SeqMessage, SeqNoteEvent, SeqFragmentEvent, FragmentSection } from '../types/sequence';
import { SEQ_ARROW_SYNTAX } from '../types/sequence';
import { sanitizeLabel } from './sanitize';

/**
 * Generates valid Mermaid sequence diagram syntax from structured data.
 *
 * Supports all sequence diagram features:
 * - Participant and actor declarations
 * - Auto-numbering
 * - All 10 arrow types (solid, dotted, crosses, async, bidirectional)
 * - Notes (left of, right of, over single/multiple participants)
 * - Message activations and deactivations
 * - Fragments (loop, alt/else, opt, par/and, critical/option, break, rect)
 * - Nested fragments with proper indentation
 * - Label sanitization for special characters
 *
 * @param data - The sequence diagram data structure containing participants, events, and settings
 * @returns Mermaid sequence diagram code as a string with trailing newline
 *
 * @example
 * const data: SequenceDiagramData = {
 *   participants: [
 *     { id: 'A', alias: 'Alice', type: 'participant' },
 *     { id: 'B', alias: 'Bob', type: 'actor' }
 *   ],
 *   events: [
 *     { id: 'msg1', type: 'message', from: 'A', to: 'B', arrowType: 'solid', label: 'Hello' }
 *   ],
 *   activations: [],
 *   autoNumber: true
 * };
 * const code = generateSequenceMermaidCode(data);
 * // Returns:
 * // sequenceDiagram
 * //     autonumber
 * //     participant A as Alice
 * //     actor B as Bob
 * //
 * //     A->>B: Hello
 */
export function generateSequenceMermaidCode(data: SequenceDiagramData): string {
  const lines: string[] = ['sequenceDiagram'];

  // Auto-numbering
  if (data.autoNumber) {
    lines.push('    autonumber');
  }

  // Participant declarations
  for (const participant of data.participants) {
    const keyword = participant.type === 'actor' ? 'actor' : 'participant';
    const alias = sanitizeLabel(participant.alias);
    lines.push(`    ${keyword} ${participant.id} as ${alias}`);
  }

  // Add blank line after participants if we have events
  if (data.participants.length > 0 && data.events.length > 0) {
    lines.push('');
  }

  // Build event map for fragment resolution
  const eventMap = new Map<string, SeqEvent>();
  for (const event of data.events) {
    eventMap.set(event.id, event);
  }

  // Collect nested event IDs (events that are inside fragments)
  const nestedEventIds = new Set<string>();
  for (const event of data.events) {
    if (event.type === 'fragment') {
      collectNestedEventIds(event, nestedEventIds, eventMap);
    }
  }

  // Filter top-level events (exclude nested ones)
  const topLevelEvents = data.events.filter(event => !nestedEventIds.has(event.id));

  // Events
  const eventLines = generateEvents(topLevelEvents, 1, eventMap);
  lines.push(...eventLines);

  return lines.join('\n') + '\n';
}

/**
 * Recursively generates event lines with proper indentation.
 *
 * @param events - Array of events to generate
 * @param indentLevel - Current indentation level (1 = 4 spaces, 2 = 8 spaces, etc.)
 * @param eventMap - Map of event IDs to events for fragment resolution
 * @returns Array of generated lines
 */
function generateEvents(events: SeqEvent[], indentLevel: number, eventMap: Map<string, SeqEvent>): string[] {
  const lines: string[] = [];
  const indent = '    '.repeat(indentLevel);

  for (const event of events) {
    if (event.type === 'message') {
      lines.push(...generateMessage(event, indent));
    } else if (event.type === 'note') {
      lines.push(...generateNote(event, indent));
    } else if (event.type === 'fragment') {
      lines.push(...generateFragment(event, indentLevel, eventMap));
    }
  }

  return lines;
}

/**
 * Generates message lines including activations/deactivations.
 */
function generateMessage(message: SeqMessage, indent: string): string[] {
  const lines: string[] = [];
  const arrowSyntax = SEQ_ARROW_SYNTAX[message.arrowType];
  const label = sanitizeLabel(message.label);

  // Main message line
  lines.push(`${indent}${message.from}${arrowSyntax}${message.to}: ${label}`);

  // Activation
  if (message.activateTarget) {
    lines.push(`${indent}activate ${message.to}`);
  }

  // Deactivation
  if (message.deactivateSource) {
    lines.push(`${indent}deactivate ${message.from}`);
  }

  return lines;
}

/**
 * Generates note line.
 */
function generateNote(noteEvent: SeqNoteEvent, indent: string): string[] {
  const { position, participants, text } = noteEvent.note;
  const sanitizedText = sanitizeLabel(text);

  // For "over" with multiple participants, join with comma
  const participantList = position === 'over' && participants.length > 1
    ? participants.join(',')
    : participants[0];

  return [`${indent}Note ${position} ${participantList}: ${sanitizedText}`];
}

/**
 * Generates fragment lines including nested sections.
 */
function generateFragment(fragmentEvent: SeqFragmentEvent, indentLevel: number, eventMap: Map<string, SeqEvent>): string[] {
  const lines: string[] = [];
  const indent = '    '.repeat(indentLevel);
  const { type, label, sections, color } = fragmentEvent.fragment;

  // Opening line
  if (type === 'rect') {
    const rectColor = color || 'rgb(200, 220, 255)';
    lines.push(`${indent}rect ${rectColor}`);
    // Note: rect labels are typically not rendered in Mermaid sequence diagrams
    // The label is more of a description for the editor UI
  } else {
    const sanitizedLabel = sanitizeLabel(label);
    lines.push(`${indent}${type} ${sanitizedLabel}`);
  }

  // Sections
  for (let i = 0; i < sections.length; i++) {
    const section = sections[i];

    // Section divider (else, and, option) - skip for first section
    if (i > 0) {
      const divider = getSectionDivider(type);
      const sectionLabel = sanitizeLabel(section.label);
      lines.push(`${indent}${divider} ${sectionLabel}`);
    }

    // Recursively generate events in this section
    const sectionEvents = getEventsByIds(section.eventIds, eventMap);
    const nestedLines = generateEvents(sectionEvents, indentLevel + 1, eventMap);
    lines.push(...nestedLines);
  }

  // Closing
  lines.push(`${indent}end`);

  return lines;
}

/**
 * Gets the section divider keyword for multi-section fragments.
 */
function getSectionDivider(fragmentType: string): string {
  switch (fragmentType) {
    case 'alt':
      return 'else';
    case 'par':
      return 'and';
    case 'critical':
      return 'option';
    default:
      return 'else'; // Fallback, though shouldn't be reached
  }
}

/**
 * Resolves event IDs to actual event objects using the event map.
 *
 * @param eventIds - Array of event IDs to resolve
 * @param eventMap - Map of event IDs to events
 * @returns Array of resolved events
 */
function getEventsByIds(eventIds: string[], eventMap: Map<string, SeqEvent>): SeqEvent[] {
  const events: SeqEvent[] = [];
  for (const id of eventIds) {
    const event = eventMap.get(id);
    if (event) {
      events.push(event);
    }
  }
  return events;
}

/**
 * Recursively collects all nested event IDs from fragment sections,
 * including events nested within nested fragments.
 *
 * @param fragmentEvent - The fragment event to process
 * @param nestedIds - Set to accumulate nested event IDs
 * @param eventMap - Map of all events for looking up nested fragments
 */
function collectNestedEventIds(fragmentEvent: SeqFragmentEvent, nestedIds: Set<string>, eventMap?: Map<string, SeqEvent>): void {
  for (const section of fragmentEvent.fragment.sections) {
    for (const eventId of section.eventIds) {
      nestedIds.add(eventId);

      // If this nested event is also a fragment, recursively collect its nested events
      if (eventMap) {
        const nestedEvent = eventMap.get(eventId);
        if (nestedEvent && nestedEvent.type === 'fragment') {
          collectNestedEventIds(nestedEvent, nestedIds, eventMap);
        }
      }
    }
  }
}
