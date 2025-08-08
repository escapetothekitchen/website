export function makeExcerpt(markdown: string, maxLen = 180): string {
  if (!markdown) return '';
  // Get first non-empty paragraph
  const first = markdown
    .split(/\n{2,}/) // paragraphs
    .map((s) => s.trim())
    .find((s) => s.length > 0) || '';

  // Strip some common markdown tokens
  let text = first
    .replace(/!\[[^\]]*\]\([^\)]*\)/g, '') // images
    .replace(/\[[^\]]*\]\([^\)]*\)/g, '$1') // links -> text
    .replace(/^#+\s*/gm, '') // headings
    .replace(/[*_`~>#-]/g, '') // formatting
    .replace(/\s+/g, ' ') // collapse whitespace
    .trim();

  if (text.length > maxLen) {
    text = text.slice(0, maxLen - 1).trimEnd() + '…';
  }
  return text;
} 