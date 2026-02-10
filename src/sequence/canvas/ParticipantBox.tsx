import type { ParticipantLayout } from '../layout/sequence-layout';
import { ACTOR_HEAD_RADIUS, ACTOR_BODY_HEIGHT } from '../layout/sequence-constants';

interface ParticipantBoxProps {
  layout: ParticipantLayout;
  isTop: boolean;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onDoubleClick: (id: string) => void;
}

export function ParticipantBox({
  layout,
  isTop,
  isSelected,
  onSelect,
  onDoubleClick,
}: ParticipantBoxProps) {
  const { participant, x, topY, bottomY, width, height } = layout;
  const y = isTop ? topY : bottomY;
  const rectX = x - width / 2;

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect(participant.id);
  };

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDoubleClick(participant.id);
  };

  if (participant.type === 'actor') {
    // Stick figure with text below
    const headY = y + ACTOR_HEAD_RADIUS + 5;
    const bodyStartY = headY + ACTOR_HEAD_RADIUS + 2;
    const bodyEndY = bodyStartY + ACTOR_BODY_HEIGHT * 0.5;
    const legsEndY = bodyEndY + ACTOR_BODY_HEIGHT * 0.5;

    return (
      <g
        onClick={handleClick}
        onDoubleClick={handleDoubleClick}
        style={{ cursor: 'pointer' }}
      >
        {/* Head */}
        <circle
          cx={x}
          cy={headY}
          r={ACTOR_HEAD_RADIUS}
          fill="white"
          stroke={isSelected ? '#3b82f6' : '#6b7280'}
          strokeWidth={isSelected ? 2 : 1}
        />
        {/* Body */}
        <line
          x1={x}
          y1={bodyStartY}
          x2={x}
          y2={bodyEndY}
          stroke={isSelected ? '#3b82f6' : '#6b7280'}
          strokeWidth={isSelected ? 2 : 1}
        />
        {/* Arms */}
        <line
          x1={x - ACTOR_HEAD_RADIUS}
          y1={bodyStartY + 10}
          x2={x + ACTOR_HEAD_RADIUS}
          y2={bodyStartY + 10}
          stroke={isSelected ? '#3b82f6' : '#6b7280'}
          strokeWidth={isSelected ? 2 : 1}
        />
        {/* Legs */}
        <line
          x1={x}
          y1={bodyEndY}
          x2={x - ACTOR_HEAD_RADIUS}
          y2={legsEndY}
          stroke={isSelected ? '#3b82f6' : '#6b7280'}
          strokeWidth={isSelected ? 2 : 1}
        />
        <line
          x1={x}
          y1={bodyEndY}
          x2={x + ACTOR_HEAD_RADIUS}
          y2={legsEndY}
          stroke={isSelected ? '#3b82f6' : '#6b7280'}
          strokeWidth={isSelected ? 2 : 1}
        />
        {/* Text below */}
        <text
          x={x}
          y={legsEndY + 16}
          textAnchor="middle"
          fill="#374151"
          fontSize="14"
          fontFamily="system-ui, sans-serif"
        >
          {participant.alias}
        </text>
      </g>
    );
  }

  // Default: participant box
  return (
    <g
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
      style={{ cursor: 'pointer' }}
    >
      <rect
        x={rectX}
        y={y}
        width={width}
        height={height}
        fill="white"
        stroke={isSelected ? '#3b82f6' : '#d1d5db'}
        strokeWidth={isSelected ? 2 : 1}
        rx={4}
      />
      <text
        x={x}
        y={y + height / 2}
        textAnchor="middle"
        dominantBaseline="middle"
        fill="#374151"
        fontSize="14"
        fontFamily="system-ui, sans-serif"
      >
        {participant.alias}
      </text>
    </g>
  );
}
