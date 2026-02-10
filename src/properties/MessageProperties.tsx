import { useStore } from '../store';
import type { SeqMessage } from '../types/sequence';
import { SEQ_ARROW_LABELS, type SeqArrowType } from '../types/sequence';

const ARROW_TYPES: SeqArrowType[] = [
  'solid',
  'solid-open',
  'solid-cross',
  'solid-async',
  'dotted',
  'dotted-open',
  'dotted-cross',
  'dotted-async',
  'bidirectional-solid',
  'bidirectional-dotted',
];

export function MessageProperties() {
  const seqSelection = useStore((s) => s.seqSelection);
  const seqEvents = useStore((s) => s.seqEvents);
  const seqParticipants = useStore((s) => s.seqParticipants);
  const updateMessage = useStore((s) => s.updateMessage);

  if (!seqSelection || seqSelection.type !== 'message') {
    return null;
  }

  const message = seqEvents.find((e) => e.id === seqSelection.id && e.type === 'message') as SeqMessage | undefined;
  if (!message) {
    return null;
  }

  return (
    <div className="space-y-3">
      <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
        Message
      </h3>

      <div>
        <label className="block text-xs text-gray-500 mb-1">From</label>
        <select
          value={message.from}
          onChange={(e) => updateMessage(message.id, { from: e.target.value })}
          className="w-full px-2 py-1.5 text-sm border border-gray-200 rounded-md focus:outline-none focus:border-blue-500"
        >
          {seqParticipants.map((p) => (
            <option key={p.id} value={p.id}>
              {p.alias}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-xs text-gray-500 mb-1">To</label>
        <select
          value={message.to}
          onChange={(e) => updateMessage(message.id, { to: e.target.value })}
          className="w-full px-2 py-1.5 text-sm border border-gray-200 rounded-md focus:outline-none focus:border-blue-500"
        >
          {seqParticipants.map((p) => (
            <option key={p.id} value={p.id}>
              {p.alias}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-xs text-gray-500 mb-1">Arrow Type</label>
        <select
          value={message.arrowType}
          onChange={(e) => updateMessage(message.id, { arrowType: e.target.value as SeqArrowType })}
          className="w-full px-2 py-1.5 text-sm border border-gray-200 rounded-md focus:outline-none focus:border-blue-500"
        >
          {ARROW_TYPES.map((type) => (
            <option key={type} value={type}>
              {SEQ_ARROW_LABELS[type]}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-xs text-gray-500 mb-1">Label</label>
        <input
          type="text"
          value={message.label}
          onChange={(e) => updateMessage(message.id, { label: e.target.value })}
          className="w-full px-2 py-1.5 text-sm border border-gray-200 rounded-md focus:outline-none focus:border-blue-500"
          placeholder="Message label..."
        />
      </div>

      <div className="space-y-2">
        <label className="flex items-center gap-2 text-xs text-gray-700">
          <input
            type="checkbox"
            checked={message.activateTarget ?? false}
            onChange={(e) => updateMessage(message.id, { activateTarget: e.target.checked })}
            className="rounded border-gray-300"
          />
          Activate target
        </label>

        <label className="flex items-center gap-2 text-xs text-gray-700">
          <input
            type="checkbox"
            checked={message.deactivateSource ?? false}
            onChange={(e) => updateMessage(message.id, { deactivateSource: e.target.checked })}
            className="rounded border-gray-300"
          />
          Deactivate source
        </label>
      </div>
    </div>
  );
}
