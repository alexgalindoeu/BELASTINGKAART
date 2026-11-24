# Deployment

The deployable static site is `web/`. GitHub Pages uploads this directory only after Node, parameter-provenance and R tests pass.

The site has language routes `/nl/` and `/fr/`; the root route directs visitors to Dutch by default. Configure a custom domain only after the repository Pages deployment and DNS are deliberately enabled. Do not add a production domain or payment configuration without the owner's approval.

During the architecture port, GitHub Actions CI is manual-only (`workflow_dispatch`) to prevent failed intermediate commits from generating notification emails. Pages deployment is also manual-only. Restore automated checks only after the complete suite passes.
