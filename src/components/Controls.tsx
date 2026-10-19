interface Props {
  playing: boolean;
  wpm: number;
  index: number;
  total: number;
  page: number;
  pageCount: number;
  onTogglePlay: () => void;
  onBackSentence: () => void;
  onForwardSentence: () => void;
  onPage: (page: number) => void;
  onSeek: (index: number) => void;
  onWpm: (wpm: number) => void;
}

export const MIN_WPM = 100;
export const MAX_WPM = 1000;

export function Controls(p: Props) {
  const minutesLeft = Math.ceil((p.total - 1 - p.index) / p.wpm);
  return (
    <div className="controls">
      <div className="row center">
        <button onClick={p.onBackSentence} title="Back one sentence (←)">⏮ Sentence</button>
        <button className="primary" onClick={p.onTogglePlay} title="Play / pause (Space)">
          {p.playing ? '❚❚ Pause' : '▶ Play'}
        </button>
        <button onClick={p.onForwardSentence} title="Forward one sentence (→)">Sentence ⏭</button>
      </div>

      <label className="row">
        <span className="label">Speed</span>
        <input
          type="range"
          min={MIN_WPM}
          max={MAX_WPM}
          step={25}
          value={p.wpm}
          onChange={(e) => p.onWpm(Number(e.target.value))}
        />
        <span className="value">{p.wpm} WPM</span>
      </label>

      <label className="row">
        <span className="label">Position</span>
        <input type="range" min={0} max={p.total - 1} value={p.index} onChange={(e) => p.onSeek(Number(e.target.value))} />
        <span className="value">{Math.round(((p.index + 1) / p.total) * 100)}%</span>
      </label>

      <div className="row center muted">
        <button onClick={() => p.onPage(p.page - 1)} disabled={p.page === 0} title="Previous page (PageUp)">‹</button>
        <span>Page {p.page + 1} / {p.pageCount}</span>
        <button onClick={() => p.onPage(p.page + 1)} disabled={p.page >= p.pageCount - 1} title="Next page (PageDown)">›</button>
        <span>· {minutesLeft} min left</span>
      </div>
    </div>
  );
}
