// Pensions section (nl/pensioenen/, fr/pensions/): NL/FR pairs and hreflang, official sources
// on every page (logged in docs/sources/pensioenen_2026-11-25.md), titles and descriptions,
// Mapafiscal guias template, no Spanish or unfinished wording, internal links (pending links to
// the pensioensparen section excluded) and the generator in sync with the committed pages.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, access } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import path from 'node:path';
import { WEB, SITE } from '../tools/lib/pages.mjs';
import { readMeta } from '../tools/lib/head.mjs';
import { ROUTES, SOURCES, PENDING } from '../tools/build_pensioenen.mjs';

const ROOT = path.resolve(WEB, '..');
const PAIRS = Object.values(ROUTES);
const ALL = PAIRS.flat();
const read = route => readFile(path.join(WEB, route, 'index.html'), 'utf8');
const main = html => html.match(/<main[\s\S]*?<\/main>/)[0];
const text = html => html.replace(/<script[\s\S]*?<\/script>/g, ' ').replace(/<[^>]+>/g, ' ');
const OFFICIAL = /^https:\/\/(www\.sfpd\.fgov\.be|www\.mypension\.be|eservices\.minfin\.fgov\.be)(\/|$)/;

test('the section has an index and three topic pages, each paired NL/FR with hreflang', async () => {
  assert.equal(PAIRS.length, 4);
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

test('every page ends with official sources, each in the source log with its consultation date', async () => {
  const log = await readFile(path.join(ROOT, 'docs/sources/pensioenen_2026-11-25.md'), 'utf8');
  for (const route of ALL) {
    const lang = route.slice(0, 2);
    const body = main(await read(route));
    const card = body.match(/<div class="card sources"><h2 class="card-title">(Bronnen|Sources)<\/h2>[\s\S]*?<\/ul><\/div>/);
    assert.ok(card, route + ' has a sources card');
    assert.equal(card[1], lang === 'nl' ? 'Bronnen' : 'Sources', route);
    assert.match(body, /<\/ul><\/div>\s*<\/div>\s*<\/main>$/, route + ': the sources card comes last');
    const items = Array.from(card[0].matchAll(/<li><a href="([^"]+)"[^>]*>[^<]+<\/a><span>([^<]+)<\/span><\/li>/g));
    assert.ok(items.length >= 1, route);
    for (const [, url, meta] of items) {
      assert.match(url, OFFICIAL, `${route}: ${url}`);
      assert.ok(meta.includes(url), `${route}: URL printed next to the link`);
      assert.match(meta, lang === 'nl' ? /geraadpleegd op \d\d-11-2026$/ : /consulté le \d\d-11-2026$/, route);
      const date = meta.match(/(\d\d-11-2026)$/)[1];
      assert.ok(log.includes(url), `${route}: ${url} is in the source log`);
      assert.ok(log.split('\n').some(l => l.includes(url) && l.includes(date)), `${route}: ${url} logged as consulted on ${date}`);
    }
    for (const [, url] of body.matchAll(/href="(https?:[^"]+)"/g)) assert.match(url, OFFICIAL, `${route}: ${url}`);
  }
  for (const s of Object.values(SOURCES)) for (const lang of ['nl', 'fr']) assert.match(s.url[lang], OFFICIAL);
});

test('titles and descriptions: native per language, unique, title ≤ 60 and description 140–160 characters', async () => {
  const titles = new Set(), descriptions = new Set();
  for (const route of ALL) {
    const { title, description } = readMeta(await read(route));
    assert.ok(title.length <= 60, `${route}: title ${title.length}`);
    assert.ok(description.length >= 140 && description.length <= 160, `${route}: description ${description.length}`);
    assert.ok(!titles.has(title) && !descriptions.has(description), route);
    titles.add(title); descriptions.add(description);
  }
  assert.match(readMeta(await read('nl/pensioenen/belasting-op-pensioen/')).title, /^Belasting op pensioen/);
  assert.match(readMeta(await read('fr/pensions/impot-sur-la-pension/')).title, /^Impôt sur la pension/);
});

test('no Spanish strings, no Mapafiscal leftovers and no unfinished wording', async () => {
  const bad = /IRPF|Hacienda|España|Seguridad Social|jubilaci[oó]n|pensión|retención|cotización|Mapafiscal|ontwikkeling|développement|binnenkort|bientôt|eerste versie|première version/i;
  for (const route of ALL) assert.doesNotMatch(text(await read(route)), bad, route);
});

test('the index shows no amounts; topic pages only show amounts with the year they apply to', async () => {
  for (const route of ROUTES.index) assert.doesNotMatch(text(main(await read(route))), /\d[\d.,]*\s?(€|EUR\b|euros?\b|%)/, route);
  for (const [nl, fr] of PAIRS.slice(1)) for (const route of [nl, fr]) {
    const body = text(main(await read(route)));
    assert.doesNotMatch(body, /€/, route);
    if (/\d[\d.,]*\s?(euros?\b|%)/.test(body)) assert.match(body, /2026/, route + ': amounts are dated');
  }
});

test('internal links resolve; links to the pensioensparen section are marked pending until it exists', async () => {
  for (const route of ALL) {
    const html = await read(route);
    for (const m of html.matchAll(/<(?:a|link|script)\b[^>]*?(?:href|src)="([^"]+)"[^>]*>/g)) {
      const [tag, ref] = m;
      if (/^(https?:|mailto:|#)/.test(ref)) continue;
      const clean = ref.split('#')[0];
      let target = path.resolve(WEB, route, clean);
      if (clean.endsWith('/')) target = path.join(target, 'index.html');
      const pending = Object.values(PENDING).some(p => target === path.join(WEB, p, 'index.html'));
      if (pending) { assert.ok(tag.includes('data-pending-link'), `${route}: ${ref} must carry data-pending-link`); continue; }
      assert.ok(!tag.includes('data-pending-link'), `${route}: ${ref} is not a pending link`);
      await access(target).catch(() => assert.fail(`${route}: ${ref} does not resolve`));
    }
    assert.match(html, /css\/components\.css">\n<link rel="stylesheet" href="(\.\.\/)+css\/pensioenen\.css">/, route);
  }
  assert.ok((await read('nl/pensioenen/')).includes(`href="../../${PENDING.nl}" data-pending-link`));
  assert.ok((await read('fr/pensions/')).includes(`href="../../${PENDING.fr}" data-pending-link`));
});

// Mapafiscal web/guias/: the index is a list of guide cards followed by the call to action;
// a topic page is summary, callout, intro, table of contents, numbered section cards, call to
// action, FAQ, related pages, terms and sources. NL and FR must be identical in structure.
const blocks = html => Array.from(main(html).matchAll(/<(?:div|nav|p) class="(card(?: [^"]*)?|summary-box[^"]*|callout(?: [^"]*)?|lead|toc|page-actions)"/g), m => m[1]);
test('the pages follow the Mapafiscal guias template, identically in NL and FR', async () => {
  assert.deepEqual(blocks(await read('nl/pensioenen/')), ['lead', 'card', 'card', 'card', 'card', 'page-actions', 'card sources']);
  for (const [nl, fr] of PAIRS) {
    const a = blocks(await read(nl));
    assert.deepEqual(blocks(await read(fr)), a, nl);
    if (nl === ROUTES.index[0]) continue;
    const n = a.filter(b => b === 'card').length - 2;
    assert.deepEqual(a, ['summary-box slash', 'callout neutral', 'lead', 'toc', ...Array(n).fill('card'), 'page-actions', 'card faq', 'card', 'card', 'card sources'], nl);
    const html = await read(nl);
    for (const [, id] of html.match(/<nav class="toc"[\s\S]*?<\/nav>/)[0].matchAll(/href="#([^"]+)"/g)) assert.ok(html.includes(`id="${id}"`), `${nl}: #${id}`);
    assert.ok((main(html).match(/<details>/g) || []).length >= 4, nl + ': FAQ');
  }
});

test('the index links every topic page and the section is in the menu registry', async () => {
  for (const [i, root] of ROUTES.index.entries()) {
    const html = await read(root);
    for (const [nl, fr] of PAIRS.slice(1)) assert.ok(html.includes(`href="../../${[nl, fr][i]}"`), `${root} links ${[nl, fr][i]}`);
  }
  const menu = await readFile(path.join(WEB, 'js/menu.js'), 'utf8');
  assert.match(menu, /href: "pensioenen\/", icon: "pension"/);
  assert.match(menu, /href: "pensions\/", icon: "pension"/);
});

test('the committed pages match tools/build_pensioenen.mjs', () => {
  execFileSync(process.execPath, [path.join(ROOT, 'tools/build_pensioenen.mjs'), '--check'], { stdio: 'pipe' });
});
