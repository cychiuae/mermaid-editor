import type { StateCreator } from 'zustand';
import {
  applyEdgeChanges,
  type EdgeChange,
  type Connection,
} from '@xyflow/react';
import type { AppState } from './index';
import type { FlowchartEdge, EdgeStyle } from '../types/edge';
import { generateEdgeId } from '../utils/id-generator';
import { DEFAULT_EDGE_STYLE } from '../utils/constants';

export interface EdgesSlice {
  edges: FlowchartEdge[];
  defaultEdgeStyle: EdgeStyle;
  onEdgesChange: (changes: EdgeChange<FlowchartEdge>[]) => void;
  onConnect: (connection: Connection) => void;
  updateEdgeLabel: (edgeId: string, label: string) => void;
  updateEdgeStyle: (edgeId: string, style: EdgeStyle) => void;
  setDefaultEdgeStyle: (style: EdgeStyle) => void;
  deleteSelectedEdges: () => void;
  setEdges: (edges: FlowchartEdge[]) => void;
}

export const createEdgesSlice: StateCreator<AppState, [["zustand/persist", unknown]], [], EdgesSlice> = (set, get) => ({
  edges: [],
  defaultEdgeStyle: DEFAULT_EDGE_STYLE,

  onEdgesChange: (changes) => {
    set({
      edges: applyEdgeChanges(changes, get().edges),
    });
  },

  onConnect: (connection) => {
    const style = get().defaultEdgeStyle;
    const newEdge: FlowchartEdge = {
      id: generateEdgeId(),
      source: connection.source,
      target: connection.target,
      sourceHandle: connection.sourceHandle,
      targetHandle: connection.targetHandle,
      type: style,
      data: { edgeStyle: style, label: '' },
      animated: false,
      className: 'edge-animated',
    };
    set({ edges: [...get().edges, newEdge] });

    // Remove animation class after animation completes
    setTimeout(() => {
      set({
        edges: get().edges.map((e) =>
          e.id === newEdge.id ? { ...e, className: '' } : e
        ),
      });
    }, 600);

    get().pushHistory();
  },

  updateEdgeLabel: (edgeId, label) => {
    set({
      edges: get().edges.map((e) =>
        e.id === edgeId ? { ...e, data: { ...e.data!, label } } : e
      ),
    });
    get().pushHistory();
  },

  updateEdgeStyle: (edgeId, style) => {
    set({
      edges: get().edges.map((e) =>
        e.id === edgeId
          ? { ...e, type: style, data: { ...e.data!, edgeStyle: style } }
          : e
      ),
    });
    get().pushHistory();
  },

  setDefaultEdgeStyle: (style) => set({ defaultEdgeStyle: style }),

  deleteSelectedEdges: () => {
    set({
      edges: get().edges.filter((e) => !e.selected),
    });
    get().pushHistory();
  },

  setEdges: (edges) => set({ edges }),
});
