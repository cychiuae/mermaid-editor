import { useStore } from '../store';
import type { SeqNoteEvent, NotePosition } from '../types/sequence';

const NOTE_POSITIONS: NotePosition[] = ['left of', 'right of', 'over'];

const POSITION_LABELS: Record<NotePosition, string> = {
  'left of': 'Left of',
  'right of': 'Right of',
  'over': 'Over',
};

export function NoteProperties() {
  const seqSelection = useStore((s) => s.seqSelection);
  const seqEvents = useStore((s) => s.seqEvents);
  const seqParticipants = useStore((s) => s.seqParticipants);
  const updateNote = useStore((s) => s.updateNote);

  if (!seqSelection || seqSelection.type !== 'note') {
    return null;
  }

  const noteEvent = seqEvents.find((e) => e.id === seqSelection.id && e.type === 'note') as SeqNoteEvent | undefined;
  if (!noteEvent) {
    return null;
  }

  const { note } = noteEvent;

  return (
    <div className="space-y-3">
      <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
        Note
      </h3>

      <div>
        <label className="block text-xs text-gray-500 mb-1">Position</label>
        <div className="flex gap-1">
          {NOTE_POSITIONS.map((position) => (
            <button
              key={position}
              className={`flex-1 px-2 py-1 text-xs rounded-md transition-colors ${
                note.position === position
                  ? 'bg-blue-100 text-blue-700 border border-blue-200'
                  : 'bg-gray-50 text-gray-600 border border-gray-100 hover:bg-gray-100'
              }`}
              onClick={() => updateNote(noteEvent.id, { position })}
            >
              {POSITION_LABELS[position]}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-xs text-gray-500 mb-1">
          {note.position === 'over' ? 'Participants' : 'Participant'}
        </label>
        {note.position === 'over' ? (
          <div className="space-y-1">
            <select
              value={note.participants[0] || ''}
              onChange={(e) => {
                const newParticipants = [e.target.value];
                if (note.participants[1]) {
                  newParticipants.push(note.participants[1]);
                }
                updateNote(noteEvent.id, { participants: newParticipants });
              }}
              className="w-full px-2 py-1.5 text-sm border border-gray-200 rounded-md focus:outline-none focus:border-blue-500"
            >
              <option value="">Select first participant</option>
              {seqParticipants.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.alias}
                </option>
              ))}
            </select>
            <select
              value={note.participants[1] || ''}
              onChange={(e) => {
                if (e.target.value) {
                  updateNote(noteEvent.id, { participants: [note.participants[0], e.target.value] });
                } else {
                  updateNote(noteEvent.id, { participants: [note.participants[0]] });
                }
              }}
              className="w-full px-2 py-1.5 text-sm border border-gray-200 rounded-md focus:outline-none focus:border-blue-500"
            >
              <option value="">Select second participant (optional)</option>
              {seqParticipants.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.alias}
                </option>
              ))}
            </select>
          </div>
        ) : (
          <select
            value={note.participants[0] || ''}
            onChange={(e) => updateNote(noteEvent.id, { participants: [e.target.value] })}
            className="w-full px-2 py-1.5 text-sm border border-gray-200 rounded-md focus:outline-none focus:border-blue-500"
          >
            <option value="">Select participant</option>
            {seqParticipants.map((p) => (
              <option key={p.id} value={p.id}>
                {p.alias}
              </option>
            ))}
          </select>
        )}
      </div>

      <div>
        <label className="block text-xs text-gray-500 mb-1">Text</label>
        <textarea
          value={note.text}
          onChange={(e) => updateNote(noteEvent.id, { text: e.target.value })}
          className="w-full px-2 py-1.5 text-sm border border-gray-200 rounded-md focus:outline-none focus:border-blue-500 resize-none"
          rows={3}
          placeholder="Note text..."
        />
      </div>
    </div>
  );
}
