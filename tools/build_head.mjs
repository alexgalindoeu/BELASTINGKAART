// Inserts or refreshes the generated <head> block (taal.js, Open Graph, Twitter, JSON-LD)
// on every indexable NL/FR page found under web/nl and web/fr. See tools/lib/head.mjs.
//   node tools/build_head.mjs           update the pages
//   node tools/build_head.mjs --check   exit 1 if any page's block is missing or stale
import { readFile, writeFile } from 'node:fs/promises';
import { discoverPages, pairPages } from './lib/pages.mjs';
import { applyHead } from './lib/head.mjs';

const check = process.argv.includes('--check');
const pages = await discoverPages();
const stale = [];
try {
  pairPages(pages);
  for (const page of pages.filter(p => !p.noindex)) {
    const html = await readFile(page.file, 'utf8');
    const next = applyHead(html, page.route);
    if (next === html) continue;
    stale.push(page.route);
    if (!check) await writeFile(page.file, next);
  }
} catch (e) { console.error(e.message); process.exit(1); }
if (check && stale.length) {
  console.error('Generated <head> block missing or stale on: ' + stale.join(', ') + '\nRun npm run build:head');
  process.exit(1);
}
console.log(check ? 'All page heads are up to date.' : `Updated ${stale.length} page head(s).`);
