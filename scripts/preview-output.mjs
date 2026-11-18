import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

export function previewUrl(output) {
  // Wrangler 4.164 can print asset-upload messages even with --json.
  for (const match of output.matchAll(/^\s*\{/gm)) {
    let data;
    try { data = JSON.parse(output.slice(match.index).trim()); } catch { continue; }
    const value = data.preview?.urls?.[0];
    if (typeof value !== 'string') continue;
    const url = new URL(value);
    if (url.protocol !== 'https:' || !url.hostname.endsWith('.workers.dev') || url.username || url.password) {
      throw new Error('Unexpected preview URL');
    }
    return url.href;
  }
  throw new Error('Wrangler output did not contain a preview URL');
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  console.log(previewUrl(readFileSync(process.argv[2], 'utf8')));
}
