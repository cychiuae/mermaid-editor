import { memo } from 'react';
import type { NodeProps } from '@xyflow/react';
import type { FlowchartNode } from '../types/node';
import { BaseFlowchartNode } from './BaseFlowchartNode';

function StadiumNodeInner(props: NodeProps<FlowchartNode>) {
  return <BaseFlowchartNode {...props} className="rounded-full" />;
}

export const StadiumNode = memo(StadiumNodeInner);
