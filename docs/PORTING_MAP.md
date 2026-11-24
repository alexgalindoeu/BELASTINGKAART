# Mapafiscal → Belastingkaart porting map

This is a structural port, not a fiscal translation. Mapafiscal currently has 1,195 tracked files across R, params, tools, docs, web, tests, Supabase and GitHub Actions. Its public site has 983 files. The target repository started with only an 8-file UI scaffold.

| Mapafiscal layer | Belastingkaart target | Porting decision |
|---|---|---|
| R calculation modules | `R/` | Rebuild domain logic for Belgian tax; reuse only generic utilities after review |
| `params/<year>/*.yaml` | `params/<income-year>/*.yaml` | New Belgian parameter schema; no Spanish values |
| R → JSON exporter | `tools/export_parameters.R` | Rebuild around provenance and income/assessment years |
| JS tax engine | `web/js/tax-engine.js` | New Belgian engine with R parity |
| Modular browser UI | `web/js/`, `web/css/` | Port generic UI patterns; NL/FR labels |
| SEO generators | `tools/seo_*.mjs` | Port generator approach, not Spanish page inventory or copy |
| Node / testthat / Playwright | `test/`, `tests/` | Rebuild tests for Belgian rules and language parity |
| GitHub Actions | `.github/workflows/` | Adapt CI and deployment paths |
| Supabase / Stripe | `supabase/` | Optional, later; no production identifiers or secrets copied |
| Spanish territorial datasets | none | Do not port; create Belgian geography from official sources if needed |

## Product parity roadmap
1. Employee gross-to-net, monthly and annual concepts clearly separated.
2. Household / family status and withholding assumptions.
3. Municipal surcharge and region-aware jurisdiction selection.
4. Self-employed income and social contributions, only after official rule coverage.
5. Pensions and other income categories, where Belgian law and scope are documented.
6. Comparators, scenarios, explanations, reports and SEO pages adapted to Belgian use cases.

Feature parity does not mean forcing Spanish concepts onto Belgian law. Each module needs a Belgian legal specification before implementation.

## Diseño portado

Port of Mapafiscal's public-site design (`web/` in the Mapafiscal repository) to Belastingkaart, 2026-11-24. Only design and generic front-end code; no Spanish rules, data, copy, SEO text, legal text or branding. All visible text is written for Belgium in Dutch and French with the same meaning.

| Mapafiscal (`web/`) | Belastingkaart | Decision |
|---|---|---|
| `css/mapafiscal.css`: colour tokens (light and dark), type scale, top bar, nav, buttons, cards, form blocks, result panel, tool index, footer, touch targets, reduced motion, print | `web/css/site.css` | **Adapted.** Same palette, typography, spacing and components; tokens and classes renamed to English (`--brand`, `--accent`, `.appbar`, `.block`, `.result`…). Only the parts the Belgian pages use; map, ranking, client, plans, ads, PDF and tool-specific rules left out |
| `css/seo.css`, `css/legal.css`: editorial reading column, breadcrumbs, "updated" rule, summary box, link list | `web/css/site.css` (`body.page`, `.page-main`, `.prose`…) | **Adapted** for methodologie/bronnen/contact/privacy (and FR equivalents) |
| `fonts/*.woff2` (Archivo, Public Sans, IBM Plex Mono; SIL OFL 1.1) | `web/fonts/` + `LICENSES.txt` + `OFL-1.1.txt` | **Copied unchanged**; the OFL allows redistribution. Replaces the previous Google Fonts `@import` (no third-party request any more) |
| `favicon.svg`, `iconos/*.png`, M logo, `og.png` | `web/favicon.svg` (new neutral folded-map mark) | **Skipped** (Mapafiscal branding). New generic mark drawn for Belastingkaart |
| `manifest.webmanifest` | — | **Skipped**: needs PNG icons and a product decision on installability |
| `js/ui.js`: theme toggle (auto/light/dark, stored locally, applied in `<head>` before paint), mobile top bar that slides away | `web/js/ui.js` | **Adapted**: NL/FR labels, key `bk-theme`; keeps the existing `BKUI.setText` / `BKUI.setStatus` API used by `app.js` |
| `js/ui.js`: "everything we offer" side panel, social links, Spanish tool catalogue and pictograms | — | **Skipped**: Spanish tool inventory and branding; Belastingkaart has one tool in development. Six simple pictograms drawn new for the roadmap |
| Page templates: home (masthead, headline with marker underline, two-column hero, numbered form blocks, sticky result card with brand ribbon and cut corner, tool index, guarantees), content pages, bilingual 404 | `web/nl/**`, `web/fr/**`, `web/404.html` | **Adapted**: same layout and idea, Belgian content. Form field names, `#salary-form` and `#result` unchanged, so `app.js` and the blocked calculation keep working; no amount is shown |
| SEO generators, territory/salary pages, guides, glossary, comparators, validation page, widget page, legal pages, `ads.txt`, `llms.txt` | — | **Skipped**: Spanish page inventory and copy. Belgian roadmap (sections 1–6 above) is shown on the home page as "In ontwikkeling / En développement" items without numbers; no extra skeleton pages were added |
| Analytics, ads, accounts, payments modules | existing `web/js/analitica.js`, `anuncios.js`, `cuentas.js` | **Not ported**; existing gated modules kept, `web/config.js` features stay `false` |

`test/design-system.test.mjs` checks the shared shell on every NL/FR page, that local links resolve, the language switch and hreflang pairs, NL/FR structural parity, that the result panel shows no amount, self-hosted fonts with licence and no third-party resources, and fails if Spanish strings or Mapafiscal branding appear anywhere in `web/`.
