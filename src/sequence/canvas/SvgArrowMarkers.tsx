export function SvgArrowMarkers() {
  return (
    <defs>
      {/* Solid filled arrowhead */}
      <marker
        id="marker-arrow-solid"
        markerWidth="10"
        markerHeight="10"
        refX="10"
        refY="5"
        orient="auto-start-reverse"
      >
        <path d="M0,0 L10,5 L0,10 Z" fill="#6b7280" />
      </marker>

      {/* Open arrowhead */}
      <marker
        id="marker-arrow-open"
        markerWidth="10"
        markerHeight="10"
        refX="10"
        refY="5"
        orient="auto-start-reverse"
      >
        <polyline
          points="0,0 10,5 0,10"
          fill="none"
          stroke="#6b7280"
          strokeWidth="1.5"
        />
      </marker>

      {/* Cross marker */}
      <marker
        id="marker-cross"
        markerWidth="10"
        markerHeight="10"
        refX="10"
        refY="5"
        orient="auto-start-reverse"
      >
        <line x1="3" y1="3" x2="7" y2="7" stroke="#6b7280" strokeWidth="1.5" />
        <line x1="7" y1="3" x2="3" y2="7" stroke="#6b7280" strokeWidth="1.5" />
      </marker>

      {/* Async marker (open angle bracket) */}
      <marker
        id="marker-async"
        markerWidth="10"
        markerHeight="10"
        refX="10"
        refY="5"
        orient="auto-start-reverse"
      >
        <polyline
          points="2,1 8,5 2,9"
          fill="none"
          stroke="#6b7280"
          strokeWidth="1.5"
        />
      </marker>
    </defs>
  );
}
