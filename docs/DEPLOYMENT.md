# Deployment

The deployable static site is `web/`. GitHub Pages uploads this directory only after Node, parameter-provenance and R tests pass.

The site has language routes `/nl/` and `/fr/`; the root route directs visitors to Dutch by default. Configure a custom domain only after the repository Pages deployment and DNS are deliberately enabled. Do not add a production domain or payment configuration without the owner's approval.

During the architecture port, GitHub Actions CI is manual-only (`workflow_dispatch`) to prevent failed intermediate commits from generating notification emails. Pages deployment is also manual-only. Restore automated checks only after the complete suite passes.

## Pages, SEO and generated files

Every HTML page under `web/nl/` and `web/fr/` is discovered automatically (`tools/lib/pages.mjs`) and paired with its translation through its own `<link rel="canonical">` and `<link rel="alternate" hreflang="nl-BE|fr-BE">` tags. Pages with `<meta name="robots" content="noindex">` are skipped. A new page therefore only needs a self-referencing canonical, both hreflang alternates and `x-default`; then run:

- `npm run build:head`: inserts or refreshes the generated `<head>` block (language memory `js/taal.js`, Open Graph, Twitter, JSON-LD) from the page's own title, description, canonical and breadcrumbs.
- `npm run build:sitemap`: regenerates `web/sitemap.xml`.
- `npm run build:validation`: regenerates the validation pages from `web/data/parameters.json` (status and provenance only, never values).
- `npm run build:og`: re-renders `web/og-nl.png` and `web/og-fr.png` from `tools/brand/og.html` (needs Playwright; not run in CI).

`npm test` and the `check:*` scripts fail when any of these generated files is stale. `npm run test:browser` runs the Playwright checks (language detection, 404 on a project path, 390 px layout).
