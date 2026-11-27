// Pension-savings section (nl/pensioensparen/, fr/epargne-pension/): pairs and hreflang,
// official Fisconet sources on every page, metadata rules, language purity, only sourced
// figures, internal links, the Mapafiscal pension template and the generator in sync.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, access } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import path from 'node:path';
import { WEB, SITE } from '../tools/lib/pages.mjs';
import { readMeta } from '../tools/lib/head.mjs';

const ROOT = path.resolve(WEB, '..');
const PAIRS = [
  ['nl/pensioensparen/', 'fr/epargne-pension/'],
  ['nl/pensioensparen/belastingvermindering/', 'fr/epargne-pension/reduction-d-impot/'],
  ['nl/pensioensparen/anticipatieve-heffing/', 'fr/epargne-pension/taxe-a-60-ans/'],
  ['nl/pensioensparen/langetermijnsparen/', 'fr/epargne-pension/epargne-a-long-terme/'],
  ['nl/pensioensparen/vervroegd-opnemen/', 'fr/epargne-pension/retrait-anticipe/']
];
const ROUTES = PAIRS.flat();
const LOG = 'docs/sources/pensioensparen_2026-11-27.md';
const read = route => readFile(path.join(WEB, route, 'index.html'), 'utf8');
const main = html => html.match(/<main[\s\S]*?<\/main>/)[0];
const text = html => html.replace(/<script[\s\S]*?<\/script>/g, ' ').replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ');
const FISCONET = /^https:\/\/www\.minfin\.fgov\.be\/myminfin-web\/pages\/public\/fisconet\/document\/[0-9a-f-]{36}$/;

test('every page exists, points to itself and to its translation (canonical, hreflang, switch)', async () => {
  for (const [nl, fr] of PAIRS) for (const [route, other] of [[nl, fr], [fr, nl]]) {
    const html = await read(route);
    assert.match(html, new RegExp(`<html lang="${route.slice(0, 2)}">`), route);
    assert.ok(html.includes(`<link rel="canonical" href="${SITE}/${route}">`), route);
    assert.ok(html.includes(`hreflang="nl-BE" href="${SITE}/${nl}"`), route);
    assert.ok(html.includes(`hreflang="fr-BE" href="${SITE}/${fr}"`), route);
    assert.ok(html.includes(`hreflang="x-default" href="${SITE}/nl/"`), route);
    const sw = html.match(/<a class="lang-switch" href="([^"]+)"/)[1];
    assert.equal(path.resolve(WEB, route, sw), path.resolve(WEB, other), route);
  }
});

test('every page ends with official Fisconet sources consulted on 27-11-2026, all in the source log', async () => {
  const log = await readFile(path.join(ROOT, LOG), 'utf8');
  for (const route of ROUTES) {
    const body = main(await read(route));
    const sources = body.match(/<section class="card sources">[\s\S]*?<\/section>/)?.[0];
    assert.ok(sources, route + ' has a sources card');
    assert.match(sources, route.startsWith('nl') ? /<h2 class="card-title">Bronnen<\/h2>/ : /<h2 class="card-title">Sources<\/h2>/, route);
    assert.ok(body.lastIndexOf('class="card sources"') > body.lastIndexOf('class="card faq"'), route + ': sources come last');
    assert.match(body, /<\/section>\s*<\/div>\s*<\/main>$/, route + ': nothing after the sources');
    const items = Array.from(sources.matchAll(/<li><a href="([^"]+)"[^>]*>[^<]+<\/a><span>([^<]+)<\/span><\/li>/g));
    assert.ok(items.length >= 4, route);
    for (const [, url, meta] of items) {
      assert.match(url, FISCONET, `${route}: ${url}`);
      assert.match(meta, /27-11-2026/, `${route}: ${url}`);
      assert.ok(meta.includes(url), `${route}: the URL is printed next to the link`);
      assert.ok(log.includes(url.split('/').pop()), `${route}: ${url} is in ${LOG}`);
    }
    for (const [, url] of body.matchAll(/href="(https?:[^"]+)"/g)) assert.match(url, FISCONET, `${route}: ${url}`);
  }
});

test('titles and descriptions are native, unique and within the limits', async () => {
  const titles = new Set(), descriptions = new Set();
  for (const route of ROUTES) {
    const { title, description } = readMeta(await read(route));
    assert.ok(title.length <= 60, `${route}: title ${title.length}`);
    assert.ok(description.length >= 140 && description.length <= 160, `${route}: description ${description.length}`);
    assert.ok(!titles.has(title) && !descriptions.has(description), route);
    titles.add(title); descriptions.add(description);
  }
  assert.match(readMeta(await read('nl/pensioensparen/')).title, /^Pensioensparen belastingvoordeel 2026/);
  assert.match(readMeta(await read('fr/epargne-pension/')).title, /^Épargne-pension avantage fiscal/);
});

test('one language per page: no Spanish, no Mapafiscal leftovers, no unfinished wording, no cross-language terms', async () => {
  const bad = /IRPF|Hacienda|España|plan de pensiones|rescate|jubilación|Mapafiscal|in ontwikkeling|en développement|binnenkort|bientôt/i;
  for (const route of ROUTES) {
    const body = text(main(await read(route)));
    assert.doesNotMatch(body, bad, route);
    if (route.startsWith('nl')) assert.doesNotMatch(body, /épargne|réduction d’impôt|taxe sur/i, route);
    else assert.doesNotMatch(body, /pensioensparen|belastingvermindering|spaarverzekering|langetermijnsparen/i, route);
  }
});

test('only the sourced legal figures appear: no personal or computed amounts', async () => {
  const EUR = new Set(['625', '800', '1.050', '1.350', '1.680', '2.040', '2.450']);
  const PCT = new Set(['1', '6', '8', '10', '15', '25', '30', '33']);
  for (const route of ROUTES) {
    const body = text(main(await read(route)));
    for (const [, n] of body.matchAll(/(\d[\d.]*)\s?euros?\b/g)) assert.ok(EUR.has(n), `${route}: ${n} euro`);
    for (const [, n] of body.matchAll(/(\d[\d.,]*)\s?%/g)) assert.ok(PCT.has(n), `${route}: ${n} %`);
    assert.doesNotMatch(body, /€/, route);
  }
});

test('internal links, styles and scripts resolve; the section stylesheet is linked only here', async () => {
  for (const route of ROUTES) {
    const html = await read(route);
    for (const [, ref] of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
      if (/^(https?:|mailto:|#)/.test(ref)) continue;
      const clean = ref.split('#')[0];
      let target = path.resolve(WEB, route, clean);
      if (clean.endsWith('/')) target = path.join(target, 'index.html');
      await access(target).catch(() => assert.fail(`${route}: ${ref} does not resolve`));
    }
    assert.match(html, /css\/components\.css">\n<link rel="stylesheet" href="(\.\.\/)+css\/pensioensparen\.css">/, route);
  }
  assert.doesNotMatch(await read('nl/wonen/'), /pensioensparen\.css/);
});

// Mapafiscal web/rescate-plan-pensiones/: index = rules card, table card, two buttons, FAQ, trust
// line; topic page = table card, rules card, two buttons, FAQ, trust line. Sources card last.
const blocks = html => Array.from(main(html).matchAll(/<(?:section|div) class="(card[^"]*)"|<p class="(page-actions)"|<ul class="(trust)"/g), m => m[1] || m[2] || m[3]);
test('the pages follow the Mapafiscal pension template, identically in NL and FR', async () => {
  assert.deepEqual(blocks(await read('nl/pensioensparen/')), ['card rules', 'card table-card', 'page-actions', 'card faq', 'trust', 'card sources']);
  for (const [nl, fr] of PAIRS) {
    const a = blocks(await read(nl));
    assert.deepEqual(blocks(await read(fr)), a, nl);
    if (nl !== 'nl/pensioensparen/') assert.deepEqual(a, ['card table-card', 'card rules', 'page-actions', 'card faq', 'trust', 'card sources'], nl);
    // the sources card may differ (the NL pages also cite the Dutch-only parliamentary question)
    const [m1, m2] = [main(await read(nl)), main(await read(fr))].map(m => m.replace(/<section class="card sources">[\s\S]*?<\/section>/, ''));
    for (const re of [/<details>/g, /<li>/g, /<tr>/g, /<p class="cite">/g, /<a class="btn /g])
      assert.equal((m1.match(re) || []).length, (m2.match(re) || []).length, `${nl}: ${re}`);
    assert.ok((m1.match(/<details>/g) || []).length >= 4, nl + ': at least four FAQ items');
    assert.match(m1, /<p class="lead">[\s\S]*?<b>/, nl + ': lead with key figures');
  }
});

test('the section is in the menu registry in both languages', async () => {
  const menu = await readFile(path.join(WEB, 'js/menu.js'), 'utf8');
  assert.match(menu, /href: "pensioensparen\/", icon: "pension"/);
  assert.match(menu, /href: "epargne-pension\/", icon: "pension"/);
});

test('the committed pages match tools/build_pensioensparen.mjs', () => {
  execFileSync(process.execPath, [path.join(ROOT, 'tools/build_pensioensparen.mjs'), '--check'], { stdio: 'pipe' });
});
