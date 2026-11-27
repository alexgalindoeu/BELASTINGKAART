// Glossary (nl/woordenlijst, fr/lexique) and guides (nl/gidsen, fr/guides): NL/FR pairing,
// Mapafiscal page template, official sources with consultation date, no amounts beyond the
// sourced ones and no net salary.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, readdir, access } from 'node:fs/promises';
import path from 'node:path';
import { WEB, SITE } from '../tools/lib/pages.mjs';

const SECTIONS = [['nl/woordenlijst/', 'fr/lexique/'], ['nl/gidsen/', 'fr/guides/']];
// Same official-source allowlist as the parameter validator.
const validator = await readFile(new URL('../tools/validate_parameters.mjs', import.meta.url), 'utf8');
const ALLOWED = JSON.parse(validator.match(/const ALLOWED_HOSTS = (\[[\s\S]*?\]);/)[1].replace(/'/g, '"'));
const official = url => { try { const u = new URL(url); return u.protocol === 'https:' && ALLOWED.some(a => u.hostname === a || u.hostname.endsWith('.' + a)); } catch { return false; } };

const read = route => readFile(path.join(WEB, route, 'index.html'), 'utf8');
async function children(route) {
  return (await readdir(path.join(WEB, route), { withFileTypes: true })).filter(d => d.isDirectory()).map(d => `${route}${d.name}/`).sort();
}
const alt = (html, lang) => html.match(new RegExp(`hreflang="${lang}" href="${SITE}/([^"]+)"`))?.[1];
const text = html => html.replace(/<script[\s\S]*?<\/script>/g, ' ').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
const card = (html, title) => html.match(new RegExp(`<div class="card[^"]*"[^>]*><h2 class="card-title">${title}</h2>([\\s\\S]*?)</div>`))?.[1];

const PAGES = [];
for (const [nlRoot, frRoot] of SECTIONS) {
  const kind = nlRoot.includes('gidsen') ? 'guide' : 'term';
  PAGES.push({ kind: 'index', nl: nlRoot, fr: frRoot });
  const nlKids = await children(nlRoot), frKids = await children(frRoot);
  test(`${nlRoot} and ${frRoot} have the same number of pages and each one is paired`, async () => {
    assert.equal(nlKids.length, frKids.length);
    assert.ok(nlKids.length >= (kind === 'term' ? 20 : 4), 'enough pages');
    const seen = new Set();
    for (const nl of nlKids) {
      const html = await read(nl);
      const fr = alt(html, 'fr-BE');
      assert.ok(frKids.includes(fr), `${nl} -> ${fr}`);
      assert.equal(alt(await read(fr), 'nl-BE'), nl, `${fr} points back`);
      seen.add(fr);
    }
    assert.equal(seen.size, frKids.length);
  });
  for (const nl of nlKids) PAGES.push({ kind, nl, fr: alt(await read(nl), 'fr-BE') });
}

test('every page carries canonical, hreflang pair and x-default', async () => {
  for (const p of PAGES) for (const lang of ['nl', 'fr']) {
    const html = await read(p[lang]);
    assert.ok(html.includes(`<link rel="canonical" href="${SITE}/${p[lang]}">`), p[lang]);
    assert.equal(alt(html, 'nl-BE'), p.nl, p[lang]);
    assert.equal(alt(html, 'fr-BE'), p.fr, p[lang]);
    assert.equal(alt(html, 'x-default'), 'nl/', p[lang]);
  }
});

test('term and guide pages list official sources with the consultation date, same count in NL and FR', async () => {
  for (const p of PAGES.filter(p => p.kind !== 'index')) {
    const counts = [];
    for (const lang of ['nl', 'fr']) {
      const html = await read(p[lang]);
      const list = card(html, lang === 'nl' ? 'Bronnen' : 'Sources');
      assert.ok(list, `${p[lang]} has a sources card`);
      const items = Array.from(list.matchAll(/<li><a href="([^"]+)"[^>]*>(?:[^<]|<span lang="(?:nl|fr)">[^<]*<\/span>)+<\/a><span>([^<]+)<\/span><\/li>/g));
      assert.ok(items.length > 0, `${p[lang]}: sources listed`);
      for (const [, url, date] of items) {
        assert.ok(official(url), `${p[lang]}: ${url} is not an official source`);
        assert.match(date, lang === 'nl' ? /^Geraadpleegd op \d{2}-\d{2}-\d{4}$/ : /^Consulté le \d{2}-\d{2}-\d{4}$/, p[lang]);
      }
      counts.push(items.length);
    }
    assert.equal(counts[0], counts[1], `${p.nl}: same number of sources`);
  }
});

test('term pages follow the glossary template: definition, explanation, sources, related terms, uses, back link', async () => {
  for (const p of PAGES.filter(p => p.kind === 'term')) for (const lang of ['nl', 'fr']) {
    const html = await read(p[lang]);
    const main = html.match(/<main[\s\S]*<\/main>/)[0];
    const order = lang === 'nl'
      ? ['class="breadcrumbs"', '<h1>', 'class="updated"', 'class="lead"', '<div class="card"><p>', '>Bronnen<', '>Verwante termen<', '>Waar Belastingkaart dit gebruikt<', 'Terug naar de woordenlijst']
      : ['class="breadcrumbs"', '<h1>', 'class="updated"', 'class="lead"', '<div class="card"><p>', '>Sources<', '>Termes liés<', '>Où Belastingkaart l’utilise<', 'Retour au lexique'];
    let at = -1;
    for (const mark of order) { const i = main.indexOf(mark, at + 1); assert.ok(i > at, `${p[lang]}: "${mark}" in template order`); at = i; }
  }
});

test('guide pages follow the guide template: summary, intro, table of contents, sections, FAQ, sources, other guides', async () => {
  for (const p of PAGES.filter(p => p.kind === 'guide')) for (const lang of ['nl', 'fr']) {
    const html = await read(p[lang]);
    const order = lang === 'nl'
      ? ['<h1>', 'class="summary-box', 'class="lead"', 'class="toc"', 'id="s1"', 'class="card faq"', '>Bronnen<', '>Andere gidsen<']
      : ['<h1>', 'class="summary-box', 'class="lead"', 'class="toc"', 'id="s1"', 'class="card faq"', '>Sources<', '>Autres guides<'];
    let at = -1;
    for (const mark of order) { const i = html.indexOf(mark, at + 1); assert.ok(i > at, `${p[lang]}: "${mark}" in template order`); at = i; }
    for (const id of Array.from(html.matchAll(/class="toc"[\s\S]*?<\/nav>/g))[0][0].matchAll(/href="#([^"]+)"/g)) assert.ok(html.includes(`id="${id[1]}"`), `${p[lang]}: toc #${id[1]}`);
    assert.ok((html.match(/<details>/g) || []).length >= 3, `${p[lang]}: FAQ`);
  }
});

test('the indexes link every page of their section', async () => {
  for (const [nlRoot, frRoot] of SECTIONS) for (const root of [nlRoot, frRoot]) {
    const html = await read(root);
    for (const kid of await children(root)) assert.ok(html.includes(`href="${kid.slice(root.length)}"`), `${root} links ${kid}`);
  }
  const az = (await read('nl/woordenlijst/')).match(/<ul class="az-index">([\s\S]*?)<\/ul>/)[1];
  assert.equal((az.match(/<li>/g) || []).length, 26, 'A-Z index shows every letter');
});

test('no amounts other than the sourced ones, no net salary, no Spanish, no development wording', async () => {
  const ALLOWED_FIGURES = ['13,07 %', '8 %', '100 %', '108 %', '25 %', '50 %', '11.550 euro', '11.550 euros', '7 jaar', '7 ans', '1 jaar'];
  for (const p of PAGES) for (const lang of ['nl', 'fr']) {
    const body = text((await read(p[lang])).match(/<main[\s\S]*<\/main>/)[0]);
    assert.doesNotMatch(body, /€/, p[lang]);
    for (const m of body.matchAll(/\d[\d.,]*\s?(%|euros?\b|EUR\b)/g)) assert.ok(ALLOWED_FIGURES.includes(m[0]), `${p[lang]}: unexpected amount ${m[0]}`);
    assert.doesNotMatch(body, /nettoloon (van|bedraagt)|salaire net (de|s’élève)/i, p[lang]);
    assert.doesNotMatch(body, /IRPF|Hacienda|España|Mapafiscal|ontwikkeling|développement|binnenkort|bientôt/i, p[lang]);
  }
});

test('internal links on these pages resolve', async () => {
  for (const p of PAGES) for (const lang of ['nl', 'fr']) {
    const html = await read(p[lang]);
    for (const [, ref] of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
      if (/^(https?:|mailto:|#)/.test(ref)) continue;
      const clean = ref.split('#')[0];
      let target = path.resolve(WEB, p[lang], clean);
      if (clean.endsWith('/')) target = path.join(target, 'index.html');
      await access(target).catch(() => assert.fail(`${p[lang]}: ${ref} does not resolve`));
    }
  }
});
