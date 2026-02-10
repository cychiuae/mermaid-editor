import type { LifelineLayout } from '../layout/sequence-layout';

interface LifelineProps {
  layout: LifelineLayout;
}

export function Lifeline({ layout }: LifelineProps) {
  const { x, topY, bottomY } = layout;

  return (
    <line
      x1={x}
      y1={topY}
      x2={x}
      y2={bottomY}
      stroke="#d1d5db"
      strokeDasharray="6 4"
      strokeWidth={1}
    />
  );
}
