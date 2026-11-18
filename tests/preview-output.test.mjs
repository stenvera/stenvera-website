import { test } from 'node:test';
import assert from 'node:assert/strict';
import { previewUrl } from '../scripts/preview-output.mjs';

const result = JSON.stringify({ preview: { urls: ['https://pr-2.example.workers.dev'] }, deployment: {} }, null, 2);
test('reads clean and noisy Wrangler output', () => {
  assert.equal(previewUrl(result), 'https://pr-2.example.workers.dev/');
  assert.equal(previewUrl(`Uploading 15 assets\n{not json}\nSuccess!\n${result}\n`), 'https://pr-2.example.workers.dev/');
});
test('rejects missing and incomplete results', () => {
  for (const output of ['', '{}', result.slice(0, -5)]) assert.throws(() => previewUrl(output));
});
test('rejects unexpected preview destinations', () => {
  for (const url of ['http://pr-2.example.workers.dev', 'https://evil.example', 'https://user:pass@pr-2.example.workers.dev']) {
    assert.throws(() => previewUrl(JSON.stringify({ preview: { urls: [url] } })));
  }
});
