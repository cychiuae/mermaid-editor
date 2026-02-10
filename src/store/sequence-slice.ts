import type { StateCreator } from 'zustand';
import type { AppState } from './index';
import type {
  SeqParticipant,
  ParticipantType,
  SeqEvent,
  SeqMessage,
  SeqActivation,
  SeqSelection,
  SeqArrowType,
  NotePosition,
  FragmentType,
} from '../types/sequence';
import {
  generateParticipantId,
  generateSeqEventId,
  generateActivationId,
} from '../utils/id-generator';
import {
  DEFAULT_PARTICIPANT_ALIAS,
  DEFAULT_SEQ_ARROW_TYPE,
  DEFAULT_FRAGMENT_LABEL,
  DEFAULT_NOTE_TEXT,
} from '../utils/constants';

export interface SequenceSlice {
  seqParticipants: SeqParticipant[];
  seqEvents: SeqEvent[];
  seqActivations: SeqActivation[];
  seqAutoNumber: boolean;
  seqSelection: SeqSelection | null;

  // Participants CRUD
  addParticipant: (alias?: string, type?: ParticipantType) => string;
  removeParticipant: (id: string) => void;
  updateParticipant: (
    id: string,
    updates: Partial<Pick<SeqParticipant, 'alias' | 'type'>>
  ) => void;
  reorderParticipants: (fromIndex: number, toIndex: number) => void;

  // Events CRUD
  addMessage: (
    from: string,
    to: string,
    arrowType?: SeqArrowType,
    label?: string
  ) => string;
  removeEvent: (id: string) => void;
  updateMessage: (
    id: string,
    updates: Partial<
      Pick<
        SeqMessage,
        'from' | 'to' | 'arrowType' | 'label' | 'activateTarget' | 'deactivateSource'
      >
    >
  ) => void;
  reorderEvents: (fromIndex: number, toIndex: number) => void;
  addNote: (position: NotePosition, participants: string[], text?: string) => string;
  updateNote: (
    id: string,
    updates: Partial<Extract<SeqEvent, { type: 'note' }>['note']>
  ) => void;
  addFragment: (type: FragmentType, label?: string) => string;
  updateFragment: (
    id: string,
    updates: Partial<
      Pick<Extract<SeqEvent, { type: 'fragment' }>['fragment'], 'type' | 'label' | 'color'>
    >
  ) => void;
  addFragmentSection: (fragmentId: string, label?: string) => void;
  removeFragmentSection: (fragmentId: string, sectionIndex: number) => void;
  moveEventToFragment: (
    eventId: string,
    fragmentId: string,
    sectionIndex: number
  ) => void;
  moveEventOutOfFragment: (
    eventId: string,
    fragmentId: string,
    sectionIndex: number
  ) => void;

  // Activations CRUD
  addActivation: (
    participantId: string,
    startEventIndex: number,
    endEventIndex: number
  ) => string;
  removeActivation: (id: string) => void;
  updateActivation: (
    id: string,
    updates: Partial<Pick<SeqActivation, 'startEventIndex' | 'endEventIndex'>>
  ) => void;

  // Selection
  setSeqSelection: (selection: SeqSelection | null) => void;

  // Auto-number
  toggleSeqAutoNumber: () => void;

  // Bulk restore
  setSequenceData: (data: {
    participants?: SeqParticipant[];
    events?: SeqEvent[];
    activations?: SeqActivation[];
    autoNumber?: boolean;
  }) => void;
}

export const createSequenceSlice: StateCreator<AppState, [["zustand/persist", unknown]], [], SequenceSlice> = (
  set,
  get
) => ({
  seqParticipants: [],
  seqEvents: [],
  seqActivations: [],
  seqAutoNumber: false,
  seqSelection: null,

  // ── Participants CRUD ──────────────────────────────────────────────

  addParticipant: (alias = DEFAULT_PARTICIPANT_ALIAS, type = 'participant') => {
    const id = generateParticipantId();
    const newParticipant: SeqParticipant = {
      id,
      alias,
      type,
    };
    set({ seqParticipants: [...get().seqParticipants, newParticipant] });
    get().pushHistory();
    return id;
  },

  removeParticipant: (id) => {
    const { seqParticipants, seqEvents, seqActivations } = get();

    // Remove participant
    const updatedParticipants = seqParticipants.filter((p) => p.id !== id);

    // Remove events referencing this participant
    const updatedEvents = seqEvents.filter((event) => {
      if (event.type === 'message') {
        return event.from !== id && event.to !== id;
      }
      if (event.type === 'note') {
        return !event.note.participants.includes(id);
      }
      return true; // Keep fragments
    });

    // Remove activations referencing this participant
    const updatedActivations = seqActivations.filter(
      (a) => a.participantId !== id
    );

    set({
      seqParticipants: updatedParticipants,
      seqEvents: updatedEvents,
      seqActivations: updatedActivations,
    });
    get().pushHistory();
  },

  updateParticipant: (id, updates) => {
    set({
      seqParticipants: get().seqParticipants.map((p) =>
        p.id === id ? { ...p, ...updates } : p
      ),
    });
    get().pushHistory();
  },

  reorderParticipants: (fromIndex, toIndex) => {
    const participants = [...get().seqParticipants];
    const [removed] = participants.splice(fromIndex, 1);
    participants.splice(toIndex, 0, removed);
    set({ seqParticipants: participants });
    get().pushHistory();
  },

  // ── Events CRUD ────────────────────────────────────────────────────

  addMessage: (from, to, arrowType = DEFAULT_SEQ_ARROW_TYPE, label = '') => {
    const id = generateSeqEventId();
    const newMessage: SeqMessage = {
      id,
      type: 'message',
      from,
      to,
      arrowType,
      label,
    };
    set({ seqEvents: [...get().seqEvents, newMessage] });
    get().pushHistory();
    return id;
  },

  removeEvent: (id) => {
    const { seqEvents } = get();

    // Remove from events array
    const updatedEvents = seqEvents.filter((e) => e.id !== id);

    // Also remove from any fragment section eventIds
    const cleanedEvents = updatedEvents.map((event) => {
      if (event.type === 'fragment') {
        return {
          ...event,
          fragment: {
            ...event.fragment,
            sections: event.fragment.sections.map((section) => ({
              ...section,
              eventIds: section.eventIds.filter((eid) => eid !== id),
            })),
          },
        };
      }
      return event;
    });

    set({ seqEvents: cleanedEvents });
    get().pushHistory();
  },

  updateMessage: (id, updates) => {
    set({
      seqEvents: get().seqEvents.map((e) =>
        e.id === id && e.type === 'message' ? { ...e, ...updates } : e
      ),
    });
    get().pushHistory();
  },

  reorderEvents: (fromIndex, toIndex) => {
    const events = [...get().seqEvents];
    const [removed] = events.splice(fromIndex, 1);
    events.splice(toIndex, 0, removed);
    set({ seqEvents: events });
    get().pushHistory();
  },

  addNote: (position, participants, text = DEFAULT_NOTE_TEXT) => {
    const id = generateSeqEventId();
    const newNote: SeqEvent = {
      id,
      type: 'note',
      note: {
        position,
        participants,
        text,
      },
    };
    set({ seqEvents: [...get().seqEvents, newNote] });
    get().pushHistory();
    return id;
  },

  updateNote: (id, updates) => {
    set({
      seqEvents: get().seqEvents.map((e) =>
        e.id === id && e.type === 'note'
          ? { ...e, note: { ...e.note, ...updates } }
          : e
      ),
    });
    get().pushHistory();
  },

  addFragment: (type, label = DEFAULT_FRAGMENT_LABEL) => {
    const id = generateSeqEventId();
    const newFragment: SeqEvent = {
      id,
      type: 'fragment',
      fragment: {
        type,
        label,
        sections: [{ label: '', eventIds: [] }],
      },
    };
    set({ seqEvents: [...get().seqEvents, newFragment] });
    get().pushHistory();
    return id;
  },

  updateFragment: (id, updates) => {
    set({
      seqEvents: get().seqEvents.map((e) =>
        e.id === id && e.type === 'fragment'
          ? { ...e, fragment: { ...e.fragment, ...updates } }
          : e
      ),
    });
    get().pushHistory();
  },

  addFragmentSection: (fragmentId, label = '') => {
    set({
      seqEvents: get().seqEvents.map((e) =>
        e.id === fragmentId && e.type === 'fragment'
          ? {
              ...e,
              fragment: {
                ...e.fragment,
                sections: [...e.fragment.sections, { label, eventIds: [] }],
              },
            }
          : e
      ),
    });
    get().pushHistory();
  },

  removeFragmentSection: (fragmentId, sectionIndex) => {
    set({
      seqEvents: get().seqEvents.map((e) =>
        e.id === fragmentId && e.type === 'fragment'
          ? {
              ...e,
              fragment: {
                ...e.fragment,
                sections: e.fragment.sections.filter(
                  (_, idx) => idx !== sectionIndex
                ),
              },
            }
          : e
      ),
    });
    get().pushHistory();
  },

  moveEventToFragment: (eventId, fragmentId, sectionIndex) => {
    set({
      seqEvents: get().seqEvents.map((e) =>
        e.id === fragmentId && e.type === 'fragment'
          ? {
              ...e,
              fragment: {
                ...e.fragment,
                sections: e.fragment.sections.map((section, idx) =>
                  idx === sectionIndex
                    ? { ...section, eventIds: [...section.eventIds, eventId] }
                    : section
                ),
              },
            }
          : e
      ),
    });
    get().pushHistory();
  },

  moveEventOutOfFragment: (eventId, fragmentId, sectionIndex) => {
    set({
      seqEvents: get().seqEvents.map((e) =>
        e.id === fragmentId && e.type === 'fragment'
          ? {
              ...e,
              fragment: {
                ...e.fragment,
                sections: e.fragment.sections.map((section, idx) =>
                  idx === sectionIndex
                    ? {
                        ...section,
                        eventIds: section.eventIds.filter((eid) => eid !== eventId),
                      }
                    : section
                ),
              },
            }
          : e
      ),
    });
    get().pushHistory();
  },

  // ── Activations CRUD ───────────────────────────────────────────────

  addActivation: (participantId, startEventIndex, endEventIndex) => {
    const id = generateActivationId();
    const newActivation: SeqActivation = {
      id,
      participantId,
      startEventIndex,
      endEventIndex,
    };
    set({ seqActivations: [...get().seqActivations, newActivation] });
    get().pushHistory();
    return id;
  },

  removeActivation: (id) => {
    set({
      seqActivations: get().seqActivations.filter((a) => a.id !== id),
    });
    get().pushHistory();
  },

  updateActivation: (id, updates) => {
    set({
      seqActivations: get().seqActivations.map((a) =>
        a.id === id ? { ...a, ...updates } : a
      ),
    });
    get().pushHistory();
  },

  // ── Selection ──────────────────────────────────────────────────────

  setSeqSelection: (selection) => {
    set({ seqSelection: selection });
  },

  // ── Auto-number ────────────────────────────────────────────────────

  toggleSeqAutoNumber: () => {
    set({ seqAutoNumber: !get().seqAutoNumber });
    get().pushHistory();
  },

  // ── Bulk restore ───────────────────────────────────────────────────

  setSequenceData: (data) => {
    set({
      ...(data.participants !== undefined && { seqParticipants: data.participants }),
      ...(data.events !== undefined && { seqEvents: data.events }),
      ...(data.activations !== undefined && { seqActivations: data.activations }),
      ...(data.autoNumber !== undefined && { seqAutoNumber: data.autoNumber }),
    });
  },
});
