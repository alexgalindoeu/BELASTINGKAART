import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

for (const language of ['nl', 'fr']) {
  test(language + ' page loads shared modules before the app', async () => {
    const html = await readFile(new URL('../web/' + language + '/index.html', import.meta.url), 'utf8');
    const required = ['../config.js','../js/i18n.js','../js/ui.js','../js/bruto.js',
      '../js/escenarios.js','../js/csv.js','../js/analitica.js','../js/anuncios.js',
      '../js/tax-engine.js','../js/parameters.js','../js/app.js'];
    for (const path of required) assert.ok(html.includes(path), language + ' missing ' + path);
    assert.ok(html.indexOf('parameters.js') < html.indexOf('app.js'));
    assert.ok(html.indexOf('bruto.js') < html.indexOf('app.js'));
    assert.match(html, /data-lang=/);
  });
}

test('the deployed root routes to the Dutch language page', async () => {
  const html = await readFile(new URL('../web/index.html', import.meta.url), 'utf8');
  assert.match(html, /url=nl\//);
});
