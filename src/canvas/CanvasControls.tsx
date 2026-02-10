import { useReactFlow } from '@xyflow/react';
import { motion } from 'motion/react';
import { ZoomIn, ZoomOut, Maximize } from 'lucide-react';

const buttonClass =
  'p-1.5 rounded-md bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-gray-900 shadow-sm';

export function CanvasControls() {
  const { zoomIn, zoomOut, fitView } = useReactFlow();

  return (
    <div className="absolute bottom-4 left-4 flex gap-1 z-10">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={buttonClass}
        onClick={() => zoomIn({ duration: 200 })}
        title="Zoom in"
      >
        <ZoomIn size={16} />
      </motion.button>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={buttonClass}
        onClick={() => zoomOut({ duration: 200 })}
        title="Zoom out"
      >
        <ZoomOut size={16} />
      </motion.button>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={buttonClass}
        onClick={() => fitView({ padding: 0.2, duration: 400 })}
        title="Fit view"
      >
        <Maximize size={16} />
      </motion.button>
    </div>
  );
}
