import type { FragmentLayout } from '../layout/sequence-layout';
import { FRAGMENT_LABELS } from '../../types/sequence';

interface FragmentBoxProps {
  layout: FragmentLayout;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onDoubleClick: (id: string) => void;
}

export function FragmentBox({
  layout,
  isSelected,
  onSelect,
  onDoubleClick,
}: FragmentBoxProps) {
  const { event, x, y, width, height, sectionDividerYs } = layout;

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect(event.id);
  };

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDoubleClick(event.id);
  };

  const strokeColor = isSelected ? '#3b82f6' : '#9ca3af';
  const fillColor = event.fragment.color || 'transparent';
  const fillOpacity = event.fragment.color ? 0.1 : 0;

  const fragmentTypeLabel = FRAGMENT_LABELS[event.fragment.type] || event.fragment.type;

  return (
    <g
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
      style={{ cursor: 'pointer' }}
    >
      {/* Outer rectangle with dashed border */}
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        fill={fillColor}
        fillOpacity={fillOpacity}
        stroke={strokeColor}
        strokeWidth={isSelected ? 2 : 1}
        strokeDasharray="6 4"
        rx={4}
      />

      {/* Label tab in top-left corner */}
      <rect
        x={x}
        y={y}
        width={Math.min(width, 120)}
        height={24}
        fill="white"
        stroke={strokeColor}
        strokeWidth={isSelected ? 2 : 1}
        rx={4}
      />

      {/* Fragment type and label text */}
      <text
        x={x + 8}
        y={y + 16}
        fill="#374151"
        fontSize="12"
        fontWeight="600"
        fontFamily="system-ui, sans-serif"
      >
        {fragmentTypeLabel}
        {event.fragment.label && ` [${event.fragment.label}]`}
      </text>

      {/* Section dividers */}
      {sectionDividerYs.map((dividerY, i) => (
        <line
          key={i}
          x1={x}
          y1={dividerY}
          x2={x + width}
          y2={dividerY}
          stroke={strokeColor}
          strokeWidth={1}
          strokeDasharray="6 4"
        />
      ))}
    </g>
  );
}
