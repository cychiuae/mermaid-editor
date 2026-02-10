import type { EdgeStyle } from '../types/edge';
import { sanitizeLabel } from './sanitize';

const EDGE_SYNTAX: Record<EdgeStyle, [string, string]> = {
  solid: ['-->', '-->'],
  dotted: ['-.->',  '-.->'],
  thick: ['==>', '==>'],
};

const EDGE_LABEL_SYNTAX: Record<EdgeStyle, [string, string]> = {
  solid: ['--', '-->'],
  dotted: ['-.', '.->'],
  thick: ['==', '==>'],
};

export function edgeToMermaid(
  source: string,
  target: string,
  style: EdgeStyle,
  label?: string
): string {
  if (label && label.trim()) {
    const [open, close] = EDGE_LABEL_SYNTAX[style];
    return `    ${source} ${open}"${sanitizeLabel(label)}"${close} ${target}`;
  }
  const [arrow] = EDGE_SYNTAX[style];
  return `    ${source} ${arrow} ${target}`;
}
