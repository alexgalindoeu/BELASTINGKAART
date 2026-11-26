// Component stylesheet and the living style guide (/nl/stijlgids/, /fr/guide-de-style/).
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const WEB = fileURLToPath(new URL('../web/', import.meta.url));
const GUIDE = { nl: 'nl/stijlgids/', fr: 'fr/guide-de-style/' };
const read = route => readFile(path.join(WEB, route, 'index.html'), 'utf8');
const visible = html => html.replace(/<script[\s\S]*?<\/script>/g, ' ').replace(/<[^>]+>/g, ' ');

test('every HTML page loads components.css right after site.css', async () => {
  for (const entry of await readdir(WEB, { recursive: true })) {
    if (!entry.endsWith('.html') || entry === 'index.html') continue;   // web/index.html only redirects
    const html = await readFile(path.join(WEB, entry), 'utf8');
    assert.match(html, /<link rel="stylesheet" href="([^"]*)css\/site\.css">\n<link rel="stylesheet" href="\1css\/components\.css">/, entry);
  }
});

test('every component token used in components.css has a light and a dark value', async () => {
  const css = await readFile(path.join(WEB, 'css/components.css'), 'utf8');
  const site = await readFile(path.join(WEB, 'css/site.css'), 'utf8');
  const defined = new Set([...site.matchAll(/(--[a-z0-9-]+):/g), ...css.matchAll(/(--[a-z0-9-]+):/g)].map(m => m[1]));
  for (const [, name] of css.matchAll(/var\((--[a-z0-9-]+)/g)) assert.ok(defined.has(name), name);
  for (const token of ['--brand-200', '--c-net', '--c-tax', '--c-social', '--c-federal', '--c-regional']) {
    assert.equal((css.match(new RegExp(token + ':', 'g')) || []).length, 3, token + ': light, dark (system) and dark (forced)');
  }
  assert.match(css, /@media print/);
  assert.match(css, /prefers-reduced-motion/);
});

test('the style guide pair is noindex, paired by hreflang and uses the shared shell', async () => {
  for (const [lang, route] of Object.entries(GUIDE)) {
    const other = GUIDE[lang === 'nl' ? 'fr' : 'nl'];
    const html = await read(route);
    assert.match(html, new RegExp(`<html lang="${lang}">`));
    assert.match(html, /<meta name="robots" content="noindex">/);
    assert.ok(html.includes(`<link rel="canonical" href="https://belastingkaart.be/${route}">`));
    assert.ok(html.includes(`hreflang="nl-BE" href="https://belastingkaart.be/${GUIDE.nl}"`));
    assert.ok(html.includes(`hreflang="fr-BE" href="https://belastingkaart.be/${GUIDE.fr}"`));
    const sw = html.match(/<a class="lang-switch" href="([^"]+)"/)[1];
    assert.equal(path.resolve(WEB, route, sw), path.resolve(WEB, other));
    for (const part of ['class="skip-link"', '<header class="appbar">', '<footer class="footer">', 'id="theme-toggle"', 'js/menu.js', 'js/ui.js', 'js/componenten.js'])
      assert.ok(html.includes(part), `${route}: ${part}`);
  }
});

test('the style guide shows no fiscal amount or percentage', async () => {
  for (const route of Object.values(GUIDE)) {
    const html = await read(route);
    const text = visible(html);
    assert.doesNotMatch(text, /\d[\d.,\s]*(€|%|EUR)|€\s*\d|%/, route);
    const result = html.match(/<section class="sg-section" id="sg-resultaat">[\s\S]*?<\/section>/)[0];
    assert.doesNotMatch(visible(result), /\d/, route + ': digits in the result components');
    assert.doesNotMatch(text, /nettoloon|salaire net|bedrijfsvoorheffing|précompte/i, route + ': fiscal copy');
  }
});

test('NL and FR style guides have the same structure', async () => {
  const shape = html => ({
    ids: Array.from(html.matchAll(/\sid="([^"]+)"/g), m => m[1]).join(','),
    classes: Array.from(html.matchAll(/class="([^"]+)"/g), m => m[1]).join('|'),
    tags: (html.match(/<(section|table|details|dialog|form|nav)[\s>]/g) || []).join('')
  });
  assert.deepEqual(shape(await read(GUIDE.fr)), shape(await read(GUIDE.nl)));
});

test('every class shown in the style guide is styled by site.css or components.css', async () => {
  const css = (await readFile(path.join(WEB, 'css/site.css'), 'utf8')) + (await readFile(path.join(WEB, 'css/components.css'), 'utf8'));
  const styled = new Set(Array.from(css.matchAll(/\.([a-z][a-z0-9-]*)/g), m => m[1]));
  const unstyled = ['hero-like', 'p', 'p2', 'r', 'fill', 'brand-icon'];  // inline-styled demo or SVG parts styled through parents
  const html = await read(GUIDE.nl);
  for (const [, list] of html.matchAll(/class="([^"]+)"/g))
    for (const cls of list.split(/\s+/)) if (!unstyled.includes(cls)) assert.ok(styled.has(cls), cls);
});

test('the result renderer and the components script are not loaded where they are not needed', async () => {
  for (const route of ['nl/methodologie/', 'fr/methodologie/']) {
    const html = await read(route);
    assert.doesNotMatch(html, /resultaat\.js/);
  }
  for (const route of ['nl/', 'fr/']) assert.match(await read(route), /js\/resultaat\.js"><\/script>\s*<script defer src="\.\.\/js\/app\.js"/);
});
