import JSZip from 'jszip';
import { htmlToText } from './html';

/** Returns the title and the text of each chapter, in reading (spine) order. */
export async function parseEpub(data: ArrayBuffer): Promise<{ title: string; chapters: string[] }> {
  const zip = await JSZip.loadAsync(data);
  const read = async (path: string) => {
    const file = zip.file(decodeURIComponent(path));
    if (!file) throw new Error(`EPUB is missing ${path}`);
    return file.async('string');
  };
  const xml = (s: string) => new DOMParser().parseFromString(s, 'application/xml');

  const container = xml(await read('META-INF/container.xml'));
  const opfPath = container.querySelector('rootfile')?.getAttribute('full-path');
  if (!opfPath) throw new Error('Invalid EPUB: no package file.');
  const opf = xml(await read(opfPath));
  const base = opfPath.includes('/') ? opfPath.slice(0, opfPath.lastIndexOf('/') + 1) : '';

  const manifest = new Map<string, string>();
  opf.querySelectorAll('manifest > item').forEach((item) => {
    manifest.set(item.getAttribute('id') ?? '', item.getAttribute('href') ?? '');
  });

  const chapters: string[] = [];
  for (const ref of Array.from(opf.querySelectorAll('spine > itemref'))) {
    const href = manifest.get(ref.getAttribute('idref') ?? '');
    if (!href) continue;
    chapters.push(htmlToText(await read(base + href.split('#')[0])).text);
  }
  const title = opf.getElementsByTagName('dc:title')[0]?.textContent?.trim() ?? '';
  return { title, chapters };
}
