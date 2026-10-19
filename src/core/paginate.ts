import type { Doc, Word } from './document';
import { tokenize } from './tokenize';

const PAGE_WORDS = 250;
const MAX_PAGE_WORDS = 400;

/**
 * Builds a document from sections (PDF pages, EPUB chapters, or one block of text).
 * With `splitLong`, sections are cut into ~250-word pages at sentence boundaries.
 */
export function buildDoc(title: string, sections: string[], splitLong: boolean): Doc {
  const words: Word[] = [];
  const pageStarts: number[] = [];
  for (const section of sections) {
    const sectionWords = tokenize(section);
    if (sectionWords.length === 0) continue;
    pageStarts.push(words.length);
    let count = 0;
    for (const w of sectionWords) {
      if (splitLong && count >= PAGE_WORDS && (w.sentenceStart || count >= MAX_PAGE_WORDS)) {
        pageStarts.push(words.length);
        count = 0;
      }
      words.push(w);
      count++;
    }
  }
  if (words.length === 0) throw new Error('No readable text found in this document.');
  return { id: hashId(title, words), title, words, pageStarts };
}

function hashId(title: string, words: Word[]): string {
  const sample = title + '|' + words.length + '|' + words.slice(0, 100).map((w) => w.text).join(' ');
  let h = 0x811c9dc5;
  for (let i = 0; i < sample.length; i++) {
    h ^= sample.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return (h >>> 0).toString(36);
}
