import type { EdgeTypes } from '@xyflow/react';
import { SolidEdge } from './SolidEdge';
import { DottedEdge } from './DottedEdge';
import { ThickEdge } from './ThickEdge';

// Defined at module level to prevent React Flow re-mounts
export const edgeTypes: EdgeTypes = {
  solid: SolidEdge,
  dotted: DottedEdge,
  thick: ThickEdge,
};
