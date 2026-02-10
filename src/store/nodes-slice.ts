import type { StateCreator } from 'zustand';
import {
  applyNodeChanges,
  type NodeChange,
  type XYPosition,
} from '@xyflow/react';
import type { AppState } from './index';
import type { FlowchartNode, NodeShape } from '../types/node';
import { generateNodeId } from '../utils/id-generator';
import { DEFAULT_NODE_LABEL, DEFAULT_NODE_SHAPE } from '../utils/constants';

export interface NodesSlice {
  nodes: FlowchartNode[];
  onNodesChange: (changes: NodeChange<FlowchartNode>[]) => void;
  addNode: (position: XYPosition, shape?: NodeShape, label?: string) => string;
  deleteSelectedNodes: () => void;
  updateNodeLabel: (nodeId: string, label: string) => void;
  updateNodeShape: (nodeId: string, shape: NodeShape) => void;
  setNodeEditing: (nodeId: string, isEditing: boolean) => void;
  markNodeDeleting: (nodeId: string) => void;
  removeNode: (nodeId: string) => void;
  setNodes: (nodes: FlowchartNode[]) => void;
}

export const createNodesSlice: StateCreator<AppState, [["zustand/persist", unknown]], [], NodesSlice> = (set, get) => ({
  nodes: [],

  onNodesChange: (changes) => {
    set({
      nodes: applyNodeChanges(changes, get().nodes),
    });
  },

  addNode: (position, shape = DEFAULT_NODE_SHAPE, label = DEFAULT_NODE_LABEL) => {
    const id = generateNodeId();
    const newNode: FlowchartNode = {
      id,
      type: shape,
      position,
      data: { label, shape, isEditing: false, isDeleting: false },
    };
    set({ nodes: [...get().nodes, newNode] });
    get().pushHistory();
    return id;
  },

  deleteSelectedNodes: () => {
    const { nodes } = get();
    const selectedNodes = nodes.filter((n) => n.selected);
    if (selectedNodes.length === 0) return;

    // Mark as deleting for animation
    const selectedIds = new Set(selectedNodes.map((n) => n.id));
    set({
      nodes: nodes.map((n) =>
        selectedIds.has(n.id) ? { ...n, data: { ...n.data, isDeleting: true } } : n
      ),
    });

    // Remove after animation delay
    setTimeout(() => {
      const current = get();
      set({
        nodes: current.nodes.filter((n) => !selectedIds.has(n.id)),
        edges: current.edges.filter(
          (e) => !selectedIds.has(e.source) && !selectedIds.has(e.target)
        ),
      });
      get().pushHistory();
    }, 200);
  },

  updateNodeLabel: (nodeId, label) => {
    set({
      nodes: get().nodes.map((n) =>
        n.id === nodeId ? { ...n, data: { ...n.data, label } } : n
      ),
    });
    get().pushHistory();
  },

  updateNodeShape: (nodeId, shape) => {
    set({
      nodes: get().nodes.map((n) =>
        n.id === nodeId ? { ...n, type: shape, data: { ...n.data, shape } } : n
      ),
    });
    get().pushHistory();
  },

  setNodeEditing: (nodeId, isEditing) => {
    set({
      nodes: get().nodes.map((n) =>
        n.id === nodeId ? { ...n, data: { ...n.data, isEditing } } : n
      ),
    });
  },

  markNodeDeleting: (nodeId) => {
    set({
      nodes: get().nodes.map((n) =>
        n.id === nodeId ? { ...n, data: { ...n.data, isDeleting: true } } : n
      ),
    });
  },

  removeNode: (nodeId) => {
    set({
      nodes: get().nodes.filter((n) => n.id !== nodeId),
      edges: get().edges.filter((e) => e.source !== nodeId && e.target !== nodeId),
    });
  },

  setNodes: (nodes) => set({ nodes }),
});
