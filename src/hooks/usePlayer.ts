import { useEffect, useState } from 'react';
import type { Doc } from '../core/document';

/** Advances one word every 60000 / wpm ms while playing; stops at the last word. */
export function usePlayer(doc: Doc, wpm: number, startIndex: () => number) {
  const [index, setIndexRaw] = useState(() => Math.min(startIndex(), doc.words.length - 1));
  const [playing, setPlaying] = useState(false);
  const last = doc.words.length - 1;

  useEffect(() => {
    if (!playing) return;
    if (index >= last) {
      setPlaying(false);
      return;
    }
    const t = setTimeout(() => setIndexRaw((i) => i + 1), 60000 / wpm);
    return () => clearTimeout(t);
  }, [playing, index, wpm, last]);

  const setIndex = (i: number) => setIndexRaw(Math.max(0, Math.min(last, i)));
  return { index, setIndex, playing, setPlaying };
}
