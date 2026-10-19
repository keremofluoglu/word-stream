import { useState } from 'react';
import type { Doc } from './core/document';
import { useSettings } from './hooks/useSettings';
import { FileDrop } from './components/FileDrop';
import { Reader } from './components/Reader';

export function App() {
  const [settings, updateSettings] = useSettings();
  const [doc, setDoc] = useState<Doc | null>(null);

  return (
    <div className="app">
      <header className="topbar">
        <strong className="title">{doc ? doc.title : 'Fast Text Reader'}</strong>
        {doc && <button onClick={() => setDoc(null)}>Open another</button>}
        <label className="font-size">
          <span>Text size</span>
          <input
            type="range"
            min={24}
            max={96}
            step={4}
            value={settings.fontSize}
            onChange={(e) => updateSettings({ fontSize: Number(e.target.value) })}
          />
        </label>
        <button onClick={() => updateSettings({ theme: settings.theme === 'dark' ? 'light' : 'dark' })}>
          {settings.theme === 'dark' ? '☀ Light' : '☾ Dark'}
        </button>
      </header>
      {doc ? (
        <Reader key={doc.id} doc={doc} settings={settings} onSettings={updateSettings} />
      ) : (
        <FileDrop onLoad={setDoc} />
      )}
    </div>
  );
}
