import { memo, useCallback } from 'react';
import { Handle, Position, type NodeProps } from '@xyflow/react';
import { motion } from 'motion/react';
import type { FlowchartNode } from '../types/node';
import { useStore } from '../store';
import { InlineEditor } from './InlineEditor';

interface BaseFlowchartNodeProps extends NodeProps<FlowchartNode> {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

function BaseFlowchartNodeInner({
  id,
  data,
  selected,
  className = '',
  style,
  children,
}: BaseFlowchartNodeProps) {
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
        data.isDeleting
          ? { scale: 0, opacity: 0 }
          : { scale: 1, opacity: 1 }
      }
      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      className={`relative ${selected ? 'node-selected' : ''}`}
    >
      <div
        className={`flex items-center justify-center bg-white border-2 text-sm select-none cursor-grab active:cursor-grabbing ${
          selected ? 'border-blue-500' : 'border-gray-300'
        } ${className}`}
        style={{ minWidth: 100, minHeight: 40, ...style }}
        onDoubleClick={handleDoubleClick}
      >
        {children}
        {data.isEditing ? (
          <InlineEditor
            value={data.label}
            onCommit={handleCommit}
            onCancel={handleCancel}
          />
        ) : (
          <span className="px-3 py-1.5 truncate max-w-[180px]">{data.label}</span>
        )}
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

export const BaseFlowchartNode = memo(BaseFlowchartNodeInner);
