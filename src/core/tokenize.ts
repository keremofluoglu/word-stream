import type { Word } from './document';

const SENTENCE_END = /[.!?…]["'”’)\]]*$/;
const STARTS_LOWERCASE = /^\p{Ll}/u;

/** Splits text into words, marking paragraph and sentence starts. Paragraphs are separated by blank lines. */
export function tokenize(text: string): Word[] {
  const words: Word[] = [];
  const paragraphs = text.replace(/\r\n?/g, '\n').split(/\n\s*\n/);
  for (const para of paragraphs) {
    const parts = para.split(/\s+/).filter(Boolean);
    parts.forEach((part, i) => {
      const prev = words[words.length - 1];
      words.push({
        text: part,
        paraStart: i === 0,
        sentenceStart: i === 0 || !prev || (SENTENCE_END.test(prev.text) && !STARTS_LOWERCASE.test(part)),
      });
    });
  }
  return words;
}
