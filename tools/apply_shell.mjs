// Puts the shared static header nav and footer (tools/lib/shell.mjs, built from web/js/menu.js)
// on every NL/FR page, hand-written or generated.
//   node tools/apply_shell.mjs           rewrite the pages
//   node tools/apply_shell.mjs --check   exit 1 if a page differs
// Generators (wonen, zelfstandigen, validation…) call the same helpers, so their --check agrees.
import { readFile, writeFile } from 'node:fs/promises';
import { discoverPages, SITE } from './lib/pages.mjs';
import { navHtml, footerHtml, finalizePage } from './lib/shell.mjs';

const check = process.argv.includes('--check');
const stale = [];
for (const page of await discoverPages()) {
  const other = page.alternates[page.lang === 'nl' ? 'fr-BE' : 'nl-BE'];
  const pair = other && other.startsWith(SITE + '/') ? other.slice(SITE.length + 1) : null;
  const html = await readFile(page.file, 'utf8');
  const out = finalizePage(html, page.lang)
    .replace(/<nav class="nav"[^>]*>[\s\S]*?<\/nav>/, () => navHtml(page.lang, page.route))
    .replace(/<footer class="footer">[\s\S]*?<\/footer>/, () => footerHtml(page.lang, page.route, pair));
  if (out === html) continue;
  stale.push(page.route);
  if (!check) await writeFile(page.file, out);
}
if (check && stale.length) { console.error(`Header nav or footer out of date (run npm run build:shell):\n  ${stale.join('\n  ')}`); process.exit(1); }
console.log(check ? 'Header nav and footer are up to date on every page.' : `Updated ${stale.length} page(s).`);
