import { promises as fs } from 'fs';
import path from 'path';

export async function loadLegacyHtml(filename) {
  const fullPath = path.join(process.cwd(), 'pages', filename);
  const html = await fs.readFile(fullPath, 'utf8');

  const bodyMatch = html.match(/<body([^>]*)>([\s\S]*?)<\/body>/i);
  if (!bodyMatch) {
    return { bodyClass: '', bodyHtml: html };
  }

  const attrChunk = bodyMatch[1] ?? '';
  const bodyClass = (attrChunk.match(/class=["']([^"']*)["']/i)?.[1] ?? '').trim();

  return {
    bodyClass,
    bodyHtml: bodyMatch[2].trim(),
  };
}
