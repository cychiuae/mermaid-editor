import type { MessageLayout } from '../layout/sequence-layout';
import { SELF_MESSAGE_WIDTH, SELF_MESSAGE_HEIGHT } from '../layout/sequence-constants';

interface MessageArrowProps {
  layout: MessageLayout;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onDoubleClick: (id: string) => void;
}

export function MessageArrow({
  layout,
  isSelected,
  onSelect,
  onDoubleClick,
}: MessageArrowProps) {
  const { event, fromX, toX, y, isSelfMessage, labelX, labelY, index } = layout;

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect(event.id);
  };

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDoubleClick(event.id);
  };

  const strokeColor = isSelected ? '#3b82f6' : '#6b7280';
  const strokeWidth = isSelected ? 2 : 1.5;

  // Determine stroke style and markers
  const isDotted = event.arrowType.startsWith('dotted');
  const strokeDasharray = isDotted ? '4 4' : undefined;

  let markerEnd = '';
  let markerStart = '';

  if (event.arrowType === 'solid' || event.arrowType === 'dotted') {
    markerEnd = 'url(#marker-arrow-solid)';
  } else if (event.arrowType === 'solid-open' || event.arrowType === 'dotted-open') {
    markerEnd = 'url(#marker-arrow-open)';
  } else if (event.arrowType === 'solid-cross' || event.arrowType === 'dotted-cross') {
    markerEnd = 'url(#marker-cross)';
  } else if (event.arrowType === 'solid-async' || event.arrowType === 'dotted-async') {
    markerEnd = 'url(#marker-async)';
  } else if (event.arrowType === 'bidirectional-solid' || event.arrowType === 'bidirectional-dotted') {
    markerStart = 'url(#marker-arrow-solid)';
    markerEnd = 'url(#marker-arrow-solid)';
  }

  // Label with optional auto-number
  const labelText = index >= 0 ? `${index + 1}. ${event.label}` : event.label;

  if (isSelfMessage) {
    // Self-message: loopback arc
    const path = `M ${fromX},${y}
                  L ${fromX + SELF_MESSAGE_WIDTH},${y}
                  L ${fromX + SELF_MESSAGE_WIDTH},${y + SELF_MESSAGE_HEIGHT}
                  L ${fromX},${y + SELF_MESSAGE_HEIGHT}`;

    return (
      <g
        onClick={handleClick}
        onDoubleClick={handleDoubleClick}
        style={{ cursor: 'pointer' }}
      >
        <path
          d={path}
          fill="none"
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          strokeDasharray={strokeDasharray}
          markerEnd={markerEnd}
        />
        <text
          x={labelX}
          y={labelY - 8}
          textAnchor="middle"
          fill="#374151"
          fontSize="13"
          fontFamily="system-ui, sans-serif"
        >
          {labelText}
        </text>
      </g>
    );
  }

  // Normal message: horizontal line
  return (
    <g
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
      style={{ cursor: 'pointer' }}
    >
      <line
        x1={fromX}
        y1={y}
        x2={toX}
        y2={y}
        stroke={strokeColor}
        strokeWidth={strokeWidth}
        strokeDasharray={strokeDasharray}
        markerStart={markerStart}
        markerEnd={markerEnd}
      />
      <text
        x={labelX}
        y={labelY - 8}
        textAnchor="middle"
        fill="#374151"
        fontSize="13"
        fontFamily="system-ui, sans-serif"
      >
        {labelText}
      </text>
    </g>
  );
}
