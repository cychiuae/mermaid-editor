import type { GraphDirection } from '../types/graph';

export interface LayoutOptions {
  direction: GraphDirection;
  nodeSep: number;
  rankSep: number;
  edgeSep: number;
}

export const DEFAULT_LAYOUT_OPTIONS: LayoutOptions = {
  direction: 'TB',
  nodeSep: 50,
  rankSep: 80,
  edgeSep: 20,
};
