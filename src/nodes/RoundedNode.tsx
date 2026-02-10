import { memo } from 'react';
import type { NodeProps } from '@xyflow/react';
import type { FlowchartNode } from '../types/node';
import { BaseFlowchartNode } from './BaseFlowchartNode';

function RoundedNodeInner(props: NodeProps<FlowchartNode>) {
  return <BaseFlowchartNode {...props} className="rounded-lg" />;
}

export const RoundedNode = memo(RoundedNodeInner);
