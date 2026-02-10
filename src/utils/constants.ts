import type { NodeShape } from '../types/node';
import type { EdgeStyle } from '../types/edge';
import type { SeqArrowType } from '../types/sequence';

export const DEFAULT_NODE_LABEL = 'Node';
export const DEFAULT_NODE_SHAPE: NodeShape = 'rectangle';
export const DEFAULT_EDGE_STYLE: EdgeStyle = 'solid';

export const NODE_MIN_WIDTH = 100;
export const NODE_MIN_HEIGHT = 40;

export const HISTORY_DEBOUNCE_MS = 300;
export const SNAP_GRID: [number, number] = [16, 16];

// Sequence diagram defaults
export const DEFAULT_PARTICIPANT_ALIAS = 'Participant';
export const DEFAULT_SEQ_ARROW_TYPE: SeqArrowType = 'solid';
export const DEFAULT_FRAGMENT_LABEL = 'condition';
export const DEFAULT_NOTE_TEXT = 'Note';
