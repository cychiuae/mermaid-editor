import { memo, useCallback } from 'react';
import { Handle, Position, type NodeProps } from '@xyflow/react';
import { motion } from 'motion/react';
import type { FlowchartNode } from '../types/node';
import { useStore } from '../store';
import { InlineEditor } from './InlineEditor';

function HexagonNodeInner({ id, data, selected }: NodeProps<FlowchartNode>) {
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
        style={{ width: 140, height: 80 }}
        onDoubleClick={handleDoubleClick}
      >
        <svg
          viewBox="0 0 140 80"
          className="absolute inset-0 w-full h-full"
          style={{ filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.05))' }}
        >
          <polygon
            points="25,0 115,0 140,40 115,80 25,80 0,40"
            fill="white"
            stroke={selected ? '#3b82f6' : '#d1d5db'}
            strokeWidth="2"
          />
        </svg>
        <div className="relative z-10 text-sm px-6 text-center max-w-[90px] truncate">
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
        />
        <Handle
          type="source"
          position={Position.Bottom}
          className="!w-2.5 !h-2.5 !bg-blue-400 !border-2 !border-white"
        />
      </div>
    </motion.div>
  );
}

export const HexagonNode = memo(HexagonNodeInner);
