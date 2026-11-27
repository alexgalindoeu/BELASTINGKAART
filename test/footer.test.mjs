// Every NL/FR page carries the shared static nav and footer from tools/lib/shell.mjs, which
// are built from web/js/menu.js: three columns, the dates line and the legal links in a
// bottom row, as in the reference layout.
import test from 'node:test';
import assert from 'node:assert/strict';
import { discoverPages, SITE } from '../tools/lib/pages.mjs';
import { navHtml, footerHtml, MENU } from '../tools/lib/shell.mjs';

test('every page has the shared header nav and footer', async () => {
  for (const page of await discoverPages()) {
    assert.ok(page.html.includes(navHtml(page.lang, page.route)), page.route + ': header nav');
    const pair = page.alternates[page.lang === 'nl' ? 'fr-BE' : 'nl-BE'].slice(SITE.length + 1);
    assert.ok(page.html.includes(footerHtml(page.lang, page.route, pair)), page.route + ': footer');
    assert.match(page.html, /<p class="footer-small footer-dates">.*hreflang="nl-BE" lang="nl">Nederlands<\/a> · <a [^>]*hreflang="fr-BE" lang="fr">Français<\/a><\/p>/, page.route);
  }
});

test('the footer puts the legal links in a bottom row, not in a column', () => {
  for (const lang of ['nl', 'fr']) {
    const html = footerHtml(lang, lang + '/');
    assert.equal((html.match(/class="footer-col"/g) || []).length, 3);
    const row = html.match(/<p class="footer-small footer-legal">(.*?)<\/p>/)[1];
    const legal = MENU.GROUPS[lang][MENU.GROUPS[lang].length - 1].items;
    for (const it of legal) assert.ok(row.includes(`>${it.label}</a>`), it.label);
    assert.doesNotMatch(html, /footer-title">(Juridisch|Juridique)</);
  }
});
