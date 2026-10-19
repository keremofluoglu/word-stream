import { useEffect, useState } from 'react';
import { load, save } from './storage';

export interface Settings {
  wpm: number;
  theme: 'light' | 'dark';
  fontSize: number;
}

const KEY = 'ftr.settings';

function defaults(): Settings {
  const dark = window.matchMedia?.('(prefers-color-scheme: dark)').matches;
  return { wpm: 300, theme: dark ? 'dark' : 'light', fontSize: 48 };
}

export function useSettings() {
  const [settings, setSettings] = useState<Settings>(() => ({ ...defaults(), ...load<Partial<Settings>>(KEY, {}) }));

  useEffect(() => {
    save(KEY, settings);
    document.documentElement.dataset.theme = settings.theme;
  }, [settings]);

  const update = (patch: Partial<Settings>) => setSettings((s) => ({ ...s, ...patch }));
  return [settings, update] as const;
}
