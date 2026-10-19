import { useEffect, useRef } from 'react';
import { nextSentenceStart, pageOf, pageRange, previousSentenceStart, type Doc } from '../core/document';
import { usePlayer } from '../hooks/usePlayer';
import { savedPosition, useProgress } from '../hooks/useProgress';
import type { Settings } from '../hooks/useSettings';
import { Controls, MAX_WPM, MIN_WPM } from './Controls';
import { PageText } from './PageText';
import { WordStage } from './WordStage';

/** Words shown on each side of the current word; more than ever fit, the strip clips the rest. */
const RIBBON_WORDS = 20;

function joinWords(doc: Doc, from: number, to: number): string {
  return doc.words.slice(Math.max(0, from), to).map((w) => w.text).join(' ');
}

interface Props {
  doc: Doc;
  settings: Settings;
  onSettings: (patch: Partial<Settings>) => void;
}

export function Reader({ doc, settings, onSettings }: Props) {
  const { index, setIndex, playing, setPlaying } = usePlayer(doc, settings.wpm, () => savedPosition(doc.id));
  useProgress(doc.id, index, playing);

  const page = pageOf(doc, index);
  const [pageStart, pageEnd] = pageRange(doc, page);

  const actions = {
    togglePlay: () => setPlaying(!playing),
    backSentence: () => setIndex(previousSentenceStart(doc, index)),
    forwardSentence: () => setIndex(nextSentenceStart(doc, index)),
    goPage: (p: number) => setIndex(doc.pageStarts[Math.max(0, Math.min(doc.pageStarts.length - 1, p))]),
    setWpm: (wpm: number) => onSettings({ wpm: Math.max(MIN_WPM, Math.min(MAX_WPM, wpm)) }),
    step: (dir: number) => {
      setPlaying(false);
      setIndex(index + dir);
    },
  };
  const actionsRef = useRef(actions);
  actionsRef.current = actions;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('input, textarea, button, select')) return;
      const a = actionsRef.current;
      const map: Record<string, () => void> = {
        ' ': a.togglePlay,
        ArrowLeft: a.backSentence,
        ArrowRight: a.forwardSentence,
        ArrowUp: () => a.setWpm(settings.wpm + 25),
        ArrowDown: () => a.setWpm(settings.wpm - 25),
        PageUp: () => a.goPage(page - 1),
        PageDown: () => a.goPage(page + 1),
      };
      const fn = map[e.key];
      if (fn) {
        e.preventDefault();
        fn();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [settings.wpm, page]);

  return (
    <main className="reader">
      <section className="panel side">
        <h2>Reading</h2>
        <PageText words={doc.words.slice(pageStart, index + 1)} offset={pageStart} />
      </section>

      <section className="center-col">
        <WordStage
          word={doc.words[index].text}
          before={joinWords(doc, index - RIBBON_WORDS, index)}
          after={joinWords(doc, index + 1, index + 1 + RIBBON_WORDS)}
          fontSize={settings.fontSize} onStep={actions.step} />
        <Controls
          playing={playing}
          wpm={settings.wpm}
          index={index}
          total={doc.words.length}
          page={page}
          pageCount={doc.pageStarts.length}
          onTogglePlay={actions.togglePlay}
          onBackSentence={actions.backSentence}
          onForwardSentence={actions.forwardSentence}
          onPage={actions.goPage}
          onSeek={setIndex}
          onWpm={actions.setWpm}
        />
      </section>

      <section className="panel side">
        <h2>Full page</h2>
        <PageText words={doc.words.slice(pageStart, pageEnd)} offset={pageStart} current={index} onWordClick={setIndex} />
      </section>
    </main>
  );
}
