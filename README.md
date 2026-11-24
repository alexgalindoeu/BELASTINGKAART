# Belastingkaart

Bilingual Belgian tax calculator project scaffold.

## Product decisions
- Independent project: do not modify or deploy from `MAPAFISCAL`.
- Languages: Dutch (`/nl/`) and French (`/fr/`).
- One calculation engine shared by both language layers.
- Initial geographic scope: Flanders, with the architecture ready for Wallonia and Brussels.
- First product: gross-to-net salary calculator.

## Current status
This is the initial product/UI scaffold, not a tax calculator ready for public use.
The salary form validates input and captures the intended inputs, but it deliberately
does not produce a net-salary figure until the Belgian tax and social-security rules
have been implemented and validated against official examples.

## Structure
- `nl/index.html`: Dutch landing page and calculator shell.
- `fr/index.html`: French equivalent.
- `assets/css/site.css`: shared responsive design.
- `assets/js/app.js`: shared form behaviour and validation.
- `assets/js/i18n.js`: small translation dictionary.
- `assets/js/tax-engine.js`: explicit placeholder for the verified Belgian calculation engine.
- `data/`: place official, dated tax parameters here once sourced and reviewed.

## Run locally
Open `nl/index.html` or `fr/index.html` in a browser. No build step is required.

## Next implementation milestones
1. Establish the tax year (initial target: income year 2026 / assessment year 2027, subject to confirmation).
2. Document the official federal, social-security, regional and municipal rules.
3. Implement employee social-security contributions and gross taxable income.
4. Implement federal income tax, tax-free allowance, professional expenses and family situation.
5. Add municipal surcharge and relevant regional/communal distinctions.
6. Build a validation set from official examples and independent payroll calculations.
7. Only then enable net salary results and publish a methodology page.

## Important
Never copy Spanish IRPF parameters or formulas into this project.
Do not present estimates as official or guaranteed payroll results.
