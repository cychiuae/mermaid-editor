import { useCallback } from 'react';
import { useMermaidCode } from './use-mermaid-code';
import { useStore } from '../store';

function downloadFile(content: string, filename: string, type: string) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function useExport() {
  const mermaidCode = useMermaidCode();
  const diagramType = useStore((s) => s.diagramType);

  const filePrefix = diagramType === 'sequence' ? 'sequence-diagram' : 'flowchart';

  const exportMermaid = useCallback(() => {
    downloadFile(mermaidCode, `${filePrefix}.mmd`, 'text/plain');
  }, [mermaidCode, filePrefix]);

  const exportSvg = useCallback(() => {
    if (diagramType === 'sequence') {
      // For sequence diagrams, serialize the custom SVG canvas
      const svgEl = document.querySelector('.sequence-canvas-svg');
      if (svgEl) {
        const clone = svgEl.cloneNode(true) as SVGElement;
        // Remove controls overlay
        clone.querySelectorAll('.sequence-controls').forEach((el) => el.remove());
        const svgData = new XMLSerializer().serializeToString(clone);
        downloadFile(svgData, `${filePrefix}.svg`, 'image/svg+xml');
        return;
      }
    } else {
      const viewport = document.querySelector('.react-flow__viewport');
      if (!viewport) return;

      const svgEl = viewport.closest('svg') ?? viewport.querySelector('svg');
      if (svgEl) {
        const clone = svgEl.cloneNode(true) as SVGElement;
        clone.querySelectorAll('.react-flow__controls, .react-flow__minimap').forEach((el) => el.remove());
        const svgData = new XMLSerializer().serializeToString(clone);
        downloadFile(svgData, `${filePrefix}.svg`, 'image/svg+xml');
        return;
      }
    }
    exportMermaid();
  }, [diagramType, exportMermaid, filePrefix]);

  const exportPng = useCallback(() => {
    // For PNG, export the mermaid code as a practical fallback
    // Full PNG export would require html-to-image or similar library
    exportMermaid();
  }, [exportMermaid]);

  return { exportMermaid, exportSvg, exportPng };
}
