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
| Federal progressive income-tax brackets | Confirmed from Fisconet (art. 130 WIB 92, inkomsten 2026 / AJ 2027); see [sources/personenbelasting_2026_fisconet.md](sources/personenbelasting_2026_fisconet.md) |
| Basic personal tax allowance | 11,550 EUR confirmed from Fisconet (art. 131); dependant increases (art. 132) and tax-on-tax-free-sum scale (art. 134 §2) confirmed; art. 133, art. 134 §3–4 and huwelijksquotiënt pending |
| Employee contribution headline rate | Provisional for year-specific application |
| Work bonus (social) | Jan–Sep 2026 tables confirmed from RSZ DmfA instructions 2026/1–2026/3, engine in R and JS with shared fixture; Oct–Dec 2026 pending (2026/4 not published); method provisional (P rounding, annual-cap application, prestatiecode 38); annual cap not applied; fiscal work bonus not covered |
| Professional withholding 2026 | Monthly wages of resident employees: rules transcribed and confirmed from Bijlage III KB/WIB 92 and the sleutelformule (Fisconet) in three periods by payment date (Jan–Jul, Aug–Oct: luik B 63%, Nov–Dec: reform values); see [sources/bedrijfsvoorheffing_2026_fisconet.md](sources/bedrijfsvoorheffing_2026_fisconet.md). No engine yet; exceptional pay out of scope |
| Flat-rate professional expenses | Confirmed: 30%, max 6,070 EUR (art. 51 WIB 92; withholding: 30% up to 20,233.33, max 6,070) |
| Special social-security contribution | Q1–Q3 2026 schedule confirmed (RSZ instructions 2026/1, 2026/2, 2026/3; text identical NL/FR and since 2025/4); Q4 pending (2026/4 not published); method provisional: rate base (monthly vs quarterly excess) and rounding to be settled from the law of 30 March 1994 (only on ejustice, CAPTCHA: owner to download); spouse-income classification not modelled; no engine yet |
| Municipal surcharge | Pending: no CAPTCHA-free official per-municipality dataset found (see [sources/pending_gemeentebelasting_bijzondere_bijdrage.md](sources/pending_gemeentebelasting_bijzondere_bijdrage.md)); monthly withholding already includes a flat 7% |
| Family-specific tax allowance | Withholding: confirmed tables (children, other family burdens). Annual tax: art. 132 confirmed, art. 133 pending |
| Full monthly net salary | Blocked |

A result is enabled only when every dependency for the selected profile is confirmed.
