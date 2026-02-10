import { useStore } from '../store';
import type { FlowchartEdge } from '../types/edge';
import type { EdgeStyle } from '../types/edge';
import { EDGE_STYLE_LABELS } from '../types/edge';

const STYLES: EdgeStyle[] = ['solid', 'dotted', 'thick'];

interface EdgePropertiesProps {
  edge: FlowchartEdge;
}

export function EdgeProperties({ edge }: EdgePropertiesProps) {
  const updateEdgeLabel = useStore((s) => s.updateEdgeLabel);
  const updateEdgeStyle = useStore((s) => s.updateEdgeStyle);

  return (
    <div className="space-y-3">
      <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
        Edge Properties
      </h3>

      <div>
        <label className="block text-xs text-gray-500 mb-1">Label</label>
        <input
          type="text"
          value={edge.data?.label ?? ''}
          onChange={(e) => updateEdgeLabel(edge.id, e.target.value)}
          className="w-full px-2 py-1.5 text-sm border border-gray-200 rounded-md focus:outline-none focus:border-blue-500"
          placeholder="Edge label..."
        />
      </div>

      <div>
        <label className="block text-xs text-gray-500 mb-1">Style</label>
        <div className="flex gap-1">
          {STYLES.map((style) => (
            <button
              key={style}
              className={`flex-1 px-2 py-1 text-xs rounded-md transition-colors ${
                edge.data?.edgeStyle === style
                  ? 'bg-blue-100 text-blue-700 border border-blue-200'
                  : 'bg-gray-50 text-gray-600 border border-gray-100 hover:bg-gray-100'
              }`}
              onClick={() => updateEdgeStyle(edge.id, style)}
            >
              {EDGE_STYLE_LABELS[style]}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
