import { useRef, useCallback } from 'react';
import { useStore } from '../../store';
import { useSequenceLayout } from '../hooks/use-sequence-layout';
import { useSvgPanZoom } from '../hooks/use-svg-pan-zoom';
import { useSequenceInteractions } from '../hooks/use-sequence-interactions';
import { SvgArrowMarkers } from './SvgArrowMarkers';
import { ParticipantBox } from './ParticipantBox';
import { Lifeline } from './Lifeline';
import { MessageArrow } from './MessageArrow';
import { NoteBox } from './NoteBox';
import { ActivationBox } from './ActivationBox';
import { FragmentBox } from './FragmentBox';
import { InlineEditorOverlay } from './InlineEditorOverlay';
import { SequenceControls } from './SequenceControls';
import { PARTICIPANT_WIDTH } from '../layout/sequence-constants';

export function SequenceCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);
  const seqSelection = useStore((s) => s.seqSelection);
  const isAddingMessage = useStore((s) => s.isAddingMessage);
  const addingMessageFrom = useStore((s) => s.addingMessageFrom);
  const seqActiveArrowType = useStore((s) => s.seqActiveArrowType);
  const setIsAddingMessage = useStore((s) => s.setIsAddingMessage);
  const setAddingMessageFrom = useStore((s) => s.setAddingMessageFrom);
  const addMessage = useStore((s) => s.addMessage);

  const layout = useSequenceLayout();
  const panZoom = useSvgPanZoom();
  const interactions = useSequenceInteractions();

  const handleFitView = useCallback(() => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    panZoom.fitView(layout.totalWidth, layout.totalHeight, rect.width, rect.height);
  }, [panZoom, layout.totalWidth, layout.totalHeight]);

  const handleParticipantClick = useCallback((id: string) => {
    if (isAddingMessage) {
      if (!addingMessageFrom) {
        setAddingMessageFrom(id);
      } else {
        addMessage(addingMessageFrom, id, seqActiveArrowType);
        setIsAddingMessage(false);
        setAddingMessageFrom(null);
      }
    } else {
      interactions.handleSelect('participant', id);
    }
  }, [isAddingMessage, addingMessageFrom, seqActiveArrowType, addMessage, setIsAddingMessage, setAddingMessageFrom, interactions]);

  const handleSvgClick = useCallback((e: React.MouseEvent) => {
    // Only deselect if clicking on the SVG background (not on elements)
    if ((e.target as SVGElement).tagName === 'svg') {
      interactions.handleDeselect();
      if (isAddingMessage) {
        setIsAddingMessage(false);
        setAddingMessageFrom(null);
      }
    }
  }, [interactions, isAddingMessage, setIsAddingMessage, setAddingMessageFrom]);

  // Compute inline editor position
  let editorPosition: { x: number; y: number; width: number } | null = null;
  if (interactions.editingItem) {
    const { type, id } = interactions.editingItem;
    if (type === 'participant') {
      const pl = layout.participants.find((p) => p.participant.id === id);
      if (pl) editorPosition = { x: pl.x - PARTICIPANT_WIDTH / 2, y: pl.topY + 15, width: PARTICIPANT_WIDTH };
    } else if (type === 'message') {
      const ml = layout.messages.find((m) => m.event.id === id);
      if (ml) editorPosition = { x: ml.labelX - 75, y: ml.labelY - 10, width: 150 };
    } else if (type === 'note') {
      const nl = layout.notes.find((n) => n.event.id === id);
      if (nl) editorPosition = { x: nl.x, y: nl.y + 10, width: nl.width };
    } else if (type === 'fragment') {
      const fl = layout.fragments.find((f) => f.event.id === id);
      if (fl) editorPosition = { x: fl.x + 8, y: fl.y + 2, width: Math.min(fl.width - 16, 200) };
    }
  }

  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 sequence-canvas ${panZoom.panX !== 0 ? '' : ''}`}
      style={{ overflow: 'hidden' }}
    >
      <svg
        className="sequence-canvas-svg w-full h-full"
        onWheel={panZoom.onWheel}
        onMouseDown={(e) => {
          panZoom.onMouseDown(e);
          handleSvgClick(e);
        }}
        onMouseMove={panZoom.onMouseMove}
        onMouseUp={panZoom.onMouseUp}
        style={{ cursor: isAddingMessage ? 'crosshair' : undefined }}
      >
        <SvgArrowMarkers />

        <g transform={panZoom.transform}>
          {/* Lifelines (behind everything) */}
          {layout.lifelines.map((ll) => (
            <Lifeline key={ll.participantId} layout={ll} />
          ))}

          {/* Activations */}
          {layout.activations.map((al) => (
            <ActivationBox key={al.activation.id} layout={al} />
          ))}

          {/* Fragments */}
          {layout.fragments.map((fl) => (
            <FragmentBox
              key={fl.event.id}
              layout={fl}
              isSelected={seqSelection?.id === fl.event.id}
              onSelect={(id) => interactions.handleSelect('fragment', id)}
              onDoubleClick={(id) => interactions.handleInlineEditStart('fragment', id)}
            />
          ))}

          {/* Messages */}
          {layout.messages.map((ml) => (
            <MessageArrow
              key={ml.event.id}
              layout={ml}
              isSelected={seqSelection?.id === ml.event.id}
              onSelect={(id) => interactions.handleSelect('message', id)}
              onDoubleClick={(id) => interactions.handleInlineEditStart('message', id)}
            />
          ))}

          {/* Notes */}
          {layout.notes.map((nl) => (
            <NoteBox
              key={nl.event.id}
              layout={nl}
              isSelected={seqSelection?.id === nl.event.id}
              onSelect={(id) => interactions.handleSelect('note', id)}
              onDoubleClick={(id) => interactions.handleInlineEditStart('note', id)}
            />
          ))}

          {/* Top participants */}
          {layout.participants.map((pl) => (
            <ParticipantBox
              key={`top-${pl.participant.id}`}
              layout={pl}
              isTop={true}
              isSelected={seqSelection?.id === pl.participant.id}
              onSelect={handleParticipantClick}
              onDoubleClick={(id) => interactions.handleInlineEditStart('participant', id)}
            />
          ))}

          {/* Bottom participants */}
          {layout.participants.map((pl) => (
            <ParticipantBox
              key={`bottom-${pl.participant.id}`}
              layout={pl}
              isTop={false}
              isSelected={seqSelection?.id === pl.participant.id}
              onSelect={handleParticipantClick}
              onDoubleClick={(id) => interactions.handleInlineEditStart('participant', id)}
            />
          ))}

          {/* Inline editor overlay */}
          {interactions.editingItem && editorPosition && (
            <InlineEditorOverlay
              x={editorPosition.x}
              y={editorPosition.y}
              width={editorPosition.width}
              value={interactions.editingItem.value}
              onCommit={interactions.handleInlineEditCommit}
              onCancel={interactions.handleInlineEditCancel}
            />
          )}
        </g>
      </svg>

      <SequenceControls
        onZoomIn={panZoom.zoomIn}
        onZoomOut={panZoom.zoomOut}
        onFitView={handleFitView}
      />
    </div>
  );
}
