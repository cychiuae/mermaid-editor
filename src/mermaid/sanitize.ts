export function sanitizeLabel(label: string): string {
  // Escape quotes and special mermaid characters
  return label
    .replace(/"/g, '#quot;')
    .replace(/</g, '#lt;')
    .replace(/>/g, '#gt;');
}
