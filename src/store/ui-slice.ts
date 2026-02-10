import type { StateCreator } from 'zustand';
import type { AppState } from './index';
import type { NodeShape } from '../types/node';
import type { DiagramType, SeqArrowType } from '../types/sequence';

export interface UISlice {
  activeShape: NodeShape;
  isCodePanelOpen: boolean;
  isAddingNode: boolean;
  diagramType: DiagramType;
  seqActiveArrowType: SeqArrowType;
  isAddingMessage: boolean;
  addingMessageFrom: string | null;
  setActiveShape: (shape: NodeShape) => void;
  setIsCodePanelOpen: (open: boolean) => void;
  toggleCodePanel: () => void;
  setIsAddingNode: (adding: boolean) => void;
  setDiagramType: (type: DiagramType) => void;
  setSeqActiveArrowType: (type: SeqArrowType) => void;
  setIsAddingMessage: (adding: boolean) => void;
  setAddingMessageFrom: (participantId: string | null) => void;
}

export const createUISlice: StateCreator<AppState, [["zustand/persist", unknown]], [], UISlice> = (set, get) => ({
  activeShape: 'rectangle',
  isCodePanelOpen: false,
  isAddingNode: false,
  diagramType: 'flowchart',
  seqActiveArrowType: 'solid',
  isAddingMessage: false,
  addingMessageFrom: null,

  setActiveShape: (shape) => set({ activeShape: shape }),
  setIsCodePanelOpen: (open) => set({ isCodePanelOpen: open }),
  toggleCodePanel: () => set({ isCodePanelOpen: !get().isCodePanelOpen }),
  setIsAddingNode: (adding) => set({ isAddingNode: adding }),
  setDiagramType: (type) => set({ diagramType: type }),
  setSeqActiveArrowType: (type) => set({ seqActiveArrowType: type }),
  setIsAddingMessage: (adding) => set({ isAddingMessage: adding, addingMessageFrom: adding ? get().addingMessageFrom : null }),
  setAddingMessageFrom: (participantId) => set({ addingMessageFrom: participantId }),
});
