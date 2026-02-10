import { useStore } from '../store';

export function ParticipantProperties() {
  const seqSelection = useStore((s) => s.seqSelection);
  const seqParticipants = useStore((s) => s.seqParticipants);
  const updateParticipant = useStore((s) => s.updateParticipant);

  if (!seqSelection || seqSelection.type !== 'participant') {
    return null;
  }

  const participant = seqParticipants.find((p) => p.id === seqSelection.id);
  if (!participant) {
    return null;
  }

  return (
    <div className="space-y-3">
      <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
        Participant
      </h3>

      <div>
        <label className="block text-xs text-gray-500 mb-1">Alias</label>
        <input
          type="text"
          value={participant.alias}
          onChange={(e) => updateParticipant(participant.id, { alias: e.target.value })}
          className="w-full px-2 py-1.5 text-sm border border-gray-200 rounded-md focus:outline-none focus:border-blue-500"
          placeholder="Participant alias..."
        />
      </div>

      <div>
        <label className="block text-xs text-gray-500 mb-1">Type</label>
        <div className="flex gap-1">
          <button
            className={`flex-1 px-2 py-1 text-xs rounded-md transition-colors ${
              participant.type === 'participant'
                ? 'bg-blue-100 text-blue-700 border border-blue-200'
                : 'bg-gray-50 text-gray-600 border border-gray-100 hover:bg-gray-100'
            }`}
            onClick={() => updateParticipant(participant.id, { type: 'participant' })}
          >
            Participant
          </button>
          <button
            className={`flex-1 px-2 py-1 text-xs rounded-md transition-colors ${
              participant.type === 'actor'
                ? 'bg-blue-100 text-blue-700 border border-blue-200'
                : 'bg-gray-50 text-gray-600 border border-gray-100 hover:bg-gray-100'
            }`}
            onClick={() => updateParticipant(participant.id, { type: 'actor' })}
          >
            Actor
          </button>
        </div>
      </div>
    </div>
  );
}
