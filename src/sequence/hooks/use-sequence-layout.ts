import { useMemo } from 'react';
import { useStore } from '../../store';
import { computeSequenceLayout, type SequenceLayout } from '../layout/sequence-layout';

export function useSequenceLayout(): SequenceLayout {
  const participants = useStore((s) => s.seqParticipants);
  const events = useStore((s) => s.seqEvents);
  const activations = useStore((s) => s.seqActivations);
  const autoNumber = useStore((s) => s.seqAutoNumber);

  return useMemo(
    () => computeSequenceLayout({ participants, events, activations, autoNumber }),
    [participants, events, activations, autoNumber]
  );
}
