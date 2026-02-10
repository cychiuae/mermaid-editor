import { motion, AnimatePresence } from 'motion/react';
import { useStore } from '../store';
import type { FlowchartNode } from '../types/node';
import type { FlowchartEdge } from '../types/edge';
import { NodeProperties } from './NodeProperties';
import { EdgeProperties } from './EdgeProperties';
import { SequencePropertiesPanel } from './SequencePropertiesPanel';

export function PropertiesPanel() {
  const diagramType = useStore((s) => s.diagramType);
  const nodes = useStore((s) => s.nodes);
  const edges = useStore((s) => s.edges);
  const seqSelection = useStore((s) => s.seqSelection);

  // Determine if there's a selection based on diagram type
  const hasSelection =
    diagramType === 'flowchart'
      ? nodes.some((n) => n.selected) || edges.some((e) => e.selected)
      : seqSelection !== null;

  // For flowchart, get selected elements
  const selectedNode = diagramType === 'flowchart'
    ? nodes.find((n) => n.selected) as FlowchartNode | undefined
    : undefined;
  const selectedEdge = diagramType === 'flowchart'
    ? edges.find((e) => e.selected) as FlowchartEdge | undefined
    : undefined;

  return (
    <AnimatePresence>
      {hasSelection && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
          className="absolute top-16 right-4 z-20 w-56 bg-white rounded-xl shadow-lg border border-gray-200 p-4"
        >
          {diagramType === 'flowchart' && (
            <>
              {selectedNode && <NodeProperties node={selectedNode} />}
              {!selectedNode && selectedEdge && <EdgeProperties edge={selectedEdge} />}
            </>
          )}
          {diagramType === 'sequence' && <SequencePropertiesPanel />}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
