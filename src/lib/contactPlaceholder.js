/** Builds the "Your <label>..." placeholder for text-like contact form fields. */
export function contactPlaceholder(label) {
  const base = (typeof label === 'string' ? label : '')
    .trim()
    .replace(/(?:\.{2,}|\u2026|[?:!.,;\s])+$/u, '')
    .trim();
  if (!base) return 'Type here...';
  const lower = base.charAt(0).toLowerCase() + base.slice(1);
  if (/^your\s/i.test(base)) {
    return `${lower.charAt(0).toUpperCase()}${lower.slice(1)}...`;
  }
  return `Your ${base.toLowerCase()}...`;
}
