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

// Every page with a municipality field uses the official municipality picker (gemeente-kiezer).
test('pages with a municipality field load the picker script and CSS and use its markup', async () => {
  const { readdir } = await import('node:fs/promises');
  const pages = [];
  for (const lang of ['nl', 'fr']) {
    pages.push(lang + '/');
    for (const d of await readdir(new URL('../web/' + lang + '/', import.meta.url), { withFileTypes: true }))
      if (d.isDirectory()) pages.push(lang + '/' + d.name + '/');
  }
  let count = 0;
  for (const route of pages) {
    let html;
    try { html = await readFile(new URL('../web/' + route + 'index.html', import.meta.url), 'utf8'); } catch { continue; }
    if (!/name="(municipality|changeMunicipality)"/.test(html)) continue;
    count++;
    const up = route.split('/').length === 2 ? '../' : '../../';
    assert.ok(html.includes(`<link rel="stylesheet" href="${up}css/gemeente-kiezer.css">`), route + ' CSS');
    assert.ok(html.includes(`<script defer src="${up}js/gemeente-kiezer.js"></script>`), route + ' script');
    assert.ok(html.indexOf('css/site.css') < html.indexOf('css/gemeente-kiezer.css'), route + ' CSS order');
    for (const m of html.matchAll(/<input id="([^"]+)" name="(municipality|changeMunicipality|qcMunicipality)"[^>]*>/g)) {
      assert.match(m[0], /role="combobox"/, route + ' ' + m[1]);
      assert.match(m[0], new RegExp(`aria-controls="${m[1]}-list"`), route);
      assert.ok(html.includes(`<ul id="${m[1]}-list" class="gk-list" role="listbox"`), route + ' listbox');
      assert.ok(html.includes(`name="${m[2]}Nis" data-gk-nis`) && html.includes(`name="${m[2]}Region" data-gk-region`), route + ' hidden fields');
      assert.ok(html.includes(`<p class="help" id="${m[1]}-help">`), route + ' help below the field');
    }
    for (const sel of html.matchAll(/data-region-select='#([\w-]+)/g)) assert.ok(html.includes(`id="${sel[1]}"`), route + ' region select ' + sel[1]);
    assert.doesNotMatch(html, /<input name="(municipality|changeMunicipality)"[^>]*type="text"/, route + ' free-text municipality left');
  }
  assert.ok(count >= 12, 'home pages and tools in both languages: ' + count);
  for (const lang of ['nl', 'fr']) {
    const home = await readFile(new URL(`../web/${lang}/index.html`, import.meta.url), 'utf8');
    assert.match(home, /id="qc-gemeente"/);
    assert.match(home, /data-region-select='#qc-region' data-gk-sync/);
    assert.match(home, /data-region-select='#salary-form select\[name="region"\]' data-gk-sync/);
  }
});
