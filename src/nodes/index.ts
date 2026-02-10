import type { NodeTypes } from '@xyflow/react';
import { RectangleNode } from './RectangleNode';
import { RoundedNode } from './RoundedNode';
import { DiamondNode } from './DiamondNode';
import { CircleNode } from './CircleNode';
import { StadiumNode } from './StadiumNode';
import { HexagonNode } from './HexagonNode';

// Defined at module level to prevent React Flow re-mounts
export const nodeTypes: NodeTypes = {
  rectangle: RectangleNode,
  rounded: RoundedNode,
  diamond: DiamondNode,
  circle: CircleNode,
  stadium: StadiumNode,
  hexagon: HexagonNode,
};
