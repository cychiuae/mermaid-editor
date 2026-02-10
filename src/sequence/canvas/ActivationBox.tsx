import type { ActivationLayout } from '../layout/sequence-layout';

interface ActivationBoxProps {
  layout: ActivationLayout;
}

export function ActivationBox({ layout }: ActivationBoxProps) {
  const { x, y, width, height } = layout;

  return (
    <rect
      x={x}
      y={y}
      width={width}
      height={height}
      fill="#dbeafe"
      stroke="#3b82f6"
      strokeWidth={1}
    />
  );
}
