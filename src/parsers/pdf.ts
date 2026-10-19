import * as pdfjs from 'pdfjs-dist';
import workerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url';

pdfjs.GlobalWorkerOptions.workerSrc = workerUrl;

/** Returns the text of each PDF page. Line-end hyphenation is joined back together. */
export async function parsePdf(data: ArrayBuffer): Promise<string[]> {
  const pdf = await pdfjs.getDocument({ data }).promise;
  const pages: string[] = [];
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    let text = '';
    for (const item of content.items) {
      if (!('str' in item)) continue;
      if (item.hasEOL && item.str.endsWith('-')) text += item.str.slice(0, -1);
      else text += item.str + (item.hasEOL ? '\n' : '');
    }
    pages.push(text);
  }
  return pages;
}
