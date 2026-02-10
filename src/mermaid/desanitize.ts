export function desanitizeLabel(label: string): string {
  return label
    .replace(/#quot;/g, '"')
    .replace(/#lt;/g, '<')
    .replace(/#gt;/g, '>');
}
