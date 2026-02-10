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

// Arrow patterns for finding edges within a line.
// Ordered: pipe-labeled > quote-labeled > unlabeled (most specific first).
// Capture group 1 = label text (if present).
const ARROW_PATTERNS: { regex: RegExp; style: EdgeStyle }[] = [
  // Pipe-labeled arrows: -->|label|, -.->|label|, ==>|label|
  { regex: /==>\|([^|]*)\|/, style: 'thick' },
  { regex: /-\.->\|([^|]*)\|/, style: 'dotted' },
  { regex: /-->\|([^|]*)\|/, style: 'solid' },
  // Quote-labeled arrows: == "label" ==>, -. "label" .->, -- "label" -->
  { regex: /==\s*"([^"]+)"\s*==>/, style: 'thick' },
  { regex: /-\.\s*"([^"]+)"\s*\.->/, style: 'dotted' },
  { regex: /--\s*"([^"]+)"\s*-->/, style: 'solid' },
  // Unlabeled arrows
  { regex: /==>/, style: 'thick' },
  { regex: /-.->/, style: 'dotted' },
  { regex: /-->/, style: 'solid' },
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

/** Parse a token as a node definition or plain ID, registering the node if found. */
function parseOrRegisterNode(token: string, nodeMap: Map<string, ParsedNode>): string {
  const nodeDef = parseNodeDef(token);
  if (nodeDef) {
    nodeMap.set(nodeDef.id, nodeDef);
    return nodeDef.id;
  }
  return token;
}

export function parseFlowchart(code: string): FlowchartParseResult {
  const lines = code.split('\n').map((l) => l.trim()).filter(Boolean);

  // First line: direction (TD is an alias for TB in Mermaid)
  let direction: GraphDirection = 'TB';
  const headerMatch = lines[0]?.match(/^(?:flowchart|graph)\s+(TB|TD|LR|BT|RL)\s*$/i);
  if (headerMatch) {
    const dir = headerMatch[1].toUpperCase();
    direction = (dir === 'TD' ? 'TB' : dir) as GraphDirection;
  }

  const nodeMap = new Map<string, ParsedNode>();
  const edges: ParsedEdge[] = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];

    // Try edge patterns first (supports inline node definitions like A[label] -->|text| B(label))
    let matched = false;
    for (const { regex, style } of ARROW_PATTERNS) {
      const m = regex.exec(line);
      if (m) {
        const sourceToken = line.slice(0, m.index).trim();
        const targetToken = line.slice(m.index + m[0].length).trim();
        const label = m[1] || '';

        const sourceId = parseOrRegisterNode(sourceToken, nodeMap);
        const targetId = parseOrRegisterNode(targetToken, nodeMap);

        edges.push({ source: sourceId, target: targetId, style, label: desanitizeLabel(label) });
        ensureNode(nodeMap, sourceId);
        ensureNode(nodeMap, targetId);
        matched = true;
        break;
      }
    }
    if (matched) continue;

    // Try standalone node definition
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
