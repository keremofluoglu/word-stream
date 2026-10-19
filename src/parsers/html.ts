const BLOCK = new Set([
  'P', 'DIV', 'SECTION', 'ARTICLE', 'BLOCKQUOTE', 'LI', 'UL', 'OL', 'PRE', 'TABLE', 'TR',
  'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'HEADER', 'FOOTER', 'ASIDE', 'FIGURE', 'BR', 'HR',
]);
const SKIP = new Set(['SCRIPT', 'STYLE', 'NOSCRIPT', 'TEMPLATE', 'SVG', 'HEAD']);

/** Converts an HTML string to plain text, putting a blank line between block elements. */
export function htmlToText(html: string): { title: string; text: string } {
  const doc = new DOMParser().parseFromString(html, 'text/html');
  const out: string[] = [];
  const walk = (node: Node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      out.push(node.textContent ?? '');
      return;
    }
    if (node.nodeType !== Node.ELEMENT_NODE) return;
    const tag = (node as Element).tagName.toUpperCase();
    if (SKIP.has(tag)) return;
    const block = BLOCK.has(tag);
    if (block) out.push('\n\n');
    node.childNodes.forEach(walk);
    if (block) out.push('\n\n');
  };
  if (doc.body) walk(doc.body);
  return { title: doc.title.trim(), text: out.join('') };
}
