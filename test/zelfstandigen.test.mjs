// Self-employed section (web/nl/zelfstandigen/, web/fr/independants/): generated pages,
// NL/FR pairs, official sources, metadata rules, template, figures and links.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, access } from 'node:fs/promises';
import path from 'node:path';
import { WEB, SITE, discoverPages } from '../tools/lib/pages.mjs';
import { readMeta, BRAND_SUFFIX } from '../tools/lib/head.mjs';
import { allSectionPages, routeOf } from '../tools/build_zelfstandigen.mjs';
import { PAGES_ORDER, SOURCES } from '../tools/lib/zelfstandigen-content.mjs';

const OFFICIAL = /^https:\/\/(www\.rsvz\.be|www\.inasti\.be|www\.minfin\.fgov\.be)\//;
const pages = await Promise.all(PAGES_ORDER.flatMap(key => ['nl', 'fr'].map(async lang => {
  const route = routeOf(key, lang);
  return { key, lang, route, html: await readFile(path.join(WEB, route, 'index.html'), 'utf8') };
})));
const pair = key => pages.filter(p => p.key === key);
const main = html => html.match(/<main[\s\S]*?<\/main>/)[0];
const text = html => main(html).replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');

test('the committed pages equal the generator output (npm run build:zelfstandigen)', () => {
  for (const page of allSectionPages()) assert.equal(pages.find(p => p.route === page.route).html, page.html, page.route);
});

test('six NL/FR pairs, each with canonical, hreflang nl-BE/fr-BE/x-default and a language switch', async () => {
  assert.equal(pages.length, 12);
  for (const key of PAGES_ORDER) {
    const [nl, fr] = pair(key);
    for (const p of [nl, fr]) {
      assert.ok(p.html.includes(`<link rel="canonical" href="${SITE}/${p.route}">`), p.route);
      assert.ok(p.html.includes(`hreflang="nl-BE" href="${SITE}/${nl.route}"`), p.route);
      assert.ok(p.html.includes(`hreflang="fr-BE" href="${SITE}/${fr.route}"`), p.route);
      assert.ok(p.html.includes(`hreflang="x-default" href="${SITE}/nl/"`), p.route);
      const sw = p.html.match(/<a class="lang-switch" href="([^"]+)"/)[1];
      assert.equal(path.resolve(WEB, p.route, sw), path.resolve(WEB, (p === nl ? fr : nl).route), p.route);
    }
  }
  const discovered = new Set((await discoverPages()).map(p => p.route));
  for (const p of pages) assert.ok(discovered.has(p.route), p.route);
});

test('every page ends with Bronnen / Sources: official URLs with a consultation date, same count in NL and FR', () => {
  for (const key of PAGES_ORDER) {
    const counts = pair(key).map(p => {
      const block = p.html.match(/<section class="card zs-sources" id="bronnen"><h2 class="card-title">(Bronnen|Sources)<\/h2>([\s\S]*?)<\/section>/);
      assert.ok(block, p.route);
      assert.equal(block[1], p.lang === 'nl' ? 'Bronnen' : 'Sources');
      const items = Array.from(block[2].matchAll(/<li><a href="([^"]+)"[^>]*>[^<]+<\/a><span>(Geraadpleegd op|Consulté le) (\d\d-\d\d-2026)<\/span><\/li>/g));
      assert.ok(items.length >= 3, p.route);
      for (const [, url] of items) assert.match(url, OFFICIAL, p.route);
      return items.length;
    });
    assert.equal(counts[0], counts[1], key);
  }
  for (const s of Object.values(SOURCES)) for (const lang of ['nl', 'fr']) assert.match(s[lang][0], OFFICIAL);
});

test('every external link in the content goes to an official source', () => {
  for (const p of pages) for (const [, url] of main(p.html).matchAll(/href="(https?:[^"]+)"/g)) assert.match(url, OFFICIAL, `${p.route}: ${url}`);
});

test('titles and descriptions: native, unique, title ≤ 60 characters, description 140–160', () => {
  const seen = new Set();
  for (const p of pages) {
    const { title, description } = readMeta(p.html);
    assert.ok(title.length <= 60 && title.endsWith(BRAND_SUFFIX), `${p.route}: ${title.length} ${title}`);
    assert.ok(description.length >= 140 && description.length <= 160, `${p.route}: description ${description.length}`);
    for (const v of [title, description]) { assert.ok(!seen.has(v), `${p.route}: duplicate ${v}`); seen.add(v); }
  }
  assert.match(readMeta(pair('bijdragen')[0].html).title, /sociale bijdragen zelfstandige berekenen/i);
  assert.match(readMeta(pair('bijdragen')[1].html).title, /cotisations sociales indépendant/i);
});

test('Mapafiscal autonomos/ template: answer box, pending calculator on topic pages, tables, FAQ, related links, trust line', () => {
  for (const p of pages) {
    const m = main(p.html);
    assert.match(m, /<p class="summary-box slash"><b>(In het kort:|En bref :)<\/b>/, p.route);
    assert.match(m, /<table class="data-table/, p.route);
    assert.match(m, /<section class="card faq" id="faq">[\s\S]*?<details>/, p.route);
    assert.match(m, /<ul class="trust"/, p.route);
    assert.ok(m.indexOf('id="faq"') < m.indexOf('id="bronnen"'), p.route);
    const calc = m.match(/<form class="quickcalc zs-calc"[\s\S]*?<\/form>/);
    if (p.key === 'index') { assert.equal(calc, null, p.route); assert.equal((m.match(/<table /g) || []).length, 2, p.route); continue; }
    assert.ok(calc, p.route);
    const res = calc[0].slice(calc[0].indexOf('<div class="quickcalc-res"'));
    assert.match(res, /<span class="figure-xl" aria-hidden="true">—<\/span>/, p.route);
    assert.doesNotMatch(res.replace(/<[^>]+>/g, ' ').replace(/2026/g, ''), /\d/, `${p.route}: the pending calculator shows a figure`);
  }
});

test('NL and FR pages of a pair have the same structure', () => {
  const shape = html => ({
    cards: (main(html).match(/<section class="card/g) || []).length,
    rows: (main(html).match(/<tr>/g) || []).length,
    faq: (main(html).match(/<details>/g) || []).length,
    li: (main(html).match(/<li>/g) || []).length,
    fields: Array.from(html.matchAll(/name="([^"]+)"/g), m => m[1]).join(),
    options: Array.from(html.matchAll(/<option value="([^"]+)"/g), m => m[1]).join(),
    ids: Array.from(html.matchAll(/\sid="([^"]+)"/g), m => m[1]).join()
  });
  for (const key of PAGES_ORDER) { const [nl, fr] = pair(key); assert.deepEqual(shape(fr.html), shape(nl.html), key); }
});

test('figures are only the ones RSVZ/INASTI publish for 2026, and no net amount is shown', () => {
  const allowed = new Set(['20,50', '14,16', '75.024,54', '110.562,42', '17.374,08', '890,42', '5.103,05', '771,90', '1,07236269',
    '1.922,16', '98,51', '7.632,44', '391,16', '3.000', '500', '2.000']);
  for (const p of pages) {
    const t = text(p.html);
    for (const [n] of t.matchAll(/\d[\d.]*,\d+|\d{1,3}(?:\.\d{3})+/g)) assert.ok(allowed.has(n), `${p.route}: unsourced figure ${n}`);
    for (const [, n] of t.matchAll(/(\d[\d.,]*)\s?(?:euro|EUR|€)/g)) assert.ok(allowed.has(n), `${p.route}: unsourced amount ${n}`);
    assert.doesNotMatch(t, /nettoloon van|salaire net de|netto-inkomen van|revenu net de/i, p.route);
    assert.doesNotMatch(t, /in ontwikkeling|en développement|binnenkort|bientôt|eerste versie|première version/i, p.route);
  }
});

test('one language per page and no Spanish strings or Mapafiscal branding', () => {
  const spanish = /IRPF|autónom|cuota|Hacienda|España|Mapafiscal|Seguridad Social|RETA\b|estimación|rendimiento|ejercicio|\bpara\b|\bcómo\b|ñ/i;
  for (const p of pages) {
    assert.doesNotMatch(p.html, spanish, p.route);
    const t = text(p.html);
    if (p.lang === 'nl') assert.doesNotMatch(t, /\b(cotisation|indépendant|les|des|vous)\b/i, p.route);
    else assert.doesNotMatch(t, /\b(zelfstandige|bijdragen|het|een|jouw)\b/i, p.route);
  }
});

test('internal links resolve and the home page links the section', async () => {
  for (const p of pages) for (const [, ref] of p.html.matchAll(/(?:href|src)="([^"]+)"/g)) {
    if (/^(https?:|mailto:|#)/.test(ref)) continue;
    const clean = ref.split('#')[0];
    let target = path.resolve(WEB, p.route, clean);
    if (clean.endsWith('/') || clean === '') target = path.join(target, 'index.html');
    await access(target).catch(() => assert.fail(`${p.route}: ${ref} does not resolve`));
  }
  for (const [lang, slug] of [['nl', 'zelfstandigen/'], ['fr', 'independants/']])
    assert.ok((await readFile(path.join(WEB, lang, 'index.html'), 'utf8')).includes(`href="${slug}"`), lang);
});

test('every page of the section is reachable from its index', () => {
  for (const lang of ['nl', 'fr']) {
    const index = pages.find(p => p.key === 'index' && p.lang === lang).html;
    for (const key of PAGES_ORDER.slice(1)) assert.ok(index.includes(`href="../../${routeOf(key, lang)}"`), `${lang} ${key}`);
  }
});
