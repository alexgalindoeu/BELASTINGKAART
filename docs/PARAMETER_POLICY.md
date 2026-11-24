# Parameter provenance and lifecycle

Every tax parameter must carry these fields:
- `value`: value or structured rule data; null if not verified.
- `status`: `confirmed`, `provisional` or `pending`.
- `jurisdiction`: federal, Flanders, Brussels, Wallonia or a defined municipality.
- `income_year`: calendar year in which income is earned.
- `assessment_year`: year of assessment / tax return, where applicable.
- `effective_from` and `effective_to`: inclusive legal validity dates.
- `source_name`, `source_url`, `source_title`, `retrieved_at`.
- `unit`, `rounding`, `notes`.

A parameter is confirmed only when the official source supports its value, scope and effective date. A generic explanatory page may establish a general rule but does not necessarily establish all exceptions.

Pending parameters must not silently fall back to another year or jurisdiction. Provisional parameters may be used only in internal research/test branches, never in a public calculation.

A calculator output is enabled only if every required parameter in its dependency chain is confirmed. The engine must return an explicit blocked status and list missing parameters otherwise.
