# Employee gross-to-net: calculation scope

## Output distinction
Belastingkaart must distinguish:
1. **Monthly payroll net**: gross remuneration less employee social contributions and payroll withholding / other applicable payroll deductions.
2. **Annual disposable income after final tax**: annual taxable income and final assessment, including any reconciliation between withholding and final tax.

They are not interchangeable. The UI must state which result it displays.

## Required components before a public net result
- Gross remuneration basis and remuneration frequency.
- Employee social-security contributions and the applicable work bonus.
- Special social-security contribution where applicable.
- Taxable professional income and official professional-expense rules.
- Federal progressive tax and basic tax-free allowance.
- Personal and family-related increases / reductions.
- Applicable municipal surcharge and any relevant regional provisions.
- Payroll withholding rules for the selected period and household profile.
- Holiday pay, year-end bonus and worker/employee category treatment where relevant.

## Current coverage (income year 2026)
| Component | Status |
|---|---|
| Federal progressive income-tax brackets | Confirmed from FPS Finance |
| Basic personal tax allowance | Confirmed from FPS Finance |
| Employee contribution headline rate | Provisional for year-specific application |
| Work bonus (social) | Jan–Sep 2026 tables confirmed from RSZ DmfA instructions 2026/1–2026/3, engine in R and JS with shared fixture; Oct–Dec 2026 pending (2026/4 not published); method provisional (P rounding, annual-cap application, prestatiecode 38); annual cap not applied; fiscal work bonus not covered |
| Professional withholding 2026 | Pending extraction of official rules and key formula |
| Flat-rate professional expenses | Pending exact official 2026 parameters |
| Special social-security contribution | Official RSZ 2026/3 research documented; effective dates, spouse classification and quarterly-to-monthly withholding still pending |
| Municipal surcharge | Pending official municipality-level dataset |
| Family-specific tax allowance | Pending detailed official parameters |
| Full monthly net salary | Blocked |

A result is enabled only when every dependency for the selected profile is confirmed.
