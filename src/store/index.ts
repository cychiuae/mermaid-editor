import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { createNodesSlice, type NodesSlice } from './nodes-slice';
import { createEdgesSlice, type EdgesSlice } from './edges-slice';
import { createGraphSlice, type GraphSlice } from './graph-slice';
import { createHistorySlice, type HistorySlice } from './history-slice';
import { createUISlice, type UISlice } from './ui-slice';
import { createSequenceSlice, type SequenceSlice } from './sequence-slice';
import { syncCountersFromState } from '../utils/id-generator';

export type AppState = NodesSlice & EdgesSlice & GraphSlice & HistorySlice & UISlice & SequenceSlice;

export const useStore = create<AppState>()(
  persist(
    (...a) => ({
      ...createNodesSlice(...a),
      ...createEdgesSlice(...a),
      ...createGraphSlice(...a),
      ...createHistorySlice(...a),
      ...createUISlice(...a),
      ...createSequenceSlice(...a),
    }),
    {
      name: 'mermaid-editor-state',
      version: 1,
      partialize: (state) => ({
        nodes: state.nodes.map(({ selected, ...rest }) => ({
          ...rest,
          data: {
            label: rest.data.label,
            shape: rest.data.shape,
          },
        })),
        edges: state.edges.map(({ selected, ...rest }) => rest),
        direction: state.direction,
        diagramType: state.diagramType,
        defaultEdgeStyle: state.defaultEdgeStyle,
        seqParticipants: state.seqParticipants,
        seqEvents: state.seqEvents,
        seqActivations: state.seqActivations,
        seqAutoNumber: state.seqAutoNumber,
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          syncCountersFromState(state);
        }
      },
    }
  )
);
