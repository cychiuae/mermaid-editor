import { motion } from 'motion/react';
import type { ReactNode } from 'react';

interface ToolbarButtonProps {
  onClick: () => void;
  title: string;
  active?: boolean;
  disabled?: boolean;
  children: ReactNode;
}

export function ToolbarButton({
  onClick,
  title,
  active = false,
  disabled = false,
  children,
}: ToolbarButtonProps) {
  return (
    <motion.button
      whileHover={disabled ? {} : { scale: 1.05 }}
      whileTap={disabled ? {} : { scale: 0.95 }}
      className={`p-2 rounded-lg transition-colors ${
        active
          ? 'bg-blue-100 text-blue-700'
          : disabled
          ? 'text-gray-300 cursor-not-allowed'
          : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
      }`}
      onClick={onClick}
      title={title}
      disabled={disabled}
    >
      {children}
    </motion.button>
  );
}
