import { useMemo } from 'react';
import { useStore } from '../store';
import { generateMermaidCode } from '../mermaid/generate';
import { generateSequenceMermaidCode } from '../mermaid/sequence-generate';

export function useMermaidCode(): string {
  const diagramType = useStore((s) => s.diagramType);
  const nodes = useStore((s) => s.nodes);
  const edges = useStore((s) => s.edges);
  const direction = useStore((s) => s.direction);
  const seqParticipants = useStore((s) => s.seqParticipants);
  const seqEvents = useStore((s) => s.seqEvents);
  const seqActivations = useStore((s) => s.seqActivations);
  const seqAutoNumber = useStore((s) => s.seqAutoNumber);

  return useMemo(() => {
    if (diagramType === 'sequence') {
      return generateSequenceMermaidCode({
        participants: seqParticipants,
        events: seqEvents,
        activations: seqActivations,
        autoNumber: seqAutoNumber,
      });
    }
    return generateMermaidCode(nodes, edges, direction);
  }, [diagramType, nodes, edges, direction, seqParticipants, seqEvents, seqActivations, seqAutoNumber]);
}
