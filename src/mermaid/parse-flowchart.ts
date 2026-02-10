import type { NodeShape } from '../types/node';
import type { EdgeStyle } from '../types/edge';
import type { GraphDirection } from '../types/graph';
import { desanitizeLabel } from './desanitize';

interface ParsedNode {
  id: string;
  label: string;
  shape: NodeShape;
}

interface ParsedEdge {
  source: string;
  target: string;
  style: EdgeStyle;
  label: string;
}

export interface FlowchartParseResult {
  direction: GraphDirection;
  nodes: ParsedNode[];
  edges: ParsedEdge[];
}

// Shape patterns: longer patterns first to avoid prefix ambiguity
const SHAPE_PATTERNS: [RegExp, NodeShape][] = [
  [/^\(\((.+?)\)\)$/, 'circle'],
  [/^\(\[(.+?)\]\)$/, 'stadium'],
  [/^\{\{(.+?)\}\}$/, 'hexagon'],
  [/^\{(.+?)\}$/, 'diamond'],
  [/^\((.+?)\)$/, 'rounded'],
  [/^\[(.+?)\]$/, 'rectangle'],
];

// Edge arrow patterns: ordered longest first
const EDGE_PATTERNS: { regex: RegExp; style: EdgeStyle; hasLabel: boolean }[] = [
  // Labeled edges
  { regex: /^(\S+)\s+==\s*"(.+?)"\s*==>\s+(\S+)$/, style: 'thick', hasLabel: true },
  { regex: /^(\S+)\s+-\.\s*"(.+?)"\s*\.->\s+(\S+)$/, style: 'dotted', hasLabel: true },
  { regex: /^(\S+)\s+--\s*"(.+?)"\s*-->\s+(\S+)$/, style: 'solid', hasLabel: true },
  // Unlabeled edges
  { regex: /^(\S+)\s+==>\s+(\S+)$/, style: 'thick', hasLabel: false },
  { regex: /^(\S+)\s+-\.->\s+(\S+)$/, style: 'dotted', hasLabel: false },
  { regex: /^(\S+)\s+-->\s+(\S+)$/, style: 'solid', hasLabel: false },
];

function parseNodeDef(token: string): { id: string; label: string; shape: NodeShape } | null {
  // Try to split id from shape bracket: e.g. nodeId["label"] or nodeId(label)
  // Find the first bracket character
  const bracketStart = token.search(/[\[\(\{]/);
  if (bracketStart <= 0) return null;

  const id = token.slice(0, bracketStart);
  const shapeText = token.slice(bracketStart);

  for (const [pattern, shape] of SHAPE_PATTERNS) {
    const match = shapeText.match(pattern);
    if (match) {
      const rawLabel = match[1].replace(/^"|"$/g, '');
      return { id, label: desanitizeLabel(rawLabel), shape };
    }
  }

  return null;
}

export function parseFlowchart(code: string): FlowchartParseResult {
  const lines = code.split('\n').map((l) => l.trim()).filter(Boolean);

  // First line: direction
  let direction: GraphDirection = 'TB';
  const headerMatch = lines[0]?.match(/^(?:flowchart|graph)\s+(TB|LR|BT|RL)\s*$/i);
  if (headerMatch) {
    direction = headerMatch[1].toUpperCase() as GraphDirection;
  }

  const nodeMap = new Map<string, ParsedNode>();
  const edges: ParsedEdge[] = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];

    // Try edge patterns first (they contain node refs)
    let matched = false;
    for (const { regex, style, hasLabel } of EDGE_PATTERNS) {
      const m = line.match(regex);
      if (m) {
        if (hasLabel) {
          const [, source, label, target] = m;
          edges.push({ source, target, style, label: desanitizeLabel(label) });
          // Register implicit nodes
          ensureNode(nodeMap, source);
          ensureNode(nodeMap, target);
        } else {
          const [, source, target] = m;
          edges.push({ source, target, style, label: '' });
          ensureNode(nodeMap, source);
          ensureNode(nodeMap, target);
        }
        matched = true;
        break;
      }
    }
    if (matched) continue;

    // Try node definition
    const nodeDef = parseNodeDef(line);
    if (nodeDef) {
      nodeMap.set(nodeDef.id, nodeDef);
      continue;
    }
  }

  return {
    direction,
    nodes: Array.from(nodeMap.values()),
    edges,
  };
}

function ensureNode(map: Map<string, ParsedNode>, id: string): void {
  if (!map.has(id)) {
    map.set(id, { id, label: id, shape: 'rectangle' });
  }
}
