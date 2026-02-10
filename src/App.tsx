import { ReactFlowProvider } from '@xyflow/react';
import { Canvas } from './canvas/Canvas';
import { Toolbar } from './toolbar/Toolbar';
import { PropertiesPanel } from './properties/PropertiesPanel';
import { CodePanel } from './code-panel/CodePanel';
import { SequenceCanvas } from './sequence/canvas/SequenceCanvas';
import { useKeyboardShortcuts } from './hooks/use-keyboard-shortcuts';
import { useStore } from './store';

function AppInner() {
  useKeyboardShortcuts();
  const diagramType = useStore((s) => s.diagramType);
  const isAddingNode = useStore((s) => s.isAddingNode);
  const isAddingMessage = useStore((s) => s.isAddingMessage);
  const nodes = useStore((s) => s.nodes);
  const seqParticipants = useStore((s) => s.seqParticipants);

  return (
    <div className="flex h-screen w-screen bg-slate-50 overflow-hidden">
      <div className="relative flex-1">
        <Toolbar />

        {diagramType === 'flowchart' ? (
          <>
            <Canvas />
            {nodes.length === 0 && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="text-center">
                  <p className="text-gray-400 text-sm">
                    Click the <span className="font-medium text-gray-500">+</span> button to add nodes
                  </p>
                  <p className="text-gray-300 text-xs mt-1">
                    Then connect them by dragging between handles
                  </p>
                </div>
              </div>
            )}
            {isAddingNode && (
              <div className="absolute bottom-16 left-1/2 -translate-x-1/2 z-20 bg-blue-600 text-white text-xs px-3 py-1.5 rounded-full shadow-lg">
                Click on the canvas to place the node &middot; Press Esc to cancel
              </div>
            )}
          </>
        ) : (
          <>
            <SequenceCanvas />
            {seqParticipants.length === 0 && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="text-center">
                  <p className="text-gray-400 text-sm">
                    Click <span className="font-medium text-gray-500">Add Participant</span> to get started
                  </p>
                  <p className="text-gray-300 text-xs mt-1">
                    Then add messages between participants
                  </p>
                </div>
              </div>
            )}
            {isAddingMessage && (
              <div className="absolute bottom-16 left-1/2 -translate-x-1/2 z-20 bg-blue-600 text-white text-xs px-3 py-1.5 rounded-full shadow-lg">
                Click a participant to set the message target &middot; Press Esc to cancel
              </div>
            )}
          </>
        )}

        <PropertiesPanel />
      </div>

      <CodePanel />
    </div>
  );
}

export default function App() {
  return (
    <ReactFlowProvider>
      <AppInner />
    </ReactFlowProvider>
  );
}
