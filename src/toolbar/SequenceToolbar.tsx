import { UserPlus, StickyNote, ListOrdered, Trash2 } from 'lucide-react';
import { useStore } from '../store';
import { ToolbarButton } from './ToolbarButton';
import { SeqArrowTypePicker } from './SeqArrowTypePicker';
import { SeqFragmentPicker } from './SeqFragmentPicker';

export function SequenceToolbar() {
  const addParticipant = useStore((s) => s.addParticipant);
  const addNote = useStore((s) => s.addNote);
  const seqParticipants = useStore((s) => s.seqParticipants);
  const seqAutoNumber = useStore((s) => s.seqAutoNumber);
  const toggleSeqAutoNumber = useStore((s) => s.toggleSeqAutoNumber);
  const seqSelection = useStore((s) => s.seqSelection);
  const removeParticipant = useStore((s) => s.removeParticipant);
  const removeEvent = useStore((s) => s.removeEvent);
  const removeActivation = useStore((s) => s.removeActivation);

  const handleAddNote = () => {
    if (seqParticipants.length > 0) {
      addNote('over', [seqParticipants[0].id]);
    }
  };

  const handleDelete = () => {
    if (!seqSelection) return;

    switch (seqSelection.type) {
      case 'participant':
        removeParticipant(seqSelection.id);
        break;
      case 'message':
      case 'note':
      case 'fragment':
        removeEvent(seqSelection.id);
        break;
      case 'activation':
        removeActivation(seqSelection.id);
        break;
    }
  };

  const canDelete = seqSelection !== null;

  return (
    <>
      {/* Add Participant */}
      <ToolbarButton onClick={() => addParticipant()} title="Add participant">
        <UserPlus size={18} />
      </ToolbarButton>

      <div className="w-px h-6 bg-gray-200 mx-1" />

      {/* Add Message */}
      <SeqArrowTypePicker />

      {/* Add Note */}
      <ToolbarButton
        onClick={handleAddNote}
        title="Add note"
        disabled={seqParticipants.length === 0}
      >
        <StickyNote size={18} />
      </ToolbarButton>

      {/* Add Fragment */}
      <SeqFragmentPicker />

      <div className="w-px h-6 bg-gray-200 mx-1" />

      {/* Toggle Auto-number */}
      <ToolbarButton
        onClick={toggleSeqAutoNumber}
        title="Toggle auto-number"
        active={seqAutoNumber}
      >
        <ListOrdered size={18} />
      </ToolbarButton>

      {/* Delete */}
      <ToolbarButton
        onClick={handleDelete}
        title="Delete selected"
        disabled={!canDelete}
      >
        <Trash2 size={18} />
      </ToolbarButton>
    </>
  );
}
