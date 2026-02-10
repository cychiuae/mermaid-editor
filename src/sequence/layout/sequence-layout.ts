import type {
  SequenceDiagramData,
  SeqParticipant,
  SeqMessage,
  SeqNoteEvent,
  SeqFragmentEvent,
  SeqActivation,
  SeqEvent,
} from '../../types/sequence';
import {
  PARTICIPANT_WIDTH,
  PARTICIPANT_HEIGHT,
  PARTICIPANT_GAP,
  EVENT_ROW_HEIGHT,
  ACTIVATION_WIDTH,
  NOTE_WIDTH,
  NOTE_HEIGHT_PER_LINE,
  NOTE_PADDING,
  FRAGMENT_PADDING,
  FRAGMENT_HEADER_HEIGHT,
  FRAGMENT_SECTION_GAP,
  MARGIN_TOP,
  MARGIN_LEFT,
  MARGIN_BOTTOM,
  SELF_MESSAGE_WIDTH,
  SELF_MESSAGE_HEIGHT,
} from './sequence-constants';

// ── Layout output types ──────────────────────────────────────────────────

export interface ParticipantLayout {
  participant: SeqParticipant;
  x: number;       // center x
  topY: number;    // top box y
  bottomY: number; // bottom box y (duplicate at bottom)
  width: number;
  height: number;
}

export interface LifelineLayout {
  participantId: string;
  x: number;       // center x (same as participant)
  topY: number;    // starts at bottom of top participant box
  bottomY: number; // ends at top of bottom participant box
}

export interface MessageLayout {
  event: SeqMessage;
  fromX: number;
  toX: number;
  y: number;
  isSelfMessage: boolean;
  labelX: number;
  labelY: number;
  index: number;   // for auto-numbering
}

export interface NoteLayout {
  event: SeqNoteEvent;
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface ActivationLayout {
  activation: SeqActivation;
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface FragmentLayout {
  event: SeqFragmentEvent;
  x: number;
  y: number;
  width: number;
  height: number;
  sectionDividerYs: number[]; // y positions of dashed dividers between sections
}

export interface SequenceLayout {
  participants: ParticipantLayout[];
  lifelines: LifelineLayout[];
  messages: MessageLayout[];
  notes: NoteLayout[];
  activations: ActivationLayout[];
  fragments: FragmentLayout[];
  totalWidth: number;
  totalHeight: number;
}

// ── Helper types ─────────────────────────────────────────────────────────

interface EventYPosition {
  eventId: string;
  y: number;
}

// ── Main layout function ─────────────────────────────────────────────────

export function computeSequenceLayout(data: SequenceDiagramData): SequenceLayout {
  const { participants, events, activations, autoNumber } = data;

  // Step 1: Assign participant columns
  const participantXMap = new Map<string, number>();
  const participantLayouts: ParticipantLayout[] = [];

  participants.forEach((p, index) => {
    const x = MARGIN_LEFT + index * (PARTICIPANT_WIDTH + PARTICIPANT_GAP) + PARTICIPANT_WIDTH / 2;
    participantXMap.set(p.id, x);
  });

  // Step 2: Walk events top-to-bottom
  let currentY = MARGIN_TOP + PARTICIPANT_HEIGHT + 20;
  const messageLayouts: MessageLayout[] = [];
  const noteLayouts: NoteLayout[] = [];
  const fragmentLayouts: FragmentLayout[] = [];
  const eventYPositions: EventYPosition[] = [];
  let messageIndex = 0;

  for (const event of events) {
    if (event.type === 'message') {
      const fromX = participantXMap.get(event.from) ?? 0;
      const toX = participantXMap.get(event.to) ?? 0;
      const isSelfMessage = event.from === event.to;

      eventYPositions.push({ eventId: event.id, y: currentY });

      const labelX = isSelfMessage ? fromX + SELF_MESSAGE_WIDTH / 2 : (fromX + toX) / 2;
      const labelY = currentY;

      messageLayouts.push({
        event,
        fromX,
        toX,
        y: currentY,
        isSelfMessage,
        labelX,
        labelY,
        index: autoNumber ? messageIndex++ : -1,
      });

      currentY += isSelfMessage ? EVENT_ROW_HEIGHT + SELF_MESSAGE_HEIGHT : EVENT_ROW_HEIGHT;
    } else if (event.type === 'note') {
      const { position, participants: noteParticipants, text } = event.note;

      let x = 0;
      let width = NOTE_WIDTH;

      if (position === 'left of' && noteParticipants.length > 0) {
        const participantX = participantXMap.get(noteParticipants[0]) ?? 0;
        x = participantX - NOTE_WIDTH - 20;
      } else if (position === 'right of' && noteParticipants.length > 0) {
        const participantX = participantXMap.get(noteParticipants[0]) ?? 0;
        x = participantX + 20;
      } else if (position === 'over' && noteParticipants.length > 0) {
        // Center over participant(s)
        const firstX = participantXMap.get(noteParticipants[0]) ?? 0;
        const lastX = participantXMap.get(noteParticipants[noteParticipants.length - 1]) ?? firstX;
        x = (firstX + lastX) / 2 - NOTE_WIDTH / 2;
      }

      // Estimate height based on text lines
      const lines = text.split('\n').length;
      const height = lines * NOTE_HEIGHT_PER_LINE + NOTE_PADDING * 2;

      eventYPositions.push({ eventId: event.id, y: currentY });

      noteLayouts.push({
        event,
        x,
        y: currentY,
        width,
        height,
      });

      currentY += height + 10;
    } else if (event.type === 'fragment') {
      const { sections } = event.fragment;

      eventYPositions.push({ eventId: event.id, y: currentY });

      const fragmentStartY = currentY;

      // Compute fragment bounds by finding all referenced participants in contained events
      let minX = Infinity;
      let maxX = -Infinity;
      const referencedParticipants = new Set<string>();

      // Collect all event IDs in all sections
      const allEventIds = new Set<string>();
      sections.forEach(section => {
        section.eventIds.forEach(id => allEventIds.add(id));
      });

      // Find participants referenced by these events
      allEventIds.forEach(eventId => {
        const evt = events.find(e => e.id === eventId);
        if (evt && evt.type === 'message') {
          referencedParticipants.add(evt.from);
          referencedParticipants.add(evt.to);
        } else if (evt && evt.type === 'note') {
          evt.note.participants.forEach(p => referencedParticipants.add(p));
        }
      });

      // If no events or no participants referenced, span all participants
      if (referencedParticipants.size === 0) {
        participants.forEach(p => referencedParticipants.add(p.id));
      }

      referencedParticipants.forEach(pId => {
        const x = participantXMap.get(pId);
        if (x !== undefined) {
          minX = Math.min(minX, x);
          maxX = Math.max(maxX, x);
        }
      });

      // If still no valid bounds, default to first and last participant
      if (!isFinite(minX) || !isFinite(maxX)) {
        minX = participantXMap.get(participants[0]?.id) ?? MARGIN_LEFT;
        maxX = participantXMap.get(participants[participants.length - 1]?.id) ?? minX + PARTICIPANT_WIDTH;
      }

      const fragmentX = minX - PARTICIPANT_WIDTH / 2 - FRAGMENT_PADDING;
      const fragmentWidth = maxX - minX + PARTICIPANT_WIDTH + FRAGMENT_PADDING * 2;

      // Calculate fragment height
      let fragmentHeight = 0;
      const sectionDividerYs: number[] = [];

      sections.forEach((section, sectionIndex) => {
        fragmentHeight += FRAGMENT_HEADER_HEIGHT;

        // Reserve minimum height per section
        const sectionEventCount = section.eventIds.length;
        const sectionHeight = sectionEventCount > 0
          ? sectionEventCount * EVENT_ROW_HEIGHT
          : EVENT_ROW_HEIGHT;

        fragmentHeight += sectionHeight;

        // Add divider position (except for last section)
        if (sectionIndex < sections.length - 1) {
          sectionDividerYs.push(fragmentStartY + fragmentHeight);
          fragmentHeight += FRAGMENT_SECTION_GAP;
        }
      });

      // Minimum fragment height if no sections
      if (sections.length === 0) {
        fragmentHeight = FRAGMENT_HEADER_HEIGHT + EVENT_ROW_HEIGHT;
      }

      fragmentLayouts.push({
        event,
        x: fragmentX,
        y: fragmentStartY,
        width: fragmentWidth,
        height: fragmentHeight,
        sectionDividerYs,
      });

      currentY += fragmentHeight + 10;
    }
  }

  // Step 3: Compute activation spans
  const activationLayouts: ActivationLayout[] = [];

  activations.forEach(activation => {
    const startY = eventYPositions.find(ep => ep.eventId === events[activation.startEventIndex]?.id)?.y;
    const endY = eventYPositions.find(ep => ep.eventId === events[activation.endEventIndex]?.id)?.y;

    if (startY !== undefined && endY !== undefined) {
      const participantX = participantXMap.get(activation.participantId) ?? 0;

      activationLayouts.push({
        activation,
        x: participantX - ACTIVATION_WIDTH / 2,
        y: startY,
        width: ACTIVATION_WIDTH,
        height: endY - startY,
      });
    }
  });

  // Step 4: Bottom participants
  const bottomY = currentY + MARGIN_BOTTOM;

  participants.forEach((p, index) => {
    const x = participantXMap.get(p.id) ?? 0;

    participantLayouts.push({
      participant: p,
      x,
      topY: MARGIN_TOP,
      bottomY,
      width: PARTICIPANT_WIDTH,
      height: PARTICIPANT_HEIGHT,
    });
  });

  // Step 5: Lifelines
  const lifelineLayouts: LifelineLayout[] = [];

  participants.forEach(p => {
    const x = participantXMap.get(p.id) ?? 0;

    lifelineLayouts.push({
      participantId: p.id,
      x,
      topY: MARGIN_TOP + PARTICIPANT_HEIGHT,
      bottomY,
    });
  });

  // Step 6: Total dimensions
  const rightmostX = Math.max(
    ...participants.map(p => participantXMap.get(p.id) ?? 0),
    0
  );
  const totalWidth = rightmostX + PARTICIPANT_WIDTH / 2 + MARGIN_LEFT;
  const totalHeight = bottomY + PARTICIPANT_HEIGHT + MARGIN_TOP;

  return {
    participants: participantLayouts,
    lifelines: lifelineLayouts,
    messages: messageLayouts,
    notes: noteLayouts,
    activations: activationLayouts,
    fragments: fragmentLayouts,
    totalWidth,
    totalHeight,
  };
}
