import { useCallback } from 'react';
import { useMermaidCode } from './use-mermaid-code';

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

  const exportMermaid = useCallback(() => {
    downloadFile(mermaidCode, 'flowchart.mmd', 'text/plain');
  }, [mermaidCode]);

  const exportSvg = useCallback(() => {
    const viewport = document.querySelector('.react-flow__viewport');
    if (!viewport) return;

    const svgEl = viewport.closest('svg') ?? viewport.querySelector('svg');
    if (svgEl) {
      const clone = svgEl.cloneNode(true) as SVGElement;
      // Remove controls/minimap from clone
      clone.querySelectorAll('.react-flow__controls, .react-flow__minimap').forEach((el) => el.remove());
      const svgData = new XMLSerializer().serializeToString(clone);
      downloadFile(svgData, 'flowchart.svg', 'image/svg+xml');
    } else {
      exportMermaid();
    }
  }, [exportMermaid]);

  const exportPng = useCallback(() => {
    // For PNG, export the mermaid code as a practical fallback
    // Full PNG export would require html-to-image or similar library
    exportMermaid();
  }, [exportMermaid]);

  return { exportMermaid, exportSvg, exportPng };
}
