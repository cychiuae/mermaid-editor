import { useCallback, useEffect, useRef } from 'react';

interface InlineEditorProps {
  value: string;
  onCommit: (value: string) => void;
  onCancel: () => void;
}

export function InlineEditor({ value, onCommit, onCancel }: InlineEditorProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, []);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      e.stopPropagation();
      if (e.key === 'Enter') {
        onCommit(inputRef.current?.value ?? value);
      } else if (e.key === 'Escape') {
        onCancel();
      }
    },
    [onCommit, onCancel, value]
  );

  const handleBlur = useCallback(() => {
    onCommit(inputRef.current?.value ?? value);
  }, [onCommit, value]);

  return (
    <input
      ref={inputRef}
      defaultValue={value}
      onKeyDown={handleKeyDown}
      onBlur={handleBlur}
      className="w-full bg-transparent text-center text-sm outline-none border-b-2 border-blue-500 px-1 py-0.5"
      style={{ minWidth: '40px' }}
    />
  );
}
