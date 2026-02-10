import { useState, useCallback, useRef } from 'react';

export interface SvgPanZoom {
  panX: number;
  panY: number;
  zoom: number;
  onWheel: (e: React.WheelEvent) => void;
  onMouseDown: (e: React.MouseEvent) => void;
  onMouseMove: (e: React.MouseEvent) => void;
  onMouseUp: () => void;
  zoomIn: () => void;
  zoomOut: () => void;
  fitView: (contentWidth: number, contentHeight: number, containerWidth: number, containerHeight: number) => void;
  transform: string;
}

const MIN_ZOOM = 0.25;
const MAX_ZOOM = 4.0;
const ZOOM_FACTOR = 1.2;

export function useSvgPanZoom(): SvgPanZoom {
  const [panX, setPanX] = useState(0);
  const [panY, setPanY] = useState(0);
  const [zoom, setZoom] = useState(1);

  const isPanningRef = useRef(false);
  const lastMousePosRef = useRef({ x: 0, y: 0 });

  const clampZoom = (value: number) => Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, value));

  const onWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();

    const rect = e.currentTarget.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    setZoom((prevZoom) => {
      const delta = e.deltaY > 0 ? -1 : 1;
      const zoomFactor = delta > 0 ? ZOOM_FACTOR : 1 / ZOOM_FACTOR;
      const newZoom = clampZoom(prevZoom * zoomFactor);

      // Adjust pan to zoom towards cursor position
      setPanX((prevPanX) => {
        const pointX = (mouseX - prevPanX) / prevZoom;
        return mouseX - pointX * newZoom;
      });

      setPanY((prevPanY) => {
        const pointY = (mouseY - prevPanY) / prevZoom;
        return mouseY - pointY * newZoom;
      });

      return newZoom;
    });
  }, []);

  const onMouseDown = useCallback((e: React.MouseEvent) => {
    // Start panning on middle button or if clicking on the SVG background (not on elements)
    if (e.button === 1 || (e.target as SVGElement).tagName === 'svg') {
      e.preventDefault();
      isPanningRef.current = true;
      lastMousePosRef.current = { x: e.clientX, y: e.clientY };
    }
  }, []);

  const onMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isPanningRef.current) return;

    const deltaX = e.clientX - lastMousePosRef.current.x;
    const deltaY = e.clientY - lastMousePosRef.current.y;

    setPanX((prev) => prev + deltaX);
    setPanY((prev) => prev + deltaY);

    lastMousePosRef.current = { x: e.clientX, y: e.clientY };
  }, []);

  const onMouseUp = useCallback(() => {
    isPanningRef.current = false;
  }, []);

  const zoomIn = useCallback(() => {
    setZoom((prevZoom) => clampZoom(prevZoom * ZOOM_FACTOR));
  }, []);

  const zoomOut = useCallback(() => {
    setZoom((prevZoom) => clampZoom(prevZoom / ZOOM_FACTOR));
  }, []);

  const fitView = useCallback((
    contentWidth: number,
    contentHeight: number,
    containerWidth: number,
    containerHeight: number
  ) => {
    if (contentWidth === 0 || contentHeight === 0) return;

    const padding = 0.9; // 10% padding
    const scaleX = (containerWidth * padding) / contentWidth;
    const scaleY = (containerHeight * padding) / contentHeight;
    const newZoom = clampZoom(Math.min(scaleX, scaleY));

    setZoom(newZoom);

    // Center the content
    const scaledWidth = contentWidth * newZoom;
    const scaledHeight = contentHeight * newZoom;
    setPanX((containerWidth - scaledWidth) / 2);
    setPanY((containerHeight - scaledHeight) / 2);
  }, []);

  const transform = `translate(${panX}, ${panY}) scale(${zoom})`;

  return {
    panX,
    panY,
    zoom,
    onWheel,
    onMouseDown,
    onMouseMove,
    onMouseUp,
    zoomIn,
    zoomOut,
    fitView,
    transform,
  };
}
