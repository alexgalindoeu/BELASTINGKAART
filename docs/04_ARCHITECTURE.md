# Architecture

## Target structure
```
params/<income-year>/*.yaml  (versioned legal source of truth)
             | Rscript tools/export_parameters.R
             v
web/data/parameters.json     (generated, consumed by browser)
             |
             +--> R/ reference calculation engine
             +--> web/js/ JavaScript calculation engine
             +--> test/ Node + Playwright
             +--> tests/ R testthat
web/                         static NL/FR site
  index.html
  nl/ and fr/                translated pages with shared engine
  js/                        modular browser application
  css/                       stylesheets
  data/                      generated datasets
supabase/                    optional accounts/catalogue/payments
tools/                       export, validation, SEO and packaging
.github/workflows/           CI and deployment
```

## Porting rules
Reuse generic UI, accessibility, test, build, analytics and deployment patterns from Mapafiscal only after reviewing each file. Replace Spanish-specific assumptions, content, URLs, identifiers, legal notices and data. Never copy Spanish fiscal formulas or parameter values.

## Tax-engine boundary
The initial public feature is an employee gross-to-net calculator. The calculation must model employee social contributions (including applicable work bonus), taxable remuneration, professional withholding / annual tax reconciliation, federal tax reductions and tax-free allowance, family situation, and municipal surcharge. Regional rules are included only where legally applicable. A monthly payroll withholding estimate and an annual final tax liability are distinct outputs and must not be conflated.

## Data flow
YAML is authoritative. R loads and validates YAML; an exporter generates JSON. JavaScript consumes only generated JSON. A parameter without official evidence remains pending and blocks any result that depends on it.

## Languages and jurisdiction
The NL and FR pages share the same engine and parameter set. Language selection changes labels and explanatory content, not the calculation. Flanders is the initial jurisdiction; Brussels and Wallonia remain unavailable until implemented.
