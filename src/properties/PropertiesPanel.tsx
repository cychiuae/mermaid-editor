import { motion, AnimatePresence } from 'motion/react';
import { useStore } from '../store';
import type { FlowchartNode } from '../types/node';
import type { FlowchartEdge } from '../types/edge';
import { NodeProperties } from './NodeProperties';
import { EdgeProperties } from './EdgeProperties';

export function PropertiesPanel() {
  const nodes = useStore((s) => s.nodes);
  const edges = useStore((s) => s.edges);

  const selectedNode = nodes.find((n) => n.selected) as FlowchartNode | undefined;
  const selectedEdge = edges.find((e) => e.selected) as FlowchartEdge | undefined;

  const hasSelection = selectedNode || selectedEdge;

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
          {selectedNode && <NodeProperties node={selectedNode} />}
          {!selectedNode && selectedEdge && <EdgeProperties edge={selectedEdge} />}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
