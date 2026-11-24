# Deployment

The deployable static site is `web/`. GitHub Actions publishes this directory to GitHub Pages after Node, parameter-provenance and R tests pass.

The current pages are available under `/nl/` and `/fr/`; `/ ` redirects to Dutch by default. Configure a custom domain only after the repository Pages deployment and DNS are deliberately enabled. Do not add a production domain or payment configuration without the owner's approval.

The root-level `nl/`, `fr/` and `assets/` files are the original starter scaffold retained temporarily during migration. The active site is under `web/`.
