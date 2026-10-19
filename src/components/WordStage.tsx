import { useEffect, useRef } from 'react';

interface Props {
  word: string;
  before: string;
  after: string;
  fontSize: number;
  /** Called with -1 (back) or +1 (forward) per mouse wheel notch. */
  onStep: (dir: number) => void;
}

const PIXELS_PER_STEP = 100;

export function WordStage({ word, before, after, fontSize, onStep }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const onStepRef = useRef(onStep);
  onStepRef.current = onStep;

  useEffect(() => {
    const el = ref.current!;
    let acc = 0;
    const handler = (e: WheelEvent) => {
      e.preventDefault();
      // Line/page deltas are one notch each; pixel deltas (trackpads) are accumulated.
      acc += e.deltaMode === 0 ? e.deltaY : Math.sign(e.deltaY) * PIXELS_PER_STEP;
      while (Math.abs(acc) >= PIXELS_PER_STEP) {
        const dir = Math.sign(acc);
        onStepRef.current(dir);
        acc -= dir * PIXELS_PER_STEP;
      }
    };
    el.addEventListener('wheel', handler, { passive: false });
    return () => el.removeEventListener('wheel', handler);
  }, []);

  return (
    <div className="stage" ref={ref} title="Scroll to step through words">
      <div className="guide top" />
      <div className="line" style={{ fontSize }}>
        <span className="neighbor prev">{before}</span>
        <span className="word">{word}</span>
        <span className="neighbor next">{after}</span>
      </div>
      <div className="guide bottom" />
    </div>
  );
}
