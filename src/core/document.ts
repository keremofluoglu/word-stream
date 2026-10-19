export interface Word {
  text: string;
  sentenceStart: boolean;
  paraStart: boolean;
}

export interface Doc {
  id: string;
  title: string;
  words: Word[];
  /** Index into `words` where each page begins. Always starts with 0. */
  pageStarts: number[];
}

/** Returns the page that contains the given word index. */
export function pageOf(doc: Doc, index: number): number {
  let lo = 0;
  let hi = doc.pageStarts.length - 1;
  while (lo < hi) {
    const mid = (lo + hi + 1) >> 1;
    if (doc.pageStarts[mid] <= index) lo = mid;
    else hi = mid - 1;
  }
  return lo;
}

export function pageRange(doc: Doc, page: number): [number, number] {
  const start = doc.pageStarts[page];
  const end = page + 1 < doc.pageStarts.length ? doc.pageStarts[page + 1] : doc.words.length;
  return [start, end];
}

/** Start of the sentence containing `index`, or of the previous one when already near its start. */
export function previousSentenceStart(doc: Doc, index: number): number {
  let s = index;
  while (s > 0 && !doc.words[s].sentenceStart) s--;
  if (index - s >= 2 || s === 0) return s;
  s--;
  while (s > 0 && !doc.words[s].sentenceStart) s--;
  return s;
}

export function nextSentenceStart(doc: Doc, index: number): number {
  let s = index + 1;
  while (s < doc.words.length && !doc.words[s].sentenceStart) s++;
  return Math.min(s, doc.words.length - 1);
}
