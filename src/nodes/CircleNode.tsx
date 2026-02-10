import { memo } from 'react';
import type { NodeProps } from '@xyflow/react';
import type { FlowchartNode } from '../types/node';
import { BaseFlowchartNode } from './BaseFlowchartNode';

function CircleNodeInner(props: NodeProps<FlowchartNode>) {
  return (
    <BaseFlowchartNode
      {...props}
      className="rounded-full"
      style={{ width: 80, height: 80, minWidth: 80, minHeight: 80 }}
    />
  );
}

export const CircleNode = memo(CircleNodeInner);
