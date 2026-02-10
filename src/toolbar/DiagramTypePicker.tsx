import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GitBranch, MessageSquare } from 'lucide-react';
import { useStore } from '../store';
import type { DiagramType } from '../types/sequence';
import { ToolbarButton } from './ToolbarButton';

const DIAGRAM_TYPES: DiagramType[] = ['flowchart', 'sequence'];

const DIAGRAM_ICONS: Record<DiagramType, typeof GitBranch> = {
  flowchart: GitBranch,
  sequence: MessageSquare,
};

const DIAGRAM_LABELS: Record<DiagramType, string> = {
  flowchart: 'Flowchart',
  sequence: 'Sequence Diagram',
};

export function DiagramTypePicker() {
  const [isOpen, setIsOpen] = useState(false);
  const diagramType = useStore((s) => s.diagramType);
  const setDiagramType = useStore((s) => s.setDiagramType);
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

  const Icon = DIAGRAM_ICONS[diagramType];

  return (
    <div className="relative" ref={ref}>
      <ToolbarButton onClick={() => setIsOpen(!isOpen)} title="Diagram type">
        <Icon size={18} />
      </ToolbarButton>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full left-0 mt-1 bg-white rounded-lg shadow-lg border border-gray-200 p-1.5 z-50 min-w-[180px]"
          >
            {DIAGRAM_TYPES.map((type) => {
              const TypeIcon = DIAGRAM_ICONS[type];
              return (
                <button
                  key={type}
                  className={`flex items-center gap-2 w-full px-3 py-1.5 rounded-md transition-colors ${
                    diagramType === type
                      ? 'bg-blue-50 text-blue-700'
                      : 'hover:bg-gray-100'
                  }`}
                  onClick={() => {
                    setDiagramType(type);
                    setIsOpen(false);
                  }}
                >
                  <TypeIcon size={14} />
                  <span className="text-xs">{DIAGRAM_LABELS[type]}</span>
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
