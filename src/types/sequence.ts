// ── Diagram type discriminator ──────────────────────────────────────
export type DiagramType = 'flowchart' | 'sequence';

// ── Participant ─────────────────────────────────────────────────────
export type ParticipantType = 'participant' | 'actor';

export interface SeqParticipant {
  id: string;
  alias: string;
  type: ParticipantType;
}

// ── Arrow types (all 10 Mermaid sequence arrow types) ───────────────
export type SeqArrowType =
  | 'solid'          // ->>   solid line with arrowhead
  | 'solid-open'     // ->    solid line without arrowhead
  | 'solid-cross'    // -x    solid line with cross
  | 'solid-async'    // -)    solid line with open arrow (async)
  | 'dotted'         // -->>  dotted line with arrowhead
  | 'dotted-open'    // -->   dotted line without arrowhead
  | 'dotted-cross'   // --x   dotted line with cross
  | 'dotted-async'   // --)   dotted line with open arrow (async)
  | 'bidirectional-solid'  // <<->>
  | 'bidirectional-dotted'; // <<-->>

export const SEQ_ARROW_LABELS: Record<SeqArrowType, string> = {
  'solid': 'Solid Arrow',
  'solid-open': 'Solid Open',
  'solid-cross': 'Solid Cross',
  'solid-async': 'Solid Async',
  'dotted': 'Dotted Arrow',
  'dotted-open': 'Dotted Open',
  'dotted-cross': 'Dotted Cross',
  'dotted-async': 'Dotted Async',
  'bidirectional-solid': 'Bidirectional Solid',
  'bidirectional-dotted': 'Bidirectional Dotted',
};

export const SEQ_ARROW_SYNTAX: Record<SeqArrowType, string> = {
  'solid': '->>',
  'solid-open': '->',
  'solid-cross': '-x',
  'solid-async': '-)',
  'dotted': '-->>',
  'dotted-open': '-->',
  'dotted-cross': '--x',
  'dotted-async': '--)',
  'bidirectional-solid': '<<->>',
  'bidirectional-dotted': '<<-->>',
};

// ── Note positions ──────────────────────────────────────────────────
export type NotePosition = 'left of' | 'right of' | 'over';

// ── Fragment types ──────────────────────────────────────────────────
export type FragmentType = 'loop' | 'alt' | 'opt' | 'par' | 'critical' | 'break' | 'rect';

export const FRAGMENT_LABELS: Record<FragmentType, string> = {
  loop: 'Loop',
  alt: 'Alt / Else',
  opt: 'Optional',
  par: 'Parallel',
  critical: 'Critical',
  break: 'Break',
  rect: 'Highlight',
};

// ── Fragment section (for alt/else, par/and, critical/option) ───────
export interface FragmentSection {
  label: string;
  eventIds: string[];
}

// ── Events ──────────────────────────────────────────────────────────
export interface SeqMessage {
  id: string;
  type: 'message';
  from: string;         // participant id
  to: string;           // participant id
  arrowType: SeqArrowType;
  label: string;
  activateTarget?: boolean;
  deactivateSource?: boolean;
}

export interface SeqNoteEvent {
  id: string;
  type: 'note';
  note: {
    position: NotePosition;
    participants: string[];  // 1 for left/right, 1-2 for over
    text: string;
  };
}

export interface SeqFragmentEvent {
  id: string;
  type: 'fragment';
  fragment: {
    type: FragmentType;
    label: string;
    sections: FragmentSection[];
    color?: string;       // for rect type
  };
}

export type SeqEvent = SeqMessage | SeqNoteEvent | SeqFragmentEvent;

// ── Activations ─────────────────────────────────────────────────────
export interface SeqActivation {
  id: string;
  participantId: string;
  startEventIndex: number;
  endEventIndex: number;
}

// ── Top-level data ──────────────────────────────────────────────────
export interface SequenceDiagramData {
  participants: SeqParticipant[];
  events: SeqEvent[];
  activations: SeqActivation[];
  autoNumber: boolean;
}

// ── Selection ───────────────────────────────────────────────────────
export type SeqSelectionType = 'participant' | 'message' | 'note' | 'fragment' | 'activation';

export interface SeqSelection {
  type: SeqSelectionType;
  id: string;
}
