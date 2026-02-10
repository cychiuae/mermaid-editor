import type { Node } from '@xyflow/react';

export type NodeShape =
  | 'rectangle'
  | 'rounded'
  | 'diamond'
  | 'circle'
  | 'stadium'
  | 'hexagon';

export type FlowchartNodeData = {
  label: string;
  shape: NodeShape;
  isEditing?: boolean;
  isDeleting?: boolean;
};

export type FlowchartNode = Node<FlowchartNodeData>;

export const NODE_SHAPE_LABELS: Record<NodeShape, string> = {
  rectangle: 'Rectangle',
  rounded: 'Rounded',
  diamond: 'Diamond',
  circle: 'Circle',
  stadium: 'Stadium',
  hexagon: 'Hexagon',
};
