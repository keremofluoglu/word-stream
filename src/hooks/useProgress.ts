import { useEffect, useRef } from 'react';
import { load, save } from './storage';

const KEY = 'ftr.progress';
const SAVE_INTERVAL_MS = 5000;

export function savedPosition(docId: string): number {
  return load<Record<string, number>>(KEY, {})[docId] ?? 0;
}

function store(docId: string, index: number) {
  save(KEY, { ...load<Record<string, number>>(KEY, {}), [docId]: index });
}

/** Saves the reading position on pause, every few seconds while playing, and when the page closes. */
export function useProgress(docId: string, index: number, playing: boolean) {
  const lastSave = useRef(0);
  const latest = useRef(index);
  latest.current = index;

  useEffect(() => {
    const now = Date.now();
    if (!playing || now - lastSave.current > SAVE_INTERVAL_MS) {
      store(docId, index);
      lastSave.current = now;
    }
  }, [docId, index, playing]);

  useEffect(() => {
    const flush = () => store(docId, latest.current);
    window.addEventListener('beforeunload', flush);
    return () => {
      flush();
      window.removeEventListener('beforeunload', flush);
    };
  }, [docId]);
}
