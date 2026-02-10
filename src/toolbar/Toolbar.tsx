import { Undo2, Redo2, Code } from 'lucide-react';
import { useStore } from '../store';
import { ToolbarButton } from './ToolbarButton';
import { DiagramTypePicker } from './DiagramTypePicker';
import { FlowchartToolbar } from './FlowchartToolbar';
import { SequenceToolbar } from './SequenceToolbar';
import { ImportDialog } from './ImportDialog';
import { ExportMenu } from './ExportMenu';

export function Toolbar() {
  const undo = useStore((s) => s.undo);
  const redo = useStore((s) => s.redo);
  const canUndo = useStore((s) => s.canUndo);
  const canRedo = useStore((s) => s.canRedo);
  const toggleCodePanel = useStore((s) => s.toggleCodePanel);
  const isCodePanelOpen = useStore((s) => s.isCodePanelOpen);
  const diagramType = useStore((s) => s.diagramType);

  return (
    <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1 bg-white rounded-xl shadow-lg border border-gray-200 px-2 py-1">
      {/* Diagram Type */}
      <DiagramTypePicker />

      <div className="w-px h-6 bg-gray-200 mx-1" />

      {/* Diagram-specific tools */}
      {diagramType === 'flowchart' ? <FlowchartToolbar /> : <SequenceToolbar />}

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

      {/* Import / Export */}
      <ImportDialog />
      <ExportMenu />
    </div>
  );
}
