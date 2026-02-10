import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';
import { useStore } from '../store';
import { useMermaidCode } from '../hooks/use-mermaid-code';
import { CopyButton } from './CopyButton';

export function CodePanel() {
  const isOpen = useStore((s) => s.isCodePanelOpen);
  const setIsCodePanelOpen = useStore((s) => s.setIsCodePanelOpen);
  const code = useMermaidCode();

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: 360, opacity: 1 }}
          exit={{ width: 0, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="h-full bg-white border-l border-gray-200 flex flex-col overflow-hidden"
        >
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
            <h2 className="text-sm font-semibold text-gray-700">Mermaid Code</h2>
            <div className="flex items-center gap-1">
              <CopyButton text={code} />
              <button
                onClick={() => setIsCodePanelOpen(false)}
                className="p-1.5 rounded-md text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
              >
                <X size={14} />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-auto p-4 code-panel">
            <pre className="text-xs text-gray-700 font-mono leading-relaxed whitespace-pre-wrap break-words">
              {code}
            </pre>
          </div>

          <div className="px-4 py-2 border-t border-gray-100 bg-gray-50">
            <p className="text-[10px] text-gray-400">
              Copy this code and paste into any Mermaid-compatible renderer
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
