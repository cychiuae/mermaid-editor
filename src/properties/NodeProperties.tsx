import { useStore } from '../store';
import type { FlowchartNode } from '../types/node';
import type { NodeShape } from '../types/node';
import { NODE_SHAPE_LABELS } from '../types/node';

const SHAPES: NodeShape[] = ['rectangle', 'rounded', 'diamond', 'circle', 'stadium', 'hexagon'];

interface NodePropertiesProps {
  node: FlowchartNode;
}

export function NodeProperties({ node }: NodePropertiesProps) {
  const updateNodeLabel = useStore((s) => s.updateNodeLabel);
  const updateNodeShape = useStore((s) => s.updateNodeShape);

  return (
    <div className="space-y-3">
      <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
        Node Properties
      </h3>

      <div>
        <label className="block text-xs text-gray-500 mb-1">Label</label>
        <input
          type="text"
          value={node.data.label}
          onChange={(e) => updateNodeLabel(node.id, e.target.value)}
          className="w-full px-2 py-1.5 text-sm border border-gray-200 rounded-md focus:outline-none focus:border-blue-500"
        />
      </div>

      <div>
        <label className="block text-xs text-gray-500 mb-1">Shape</label>
        <div className="grid grid-cols-2 gap-1">
          {SHAPES.map((shape) => (
            <button
              key={shape}
              className={`px-2 py-1 text-xs rounded-md transition-colors ${
                node.data.shape === shape
                  ? 'bg-blue-100 text-blue-700 border border-blue-200'
                  : 'bg-gray-50 text-gray-600 border border-gray-100 hover:bg-gray-100'
              }`}
              onClick={() => updateNodeShape(node.id, shape)}
            >
              {NODE_SHAPE_LABELS[shape]}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
