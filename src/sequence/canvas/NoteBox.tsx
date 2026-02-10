import type { NoteLayout } from '../layout/sequence-layout';

interface NoteBoxProps {
  layout: NoteLayout;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onDoubleClick: (id: string) => void;
}

export function NoteBox({
  layout,
  isSelected,
  onSelect,
  onDoubleClick,
}: NoteBoxProps) {
  const { event, x, y, width, height } = layout;

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect(event.id);
  };

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDoubleClick(event.id);
  };

  const cornerSize = 8;
  const strokeColor = isSelected ? '#f59e0b' : '#d97706';

  // Split text into lines
  const lines = event.note.text.split('\n');

  return (
    <g
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
      style={{ cursor: 'pointer' }}
    >
      {/* Main note rectangle */}
      <rect
        x={x}
        y={y}
        width={width - cornerSize}
        height={height}
        fill="#fef9c3"
        stroke={strokeColor}
        strokeWidth={isSelected ? 2 : 1}
        rx={2}
      />

      {/* Folded corner triangle */}
      <path
        d={`M ${x + width - cornerSize},${y}
            L ${x + width},${y + cornerSize}
            L ${x + width - cornerSize},${y + cornerSize} Z`}
        fill="#fde68a"
        stroke={strokeColor}
        strokeWidth={isSelected ? 2 : 1}
      />

      {/* Folded corner edge */}
      <line
        x1={x + width - cornerSize}
        y1={y}
        x2={x + width - cornerSize}
        y2={y + cornerSize}
        stroke={strokeColor}
        strokeWidth={isSelected ? 2 : 1}
      />

      {/* Text content */}
      {lines.map((line, i) => (
        <text
          key={i}
          x={x + 10}
          y={y + 20 + i * 18}
          fill="#374151"
          fontSize="13"
          fontFamily="system-ui, sans-serif"
        >
          {line}
        </text>
      ))}
    </g>
  );
}
