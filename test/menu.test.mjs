// Menu registry (web/js/menu.js): one source for the top-bar nav and the "Alles / Tout" drawer.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, readdir, access } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import vm from 'node:vm';

const WEB = fileURLToPath(new URL('../web/', import.meta.url));
const context = { window: {}, document: { querySelector: () => null }, URL };
vm.runInNewContext(await readFile(path.join(WEB, 'js/menu.js'), 'utf8'), context);
vm.runInNewContext(await readFile(path.join(WEB, 'js/ui.js'), 'utf8'), context);
const { BKMenu, BKUI } = context.window;
const items = lang => BKMenu.GROUPS[lang].flatMap(g => g.items);

async function target(lang, href) {
  const clean = href.split('#')[0];
  let file = path.resolve(WEB, lang, clean);
  if (clean === '' || clean.endsWith('/')) file = path.join(file, 'index.html');
  return file;
}

test('every registry href resolves to an existing page in both languages', async () => {
  for (const lang of ['nl', 'fr']) {
    for (const it of [...items(lang), ...BKMenu.NAV[lang]]) {
      assert.doesNotMatch(it.href, /^(\/|https?:|\.\.)/, `${lang}: ${it.href} must be relative to the language root`);
      const file = await target(lang, it.href);
      await access(file).catch(() => assert.fail(`${lang}: ${it.href} does not resolve`));
      if (it.href.includes('#')) {
        const html = await readFile(file, 'utf8');
        assert.ok(html.includes(`id="${it.href.split('#')[1]}"`), `${lang}: anchor ${it.href}`);
      }
    }
  }
});

test('NL and FR registries have the same structure and point to equivalent pages', async () => {
  assert.equal(BKMenu.GROUPS.nl.length, BKMenu.GROUPS.fr.length);
  BKMenu.GROUPS.nl.forEach((g, i) => assert.equal(g.items.length, BKMenu.GROUPS.fr[i].items.length, g.group));
  assert.equal(BKMenu.NAV.nl.length, BKMenu.NAV.fr.length);
  const pairs = [[items('nl'), items('fr')], [BKMenu.NAV.nl, BKMenu.NAV.fr]];
  for (const [nl, fr] of pairs) for (const [i, a] of nl.entries()) {
    const b = fr[i];
    assert.equal(a.icon, b.icon, a.label);
    assert.deepEqual(Object.keys(a).sort(), Object.keys(b).sort(), a.label);
    // the NL page's language switch must lead to the FR entry's page
    const nlFile = await target('nl', a.href);
    const html = await readFile(nlFile, 'utf8');
    const sw = html.match(/<a class="lang-switch" href="([^"]+)"/)[1];
    assert.equal(path.resolve(path.dirname(nlFile), sw), path.dirname(await target('fr', b.href)), a.label);
    assert.equal(a.href.includes('#') ? a.href.split('#')[1] : '', b.href.includes('#') ? b.href.split('#')[1] : '', a.label);
  }
  for (const lang of ['nl', 'fr']) {
    for (const it of items(lang)) {
      assert.ok(BKMenu.ICONS[it.icon], `${lang}: icon ${it.icon}`);
      assert.ok(it.label && it.text, `${lang}: ${it.href}`);
      assert.equal(it.chip, undefined, 'no development chips in the drawer');
    }
    for (const key of ['button', 'title', 'close', 'drawerNav', 'menu', 'nav']) assert.ok(BKMenu.COPY[lang][key], key);
  }
});

test('the noindex style guide is not listed in the registry', () => {
  for (const lang of ['nl', 'fr']) for (const it of [...items(lang), ...BKMenu.NAV[lang]])
    assert.doesNotMatch(it.href, /stijlgids|guide-de-style/);
});

test('the static header nav of every page (no-JavaScript fallback) matches the registry', async () => {
  for (const lang of ['nl', 'fr']) {
    for (const entry of await readdir(path.join(WEB, lang), { withFileTypes: true, recursive: true })) {
      if (entry.name !== 'index.html') continue;
      const file = path.join(entry.parentPath ?? entry.path, entry.name);
      const html = await readFile(file, 'utf8');
      const nav = html.match(/<nav class="nav"[^>]*>([\s\S]*?)<\/nav>/)[1];
      const links = Array.from(nav.matchAll(/<a href="([^"]+)"[^>]*>([^<]+)<\/a>/g), m => [m[1], m[2]]);
      assert.equal(links.length, BKMenu.NAV[lang].length, file);
      for (const [i, [href, label]] of links.entries()) {
        const want = BKMenu.NAV[lang][i];
        assert.equal(label, want.label, file);
        const got = path.resolve(path.dirname(file), href.split('#')[0]);
        assert.equal(got, path.resolve(WEB, lang, want.href.split('#')[0]), `${file}: ${href}`);
      }
      assert.match(html, /js\/menu\.js"><\/script>\s*<script defer src="[^"]*js\/ui\.js"/, `${file}: menu.js loads before ui.js`);
    }
  }
});

test('the drawer markup lists every entry, marks the current page and escapes text', () => {
  const root = 'https://belastingkaart.be/fr/';
  const html = BKUI.drawerHtml(BKMenu, 'fr', root, new URL('https://belastingkaart.be/fr/sources/'));
  for (const it of items('fr')) assert.ok(html.includes(`href="${new URL(it.href, root).href}"`), it.href);
  assert.equal((html.match(/aria-current="page"/g) || []).length, 1);
  assert.match(html, /<a class="drawer-item" href="https:\/\/belastingkaart\.be\/fr\/sources\/" aria-current="page">/);
  assert.match(html, /<h2 id="drawer-title">Tout ce que nous proposons<\/h2>/);
  assert.match(html, /aria-label="Fermer le panneau"/);
  assert.doesNotMatch(html, /chip|\d+ ?(€|%)/);
  const nl = BKUI.drawerHtml(BKMenu, 'nl', 'https://belastingkaart.be/nl/', new URL('https://belastingkaart.be/nl/#simulator'));
  assert.match(nl, /Alles wat we aanbieden/);
  assert.doesNotMatch(nl, /aria-current/, 'home sections are never the current page');
});
