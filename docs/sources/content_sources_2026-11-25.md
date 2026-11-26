# Content sources: glossary and guides (research log)

- **Pages:** `web/nl/woordenlijst/`, `web/fr/lexique/`, `web/nl/gidsen/`, `web/fr/guides/` (index pages and one page per term/guide).
- **Retrieved:** 2026-11-25 (2026-4 werkbonus URL re-checked 2026-11-26: still the RSZ 404 page), with `curl`. Every page used here answered without a CAPTCHA at that moment. `www.belgium.be`, `vlaanderen.be`, Fisconet (`minfin.fgov.be`) showed a CAPTCHA and were not used; `werk.belgie.be` was not reachable through the proxy.
- **Method:** every factual sentence on a page is backed by at least one claim below. Each quote is verbatim from the page text (whitespace normalised; the build script checks every quote against the saved page text). Quotes are given in NL for the NL page and FR for the FR page; NL pages may cite a French-only SPF Finances page where no Dutch version exists on an allowed domain.
- **No amounts** other than: 13,07 % (RSZ), 8 % / 100 % / 108 % (RSZ), 25 % to 50 % (FOD, tax brackets), 11.550 euro (FOD, basic tax-free amount, income year 2026 / assessment year 2027; already `confirmed` in `params/2026/federal.yaml`), 7 years and 1 year (FOD, retention and objection periods). No net salary and no computed example.

## Sources

| Key | NL | FR |
|---|---|---|
| contrib | https://www.socialsecurity.be/employer/instructions/dmfa/nl/latest/instructions/socialsecuritycontributions/contributions/workercontributions.html | https://www.socialsecurity.be/employer/instructions/dmfa/fr/latest/instructions/socialsecuritycontributions/contributions/workercontributions.html |
| calcbase | https://www.socialsecurity.be/employer/instructions/dmfa/nl/latest/instructions/socialsecuritycontributions/calculationbase/generalrule.html | https://www.socialsecurity.be/employer/instructions/dmfa/fr/latest/instructions/socialsecuritycontributions/calculationbase/generalrule.html |
| loon | https://www.socialsecurity.be/employer/instructions/dmfa/nl/latest/instructions/salary/description.html | https://www.socialsecurity.be/employer/instructions/dmfa/fr/latest/instructions/salary/description.html |
| vak | https://www.socialsecurity.be/employer/instructions/dmfa/nl/latest/instructions/salary/particularcases/holidaypay.html | https://www.socialsecurity.be/employer/instructions/dmfa/fr/latest/instructions/salary/particularcases/holidaypay.html |
| dvg | https://www.socialsecurity.be/employer/instructions/dmfa/nl/latest/instructions/special_contributions/other_specialcontributions/doubleholiday_privatesector.html | https://www.socialsecurity.be/employer/instructions/dmfa/fr/latest/instructions/special_contributions/other_specialcontributions/doubleholiday_privatesector.html |
| wb | https://www.socialsecurity.be/employer/instructions/dmfa/nl/latest/instructions/deductions/workers_reductions/workbonus.html | https://www.socialsecurity.be/employer/instructions/dmfa/fr/latest/instructions/deductions/workers_reductions/workbonus.html |
| bb | https://www.socialsecurity.be/employer/instructions/dmfa/nl/latest/instructions/special_contributions/other_specialcontributions/specialsocialsecuritycontribution.html | https://www.socialsecurity.be/employer/instructions/dmfa/fr/latest/instructions/special_contributions/other_specialcontributions/specialsocialsecuritycontribution.html |
| code | https://www.socialsecurity.be/employer/instructions/dmfa/nl/latest/instructions/fill_in_dmfa/dmfa_fillinrules/salarydata/remunerationcode.html | https://www.socialsecurity.be/employer/instructions/dmfa/fr/latest/instructions/fill_in_dmfa/dmfa_fillinrules/salarydata/remunerationcode.html |
| freq | https://www.socialsecurity.be/employer/instructions/dmfa/nl/latest/instructions/fill_in_dmfa/dmfa_fillinrules/salarydata/bonuspaymentfrequence.html | https://www.socialsecurity.be/employer/instructions/dmfa/fr/latest/instructions/fill_in_dmfa/dmfa_fillinrules/salarydata/bonuspaymentfrequence.html |
| dmfa | https://www.socialsecurity.be/employer/instructions/dmfa/nl/latest/instructions/obligations/obligations_nsso/dmfa/general.html | https://www.socialsecurity.be/employer/instructions/dmfa/fr/latest/instructions/obligations/obligations_nsso/dmfa/general.html |
| dmfaintro | https://www.socialsecurity.be/employer/instructions/dmfa/nl/latest/instructions/fill_in_dmfa/introduction.html | https://www.socialsecurity.be/employer/instructions/dmfa/fr/latest/instructions/fill_in_dmfa/introduction.html |
| dimona | https://www.socialsecurity.be/employer/instructions/dmfa/nl/latest/instructions/obligations/obligations_nsso/dimona/general.html | https://www.socialsecurity.be/employer/instructions/dmfa/fr/latest/instructions/obligations/obligations_nsso/dimona/general.html |
| tar | https://fin.belgium.be/nl/particulieren/belastingaangifte/inkomsten/belastingtarieven | https://fin.belgium.be/fr/particuliers/declaration-impot/revenus/taux-imposition |
| ber | https://fin.belgium.be/nl/particulieren/belastingaangifte/inkomsten/beroepsinkomen | https://fin.belgium.be/fr/particuliers/declaration-impot/revenus/revenus-professionnels |
| asb | https://fin.belgium.be/nl/particulieren/belastingaangifte/aanslagbiljet/aanslagbiljet | https://fin.belgium.be/fr/particuliers/declaration-impot/avertissement-extrait-de-role/avertissement-extrait-de-role |
| gem | https://fin.belgium.be/nl/particulieren/belastingaangifte/aanslagbiljet/gemeentebelasting | https://fin.belgium.be/fr/particuliers/declaration-impot/avertissement-extrait-de-role/taxe-communale |
| aang | https://fin.belgium.be/nl/particulieren/belastingaangifte/indienen/belastingaangifte | https://fin.belgium.be/fr/particuliers/declaration-impot/rentrer-declaration/declaration-impot |
| vva | https://fin.belgium.be/nl/particulieren/belastingaangifte/indienen/voorstel-vereenvoudigde-aangifte | https://fin.belgium.be/fr/particuliers/declaration-impot/rentrer-declaration/proposition-declaration-simplifiee |
| na | https://fin.belgium.be/nl/particulieren/belastingaangifte/na-aangifte | https://fin.belgium.be/fr/particuliers/declaration-impot/apres-declaration |
| ptl | https://fin.belgium.be/nl/particulieren/belastingaangifte/persoonlijke-situatie/personen-ten-laste | https://fin.belgium.be/fr/particuliers/declaration-impot/situation-personnelle/personnes-a-charge |
| hw | https://fin.belgium.be/nl/particulieren/belastingaangifte/persoonlijke-situatie/huwelijk-samenwonen | https://fin.belgium.be/fr/particuliers/declaration-impot/situation-personnelle/mariage-cohabitation |
| ppcalc | https://finances.belgium.be/fr/entreprises/personnel_et_remuneration/precompte_professionnel/calcul | https://finances.belgium.be/fr/entreprises/personnel_et_remuneration/precompte_professionnel/calcul |
| fiche | https://finances.belgium.be/fr/entreprises/personnel_et_remuneration/avantages_toute_nature/traitement_fiches | https://finances.belgium.be/fr/entreprises/personnel_et_remuneration/avantages_toute_nature/traitement_fiches |
| statbel | https://statbel.fgov.be/nl/themas/huishoudens/fiscale-inkomens | https://statbel.fgov.be/fr/themes/menages/revenus-fiscaux |

## Term: Brutoloon / Salaire brut (rémunération brute)

Pages: `web/nl/woordenlijst/brutoloon/`, `web/fr/lexique/salaire-brut/`

| Claim | NL source and quote | FR source and quote |
|---|---|---|
| Gross wage is the basis for social-security contributions | loon: “het brutoloon van de werknemer de basis is waarop de bijdragen worden berekend” | loon: “la rémunération brute du travailleur est la base sur laquelle les cotisations sont calculées” |
| Definition of wage (advantage in cash or valued in money) and legal basis art. 2 law 12-04-1965 | loon: “Loon is elk voordeel in geld of in geld waardeerbaar” | loon: “Est considéré comme rémunération , tout avantage en espèces ou évaluable en argent” |
| Legal basis | loon: “Het begrip loon is bepaald bij artikel 2 van de wet van 12 april 1965 betreffende de bescherming van het loon der werknemers” | loon: “La notion de rémunération est déterminée par l'article 2 de la loi du 12 avril 1965 concernant la protection de la rémunération des travailleurs” |
| Contributions also due on other advantages (overtime pay, benefits in kind, premiums) | loon: “de socialezekerheidsbijdragen niet alleen verschuldigd zijn op het eigenlijke brutoloon, maar ook op tal van andere voordelen” | loon: “le sursalaire” |
| General rule: contributions on full gross wage; +8 % for many workers | calcbase: “de socialezekerheidsbijdragen berekend worden op het volledige brutoloon van de werknemer” | calcbase: “Les cotisations sont calculées sur la totalité de la rémunération brute du travailleur” |
| +8 % for manual workers in private holiday scheme | contrib: “Voor handarbeiders en daarmee gelijkgestelden die onder het privé-vakantiestelsel vallen, worden de socialezekerheidsbijdragen berekend op het brutoloon verhoogd met 8%.” | contrib: “Pour les travailleurs manuels et assimilés qui relèvent du régime de vacances du secteur privé, les cotisations de sécurité sociale sont calculées sur la rémunération brute majorée de 8 %.” |

## Term: Nettoloon / Salaire net

Pages: `web/nl/woordenlijst/nettoloon/`, `web/fr/lexique/salaire-net/`

| Claim | NL source and quote | FR source and quote |
|---|---|---|
| Special contribution withheld after employee SS contributions and after professional withholding | bb: “elke inhouding gebeurt na aftrek van de werknemersbijdragen voor sociale zekerheid en na aftrek van de bedrijfsvoorheffing” | bb: “toutes les retenues doivent être effectuées après déduction des cotisations personnelles de sécurité sociale et du précompte professionnel” |
| Professional withholding is an advance on final tax | asb: “De bedrijfsvoorheffing wordt elke maand ingehouden op uw loon, uw pensioen … als een soort ‘voorschot’ op het uiteindelijke belastingbedrag.” | asb: “Le précompte professionnel est retenu chaque mois sur votre salaire, votre pension, etc. comme une sorte de « provision » sur le montant de l’impôt final.” |
| Special contribution amounts are advances | bb: “De aan de RSZ betaalde bedragen zijn dus voorschotten op de jaarlijks verschuldigde bijdrage.” | bb: “les montants versés à l'ONSS doivent être considérés comme étant des provisions à valoir sur le montant annuel effectivement dû” |
| Assessment notice states amount to pay or to be refunded | asb: “Daarin staat het bedrag dat u moet betalen of dat u terugkrijgt.” | asb: “Ce document indique le montant que vous devez payer ou qui vous sera remboursé.” |

## Term: Werknemersbijdrage (RSZ) / Cotisation personnelle (ONSS)

Pages: `web/nl/woordenlijst/werknemersbijdrage/`, `web/fr/lexique/cotisation-personnelle/`

| Claim | NL source and quote | FR source and quote |
|---|---|---|
| Normal employee contribution 13,07 % of gross wage, deducted by werkbonus at payment | wb: “De werkgever brengt het bedrag in mindering van de normale werknemersbijdragen (13,07% van het brutoloon) bij de betaling van het loon.” | wb: “L'employeur déduit ce montant des cotisations personnelles normalement dues (13,07 %) au moment du paiement du salaire.” |
| Total employee rate = sum of applicable schemes; rates on gross quarterly wages | contrib: “Om het totale werknemersbijdragepercentage te kennen, telt u de percentages op van de regelingen die voor de werknemer van toepassing zijn. Volgende bijdragepercentages gelden op de brutokwartaallonen:” | contrib: “Pour connaître le pourcentage total de la cotisation personnelle du travailleur , il faut additionner les pourcentages des régimes applicables à ce travailleur. Les pourcentages suivants sont applicables sur la rémunération trimestrielle brute:” |
| Schemes include pensions, sickness/invalidity, unemployment; employee and employer share | contrib: “werknemersaandeel” | contrib: “Part patronale” |
| Calculation on gross wage; +8 % manual workers | calcbase: “Voor een groot aantal werknemers moet het loon vóór de bijdrageberekening verhoogd worden met 8%.” | calcbase: “Pour un grand nombre de travailleurs, la rémunération doit être préalablement majorée de 8 % pour le calcul les cotisations.” |
| Werkbonus cannot exceed personal contributions due | wb: “De werkbonus (P) mag de verschuldigde persoonlijke socialezekerheidsbijdragen niet overschrijden.” | wb: “Le bonus à l’emploi (P) ne peut pas dépasser les cotisations personnelles de sécurité sociale dues.” |

## Term: Werkbonus / Bonus à l’emploi

Pages: `web/nl/woordenlijst/werkbonus/`, `web/fr/lexique/bonus-a-l-emploi/`

| Claim | NL source and quote | FR source and quote |
|---|---|---|
| Forfait decreasing as wage rises; deducted at payment | wb: “De vermindering bestaat uit een forfaitair bedrag dat geleidelijk vermindert naarmate het loon hoger wordt.” | wb: “La réduction consiste en un montant forfaitaire qui diminue progressivement en fonction de la hauteur du salaire.” |
| Three steps per worker | wb: “Men berekent de vermindering voor iedere werknemer apart. Deze berekening omvat drie stappen.” | wb: “Cette réduction doit être calculée séparément pour chaque travailleur. Le calcul se fait en trois étapes:” |
| Step 3 correction for incomplete and part-time | wb: “Ten slotte stelt men het verminderingsbedrag vast door het basisbedrag te corrigeren bij onvolledige prestaties en bij deeltijdse werknemers.” | wb: “enfin, on détermine le montant de la réduction en adaptant, en cas de prestations incomplètes ou à temps partiel, le montant de base.” |
| Two components since 1 April 2024, to allow fiscal werkbonus | wb: “Vanaf 1 april 2024 wordt de berekening van de werkbonus opgesplitst in 2 componenten om een aangepaste berekening van de fiscale werkbonus mogelijk te maken.” | wb: “le calcul du bonus à l'emploi a été scindé en deux composantes pour rendre possible un calcul adapté du bonus à l'emploi fiscal.” |
| Luik A low wages, luik B very low wages | wb: “LUIK B (zeer lage lonen)” | wb: “VOLET B (très bas salaires)” |
| Cap at personal contributions; capping B then A; social = A + B | wb: “De eventuele aftopping bij een tekort aan werknemersbijdragen gebeurt op de berekening op basis van Luik B en vervolgens op de berekening op basis van Luik A.” | wb: “L'éventuel écrêtement en raison d'une insuffisance de cotisations personnelles s'effectue sur le calcul basé sur le volet B et ensuite sur le calcul basé sur le volet A.” |
| Annual maximum per worker per calendar year | wb: “mag het totaal van de vermindering per werknemer niet meer bedragen dan 3.594,36 EUR per kalenderjaar” | wb: “Le montant total de la réduction par travailleur ne peut être supérieur à 3.594,36 EUR par année calendrier” |
| Bedienden = declared at 100 %, arbeiders = 108 % | wb: “Onder 'Arbeiders' moet worden verstaan: de werknemers die moeten worden aangegeven aan 108 %” | wb: “Par 'ouvriers', on entend les travailleurs qui doivent être déclarés à 108 %” |
| Reference wage at 100 % for both | wb: “Zowel voor arbeiders als voor bedienden berekent men het refertemaandloon op basis van de aangegeven brutolonen aan 100%.” | wb: “Tant pour les ouvriers que pour les employés, le salaire mensuel de référence est calculé sur le salaire brut déclaré à 100 %.” |

## Term: Bijzondere bijdrage voor de sociale zekerheid / Cotisation spéciale pour la sécurité sociale

Pages: `web/nl/woordenlijst/bijzondere-bijdrage-sociale-zekerheid/`, `web/fr/lexique/cotisation-speciale-securite-sociale/`

| Claim | NL source and quote | FR source and quote |
|---|---|---|
| Borne by employees in addition to ordinary contributions; varies with wage and family situation | bb: “Behalve de 'gewone' socialezekerheidsbijdragen, is er tevens een bijzondere bijdrage voor de sociale zekerheid ten laste van de werknemers. Deze bijdrage varieert naargelang de grootte van het loon van de werknemer, en zijn gezinstoestand” | bb: “Outre les cotisations 'ordinaires' de sécurité sociale, une cotisation spéciale pour la sécurité sociale est mise à charge des travailleurs. Il s'agit d'une cotisation qui varie selon l'importance de la rémunération du travailleur” |
| Quarterly base, monthly withholding, may vary | bb: “De berekeningsbasis van de bijdrage is het kwartaalloon onderworpen aan bijdrageberekening; de inhouding gebeurt op het maandloon van elke werknemer” | bb: “le montant des retenues mensuelles peut varier de mois en mois” |
| 108 % manual workers; other employer excluded | bb: “Als de werknemer tevens bij een andere werkgever werkt, houdt men geen rekening met het loon betaald door die andere werkgever(s).” | bb: “portée à 108 % pour les travailleurs manuels” |
| Double holiday pay not counted for band | bb: “komt het niet in aanmerking om uit te maken in welke schijf van de bijzondere bijdrage de werknemer valt” | bb: “elle ne doit pas être prise en considération pour déterminer dans quelle tranche se situe la rémunération trimestrielle du travailleur” |
| Quarter-end reconciliation | bb: “Indien men voor de eerste twee maanden samen minder heeft ingehouden dan het berekende bedrag, houdt men bij de derde maandbetaling het verschil in.” | bb: “il remboursera le trop perçu” |
| From 1 April 2022 individual vs joint assessment | bb: “Vanaf 1 april 2022 wordt er voor de berekening van de bijdrage een onderscheid gemaakt tussen belastingplichtigen die alleen worden belast en belastingplichtigen voor wie een gemeenschappelijke aanslag wordt gevestigd.” | bb: “il est fait une distinction entre les contribuables qui sont individuellement imposés et les contribuables pour lesquels une imposition commune est établie” |
| Spouse with professional income per professional-withholding rules; legal cohabitants equated | bb: “De wettelijk samenwonenden worden volledig gelijkgesteld met gehuwden, en beschouwd als echtgenoot.” | bb: “Les cohabitants légaux sont entièrement assimilés aux personnes mariées et considérés comme conjoints.” |
| Reported on tax form | bb: “Het totale bedrag van de bijzondere bijdrage vermeldt u op de fiscale fiche van de werknemer.” | bb: “sera indiqué sur la fiche à délivrer au travailleur en vertu de la législation fiscale” |
| Final annual settlement by tax administration | bb: “De administratie der directe belastingen doet jaarlijks de definitieve afrekening bij de belastingheffing.” | bb: “L'administration des contributions directes effectuera le décompte définitif de cette cotisation lors de l'enrôlement des revenus du contribuable.” |

## Term: Bedrijfsvoorheffing / Précompte professionnel

Pages: `web/nl/woordenlijst/bedrijfsvoorheffing/`, `web/fr/lexique/precompte-professionnel/`

| Claim | NL source and quote | FR source and quote |
|---|---|---|
| Withheld monthly as advance | asb: “De bedrijfsvoorheffing wordt elke maand ingehouden op uw loon, uw pensioen … als een soort ‘voorschot’ op het uiteindelijke belastingbedrag.” | asb: “Le précompte professionnel est retenu chaque mois sur votre salaire, votre pension, etc. comme une sorte de « provision » sur le montant de l’impôt final.” |
| Reduced withholding as explanation for paying more | asb: “Uw bedrijfsvoorheffing is verminderd (bijvoorbeeld als u van werk bent veranderd of bent gepensioneerd).” | asb: “Votre précompte professionnel a diminué (par exemple, si vous avez changé de travail ou si vous êtes retraité).” |
| Assessment notice shows amount to pay/refund after processing | asb: “Nadat we uw aangifte ontvangen en verwerkt hebben, berekenen we uw belastingen.” | asb: “Dès que nous avons reçu et traité votre déclaration, nous calculons votre impôt.” |
| Rules, key formula and simulator per year (2026) | ppcalc: “Règles 1er janvier 2026 Formule-clé à partir du 1er janvier 2026 Simulateur - Précompte professionnel 2026” | ppcalc: “Règles 1er janvier 2026 Formule-clé à partir du 1er janvier 2026 Simulateur - Précompte professionnel 2026” |
| Special contribution after withholding | bb: “elke inhouding gebeurt na aftrek van de werknemersbijdragen voor sociale zekerheid en na aftrek van de bedrijfsvoorheffing” | bb: “toutes les retenues doivent être effectuées après déduction des cotisations personnelles de sécurité sociale et du précompte professionnel” |

## Term: Personenbelasting / Impôt des personnes physiques

Pages: `web/nl/woordenlijst/personenbelasting/`, `web/fr/lexique/impot-des-personnes-physiques/`

| Claim | NL source and quote | FR source and quote |
|---|---|---|
| Income subject to the tax on natural persons; income year is taxable period | statbel: “Het inkomstenjaar is het belastbare tijdperk. De inkomsten die de belastingplichtige verkregen heeft in dat jaar zijn onderworpen aan belastingen.” | statbel: “Statistique fiscale des revenus soumis à l'impôt des personnes physiques. Cette statistique est établie par l’année de revenus. L’année de revenus est la période imposable.” |
| NL name belasting van de natuurlijke personen | statbel: “Fiscale statistiek van de inkomsten onderworpen aan de belasting van de natuurlijke personen.” | statbel: “Les revenus que le contribuable a réalisés ou recueillis dans cette année sont soumis à l’impôt.” |
| Brackets 25 % to 50 %, progressive | tar: “Elke schijf heeft zijn eigen belastingtarief (van 25 % tot 50 %). Hoe hoger uw inkomsten, hoe hoger het belastingtarief.” | tar: “Chaque tranche a son propre taux d’imposition (de 25 % à 50 %). Plus votre revenu est élevé, plus le taux d’imposition est élevé.” |
| Basic exempt amount | tar: “Daarnaast wordt een deel van uw inkomen vrijgesteld van belasting, dat noemen we de belastingvrije som.” | tar: “Par ailleurs, une partie de votre revenu est exemptée d’impôt, c’est ce qu’on appelle la quotité exemptée d’impôt.” |
| Forfait professional expenses deducted automatically | tar: “Van de meeste beroepsinkomsten , zoals lonen, worden automatisch forfaitaire beroepskosten afgetrokken.” | tar: “frais professionnels forfaitaires” |
| Municipal tax collected with PIT | gem: “De gemeentebelasting wordt samen met de personenbelasting geïnd.” | gem: “La taxe communale est perçue en même temps que l’impôt des personnes physiques.” |
| Withholding as advance | asb: “als een soort ‘voorschot’ op het uiteindelijke belastingbedrag” | asb: “comme une sorte de « provision » sur le montant de l’impôt final” |

## Term: Aanslagjaar / Exercice d’imposition

Pages: `web/nl/woordenlijst/aanslagjaar/`, `web/fr/lexique/exercice-d-imposition/`

| Claim | NL source and quote | FR source and quote |
|---|---|---|
| Definition aanslagjaar | statbel: “Aanslagjaar : Het aanslagjaar is het jaar waarin de belastingaangifte ingediend wordt. Dit is het jaar na het kalenderjaar waarin de inkomsten werden behaald (inkomstenjaar).” | statbel: “L'exercice d’imposition est l'année au cours de laquelle la déclaration d'impôts est introduite. Il s’agit de l’année qui suit l’année calendrier au cours de laquelle les revenus ont été perçus (année des revenus).” |
| FOD labels: inkomstenjaar 2026 (aanslagjaar 2027) | tar: “Inkomstenjaar 2026 (aanslagjaar 2027)” | tar: “Année de revenus 2026 (exercice d'imposition 2027)” |
| Situation on 1 January of assessment year | hw: “Voor aanslagjaar 2026 (inkomsten 2025) is uw situatie op 1 januari 2026 van belang.” | hw: “pour l’exercice d’imposition 2026 (revenus 2025), c'est votre situation au 1 er janvier 2026 qui sera déterminante” |
| Control period starts 1 January of assessment year | na: “binnen een termijn die begint te lopen vanaf 1 januari van het aanslagjaar” | na: “dans un délai qui commence à partir du 1 er janvier de l’année de l’exercice d’imposition” |

## Term: Inkomstenjaar / Année de revenus

Pages: `web/nl/woordenlijst/inkomstenjaar/`, `web/fr/lexique/annee-de-revenus/`

| Claim | NL source and quote | FR source and quote |
|---|---|---|
| Definition inkomstenjaar | statbel: “Inkomstenjaar : Het inkomstenjaar is het jaar waarvoor de belastingen verschuldigd zijn.” | statbel: “Année des revenus : L'année des revenus est l’année pour laquelle des impôts sont dus.” |
| Taxable period | statbel: “Het inkomstenjaar is het belastbare tijdperk.” | statbel: “L’année de revenus est la période imposable. Les revenus que le contribuable a réalisés ou recueillis dans cette année sont soumis à l’impôt.” |
| Basic exempt amount 11.550 euro income year 2026 (AY 2027) | tar: “11.550 euro voor inkomstenjaar 2026 (aanslagjaar 2027)” | tar: “11.550 euros pour l'année de revenus 2026 (exercice d’imposition 2027)” |
| Fiche between early February and end April of following year | ber: “De instantie die uw bezoldiging of uw vervangingsinkomen uitbetaalt, zal u tussen begin februari en eind april van het volgende jaar, een fiche bezorgen met de inkomsten die u moet aangeven.” | ber: “Entre début février et fin avril de l’année suivant celle de l’obtention du revenu, l’organisme qui paie votre rémunération ou votre revenu de remplacement vous enverra une fiche avec les revenus que vous devez déclarer.” |

## Term: Belastingvrije som / Quotité exemptée d’impôt

Pages: `web/nl/woordenlijst/belastingvrije-som/`, `web/fr/lexique/quotite-exemptee-d-impot/`

| Claim | NL source and quote | FR source and quote |
|---|---|---|
| First part exempt; everyone subject to PIT entitled | tar: “Het eerste gedeelte van uw belastbare inkomen wordt vrijgesteld van belastingen.” | tar: “La première partie de votre revenu imposable est exemptée d’impôt. En effet, toute personne soumise à l’impôt des personnes physiques, a droit à une « quotité exemptée d’impôt ».” |
| Everyone subject is entitled (NL) | tar: “Iedereen die aan de personenbelasting onderworpen is, heeft namelijk recht op een” | tar: “toute personne soumise à l’impôt des personnes physiques” |
| 11.550 euro for IY 2026 / AY 2027 | tar: “11.550 euro voor inkomstenjaar 2026 (aanslagjaar 2027)” | tar: “11.550 euros pour l'année de revenus 2026 (exercice d’imposition 2027)” |
| Can increase (children); lower income no tax | tar: “De belastingvrije som kan verhogen op basis van uw persoonlijke situatie, bijvoorbeeld als u kinderen ten laste hebt. Als uw inkomen lager ligt dan de belastingvrije som, moet u geen belastingen betalen.” | tar: “La quotité exemptée d’impôt peut augmenter en fonction de votre situation personnelle, si vous avez par exemple des enfants à charge. Si votre revenu est inférieur à la quotité exemptée d’impôt, vous ne devrez pas payer d’impôt.” |
| Method in example: tax on exempt amount subtracted | tar: “Daarvoor berekenen we eerst hoeveel belastingen Pieter in principe zou moeten betalen op het bedrag van de belastingvrije som.” | tar: “Pour ce faire, nous calculons d’abord le montant de l’impôt que Jean devrait payer en principe sur le montant de la quotité du revenu exemptée d’impôt.” |
| Dependants increase exempt amount | ptl: “namelijk een verhoging van uw belastingvrije som” | ptl: “à savoir une majoration de la quotité du revenu exemptée d’impôt” |

## Term: Beroepskosten (forfait) / Frais professionnels (forfait)

Pages: `web/nl/woordenlijst/beroepskosten/`, `web/fr/lexique/frais-professionnels/`

| Claim | NL source and quote | FR source and quote |
|---|---|---|
| Professional income reduced by professional expenses, forfait or actual | ber: “Voor de berekening van de belasting worden uw beroepsinkomsten verminderd met de beroepskosten. Deze worden forfaitair bepaald, maar u kan ook kiezen om uw werkelijke kosten in te brengen.” | ber: “Pour le calcul de l'impôt, des frais professionnels sont déduits de vos revenus professionnels. Ceux-ci sont déterminés forfaitairement, mais vous pouvez choisir de déduire vos frais réels à la place.” |
| No costs mentioned: automatic forfait | ber: “Als u in uw aangifte geen kosten vermeldt, geniet u automatisch de forfaitaire kosten.” | ber: “Si vous ne mentionnez aucun frais dans votre déclaration, vous bénéficierez automatiquement du régime des frais forfaitaires.” |
| Employees: percentage of gross professional income (minus contributions) with a maximum per income year | ber: “Voor werknemers berekenen we de forfaitaire kosten door een percentage van 30 % toe te passen op hun brutoberoepsinkomen (verminderd met bijdragen) en dat met een maximum van:” | ber: “Pour les travailleurs , nous calculons les frais forfaitaires en appliquant un pourcentage de 30 % à leurs revenus professionnels bruts (diminués des cotisations) et ce avec un maximum de :” |
| Actual costs must be proven | ber: “U moet dan wel bewijzen dat de kosten effectief betrekking hebben op uw beroepswerkzaamheid en dat u die kosten werkelijk tijdens het belastbare tijdperk gemaakt en gedragen hebt.” | ber: “Vous devez cependant prouver que les frais sont effectivement liés à votre activité professionnelle et que vous avez encouru et supporté ces frais au cours de la période imposable.” |
| Simulation in MyMinfin or Tax-Calc | ber: “Om te weten wat voor u de beste optie is, kunt u een simulatie maken in MyMinfin (Tax-on-web) of TaxCalc .” | ber: “Pour connaître la meilleure option en ce qui vous concerne, vous pouvez faire une simulation via MyMinfin (Tax-on-web) ou Tax-calc .” |

## Term: Gemeentebelasting / Taxe communale

Pages: `web/nl/woordenlijst/gemeentebelasting/`, `web/fr/lexique/taxe-communale/`

| Claim | NL source and quote | FR source and quote |
|---|---|---|
| Municipalities may levy additional tax as percentage of PIT | gem: “De gemeenten mogen op de personenbelasting een aanvullende belasting vestigen die wordt berekend door een percentage toe te passen op het bedrag van de personenbelasting.” | gem: “Les communes peuvent établir une taxe additionnelle à l'impôt des personnes physiques qui est calculée en appliquant un pourcentage du montant de l’impôt des personnes physiques.” |
| All residents subject to PIT are subject | gem: “Alle inwoners van de gemeente die onderworpen zijn aan de personenbelasting zijn ook onderworpen aan de gemeentebelasting.” | gem: “Tous les habitants de la commune soumis à l’impôt des personnes physiques sont également soumis à cette taxe communale.” |
| Collected with PIT, end of notice, no separate assessment, rate set yearly | gem: “U vindt het bedrag van de gemeentebelasting helemaal op het einde van uw aanslagbiljet. U krijgt dus geen aparte aanslag voor deze belasting. Elke gemeente legt elk jaar het tarief van de gemeentebelasting voor haar grondgebied vast.” | gem: “Vous trouverez le montant de la taxe à la fin de votre avertissement-extrait de rôle. Vous ne recevrez dès lors jamais une imposition spécifique pour cette taxe. Chaque commune fixe chaque année le taux de la taxe communale pour son territoire.” |
| Rate may be unknown in provisional calculation | asb: “bijvoorbeeld: het tarief van de gemeentebelasting” | asb: “par exemple, le taux de la taxe communale” |

## Term: Gemeenschappelijke aanslag / Imposition commune

Pages: `web/nl/woordenlijst/gemeenschappelijke-aanslag/`, `web/fr/lexique/imposition-commune/`

| Claim | NL source and quote | FR source and quote |
|---|---|---|
| Legal cohabitants fully equated with married for PIT | hw: “Voor de personenbelasting worden wettelijk samenwonenden volledig gelijkgesteld met gehuwden.” | hw: “En matière d’impôt des personnes physiques, les cohabitants légaux sont entièrement assimilés à des personnes mariées.” |
| Married before the income year: joint declaration and taxed together | hw: “moeten u en uw partner een gezamenlijke belastingaangifte invullen en wordt u samen belast” | hw: “votre partenaire et vous devez alors remplir une déclaration commune et vous êtes imposés ensemble” |
| Situation on 1 January decides | hw: “Afhankelijk van uw persoonlijke situatie op 1 januari zijn de codes die u op uw aangifte moet invullen verschillend, net zoals de manier waarop u wordt belast (samen of afzonderlijk).” | hw: “En fonction de votre situation personnelle au 1 er janvier, les codes à remplir dans votre déclaration sont différents ainsi que la manière dont vous êtes imposé (ensemble ou séparément).” |
| De facto cohabitants are singles, separately taxed | hw: “U en uw feitelijk samenwonende partner worden fiscaal als alleenstaanden beschouwd” | hw: “Votre cohabitant de fait et vous êtes alors fiscalement considérés comme isolés” |
| Marriage in the year without prior legal cohabitation: separate | hw: “Het huwelijk vond plaats in 2025. Vóór uw huwelijk woonde u niet wettelijk samen met de persoon waarmee u bent getrouwd. Voor aanslagjaar 2026 (inkomsten 2025) moeten u en uw partner elk afzonderlijk uw eigen belastingaangifte invullen en wordt u afzonderlijk belast.” | hw: “Pour l‘exercice d’imposition 2026 (revenus 2025), votre partenaire et vous devez remplir chacun votre propre déclaration d’impôt et vous êtes imposés séparément.” |
| Legal cohabitation declared during the year: separate | hw: “De verklaring van wettelijke samenwoning werd afgelegd na 1 januari 2025” | hw: “La déclaration de cohabitation légale a eu lieu après le 1 er janvier 2025” |
| Marriage in year with legal cohabitation in the previous year: joint | hw: “Het huwelijk heeft plaatsgevonden in 2025 en in 2024 woonde u reeds wettelijk samen met de persoon waarmee u bent getrouwd.” | hw: “Le mariage a eu lieu en 2025 et, en 2024, vous étiez déjà en cohabitation légale avec la personne avec laquelle vous vous êtes marié” |
| Specific rules in some situations | hw: “Let op: in sommige situaties zijn specifieke regels van toepassing.” | hw: “Attention : dans certaines situations des règles particulières sont d’application.” |
| Marital quotient | hw: “Door dit huwelijksquotiënt wordt bij de belastingberekening een deel van de beroepsinkomsten van de partner met het hoogste inkomen aan de andere partner toegekend. Dat deel wordt dan aan een lager tarief belast” | hw: “Le quotient conjugal permet d'octroyer, dans le calcul de l'impôt, une partie des revenus professionnels du partenaire qui bénéficie des revenus les plus élevés à l’autre partenaire.” |
| Quotient not applied if it increases tax | hw: “Het huwelijksquotiënt wordt niet toegerekend als daardoor de verschuldigde belasting verhoogt.” | hw: “Le quotient conjugal n'est pas appliqué s'il entraîne une augmentation de l’impôt dû.” |
| Both partners must log in and send | aang: “Als u een gezamenlijke aangifte indient, moeten u en uw partner zich allebei (om beurt) inloggen, de aangifte openen en klikken op ‘Verzenden’.” | aang: “Si vous introduisez une déclaration commune, vous et votre partenaire devez chacun vous identifier (à tour de rôle), ouvrir la déclaration et cliquer sur « Envoyer ».” |
| RSZ distinguishes individual and joint assessment | bb: “belastingplichtigen voor wie een gemeenschappelijke aanslag wordt gevestigd” | bb: “les contribuables pour lesquels une imposition commune est établie” |

## Term: Personen ten laste / Personnes à charge

Pages: `web/nl/woordenlijst/personen-ten-laste/`, `web/fr/lexique/personnes-a-charge/`

| Claim | NL source and quote | FR source and quote |
|---|---|---|
| Child or other person can be dependant under conditions; benefit = increase of exempt amount | ptl: “U hebt dan recht op een belastingvoordeel, namelijk een verhoging van uw belastingvrije som.” | ptl: “Vous avez alors droit à un avantage fiscal, à savoir une majoration de la quotité du revenu exemptée d’impôt.” |
| Net means condition | ptl: “Eén van deze voorwaarden is dat de nettobestaansmiddelen van de persoon die u ten laste neemt een bepaald bedrag niet mogen overschrijden.” | ptl: “Une de ces conditions est que les ressources nettes de la personne que vous prenez à charge ne doivent pas dépasser un certain montant.” |
| Children vs other persons | ptl: “We maken een onderscheid tussen ‘ kinderen ten laste ’ en ‘ andere personen dan kinderen ten laste ’.” | ptl: “Nous faisons une différence entre les « enfants à charge » et les « personnes à charge autres que des enfants ».” |
| Partner never dependant | ptl: “Uw partner (echtgenoot, echtgenote, partner waarmee u wettelijk of feitelijk samenwoont) kan nooit een ‘persoon ten laste’ zijn voor u.” | ptl: “Votre partenaire (conjoint, conjointe, partenaire avec qui vous cohabitez légalement ou de fait) ne peut jamais être à votre charge.” |
| Severe disability extra increase | ptl: “hebt u mogelijk recht op een bijkomende verhoging van uw belastingvrije som als u dit aangeeft in uw aangifte” | ptl: “il est possible que vous ayez droit à une majoration supplémentaire de la quotité du revenu exemptée d’impôt si vous le déclarez dans votre déclaration” |
| Separately taxed: common children by one only | hw: “kunnen gemeenschappelijke kinderen slechts door één van u beiden ten laste worden genomen” | hw: “ils ne pourront être pris à charge que par l’un d’entre vous” |

## Term: Arbeiders en bedienden (108 %) / Ouvriers et employés (108 %)

Pages: `web/nl/woordenlijst/arbeiders-en-bedienden/`, `web/fr/lexique/ouvriers-et-employes/`

| Claim | NL source and quote | FR source and quote |
|---|---|---|
| +8 % for manual workers in private holiday scheme | contrib: “Voor handarbeiders en daarmee gelijkgestelden die onder het privé-vakantiestelsel vallen, worden de socialezekerheidsbijdragen berekend op het brutoloon verhoogd met 8%.” | contrib: “Pour les travailleurs manuels et assimilés qui relèvent du régime de vacances du secteur privé, les cotisations de sécurité sociale sont calculées sur la rémunération brute majorée de 8 %.” |
| Holiday pay from RJV or holiday fund; no wage from employer for legal holidays | contrib: “De reden is dat zij hun vakantiegeld niet van hun werkgever ontvangen, maar van de Rijksdienst voor Jaarlijkse Vakantie of een vakantiefonds . Zij ontvangen van hun werkgever bijgevolg geen loon voor de wettelijke vakantiedagen (enkel vakantiegeld).” | contrib: “Ceci résulte du fait qu'ils reçoivent leur pécule de vacances non pas de leur employeur, mais de l'Office national des Vacances annuelles ou d'une autre caisse de vacances .” |
| Contributions on single holiday pay paid indirectly | contrib: “Door de verhoging van de berekeningsbasis met 8% worden de werknemers- en werkgeversbijdragen op het enkel vakantiegeld onrechtstreeks betaald, samen met het gewone loon.” | contrib: “En majorant la base de calcul de 8 %, les cotisations personnelles et patronales dues sur le pécule simple de vacances sont payées indirectement, en même temps que la rémunération ordinaire.” |
| Artists also | contrib: “behoren ook de artiesten of de kunstenaars die tewerkgesteld zijn door werkgevers die onder het toepassingsgebied vallen van de gecoördineerde wetten van 28 juni 1971 betreffende de jaarlijkse vakantie van de werknemers” | contrib: “figurent les artistes occupés par les employeurs qui, en matière de vacances annuelles, relèvent des lois coordonnées le 28 juin 1971 relatives aux vacances annuelles des travailleurs salariés” |
| Werkbonus definitions | wb: “Onder 'Bedienden' moet worden verstaan: de werknemers die moeten worden aangegeven aan 100 %, dus ook bijvoorbeeld arbeiders in de openbare sector.” | wb: “Par 'employés', on entend les travailleurs qui doivent être déclarés à 100 %, donc aussi, par exemple, les ouvriers occupés par les services publics.” |
| Special contribution base 108 % manual workers | bb: “aan 108 % voor de handarbeiders” | bb: “portée à 108 % pour les travailleurs manuels” |

## Term: Enkel vakantiegeld / Pécule simple de vacances

Pages: `web/nl/woordenlijst/enkel-vakantiegeld/`, `web/fr/lexique/pecule-simple-de-vacances/`

| Claim | NL source and quote | FR source and quote |
|---|---|---|
| Definition single holiday pay employee; employer keeps paying | vak: “Bij een bediende is het enkel vakantiegeld het gedeelte van het vakantiegeld dat overeenstemt met het normale loon voor de wettelijke vakantiedagen. De werkgever betaalt deze dagen gewoon door.” | vak: “Pour un employé, le pécule simple de vacances est la partie du pécule de vacances qui correspond à la rémunération normale des journées de vacances légales. L'employeur paye ces jours comme d'habitude.” |
| Subject to contributions | vak: “Dit gedeelte van het vakantiegeld beantwoordt aan het loonbegrip waarop socialezekerheidsbijdragen verschuldigd zijn.” | vak: “Cette partie du pécule de vacances répond à la notion de rémunération passible du calcul des cotisations de sécurité sociale.” |
| Manual workers: +8 %, paid by RJV | vak: “Het loon voor hun vakantiedagen wordt niet door de werkgever betaald op het moment dat zij vakantie nemen, maar door de Rijksdienst voor Jaarlijkse Vakantie (RJV).” | vak: “La rémunération de leurs jours de vacances n'est pas payée par l'employeur au moment où ils prennent leurs vacances, mais par l'Office National des Vacances Annuelles (ONVA).” |
| Forfaitair and indirect | vak: “Voor de handarbeiders worden de bijdragen op het enkel vakantiegeld forfaitair en indirect berekend door bij de aangifte aan de RSZ, alle lonen van deze werknemers te verhogen met 8%.” | vak: “les cotisations dues sur le pécule simple de vacances sont calculées d'une manière forfaitaire et indirecte en majorant, par le biais de la déclaration destinée à l'ONSS, la rémunération de ces travailleurs de 8 %” |
| Referral: FOD WASO for employees, RJV for workers | vak: “Voor informatie over het vakantiegeld van een arbeider , verwijzen we naar de Rijksdienst voor Jaarlijkse Vakantie.” | vak: “Pour des informations sur le pécule de vacances d'un ouvrier , nous renvoyons vers l' Office National des Vacances Annuelles .” |
| FOD WASO for employees | vak: “Inlichtingen betreffende het vakantiegeld dat verschuldigd is aan een bediende kan u verkrijgen bij één van de externe directies van het Toezicht op de Sociale Wetten van de FOD Werkgelegenheid, Arbeid en Sociaal Overleg (WASO).” | vak: “Vous pouvez recevoir des informations concernant le pécule de vacances qui est dû à un employé auprès d'une des directions extérieures du Contrôle des lois sociales du SPF Emploi, Travail et Concertation sociale.” |

## Term: Dubbel vakantiegeld / Double pécule de vacances

Pages: `web/nl/woordenlijst/dubbel-vakantiegeld/`, `web/fr/lexique/double-pecule-de-vacances/`

| Claim | NL source and quote | FR source and quote |
|---|---|---|
| Definition double holiday pay; no SS contributions; special employee contribution | vak: “Dubbel vakantiegeld is het gedeelte van het vakantiegeld waarop de werknemer recht heeft krachtens de gecoördineerde wetten op de jaarlijkse vakantie der loonarbeiders en dat niet overeenstemt met het gewone loon voor de vakantiedagen. Op dit gedeelte worden geen socialezekerheidsbijdragen berekend. Wel is hierop een bijzondere werknemersbijdrage verschuldigd.” | vak: “Le double pécule de vacances est la partie du pécule de vacances à laquelle le travailleur a droit en vertu des lois coordonnées relatives aux vacances annuelles des travailleurs salariés et qui ne correspond pas à la rémunération normale des jours de vacances. Sur cette partie du pécule de vacances, les cotisations de sécurité sociale ne sont pas dues. Cependant, une retenue spéciale à charge du travailleur doit être prélevée sur celle-ci.” |
| Rate identical to employee contributions 13,07 % | dvg: “is het percentage van de inhouding identiek aan dat van de door de werknemers verschuldigde socialezekerheidsbijdragen (13,07%)” | dvg: “le taux de cette retenue est identique à celui des cotisations personnelles de sécurité sociale (13,07 %)” |
| Not on part from 3rd day of 4th week | dvg: “De inhouding moet niet gebeuren op het gedeelte van het wettelijk dubbel vakantiegeld dat overeenstemt met het loon vanaf de derde dag van de vierde vakantieweek.” | dvg: “La partie du double pécule de vacances légal correspondant à la rémunération à partir du troisième jour de la quatrième semaine de vacances ne doit pas être soumise à cette retenue.” |
| All workers under private holiday legislation | dvg: “Alle werknemers onderworpen aan de wetgeving inzake de jaarlijkse vakantie van de privésector, zijn deze bijdrage verschuldigd.” | dvg: “Tous les travailleurs soumis à la législation relative aux vacances annuelles du secteur privé sont redevables de cette cotisation.” |
| Manual workers: holiday fund / RJV withhold | dvg: “Voor de handarbeiders van een private werkgever wordt het bedrag van het vakantiegeld berekend en gestort door het vakantiefonds van de sector of, bij gebrek daaraan, door de RJV. Het zijn deze instellingen die de inhouding verrichten en doorstorten aan de RSZ.” | dvg: “Ce sont ces organismes qui prélèveront la retenue et la verseront à l'ONSS” |
| Not counted for special contribution band | bb: “Aangezien het dubbel vakantiegeld geen loon is voor de berekening van de gewone socialezekerheidsbijdragen, komt het niet in aanmerking om uit te maken in welke schijf van de bijzondere bijdrage de werknemer valt.” | bb: “elle ne doit pas être prise en considération pour déterminer dans quelle tranche se situe la rémunération trimestrielle du travailleur” |

## Term: Eindejaarspremie / Prime de fin d’année

Pages: `web/nl/woordenlijst/eindejaarspremie/`, `web/fr/lexique/prime-de-fin-d-annee/`

| Claim | NL source and quote | FR source and quote |
|---|---|---|
| Code 2: premiums independent of days worked, subject to SS; example end-of-year bonus | code: “Premies en gelijkaardige voordelen die worden toegekend onafhankelijk van het aantal effectief gewerkte dagen tijdens het aangiftekwartaal . Het gaat om voordelen waarop SZ-bijdragen verschuldigd zijn” | code: “Les primes et avantages similaires accordés indépendamment du nombre de journées de travail effectivement prestées durant le trimestre de déclaration . Sont visés, les avantages qui sont passibles du calcul des cotisations de sécurité sociale” |
| Example eindejaarspremies | code: “eindejaarspremies;” | code: “les primes de fin d'année ;” |
| Premiums are wage | loon: “de gratificaties, premies, vergoedingen van elke aard, aandelen in de winst en alle andere voordelen , toegekend als tegenprestatie van de arbeid of ingevolge een overeenkomst, een reglement, een gebruik, een eenzijdige verbintenis of een statuut;” | loon: “les gratifications” |
| Paid by fund for subsistence security (example) | loon: “vb. de eindejaarspremie wordt door een fonds voor bestaanszekerheid uitbetaald” | loon: “les primes de fin d'année versées par un fonds de sécurité d'existence” |
| Payment frequency 1 vs 12 | freq: “Zo moet een eindejaarspremie die in twaalf maandelijkse betalingen wordt uitbetaald, aangegeven worden met betalingsfrequentie "1", indien ze in één keer aan het eind van het jaar wordt betaald, is de betalingsfrequentie "12".” | freq: “la prime de fin d'année qui fait l'objet de 12 versements mensuels, devra être déclarée sous la fréquence de paiement "1". Si elle est payée en une fois à la fin de l'année, elle se verra attribuer l'indice de fréquence "12".” |
| Werkbonus: excluded from S up to S | wb: “de eindejaarspremies (13 de maand, attractiviteitspremie ziekenhuizen, ...) tot beloop van het bedrag van het refertemaandloon (S) dat in aanmerking wordt genomen om de vermindering te berekenen voor de maand waarin die eindejaarspremie normaal wordt uitbetaald” | wb: “de la prime de fin d'année (13 ème mois, prime d'attractivité hôpitaux, ...) à concurrence du salaire mensuel de référence (S) pris en considération pour le calcul de la réduction relative au mois au cours duquel cette prime de fin d'année est normalement payée” |

## Term: Loonfiche (fiscale fiche 281.10) / Fiche de salaire (fiche fiscale 281.10)

Pages: `web/nl/woordenlijst/loonfiche/`, `web/fr/lexique/fiche-de-salaire/`

| Claim | NL source and quote | FR source and quote |
|---|---|---|
| Fiche between Feb and April of following year | ber: “zal u tussen begin februari en eind april van het volgende jaar, een fiche bezorgen met de inkomsten die u moet aangeven” | ber: “Entre début février et fin avril de l’année suivant celle de l’obtention du revenu, l’organisme qui paie votre rémunération ou votre revenu de remplacement vous enverra une fiche avec les revenus que vous devez déclarer.” |
| Benefits in kind on fiche 281.10 or 281.20 (FR-only page) | fiche: “Les avantages de toute nature attribués à l’employé ou au dirigeant d’entreprise constituent des revenus imposables qui doivent être mentionnés sur la fiche fiscale 281.10 ou 281.20.” | fiche: “Les avantages de toute nature attribués à l’employé ou au dirigeant d’entreprise constituent des revenus imposables qui doivent être mentionnés sur la fiche fiscale 281.10 ou 281.20.” |
| Special contribution total on fiscal fiche | bb: “Het totale bedrag van de bijzondere bijdrage vermeldt u op de fiscale fiche van de werknemer.” | bb: “Le montant total retenu de la cotisation spéciale relative à l'exercice fiscal sera indiqué sur la fiche à délivrer au travailleur en vertu de la législation fiscale.” |
| Employer sends fiches electronically; prefilled; foreign income not | ber: “Als u MyMinfin (Tax-on-web) gebruikt, zullen uw Belgische inkomsten in principe al vooraf ingevuld zijn. Uw werkgever heeft uw loonfiches immers ook op elektronische manier aan de administratie bezorgd.” | ber: “Si vous utilisez MyMinfin (Tax-on-web), vos revenus belges seront déjà pré-remplis. Votre employeur a en effet transmis par voie électronique vos fiches de salaire à l’administration.” |
| Foreign income must be added | ber: “Uw buitenlandse beroepsinkomen worden echter niet automatisch vooraf ingevuld” | ber: “Vos revenus professionnels étrangers ne sont cependant pas automatiquement pré-remplis” |
| Access to loonfiches in MyMinfin | aang: “U kunt ook toegang krijgen tot uw documenten zoals loonfiches” | aang: “Vous pouvez aussi accéder à vos documents tels que des fiches de salaire” |
| Keep 7 years | na: “Gedurende 7 jaar moet u alle documenten bewaren die u gebruikte om u uw belastingaangifte in te vullen” | na: “Vous devez conserver pendant 7 ans tous les documents utilisés pour remplir votre déclaration d’impôt” |

## Term: Belastingaangifte / Déclaration d’impôt

Pages: `web/nl/woordenlijst/belastingaangifte/`, `web/fr/lexique/declaration-d-impot/`

| Claim | NL source and quote | FR source and quote |
|---|---|---|
| In principle every year | aang: “U moet in principe elk jaar een belastingaangifte indienen.” | aang: “Vous devez, en principe, rentrer une déclaration d’impôt chaque année.” |
| Simple situation: proposal; no declaration needed in principle; otherwise declaration | aang: “Als u een voorstel van vereenvoudigde aangifte hebt ontvangen, moet u in principe geen belastingaangifte meer indienen.” | aang: “Si vous avez reçu une proposition de déclaration simplifiée, vous ne devez, en principe, plus rentrer de déclaration.” |
| No proposal: must file | aang: “Als u geen voorstel van vereenvoudigde aangifte ontvangt, moet u een aangifte indienen.” | aang: “Si vous ne recevez pas de proposition de déclaration simplifiée, vous devez rentrer une déclaration.” |
| Online largely prefilled | aang: “Online zijn uw gegevens grotendeels vooraf ingevuld.” | aang: “En ligne, vos données sont pré-remplies en grande partie” |
| Deadlines differ by method and specific income | aang: “16 november 2026 : als u MyMinfin (Tax-on-web) gebruikt om uw aangifte in te dienen en u specifieke inkomsten aangeeft” | aang: “16 novembre 2026 : si vous utilisez MyMinfin (Tax-on-web) pour rentrer votre déclaration et que vous déclarez des revenus spécifiques” |
| Late or no declaration: fine/increase; ex officio assessment | aang: “Wie zijn belastingaangifte te laat (of helemaal niet) indient, riskeert een boete en/of een belastingverhoging.” | aang: “Les personnes qui rentrent leur déclaration en retard (ou pas du tout) risquent une amende et/ou un accroissement d’impôt.” |
| Ex officio | aang: “Bovendien kunnen we gebruik maken van de procedure ‘aanslag van ambtswege’.” | aang: “De plus, nous pouvons recourir à la procédure de « taxation d'office »” |
| Processing and notice | na: “We verwerken uw aangifte om uw belasting te berekenen en sturen u uw aanslagbiljet .” | na: “nous traitons votre déclaration afin de calculer votre impôt et vous envoyer votre avertissement-extrait de rôle” |
| Online correction once | na: “U (of uw mandataris) kunt de aangifte eenmaal verbeteren via MyMinfin als die online werd ingediend door:” | na: “pouvez corriger la déclaration une seule fois via MyMinfin” |
| Later: contact competent service | na: “Neem zo snel mogelijk contact op met uw bevoegde dienst om uw vergissing recht te zetten.” | na: “Prenez rapidement contact avec votre service compétent pour corriger votre erreur.” |

## Term: Voorstel van vereenvoudigde aangifte / Proposition de déclaration simplifiée

Pages: `web/nl/woordenlijst/voorstel-vereenvoudigde-aangifte/`, `web/fr/lexique/proposition-de-declaration-simplifiee/`

| Claim | NL source and quote | FR source and quote |
|---|---|---|
| Simple situation: proposal; in principle no declaration | vva: “Als uw fiscale situatie eerder eenvoudig is, waarbij u slechts bepaalde inkomsten en elementen moet aangeven, ontvangt u waarschijnlijk een ‘voorstel van vereenvoudigde aangifte’.” | vva: “Si vous avez reçu une proposition de déclaration simplifiée, vous ne devez en principe plus rentrer de déclaration d’impôt.” |
| Simulation and provisional estimate; final may differ | vva: “In dat voorstel vindt u een simulatie van de berekening van uw belastingen op basis van de fiscale gegevens die we kennen. U vindt er een voorlopige raming van het bedrag dat u moet betalen of dat u terugkrijgt. Merk op dat de definitieve berekening hier nog van kan afwijken.” | vva: “Cette proposition reprend une simulation du calcul de votre impôt, basé sur les données fiscales dont nous avons connaissance. Vous y trouverez ainsi une estimation provisoire du montant d’impôt à payer ou à recevoir. Veuillez noter que le calcul définitif peut encore différer.” |
| Correct: nothing to do / confirm | vva: “Als uw gegevens juist en volledig zijn, hoeft u niets te doen. U moet niets bevestigen of verzenden.” | vva: “Si vos données sont complètes et correctes, vous ne devez rien faire.” |
| Incorrect: modify | vva: “Als de gegevens van dit voorstel onjuist of onvolledig zijn, dan moet u het voorstel wijzigen.” | vva: “Vous devez alors modifier la proposition.” |
| Obliged to file in some cases (foreign account) | vva: “U bent verplicht een aangifte in te dienen wanneer u, uw echtgenoot, wettelijk samenwonende partner of één van uw niet-ontvoogde minderjarige kinderen op enig moment in 2025:” | vva: “Vous êtes tenu(e) de rentrer une déclaration si, à tout moment en 2025, vous, votre conjoint, votre partenaire cohabitant légal ou l'un de vos enfants mineurs non émancipés :” |
| Who receives a proposal | vva: “een loon, een pensioen, een werkloosheidsuitkering of een ziekte- of invaliditeitsuitkering ontvangt, en” | vva: “vous percevez un salaire, une pension, des allocations de chôm” |

## Term: Aanslagbiljet / Avertissement-extrait de rôle

Pages: `web/nl/woordenlijst/aanslagbiljet/`, `web/fr/lexique/avertissement-extrait-de-role/`

| Claim | NL source and quote | FR source and quote |
|---|---|---|
| Calculated after processing; amount to pay or receive | asb: “Daarna ontvangt u een ‘aanslagbiljet’. Daarin staat het bedrag dat u moet betalen of dat u terugkrijgt.” | asb: “Vous recevrez ensuite un « avertissement-extrait de rôle ». Ce document indique le montant que vous devez payer ou qui vous sera remboursé.” |
| Definitive calculation | asb: “De definitieve berekening wordt gemaakt tijdens de verwerking van uw aangifte” | asb: “Le calcul définitif se fait lors du traitement de votre déclaration” |
| Always received, also with proposal and zero balance | asb: “ook als u een voorstel van vereenvoudigde aangifte ontving en hier niets aan aangepast hebt. U ontvangt ook een aanslagbiljet als het saldo nul is” | asb: “même si vous avez reçu une proposition de déclaration simplifiée et que vous ne l’avez pas modifiée. Vous recevez également un avertissement-extrait de rôle si le solde est nul” |
| Sent between August and end of June | asb: “We versturen de aanslagbiljetten tussen augustus van het jaar waarin u de aangifte indient en eind juni van het jaar daarna .” | asb: “Les avertissements-extrait de rôle sont envoyés entre août de l’année de dépôt de la déclaration et fin juin de l’année suivante .” |
| MyMinfin Mijn documenten | asb: “U kunt uw aanslagbiljet raadplegen op MyMinfin (onder ‘Mijn Documenten’).” | asb: “Vous pouvez consulter votre avertissement-extrait de rôle sur MyMinfin (sous « Mes documents »).” |
| Provisional calc may miss municipal rate, special contribution | asb: “bijvoorbeeld: het tarief van de gemeentebelasting, is er al dan niet een bijzondere bijdrage voor de sociale zekerheid ingehouden …” | asb: “par exemple, le taux de la taxe communale, la retenue ou non d’une cotisation spéciale pour la sécurité sociale, etc.” |
| Only the notice amount counts | asb: “Het terug te betalen of terug te krijgen bedrag vermeld in uw aanslagbiljet is het enige waar u rekening mee moet houden.” | asb: “Vous devez uniquement tenir compte du montant à payer ou remboursé indiqué dans votre avertissement-extrait de rôle.” |
| Objection within 1 year; online | asb: “U kunt een bezwaarschrift indienen binnen 1 jaar na het versturen van het aanslagbiljet. U kunt dit zelf online via MyMinfin indienen.” | asb: “Vous pouvez introduire une réclamation dans un délai d'un an après l’envoi de votre avertissement-extrait de rôle. Vous pouvez le faire vous-même sur MyMinfin .” |
| Simple errors: contact office | asb: “Contacteer onmiddellijk uw belastingkantoor voor eenvoudige fouten of vergissingen” | asb: “Prenez immédiatement contact avec votre bureau de taxation en cas d’erreurs ou d’omissions simples” |

## Term: MyMinfin (Tax-on-web) / MyMinfin (Tax-on-web)

Pages: `web/nl/woordenlijst/myminfin/`, `web/fr/lexique/myminfin/`

| Claim | NL source and quote | FR source and quote |
|---|---|---|
| Declaration/proposal via MyMinfin (Tax-on-web) | aang: “U kunt nu toegang krijgen tot uw belastingaangifte of uw voorstel van vereenvoudigde aangifte via MyMinfin (Tax-on-web) .” | aang: “de préférence via MyMinfin (Tax-on-web)” |
| Prefilled with online help | aang: “Online zijn uw gegevens grotendeels vooraf ingevuld. Er is online hulp voorzien om uw gegevens te wijzigen of aan te vullen.” | aang: “En ligne, vos données sont pré-remplies en grande partie” |
| Access to documents | aang: “U kunt ook toegang krijgen tot uw documenten zoals loonfiches, attesten voor giften of kinderopvang, fiches van uw bank ...” | aang: “Vous pouvez aussi accéder à vos documents tels que des fiches de salaire, des attestations pour dons ou pour garde d’enfants, des fiches de votre banque, etc.” |
| Status of processing | na: “U kunt de status van de verwerking van uw aangifte volgen in MyMinfin .” | na: “Vous pouvez suivre le statut de traitement de votre déclaration dans MyMinfin .” |
| Notice in Mijn documenten; objection online | asb: “U kunt uw aanslagbiljet raadplegen op MyMinfin (onder ‘Mijn Documenten’).” | asb: “Vous pouvez consulter votre avertissement-extrait de rôle sur MyMinfin (sous « Mes documents »).” |
| Login eID or itsme | aang: “U kunt dan inloggen op MyMinfin met itsme.” | aang: “Vous pouvez également activer votre compte itsme avec votre carte bancaire et son lecteur de carte.” |
| Tax-Calc anonymous | aang: “Gebruik onze toepassing Tax-Calc om een schatting van uw belastingbedrag te krijgen. Het gebruik van Tax-Calc is anoniem en vereist geen login.” | aang: “Utilisez notre application Tax-Calc pour obtenir une estimation du montant de votre impôt. L’utilisation de Tax-Calc est anonyme et ne demande pas d’identification.” |

## Term: DmfA / DmfA

Pages: `web/nl/woordenlijst/dmfa/`, `web/fr/lexique/dmfa/`

| Claim | NL source and quote | FR source and quote |
|---|---|---|
| Within the month after the quarter; dates | dmfa: “Binnen de maand na het kwartaal waarop de aangifte betrekking heeft stuurt de werkgever (of zijn mandataris) de aangifte door aan de RSZ:” | dmfa: “L'employeur (ou son mandataire) doit rentrer la déclaration à l'ONSS dans le mois qui suit le trimestre auquel elle se rapporte:” |
| Dates 30 april 31 juli 31 oktober 31 januari | dmfa: “30 april 31 juli 31 oktober 31 januari” | dmfa: “30 avril 31 juillet 31 octobre 31 janvier” |
| Purpose; data used by benefit institutions | dmfa: “De aangifte dient om een correcte berekening van de verschuldigde bijdragen te staven. De aangifte bevat tevens een aantal gegevens die gebruikt zullen worden door de instellingen die belast zijn met de betaling van de prestaties inzake sociale zekerheid” | dmfa: “La déclaration sert à établir un calcul correct des cotisations dues. Cette déclaration contient également un nombre de données qui seront utilisées par les organismes chargés de payer des prestations de sécurité sociale” |
| Internet vs file transfer | dmfa: “Werkgevers die een klein aantal mensen tewerkstellen kunnen de aangifte via internet doen.” | dmfa: “Les employeurs qui occupent un nombre limité de travailleurs peuvent faire la déclaration via internet.” |
| Instructions explain how to fill in DmfA (quarterly versions) | dmfaintro: “De werkgevers vinden hier de nodige uitleg om de DmfA in te vullen.” | dmfaintro: “Les employeurs trouveront ici les explications leur permettant de compléter la DmfA.” |
| Version label 2026/3 | dmfaintro: “Administratieve instructies RSZ - 2026/3” | dmfaintro: “Instructions administratives ONSS - 2026/3” |

## Term: Dimona / Dimona

Pages: `web/nl/woordenlijst/dimona/`, `web/fr/lexique/dimona/`

| Claim | NL source and quote | FR source and quote |
|---|---|---|
| All employers must communicate hires and departures electronically (KB 5-11-2002) | dimona: “Alle werkgevers van zowel de privé- als de openbare sector zijn verplicht alle aanwervingen en alle uitdiensttredingen van hun werknemers elektronisch mee te delen aan de RSZ (koninklijk besluit van 5 november 2002).” | dimona: “Tous les employeurs tant du secteur public que du secteur privé, sont obligés de communiquer électroniquement les entrées et sorties de leur personnel à l'ONSS ( arrêté royal du 5 novembre 2002).” |
| Signals start and end | dimona: “De aangifte signaleert onmiddellijk aan de instellingen van sociale zekerheid, het begin en het einde van een arbeidsrelatie tussen werknemer en werkgever.” | dimona: “Elle vise à signaler immédiatement aux institutions de sécurité sociale le début et la fin d’une relation de travail entre le travailleur et l’employeur.” |
| Sanctions and solidarity contribution | dimona: “Bij het niet respecteren van deze verplichting, voorziet artikel 181 van het Sociaal Strafwetboek de toepassing van strafsancties.” | dimona: “En cas de non respect de cette obligation de déclaration, des sanctions pénales sont prévues par l'article 181 du Code pénal social.” |
| Solidarity contribution | dimona: “Bovendien zal de werkgever in geval van nalatigheid een solidariteitsbijdrage aan de RSZ verschuldigd zijn.” | dimona: “De plus, en cas d'omission de déclaration, l'employeur sera redevable à l'ONSS d'une cotisation de solidarité .” |
| DmfA establishes contributions due (quarterly) | dmfa: “De aangifte dient om een correcte berekening van de verschuldigde bijdragen te staven.” | dmfa: “La déclaration sert à établir un calcul correct des cotisations dues.” |

## Guide: Van bruto naar netto: de stappen / Du brut au net : les étapes

Pages: `web/nl/gidsen/van-bruto-naar-netto/`, `web/fr/guides/du-brut-au-net/`

| Claim | NL source and quote | FR source and quote |
|---|---|---|
| Wage is the base for contributions; +8 % manual workers | loon: “het brutoloon van de werknemer de basis is waarop de bijdragen worden berekend” | contrib: “la rémunération brute majorée de 8 %” |
| 13,07 % normal employee contribution, werkbonus deducted at payment | wb: “De werkgever brengt het bedrag in mindering van de normale werknemersbijdragen (13,07% van het brutoloon) bij de betaling van het loon.” | wb: “L'employeur déduit ce montant des cotisations personnelles normalement dues (13,07 %) au moment du paiement du salaire.” |
| Rate is a sum of schemes | contrib: “telt u de percentages op van de regelingen die voor de werknemer van toepassing zijn” | contrib: “il faut additionner les pourcentages des régimes applicables à ce travailleur” |
| Werkbonus decreasing forfait; cap | wb: “De werkbonus (P) mag de verschuldigde persoonlijke socialezekerheidsbijdragen niet overschrijden.” | wb: “Le bonus à l’emploi (P) ne peut pas dépasser les cotisations personnelles de sécurité sociale dues.” |
| Withholding monthly advance | asb: “De bedrijfsvoorheffing wordt elke maand ingehouden op uw loon” | asb: “Le précompte professionnel est retenu chaque mois sur votre salaire” |
| Rules and key formula per year | ppcalc: “Règles 1er janvier 2026 Formule-clé à partir du 1er janvier 2026” | ppcalc: “Règles 1er janvier 2026 Formule-clé à partir du 1er janvier 2026” |
| Special contribution after employee contributions and withholding; quarterly base | bb: “elke inhouding gebeurt na aftrek van de werknemersbijdragen voor sociale zekerheid en na aftrek van de bedrijfsvoorheffing” | bb: “toutes les retenues doivent être effectuées après déduction des cotisations personnelles de sécurité sociale et du précompte professionnel” |
| Special contribution amounts are advances | bb: “De aan de RSZ betaalde bedragen zijn dus voorschotten op de jaarlijks verschuldigde bijdrage.” | bb: “provisions à valoir sur le montant annuel effectivement dû” |
| Notice shows amount to pay/refund | asb: “Daarin staat het bedrag dat u moet betalen of dat u terugkrijgt.” | asb: “Ce document indique le montant que vous devez payer ou qui vous sera remboursé.” |

## Guide: De werkbonus uitgelegd / Le bonus à l’emploi expliqué

Pages: `web/nl/gidsen/werkbonus-uitgelegd/`, `web/fr/guides/bonus-a-l-emploi-explique/`

| Claim | NL source and quote | FR source and quote |
|---|---|---|
| Concerned workers: 13,07 % | wb: “Het gaat om de werknemers van de privésector en van de openbare sector die een werknemersbijdrage van 13,07 % verschuldigd zijn.” | wb: “Il s'agit des travailleurs du secteur privé et du secteur public qui sont redevables d'une cotisation personnelle de 13,07 %.” |
| Exclusions private sector | wb: “de leerlingen, stagiairs en de andere jongeren tijdens de periode van gedeeltelijke onderwerping aan de sociale zekerheid” | wb: “les apprentis, stagiaires et les autres jeunes pendant la période d'assujettissement limité à la sécurité sociale” |
| Doctors in training excluded | wb: “de geneesheren in opleiding tot specialist;” | wb: “les médecins en formation de médecin spécialiste;” |
| Public sector statutory mostly not; contractual yes | wb: “Voor de openbare sector komen de meeste statutaire personeelsleden evenmin voor de vermindering in aanmerking. Contractuele werknemers daarentegen komen wél in aanmerking” | wb: “la plupart des agents statutaires n'entrent pas en ligne de compte pour la réduction. Par contre, les travailleurs contractuels entrent bien en ligne de compte” |
| Three steps | wb: “Deze berekening omvat drie stappen.” | wb: “Le calcul se fait en trois étapes:” |
| Reference wage from gross wage of calendar month | wb: “Het refertemaandloon (S) kunt u rechtstreeks afleiden uit het brutoloon (W) van de werknemer dat op de kalendermaand betrekking heeft.” | wb: “Le salaire mensuel de référence (S) correspond au salaire brut (W) du travailleur se rapportant au mois civil considéré.” |
| Two components since 1-4-2024 | wb: “Vanaf 1 april 2024 wordt de berekening van de werkbonus opgesplitst in 2 componenten om een aangepaste berekening van de fiscale werkbonus mogelijk te maken.” | wb: “deux composantes pour rendre possible un calcul adapté du bonus à l'emploi fiscal” |
| Capping B then A; annual cap | wb: “De eventuele aftopping bij een tekort aan werknemersbijdragen gebeurt op Luik B en vervolgens op Luik A.” | wb: “L'éventuel écrêtement en raison d'une insuffisance de cotisations personnelles s'effectue sur le calcul basé sur le volet B et ensuite sur le calcul basé sur le volet A.” |
| Periods 2026 (July–August, from 1 September) | wb: “Loonschijven en verminderingsbedragen die gelden voor juli en augustus 2026 :” | wb: “Tranches et montants d'application pour juillet et août 2026 :” |
| From 1 September 2026 | wb: “De volgende bedragen gelden vanaf 1 september 2026 .” | wb: “Les montants suivants s'appliquent à partir du 1 er septembre 2026 .” |
| End-of-year bonus excluded from S up to S | wb: “de eindejaarspremies (13 de maand, attractiviteitspremie ziekenhuizen, ...) tot beloop van het bedrag van het refertemaandloon (S)” | wb: “de la prime de fin d'année (13 ème mois, prime d'attractivité hôpitaux, ...) à concurrence du salaire mensuel de référence (S)” |

Note: January–February and from 1 March / 1 April tables are in the 2026/1 and 2026/2 versions (see docs/sources/werkbonus_2026_rsz.md, retrieved 2026-11-24). The 2026/4 version still returns the RSZ 404 page on 2026-11-26, so no Q4 period is named on the page.

## Guide: Vakantiegeld en eindejaarspremie / Pécule de vacances et prime de fin d’année

Pages: `web/nl/gidsen/vakantiegeld-en-eindejaarspremie/`, `web/fr/guides/pecule-de-vacances-et-prime-de-fin-d-annee/`

| Claim | NL source and quote | FR source and quote |
|---|---|---|
| Single holiday pay employee; subject to contributions | vak: “Dit gedeelte van het vakantiegeld beantwoordt aan het loonbegrip waarop socialezekerheidsbijdragen verschuldigd zijn.” | vak: “Cette partie du pécule de vacances répond à la notion de rémunération passible du calcul des cotisations de sécurité sociale.” |
| Workers paid by RJV/fund; +8 % | contrib: “De reden is dat zij hun vakantiegeld niet van hun werkgever ontvangen, maar van de Rijksdienst voor Jaarlijkse Vakantie of een vakantiefonds .” | contrib: “Ceci résulte du fait qu'ils reçoivent leur pécule de vacances non pas de leur employeur, mais de l'Office national des Vacances annuelles ou d'une autre caisse de vacances .” |
| Double holiday pay: no ordinary contributions, special 13,07 % | dvg: “is het percentage van de inhouding identiek aan dat van de door de werknemers verschuldigde socialezekerheidsbijdragen (13,07%)” | dvg: “le taux de cette retenue est identique à celui des cotisations personnelles de sécurité sociale (13,07 %)” |
| Holiday fund/RJV withholds for manual workers | dvg: “Het zijn deze instellingen die de inhouding verrichten en doorstorten aan de RSZ.” | dvg: “Ce sont ces organismes qui prélèveront la retenue et la verseront à l'ONSS” |
| Not from 3rd day of 4th week | dvg: “vanaf de derde dag van de vierde vakantieweek” | dvg: “à partir du troisième jour de la quatrième semaine de vacances” |
| Premiums are wage | loon: “de gratificaties, premies, vergoedingen van elke aard” | loon: “les gratifications” |
| DmfA code 2 example end-of-year bonus | code: “eindejaarspremies;” | code: “les primes de fin d'année ;” |
| Double holiday pay not counted for special contribution band | bb: “komt het niet in aanmerking om uit te maken in welke schijf van de bijzondere bijdrage de werknemer valt” | bb: “elle ne doit pas être prise en considération pour déterminer dans quelle tranche” |
| End-of-year bonus and werkbonus S | wb: “tot beloop van het bedrag van het refertemaandloon (S)” | wb: “à concurrence du salaire mensuel de référence (S)” |
| Referral FOD WASO / RJV | vak: “Voor informatie over het vakantiegeld van een arbeider , verwijzen we naar de Rijksdienst voor Jaarlijkse Vakantie.” | vak: “Pour des informations sur le pécule de vacances d'un ouvrier , nous renvoyons vers l' Office National des Vacances Annuelles .” |

## Guide: Bedrijfsvoorheffing en personenbelasting / Précompte professionnel et impôt final

Pages: `web/nl/gidsen/bedrijfsvoorheffing-en-personenbelasting/`, `web/fr/guides/precompte-professionnel-et-impot/`

| Claim | NL source and quote | FR source and quote |
|---|---|---|
| Withholding monthly advance | asb: “De bedrijfsvoorheffing wordt elke maand ingehouden op uw loon, uw pensioen … als een soort ‘voorschot’ op het uiteindelijke belastingbedrag.” | asb: “Le précompte professionnel est retenu chaque mois sur votre salaire, votre pension, etc. comme une sorte de « provision » sur le montant de l’impôt final.” |
| Rules, key formula and simulator per year | ppcalc: “Simulateur - Précompte professionnel 2026” | ppcalc: “Simulateur - Précompte professionnel 2026” |
| PIT per income year | statbel: “Deze statistiek wordt per inkomstenjaar opgemaakt.” | statbel: “Cette statistique est établie par l’année de revenus.” |
| Brackets 25–50 %, exempt amount, forfait | tar: “Elke schijf heeft zijn eigen belastingtarief (van 25 % tot 50 %).” | tar: “Chaque tranche a son propre taux d’imposition (de 25 % à 50 %).” |
| Municipal tax collected together, end of notice, no separate assessment | gem: “U krijgt dus geen aparte aanslag voor deze belasting.” | gem: “Vous ne recevrez dès lors jamais une imposition spécifique pour cette taxe.” |
| Provisional calculation may differ | asb: “Het voorstel van vereenvoudigde aangifte en uw online aangifte via MyMinfin geven altijd een voorlopige berekening van uw belasting.” | asb: “La proposition de déclaration simplifiée et votre déclaration en ligne sur MyMinfin indiquent toujours une estimation de votre impôt.” |
| Reasons paying more | asb: “Een of meerdere personen ten laste zijn weggevallen” | asb: “Une ou plusieurs personnes ne sont plus à votre charge” |
| Separate instead of joint | asb: “U bent nu apart belast - en dus niet meer gezamenlijk - door een (feitelijke) scheiding, het overlijden van uw partner” | asb: “Vous êtes maintenant imposé séparément - et donc plus conjointement - en raison d’une séparation (de fait), le décès de votre partenaire” |
| Sending period; no exact date | asb: “Een precieze datum kunnen we niet geven.” | asb: “Nous ne pouvons pas donner de date précise.” |
| Only the notice amount counts | asb: “Het terug te betalen of terug te krijgen bedrag vermeld in uw aanslagbiljet is het enige waar u rekening mee moet houden.” | asb: “Vous devez uniquement tenir compte du montant à payer ou remboursé indiqué dans votre avertissement-extrait de rôle.” |

## Guide: Inkomstenjaar en aanslagjaar / Année de revenus et exercice d’imposition

Pages: `web/nl/gidsen/inkomstenjaar-en-aanslagjaar/`, `web/fr/guides/annee-de-revenus-et-exercice-d-imposition/`

| Claim | NL source and quote | FR source and quote |
|---|---|---|
| Definitions income year / assessment year | statbel: “Aanslagjaar : Het aanslagjaar is het jaar waarin de belastingaangifte ingediend wordt. Dit is het jaar na het kalenderjaar waarin de inkomsten werden behaald (inkomstenjaar).” | statbel: “Exercice fiscal : L'exercice d’imposition est l'année au cours de laquelle la déclaration d'impôts est introduite.” |
| Income year definition | statbel: “Inkomstenjaar : Het inkomstenjaar is het jaar waarvoor de belastingen verschuldigd zijn.” | statbel: “Année des revenus : L'année des revenus est l’année pour laquelle des impôts sont dus.” |
| FOD labels both years; 11.550 euro | tar: “11.550 euro voor inkomstenjaar 2026 (aanslagjaar 2027)” | tar: “11.550 euros pour l'année de revenus 2026 (exercice d’imposition 2027)” |
| Fiche Feb–April following year | ber: “tussen begin februari en eind april van het volgende jaar” | ber: “Entre début février et fin avril de l’année suivant celle de l’obtention du revenu” |
| Notice August to end June | asb: “We versturen de aanslagbiljetten tussen augustus van het jaar waarin u de aangifte indient en eind juni van het jaar daarna .” | asb: “Les avertissements-extrait de rôle sont envoyés entre août de l’année de dépôt de la déclaration et fin juin de l’année suivante .” |
| Situation on 1 January | hw: “Voor aanslagjaar 2026 (inkomsten 2025) is uw situatie op 1 januari 2026 van belang.” | hw: “c'est votre situation au 1 er janvier 2026 qui sera déterminante” |
| Control period from 1 January of assessment year | na: “binnen een termijn die begint te lopen vanaf 1 januari van het aanslagjaar” | na: “dans un délai qui commence à partir du 1 er janvier de l’année de l’exercice d’imposition” |

Note: The FAQ answer on Belastingkaart parameters restates web/nl/methodologie and web/fr/methodologie (site policy, not a fiscal claim).

## Guide: Van loonfiche tot aanslagbiljet / De la fiche à l’avertissement-extrait de rôle

Pages: `web/nl/gidsen/van-loonfiche-tot-aanslagbiljet/`, `web/fr/guides/de-la-fiche-a-l-avertissement-extrait-de-role/`

| Claim | NL source and quote | FR source and quote |
|---|---|---|
| Fiche Feb–April; prefilled | ber: “Uw werkgever heeft uw loonfiches immers ook op elektronische manier aan de administratie bezorgd.” | ber: “Votre employeur a en effet transmis par voie électronique vos fiches de salaire à l’administration.” |
| Proposal: check, nothing to do or modify | vva: “Als de gegevens van dit voorstel correct en volledig zijn, hoeft u niets meer te doen.” | vva: “Vérifiez toujours vos données préremplies” |
| No proposal: declaration | aang: “Als u geen voorstel van vereenvoudigde aangifte ontvangt, moet u een aangifte indienen.” | aang: “Si vous ne recevez pas de proposition de déclaration simplifiée, vous devez rentrer une déclaration.” |
| Preferably via MyMinfin | aang: “bij voorkeur via MyMinfin (Tax-on-web)” | aang: “de préférence via MyMinfin (Tax-on-web)” |
| Status in MyMinfin; request for information; notice of change by registered letter | na: “U ontvangt een ‘bericht van wijziging’ per aangetekende brief.” | na: “Vous recevez un « avis de rectification » par recommandé” |
| Request for information | na: “schriftelijk (= ‘vraag om inlichtingen’)” | na: “Demande de renseignements” |
| Notice always, zero balance; period; Mijn documenten | asb: “U ontvangt ook een aanslagbiljet als het saldo nul is” | asb: “Vous recevez également un avertissement-extrait de rôle si le solde est nul” |
| Objection within 1 year | asb: “U kunt een bezwaarschrift indienen binnen 1 jaar na het versturen van het aanslagbiljet.” | asb: “Vous pouvez introduire une réclamation dans un délai d'un an après l’envoi de votre avertissement-extrait de rôle.” |
| Keep 7 years | na: “Gedurende 7 jaar moet u alle documenten bewaren” | na: “Vous devez conserver pendant 7 ans tous les documents” |
| Late: fine/increase; ex officio | aang: “riskeert een boete en/of een belastingverhoging” | aang: “Les personnes qui rentrent leur déclaration en retard (ou pas du tout) risquent une amende et/ou un accroissement d’impôt.” |
| Joint: both log in and send | aang: “moeten u en uw partner zich allebei (om beurt) inloggen, de aangifte openen en klikken op ‘Verzenden’” | aang: “vous et votre partenaire devez chacun vous identifier (à tour de rôle), ouvrir la déclaration et cliquer sur « Envoyer »” |

## Claims dropped for lack of an accessible official source

- Payslip (loonbrief / fiche de paie) and its legal content: the competent authority (FOD WASO, werk.belgie.be) was not reachable; no term or guide on the payslip.
- Meaning of the acronyms DmfA and Dimona beyond what RSZ states; Dimona's expansion is given only as RSZ writes it on its page (not used on the site).
- Fiscal werkbonus rules, amounts of the forfait for professional expenses, tax brackets per amount, the marital quotient maximum, net-means thresholds for dependants: sourced amounts exist on FOD pages but are left out (no numbers beyond those listed above).
- Which municipality's rate applies (domicile on 1 January): not stated on the FOD page consulted; left out.
- Fiche 281.10 as "the" employee fiche: the FOD page only says benefits in kind of an employee or company director go on fiche 281.10 or 281.20; the site says exactly that.
