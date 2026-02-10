import type { StateCreator } from 'zustand';
import type { AppState } from './index';
import type { GraphDirection } from '../types/graph';

export interface GraphSlice {
  direction: GraphDirection;
  setDirection: (direction: GraphDirection) => void;
}

export const createGraphSlice: StateCreator<AppState, [["zustand/persist", unknown]], [], GraphSlice> = (set, get) => ({
  direction: 'TB',

  setDirection: (direction) => {
    set({ direction });
    get().pushHistory();
  },
});
