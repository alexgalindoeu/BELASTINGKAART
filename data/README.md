# Generated tax data

The active deployable dataset is `web/data/parameters.json`. It is generated from the authoritative YAML files in `params/<income-year>/` by:

```bash
Rscript tools/export_parameters.R
```

Do not edit the generated JSON by hand. Check that it is up to date with:

```bash
Rscript tools/export_parameters.R --check
```

The original root-level `data/` folder is retained only for repository compatibility during the initial scaffold migration.
