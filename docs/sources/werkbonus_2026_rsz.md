# Werkbonus / bonus à l'emploi (sociaal luik): RSZ/ONSS rules for income year 2026

- **Source:** RSZ/ONSS, Administratieve instructies DmfA / Instructions administratives DmfA (www.socialsecurity.be only).
- **Retrieved:** 2026-11-24, with plain `curl` (HTTP 200, no CAPTCHA anywhere).
- **Scope:** the employee-contribution reduction (sociale werkbonus). The fiscal werkbonus (bedrijfsvoorheffing / personenbelasting) is **not** covered here.
- **Transcription:** quotes are verbatim, copied from the HTML text with only whitespace normalised. Table cells are reproduced exactly as written, including the original operators "≤", ">" and "en".

## 0. Pages consulted

| ID | Version | Language | URL | Result |
|---|---|---|---|---|
| NL-25/4 | 2025/4 | NL | https://www.socialsecurity.be/employer/instructions/dmfa/nl/2025-4/instructions/deductions/workers_reductions/workbonus.html | 200 |
| NL-26/1 | 2026/1 | NL | https://www.socialsecurity.be/employer/instructions/dmfa/nl/2026-1/instructions/deductions/workers_reductions/workbonus.html | 200 |
| NL-26/2 | 2026/2 | NL | https://www.socialsecurity.be/employer/instructions/dmfa/nl/2026-2/instructions/deductions/workers_reductions/workbonus.html | 200 |
| NL-26/3 | 2026/3 (= `latest`) | NL | https://www.socialsecurity.be/employer/instructions/dmfa/nl/latest/instructions/deductions/workers_reductions/workbonus.html | 200, page title "Administratieve instructies RSZ - 2026/3" |
| FR-26/1 | 2026/1 | FR | https://www.socialsecurity.be/employer/instructions/dmfa/fr/2026-1/instructions/deductions/workers_reductions/workbonus.html | 200 |
| FR-26/2 | 2026/2 | FR | https://www.socialsecurity.be/employer/instructions/dmfa/fr/2026-2/instructions/deductions/workers_reductions/workbonus.html | 200 |
| FR-26/3 | 2026/3 (= `latest`) | FR | https://www.socialsecurity.be/employer/instructions/dmfa/fr/latest/instructions/deductions/workers_reductions/workbonus.html | 200, title "Instructions administratives ONSS - 2026/3" |
| INT-25/4 | Tussentijdse instructies 2025/4 | NL | https://www.socialsecurity.be/employer/instructions/dmfa/nl/2025-4/intermediates#werkbonus-grensbedragen-na-indexaanpassing | 200 (item dated 08/01/2026) |
| INT-26/1 | Tussentijdse instructies 2026/1 | NL | https://www.socialsecurity.be/employer/instructions/dmfa/nl/2026-1/intermediates#werkbonus-grensbedragen-na-verhoging-ggmmi | 200 (item dated 01/04/2026) |
| INT-26/1-FR | Instructions intermédiaires 2026/1 | FR | https://www.socialsecurity.be/employer/instructions/dmfa/fr/2026-1/intermediates#bonus-a-lemploi-plafonds-apres-augmentation-du-rmmmg | 200 |
| INT-26/2 | Tussentijdse instructies 2026/2 | NL | https://www.socialsecurity.be/employer/instructions/dmfa/nl/2026-2/intermediates#werkbonus-grensbedragen-na-indexaanpassing | 200 (item dated 03/07/2026) |
| INT-26/2-FR | Instructions intermédiaires 2026/2 | FR | https://www.socialsecurity.be/employer/instructions/dmfa/fr/2026-2/intermediates#bonus-a-lemploi-plafonds-apres-indexation | 200 |
| INT-26/3 | Tussentijdse instructies 2026/3 | NL | https://www.socialsecurity.be/employer/instructions/dmfa/nl/latest/intermediates | 200. Lists 7 items (latest dated 20/10/2026), **none on the werkbonus**. |
| — | 2026/4 | NL/FR | `.../dmfa/nl/2026-4/...workbonus.html`, `.../dmfa/fr/2026-4/...` | **404, not published.** The quarter selector also only offers values up to 2026-3 (`latest`). |

Note that the explicit URL `.../nl/2026-3/...` also returns 404. The 2026/3 version is reachable only via `latest`.

**Cross-check.** All amounts in the main pages match the tussentijdse instructies they replace, checked number by number:
- INT-25/4 matches the January–February and March 2026 tables in NL-26/1.
- INT-26/1 matches the April 2026 table in NL-26/2.
- INT-26/2 matches the July–August and September 2026 tables in NL-26/3.

All amounts in the FR pages match the NL pages.

---

## 1. Timeline of parameter sets in 2026 (summary)

| Period of application | Set out in | Luik A: S-threshold (≤) / max R / upper bound S / slope (bedienden; arbeiders) | Luik B: S-threshold (≤) / max R / upper bound S / slope (bedienden; arbeiders) | Annual cap per worker |
|---|---|---|---|---|
| January and February 2026 | NL-26/1, INT-25/4 | 2.833,36 / bed. 123,00, arb. 132,84 / 3.271,48 / bed. 0,2807, arb. 0,3032 | 2.218,73 / bed. 165,87, arb. 179,14 / 2.833,36 / bed. 0,2699, arb. 0,2915 | 3.466,44 EUR ("Vanaf 1 januari 2026") |
| From 1 March 2026 | NL-26/1, INT-25/4 | 2.833,36 / 123,00, 132,84 / **3.336,98** / bed. **0,2442**, arb. **0,2638** | unchanged from January | 3.466,44 EUR |
| From 1 April 2026 | NL-26/2, INT-26/1 | **2.880,32** / bed. **125,04**, arb. **135,04** / 3.336,98 / bed. **0,2738**, arb. **0,2957** | **2.255,50** / bed. **168,62**, arb. **182,11** / 2.880,32 / 0,2699, 0,2915 | 3.523,92 EUR ("Vanaf 1 april 2026") |
| July and August 2026 | NL-26/3, INT-26/2 | **2.937,93** / bed. **127,54**, arb. **137,74** / 3.336,98 / bed. **0,3196**, arb. **0,3452** | **2.300,62** / bed. **171,99**, arb. **185,75** / 2.937,93 / 0,2699, 0,2915 | 3.594,36 EUR ("Vanaf 1 juli 2026") |
| From 1 September 2026 | NL-26/3, INT-26/2 | 2.937,93 / 127,54, 137,74 / **3.403,62** / bed. **0,2739**, arb. **0,2958** | unchanged from July | 3.594,36 EUR. No other figure is given for September; the text says only "Vanaf 1 juli 2026". |
| October–December 2026 | **PENDING** | The 2026/4 instructions are not published (404). The latest published text (2026/3) gives the September 2026 table with no end date. No interim instruction about the werkbonus exists in 2026/3 up to 2026-11-24. | | |

The comparison operators and formula shapes are given verbatim in section 3.

---

## 2. General rules (common to all 2026 versions unless stated)

### 2.1 Concerned workers
NL-26/3 (identical in NL-26/1 and NL-26/2):
> "Het gaat om de werknemers van de privésector en van de openbare sector die een werknemersbijdrage van 13,07 % verschuldigd zijn. De werknemersbijdragevermindering is onafhankelijk van eventuele werkgeversbijdrageverminderingen."

> "Voor de privésector komen dus onder andere niet in aanmerking:
> - de geneesheren in opleiding tot specialist;
> - de leerlingen, stagiairs en de andere jongeren tijdens de periode van gedeeltelijke onderwerping aan de sociale zekerheid (periode die eindigt op 31 december van het kalenderjaar waarin ze 18 jaar worden)."

> "Voor de openbare sector komen de meeste statutaire personeelsleden evenmin voor de vermindering in aanmerking. Contractuele werknemers daarentegen komen wél in aanmerking (dus ook gesubsidieerde contractuelen, artikel 60, § 7 van de organieke OCMW- wet, ...)."

### 2.2 Practical application, periodicity, two components
NL-26/3:
> "De vermindering bestaat uit een forfaitair bedrag dat geleidelijk vermindert naarmate het loon hoger wordt. De werkgever brengt het bedrag in mindering van de normale werknemersbijdragen (13,07% van het brutoloon) bij de betaling van het loon. De werkbonus compenseert de volledige werknemersbijdrage voor een referteloon tot ongeveer 2.300,00 EUR bruto per maand."

NL-26/1 and NL-26/2 say "tot ongeveer 2.000,00 EUR bruto per maand". This is an approximate, descriptive figure only and not a parameter.

> "Indien het loon wordt betaald volgens een andere periodiciteit dan de maandelijkse (per week, per twee weken, per vier weken,...) berekent de werkgever de vermindering bij de laatste betaling die op de kalendermaand betrekking heeft. In dat geval is de berekening gebaseerd op de dagen en de lonen die op die kalendermaand betrekking hebben en moet het uitbetaalde bedrag en de ermee samenhangende periode opgesplitst worden per kalendermaand."

> "Voor werknemers die binnen de maand met opeenvolgende overeenkomsten werken, wordt het verminderingsbedrag verrekend aan het einde van iedere overeenkomst of bij iedere betaling die betrekking heeft op die overeenkomsten."

> "Vanaf 1 april 2024 wordt de berekening van de werkbonus opgesplitst in 2 componenten om een aangepaste berekening van de fiscale werkbonus mogelijk te maken."

> "Men berekent de vermindering voor iedere werknemer apart. Deze berekening omvat drie stappen.
> - Eerst bepaalt men het refertemaandloon van de werknemer.
> - Op basis van dat refertemaandloon bepaalt men het basisbedrag van de vermindering.
> - Ten slotte stelt men het verminderingsbedrag vast door het basisbedrag te corrigeren bij onvolledige prestaties en bij deeltijdse werknemers."

FR-26/3:
> "Le bonus à l'emploi compense la totalité des cotisations personnelles pour une rémunération de référence jusqu'à environ 2.300,00 EUR bruts par mois."

> "A partir du 1er avril 2024, le calcul du bonus à l'emploi a été scindé en deux composantes pour rendre possible un calcul adapté du bonus à l'emploi fiscal."

### 2.3 Step 1: reference monthly wage (S)
NL-26/3 (identical in NL-26/1 and NL-26/2):
> "Het refertemaandloon (S) kunt u rechtstreeks afleiden uit het brutoloon (W) van de werknemer dat op de kalendermaand betrekking heeft. Hierbij houdt u geen rekening met:
> - vergoedingen wegens onrechtmatige beëindiging van de arbeidsovereenkomsten (looncode 3 DmfA ) en de erdoor gedekte dagen;
> - flexi-loon (looncode 22 en 23 DmfA) en overuren horeca (looncode 13 DmfA) en de erdoor gedekte dagen/uren;
> - vergoedingen voor uren die geen arbeidstijd zijn in de zin van de arbeidswetgeving (looncode 6 DmfA);
> - de eindejaarspremies (13de maand, attractiviteitspremie ziekenhuizen, ...) tot beloop van het bedrag van het refertemaandloon (S) dat in aanmerking wordt genomen om de vermindering te berekenen voor de maand waarin die eindejaarspremie normaal wordt uitbetaald
> - het enkel vertrekvakantiegeld (in de vakantieregeling privésector) uitbetaald door de werkgever aan zijn (ex-)werknemer
> - het positief saldo aangegeven bij de eindafrekening na verrekening van het vertrekvakantiegeld (looncode 14)
> - het enkel vakantiegeld voor de niet opgenomen vakantiedagen wegens o.a. ziekte (looncode 15)
> - het enkel vakantiegeld voor de niet opgenomen vakantiedagen wegens o.a. ziekte, maar al vervroegd uitbetaald door de vorige werkgever (looncode 16)."

> "Bij het bepalen van het refertemaandloon (S) van een werknemer aan wie een gedeelte van het vakantiegeld dat (in de vakantieregeling privésector) overeenstemt met het normale loon voor de vakantiedagen vervroegd werd uitbetaald, wordt rekening gehouden met het gedeelte van het vertrekvakantiegeld dat de werkgever in mindering brengt van het uit te betalen loon. Bekijk de voorbeelden."

**100 % wage base for both arbeiders and bedienden:**
> "Zowel voor arbeiders als voor bedienden berekent men het refertemaandloon op basis van de aangegeven brutolonen aan 100%."

FR-26/3:
> "Tant pour les ouvriers que pour les employés, le salaire mensuel de référence est calculé sur le salaire brut déclaré à 100 %."

**Change against the 2025/4 version.** NL-25/4 contained a sentence that is absent from NL-26/1 onward:
> "Het enkel vakantiegeld voor de vakantiedagen die de werknemer niet heeft kunnen opnemen wegens bijvoorbeeld een langdurige arbeidsongeschiktheid (looncode 15) wordt wel mee in rekening gebracht voor het bepalen van W. Deze code kan enkel toegepast worden tijdens het 4de kwartaal."

**Definitions and formulas (a)** from NL-26/1 and NL-26/2:
> "Voltijdse werknemers
> met volledige prestaties:
> S = W
> Onder een voltijdse werknemer met volledige prestaties wordt verstaan de werknemer voor wie J = D, waarbij:
> - J = het aantal dagen van de werknemer aangegeven met de prestatiecodes 1,3,4, 5 en 20.
> - D = het maximum aantal dagen prestaties voor de betrokken maand in het betrokken arbeidsstelsel.
>
> met onvolledige prestaties:
> S = (W/J) x D
> Onder een voltijdse werknemer met onvolledige prestaties wordt verstaan de werknemer voor wie J < D
> De breuk W/J wordt afgerond naar de dichtstbijzijnde eurocent (0,005 EUR wordt 0,01 EUR)
>
> Deeltijdse werknemers en gelijkgestelden
> S = (W/H) x U
> Waarbij:
> - H = het aantal aangegeven uren met de prestatiecodes 1, 3, 4, 5 en 20;
> - U = het aantal uren op maandbasis dat overeenstemt met D."

**Change in 2026/3 (NL-26/3 and FR-26/3).** Prestatiecode 38 is added:
> "- J = het aantal dagen van de werknemer aangegeven met de prestatiecodes 1,3,4, 5, 20 en 38."

> "- H = het aantal aangegeven uren met de prestatiecodes 1, 3, 4, 5, 20 en 38;"

FR-26/3:
> "J = le nombre de jours du travailleur déclarés avec un code prestations 1, 3, 4, 5, 20 et 38;"

> "H = le nombre d'heures de travail déclarées avec un code prestations 1, 3, 4, 5, 20 et 38;"

PENDING:
- The meaning of prestatiecode 38 is not explained on the werkbonus page.
- The exact effective date of its inclusion is not stated. It appears in the 2026/3 version.

Scope of the part-time formula (NL-26/3):
> "Deze berekening geldt zowel voor:
> - werknemers die uitsluitend deeltijdse prestaties leveren;
> - werknemers die in de loop van de maand bij de werkgever voltijds en deeltijds werken;
> - voltijdse werknemers die met uren moeten worden aangegeven. Het betreft werknemers:
>   - van de provinciale en plaatselijke overheidsdiensten,
>   - in de horeca,
>   - met gedeeltelijke werkhervatting na ziekte of (arbeids)ongeval,
>   - met al dan niet gedeeltelijke (gereglementeerde) onderbreking van de loopbaan,
>   - met halftijds brugpensioen,
>   - werknemers bij tussenpozen (uitzendkrachten, tijdelijke arbeid, thuisarbeid),
>   - met gelimiteerde prestaties (met een contract van korte duur en voor een tewerkstelling die per dag niet de gewoonlijke dagduur bereikt),
>   - seizoenarbeiders en
>   - werknemers bezoldigd met dienstencheques.
>
> De breuk W/H wordt afgerond naar de dichtstbijzijnde eurocent (0,005 EUR wordt 0,01 EUR)
>
> De prestaties van de flexi-jobs en de overuren horeca blijven volledig buiten de berekening, net zoals de opgenomen 'overgedragen vakantiedagen' (prestatiecode 16 en 17)."

**Remarks (b)** (NL-26/3):
> "- Voor werknemers tewerkgesteld bij een beperkte groep van werkgevers die vóór 1 oktober 2001 de arbeidsduur verminderden of de vierdagenweek invoerden en van wie de werknemers een tussenkomst krijgen om het loonverlies gedeeltelijk te compenseren (looncode 5), wordt S forfaitair verminderd met 80,57 EUR per maand. Het handelt hier om werknemers die in aanmerking komen voor een doelgroepvermindering op basis van artikel 367, 369 of 370 van de Programmawet van 24 december 2002.
> - Voor voltijdse werknemers die in de loop van de maand in verschillende arbeidsregelingen werken moet u, uitsluitend voor de toepassing van deze vermindering, alle prestaties omrekenen naar één van de regimes."

The task brief mentions "µ / fraction rules". The DmfA werkbonus page uses no µ factor. The only fractions are W/J, W/H, J/D and H/U, quoted above and in 2.5. A full-time equivalent is obtained through S = (W/H) x U for part-time workers.

### 2.4 Step 2: basic amount (R), general text
NL-26/3:
> "Het basisbedrag van de vermindering (R) wordt vastgesteld in functie van de hoogte van het refertemaandloon (S)."

> "Het koninklijk besluit van 27 maart 2023 versterkt de werkbonus voor de zeer lage lonen vanaf 1 juli 2023. Ingevolge deze versterking van de werkbonus, wordt een extra loongrens ingevoerd en de maximale vermindering voor de laagste lonen verhoogd."

**Arbeiders/bedienden distinction (footnotes under every table, all 2026 versions):**
> "(*) Onder 'Bedienden' moet worden verstaan: de werknemers die moeten worden aangegeven aan 100 %, dus ook bijvoorbeeld arbeiders in de openbare sector."

> "(**) Onder 'Arbeiders' moet worden verstaan: de werknemers die moeten worden aangegeven aan 108 %, dus ook bijvoorbeeld kunstenaars."

FR-26/3:
> "(*) Par 'employés', on entend les travailleurs qui doivent être déclarés à 100 %, donc aussi, par exemple, les ouvriers occupés par les services publics."

> "(**) Par 'ouvriers', on entend les travailleurs qui doivent être déclarés à 108 %, donc aussi, par exemple, les artistes."

The 108 % wage base therefore does not enter S: S is computed at 100 % for both groups. The distinction shows up only in the separate R tables (higher amounts and slopes for arbeiders) and in the personal contribution, which for arbeiders is 13,07 % of the wage + 8 % (see Example 2 in 2.7).

**Rounding of R:**
> "R wordt rekenkundig afgerond op de dichtstbijzijnde eenheid (Eurocent)."

FR:
> "R est arrondi arithmétiquement à l'unité la plus proche (eurocent)."

### 2.5 Step 3: reduction amount (P), rounding, cap
NL-26/3 (identical in NL-26/1 and NL-26/2):
> "Voltijdse werknemers
> met volledige prestaties:
> P = R
> met onvolledige prestaties:
> P= (J/D) x R
> De breuk J/D wordt afgerond op twee decimalen (0,005 wordt 0,01) en het resultaat van die breuk mag nooit groter zijn dan 1.
>
> Deeltijdse werknemers en gelijkgestelden
> P= (H/U) x R
> De breuk H/U wordt afgerond op twee decimalen (0,005 wordt 0,01) en het resultaat van die breuk mag nooit groter zijn dan 1."

> "De vermindering kan toegepast worden op
> - de gewone lonen
> - uitbetaalde premies
> - de vergoedingen voor uren die geen arbeidstijd zijn (looncode 6)
> - de eindafrekening van het enkel vakantiegeld (looncode 14).
>
> De vermindering kan niet toegepast worden op
> - het enkel vertrekvakantiegeld bedienden (looncode 7)
> - het enkel vakantiegeld voor de niet opgenomen vakantiedagen o.a. wegens ziekte (looncode 15)
> - de verbrekingsvergoedingen (looncode 3) ."

**Cap at the personal contributions due, and the order of capping:**
> "De werkbonus (P) mag de verschuldigde persoonlijke socialezekerheidsbijdragen niet overschrijden. De sociale werkbonus = de vermindering berekend op basis van Luik A (PA) + de vermindering berekend op basis van Luik B (PB). De eventuele aftopping bij een tekort aan werknemersbijdragen gebeurt op de berekening op basis van Luik B en vervolgens op de berekening op basis van Luik A."

The same rule appears under the tables in NL-26/3 and INT-25/4/INT-26/2:
> "De sociale werkbonus = de vermindering berekend in Luik A + de vermindering berekend in Luik B."

> "De eventuele aftopping bij een tekort aan werknemersbijdragen gebeurt op Luik B en vervolgens op Luik A."

FR-26/3:
> "Le bonus à l'emploi (P) ne peut pas dépasser les cotisations personnelles de sécurité sociale dues. Le bonus à l'emploi social = la réduction calculée sur la base du volet A (PA)+ la réduction calculée sur la base du volet B (PB). L'éventuel écrêtement en raison d'une insuffisance de cotisations personnelles s'effectue sur le calcul basé sur le volet B et ensuite sur le calcul basé sur le volet A."

**Carry-forward with departure holiday pay:**
> "Wanneer een werknemer vakantie neemt die gedekt wordt door enkel vertrekvakantiegeld, is het mogelijk dat de werknemersbijdrage niet volstaat om de werkbonus volledig in rekening te brengen. De werkgever mag dan het resterende deel van de werkbonus aftrekken van de werknemersbijdrage van de volgende maand. Vanaf het 2de kwartaal 2024 is dit niet meer beperkt tot hetzelfde kwartaal."

### 2.6 Annual cap per worker (per calendar year)
- NL-26/1:
  > "Vanaf 1 januari 2026 mag het totaal van de vermindering per werknemer niet meer bedragen dan 3.466,44 EUR per kalenderjaar."

  FR-26/1:
  > "Le montant total de la réduction par travailleur ne peut être supérieur à 3.466,44 EUR par année calendrier à partir du 1er janvier 2026."
- NL-26/2:
  > "Vanaf 1 april 2026 mag het totaal van de vermindering per werknemer niet meer bedragen dan 3.523,92 EUR per kalenderjaar."

  FR-26/2:
  > "...3.523,92 EUR par année calendrier à partir du 1er avril 2026."
- NL-26/3:
  > "Vanaf 1 juli 2026 mag het totaal van de vermindering per werknemer niet meer bedragen dan 3.594,36 EUR per kalenderjaar."

  FR-26/3:
  > "Le montant total de la réduction par travailleur ne peut être supérieur à 3.594,36 EUR par année calendrier à partir du 1er juillet 2026."

PENDING:
- No separate annual cap is stated for the 1 September 2026 change.
- The pages do not say how a cap that changes during the year is applied within one calendar year, for example whether the cap in force at year end applies to the whole year. Not verified; do not infer.

### 2.7 Examples (illustrative only, OUTDATED figures)
> "De onderstaande voorbeelden zijn gebaseerd op de cijfers die gelden vanaf 1 juni 2001."

These examples use 2001 parameters (262,16; 0,2579; 2.013,64; 283,13) and must not be used as 2026 parameters. They are useful only as method tests: rounding of W/J and J/D, and the cap at the contribution.

Example 2 (arbeider), verbatim:
> "Voor een bepaalde maand heeft een arbeider een brutoloon van 1336,00 EUR (aan 100%). Tijdens die maand, die normaal 22 prestatiedagen telt, heeft hij 15 dagen normale werkelijke arbeid (code 1) en 7 wettelijke vakantiedagen (code 2).
> Zijn refertemaandloon (S) is 1.959,54 EUR, nl. 89,07 (=1336,00/15) vermenigvuldigd met 22.
> Het basisbedrag van de vermindering (R) is 283,13 EUR (zijn referteloon is kleiner dan 2.013,64 EUR).
> Het verminderingsbedrag (P) is 192,53 EUR, nl. 0,68 (=15/22 afgerond op twee decimalen) x 283,13. Dit betekent dat de werkgever bij de loonbetaling niet 188,58 EUR, nl. 13,07% van 1442,88 (= 1336,00 + 8%) werknemersbijdrage inhoudt, maar 0 EUR (188,58 – 192,53 resulteert in een negatief bedrag, maar aangezien de werkbonus de verschuldigde persoonlijke socialezekerheidsbijdragen niet mag overschrijden is de uitkomst 0)."

Example 1 (bediende), verbatim:
> "Voor een bepaalde maand heeft een bediende een brutoloon van 2.015,00 EUR. Die maand telt normaal 22 prestatiedagen. Hij wordt aangegeven met 19 dagen gewaarborgd maandloon (code 1), en drie niet door de werkgever betaalde ziektedagen (code 50).
> Zijn refertemaandloon (S) is 2.333,10 EUR, nl. 106,05 EUR (=2.015,00/19 afgerond op twee decimalen) vermenigvuldigd met 22.
> Het basisbedrag van de vermindering (R) is 179,77 EUR, nl. 262,16 - (0,2579 x (2.333,10 – 2.013,64)).
> Het verminderingsbedrag (P) is 154,60 EUR, nl. 0,86 (=19/22 afgerond op twee decimalen) x 179,77. Dit betekent dat de werkgever bij de loonbetaling niet 263,36 EUR (=13,07% van 2.015) werknemersbijdrage inhoudt, maar 108,76 EUR (= 263,36 – 154,60)."

Observation, not part of the source: these old examples show only one component. They predate the A/B split.

### 2.8 DmfA declaration
> "De vermindering van de werknemersbijdragen Werkbonus wordt aangegeven in blok 90110 "vermindering werknemerslijn" met volgende gegevens: Deze wordt maandelijks berekend en wordt over het hele kwartaal aangegeven."

The verminderingscode is 0001, with duration "Volledige duur van de tewerkstelling".

---

## 3. Parameter tables, verbatim per period

Column headers in the source:
- "S (refertemaandloon aan 100% in EUR)" and "R (basisbedrag in EUR)";
- LUIK A is labelled "(lage lonen)", LUIK B "(zeer lage lonen)".

### 3.1 Quarter 2026/1, January and February 2026
Source NL-26/1:
> "Ingevolge de verhoging van het gewaarborgd gemiddeld minimum maandinkomen (GGMMI) overeenkomstig cao nr. 43-17 is er voor de berekening van de werkbonus een aanpassing van de loongrenzen, de hellingscoëfficiënten en van de maximale verminderingsbedragen nodig. De uiteindelijke sociale werkbonus is de som van de 2 componenten."

> "Loonschijven en verminderingsbedragen die gelden voor januari en februari 2026:"

Also in INT-25/4 (08/01/2026):
> "Ingevolge de evolutie van het indexcijfer der consumptieprijzen, is er een aanpassing van de loongrenzen en van de maximale verminderingsbedragen voor de berekening van de werkbonus. Naar aanleiding van deze indexevolutie worden enkele loongrenzen en maximale verminderingsbedragen later opnieuw aangepast met ingang vanaf 1 maart 2026 (zie verder). Hieronder vindt u in tabelvorm de nieuwe bedragen vanaf 1 januari 2026."

FR-26/1:
> "Tranches et montants d'application pour janvier et février 2026:"

**Bedienden (*)**

| LUIK A: S | LUIK A: R | LUIK B: S | LUIK B: R |
|---|---|---|---|
| ≤ 2.833,36 | 123,00 | ≤ 2.218,73 | 165,87 |
| > 2.833,36 en ≤ 3.271,48 | 123,00 - ( 0,2807 x (S - 2.833,36)) | > 2.218,73 en ≤ 2.833,36 | 165,87 - ( 0,2699 x (S - 2.218,73)) |
| > 3.271,48 | 0,00 | > 2.833,36 | 0,00 |

**Arbeiders (**)**

| LUIK A: S | LUIK A: R | LUIK B: S | LUIK B: R |
|---|---|---|---|
| ≤ 2.833,36 | 132,84 | ≤ 2.218,73 | 179,14 |
| > 2.833,36 en ≤ 3.271,48 | 132,84 - ( 0,3032 x (S - 2.833,36)) | > 2.218,73 en ≤ 2.833,36 | 179,14 - ( 0,2915 x (S - 2.218,73)) |
| > 3.271,48 | 0,00 | > 2.833,36 | 0,00 |

### 3.2 Quarter 2026/1, from 1 March 2026 (applies to March 2026)
NL-26/1:
> "Als gevolg van een verschil in berekeningswijze voor de aanpassing van de loongrenzen, worden de bovenste loongrens en een helingscoëfficiënt opnieuw aangepast met ingang vanaf 1 maart 2026."

The source spells it "helingscoëfficiënt" (sic).

> "Loonschijven en verminderingsbedragen die gelden vanaf 1 maart 2026:"

FR-26/1:
> "Tranches et montants d'application à partir du 1er mars 2026:"

**Bedienden (*)**

| LUIK A: S | LUIK A: R | LUIK B: S | LUIK B: R |
|---|---|---|---|
| ≤ 2.833,36 | 123,00 | ≤ 2.218,73 | 165,87 |
| > 2.833,36 en ≤ 3.336,98 | 123,00 - ( 0,2442 x (S - 2.833,36)) | > 2.218,73 en ≤ 2.833,36 | 165,87 - ( 0,2699 x (S - 2.218,73)) |
| > 3.336,98 | 0,00 | > 2.833,36 | 0,00 |

**Arbeiders (**)**

| LUIK A: S | LUIK A: R | LUIK B: S | LUIK B: R |
|---|---|---|---|
| ≤ 2.833,36 | 132,84 | ≤ 2.218,73 | 179,14 |
| > 2.833,36 en ≤ 3.336,98 | 132,84 - ( 0,2638 x (S - 2.833,36)) | > 2.218,73 en ≤ 2.833,36 | 179,14 - ( 0,2915 x (S - 2.218,73)) |
| > 3.336,98 | 0,00 | > 2.833,36 | 0,00 |

Annual cap stated in the 2026/1 version: 3.466,44 EUR (see 2.6).

### 3.3 Quarter 2026/2, from 1 April 2026 (April, May and June 2026)
NL-26/2:
> "Ingevolge de verhoging van het gewaarborgd gemiddeld minimum maandinkomen (GGMMI) overeenkomstig cao nr. 43-18 is er voor de berekening van de werkbonus een aanpassing van de loongrenzen, de hellingscoëfficiënten en van de maximale verminderingsbedragen nodig. De uiteindelijke sociale werkbonus is de som van de 2 componenten."

> "Loonschijven en verminderingsbedragen die gelden vanaf 1 april 2026:"

INT-26/1 (01/04/2026):
> "Ingevolge de verhoging van het gewaarborgd gemiddeld minimum maandinkomen (GGMMI) overeenkomstig CAO nr. 43-18, is er een aanpassing van de loongrenzen, de hellingscoëfficiënten en van de maximale verminderingsbedragen nodig voor de berekening van de werkbonus. Hieronder vindt u in tabelvorm de nieuwe bedragen vanaf 1 april 2026."

FR-26/2:
> "Tranches et montants d'application à partir du 1er avril 2026:"

**Bedienden (*)**

| LUIK A: S | LUIK A: R | LUIK B: S | LUIK B: R |
|---|---|---|---|
| ≤ 2.880,32 | 125,04 | ≤ 2.255,50 | 168,62 |
| > 2.880,32 en ≤ 3.336,98 | 125,04 - ( 0,2738 x (S - 2.880,32)) | > 2.255,50 en ≤ 2.880,32 | 168,62 - ( 0,2699 x (S - 2.255,50)) |
| > 3.336,98 | 0,00 | > 2.880,32 | 0,00 |

**Arbeiders (**)**

| LUIK A: S | LUIK A: R | LUIK B: S | LUIK B: R |
|---|---|---|---|
| ≤ 2.880,32 | 135,04 | ≤ 2.255,50 | 182,11 |
| > 2.880,32 en ≤ 3.336,98 | 135,04 - ( 0,2957 x (S - 2.880,32)) | > 2.255,50 en ≤ 2.880,32 | 182,11 - ( 0,2915 x (S - 2.255,50)) |
| > 3.336,98 | 0,00 | > 2.880,32 | 0,00 |

Annual cap: 3.523,92 EUR "Vanaf 1 april 2026".

### 3.4 Quarter 2026/3, July and August 2026
NL-26/3:
> "Ingevolge de evolutie van het indexcijfer der consumptieprijzen, is er een aanpassing van de loongrenzen en van de maximale verminderingsbedragen voor de berekening van de werkbonus vanaf 1 juli 2026. Vanaf 1 september 2026 worden opnieuw enkele bedragen aangepast. Ingevolge de verhoging van het gewaarborgd gemiddeld minimum maandinkomen (GGMMI) overeenkomstig cao nr. 43-18 is er voor de berekening van de werkbonus een aanpassing van de loongrenzen, de hellingscoëfficiënten en van de maximale verminderingsbedragen nodig. De uiteindelijke sociale werkbonus is de som van de 2 componenten."

> "Loonschijven en verminderingsbedragen die gelden voor juli en augustus 2026:"

INT-26/2 (03/07/2026) gives the same text and tables.

FR-26/3:
> "Tranches et montants d'application pour juillet et août 2026:"

**Bedienden (*)**

| LUIK A: S | LUIK A: R | LUIK B: S | LUIK B: R |
|---|---|---|---|
| ≤ 2.937,93 | 127,54 | ≤ 2.300,62 | 171,99 |
| > 2.937,93 en ≤ 3.336,98 | 127,54 - ( 0,3196 x (S - 2.937,93)) | > 2.300,62 en ≤ 2.937,93 | 171,99 - ( 0,2699 x (S - 2.300,62)) |
| > 3.336,98 | 0,00 | > 2.937,93 | 0,00 |

**Arbeiders (**)**

| LUIK A: S | LUIK A: R | LUIK B: S | LUIK B: R |
|---|---|---|---|
| ≤ 2.937,93 | 137,74 | ≤ 2.300,62 | 185,75 |
| > 2.937,93 en ≤ 3.336,98 | 137,74 - ( 0,3452 x (S - 2.937,93)) | > 2.300,62 en ≤ 2.937,93 | 185,75 - ( 0,2915 x (S - 2.300,62)) |
| > 3.336,98 | 0,00 | > 2.937,93 | 0,00 |

### 3.5 Quarter 2026/3, from 1 September 2026
NL-26/3:
> "De volgende bedragen gelden vanaf 1 september 2026. De uiteindelijke sociale werkbonus is de som van de 2 componenten."

FR-26/3:
> "Les montants suivants s'appliquent à partir du 1er septembre 2026. Le bonus à l'emploi final est la somme des deux composantes."

**Bedienden (*)**

| LUIK A: S | LUIK A: R | LUIK B: S | LUIK B: R |
|---|---|---|---|
| ≤ 2.937,93 | 127,54 | ≤ 2.300,62 | 171,99 |
| > 2.937,93 en ≤ 3.403,62 | 127,54 - ( 0,2739 x (S - 2.937,93)) | > 2.300,62 en ≤ 2.937,93 | 171,99 - ( 0,2699 x (S - 2.300,62)) |
| > 3.403,62 | 0,00 | > 2.937,93 | 0,00 |

**Arbeiders (**)**

| LUIK A: S | LUIK A: R | LUIK B: S | LUIK B: R |
|---|---|---|---|
| ≤ 2.937,93 | 137,74 | ≤ 2.300,62 | 185,75 |
| > 2.937,93 en ≤ 3.403,62 | 137,74 - ( 0,2958 x (S - 2.937,93)) | > 2.300,62 en ≤ 2.937,93 | 185,75 - ( 0,2915 x (S - 2.300,62)) |
| > 3.403,62 | 0,00 | > 2.937,93 | 0,00 |

Annual cap stated in the 2026/3 version: 3.594,36 EUR "Vanaf 1 juli 2026" (nothing separate for September).

### 3.6 Quarter 2026/4 (October, November, December 2026): PENDING
- The DmfA instructions 2026/4 are not published on www.socialsecurity.be as of 2026-11-24 (404; the selector stops at 2026/3).
- The 2026/3 tussentijdse instructies, last item 20/10/2026, contain no werkbonus item.
- The latest official text available is the "vanaf 1 september 2026" table, which has no end date.
- Whether it remains unchanged for October–December 2026 is **PENDING** until the 2026/4 version, or an interim instruction, is published. Do not assume.

---

## 4. Discrepancies and open points (PENDING)

1. **CAO/CCT number for the 1 March / 1 April adjustments.**
   - NL-26/1 and FR-26/1 refer to "cao nr. 43-17" / "CCT n° 43-17" in the intro paragraph of the January–March tables.
   - INT-26/1, NL-26/2 and NL-26/3 refer to "CAO nr. 43-18" / "CCT n° 43-18" for the 1 April 2026 GGMMI increase.
   - This does not affect the amounts. Which CAO underlies which change is PENDING verification in the CAO text itself (FOD WASO / NAR) or the Belgisch Staatsblad.
2. **Legal basis** (koninklijk besluit / wet fixing the 2026 amounts): not given on the DmfA pages, apart from the reference to "Het koninklijk besluit van 27 maart 2023". The Belgisch Staatsblad source for each 2026 amount is PENDING.
3. **Prestatiecode 38** was added to J and H in the 2026/3 version. Its meaning and exact effective date are PENDING. Check the DmfA glossary of prestatiecodes on socialsecurity.be.
4. **Annual cap**: three values appear (3.466,44 / 3.523,92 / 3.594,36 EUR). PENDING:
   - how the cap applies when the value changes within the calendar year;
   - whether the cap was adjusted on 1 September 2026;
   - the value for Q4 2026.
5. **Q4 2026 parameters**: PENDING (see 3.6).
6. **Relation between luik A/B and the fiscal werkbonus**: outside the scope of the RSZ page. It needs FOD Financiën sources (bijlage III KB/WIB, art. 289ter). PENDING / not covered here.
7. No CAPTCHA was encountered. Everything was fetched over plain HTTPS with curl.
