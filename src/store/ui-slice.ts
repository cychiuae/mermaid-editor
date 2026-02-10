import type { StateCreator } from 'zustand';
import type { AppState } from './index';
import type { NodeShape } from '../types/node';

export interface UISlice {
  activeShape: NodeShape;
  isCodePanelOpen: boolean;
  isAddingNode: boolean;
  setActiveShape: (shape: NodeShape) => void;
  setIsCodePanelOpen: (open: boolean) => void;
  toggleCodePanel: () => void;
  setIsAddingNode: (adding: boolean) => void;
}

export const createUISlice: StateCreator<AppState, [], [], UISlice> = (set, get) => ({
  activeShape: 'rectangle',
  isCodePanelOpen: false,
  isAddingNode: false,

  setActiveShape: (shape) => set({ activeShape: shape }),
  setIsCodePanelOpen: (open) => set({ isCodePanelOpen: open }),
  toggleCodePanel: () => set({ isCodePanelOpen: !get().isCodePanelOpen }),
  setIsAddingNode: (adding) => set({ isAddingNode: adding }),
});
