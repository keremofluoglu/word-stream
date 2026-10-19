import { useState } from 'react';
import type { Doc } from '../core/document';
import { ACCEPTED, parseFile, parseText, parseUrl } from '../parsers';

interface Props {
  onLoad: (doc: Doc) => void;
}

export function FileDrop({ onLoad }: Props) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [dragging, setDragging] = useState(false);
  const [text, setText] = useState('');
  const [url, setUrl] = useState('');

  const run = async (task: () => Promise<Doc> | Doc) => {
    setBusy(true);
    setError('');
    try {
      onLoad(await task());
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="landing">
      <h1>Fast Text Reader</h1>
      <p className="muted">Fix your eyes on one spot and let the words come to you.</p>

      <label
        className={`dropzone${dragging ? ' dragging' : ''}`}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          const file = e.dataTransfer.files[0];
          if (file) run(() => parseFile(file));
        }}
      >
        <input
          type="file"
          accept={ACCEPTED}
          hidden
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) run(() => parseFile(file));
            e.target.value = '';
          }}
        />
        <strong>Drop a file here or click to choose</strong>
        <span className="muted">PDF, EPUB, DOCX, TXT, HTML, Markdown</span>
      </label>

      <div className="or">or paste text</div>
      <textarea value={text} onChange={(e) => setText(e.target.value)} placeholder="Paste any text…" rows={6} />
      <button disabled={!text.trim() || busy} onClick={() => run(() => parseText(text))}>
        Read pasted text
      </button>

      <div className="or">or load a web page</div>
      <div className="row">
        <input type="url" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://…" />
        <button disabled={!url.trim() || busy} onClick={() => run(() => parseUrl(url.trim()))}>
          Load
        </button>
      </div>

      {busy && <p className="muted">Reading document…</p>}
      {error && <p className="error">{error}</p>}
    </div>
  );
}
