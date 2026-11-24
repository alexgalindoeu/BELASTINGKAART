import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

for (const language of ['nl', 'fr']) {
  test(language + ' page loads parameters before the app', async () => {
    const html = await readFile(new URL('../web/' + language + '/index.html', import.meta.url), 'utf8');
    assert.ok(html.indexOf('parameters.js') < html.indexOf('app.js'));
    assert.match(html, /data-lang=/);
  });
}

test('deployable root sends visitors to the Dutch landing page', async () => {
  const html = await readFile(new URL('../web/index.html', import.meta.url), 'utf8');
  assert.match(html, /url=nl\//);
});
