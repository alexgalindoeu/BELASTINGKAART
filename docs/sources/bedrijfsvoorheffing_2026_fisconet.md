# Bedrijfsvoorheffing / précompte professionnel 2026: Bijlage III KB/WIB 92 and the sleutelformule (FOD Financiën, Fisconet)

- **Source:** FOD Financiën / SPF Finances, Fisconet (the FOD's official database of legislation and administrative guidance). Only Fisconet was used.
- **Retrieved:** 2026-11-25. The Fisconet web app (`https://www.minfin.fgov.be/myminfin-web/pages/public/fisconet/...`) loads each document from the public REST endpoint `https://www.minfin.fgov.be/myminfin-rest/fisconetPlus/public/document/<guid>`. That endpoint returns JSON with the metadata and the document (HTML or PDF, base64). No CAPTCHA, no login. PDFs were converted with `pdftotext -layout`.
- **Reproduce:** `curl -s https://www.minfin.fgov.be/myminfin-rest/fisconetPlus/public/document/<guid> | jq -r .data.content.content | base64 -d > doc.pdf`.
- **Scope of this file:** monthly wages (bezoldigingen) of **resident employees** (werknemers, rijksinwoners), paid per month. Out of scope (only listed): bedrijfsleiders, pensions and replacement income, non-residents, payments other than per month, exceptional pay (holiday pay, 13th month and so on: transcribed for reference in §6 only), arrears, overtime and group insurance.
- **Transcription:** quotes are verbatim, copied from the PDF/HTML text. Only whitespace is normalised and page headers and footers are removed. Amounts are written exactly as in the source (Belgian notation: `1.234,56`).

## 0. Documents consulted

| ID | Fisconet GUID | Title (as published) | Lang. | Document date | Role |
|---|---|---|---|---|---|
| TOC-NL | `da14799a-a9fa-420e-9b75-2004a59d4ce3` | Bedrijfsvoorheffing berekenen | NL | (lastModified 2026-10-28) | Table of contents: lists "Regels 1 januari 2026", "Sleutelformule vanaf 1 januari 2026", "Sleutelformule vanaf 1 november 2026" and two 2026 simulators (`.xlsx`, not used) |
| TOC-FR | `f547b584-9f46-46df-801b-3c059548f76b` | Calcul de précompte professionnel | FR | | Same list in FR |
| R-NL | `a38f6c59-3ab9-49d3-8844-d39f91387663` | Regels 1 januari 2026 | NL | 2025-12-17 | Bijlage III KB/WIB 92 as set by **KB 11 december 2025** (original version, from 1 January 2026) |
| R-FR | `536a741e-81d6-4605-ad11-8e07ebc4a440` | Règles 1er janvier 2026 | FR | 2025-12-17 | FR of R-NL |
| B3-NL | `7749a105-960f-4635-a817-1a20c15cc0fa` | Bijlage III, KB/WIB 92 (inkomsten 2026)** | NL | 2026-09-27 (modified 2026-10-13) | Codified Bijlage III with the **amendment history and effective dates** |
| B3C-NL | `b14d7617-e298-4210-ab8f-dbb3bced2922` | Bijlage III, KB/WIB 92 (inkomsten 2026 - gecoördineerde versie)** | NL | 2026-09-27 | Coordinated text after KB 24.07.2026 and KB 27.09.2026 |
| B3C-FR | `6c6b27a8-d275-4ab8-bed1-c979ab3d9314` | Annexe III, AR/CIR 92 (revenus 2026 - version coordonnée)** | FR | | FR of B3C-NL |
| SF1-NL | `821b117c-eebc-497a-8297-ed2bb1e99d75` | Sleutelformule vanaf 1 januari 2026 | NL | 2025-12-17 | Key formula, ref. BEO-DR/2025-0928 |
| SF1-FR | `389035ca-432e-422b-859d-2d32fbdaa4cf` | Formule-clé à partir du 1er janvier 2026 | FR | 2025-12-17 | FR of SF1-NL (this is the `official_formula_url` already in `payroll.yaml`) |
| SF11-NL | `905faa6f-0a50-407b-ad09-ce1c677a6735` | Sleutelformule vanaf 1 november 2026 | NL | 2026-10-26 | Key formula, ref. BEO-DR/2025-0928_v2 |
| SF11-FR | `93032da8-dfe9-4543-9cdf-778272cb86bc` | Formule-clé à partir du 1er novembre 2026 | FR | 2026-10-26 | FR of SF11-NL |
| C89 | `e2e1e290-47bd-4203-abce-966f56f396eb` | Circulaire 2026/C/89 over de verhoging van de fiscale werkbonus | NL | 2026-09-23 | Context for luik B 52,54 → 63 pct. (annual tax credit, art. 289ter/1 WIB 92) |

Human-readable links: `https://www.minfin.fgov.be/myminfin-web/pages/public/fisconet/document/<guid>`.

## 1. Timeline in 2026: three parameter sets (summary)

B3-NL and B3C-NL (header, verbatim):

> "Schalen en regels die van toepassing zijn om de bedrijfsvoorheffing vast te stellen bij de bron verschuldigd op inkomsten betaald of toegekend vanaf 01.01.2026 (KB 11.12.2025 - B.S. 29.12.2025; Numac: 2025009487; bekrachtigd door art. 28, 2°, W 23.09.2026 - B.S. 07.10.2026; Numac : 2026007237)"

> "Bijlage III, nummer 45.2, 78.3.2, 139 en 144.1, heeft uitwerking met ingang van 01.01.2026 (art. 2, 5 en 6, 2° en 7, tweede lid, KB 24.07.2026 - B.S. 30.07.2026; Numac: 2026005690)"

> "Bijlage III, nummer 45.3, heeft uitwerking met ingang van 01.04.2026 (art. 3 en 7, derde lid, KB 24.07.2026 - B.S. 30.07.2026; Numac: 2026005690)"

> "Bijlage III, nummer 46.2.2, 139 en 144.1, treedt in werking op 01.08.2026 (art. 4, 6, 1°, en 7, vierde lid, KB 24.07.2026 - B.S. 30.07.2026; Numac: 2026005690)"

> "Bijlage III, nummer 4.2, 5de streepje, en 4.2, 6de streepje en 4.2, 7de streepje (toevoeging), en 32, en 34.1.1, en 34.2, en 38 (tabel), en 39 (tabel), en 40 (tabel), en 41 (tabel) en 54, is van toepassing op de vanaf 1.11.2026 betaalde of toegekende inkomsten (art. 1, 2, 3, 4, 5, 6, 7, 8, 9 en 10, eerste lid, KB 27.09.2026 - B.S. 02.10.2026; Numac: 2026007167)"

> "[In afwijking van art. 10, eerste lid, KB. 27.09.2026 - B.S. 02.10.2026; numac: 2026007167; zijn de wijzigingen vervat in dit besluit niet van toepassing wanneer de bedrijfsvoorheffing wordt berekend overeenkomstig de regels vastgelegd in nummer 80 of Deel 5 van de toepassingsregels van de bijlage III van het KW/WIB 92.(art. 10, tweede lid, KB 27.09.2026 - B.S. 02.10.2026; numac: 2026007167)]"

FR (B3C-FR):

> "Annexe III, numéro 46.2.2, 139 en 144.1, entre en vigueur le 01.08.2026 (art. 4, et 6, 1°, et 7, alinéa 4, AR 24.07.2026 - M.B. 30.07.2026; Numac: 2026005690)"

> "Annexe III, numéro 4.2, 5ième tiret, et 4.2, 6ième tiret, et 4.2, 7ième tiret (insertion), et 32, et 34.1.1, et 34.2, et 38 (tableau), et 39 (tableau), et 40 (tableau), et 41 (tableau) et 54, est applicable aux revenus payés ou attribués à partir du 01.11.2026 (art. 1, 2, 3, 4, 5, 6, 7, 8, 9 et 10, alinéa 1, AR 27.09.2026 - M.B. 02.10.2026; Numac: 2026007167)"

Resulting periods for **monthly wages of resident employees**. The dates refer to the date of **payment or attribution** ("betaald of toegekend"), not to the month in which the work was done.

| Period key | Paid/attributed | Legal basis | What changes |
|---|---|---|---|
| `2026_01` | 2026-01-01 – 2026-07-31 | KB 11.12.2025 (R-NL); key formula SF1 | base set |
| `2026_08` | 2026-08-01 – 2026-10-31 | KB 11.12.2025 + KB 24.07.2026 (nr. 46.2.2) | fiscal work-bonus reduction, luik B: 52,54 pct. → **63 pct.** Nothing else in scope changes. |
| `2026_11` | 2026-11-01 – 2026-12-31 | KB 27.09.2026 (B3C-NL); key formula SF11 | tax-free sum 11.170 → 11.550; marital quotient cap; tables nrs. 38–41; exemption table nr. 54 |

> **Discrepancy to note (period `2026_08`).** FOD Financiën did not publish a new key formula for August 2026. SF1-NL (January) still says "52,54 pct." for luik B (nr. 20), while the regulation (Bijlage III nr. 46.2.2 as amended by KB 24.07.2026, "treedt in werking op 01.08.2026") says 63 pct. The regulation prevails over the administrative key formula. SF11 (from 1 November) also states 63 pct. The `2026_08` set is therefore the January set with 63 pct. for luik B. This combination is explicit in B3-NL. No single document prints it as one table.

The other KB 24.07.2026 amendments (nrs. 45.2, 45.3: overtime; 78.3.2, 139, 144.1: other categories) are out of scope.

## 2. Rules common to all 2026 periods (monthly wages, resident employees)

### 2.1 Rounding
R-NL nr. 12 (unchanged in B3C-NL):
> "Voor de toepassing van deze volledige bijlage, met inbegrip van nrs. 4 en 11 hierboven, worden alle bedragen, in voorkomend geval in elke stap, afgerond tot de hogere of lagere cent, naargelang het cijfer van de duizendsten al dan niet 5 bereikt."

SF1-NL nr. 3 (identical in SF11-NL):
> "Voor de toepassing van deze sleutelformule, worden alle bedragen, in voorkomend geval in elke stap, afgerond tot de hogere of lagere cent, naargelang het cijfer van de duizendsten al dan niet 5 bereikt;"

SF1-FR nr. 3:
> "Pour l'application de la présente formule-clé, tous les montants sont, le cas échéant à chaque étape du calcul, arrondis au cent supérieur ou inférieur selon que le chiffre des millièmes atteint ou non 5 ;"

→ half-up to the cent at every step (`round_half_up` in `R/00_utils.R`).

### 2.2 Scope of the key formula and the 7 pct. surcharge
SF1-NL nr. 4:
> "De sleutelformule geldt alleen voor de BV verschuldigd op bezoldigingen en op in artikel 146 WIB 92 vermelde pensioenen of werkloosheidsuitkeringen met bedrijfstoeslag die periodiek worden betaald. In alle andere gevallen wordt de BV berekend volgens de schalen en de erbij horende regels die in bijlage III van het KB/WIB 92 zijn opgenomen."

SF1-NL nr. 5 (identical in SF11-NL):
> "Bij de berekening van de BV zoals hierna aangegeven is reeds rekening gehouden met een verhoging van 7 pct. voor de aanvullende belastingen (gemeente- en agglomeratiebelasting)."

SF1-FR nr. 5:
> "Le calcul du Pr.P tel que détaillé ci-après, intègre déjà une majoration de 7 p.c. pour les taxes additionnelles (taxe communale et taxe d'agglomération)."

→ The monthly withholding does **not** depend on the employee's municipality. The flat 7 pct. is built into the scale (26,75 = 25 × 1,07; 42,80 = 40 × 1,07; 48,15 = 45 × 1,07; 53,50 = 50 × 1,07). The real municipal rate matters only for the final annual assessment.

### 2.3 The five steps
SF1-NL nr. 6:
> "De BV die bij betaling van maandelijkse bezoldigingen is verschuldigd, wordt in vijf stappen berekend. Deze vijf stappen zijn: A. vaststellen van het bruto jaarinkomen; B. omzetten van het bruto jaarinkomen in het belastbare netto jaarinkomen; C. berekenen van de jaarbelasting; D. berekenen van de bedrijfsvoorheffing op maandbasis; E. toepassen van de andere verminderingen."

### 2.4 Step A: gross annual income (social deductions, ×12)
R-NL nr. 25.1:
> "De bedrijfsvoorheffing op maandelijkse beroepsinkomsten, andere dan vermeld onder nr. 25.2, wordt vastgesteld op grondslag van de werkelijk betaalde of toegekende bruto-inkomsten, verminderd met de verplichte inhoudingen ter uitvoering van de sociale wetgeving of van een ermede gelijkgesteld wettelijk of reglementair statuut."

R-NL nr. 26:
> "Het maandelijks bedrag bekomen na aftrek van de sociale inhoudingen vermeld onder afdeling 5 wordt vermenigvuldigd met 12 om te komen tot het jaarlijks brutobedrag van de belastbare grondslag."

SF1-NL nr. 7:
> "Om het bruto jaarinkomen vast te stellen moet men: 1° - het betaalde brutobedrag van de maandelijkse bezoldigingen verminderen met de inhoudingen gedaan ter uitvoering van de sociale wetgeving of een ermede gelijkgesteld wettelijk of reglementair statuut; […] 2° het bekomen verschil vermenigvuldigen met 12."

(The table in nr. 7, 1°, second dash, applies to bedrijfsleiders only and is out of scope.)

### 2.5 Step B: flat-rate professional expenses (employees)
R-NL nr. 28 (unchanged in B3C-NL):

| JAARLIJKS BRUTOBEDRAG VAN DE BELASTBARE GRONDSLAG | FORFAITAIRE BEROEPSKOSTEN |
|---|---|
| tot 20.233,33 EUR | 30 pct. |
| boven 20.233,33 EUR | 6.070 EUR (maximum) |

SF1-NL nr. 8 (identical in SF11-NL):
> "Het belastbare netto jaarinkomen is gelijk aan het bruto jaarinkomen verminderd met de forfaitaire beroepskosten. […] 1° Bezoldigingen (wedden en lonen) van werknemers — BRUTOJAARINKOMEN / FORFAITAIRE BEROEPSKOSTEN: tot 20.233,33 EUR 30 pct.; boven 20.233,33 EUR 6.070 EUR (maximum)"

SF1-FR nr. 8:
> "Le revenu annuel net imposable est égal au revenu annuel brut diminué des frais professionnels forfaitaires. […] 1° Rémunérations des travailleurs (traitements et salaires) — REVENU ANNUEL BRUT / FRAIS PROFESSIONNELS FORFAITAIRES: jusqu'à 20.233,33 EUR 30 p.c.; supérieur à 20.233,33 EUR 6.070 EUR (maximum)"

### 2.6 Step C: base scale (basisschaal)
R-NL nr. 31 (unchanged in B3C-NL, SF1-NL Bijlage 1, SF11-NL Bijlage 1):

| JAARLIJKS NETTOBEDRAG VAN DE BELASTBARE GRONDSLAG | BASISBELASTING |
|---|---|
| van 0,01 EUR tot 16.710 EUR | 26,75 pct. |
| van 16.710,01 EUR tot 29.500 EUR | 4.469,93 EUR + 42,80 pct. op de schijf boven 16.710 EUR |
| van 29.500,01 EUR tot 51.050 EUR | 9.944,05 EUR + 48,15 pct. " " 29.500 EUR |
| boven 51.050 EUR | 20.320,38 EUR + 53,50 pct. " " 51.050 EUR |

SF1-FR Annexe 1:

| | |
|---|---|
| de 0,01 EUR à 16.710 EUR | 26,75 p.c. |
| de 16.710,01 EUR à 29.500 EUR | 4.469,93 EUR + 42,80 p.c. de la tranche au-delà de 16.710 EUR |
| de 29.500,01 EUR à 51.050 EUR | 9.944,05 EUR + 48,15 p.c. " " 29.500 EUR |
| supérieur à 51.050 EUR | 20.320,38 EUR + 53,50 p.c. " " 51.050 EUR |

Note: these **withholding** bracket limits (16.710 / 29.500 / 51.050) differ from the **personal income tax** limits for income year 2026 (16.720 / 29.510 / 51.070, art. 130 WIB 92; see `personenbelasting_2026_fisconet.md`). Both are official. They are different instruments and must not be mixed.

### 2.7 Step D: monthly withholding
R-NL nr. 42:
> "Om de per maand verschuldigde bedrijfsvoorheffing vast te stellen, wordt de basisbelasting desgevallend verminderd overeenkomstig hoofdstuk 2, gedeeld door 12."

SF1-NL nr. 13:
> "Alle verminderingen mogen worden samengevoegd zonder dat nochtans het totaal ervan het bedrag van de basisbelasting mag overtreffen."

### 2.8 Step E: other reductions (order and the floor at zero)
R-NL nr. 43:
> "Van de maandelijkse verschuldigde bedrijfsvoorheffing vastgesteld overeenkomstig hoofdstuk 3 mogen, naar gelang van het geval, achtereenvolgens volgende verminderingen nog in mindering worden gebracht:"

The order is (afdelingen 1 to 4 of R-NL / nrs. 17 to 20 of SF1-NL): group insurance (30 pct. of the employee's contributions), overtime, fiscal work bonus, low public-sector income. SF1-NL nr. 20 places the work-bonus reduction "na toepassing van nrs. 17 tot 19".

SF1-NL nr. 21 (identical in SF11-NL):
> "De toepassing van de verminderingen kan er niet toe leiden dat de bedrijfsvoorheffing negatief wordt."

### 2.9 Family situation and dependants: reference date and definitions
R-NL nr. 5.1:
> "Om de vermindering van de bedrijfsvoorheffing wegens gezinslasten vast te stellen, moet de gezinstoestand van de verkrijger van de inkomsten in aanmerking worden genomen zoals die zich voordoet op 1 januari van het jaar waarin de inkomsten worden betaald of toegekend."

R-NL nr. 2: "De wettelijk samenwonenden worden gelijkgesteld met gehuwden, en een wettelijk samenwonende wordt gelijkgesteld met een echtgenoot."

R-NL nr. 6: "Wanneer beide echtgenoten beroepsinkomsten verkrijgen, worden de verminderingen wegens gezinslasten, behalve die voor de echtgenoot met een handicap aan de door hen gekozen echtgenoot toegekend."

R-NL nr. 8: "Voor de berekening van de bedrijfsvoorheffing wordt een kind ten laste met een handicap, evenals een andere personen ten laste met een handicap, met uitzondering van de persoon vermeld onder nr. 9, voor twee gerekend."

R-NL nr. 11.2 (net income test for the spouse thresholds of 174, 290 and 579 EUR):
> "Deze grenzen worden vastgesteld door: a) de bruto beroepsinkomsten te verminderen met de verplichte inhoudingen of bijdragen gedaan ter uitvoering van de sociale wetgeving of van een ermede gelijkgesteld wettelijk of reglementair statuut; b) vervolgens het verschil te verminderen met 20 pct."

## 3. Period `2026_01` (paid 1 January – 31 July 2026) and `2026_08` (paid 1 August – 31 October 2026)

Sources: R-NL (KB 11.12.2025), SF1-NL / SF1-FR. Identical for both periods except §3.6.

### 3.1 Single, or spouse with own professional income (R-NL nr. 32)
> "Behoudens de in nr. 33 vermelde afwijking wordt de belasting bekomen volgens hoofdstuk 1, verminderd met 2.987,98 euro (zijnde de belasting op het basisbedrag van de belastingvrije som ten bedrage van 11.170 euro). Het bekomen verschil vormt de basisbelasting."

SF1-FR: "L'IMPOT DE BASE est égal à l'impôt calculé à l'aide du barème de base et diminué de 2.987,98 EUR (c.-à-d. l'impôt sur la quotité du revenu exemptée d'impôt, qui s'élève à 11.170 EUR)."

R-NL nr. 33 (exception, unchanged in November):
> "Wanneer de echtgenoot van de verkrijger van de inkomsten persoonlijke beroepsinkomsten heeft die uitsluitend bestaan uit pensioenen, renten of ermede gelijkgestelde inkomsten waarvan het bedrag niet hoger is dan 174 euro NETTO per maand, wordt in afwijking van nr. 32 de basisbelasting berekend overeenkomstig afdeling 2 alsof die echtgenoot geen eigen beroepsinkomsten zou hebben."

### 3.2 Spouse without own professional income: huwelijksquotiënt (R-NL nr. 34)
> "34.1.1. Aan de echtgenoot van de verkrijger van de inkomsten wordt een beroepsinkomen toegekend dat gelijk is aan 30 pct. van het nettobedrag van de belastbare grondslag. Het toegekende inkomen mag echter niet meer bedragen dan 13.790 euro (maximum bereikt bij een nettobedrag van de belastbare grondslag van 45.966,67 euro).
> 34.1.2. Vervolgens wordt de belasting op het aldus toegekende inkomen berekend met behulp van de onder hoofdstuk 1 vermelde basisschaal.
> 34.1.3. Daarna wordt de belasting op dezelfde wijze berekend op het verschil tussen: a) het nettobedrag van de belastbare grondslag en b) het aan de andere echtgenoot toegekende inkomen.
> 34.2. Basisbelasting — De basisbelasting is gelijk aan de som van de overeenkomstig nrs. 34.1.2 en 34.1.3 bekomen resultaten verminderd met 5.975,96 euro (zijnde tweemaal de belasting op het basisbedrag van de belastingvrije som ten bedrage van 11.170 euro)."

### 3.3 Reduction for dependent children (R-NL nr. 38; SF1-NL Bijlage 3)

| AANTAL KINDEREN TEN LASTE | VERMINDERING VAN DE BASISBELASTING |
|---|---|
| 1 | 624 EUR |
| 2 | 1.656 EUR |
| 3 | 4.404 EUR |
| 4 | 7.620 EUR |
| 5 | 11.100 EUR |
| 6 | 14.592 EUR |
| 7 | 18.120 EUR |
| 8 | 21.996 EUR |

> "meer dan 8: de basisbelasting wordt verminderd met een vast bedrag van 21.996 EUR, verhoogd met 3.864 EUR per kind ten laste boven het achtste, d.w.z.: a) voor 9 kinderen: 21.996 + (1 x 3.864) = 25.860 EUR b) voor 10 kinderen: 21.996 + (2 x 3.864) = 29.724 EUR enz."

SF1-NL Bijlage 3 footnote: "(1) het kind met een handicap ten laste wordt voor twee gerekend."

### 3.4 Reductions for other family burdens (R-NL nrs. 39–41)
Nr. 39 (both situations):

| GROND VAN DE VERMINDERING | JAARBEDRAG VAN DE VERMINDERING (1) |
|---|---|
| 1. de verkrijger van de inkomsten is zelf gehandicapt: | 624 EUR |
| 2. de verkrijger van de inkomsten heeft in artikel 136, 2° en 3°, WIB 92 bedoelde personen ten laste die de leeftijd van 66 jaar hebben bereikt en zorgbehoevend zijn, per persoon: | 1.992 EUR |
| 3. de verkrijger van de inkomsten heeft in artikel 136, 2° tot 4°, WIB 92 bedoelde personen, andere dan diegenen vermeld onder punt 2 hiervoor, ten laste, per persoon: | 624 EUR |

"(1) alle verminderingen mogen worden samengevoegd."

Nr. 40 (single, or spouse with own professional income):

| GROND VAN DE VERMINDERING | JAARBEDRAG VAN DE VERMINDERING (1) |
|---|---|
| 1. de verkrijger van de inkomsten is een niet hertrouwde weduwnaar (weduwe), een ongehuwde vader (moeder), of een echtgescheiden, feitelijk gescheiden of van tafel en bed gescheiden ouder, met één of meer kinderen ten laste: | 624 EUR |
| 2. de echtgenoot van de verkrijger van de inkomsten heeft persoonlijke beroepsinkomsten, andere dan pensioenen, renten of ermede gelijkgestelde inkomsten, die niet meer bedragen dan 290 EUR NETTO per maand: | 1.740 EUR |
| 3. de echtgenoot van de verkrijger van de inkomsten heeft persoonlijke beroepsinkomsten die uitsluitend bestaan uit pensioenen, renten of ermede gelijkgestelde inkomsten en die niet meer bedragen dan 579 EUR NETTO per maand: | 3.474 EUR |

Nr. 41 (spouse without own professional income, after nr. 39):

| GROND VAN DE VERMINDERING | JAARBEDRAG VAN DE VERMINDERING |
|---|---|
| de echtgenoot van de verkrijger van de inkomsten is gehandicapt: | 624 EUR |

### 3.5 Fiscal work bonus, period `2026_01` (R-NL nr. 46.2)
> "46.2.1. 33,14 pct. van het bedrag van het luik A van de werkbonus dat daadwerkelijk is verleend met toepassing van artikel 2, § 1/1, van de wet van 20 december 1999 tot toekenning van een werkbonus aan werknemers met lage lonen en van andere verminderingen van de persoonlijke bijdragen van sociale zekerheid;
> 46.2.2. 52,54 pct. van het bedrag van het luik B van de werkbonus dat daadwerkelijk is verleend met toepassing van artikel 2, § 1/2, van de voormelde wet van 20 december 1999."

SF1-FR nr. 20: "33,14 p.c. du montant du volet A du bonus à l'emploi réellement accordé […]; 52,54 p.c. du montant du volet B du bonus à l'emploi réellement accordé en application de l'article 2, § 1/2, de la loi du 20 décembre 1999 précitée."

### 3.6 Fiscal work bonus, period `2026_08` (B3C-NL nr. 46.2.2, in force 01.08.2026)
> "46.2.2. 63 pct. van het bedrag van het luik B van de werkbonus dat daadwerkelijk is verleend met toepassing van artikel 2, § 1/2, van de voormelde wet van 20 december 1999."

B3C-FR: "46.2.2. 63 p.c. du montant du volet B du bonus à l'emploi réellement accordé en application de l'article 2, § 1/2, de la loi du 20 décembre 1999 précitée."

Luik A stays at 33,14 pct.

## 4. Period `2026_11` (paid 1 November – 31 December 2026)

Sources: B3C-NL / B3C-FR (KB 27.09.2026), SF11-NL / SF11-FR. Unchanged from §2 and §3: rounding, steps A–B, forfait, base scale, nr. 33 (174 EUR), 290 and 579 EUR thresholds, nr. 39.2 (1.992 EUR), work bonus (33,14 / 63 pct.).

SF11-NL nr. 2:
> "Deze sleutelformule verschilt ten opzichte van de vorige sleutelformule (ESS/2025-0928, versie van januari 2026) als gevolg van de wijzigingen die zijn aangebracht door de wet van 15 juli 2026 tot hervorming van de personenbelasting."

SF11-FR nr. 2:
> "Cette formule-clé diffère de la formule-clé précédente (ESS/2025-0928, version de janvier 2026) suite aux modifications apportées par la loi du 15 juillet 2026 portant réforme de l'impôt des personnes physiques."

### 4.1 Single, or spouse with own professional income (B3C-NL nr. 32)
> "Behoudens de in nr. 33 vermelde afwijking wordt de belasting bekomen volgens hoofdstuk 1, verminderd met 3.089,63 euro (zijnde de belasting op het basisbedrag van de belastingvrije som ten bedrage van 11.550 euro). Het bekomen verschil vormt de basisbelasting."

B3C-FR nr. 32:
> "A l'exception de la dérogation visée au n° 33, l'impôt obtenu suite à l'application du chapitre 1er est diminué de 3.089,63 euros (c.-à-d. l'impôt sur la quotité du revenu exemptée d'impôt, qui s'élève à 11.550 euros). La différence est égale à l'impôt de base."

### 4.2 Spouse without own professional income (B3C-NL nrs. 34.1.1 and 34.2)
> "34.1.1. Aan de echtgenoot van de verkrijger van de inkomsten wordt een beroepsinkomen toegekend dat gelijk is aan 30 pct. van het nettobedrag van de belastbare grondslag. Het toegekende inkomen mag echter niet meer bedragen dan: a) wanneer beide echtgenoten de leeftijd van 66 jaar hebben bereikt op 1 januari 2027: 12.790 euro (maximum bereikt bij een nettobedrag van de belastbare grondslag van 42.633,33 euro); b) in alle andere gevallen, ook wanneer de schuldenaar van de bedrijfsvoorheffing niet over de nodige informatie beschikt om punt a) toe te passen: 11.780 euro (maximum bereikt bij een nettobedrag van de belastbare grondslag van 39.266,67 euro)."

> "34.2. Basisbelasting — De basisbelasting is gelijk aan de som van de overeenkomstig nrs. 34.1.2 en 34.1.3 bekomen resultaten verminderd met 6.179,26 euro (zijnde tweemaal de belasting op het basisbedrag van de belastingvrije som ten bedrage van 11.550 euro)."

### 4.3 Reduction for dependent children (B3C-NL nr. 38; SF11-NL Bijlage 3bis)

| AANTAL KINDEREN TEN LASTE | VERMINDERING VAN DE BASISBELASTING |
|---|---|
| 1 | 684 EUR |
| 2 | 1.644 EUR |
| 3 | 4.344 EUR |
| 4 | 7.488 EUR |
| 5 | 10.884 EUR |
| 6 | 14.292 EUR |
| 7 | 17.712 EUR |
| 8 | 21.492 EUR |

> "meer dan 8 : de basisbelasting wordt verminderd met een vast bedrag van 21.492 EUR, verhoogd met 3.780 EUR per kind ten laste boven het achtste, d.w.z.: a) voor 9 kinderen: 21.492 + (1 x 3.780) = 25.272 EUR b) voor 10 kinderen: 21.492 + (2 x 3.780) = 29.052 EUR enz."

SF11-FR Annexe 3bis gives the same amounts ("1 — 684 EUR; 2 — 1.644 EUR; …").

Note: the amount for **2** children (1.644 EUR) and for 3 and more children is **lower** than in January (1.656 EUR). This is what the text says, not a transcription error: the reform raises the tax-free sum itself (11.170 → 11.550), which already lowers the withholding for everyone.

### 4.4 Reductions for other family burdens (B3C-NL nrs. 39–41)
Nr. 39:

| GROND VAN DE VERMINDERING | JAARBEDRAG VAN DE VERMINDERING (1) |
|---|---|
| 1. de verkrijger van de inkomsten is zelf gehandicapt : | 648 EUR |
| 2. de verkrijger van de inkomsten heeft in artikel 136, 2° en 3°, WIB 92 bedoelde personen ten laste die de leeftijd van 66 jaar hebben bereikt en zorgbehoevend zijn, per persoon: | 1.992 EUR |
| 3. de verkrijger van de inkomsten heeft in artikel 136, 2° tot 4°, WIB 92 bedoelde personen, andere dan diegenen vermeld onder punt 2 hiervoor, ten laste, per persoon: | 636 EUR |

Nr. 40:

| GROND VAN DE VERMINDERING | JAARBEDRAG VAN DE VERMINDERING (1) |
|---|---|
| 1. […] ouder, met één of meer kinderen ten laste: | 636 EUR |
| 2. de echtgenoot […] die niet meer bedragen dan 290 EUR NETTO per maand: | 1.740 EUR |
| 3. de echtgenoot […] die niet meer bedragen dan 579 EUR NETTO per maand: | 3.474 EUR |

Nr. 41:

| GROND VAN DE VERMINDERING | JAARBEDRAG VAN DE VERMINDERING |
|---|---|
| de echtgenoot van de verkrijger van de inkomsten is gehandicapt: | 636 EUR |

SF11-NL Bijlagen 4bis and 5bis give the same amounts: 636 / 648 / 1.992 / 636 / 1.740 / 3.474, and 648 / 636 / 1.992 / 636. SF11 also reprints the January Bijlagen 3, 4 and 5 for reference. Its nrs. 14 and 15 point to "bijlage 3bis" and "bijlagen 4bis en 5bis" only.

### 4.5 Definition of "alleenstaanden" (B3C-NL nr. 4.2, 5th–7th dash)
From 1 November 2026, the limit for exempt income of a spouse is "de belastingvrije som, d.w.z. 11.550 euro per jaar" (previously 13.790 euro), and a 7th dash is added for study grants. This matters only for spouses with treaty-exempt income or a study grant. It is not modelled.

## 5. Consistency checks (computed, not quoted)
- 16.710 × 0,2675 = 4.469,925 → 4.469,93 ✓; 4.469,93 + 12.790 × 0,428 = 9.944,05 ✓; 9.944,05 + 21.550 × 0,4815 = 20.320,38 ✓ (each rounded half-up to the cent).
- 11.170 × 0,2675 = 2.987,975 → 2.987,98 ✓; × 2 = 5.975,96 ✓.
- 11.550 × 0,2675 = 3.089,625 → 3.089,63 ✓; × 2 = 6.179,26 ✓.
- 6.070 / 0,30 = 20.233,33 ✓; 13.790 / 0,30 = 45.966,67 ✓; 12.790 / 0,30 = 42.633,33 ✓; 11.780 / 0,30 = 39.266,67 ✓.

These checks are asserted in `test/withholding-2026.test.mjs` and `tests/testthat/test-withholding-2026.R`.

## 6. Exceptional pay (holiday pay, 13th month): reference only, OUT OF SCOPE
R-NL nr. 53 (rate on "andere exceptionele vergoedingen en toelagen dan opzeggingsvergoedingen […] (toevallige commissielonen op een geheel van verrichtingen, bijzondere en exceptionele vergoedingen, vakantiegeld, enz.)", based on the annual amount of normal gross pay). The table is unchanged in B3C-NL:

| JAARBEDRAG VAN DE NORMALE BRUTO BEZOLDIGINGEN | VAKANTIEGELD | ANDERE VERGOEDINGEN EN TOELAGEN |
|---|---|---|
| tot 10.675 EUR | 0 | 0 |
| van 10.675,01 EUR tot 13.660 EUR | 19,17 | 23,22 |
| van 13.660,01 EUR tot 17.375 EUR | 21,20 | 25,23 |
| van 17.375,01 EUR tot 20.840 EUR | 26,25 | 30,28 |
| van 20.840,01 EUR tot 23.580 EUR | 31,30 | 35,33 |
| van 23.580,01 EUR tot 26.340 EUR | 34,33 | 38,36 |
| van 26.340,01 EUR tot 31.830 EUR | 36,34 | 40,38 |
| van 31.830,01 EUR tot 34.640 EUR | 39,37 | 43,41 |
| van 34.640,01 EUR tot 45.860 EUR | 42,39 | 46,44 |
| van 45.860,01 EUR tot 59.900 EUR | 47,44 | 51,48 |
| boven 59.900 EUR | 53,50 | |

Nr. 54 (exemption for dependent children, "GRENSBEDRAG"). Jan–Oct (R-NL): 1: 18.858; 2: 22.470; 3: 28.960; 4: 36.200; 5: 43.440; 6: 50.680; 7: 57.920; 8: 65.160; 9: 72.400; 10: 79.640; 11: 86.880; 12: 94.120 EUR. From 1.11.2026 (B3C-NL): 1: 19.543; 2: 22.750; 3: 29.060; 4: 36.130; 5: 43.200; 6: 50.270; 7: 57.340; 8: 64.410; 9: 71.480; 10: 78.550; 11: 85.620; 12: 92.690 EUR.

Nrs. 55–57 (reduction for children, derogations), holiday pay paid by holiday funds (nr. 75 and following) and the rest of Hoofdstuk 6 are **not transcribed** and **not** in `params/`. The monthly calculator must not apply them. A 13th-month or holiday-pay result stays blocked.

## 7. PENDING / not covered
- **Simulators** `SimulatorBV2026verrouilléNL.xlsx` and `SimulatorBV2026novemberverrouille.xlsx` (Fisconet addenda): not downloaded or used. They may serve later as an official cross-check of the engine (they are FOD Financiën files), but they were not inspected here.
- **Original Staatsblad texts** of KB 11.12.2025 (Numac 2025009487), KB 24.07.2026 (Numac 2026005690) and KB 27.09.2026 (Numac 2026007167): only through ejustice (CAPTCHA). The Fisconet coordinated text quotes their numac and dates. The owner may download them from ejustice to file them, but they are not needed to confirm the values.
- **Group insurance, overtime, low public-sector income, bedrijfsleiders, non-residents, pay other than monthly:** transcribed only in part or not at all. They are out of scope.
- The **social** work bonus that feeds the fiscal reduction is still pending for October–December 2026 (`social_security.yaml`, period `2026_10`). A withholding for Oct–Dec stays blocked for anyone entitled to a work bonus until that is published.
