// Housing section (nl/wonen/, fr/logement/): pairs, official sources, metadata, template
// (same component order as Mapafiscal's web/vivienda/), no Spanish or unfinished wording,
// and the generator tools/build_wonen.mjs in sync with the committed pages.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, access } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import path from 'node:path';
import { WEB, SITE } from '../tools/lib/pages.mjs';
import { readMeta } from '../tools/lib/head.mjs';

const ROOT = path.resolve(WEB, '..');
const PAIRS = [
  ['nl/wonen/', 'fr/logement/'],
  ['nl/wonen/registratiebelasting/', 'fr/logement/droits-d-enregistrement/'],
  ['nl/wonen/woonbonus/', 'fr/logement/bonus-logement/'],
  ['nl/wonen/onroerende-voorheffing/', 'fr/logement/precompte-immobilier/'],
  ['nl/wonen/nakijken/', 'fr/logement/verifier/']
];
const ROUTES = PAIRS.flat();
const read = route => readFile(path.join(WEB, route, 'index.html'), 'utf8');
const main = html => html.match(/<main[\s\S]*?<\/main>/)[0];
const text = html => html.replace(/<script[\s\S]*?<\/script>/g, ' ').replace(/<[^>]+>/g, ' ');
// Official hosts only: Flemish government, its tax portal, and the federal and Flemish login portals.
const OFFICIAL = /^https:\/\/(www\.vlaanderen\.be|belastingen\.fenb\.be|www\.myminfin\.be|www\.burgerprofiel\.be)(\/|$)/;

test('every housing page exists, points to itself and to its translation', async () => {
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

test('every housing page ends with official sources consulted on 25-11-2026', async () => {
  const log = await readFile(path.join(ROOT, 'docs/sources/wonen_2026-11-25.md'), 'utf8');
  for (const route of ROUTES) {
    const body = main(await read(route));
    const sources = body.match(/<section class="card sources">[\s\S]*?<\/section>/)?.[0];
    assert.ok(sources, route + ' has a sources card');
    assert.ok(body.trimEnd().replace(/\s*<\/div>\s*<\/main>$/, '').endsWith('</section>') && body.lastIndexOf('class="card sources"') > body.lastIndexOf('class="card faq"'), route + ': sources come last');
    const items = Array.from(sources.matchAll(/<li><a href="([^"]+)"[^>]*>(?:[^<]|<span lang="(?:nl|fr)">[^<]*<\/span>)+<\/a><span>([^<]+)<\/span><\/li>/g));
    assert.ok(items.length >= 3, route);
    for (const [, url, meta] of items) {
      assert.match(url, OFFICIAL, `${route}: ${url}`);
      assert.match(meta, /25-11-2026/, `${route}: ${url}`);
      assert.ok(meta.includes(url), `${route}: the URL is printed next to the link`);
      assert.ok(log.includes(url), `${route}: ${url} is in docs/sources/wonen_2026-11-25.md`);
    }
    for (const [, url] of body.matchAll(/href="(https?:[^"]+)"/g)) assert.match(url, OFFICIAL, `${route}: ${url}`);
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
  assert.match(readMeta(await read('nl/wonen/registratiebelasting/')).title, /^Registratiebelasting woning Vlaanderen/);
  assert.match(readMeta(await read('fr/logement/droits-d-enregistrement/')).title, /^Droits d’enregistrement en Flandre/);
});

test('no Spanish strings, no Mapafiscal leftovers and no unfinished wording', async () => {
  const bad = /IRPF|Hacienda|España|vivienda|catastral\b|ganancia|alquiler|Mapafiscal|in ontwikkeling|en développement|binnenkort|bientôt/i;
  for (const route of ROUTES) assert.doesNotMatch(text(await read(route)), bad, route);
});

test('internal links, styles and scripts resolve', async () => {
  for (const route of ROUTES) {
    const html = await read(route);
    for (const [, ref] of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
      if (/^(https?:|mailto:|#)/.test(ref)) continue;
      const clean = ref.split('#')[0];
      let target = path.resolve(WEB, route, clean);
      if (clean.endsWith('/')) target = path.join(target, 'index.html');
      await access(target).catch(() => assert.fail(`${route}: ${ref} does not resolve`));
    }
    assert.match(html, /css\/components\.css">\n<link rel="stylesheet" href="(\.\.\/)+css\/wonen\.css">/, route);
  }
});

// Component order of Mapafiscal web/vivienda/: index = table card, four numbered steps,
// "in this section" card, call to action, FAQ, closing line; topic pages = cards, table card,
// cards, limit note, primary-source line, call to action, FAQ, "more on housing", closing line.
const blocks = html => Array.from(main(html).matchAll(/<(?:section|div) class="(card[^"]*)"|<p class="(cite|page-actions)"/g), m => m[1] || m[2]);
test('the pages follow the Mapafiscal vivienda template, identically in NL and FR', async () => {
  const index = blocks(await read('nl/wonen/'));
  assert.deepEqual(index, ['card table-card', 'card step-card', 'card step-card', 'card step-card', 'card step-card', 'card', 'cite', 'page-actions', 'card faq', 'card', 'card sources']);
  for (const [nl, fr] of PAIRS) {
    const a = blocks(await read(nl));
    assert.deepEqual(blocks(await read(fr)), a, nl);
    if (nl === 'nl/wonen/') continue;
    const tail = a.slice(a.indexOf('card limit-note'));
    assert.deepEqual(tail, ['card limit-note', 'cite', 'page-actions', 'card faq', 'card', 'card', 'card sources'], nl);
    assert.ok(a.indexOf('card table-card') > 0 && a.indexOf('card table-card') < a.indexOf('card limit-note'), nl);
    assert.ok((main(await read(nl)).match(/<details>/g) || []).length >= 4, nl + ': at least four FAQ items');
  }
});

test('the housing pages cover Flanders only and say so', async () => {
  assert.match(text(await read('nl/wonen/')), /alleen woningen in het Vlaams Gewest/);
  assert.match(text(await read('fr/logement/')), /uniquement des logements situés en Région flamande/);
});

test('the section is in the menu registry and linked from the Flanders region page', async () => {
  const menu = await readFile(path.join(WEB, 'js/menu.js'), 'utf8');
  assert.match(menu, /href: "wonen\/", icon: "home"/);
  assert.match(menu, /href: "logement\/", icon: "home"/);
  assert.match(await read('nl/gewesten/vlaanderen/'), /href="\.\.\/\.\.\/wonen\/"/);
  assert.match(await read('fr/regions/flandre/'), /href="\.\.\/\.\.\/logement\/"/);
});

test('the committed pages match tools/build_wonen.mjs', () => {
  execFileSync(process.execPath, [path.join(ROOT, 'tools/build_wonen.mjs'), '--check'], { stdio: 'pipe' });
});
