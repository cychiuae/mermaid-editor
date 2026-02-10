import type { StateCreator } from 'zustand';
import type { AppState } from './index';
import type { FlowchartNode } from '../types/node';
import type { FlowchartEdge } from '../types/edge';
import type { GraphDirection } from '../types/graph';
import { HISTORY_DEBOUNCE_MS } from '../utils/constants';

interface HistorySnapshot {
  nodes: FlowchartNode[];
  edges: FlowchartEdge[];
  direction: GraphDirection;
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

export const createHistorySlice: StateCreator<AppState, [], [], HistorySlice> = (set, get) => ({
  past: [],
  future: [],

  pushHistory: () => {
    if (debounceTimer) clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      const { nodes, edges, direction, past } = get();
      const snapshot: HistorySnapshot = {
        nodes: JSON.parse(JSON.stringify(nodes)),
        edges: JSON.parse(JSON.stringify(edges)),
        direction,
      };
      set({
        past: [...past, snapshot],
        future: [],
      });
    }, HISTORY_DEBOUNCE_MS);
  },

  undo: () => {
    const { past, nodes, edges, direction } = get();
    if (past.length === 0) return;

    const previous = past[past.length - 1];
    const current: HistorySnapshot = {
      nodes: JSON.parse(JSON.stringify(nodes)),
      edges: JSON.parse(JSON.stringify(edges)),
      direction,
    };

    set({
      past: past.slice(0, -1),
      future: [current, ...get().future],
      nodes: previous.nodes,
      edges: previous.edges,
      direction: previous.direction,
    });
  },

  redo: () => {
    const { future, nodes, edges, direction } = get();
    if (future.length === 0) return;

    const next = future[0];
    const current: HistorySnapshot = {
      nodes: JSON.parse(JSON.stringify(nodes)),
      edges: JSON.parse(JSON.stringify(edges)),
      direction,
    };

    set({
      past: [...get().past, current],
      future: future.slice(1),
      nodes: next.nodes,
      edges: next.edges,
      direction: next.direction,
    });
  },

  canUndo: () => get().past.length > 0,
  canRedo: () => get().future.length > 0,
});
