import { useCallback, useState } from 'react';
import { useStore } from '../store';

interface EdgeLabelProps {
  edgeId: string;
  label?: string;
  x: number;
  y: number;
  selected?: boolean;
}

export function EdgeLabel({ edgeId, label, x, y, selected }: EdgeLabelProps) {
  const updateEdgeLabel = useStore((s) => s.updateEdgeLabel);
  const [isEditing, setIsEditing] = useState(false);

  const handleDoubleClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditing(true);
  }, []);

  const handleCommit = useCallback(
    (value: string) => {
      updateEdgeLabel(edgeId, value);
      setIsEditing(false);
    },
    [edgeId, updateEdgeLabel]
  );

  if (isEditing) {
    return (
      <div
        className="absolute nodrag nopan"
        style={{
          transform: `translate(-50%, -50%) translate(${x}px, ${y}px)`,
          pointerEvents: 'all',
        }}
      >
        <input
          autoFocus
          defaultValue={label ?? ''}
          className="bg-white border border-blue-500 rounded px-2 py-0.5 text-xs text-center outline-none shadow-sm"
          style={{ minWidth: 60 }}
          onBlur={(e) => handleCommit(e.target.value)}
          onKeyDown={(e) => {
            e.stopPropagation();
            if (e.key === 'Enter') handleCommit(e.currentTarget.value);
            if (e.key === 'Escape') setIsEditing(false);
          }}
        />
      </div>
    );
  }

  return (
    <div
      className="absolute nodrag nopan"
      style={{
        transform: `translate(-50%, -50%) translate(${x}px, ${y}px)`,
        pointerEvents: 'all',
      }}
      onDoubleClick={handleDoubleClick}
    >
      {label ? (
        <span
          className={`bg-white border rounded px-2 py-0.5 text-xs cursor-pointer hover:border-blue-400 ${
            selected ? 'border-blue-500' : 'border-gray-200'
          }`}
        >
          {label}
        </span>
      ) : selected ? (
        <span className="bg-white/80 border border-dashed border-gray-300 rounded px-2 py-0.5 text-xs text-gray-400 cursor-pointer hover:border-blue-400">
          add label
        </span>
      ) : null}
    </div>
  );
}
