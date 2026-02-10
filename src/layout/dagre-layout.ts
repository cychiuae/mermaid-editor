import dagre from '@dagrejs/dagre';
import type { FlowchartNode } from '../types/node';
import type { FlowchartEdge } from '../types/edge';
import type { GraphDirection } from '../types/graph';

const NODE_WIDTH = 150;
const NODE_HEIGHT = 60;

export function getLayoutedElements(
  nodes: FlowchartNode[],
  edges: FlowchartEdge[],
  direction: GraphDirection
): { nodes: FlowchartNode[]; edges: FlowchartEdge[] } {
  if (nodes.length === 0) return { nodes, edges };

  const g = new dagre.graphlib.Graph();
  g.setDefaultEdgeLabel(() => ({}));
  g.setGraph({
    rankdir: direction,
    nodesep: 50,
    ranksep: 80,
    edgesep: 20,
  });

  nodes.forEach((node) => {
    const width = node.data.shape === 'diamond' ? 120 : NODE_WIDTH;
    const height = node.data.shape === 'diamond' ? 120 :
                   node.data.shape === 'circle' ? 80 : NODE_HEIGHT;
    g.setNode(node.id, { width, height });
  });

  edges.forEach((edge) => {
    g.setEdge(edge.source, edge.target);
  });

  dagre.layout(g);

  const layoutedNodes = nodes.map((node) => {
    const dagreNode = g.node(node.id);
    const width = node.data.shape === 'diamond' ? 120 : NODE_WIDTH;
    const height = node.data.shape === 'diamond' ? 120 :
                   node.data.shape === 'circle' ? 80 : NODE_HEIGHT;
    return {
      ...node,
      position: {
        x: dagreNode.x - width / 2,
        y: dagreNode.y - height / 2,
      },
    };
  });

  return { nodes: layoutedNodes, edges };
}
