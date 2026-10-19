import { useLayoutEffect, useRef } from 'react';
import type { Word } from '../core/document';

interface Props {
  words: Word[];
  /** Global index of words[0]. */
  offset: number;
  current?: number;
  onWordClick?: (index: number) => void;
}

/** Renders words as paragraphs and keeps the current (or last) word scrolled into view. */
export function PageText({ words, offset, current, onWordClick }: Props) {
  const box = useRef<HTMLDivElement>(null);
  const focus = useRef<HTMLSpanElement>(null);

  useLayoutEffect(() => {
    const el = focus.current;
    const container = box.current;
    if (!el || !container) return;
    const top = el.offsetTop - container.offsetTop;
    if (top < container.scrollTop || top + el.offsetHeight > container.scrollTop + container.clientHeight) {
      container.scrollTop = top - container.clientHeight / 3;
    }
  });

  const paragraphs: { start: number; words: Word[] }[] = [];
  words.forEach((w, i) => {
    if (w.paraStart || paragraphs.length === 0) paragraphs.push({ start: i, words: [] });
    paragraphs[paragraphs.length - 1].words.push(w);
  });
  const focusIndex = current ?? offset + words.length - 1;

  return (
    <div className="page-text" ref={box}>
      {paragraphs.map((p) => (
        <p key={offset + p.start}>
          {p.words.map((w, j) => {
            const i = offset + p.start + j;
            return (
              <span
                key={i}
                ref={i === focusIndex ? focus : undefined}
                className={i === current ? 'current' : undefined}
                onClick={onWordClick && (() => onWordClick(i))}
              >
                {w.text}{' '}
              </span>
            );
          })}
        </p>
      ))}
    </div>
  );
}
