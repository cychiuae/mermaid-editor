import type { StateCreator } from 'zustand';
import type { AppState } from './index';
import type { FlowchartNode } from '../types/node';
import type { FlowchartEdge } from '../types/edge';
import type { GraphDirection } from '../types/graph';
import type { DiagramType, SeqParticipant, SeqEvent, SeqActivation } from '../types/sequence';
import { HISTORY_DEBOUNCE_MS } from '../utils/constants';

interface HistorySnapshot {
  nodes: FlowchartNode[];
  edges: FlowchartEdge[];
  direction: GraphDirection;
  diagramType: DiagramType;
  seqParticipants: SeqParticipant[];
  seqEvents: SeqEvent[];
  seqActivations: SeqActivation[];
  seqAutoNumber: boolean;
}

export interface HistorySlice {
  past: HistorySnapshot[];
  future: HistorySnapshot[];
  pushHistory: () => void;
  undo: () => void;
  redo: () => void;
  canUndo: () => boolean;
  canRedo: () => boolean;
}

let debounceTimer: ReturnType<typeof setTimeout> | null = null;

function createSnapshot(state: AppState): HistorySnapshot {
  return {
    nodes: JSON.parse(JSON.stringify(state.nodes)),
    edges: JSON.parse(JSON.stringify(state.edges)),
    direction: state.direction,
    diagramType: state.diagramType,
    seqParticipants: JSON.parse(JSON.stringify(state.seqParticipants)),
    seqEvents: JSON.parse(JSON.stringify(state.seqEvents)),
    seqActivations: JSON.parse(JSON.stringify(state.seqActivations)),
    seqAutoNumber: state.seqAutoNumber,
  };
}

function restoreSnapshot(snapshot: HistorySnapshot): Partial<AppState> {
  return {
    nodes: snapshot.nodes,
    edges: snapshot.edges,
    direction: snapshot.direction,
    diagramType: snapshot.diagramType,
    seqParticipants: snapshot.seqParticipants,
    seqEvents: snapshot.seqEvents,
    seqActivations: snapshot.seqActivations,
    seqAutoNumber: snapshot.seqAutoNumber,
  };
}

export const createHistorySlice: StateCreator<AppState, [["zustand/persist", unknown]], [], HistorySlice> = (set, get) => ({
  past: [],
  future: [],

  pushHistory: () => {
    if (debounceTimer) clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      const state = get();
      const snapshot = createSnapshot(state);
      set({
        past: [...state.past, snapshot],
        future: [],
      });
    }, HISTORY_DEBOUNCE_MS);
  },

  undo: () => {
    const state = get();
    if (state.past.length === 0) return;

    const previous = state.past[state.past.length - 1];
    const current = createSnapshot(state);

    set({
      past: state.past.slice(0, -1),
      future: [current, ...get().future],
      ...restoreSnapshot(previous),
    });
  },

  redo: () => {
    const state = get();
    if (state.future.length === 0) return;

    const next = state.future[0];
    const current = createSnapshot(state);

    set({
      past: [...get().past, current],
      future: state.future.slice(1),
      ...restoreSnapshot(next),
    });
  },

  canUndo: () => get().past.length > 0,
  canRedo: () => get().future.length > 0,
});
