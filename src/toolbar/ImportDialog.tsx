import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Upload, AlertTriangle } from 'lucide-react';
import { useImport } from '../hooks/use-import';
import { ToolbarButton } from './ToolbarButton';

export function ImportDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [code, setCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const { importCode } = useImport();
  const ref = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setCode('');
      setError(null);
      setTimeout(() => textareaRef.current?.focus(), 100);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const handleImport = () => {
    const result = importCode(code);
    if (result.type === 'error') {
      setError(result.message);
    } else {
      setIsOpen(false);
    }
  };

  return (
    <div className="relative" ref={ref}>
      <ToolbarButton onClick={() => setIsOpen(!isOpen)} title="Import mermaid code">
        <Upload size={18} />
      </ToolbarButton>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full right-0 mt-1 bg-white rounded-lg shadow-lg border border-gray-200 p-3 z-50 w-[360px]"
          >
            <h3 className="text-sm font-medium text-gray-900 mb-2">Import Mermaid Code</h3>

            <textarea
              ref={textareaRef}
              value={code}
              onChange={(e) => {
                setCode(e.target.value);
                setError(null);
              }}
              placeholder={"flowchart TB\n    A[\"Start\"] --> B[\"End\"]\n\nor\n\nsequenceDiagram\n    Alice->>Bob: Hello"}
              className="w-full h-40 px-3 py-2 text-xs font-mono bg-gray-50 border border-gray-200 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              spellCheck={false}
            />

            {error && (
              <div className="flex items-start gap-1.5 mt-2 text-xs text-red-600">
                <AlertTriangle size={14} className="mt-0.5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="flex items-center gap-1.5 mt-2 text-xs text-amber-600">
              <AlertTriangle size={14} className="shrink-0" />
              <span>This will replace your current diagram</span>
            </div>

            <div className="flex justify-end gap-2 mt-3">
              <button
                className="px-3 py-1.5 text-xs text-gray-600 hover:text-gray-900 rounded-md hover:bg-gray-100 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Cancel
              </button>
              <button
                className="px-3 py-1.5 text-xs text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handleImport}
                disabled={!code.trim()}
              >
                Import
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
