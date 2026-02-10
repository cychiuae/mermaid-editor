import { memo } from 'react';
import {
  BaseEdge,
  EdgeLabelRenderer,
  getBezierPath,
  type EdgeProps,
} from '@xyflow/react';
import type { FlowchartEdge } from '../types/edge';
import { EdgeLabel } from './EdgeLabel';

function SolidEdgeInner({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data,
  selected,
  markerEnd,
}: EdgeProps<FlowchartEdge>) {
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  return (
    <>
      <BaseEdge
        path={edgePath}
        markerEnd={markerEnd}
        style={{
          stroke: selected ? '#3b82f6' : '#6b7280',
          strokeWidth: 2,
        }}
      />
      <EdgeLabelRenderer>
        <EdgeLabel
          edgeId={id}
          label={data?.label}
          x={labelX}
          y={labelY}
          selected={selected}
        />
      </EdgeLabelRenderer>
    </>
  );
}

export const SolidEdge = memo(SolidEdgeInner);
