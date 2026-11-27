// Region pages (NL /nl/gewesten/…, FR /fr/regions/…): pairs, hreflang, official sources,
// metadata, language purity, no computed amounts and internal links.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, access } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const WEB = fileURLToPath(new URL('../web/', import.meta.url));
const SITE = 'https://belastingkaart.be/';
const PAIRS = [
  ['nl/gewesten/', 'fr/regions/'],
  ['nl/gewesten/vlaanderen/', 'fr/regions/flandre/'],
  ['nl/gewesten/brussel/', 'fr/regions/bruxelles/'],
  ['nl/gewesten/wallonie/', 'fr/regions/wallonie/']
];
// Same list as tools/validate_parameters.mjs (ALLOWED_HOSTS); keep them in sync.
const ALLOWED_HOSTS = ['fin.belgium.be', 'finances.belgium.be', 'minfin.fgov.be',
  'socialsecurity.be', 'vlaanderen.be', 'belasting.vlaanderen.be',
  'fiscaliteit.brussels', 'finances.wallonie.be', 'ejustice.just.fgov.be',
  'statbel.fgov.be', 'emploi.belgique.be', 'werk.belgie.be'];
const official = url => {
  const u = new URL(url);
  return u.protocol === 'https:' && ALLOWED_HOSTS.some(a => u.hostname === a || u.hostname.endsWith('.' + a));
};
const read = route => readFile(path.join(WEB, route, 'index.html'), 'utf8');
const main = html => html.match(/<main[\s\S]*?<\/main>/)[0];
const text = html => main(html).replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
const meta = html => ({
  title: html.match(/<title>([^<]*)<\/title>/)[1],
  description: html.match(/<meta name="description" content="([^"]*)"/)[1]
});
const sources = html => {
  const block = html.match(/<section class="card" id="sources">([\s\S]*?)<\/section>/);
  return block ? Array.from(block[1].matchAll(/<li><a href="([^"]+)"[^>]*>[^<]+<\/a><span>([^<]+)<\/span><\/li>/g), m => [m[1], m[2]]) : [];
};

test('region pages exist as NL/FR pairs with a self canonical and nl-BE, fr-BE and x-default alternates', async () => {
  for (const [nl, fr] of PAIRS) for (const [route, other, otherLang] of [[nl, fr, 'fr'], [fr, nl, 'nl']]) {
    const html = await read(route);
    assert.match(html, new RegExp(`<html lang="${route.slice(0, 2)}">`), route);
    assert.ok(html.includes(`<link rel="canonical" href="${SITE}${route}">`), route);
    assert.ok(html.includes(`<link rel="alternate" hreflang="nl-BE" href="${SITE}${nl}">`), route);
    assert.ok(html.includes(`<link rel="alternate" hreflang="fr-BE" href="${SITE}${fr}">`), route);
    assert.ok(html.includes(`<link rel="alternate" hreflang="x-default" href="${SITE}nl/">`), route);
    const sw = html.match(/<a class="lang-switch" href="([^"]+)" hreflang="([^"]+)" lang="([^"]+)"/);
    assert.equal(path.resolve(WEB, route, sw[1]), path.resolve(WEB, other), route);
    assert.equal(sw[3], otherLang, route);
  }
});

test('every region page ends with a non-empty list of official sources and their consultation date', async () => {
  for (const pair of PAIRS) for (const route of pair) {
    const html = await read(route);
    const list = sources(html);
    assert.ok(list.length >= 3, `${route}: sources`);
    const seen = route.startsWith('nl') ? 'geraadpleegd op' : 'consulté le';
    for (const [url, note] of list) {
      assert.ok(official(url), `${route}: ${url} is not an official domain`);
      assert.ok(note.startsWith(url) && note.includes(`${seen} 26-11-2026`), `${route}: ${note}`);
    }
    assert.ok(main(html).lastIndexOf('id="sources"') > main(html).lastIndexOf('id="faq"'), `${route}: sources come last`);
  }
});

test('titles and descriptions are unique, native per language and within the limits', async () => {
  const titles = new Set(), descriptions = new Set();
  for (const pair of PAIRS) for (const route of pair) {
    const { title, description } = meta(await read(route));
    assert.ok(title.length <= 60, `${route}: title ${title.length}`);
    assert.ok(description.length >= 140 && description.length <= 160, `${route}: description ${description.length}`);
    assert.ok(!titles.has(title) && !descriptions.has(description), route);
    titles.add(title); descriptions.add(description);
    assert.match(title, route.startsWith('nl') ? /^Belastingen / : /^Impôts /, route);
  }
});

test('one language per page and no Spanish or Mapafiscal strings', async () => {
  const spanish = /IRPF|comunidad|España|Mapafiscal|Hacienda|autonómic|deducci[oó]n|tramos|sueldo|renta\b|\bAEAT\b|\bBOE\b/i;
  const frenchInNl = /\b(impôt|région|précompte|revenus|vous|votre)\b/i;
  const dutchInFr = /\b(belasting|gewest|voorheffing|inkomsten|jij|jouw|uw)\b/i;
  // Official names keep their own language (SPW Finances is French-only, Vlabel Dutch-only);
  // the sources list may name a page in its own language.
  const NAMES = /SPW Finances|Boulevard Ernest Mélot|Vlaamse Belastingdienst|Vaartstraat|woonbonus/g;
  const body = html => main(html).replace(/<section class="card" id="sources">[\s\S]*?<\/section>/, '')
    .replace(/<[^>]+>/g, ' ').replace(NAMES, '');
  for (const [nl, fr] of PAIRS) {
    const tn = body(await read(nl)), tf = body(await read(fr));
    for (const [route, t] of [[nl, tn], [fr, tf]]) assert.doesNotMatch(t, spanish, route);
    assert.doesNotMatch(tn, frenchInNl, nl);
    assert.doesNotMatch(tf, dutchInFr, fr);
  }
});

test('no computed or net amount is shown and pending values use the neutral wording', async () => {
  for (const pair of PAIRS) for (const route of pair) {
    const html = await read(route);
    assert.doesNotMatch(text(html), /nettoloon (?:van|is) \d|salaire net (?:de|est) \d|€/, route);
    for (const dd of main(html).matchAll(/<dd>([^<]*)<\/dd>/g)) assert.equal(dd[1], '—', route);
    assert.doesNotMatch(text(html), /in ontwikkeling|en développement|binnenkort|bientôt/i, route);
    if (route.split('/').length > 3) assert.match(text(html), route.startsWith('nl') ? /volgt zodra bevestigd/ : /dès confirmation/, route);
  }
});

test('NL and FR region pages follow the same template, section by section', async () => {
  const ids = html => Array.from(main(html).matchAll(/<section class="[^"]*" id="([^"]+)"/g), m => m[1]).join(',');
  for (const [nl, fr] of PAIRS) assert.equal(ids(await read(fr)), ids(await read(nl)), nl);
  const region = ids(await read(PAIRS[1][0]));
  assert.equal(region, 'quick,rates,compare,by-salary,allowance,reductions,home-tax,net,regions,chart,contact,faq,guides,sources');
  for (const [nl] of PAIRS.slice(2)) assert.equal(ids(await read(nl)), region, nl);
});

test('internal links, styles and scripts of the region pages resolve, anchors included', async () => {
  for (const pair of PAIRS) for (const route of pair) {
    const html = await read(route);
    assert.match(html, /css\/components\.css">\s*<link rel="stylesheet" href="[^"]*css\/gewesten\.css">/, route);
    for (const ref of Array.from(html.matchAll(/(?:href|src)="([^"]+)"/g), m => m[1])) {
      if (/^(https?:|mailto:|#)/.test(ref)) continue;
      const [clean, hash] = ref.split('#');
      let target = path.resolve(WEB, route, clean);
      if (clean === '' || clean.endsWith('/')) target = path.join(target, 'index.html');
      await access(target).catch(() => assert.fail(`${route}: ${ref} does not resolve`));
      if (hash && clean) assert.ok((await readFile(target, 'utf8')).includes(`id="${hash}"`), `${route}: ${ref}`);
    }
  }
});

test('gewesten.css is linked only from the region pages', async () => {
  const { walk } = await import('../tools/lib/pages.mjs');
  const regionFiles = new Set(PAIRS.flat().map(r => path.join(WEB, r, 'index.html')));
  for (const file of await walk(WEB)) {
    if (!file.endsWith('.html')) continue;
    const linked = (await readFile(file, 'utf8')).includes('css/gewesten.css');
    assert.equal(linked, regionFiles.has(file), path.relative(WEB, file));
  }
});
