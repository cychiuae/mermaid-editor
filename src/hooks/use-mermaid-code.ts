import { useMemo } from 'react';
import { useStore } from '../store';
import { generateMermaidCode } from '../mermaid/generate';

export function useMermaidCode(): string {
  const nodes = useStore((s) => s.nodes);
  const edges = useStore((s) => s.edges);
  const direction = useStore((s) => s.direction);

  return useMemo(
    () => generateMermaidCode(nodes, edges, direction),
    [nodes, edges, direction]
  );
}
