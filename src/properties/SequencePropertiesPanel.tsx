import { useStore } from '../store';
import { ParticipantProperties } from './ParticipantProperties';
import { MessageProperties } from './MessageProperties';
import { NoteProperties } from './NoteProperties';
import { FragmentProperties } from './FragmentProperties';

export function SequencePropertiesPanel() {
  const seqSelection = useStore((s) => s.seqSelection);

  if (!seqSelection) {
    return null;
  }

  switch (seqSelection.type) {
    case 'participant':
      return <ParticipantProperties />;
    case 'message':
      return <MessageProperties />;
    case 'note':
      return <NoteProperties />;
    case 'fragment':
      return <FragmentProperties />;
    default:
      return null;
  }
}
