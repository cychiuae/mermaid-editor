import type { NodeShape } from '../types/node';
import { sanitizeLabel } from './sanitize';

type SyntaxWrap = [string, string];

const SHAPE_SYNTAX: Record<NodeShape, SyntaxWrap> = {
  rectangle: ['[', ']'],
  rounded: ['(', ')'],
  diamond: ['{', '}'],
  circle: ['((', '))'],
  stadium: ['([', '])'],
  hexagon: ['{{', '}}'],
};

export function nodeToMermaid(id: string, label: string, shape: NodeShape): string {
  const [open, close] = SHAPE_SYNTAX[shape];
  return `    ${id}${open}"${sanitizeLabel(label)}"${close}`;
}
