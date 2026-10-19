# word-stream

Speed-reading web app: words stream past a fixed focus point so your eyes stay still. Opens PDF, EPUB, DOCX, TXT, HTML, Markdown or pasted text, and runs fully in the browser with nothing uploaded.

<img width="1535" height="687" alt="word-stream screenshot" src="https://github.com/user-attachments/assets/5246af37-be79-4b26-bb93-aeadc1ef499e" />

<img width="1535" height="678" alt="word-stream screenshot" src="https://github.com/user-attachments/assets/93995ada-a9be-4418-b37b-566272e5986f" />

## Features

- **Word ribbon:** the current word stays centered while the words around it flow past, dimmed.
- **Three panels:** the left one builds the page word by word, and the right one shows the full page. Click any word there to jump to it.
- **Controls:** adjustable speed (100–1000 WPM), jump back or forward one sentence, step word by word with the mouse wheel.
- **Saved progress:** reopen the same file and continue where you left off. Speed, theme and text size are remembered too.
- **Private:** files are read in your browser and never uploaded anywhere.

## Getting started

You need [Node.js](https://nodejs.org/) installed.

**Windows:** double-click `start.bat`. It installs the packages the first time, starts the app and opens it in your browser.

**Any OS:**

```
npm install
npm run dev
```

Then open http://localhost:5173.

> Opening `index.html` directly shows a blank page. The app has to run through the dev server.

## Keyboard shortcuts

| Key | Action |
| --- | --- |
| `Space` | Play / pause |
| `←` / `→` | Back / forward one sentence |
| `↑` / `↓` | Speed ±25 WPM |
| `PageUp` / `PageDown` | Previous / next page |
| Mouse wheel over the word | Step one word back / forward |

## Built with

React, TypeScript and Vite. Files are parsed with pdf.js, JSZip, mammoth and marked.
