// Every NL/FR page carries the same footer columns (Simulator, About, Legal) from tools/lib/shell.mjs.
import test from 'node:test';
import assert from 'node:assert/strict';
import { discoverPages } from '../tools/lib/pages.mjs';
import { footerColumns, footerSmall } from '../tools/lib/shell.mjs';

test('every page has the shared footer columns, including Juridisch / Juridique', async () => {
  for (const page of await discoverPages()) {
    assert.ok(page.html.includes(footerColumns(page.lang, page.route)), page.route);
    assert.match(page.html, page.lang === 'nl' ? /<p class="footer-title">Juridisch<\/p>/ : /<p class="footer-title">Juridique<\/p>/, page.route);
    assert.ok(page.html.includes(`<p class="footer-small">${footerSmall(page.lang)}</p>`), page.route);
  }
});
