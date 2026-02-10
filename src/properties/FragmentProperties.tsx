import { useStore } from '../store';
import type { SeqFragmentEvent, FragmentType } from '../types/sequence';
import { FRAGMENT_LABELS } from '../types/sequence';
import { Plus, X } from 'lucide-react';

const FRAGMENT_TYPES: FragmentType[] = ['loop', 'alt', 'opt', 'par', 'critical', 'break', 'rect'];

export function FragmentProperties() {
  const seqSelection = useStore((s) => s.seqSelection);
  const seqEvents = useStore((s) => s.seqEvents);
  const updateFragment = useStore((s) => s.updateFragment);
  const addFragmentSection = useStore((s) => s.addFragmentSection);
  const removeFragmentSection = useStore((s) => s.removeFragmentSection);

  if (!seqSelection || seqSelection.type !== 'fragment') {
    return null;
  }

  const fragmentEvent = seqEvents.find((e) => e.id === seqSelection.id && e.type === 'fragment') as SeqFragmentEvent | undefined;
  if (!fragmentEvent) {
    return null;
  }

  const { fragment } = fragmentEvent;

  return (
    <div className="space-y-3">
      <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
        Fragment
      </h3>

      <div>
        <label className="block text-xs text-gray-500 mb-1">Type</label>
        <select
          value={fragment.type}
          onChange={(e) => updateFragment(fragmentEvent.id, { type: e.target.value as FragmentType })}
          className="w-full px-2 py-1.5 text-sm border border-gray-200 rounded-md focus:outline-none focus:border-blue-500"
        >
          {FRAGMENT_TYPES.map((type) => (
            <option key={type} value={type}>
              {FRAGMENT_LABELS[type]}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-xs text-gray-500 mb-1">Label</label>
        <input
          type="text"
          value={fragment.label}
          onChange={(e) => updateFragment(fragmentEvent.id, { label: e.target.value })}
          className="w-full px-2 py-1.5 text-sm border border-gray-200 rounded-md focus:outline-none focus:border-blue-500"
          placeholder="Fragment label..."
        />
      </div>

      {fragment.type === 'rect' && (
        <div>
          <label className="block text-xs text-gray-500 mb-1">Color</label>
          <input
            type="text"
            value={fragment.color || ''}
            onChange={(e) => updateFragment(fragmentEvent.id, { color: e.target.value })}
            className="w-full px-2 py-1.5 text-sm border border-gray-200 rounded-md focus:outline-none focus:border-blue-500"
            placeholder="e.g., #f0f0f0"
          />
        </div>
      )}

      <div>
        <div className="flex items-center justify-between mb-1">
          <label className="block text-xs text-gray-500">Sections</label>
          <button
            onClick={() => addFragmentSection(fragmentEvent.id)}
            className="p-0.5 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded"
            title="Add section"
          >
            <Plus size={14} />
          </button>
        </div>
        <div className="space-y-1">
          {fragment.sections.map((section, idx) => (
            <div key={idx} className="flex items-center gap-1">
              <input
                type="text"
                value={section.label}
                onChange={(e) => {
                  const updatedSections = [...fragment.sections];
                  updatedSections[idx] = { ...section, label: e.target.value };
                  const store = useStore.getState();
                  useStore.setState({
                    seqEvents: store.seqEvents.map((ev) =>
                      ev.id === fragmentEvent.id && ev.type === 'fragment'
                        ? { ...ev, fragment: { ...ev.fragment, sections: updatedSections } }
                        : ev
                    ),
                  });
                  store.pushHistory();
                }}
                className="flex-1 px-2 py-1 text-xs border border-gray-200 rounded-md focus:outline-none focus:border-blue-500"
                placeholder={`Section ${idx + 1}`}
              />
              {fragment.sections.length > 1 && (
                <button
                  onClick={() => removeFragmentSection(fragmentEvent.id, idx)}
                  className="p-0.5 text-red-600 hover:text-red-700 hover:bg-red-50 rounded"
                  title="Remove section"
                >
                  <X size={14} />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
