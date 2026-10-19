import { marked } from 'marked';
import type { Doc } from '../core/document';
import { buildDoc } from '../core/paginate';
import { htmlToText } from './html';
import { parseEpub } from './epub';

// PDF and DOCX libraries are large, so they load only when such a file is opened.

export const ACCEPTED = '.pdf,.epub,.txt,.docx,.html,.htm,.md,.markdown';

export async function parseFile(file: File): Promise<Doc> {
  const ext = file.name.split('.').pop()?.toLowerCase() ?? '';
  const name = file.name.replace(/\.[^.]+$/, '');
  switch (ext) {
    case 'pdf': {
      const { parsePdf } = await import('./pdf');
      return buildDoc(name, await parsePdf(await file.arrayBuffer()), false);
    }
    case 'epub': {
      const { title, chapters } = await parseEpub(await file.arrayBuffer());
      return buildDoc(title || name, chapters, true);
    }
    case 'docx': {
      const { default: mammoth } = await import('mammoth');
      const { value } = await mammoth.extractRawText({ arrayBuffer: await file.arrayBuffer() });
      return buildDoc(name, [value], true);
    }
    case 'html':
    case 'htm': {
      const { title, text } = htmlToText(await file.text());
      return buildDoc(title || name, [text], true);
    }
    case 'md':
    case 'markdown':
      return buildDoc(name, [htmlToText(await marked.parse(await file.text())).text], true);
    case 'txt':
      return buildDoc(name, [await file.text()], true);
    default:
      throw new Error(`Unsupported file type: .${ext}`);
  }
}

export function parseText(text: string): Doc {
  const firstLine = text.trim().split('\n')[0].slice(0, 60);
  return buildDoc(firstLine || 'Pasted text', [text], true);
}

export async function parseUrl(url: string): Promise<Doc> {
  let res: Response;
  try {
    res = await fetch(url);
  } catch {
    throw new Error('This site does not allow other websites to load its pages. Copy the text and paste it instead.');
  }
  if (!res.ok) throw new Error(`Could not load the page (HTTP ${res.status}).`);
  const body = await res.text();
  if (!(res.headers.get('content-type') ?? '').includes('html')) return buildDoc(url, [body], true);
  const { title, text } = htmlToText(body);
  return buildDoc(title || url, [text], true);
}
