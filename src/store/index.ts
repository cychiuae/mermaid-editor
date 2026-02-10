import { create } from 'zustand';
import { createNodesSlice, type NodesSlice } from './nodes-slice';
import { createEdgesSlice, type EdgesSlice } from './edges-slice';
import { createGraphSlice, type GraphSlice } from './graph-slice';
import { createHistorySlice, type HistorySlice } from './history-slice';
import { createUISlice, type UISlice } from './ui-slice';

export type AppState = NodesSlice & EdgesSlice & GraphSlice & HistorySlice & UISlice;

export const useStore = create<AppState>()((...a) => ({
  ...createNodesSlice(...a),
  ...createEdgesSlice(...a),
  ...createGraphSlice(...a),
  ...createHistorySlice(...a),
  ...createUISlice(...a),
}));
