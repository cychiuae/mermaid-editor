import { useEffect } from 'react';
import { useStore } from '../store';

export function useKeyboardShortcuts() {
  const deleteSelectedNodes = useStore((s) => s.deleteSelectedNodes);
  const deleteSelectedEdges = useStore((s) => s.deleteSelectedEdges);
  const undo = useStore((s) => s.undo);
  const redo = useStore((s) => s.redo);
  const setIsAddingNode = useStore((s) => s.setIsAddingNode);
  const diagramType = useStore((s) => s.diagramType);
  const seqSelection = useStore((s) => s.seqSelection);
  const removeEvent = useStore((s) => s.removeEvent);
  const removeParticipant = useStore((s) => s.removeParticipant);
  const removeActivation = useStore((s) => s.removeActivation);
  const setSeqSelection = useStore((s) => s.setSeqSelection);
  const setIsAddingMessage = useStore((s) => s.setIsAddingMessage);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      // Don't handle shortcuts when typing in inputs
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
        return;
      }

      if (e.key === 'Delete' || e.key === 'Backspace') {
        e.preventDefault();
        if (diagramType === 'sequence') {
          if (seqSelection) {
            if (seqSelection.type === 'participant') {
              removeParticipant(seqSelection.id);
            } else if (seqSelection.type === 'activation') {
              removeActivation(seqSelection.id);
            } else {
              removeEvent(seqSelection.id);
            }
            setSeqSelection(null);
          }
        } else {
          deleteSelectedNodes();
          deleteSelectedEdges();
        }
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
        if (diagramType === 'sequence') {
          setIsAddingMessage(false);
          setSeqSelection(null);
        } else {
          setIsAddingNode(false);
        }
      }
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [
    deleteSelectedNodes, deleteSelectedEdges, undo, redo, setIsAddingNode,
    diagramType, seqSelection, removeEvent, removeParticipant, removeActivation,
    setSeqSelection, setIsAddingMessage,
  ]);
}
