import type { FlowchartNode } from '../types/node';
import type { FlowchartEdge } from '../types/edge';
import type { GraphDirection } from '../types/graph';
import { nodeToMermaid } from './node-syntax';
import { edgeToMermaid } from './edge-syntax';

export function generateMermaidCode(
  nodes: FlowchartNode[],
  edges: FlowchartEdge[],
  direction: GraphDirection
): string {
  if (nodes.length === 0) return `flowchart ${direction}\n`;

  const lines: string[] = [`flowchart ${direction}`];

  // Node definitions
  for (const node of nodes) {
    lines.push(nodeToMermaid(node.id, node.data.label, node.data.shape));
  }

  // Edge definitions
  if (edges.length > 0) {
    lines.push('');
    for (const edge of edges) {
      const style = edge.data?.edgeStyle ?? 'solid';
      lines.push(edgeToMermaid(edge.source, edge.target, style, edge.data?.label));
    }
  }

  return lines.join('\n') + '\n';
}
