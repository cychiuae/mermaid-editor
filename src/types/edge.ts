import type { Edge } from '@xyflow/react';

export type EdgeStyle = 'solid' | 'dotted' | 'thick';

export type FlowchartEdgeData = {
  label?: string;
  edgeStyle: EdgeStyle;
};

export type FlowchartEdge = Edge<FlowchartEdgeData>;

export const EDGE_STYLE_LABELS: Record<EdgeStyle, string> = {
  solid: 'Solid',
  dotted: 'Dotted',
  thick: 'Thick',
};
