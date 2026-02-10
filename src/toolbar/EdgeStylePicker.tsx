import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Minus } from 'lucide-react';
import { useStore } from '../store';
import type { EdgeStyle } from '../types/edge';
import { EDGE_STYLE_LABELS } from '../types/edge';
import { ToolbarButton } from './ToolbarButton';

const STYLES: EdgeStyle[] = ['solid', 'dotted', 'thick'];

function EdgeStyleIcon({ style }: { style: EdgeStyle }) {
  const s = 40;
  const y = 12;
  switch (style) {
    case 'solid':
      return (
        <svg width={s} height={24} viewBox={`0 0 ${s} 24`}>
          <line x1={4} y1={y} x2={36} y2={y} stroke="currentColor" strokeWidth={2} />
          <polygon points="32,8 40,12 32,16" fill="currentColor" />
        </svg>
      );
    case 'dotted':
      return (
        <svg width={s} height={24} viewBox={`0 0 ${s} 24`}>
          <line x1={4} y1={y} x2={36} y2={y} stroke="currentColor" strokeWidth={2} strokeDasharray="4 3" />
          <polygon points="32,8 40,12 32,16" fill="currentColor" />
        </svg>
      );
    case 'thick':
      return (
        <svg width={s} height={24} viewBox={`0 0 ${s} 24`}>
          <line x1={4} y1={y} x2={36} y2={y} stroke="currentColor" strokeWidth={4} />
          <polygon points="32,6 40,12 32,18" fill="currentColor" />
        </svg>
      );
  }
}

export function EdgeStylePicker() {
  const [isOpen, setIsOpen] = useState(false);
  const defaultEdgeStyle = useStore((s) => s.defaultEdgeStyle);
  const setDefaultEdgeStyle = useStore((s) => s.setDefaultEdgeStyle);
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

  return (
    <div className="relative" ref={ref}>
      <ToolbarButton onClick={() => setIsOpen(!isOpen)} title="Edge style">
        <Minus size={18} />
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
            {STYLES.map((style) => (
              <button
                key={style}
                className={`flex items-center gap-2 w-full px-3 py-1.5 rounded-md transition-colors ${
                  defaultEdgeStyle === style
                    ? 'bg-blue-50 text-blue-700'
                    : 'hover:bg-gray-100'
                }`}
                onClick={() => {
                  setDefaultEdgeStyle(style);
                  setIsOpen(false);
                }}
              >
                <EdgeStyleIcon style={style} />
                <span className="text-xs">{EDGE_STYLE_LABELS[style]}</span>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
