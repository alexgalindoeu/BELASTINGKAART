# Official source register

Last reviewed: 2026-11-25. Only official public authorities are permitted as tax sources.

| Authority | Official domain | Primary use |
|---|---|---|
| FOD / SPF Financiën | https://fin.belgium.be/ | Federal personal income tax, tax return, tax reductions and official guidance |
| FPS Finance tax rates | https://finances.belgium.be/en/private-individuals/tax-return/income/tax-rates | Income-year tax brackets and basic personal tax allowance |
| FPS Finance professional withholding | https://finances.belgium.be/fr/entreprises/personnel_et_remuneration/precompte_professionnel/calcul | Official 2026 withholding rules, key formula and simulator |
| Fisconet (FOD Financiën) | https://www.minfin.fgov.be/myminfin-web/pages/public/fisconet (documents via the public endpoint `https://www.minfin.fgov.be/myminfin-rest/fisconetPlus/public/document/<guid>`, no CAPTCHA) | Bijlage III KB/WIB 92, sleutelformules, codified WIB 92 articles and indexation notices; transcriptions in [sources/bedrijfsvoorheffing_2026_fisconet.md](sources/bedrijfsvoorheffing_2026_fisconet.md) and [sources/personenbelasting_2026_fisconet.md](sources/personenbelasting_2026_fisconet.md) |
| RSZ / ONSS | https://www.socialsecurity.be/ | Employee and employer social-security contributions, work bonus / bonus à l'emploi |
| RSVZ / INASTI | https://www.rsvz.be/ (also https://www.inasti.be/) | Social contributions of self-employed persons (`params/2026/zelfstandigen.yaml`, 2026 folder 'Bijdragen 2026') |
| RSZ werkbonus | https://www.socialsecurity.be/employer/instructions/dmfa/nl/latest/instructions/deductions/workers_reductions/workbonus.html (and `2026-1`, `2026-2` versions) | Social work bonus tables per period; verbatim transcription in [sources/werkbonus_2026_rsz.md](sources/werkbonus_2026_rsz.md) |
| RSZ special social-security contribution (NL) | https://www.socialsecurity.be/employer/instructions/dmfa/nl/latest/instructions/special_contributions/other_specialcontributions/specialsocialsecuritycontribution.html | Quarterly special employee social-security contribution and payroll withholding |
| ONSS cotisation spéciale de sécurité sociale (FR) | https://www.socialsecurity.be/employer/instructions/dmfa/fr/latest/instructions/special_contributions/other_specialcontributions/specialsocialsecuritycontribution.html | Same official rule in French; use for NL/FR terminology parity |
| RSVZ / INASTI | https://www.rsvz.be/ · https://www.inasti.be/ | Social status of the self-employed: who is self-employed, contributions 2026 (brochure "Bijdragen 2026 / Cotisations 2026"), rights; claim log in [sources/zelfstandigen_2026-11-25.md](sources/zelfstandigen_2026-11-25.md) |
| Vlaamse overheid | https://www.vlaanderen.be/ | Flemish taxes and regional rules |
| Vlaamse Belastingdienst | https://www.belasting.vlaanderen.be/ | Flemish tax administration and official rules |
| Brussels Fiscaliteit | https://fiscaliteit.brussels/ | Brussels regional taxes |
| SPW Finances | https://finances.wallonie.be/ | Walloon regional taxes |
| Region pages (NL/FR) | Fisconetplus (BFW 16.01.1989, BCFP), fin.belgium.be, vlaanderen.be, finances.wallonie.be, statbel.fgov.be | Regional competences in the personal income tax and the property tax; claim → quote → URL log and verbatim BFW art. 5/1–5/3 in [sources/gewesten_2026-11-26.md](sources/gewesten_2026-11-26.md) |
| Pension-savings pages (NL/FR) | Fisconetplus (WIB 92 art. 34, 39, 145/1–145/16, 171 inkomsten 2026; WDRT art. 184–187/1; indexation notice AJ 2027; circ. 2018/C/72) | Pensioensparen / épargne-pension ceilings, rates, tax at 60 and early payout; langetermijnsparen; claim → quote → URL log in [sources/pensioensparen_2026-11-27.md](sources/pensioensparen_2026-11-27.md) |
| Belgisch Staatsblad / Moniteur belge | https://www.ejustice.just.fgov.be/ | Official legislation and amendments |

Additional official public bodies may be added when their legal competence is relevant (for example Statbel for official statistics). A source is not accepted merely because it is government-related: the page must support the exact parameter or rule being implemented.

## Excluded sources
No private tax firms, accountants, law firms, commercial publishers, comparison sites, blogs, newspapers, forums or private tax calculators. They are not used even as a secondary validation source.

## Source review
For every parameter, store the exact official URL, authority, source title, date retrieved, applicable income year, assessment year, effective dates and a short explanation of the rule. Where legislation and administrative guidance differ, record the legislation and resolve the interpretation before implementation.
