# Bijzondere bijdrage voor de sociale zekerheid — research note 2026

**Status: researched from official RSZ guidance, not implemented.** This note records the current official administrative guidance surfaced in the RSZ instructions 2026/3. It is not a confirmed year-wide parameter set: the page does not state an explicit effective-from date for the displayed thresholds and amounts. Keep `params/2026/payroll.yaml` at `pending` until the temporal validity and all payroll conditions are verified.

## Official sources

- NL: https://www.socialsecurity.be/employer/instructions/dmfa/nl/latest/instructions/special_contributions/other_specialcontributions/specialsocialsecuritycontribution.html
- FR: https://www.socialsecurity.be/employer/instructions/dmfa/fr/latest/instructions/special_contributions/other_specialcontributions/specialsocialsecuritycontribution.html
- Version displayed: Administratieve instructies RSZ / Instructions administratives ONSS 2026/3.
- Retrieved: 2026-11-24.
- The Dutch and French pages present the same categories, amounts and calculation structure.

## What the contribution is

The special social-security contribution is borne by employees in addition to ordinary employee social-security contributions. RSZ describes it as an advance against the amount ultimately due; the tax administration makes the final annual assessment when the income-tax assessment is established.

The amount depends on:
- the employee's remuneration;
- whether the taxpayer is individually assessed or subject to a joint assessment;
- for a joint assessment, whether the spouse has professional income or has no professional income.

Legally cohabiting partners are treated in the same way as married spouses for this rule. The term “spouse with professional income” has a specific meaning linked to the professional-withholding rules and family-burden reduction; it must not be inferred merely from a yes/no answer that a partner works.

## Calculation basis and scope

- The basis is the quarterly remuneration subject to ordinary social-security contributions.
- For manual workers, the remuneration is taken at 108%.
- If the employee has multiple employers, the calculation for this employer does not include remuneration paid by the other employer(s).
- The double holiday-pay component is excluded from the threshold calculation because it is not remuneration subject to ordinary social-security contributions.
- Relevant remuneration paid by a third party (principally a sectoral existence-security fund) is added.
- Arrears whose amount the employer could not determine when filing the RSZ declaration are excluded.
- The contribution applies to persons fully or partially subject to employee social security.

This means a single monthly gross amount is not enough to reproduce the exact contribution: the quarterly wage base and the payroll-period context are required.

## Quarterly withholding schedule displayed by RSZ 2026/3

All amounts below are the amounts shown on the current RSZ 2026/3 page. They are recorded here for research only; do not activate them in the calculator until their exact effective period has been established.

### Joint assessment — spouse with professional income

- Declared quarterly wage from EUR 3,285.29 up to (but not including) EUR 5,836.14: EUR 15.45 per quarter.
- Quarterly wage EUR 5,836.14–6,570.54, with monthly wage above EUR 1,945.38 and up to EUR 2,190.18: 5.90% of the monthly amount above EUR 1,945.38, with a minimum of EUR 15.45 per quarter.
- Quarterly wage above EUR 6,570.54: EUR 43.32 per quarter plus 1.10% of the monthly amount above EUR 2,190.18, capped at EUR 154.92 per quarter.

### Joint assessment — spouse without professional income

- Quarterly wage EUR 5,836.14–6,570.54, with monthly wage above EUR 1,945.38 and up to EUR 2,190.18: 5.90% of the monthly amount above EUR 1,945.38.
- Quarterly wage above EUR 6,570.54: EUR 43.32 per quarter plus 1.10% of the monthly amount above EUR 2,190.18, capped at EUR 182.82 per quarter.

### Individual assessment

- Quarterly wage EUR 5,836.14–6,570.54, with monthly wage above EUR 1,945.38 and up to EUR 2,190.18: 4.22% of the monthly amount above EUR 1,945.38.
- Quarterly wage above EUR 6,570.54 and up to EUR 11,211.00, with monthly wage above EUR 2,190.18 and up to EUR 3,737.00: EUR 30.99 per quarter plus 1.10% of the monthly amount above EUR 2,190.18.
- Quarterly wage above EUR 11,211.00 and up to EUR 12,300.00, with monthly wage above EUR 3,737.00 and up to EUR 4,100.00: EUR 82.05 per quarter plus 3.38% of the monthly amount above EUR 3,737.00.
- Quarterly wage above EUR 12,300.00 and up to EUR 18,116.46, with monthly wage above EUR 4,100.00 and up to EUR 6,038.82: EUR 118.83 per quarter plus 1.10% of the monthly amount above EUR 4,100.00.
- Quarterly wage above EUR 18,116.46: EUR 182.82 per quarter.

## Monthly payroll timing

The correct amount is determined from the total quarterly wage and is only known with certainty at the final payroll payment of the quarter. RSZ says the employer checks whether the total monthly wage in the first and second month reaches one third of a lower threshold; provisional amounts can then be withheld. At the last payment of the quarter, the employer calculates the correct quarterly amount and refunds any excess or withholds any shortfall.

The page gives explicit first/second-month provisional amounts for the joint-assessment case with a spouse who has professional income:
- Monthly wage EUR 1,095.10–1,945.38: EUR 5.15.
- Monthly wage above EUR 1,945.38 and up to EUR 2,190.18: 5.90% of the excess over EUR 1,945.38, minimum EUR 5.90.
- Monthly wage above EUR 2,190.18: EUR 14.44 plus 1.10% of the excess over EUR 2,190.18, capped at EUR 51.64.

The page also states that the deduction is made after employee social-security contributions and after professional withholding. The monthly advance rules for the other household categories must be extracted and checked before implementing them; do not assume the spouse-with-professional-income schedule applies to all categories.

## Implementation blockers

1. Establish the effective-from/effective-to dates for every amount and threshold. The page is labelled 2026/3 but does not itself provide a specific effective date for this contribution's displayed figures.
2. Model individual versus joint assessment separately from marital/legal-cohabitation status.
3. Model spouse professional income using the exact definition cross-referenced by RSZ, not a simplistic partner-employed flag.
4. Model quarterly remuneration per employer, manual-worker 108% treatment, excluded double holiday pay, third-party remuneration and arrears treatment.
5. Model provisional monthly withholding and quarter-end true-up separately.
6. Verify rounding and cent treatment from the official source/legal text before coding.
7. Keep annual final liability separate from monthly payroll withholding.

**Decision:** leave the parameter value null and status `pending`. This research note is not a substitute for a validated parameter file or a tested calculation engine.
