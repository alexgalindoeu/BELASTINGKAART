import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

for (const language of ['nl', 'fr']) {
  test(language + ' page references only the canonical web asset tree', async () => {
    const html = await readFile(new URL('../web/' + language + '/index.html', import.meta.url), 'utf8');
    for (const path of ['../css/site.css','../js/i18n.js','../js/tax-engine.js','../js/parameters.js','../js/app.js']) {
      assert.ok(html.includes(path), language + ' missing ' + path);
    }
    assert.ok(html.indexOf('parameters.js') < html.indexOf('app.js'));
  });
}

test('the deployed root routes to the Dutch language page', async () => {
  const html = await readFile(new URL('../web/index.html', import.meta.url), 'utf8');
  assert.match(html, /url=nl\//);
});
