import { useCallback } from 'react';
import {
  ReactFlow,
  Background,
  BackgroundVariant,
  MarkerType,
  type ReactFlowInstance,
} from '@xyflow/react';
import { useStore } from '../store';
import { nodeTypes } from '../nodes';
import { edgeTypes } from '../edges';
import { ConnectionLine } from './ConnectionLine';
import { CanvasControls } from './CanvasControls';
import { SNAP_GRID } from '../utils/constants';
import type { FlowchartNode } from '../types/node';
import type { FlowchartEdge } from '../types/edge';

let rfInstance: ReactFlowInstance<FlowchartNode, FlowchartEdge> | null = null;

export function Canvas() {
  const nodes = useStore((s) => s.nodes);
  const edges = useStore((s) => s.edges);
  const onNodesChange = useStore((s) => s.onNodesChange);
  const onEdgesChange = useStore((s) => s.onEdgesChange);
  const onConnect = useStore((s) => s.onConnect);
  const addNode = useStore((s) => s.addNode);
  const isAddingNode = useStore((s) => s.isAddingNode);
  const activeShape = useStore((s) => s.activeShape);
  const setIsAddingNode = useStore((s) => s.setIsAddingNode);

  const handleInit = useCallback((instance: ReactFlowInstance<FlowchartNode, FlowchartEdge>) => {
    rfInstance = instance;
    if (useStore.getState().nodes.length > 0) {
      instance.fitView({ padding: 0.2 });
    }
  }, []);

  const handlePaneClick = useCallback(
    (event: React.MouseEvent) => {
      if (!isAddingNode || !rfInstance) return;

      const position = rfInstance.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      addNode(position, activeShape);
      setIsAddingNode(false);
    },
    [isAddingNode, activeShape, addNode, setIsAddingNode]
  );

  return (
    <div className={`w-full h-full ${isAddingNode ? 'cursor-crosshair' : ''}`}>
      <ReactFlow<FlowchartNode, FlowchartEdge>
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onInit={handleInit}
        onPaneClick={handlePaneClick}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        connectionLineComponent={ConnectionLine}
        snapToGrid
        snapGrid={SNAP_GRID}
        defaultEdgeOptions={{
          type: 'solid',
          markerEnd: { type: MarkerType.ArrowClosed, color: '#6b7280' },
        }}
        deleteKeyCode={null}
        multiSelectionKeyCode="Shift"
        selectionKeyCode="Shift"
        proOptions={{ hideAttribution: true }}
      >
        <Background variant={BackgroundVariant.Dots} gap={16} size={1} color="#d1d5db" />
        <CanvasControls />
      </ReactFlow>
    </div>
  );
}
