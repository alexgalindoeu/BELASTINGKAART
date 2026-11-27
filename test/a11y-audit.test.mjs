// Fixes for the P1 accessibility and layout items of docs/AUDITORIA_2026-11-27.md.
// The browser side (reflow at 320 px, 404 skip link, map focus) is in test/browser/*.mjs.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { WEB, discoverPages } from '../tools/lib/pages.mjs';
import { markForeignTitles, fixLangSwitch } from '../tools/lib/shell.mjs';

const pages = await discoverPages();
const text = html => html.replace(/<[^>]+>/g, '');

test('P1-1: the language switch accessible name starts with its visible text (WCAG 2.5.3)', () => {
  for (const page of pages) {
    const m = page.html.match(/<a class="lang-switch"[^>]*aria-label="([^"]*)"[^>]*>(FR|NL)<\/a>/);
    assert.ok(m, page.route);
    assert.ok(m[1].startsWith(m[2] + ' '), `${page.route}: "${m[1]}" vs "${m[2]}"`);
  }
  assert.match(fixLangSwitch('<a class="lang-switch" href="x" aria-label="Version française">FR</a>', 'nl'), /aria-label="FR – Version française">FR</);
});

test('P1-2: the map has no invisible keyboard stop and a two-colour focus ring', async () => {
  const css = await readFile(path.join(WEB, 'css/kaart.css'), 'utf8');
  const js = await readFile(path.join(WEB, 'js/kaart.js'), 'utf8');
  assert.doesNotMatch(css, /\.kaart-svg:focus \{ outline: none; \}/);
  assert.match(css, /\.kaart-svg:focus-visible \{ outline: 3px solid var\(--ring\)/);
  assert.match(css, /\.gem-ring-halo \{ stroke: var\(--surface\); stroke-width: 7; \}/);
  assert.match(css, /\.gem-ring \{ stroke: var\(--ink\); stroke-width: 3; \}/);
  assert.match(js, /svg\.setAttribute\("tabindex", "-1"\)/);
  assert.match(js, /ring\(visible \? p : null\)/);
});

test('P1-3: long titles wrap and wide tables scroll inside their box below 640 px', async () => {
  const css = await readFile(path.join(WEB, 'css/components.css'), 'utf8');
  assert.match(css, /:is\(h1, h2, \.view-title, \.card-title\) \{ overflow-wrap: break-word; \}/);
  assert.match(css, /table:is\(\.data-table, \.compare-table, \.breakdown\)[^{]*\{ display: block; max-width: 100%; overflow-x: auto; \}/);
  assert.match(css, /\.tooltip-bubble \{ display: none;/);
});

test('P1-4: the 404 keeps in-page links on its own URL despite <base>', async () => {
  const html = await readFile(path.join(WEB, '404.html'), 'utf8');
  assert.match(html, /<base href="\/">/);
  assert.match(html, /<a class="skip-link l-nl" href="#content">/);
  assert.match(html, /querySelectorAll\('a\[href\^="#"\]'\)\.forEach\(function \(a\) \{ a\.setAttribute\("href", location\.pathname \+ location\.search \+ a\.getAttribute\("href"\)\); \}\);/);
});

test('P1-5: no page skips a heading level (WCAG 1.3.1)', () => {
  for (const page of pages) {
    const main = page.html.match(/<main[\s\S]*<\/main>/)?.[0] ?? '';
    let last = 0;
    for (const [, n] of main.matchAll(/<h([1-6])[\s>]/g)) {
      const level = Number(n);
      assert.ok(level <= last + 1 || last === 0, `${page.route}: h${last} followed by h${level}`);
      last = level;
    }
  }
});

test('P1-5: the tool scripts title their result panel with an h2', async () => {
  for (const f of ['tool-kit.js', 'aanbiedingen.js']) {
    const js = await readFile(path.join(WEB, 'js', f), 'utf8');
    assert.doesNotMatch(js, /<h3>/, f);
    assert.match(js, /<h2 class="result-title">/, f);
  }
});

test('P1-8: source titles in the other language carry lang (WCAG 3.1.2)', () => {
  for (const page of pages) {
    const other = page.lang === 'fr' ? 'nl' : 'fr';
    const marker = page.lang === 'fr' ? /en néerlandais/ : /Franstalige pagina|pagina in het Frans/;
    for (const [, inner] of page.html.matchAll(/<a [^>]*href="https?:[^"]*"[^>]*>(.*?)<\/a>/g)) {
      if (!marker.test(inner) || /^(Vers|Outil|Voir|Naar|Bekijk) /.test(text(inner))) continue;
      const translated = page.lang === 'fr' ? /\s:\s| sur | des | les | du | pour / : / van | het | voor | naar /;
      const title = text(inner).split(/,? \(|, pag/)[0];
      if (translated.test(title)) continue;
      assert.match(inner, new RegExp(`<span lang="${other}">`), `${page.route}: ${text(inner)}`);
    }
  }
  assert.equal(markForeignTitles('<a href="https://x.be">Verkooprecht (droit de vente, en néerlandais)</a>', 'fr'),
    '<a href="https://x.be"><span lang="nl">Verkooprecht</span> (droit de vente, en néerlandais)</a>');
  assert.equal(markForeignTitles('<a href="https://x.be">Précompte immobilier, pagina in het Frans (SPW Finances)</a>', 'nl'),
    '<a href="https://x.be"><span lang="fr">Précompte immobilier</span>, pagina in het Frans (SPW Finances)</a>');
  const cta = '<a href="https://x.be">Vers MijnVlabel (en néerlandais)</a>';
  assert.equal(markForeignTitles(cta, 'fr'), cta);
  const twice = markForeignTitles('<a href="https://x.be">MijnVlabel (en néerlandais)</a>', 'fr');
  assert.equal(markForeignTitles(twice, 'fr'), twice, 'idempotent');
});
