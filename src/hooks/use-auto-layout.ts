import { useCallback } from 'react';
import { useReactFlow } from '@xyflow/react';
import { useStore } from '../store';
import { getLayoutedElements } from '../layout/dagre-layout';
import type { FlowchartNode } from '../types/node';
import type { FlowchartEdge } from '../types/edge';

export function useAutoLayout() {
  const { fitView } = useReactFlow();
  const setNodes = useStore((s) => s.setNodes);
  const setEdges = useStore((s) => s.setEdges);
  const pushHistory = useStore((s) => s.pushHistory);

  return useCallback(() => {
    const { nodes, edges, direction } = useStore.getState();
    if (nodes.length === 0) return;

    const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
      nodes as FlowchartNode[],
      edges as FlowchartEdge[],
      direction
    );

    setNodes(layoutedNodes);
    setEdges(layoutedEdges);
    pushHistory();

    // Fit view after layout transition
    setTimeout(() => fitView({ padding: 0.2, duration: 400 }), 50);
  }, [setNodes, setEdges, pushHistory, fitView]);
}
