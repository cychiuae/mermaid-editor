import { Trash2, LayoutGrid } from 'lucide-react';
import { useStore } from '../store';
import { useAutoLayout } from '../hooks/use-auto-layout';
import { ToolbarButton } from './ToolbarButton';
import { ShapePicker } from './ShapePicker';
import { EdgeStylePicker } from './EdgeStylePicker';
import { DirectionPicker } from './DirectionPicker';

export function FlowchartToolbar() {
  const deleteSelectedNodes = useStore((s) => s.deleteSelectedNodes);
  const deleteSelectedEdges = useStore((s) => s.deleteSelectedEdges);
  const autoLayout = useAutoLayout();

  const handleDelete = () => {
    deleteSelectedNodes();
    deleteSelectedEdges();
  };

  return (
    <>
      {/* Add Node */}
      <ShapePicker />

      <div className="w-px h-6 bg-gray-200 mx-1" />

      {/* Edge Style */}
      <EdgeStylePicker />

      {/* Direction */}
      <DirectionPicker />

      <div className="w-px h-6 bg-gray-200 mx-1" />

      {/* Auto Layout */}
      <ToolbarButton onClick={autoLayout} title="Auto layout">
        <LayoutGrid size={18} />
      </ToolbarButton>

      {/* Delete */}
      <ToolbarButton onClick={handleDelete} title="Delete selected (Del)">
        <Trash2 size={18} />
      </ToolbarButton>
    </>
  );
}
