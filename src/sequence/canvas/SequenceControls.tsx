import { motion } from 'motion/react';
import { ZoomIn, ZoomOut, Maximize } from 'lucide-react';

interface SequenceControlsProps {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onFitView: () => void;
}

const buttonClass =
  'p-1.5 rounded-md bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-gray-900 shadow-sm';

export function SequenceControls({
  onZoomIn,
  onZoomOut,
  onFitView,
}: SequenceControlsProps) {
  return (
    <div className="absolute bottom-4 left-4 flex gap-1 z-10">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={buttonClass}
        onClick={onZoomIn}
        title="Zoom in"
      >
        <ZoomIn size={16} />
      </motion.button>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={buttonClass}
        onClick={onZoomOut}
        title="Zoom out"
      >
        <ZoomOut size={16} />
      </motion.button>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={buttonClass}
        onClick={onFitView}
        title="Fit view"
      >
        <Maximize size={16} />
      </motion.button>
    </div>
  );
}
