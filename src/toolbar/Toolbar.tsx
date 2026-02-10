import {
  Trash2,
  Undo2,
  Redo2,
  LayoutGrid,
  Code,
} from 'lucide-react';
import { useStore } from '../store';
import { useAutoLayout } from '../hooks/use-auto-layout';
import { ToolbarButton } from './ToolbarButton';
import { ShapePicker } from './ShapePicker';
import { EdgeStylePicker } from './EdgeStylePicker';
import { DirectionPicker } from './DirectionPicker';
import { ExportMenu } from './ExportMenu';

export function Toolbar() {
  const deleteSelectedNodes = useStore((s) => s.deleteSelectedNodes);
  const deleteSelectedEdges = useStore((s) => s.deleteSelectedEdges);
  const undo = useStore((s) => s.undo);
  const redo = useStore((s) => s.redo);
  const canUndo = useStore((s) => s.canUndo);
  const canRedo = useStore((s) => s.canRedo);
  const toggleCodePanel = useStore((s) => s.toggleCodePanel);
  const isCodePanelOpen = useStore((s) => s.isCodePanelOpen);
  const autoLayout = useAutoLayout();

  const handleDelete = () => {
    deleteSelectedNodes();
    deleteSelectedEdges();
  };

  return (
    <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1 bg-white rounded-xl shadow-lg border border-gray-200 px-2 py-1">
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

      <div className="w-px h-6 bg-gray-200 mx-1" />

      {/* Undo / Redo */}
      <ToolbarButton onClick={undo} title="Undo (Ctrl+Z)" disabled={!canUndo()}>
        <Undo2 size={18} />
      </ToolbarButton>
      <ToolbarButton onClick={redo} title="Redo (Ctrl+Y)" disabled={!canRedo()}>
        <Redo2 size={18} />
      </ToolbarButton>

      <div className="w-px h-6 bg-gray-200 mx-1" />

      {/* Code Panel Toggle */}
      <ToolbarButton
        onClick={toggleCodePanel}
        title="Toggle code panel"
        active={isCodePanelOpen}
      >
        <Code size={18} />
      </ToolbarButton>

      {/* Export */}
      <ExportMenu />
    </div>
  );
}
