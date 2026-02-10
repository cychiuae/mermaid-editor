import { useState, useCallback } from 'react';
import { useStore } from '../../store';
import type { SeqSelectionType } from '../../types/sequence';

export interface SequenceInteractions {
  handleSelect: (type: SeqSelectionType, id: string) => void;
  handleDeselect: () => void;
  handleInlineEditStart: (type: SeqSelectionType, id: string) => void;
  handleInlineEditCommit: (value: string) => void;
  handleInlineEditCancel: () => void;
  editingItem: { type: SeqSelectionType; id: string; value: string } | null;
}

export function useSequenceInteractions(): SequenceInteractions {
  const [editingItem, setEditingItem] = useState<{
    type: SeqSelectionType;
    id: string;
    value: string;
  } | null>(null);

  const setSeqSelection = useStore((s) => s.setSeqSelection);
  const seqParticipants = useStore((s) => s.seqParticipants);
  const seqEvents = useStore((s) => s.seqEvents);
  const updateParticipant = useStore((s) => s.updateParticipant);
  const updateMessage = useStore((s) => s.updateMessage);
  const updateNote = useStore((s) => s.updateNote);
  const updateFragment = useStore((s) => s.updateFragment);

  const handleSelect = useCallback(
    (type: SeqSelectionType, id: string) => {
      setSeqSelection({ type, id });
    },
    [setSeqSelection]
  );

  const handleDeselect = useCallback(() => {
    setSeqSelection(null);
    setEditingItem(null);
  }, [setSeqSelection]);

  const handleInlineEditStart = useCallback(
    (type: SeqSelectionType, id: string) => {
      let currentValue = '';

      if (type === 'participant') {
        const participant = seqParticipants.find((p) => p.id === id);
        currentValue = participant?.alias ?? '';
      } else if (type === 'message') {
        const event = seqEvents.find((e) => e.id === id);
        if (event && event.type === 'message') {
          currentValue = event.label;
        }
      } else if (type === 'note') {
        const event = seqEvents.find((e) => e.id === id);
        if (event && event.type === 'note') {
          currentValue = event.note.text;
        }
      } else if (type === 'fragment') {
        const event = seqEvents.find((e) => e.id === id);
        if (event && event.type === 'fragment') {
          currentValue = event.fragment.label;
        }
      }

      setEditingItem({ type, id, value: currentValue });
    },
    [seqParticipants, seqEvents]
  );

  const handleInlineEditCommit = useCallback(
    (value: string) => {
      if (!editingItem) return;

      const { type, id } = editingItem;

      if (type === 'participant') {
        updateParticipant(id, { alias: value });
      } else if (type === 'message') {
        updateMessage(id, { label: value });
      } else if (type === 'note') {
        updateNote(id, { text: value });
      } else if (type === 'fragment') {
        updateFragment(id, { label: value });
      }

      setEditingItem(null);
    },
    [editingItem, updateParticipant, updateMessage, updateNote, updateFragment]
  );

  const handleInlineEditCancel = useCallback(() => {
    setEditingItem(null);
  }, []);

  return {
    handleSelect,
    handleDeselect,
    handleInlineEditStart,
    handleInlineEditCommit,
    handleInlineEditCancel,
    editingItem,
  };
}
