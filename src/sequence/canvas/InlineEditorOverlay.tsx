import { useEffect, useRef } from 'react';

interface InlineEditorOverlayProps {
  x: number;
  y: number;
  width: number;
  value: string;
  onCommit: (value: string) => void;
  onCancel: () => void;
}

export function InlineEditorOverlay({
  x,
  y,
  width,
  value,
  onCommit,
  onCancel,
}: InlineEditorOverlayProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      onCommit(inputRef.current?.value || value);
    } else if (e.key === 'Escape') {
      e.preventDefault();
      onCancel();
    }
  };

  const handleBlur = () => {
    onCommit(inputRef.current?.value || value);
  };

  return (
    <foreignObject x={x} y={y - 20} width={width} height={40}>
      <input
        ref={inputRef}
        type="text"
        defaultValue={value}
        onKeyDown={handleKeyDown}
        onBlur={handleBlur}
        style={{
          width: '100%',
          padding: '4px 8px',
          fontSize: '13px',
          fontFamily: 'system-ui, sans-serif',
          border: '2px solid #3b82f6',
          borderRadius: '4px',
          backgroundColor: 'white',
          outline: 'none',
        }}
      />
    </foreignObject>
  );
}
