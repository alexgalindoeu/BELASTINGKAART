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
    for (const field of ['grossMonthly','region','municipality','familyStatus','children','employment','incomeYear','assessmentYear','paidMonths']) {
      assert.ok(html.includes('name=\"' + field + '\"'), language + ' missing form field ' + field);
    }
    assert.ok(!html.includes('name=\"family\"'), language + ' still uses the legacy family field');
    assert.ok(!html.includes('name=\"taxYear\"'), language + ' still uses the legacy taxYear field');
    assert.match(html, /data-lang=/);
  });
}

test('the deployed root chooses the language client side and stays crawlable', async () => {
  const html = await readFile(new URL('../web/index.html', import.meta.url), 'utf8');
  // No meta refresh to a single language: the choice is made by js/taal.js (saved choice, browser languages, Dutch).
  assert.doesNotMatch(html, /http-equiv="refresh"/i);
  assert.match(html, /<script src="js\/taal\.js"><\/script>/);
  assert.match(html, /location\.replace\(window\.BKTaal\.detect\(\)/);
  // Crawlers and visitors without JavaScript get plain links to both languages and the hreflang cluster.
  assert.match(html, /<a href="nl\/" hreflang="nl-BE" lang="nl">Nederlands<\/a>/);
  assert.match(html, /<a href="fr\/" hreflang="fr-BE" lang="fr">Français<\/a>/);
  for (const [lang, route] of [['nl-BE', 'nl/'], ['fr-BE', 'fr/'], ['x-default', 'nl/']])
    assert.ok(html.includes(`<link rel="alternate" hreflang="${lang}" href="https://belastingkaart.be/${route}">`), lang);
});
