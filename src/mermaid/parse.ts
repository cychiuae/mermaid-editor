import { parseFlowchart, type FlowchartParseResult } from './parse-flowchart';
import { parseSequence, type SequenceParseResult } from './parse-sequence';

export type ParseResult =
  | { type: 'flowchart'; data: FlowchartParseResult }
  | { type: 'sequence'; data: SequenceParseResult }
  | { type: 'error'; message: string };

export function parseMermaidCode(code: string): ParseResult {
  const trimmed = code.trim();
  if (!trimmed) {
    return { type: 'error', message: 'Empty input' };
  }

  const firstLine = trimmed.split('\n')[0].trim();

  if (/^(?:flowchart|graph)\s+/i.test(firstLine)) {
    try {
      return { type: 'flowchart', data: parseFlowchart(trimmed) };
    } catch (e) {
      return { type: 'error', message: `Flowchart parse error: ${(e as Error).message}` };
    }
  }

  if (/^sequenceDiagram$/i.test(firstLine)) {
    try {
      return { type: 'sequence', data: parseSequence(trimmed) };
    } catch (e) {
      return { type: 'error', message: `Sequence parse error: ${(e as Error).message}` };
    }
  }

  return {
    type: 'error',
    message: 'Unrecognized diagram type. Expected "flowchart <direction>" or "sequenceDiagram".',
  };
}
