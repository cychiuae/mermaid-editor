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
