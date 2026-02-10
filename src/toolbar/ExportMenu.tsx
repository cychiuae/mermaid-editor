import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Download, FileText, Image, FileCode } from 'lucide-react';
import { useExport } from '../hooks/use-export';
import { ToolbarButton } from './ToolbarButton';

export function ExportMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const { exportMermaid, exportSvg, exportPng } = useExport();
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
      <ToolbarButton onClick={() => setIsOpen(!isOpen)} title="Export">
        <Download size={18} />
      </ToolbarButton>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full right-0 mt-1 bg-white rounded-lg shadow-lg border border-gray-200 p-1.5 z-50 min-w-[160px]"
          >
            <button
              className="flex items-center gap-2 w-full px-3 py-1.5 rounded-md hover:bg-gray-100 transition-colors"
              onClick={() => {
                exportMermaid();
                setIsOpen(false);
              }}
            >
              <FileCode size={14} />
              <span className="text-xs">Mermaid (.mmd)</span>
            </button>
            <button
              className="flex items-center gap-2 w-full px-3 py-1.5 rounded-md hover:bg-gray-100 transition-colors"
              onClick={() => {
                exportSvg();
                setIsOpen(false);
              }}
            >
              <FileText size={14} />
              <span className="text-xs">SVG (.svg)</span>
            </button>
            <button
              className="flex items-center gap-2 w-full px-3 py-1.5 rounded-md hover:bg-gray-100 transition-colors"
              onClick={() => {
                exportPng();
                setIsOpen(false);
              }}
            >
              <Image size={14} />
              <span className="text-xs">PNG (.png)</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
