import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { LayoutList } from 'lucide-react';
import { useStore } from '../store';
import type { FragmentType } from '../types/sequence';
import { FRAGMENT_LABELS } from '../types/sequence';
import { ToolbarButton } from './ToolbarButton';

const FRAGMENT_TYPES: FragmentType[] = ['loop', 'alt', 'opt', 'par', 'critical', 'break', 'rect'];

export function SeqFragmentPicker() {
  const [isOpen, setIsOpen] = useState(false);
  const addFragment = useStore((s) => s.addFragment);
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

  const handleSelectFragment = (type: FragmentType) => {
    addFragment(type);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={ref}>
      <ToolbarButton onClick={() => setIsOpen(!isOpen)} title="Add fragment">
        <LayoutList size={18} />
      </ToolbarButton>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full left-0 mt-1 bg-white rounded-lg shadow-lg border border-gray-200 p-1.5 z-50 min-w-[150px]"
          >
            {FRAGMENT_TYPES.map((type) => (
              <button
                key={type}
                className="flex items-center gap-2 w-full px-3 py-1.5 rounded-md hover:bg-gray-100 transition-colors"
                onClick={() => handleSelectFragment(type)}
              >
                <span className="text-xs">{FRAGMENT_LABELS[type]}</span>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
