import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus } from 'lucide-react';
import { useStore } from '../store';
import type { NodeShape } from '../types/node';
import { NODE_SHAPE_LABELS } from '../types/node';
import { ToolbarButton } from './ToolbarButton';

const SHAPES: NodeShape[] = ['rectangle', 'rounded', 'diamond', 'circle', 'stadium', 'hexagon'];

function ShapeIcon({ shape, size = 24 }: { shape: NodeShape; size?: number }) {
  const s = size;
  const m = 2; // margin
  switch (shape) {
    case 'rectangle':
      return (
        <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`}>
          <rect x={m} y={m + 4} width={s - m * 2} height={s - m * 2 - 8} fill="none" stroke="currentColor" strokeWidth={1.5} />
        </svg>
      );
    case 'rounded':
      return (
        <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`}>
          <rect x={m} y={m + 4} width={s - m * 2} height={s - m * 2 - 8} rx={4} fill="none" stroke="currentColor" strokeWidth={1.5} />
        </svg>
      );
    case 'diamond':
      return (
        <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`}>
          <polygon points={`${s / 2},${m} ${s - m},${s / 2} ${s / 2},${s - m} ${m},${s / 2}`} fill="none" stroke="currentColor" strokeWidth={1.5} />
        </svg>
      );
    case 'circle':
      return (
        <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`}>
          <circle cx={s / 2} cy={s / 2} r={s / 2 - m} fill="none" stroke="currentColor" strokeWidth={1.5} />
        </svg>
      );
    case 'stadium':
      return (
        <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`}>
          <rect x={m} y={m + 4} width={s - m * 2} height={s - m * 2 - 8} rx={(s - m * 2 - 8) / 2} fill="none" stroke="currentColor" strokeWidth={1.5} />
        </svg>
      );
    case 'hexagon':
      return (
        <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`}>
          <polygon points={`${m + 5},${m} ${s - m - 5},${m} ${s - m},${s / 2} ${s - m - 5},${s - m} ${m + 5},${s - m} ${m},${s / 2}`} fill="none" stroke="currentColor" strokeWidth={1.5} />
        </svg>
      );
  }
}

export function ShapePicker() {
  const [isOpen, setIsOpen] = useState(false);
  const isAddingNode = useStore((s) => s.isAddingNode);
  const setActiveShape = useStore((s) => s.setActiveShape);
  const setIsAddingNode = useStore((s) => s.setIsAddingNode);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handlePickShape = (shape: NodeShape) => {
    setActiveShape(shape);
    setIsAddingNode(true);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={ref}>
      <ToolbarButton
        onClick={() => setIsOpen(!isOpen)}
        title="Add node (click canvas to place)"
        active={isAddingNode}
      >
        <Plus size={18} />
      </ToolbarButton>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full left-0 mt-1 bg-white rounded-lg shadow-lg border border-gray-200 p-2 z-50"
          >
            <div className="grid grid-cols-3 gap-1" style={{ width: 180 }}>
              {SHAPES.map((shape) => (
                <button
                  key={shape}
                  className="flex flex-col items-center gap-1 p-2 rounded-md hover:bg-gray-100 transition-colors"
                  onClick={() => handlePickShape(shape)}
                  title={NODE_SHAPE_LABELS[shape]}
                >
                  <ShapeIcon shape={shape} />
                  <span className="text-[10px] text-gray-500">
                    {NODE_SHAPE_LABELS[shape]}
                  </span>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
