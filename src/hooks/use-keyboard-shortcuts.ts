import { useEffect } from 'react';
import { useStore } from '../store';

export function useKeyboardShortcuts() {
  const deleteSelectedNodes = useStore((s) => s.deleteSelectedNodes);
  const deleteSelectedEdges = useStore((s) => s.deleteSelectedEdges);
  const undo = useStore((s) => s.undo);
  const redo = useStore((s) => s.redo);
  const setIsAddingNode = useStore((s) => s.setIsAddingNode);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      // Don't handle shortcuts when typing in inputs
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
        return;
      }

      if (e.key === 'Delete' || e.key === 'Backspace') {
        e.preventDefault();
        deleteSelectedNodes();
        deleteSelectedEdges();
      }

      if (e.key === 'z' && (e.ctrlKey || e.metaKey) && !e.shiftKey) {
        e.preventDefault();
        undo();
      }

      if (
        (e.key === 'y' && (e.ctrlKey || e.metaKey)) ||
        (e.key === 'z' && (e.ctrlKey || e.metaKey) && e.shiftKey)
      ) {
        e.preventDefault();
        redo();
      }

      if (e.key === 'Escape') {
        setIsAddingNode(false);
      }
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [deleteSelectedNodes, deleteSelectedEdges, undo, redo, setIsAddingNode]);
}
