# PENDING: aanvullende gemeentebelasting (Flanders, AJ 2027) and the legal text of the bijzondere bijdrage voor de sociale zekerheid

Checked on 2026-11-25. Nothing in this file is entered in `params/` as a value.

## 1. Aanvullende gemeentebelasting (taxe communale additionnelle): rates per Flemish municipality

**Status: PENDING. No official dataset was reachable without a CAPTCHA.**

What was tried:

| Source | Result |
|---|---|
| Fisconet search API (`/myminfin-rest/fisconetPlus/public/search`), NL and FR, terms such as "aanvullende gemeentebelasting aanslagjaar 2027", "tarieven aanvullende gemeentebelasting personenbelasting", "taux taxe communale additionnelle exercice d'imposition 2027" | Only the legal articles (art. 465–470/2 WIB 92) and tables of contents of the KB/WIB 92. **No list of rates per municipality.** |
| data.gov.be (API and search page) | Bot challenge ("What code is in the image?"). Not bypassed, per policy. |
| www.vlaanderen.be / Statistiek Vlaanderen, page "Fiscale autonomie - belastingen lokale overheden" | Totals only (APB brought in 2,9 miljard euro in 2025). No per-municipality rate. The source cited there (ABB, "BBC - data en analyses") is on `lokaalbestuur.vlaanderen.be`. That host is not reachable from this session (proxy 403). |
| data.vlaanderen.be | Not reachable from this session (proxy 403). |

Relevant context, from the withholding sources (`bedrijfsvoorheffing_2026_fisconet.md` §2.2): the monthly bedrijfsvoorheffing already includes a flat **7 pct.** surcharge for the additional municipal tax, whatever the municipality. The real municipal rate is needed only for the **annual** assessment, not for the monthly payroll net.

**For the owner to download manually** (any of these, FOD Financiën or Flemish government):
1. FOD Financiën, financien.belgium.be: the page/list "Aanvullende gemeentebelasting" with the rates per municipality for **aanslagjaar 2027** (income 2026), or the latest published year if 2027 is not out yet. Ideally as a downloadable file (XLSX/CSV/PDF), so that a reproducible import script can read it rather than values being copied by hand.
2. Alternatively, Agentschap Binnenlands Bestuur (lokaalbestuur.vlaanderen.be): the dataset of the "aanvullende belasting op de personenbelasting" rates decided by each Flemish municipality for AJ 2027.

Until then, `R/06_municipal.R` and the dispatcher keep blocking ("municipal surcharge").

## 2. Bijzondere bijdrage voor de sociale zekerheid: wet van 30 maart 1994 houdende sociale bepalingen, art. 106 and following

**Status: PENDING. The legal text is not on Fisconet or socialsecurity.be.** The open question is whether the band rate applies to the monthly or to the quarterly excess (see `params/2026/payroll.yaml` → `special_social_security_contribution.method.notes`). It cannot be settled from the RSZ administrative instructions alone.

What was tried: Fisconet search ("bijzondere bijdrage voor de sociale zekerheid", "30.03.1994 wet houdende sociale bepalingen", "Artikel 106 wet 30 maart 1994"). The results are WIB 92 articles, circulars and parliamentary questions. The law itself is not reproduced. The Belgisch Staatsblad (ejustice.just.fgov.be), where the consolidated text lives, shows a CAPTCHA to agents. It was not bypassed.

**For the owner to download manually:** from ejustice.just.fgov.be (Justel, geconsolideerde wetgeving), the **wet van 30 maart 1994 houdende sociale bepalingen**, consolidated version in force in 2026, NL and FR. The part needed is the section on the "Bijzondere bijdrage voor de sociale zekerheid" (art. 106 and following, as cited by RSZ; the exact section numbering has not been verified here), including the paragraph that sets the employer's monthly/quarterly withholding (inhouding door de werkgever) and any implementing royal decree it refers to. Save it as PDF or HTML so that the relevant article can be quoted verbatim.

The 2026 bands in `payroll.yaml` stay `confirmed` from the RSZ instructions. The `method` stays `provisional`, so no special-contribution amount can be calculated.
