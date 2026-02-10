import { memo, useCallback } from 'react';
import { Handle, Position, type NodeProps } from '@xyflow/react';
import { motion } from 'motion/react';
import type { FlowchartNode } from '../types/node';
import { useStore } from '../store';
import { InlineEditor } from './InlineEditor';

function DiamondNodeInner({ id, data, selected }: NodeProps<FlowchartNode>) {
  const updateNodeLabel = useStore((s) => s.updateNodeLabel);
  const setNodeEditing = useStore((s) => s.setNodeEditing);

  const handleDoubleClick = useCallback(() => {
    setNodeEditing(id, true);
  }, [id, setNodeEditing]);

  const handleCommit = useCallback(
    (value: string) => {
      updateNodeLabel(id, value || 'Node');
      setNodeEditing(id, false);
    },
    [id, updateNodeLabel, setNodeEditing]
  );

  const handleCancel = useCallback(() => {
    setNodeEditing(id, false);
  }, [id, setNodeEditing]);

  return (
    <motion.div
      initial={{ scale: 0.5, opacity: 0 }}
      animate={
        data.isDeleting ? { scale: 0, opacity: 0 } : { scale: 1, opacity: 1 }
      }
      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      className={`relative ${selected ? 'node-selected' : ''}`}
    >
      <div
        className="flex items-center justify-center select-none cursor-grab active:cursor-grabbing"
        style={{ width: 120, height: 120 }}
        onDoubleClick={handleDoubleClick}
      >
        <svg
          viewBox="0 0 120 120"
          className="absolute inset-0 w-full h-full"
          style={{ filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.05))' }}
        >
          <polygon
            points="60,5 115,60 60,115 5,60"
            fill="white"
            stroke={selected ? '#3b82f6' : '#d1d5db'}
            strokeWidth="2"
          />
        </svg>
        <div className="relative z-10 text-sm px-2 text-center max-w-[70px] truncate">
          {data.isEditing ? (
            <InlineEditor
              value={data.label}
              onCommit={handleCommit}
              onCancel={handleCancel}
            />
          ) : (
            data.label
          )}
        </div>
        <Handle
          type="target"
          position={Position.Top}
          className="!w-2.5 !h-2.5 !bg-blue-400 !border-2 !border-white"
          style={{ top: -2 }}
        />
        <Handle
          type="source"
          position={Position.Bottom}
          className="!w-2.5 !h-2.5 !bg-blue-400 !border-2 !border-white"
          style={{ bottom: -2 }}
        />
      </div>
    </motion.div>
  );
}

export const DiamondNode = memo(DiamondNodeInner);
