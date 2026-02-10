import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useStore } from '../store';
import type { SeqArrowType } from '../types/sequence';
import { SEQ_ARROW_LABELS } from '../types/sequence';
import { ToolbarButton } from './ToolbarButton';

const ARROW_TYPES: SeqArrowType[] = [
  'solid',
  'solid-open',
  'solid-cross',
  'solid-async',
  'dotted',
  'dotted-open',
  'dotted-cross',
  'dotted-async',
  'bidirectional-solid',
  'bidirectional-dotted',
];

function ArrowPreview({ type }: { type: SeqArrowType }) {
  const isDotted = type.includes('dotted');
  const strokeDasharray = isDotted ? '3 2' : undefined;

  if (type === 'bidirectional-solid' || type === 'bidirectional-dotted') {
    return (
      <svg width={24} height={12} viewBox="0 0 24 12">
        <line x1={4} y1={6} x2={20} y2={6} stroke="currentColor" strokeWidth={1.5} strokeDasharray={strokeDasharray} />
        <polygon points="7,3 3,6 7,9" fill="currentColor" />
        <polygon points="17,3 21,6 17,9" fill="currentColor" />
      </svg>
    );
  }

  if (type.includes('cross')) {
    return (
      <svg width={24} height={12} viewBox="0 0 24 12">
        <line x1={2} y1={6} x2={18} y2={6} stroke="currentColor" strokeWidth={1.5} strokeDasharray={strokeDasharray} />
        <line x1={18} y1={2} x2={22} y2={10} stroke="currentColor" strokeWidth={1.5} />
        <line x1={18} y1={10} x2={22} y2={2} stroke="currentColor" strokeWidth={1.5} />
      </svg>
    );
  }

  if (type.includes('async')) {
    return (
      <svg width={24} height={12} viewBox="0 0 24 12">
        <line x1={2} y1={6} x2={18} y2={6} stroke="currentColor" strokeWidth={1.5} strokeDasharray={strokeDasharray} />
        <polyline points="18,3 21,6 18,9" fill="none" stroke="currentColor" strokeWidth={1.5} />
      </svg>
    );
  }

  if (type.includes('open')) {
    return (
      <svg width={24} height={12} viewBox="0 0 24 12">
        <line x1={2} y1={6} x2={21} y2={6} stroke="currentColor" strokeWidth={1.5} strokeDasharray={strokeDasharray} />
      </svg>
    );
  }

  // Default solid arrow
  return (
    <svg width={24} height={12} viewBox="0 0 24 12">
      <line x1={2} y1={6} x2={18} y2={6} stroke="currentColor" strokeWidth={1.5} strokeDasharray={strokeDasharray} />
      <polygon points="17,3 21,6 17,9" fill="currentColor" />
    </svg>
  );
}

export function SeqArrowTypePicker() {
  const [isOpen, setIsOpen] = useState(false);
  const seqActiveArrowType = useStore((s) => s.seqActiveArrowType);
  const setSeqActiveArrowType = useStore((s) => s.setSeqActiveArrowType);
  const setIsAddingMessage = useStore((s) => s.setIsAddingMessage);
  const isAddingMessage = useStore((s) => s.isAddingMessage);
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

  const handleSelectArrow = (type: SeqArrowType) => {
    setSeqActiveArrowType(type);
    setIsAddingMessage(true);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={ref}>
      <ToolbarButton
        onClick={() => setIsOpen(!isOpen)}
        title="Add message (click participant to start)"
        active={isAddingMessage}
      >
        <ArrowPreview type={seqActiveArrowType} />
      </ToolbarButton>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full left-0 mt-1 bg-white rounded-lg shadow-lg border border-gray-200 p-1.5 z-50 min-w-[200px]"
          >
            {ARROW_TYPES.map((type) => (
              <button
                key={type}
                className={`flex items-center gap-2 w-full px-3 py-1.5 rounded-md transition-colors ${
                  seqActiveArrowType === type
                    ? 'bg-blue-50 text-blue-700'
                    : 'hover:bg-gray-100'
                }`}
                onClick={() => handleSelectArrow(type)}
              >
                <ArrowPreview type={type} />
                <span className="text-xs">{SEQ_ARROW_LABELS[type]}</span>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
