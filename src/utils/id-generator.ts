let nodeCounter = 0;
let edgeCounter = 0;
let participantCounter = 0;
let seqEventCounter = 0;
let activationCounter = 0;

export function generateNodeId(): string {
  return `node_${++nodeCounter}`;
}

export function generateEdgeId(): string {
  return `edge_${++edgeCounter}`;
}

export function generateParticipantId(): string {
  return `participant_${++participantCounter}`;
}

export function generateSeqEventId(): string {
  return `seq_event_${++seqEventCounter}`;
}

export function generateActivationId(): string {
  return `activation_${++activationCounter}`;
}

export function resetCounters(): void {
  nodeCounter = 0;
  edgeCounter = 0;
  participantCounter = 0;
  seqEventCounter = 0;
  activationCounter = 0;
}

function maxSuffix(ids: string[], prefix: string): number {
  let max = 0;
  for (const id of ids) {
    if (id.startsWith(prefix)) {
      const num = parseInt(id.slice(prefix.length), 10);
      if (num > max) max = num;
    }
  }
  return max;
}

export function syncCountersFromState(state: {
  nodes: { id: string }[];
  edges: { id: string }[];
  seqParticipants: { id: string }[];
  seqEvents: { id: string }[];
  seqActivations: { id: string }[];
}): void {
  nodeCounter = maxSuffix(state.nodes.map((n) => n.id), 'node_');
  edgeCounter = maxSuffix(state.edges.map((e) => e.id), 'edge_');
  participantCounter = maxSuffix(state.seqParticipants.map((p) => p.id), 'participant_');
  seqEventCounter = maxSuffix(state.seqEvents.map((e) => e.id), 'seq_event_');
  activationCounter = maxSuffix(state.seqActivations.map((a) => a.id), 'activation_');
}
