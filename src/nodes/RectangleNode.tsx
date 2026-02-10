import { memo } from 'react';
import type { NodeProps } from '@xyflow/react';
import type { FlowchartNode } from '../types/node';
import { BaseFlowchartNode } from './BaseFlowchartNode';

function RectangleNodeInner(props: NodeProps<FlowchartNode>) {
  return <BaseFlowchartNode {...props} className="rounded-none" />;
}

export const RectangleNode = memo(RectangleNodeInner);
