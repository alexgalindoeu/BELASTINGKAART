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
