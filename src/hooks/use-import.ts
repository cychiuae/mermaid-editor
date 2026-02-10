import { useCallback } from 'react';
import { useStore } from '../store';
import { parseMermaidCode, type ParseResult } from '../mermaid/parse';
import { getLayoutedElements } from '../layout/dagre-layout';
import { syncCountersFromState, generateEdgeId } from '../utils/id-generator';
import type { FlowchartNode } from '../types/node';
import type { FlowchartEdge } from '../types/edge';

export function useImport() {
  const setNodes = useStore((s) => s.setNodes);
  const setEdges = useStore((s) => s.setEdges);
  const setDirection = useStore((s) => s.setDirection);
  const setDiagramType = useStore((s) => s.setDiagramType);
  const setSequenceData = useStore((s) => s.setSequenceData);
  const pushHistory = useStore((s) => s.pushHistory);

  const importCode = useCallback(
    (code: string): ParseResult => {
      const result = parseMermaidCode(code);
      if (result.type === 'error') return result;

      if (result.type === 'flowchart') {
        const { direction, nodes: parsedNodes, edges: parsedEdges } = result.data;

        // Build FlowchartNode[] from parsed nodes
        const nodes: FlowchartNode[] = parsedNodes.map((pn) => ({
          id: pn.id,
          type: pn.shape,
          position: { x: 0, y: 0 }, // dagre will set positions
          data: { label: pn.label, shape: pn.shape, isEditing: false, isDeleting: false },
        }));

        // Build FlowchartEdge[] from parsed edges
        const edges: FlowchartEdge[] = parsedEdges.map((pe) => ({
          id: generateEdgeId(),
          source: pe.source,
          target: pe.target,
          type: pe.style,
          data: { edgeStyle: pe.style, label: pe.label },
        }));

        // Auto-layout
        const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
          nodes,
          edges,
          direction
        );

        // Apply to store
        setDiagramType('flowchart');
        setNodes(layoutedNodes);
        setEdges(layoutedEdges);
        setDirection(direction);

        // Sync counters
        syncCountersFromState({
          nodes: layoutedNodes,
          edges: layoutedEdges,
          seqParticipants: [],
          seqEvents: [],
          seqActivations: [],
        });
      } else {
        // sequence
        const { participants, events, activations, autoNumber } = result.data;

        setDiagramType('sequence');
        setNodes([]);
        setEdges([]);
        setSequenceData({ participants, events, activations, autoNumber });

        syncCountersFromState({
          nodes: [],
          edges: [],
          seqParticipants: participants,
          seqEvents: events,
          seqActivations: activations,
        });
      }

      // Clear history and push initial snapshot
      useStore.setState({ past: [], future: [] });
      pushHistory();

      return result;
    },
    [setNodes, setEdges, setDirection, setDiagramType, setSequenceData, pushHistory]
  );

  return { importCode };
}
