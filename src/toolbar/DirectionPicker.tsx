import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowDown, ArrowRight, ArrowUp, ArrowLeft } from 'lucide-react';
import { useStore } from '../store';
import type { GraphDirection } from '../types/graph';
import { DIRECTION_LABELS } from '../types/graph';
import { ToolbarButton } from './ToolbarButton';

const DIRECTIONS: GraphDirection[] = ['TB', 'LR', 'BT', 'RL'];

const DIRECTION_ICONS: Record<GraphDirection, typeof ArrowDown> = {
  TB: ArrowDown,
  LR: ArrowRight,
  BT: ArrowUp,
  RL: ArrowLeft,
};

export function DirectionPicker() {
  const [isOpen, setIsOpen] = useState(false);
  const direction = useStore((s) => s.direction);
  const setDirection = useStore((s) => s.setDirection);
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

  const Icon = DIRECTION_ICONS[direction];

  return (
    <div className="relative" ref={ref}>
      <ToolbarButton onClick={() => setIsOpen(!isOpen)} title="Flow direction">
        <Icon size={18} />
      </ToolbarButton>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full left-0 mt-1 bg-white rounded-lg shadow-lg border border-gray-200 p-1.5 z-50"
          >
            {DIRECTIONS.map((dir) => {
              const DirIcon = DIRECTION_ICONS[dir];
              return (
                <button
                  key={dir}
                  className={`flex items-center gap-2 w-full px-3 py-1.5 rounded-md transition-colors ${
                    direction === dir
                      ? 'bg-blue-50 text-blue-700'
                      : 'hover:bg-gray-100'
                  }`}
                  onClick={() => {
                    setDirection(dir);
                    setIsOpen(false);
                  }}
                >
                  <DirIcon size={14} />
                  <span className="text-xs">{DIRECTION_LABELS[dir]}</span>
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
