# Personenbelasting: wettelijke berekeningsmethode (WIB 92, inkomsten 2026, aanslagjaar 2027)

- **Source:** FOD Financiën / SPF Finances, Fisconet: codified WIB 92 / CIR 92 articles, version "inkomsten 2026" (table of contents `2ebbd3f4-ca47-41f5-8f17-2a243befae75`, "Inhoudstafel - WIB 92 - Inkomsten 2026", lastModified 2026-11-24).
- **Retrieved:** 2026-11-25, with Playwright (Chromium) through the public endpoint `https://www.minfin.fgov.be/myminfin-rest/fisconetPlus/public/document/<guid>`. No CAPTCHA anywhere. Human-readable link: `https://www.minfin.fgov.be/myminfin-web/pages/public/fisconet/document/<guid>`.
- **Transcription:** verbatim from the HTML, whitespace normalised. The Fisconet application notes (first lines) are kept because they give the assessment year from which each wording applies. Values of arts. 130, 131, 132, 134 § 2 and 51 are also in `docs/sources/personenbelasting_2026_fisconet.md` (PR #14); this file documents the **method** used by `R/10_personenbelasting.R` and `web/js/tax-engine.js` (`BKTaxEngine.personenbelasting`).
- **Not used:** finances.belgium.be and ejustice.just.fgov.be (CAPTCHA), any non-official source.
- **Official worked example:** none found. The FOD "Commentaar van artikel 134, WIB 92" (`7ef000fc-1c5f-4226-93cf-f547c7ddcfd1`, FR `c549fb11-41e0-4458-bab4-54cea3d1de37`) and the commentaries on arts. 131–133 (`0adb1d2c-583b-40de-bc9f-4d3dd9a13886`, `e5f9b557-8e02-4ac3-9ef4-8ba254bd7f97`, `2d320463-7ef7-4427-be91-1751b5134f5a`) are documentary overviews (lists of circulars, case law and parliamentary questions) without figures. The tests therefore use a synthetic parameter set ("synthetic, not 2026").

## 0. Documents

| Article | NL GUID | FR GUID |
|---|---|---|
| Art. 2 (§ 3: definitions referring to the BFW) | `2bfeec21-7e5f-4828-a283-cb99c56d41a1` | — |
| Art. 6 | `2f73b26b-e8f3-4f07-a1df-3f626caa2978` | `2db99c69-aa67-4395-a33f-b1c4010bbde7` |
| Art. 23 | `faca8178-20de-45b6-acb6-00769cba1c00` | `86349a7b-0970-494f-9fb5-bf0ed37a5ed9` |
| Art. 49 | `8802b3d4-4453-49cf-a374-e978e4614f43` | `34fb9ab5-38a2-4f93-b73d-0727e67e54d3` |
| Art. 51 | `e2fb1778-ac33-4e91-8e57-e53c0cac384c` | `21dd9b61-2989-4125-a2e0-6142c607eec8` |
| Art. 52 | `e2123748-b2c4-49ab-8b2d-5eacb94fbc34` | `60edb410-72a2-4f9e-b5a4-e42f49c9127c` |
| Art. 126 | `3e4f68bf-5e84-4124-b5dd-482d1e94b4fb` | `b7641b6b-73b2-46fa-b32a-d8db449d3e3d` |
| Art. 130 | `796a4fc5-340e-4c89-a72a-88caa804ca96` | `aff72054-004a-4858-8747-1d70964c8e3d` |
| Art. 131 | `f3c5d665-cac4-4cbd-b714-bd287f791751` | `2fb89ed0-b93e-47d7-816c-85f1ac679b8a` |
| Art. 132 | `caa866c3-8820-4ba4-b5bc-f64ae0cd2869` | `cb45b801-1dc7-4dd4-843f-054fe60e6335` |
| Art. 133 | `0f863e7a-b131-494b-8617-7b62efed5e75` | `08b0136c-7013-43d3-9218-b33d20567ab8` |
| Art. 134 | `20a503a9-4213-4e60-a91c-0ebb907e176a` | `56f7c2a3-94ab-45dd-85d0-2a0c7f6ddebc` |
| Art. 136 | `3ca09601-4bcc-49e4-a061-16749e91a051` | `7e58e502-45e5-489a-81eb-fdc10d958396` |
| Art. 141 | `48e0ad6e-942e-46a1-81e9-cade192b8594` | `6107a54f-bf18-4983-bb88-d125b94e9256` |
| Art. 178/1 | `6af494dc-03b1-4df3-8f7d-e048ef1152a0` | `81b69151-6eaf-467d-94f3-803d76ed0bb3` |
| Art. 289ter | `189ea2a8-c20c-4d4b-b628-97848cb4bef7` | `af20504b-71e6-4daa-89d6-4d3c000c8718` |
| Art. 466 | `81bf3101-a837-4d89-8b97-713e080f00ac` | `aa4241fb-2007-4bf8-aaf7-a5cb46dcb853` |
| Art. 468 | `4d803548-89eb-4ef5-b1a5-12f5751e1313` | `729c5509-dfda-44b2-921a-8f37fffe2cb2` |
| Art. 469 | `2f544d3e-e76c-499d-855e-e9c58fe0e6a7` | `adea989e-72c2-45ca-8002-85334255a6d9` |
| Art. 470 | `e2513663-b065-48ed-b9ac-5bb647451091` | `795777f3-cfdb-4862-b7e1-dfbc8fc910ce` |

## 1. Taxable income and net professional income (step 1: `pb_net_professional_income`)

### Art. 6 WIB 92 (`2f73b26b-…`)
>  
> Art. 6 is van toepassing met ingang van het aanslagjaar 1992 (art. 6, WIB; art. 1, KB 10.04.1992 - B.S. 30.07.1992; Numac: 
> 1992003456)
> Het belastbare inkomen wordt gevormd door het totale netto-inkomen, verminderd met de aftrekbare bestedingen.
> Het totale netto-inkomen is de som van de netto-inkomens van de volgende categorieën:
> 1° inkomen van onroerende goederen;
> 2° inkomen van roerende goederen en kapitalen;
> 3° beroepsinkomen;
> 4° divers inkomen.

### Art. 23 WIB 92 (`faca8178-…`)
> Art. 23, § 2, 3°, is van toepassing vanaf aanslagjaar 2019 op de beroepsverliezen die toe te schrijven zijn aan schade aan landbouwteelten, veroorzaakt door ongunstige weersomstandigheden die hebben plaatsgevonden vanaf 01.01.2018 (art. 85 en 108, W 11.02.2019 - B.S. 22.03.2019; Numac: 2019040488; err. B.S. 08.05.2019)
> § 1. Beroepsinkomsten zijn inkomsten die rechtstreeks of onrechtstreeks voortkomen uit werkzaamheden van alle aard en de daarmee gelijkgestelde inkomsten, met name:
> 1° winst;
> 2° baten;
> 3° winst en baten van een vorige beroepswerkzaamheid;
> 4° bezoldigingen;
> 5° pensioenen, renten en als zodanig geldende toelagen.
> § 2. Onder het nettobedrag van beroepsinkomsten wordt verstaan het totale bedrag van die inkomsten met uitsluiting van de vrijgestelde inkomsten en na uitvoering van de volgende bewerkingen:
> 1° het brutobedrag van de inkomsten van iedere beroepswerkzaamheid wordt verminderd met de beroepskosten die op deze inkomsten betrekking hebben;
> 2° beroepsverliezen die tijdens het belastbare tijdperk zijn geleden uit hoofde van enige beroepswerkzaamheid, worden afgetrokken van de inkomsten van andere beroepswerkzaamheden;
> 3° van de beroepsinkomsten, bepaald overeenkomstig 1° en 2°, worden de beroepsverliezen van vorige, of, in het geval vermeld in artikel 78, § 2, latere belastbare tijdperken afgetrokken;
> § 3. De Koning bepaalt de wijze waarop en de volgorde waarin de vrijstellingen en aftrekken worden aangerekend.

FR (`86349a7b-…`), § 2, 1°:
> 1° le montant brut des revenus de chacune des activités professionnelles est diminué des frais professionnels qui grèvent ces revenus;

### Art. 49 WIB 92 (`8802b3d4-…`)
> 
> Art. 49 is van toepassing met ingang van het aanslagjaar 1992 (art. 44, WIB; art. 1, KB 10.04.1992 - B.S. 30.07.1992; Numac: 
> 1992003456; art. 8, W 06.07.1994 - B.S. 16.07.1994; Numac: 
> 1994003443 [franstalige tekst])
> Als beroepskosten zijn aftrekbaar de kosten die de belastingplichtige in het belastbare tijdperk heeft gedaan of gedragen om de belastbare inkomsten te verkrijgen of te behouden en waarvan hij de echtheid en het bedrag verantwoordt door middel van bewijsstukken of, ingeval zulks niet mogelijk is, door alle andere door het gemeen recht toegelaten bewijsmiddelen, met uitzondering van de eed.
> Als in het belastbare tijdperk gedaan of gedragen worden beschouwd, de kosten die in dat tijdperk werkelijk zijn betaald of gedragen of het karakter van zekere en vaststaande schulden of verliezen hebben verkregen en als zodanig zijn geboekt.

### Art. 51 WIB 92 (`e2fb1778-…`)
> Art. 51, vierde lid (opgeheven), is van toepassing vanaf aanslagjaar 2026 (art. 55 en 90, 4de lid, W 18.12.2025 - B.S. 30.12.2025; Numac: 2025009647)
> [geïndexeerde bedragen - inkomsten 2026 - Automatische indexering  - aanslagjaar 2027]
> Met betrekking tot andere bezoldigingen, winst en baten dan de in de artikelen 25, 7° en 27, tweede lid, 7°, bedoelde inkomsten en vergoedingen verkregen tot volledig of gedeeltelijk herstel van een tijdelijke derving van bezoldigingen, winst of baten, worden de beroepskosten, de in artikel 52, 7° en 8°, bedoelde bijdragen en sommen en, wat winst betreft, de aankoopprijs van de verkochte handelsgoederen en van de grondstoffen uitgezonderd, bij gebrek aan bewijzen forfaitair bepaald op percentages van het brutobedrag van die inkomsten, vooraf verminderd met de voormelde bijdragen en sommen en de voormelde aankoopprijs.
> Die percentages bedragen:
> 1° voor bezoldigingen van werknemers: 30 %;
> 2° voor bezoldigingen van bedrijfsleiders: 3 %;
> 3° voor bezoldigingen van meewerkende echtgenoten: 5 %;
> 4° voor baten:
> a) 28,7 % van de eerste schijf van 7.720 euro (geïndexeerd bedrag);
> b) 10 % van de schijf van 7.720 euro (geïndexeerd bedrag) tot 15.340 euro (geïndexeerd bedrag);
> c) 5 % van de schijf van 15.340 euro (geïndexeerd bedrag) tot 25.530 euro (geïndexeerd bedrag);
> d) 3 % van de schijf boven 25.530 euro (geïndexeerd bedrag).
> 5° voor winst: 30 %
> In geen geval mag het forfait meer bedragen dan 6.070 euro (geïndexeerd bedrag) voor het geheel van de inkomsten van éénzelfde categorie als vermeld in het tweede lid, 1° en 5°, noch meer dan 3.200 euro (geïndexeerd bedrag) voor het geheel van de inkomsten als vermeld in het tweede lid, 2°, noch meer dan 5.340 euro (geïndexeerd bedrag) voor het geheel van de inkomsten van éénzelfde categorie als vermeld in het tweede lid, 3° en 4°.
> (...)
> De belastingplichtigen die bij toepassing van artikel 342, § 1, worden belast op grond van forfaitaire grondslagen van aanslag, evenals hun meewerkende echtgenoot voor het aandeel dat hij uit dergelijke forfaitair vastgestelde inkomsten verkrijgt, kunnen geen gebruik maken van het forfait bepaald in het tweede lid, 3°, 4° en 5°.

### Art. 52, 7°, WIB 92 (`e2123748-…`), extract
> Onder voorbehoud van het bepaalde in de artikelen 53 tot 66bis worden inzonderheid als beroepskosten aangemerkt:
> [...]
> 7° de persoonlijke bijdragen ter uitvoering van de sociale wetgeving of van een wettelijk of reglementair statuut dat de betrokkenen van het toepassingsgebied van de sociale wetgeving uitsluit;

**Implementation.** `wages_less_contributions = taxable_wages − social_contributions` (art. 52, 7°: the personal contributions actually due, i.e. after the sociale werkbonus, are professional expenses). `professional_expenses = min(employees_rate × wages_less_contributions, employees_maximum)` (art. 51: the percentage applies to the gross amount "vooraf verminderd met de voormelde bijdragen"; the cap applies to "het geheel van de inkomsten van éénzelfde categorie", so to all wages of the taxpayer). `net_professional_income = wages_less_contributions − professional_expenses` (art. 23, § 2, 1°). With wage income only and no deductible spending, `taxable_income = net_professional_income` (art. 6). Not modelled: actual expenses (art. 49), losses (art. 23, § 2, 2°–3°), exempt income, other income categories, aftrekbare bestedingen. Parameters: `payroll.professional_expenses.value.{employees_rate, employees_maximum}` (confirmed, PR #14).

## 2. Basic tax (step 2: `pb_basic_tax`)

### Art. 130 WIB 92 (`796a4fc5-…`)
> Art. 130, eerste lid, treedt in werking vanaf aanslagjaar 2020 (art. 142/C et 153, W 26.12.2015 - B.S. 30.12.2015; Numac: 2015206007 - err. B.S. 25.01.2016)
> [geïndexeerde bedragen - inkomsten 2026 - Automatische indexering - aanslagjaar 2027]
> De basisbelasting wordt bepaald op:
> 25 % voor de inkomensschijf van 0,01 euro tot 16.720 euro (geïndexeerd bedrag);
> 40 % voor de schijf van 16.720 euro (geïndexeerd bedrag) tot 29.510 euro (geïndexeerd bedrag);
> 45 % voor de schijf van 29.510 euro (geïndexeerd bedrag) tot 51.070 euro (geïndexeerd bedrag);
> 50 % voor de schijf boven 51.070 euro (geïndexeerd bedrag).
> Wanneer een gemeenschappelijke aanslag wordt gevestigd, wordt het belastingtarief toegepast op het belastbare inkomen van elke belastingplichtige.

**Implementation.** `apply_progressive_scale()` / `progressiveTax()` on the taxable income, with `federal.personal_income_tax.brackets`. Art. 130 states no rounding; none is applied.

## 3. Tax-free sum and its conversion into a reduction (step 3: `pb_tax_free_sum`, `pb_tax_free_sum_reduction`)

### Art. 131 WIB 92 (`f3c5d665-…`)
>  
> Art. 131, eerste lid, is van toepassing vanaf aanslagjaar 2027 (art. 2, 1°, en 4, 1ste lid, W 15.07.2026 - B.S. 29.07.2026; Numac: 
> 2026005724)
> [geïndexeerde bedragen - inkomsten 2026 - 
> Automatische indexering  - aanslagjaar 2027]
> Voor de berekening van de belasting wordt een basisbedrag van  
> 11.550 euro (geïndexeerd bedrag) vrijgesteld van belasting.
> Dit bedrag wordt verhoogd met 
> 2.030 euro (geïndexeerd bedrag) indien de belastingplichtige gehandicapt is.

### Art. 132 WIB 92 (`caa866c3-…`)
> Art. 132, eerste lid, 1° en 2°, is van toepassing vanaf aanslagjaar 2027 (art. 5 en 13, 1ste lid, W 15.07.2026 - B.S. 29.07.2026; Numac: 2026005724)
> [geïndexeerde bedragen - inkomsten 2026 - Automatische indexering - aanslagjaar 2027]
> Het overeenkomstig artikel 131 bepaalde basisbedrag wordt verhoogd met de volgende toeslagen voor personen ten laste:
> 1° voor een kind: 2.130 euro (geïndexeerd bedrag);
> 2° voor twee kinderen: 5.130 euro (geïndexeerd bedrag);
> 3° voor drie kinderen: 11.440 euro (geïndexeerd bedrag);
> 4° voor vier kinderen: 18.510 euro (geïndexeerd bedrag);
> 5° voor meer dan vier kinderen: 18.510 euro (geïndexeerd bedrag) plus 7.070 euro (geïndexeerd bedrag) per kind boven het vierde;
> 6° een bijkomende toeslag van 740 euro (geïndexeerd bedrag) voor ieder kind dat de leeftijd van 3 jaar niet heeft bereikt op 1 januari van het aanslagjaar, met dien verstande dat deze toeslag niet kan samengaan met de in artikel 14535 vermelde vermindering voor kinderoppas;
> 7° voor elke persoon ten laste die is bedoeld in artikel 136, 2° en 3°, en die de leeftijd van 66 jaar heeft bereikt en zorgbehoevend is: 5.950 euro (geïndexeerd bedrag);
> 8° voor iedere andere persoon ten laste: 1.980 euro (geïndexeerd bedrag).
> Voor de toepassing van het eerste lid, 1° tot 6° en 8°, worden als gehandicapt aangemerkte kinderen en andere personen ten laste voor twee gerekend.
> Voor de toepassing van het eerste lid, 7°, wordt als zorgbehoevend aangemerkt, de persoon voor wie de graad van zelfredzaamheid op ten minste 9 punten werd vastgesteld krachtens het ministerieel besluit van 30 juli 1987 tot vaststelling van de categorieën en van de handleiding voor de evaluatie van de graad van zelfredzaamheid met het oog op het onderzoek naar het recht op de integratietegemoetkoming. De zorgbehoevendheid wordt vastgesteld door de Directie-generaal Personen met een handicap van de FOD Sociale Zekerheid, Medex of de adviserend geneesheer bij het ziekenfonds of een gelijkwaardige instelling of persoon uit een andere lidstaat van de Europese Economische Ruimte.

### Art. 133 WIB 92 (`0f863e7a-…`): NOT modelled (hook)
> Art. 133, tweede lid, derde streepje, is van toepassing vanaf aanslagjaar 2027 (art. 36 en 42, 2de lid, W 15.07.2026 - B.S. 29.07.2026; Numac: 2026005724)
> [geïndexeerde bedragen - inkomsten 2026 - Automatische indexering  - aanslagjaar 2027]
> Het overeenkomstig artikel 131 bepaalde basisbedrag wordt bovendien verhoogd met de volgende toeslagen:
> 1° 1.980 euro (geïndexeerd bedrag) voor een belastingplichtige die alleen wordt belast en:
> - die één of meer kinderen ten laste heeft;
> - aan wie bij toepassing van artikel 132bis de helft van de toeslagen op de belastingvrije som bedoeld in artikel 132, eerste lid, 1° tot 6°, wordt toegekend;
> 2° 1.980 euro (geïndexeerd bedrag) wanneer voor het jaar van huwelijk of verklaring van de wettelijke samenwoning een aanslag per belastingplichtige wordt gevestigd en voor zover de echtgenoot tijdens het jaar geen bestaansmiddelen heeft gehad die meer dan 4.200 euro (geïndexeerd bedrag) netto bedragen.
> Het bedrag van de in het eerste lid, 1°, vermelde toeslag wordt verhoogd wanneer bijkomend aan alle onderstaande voorwaarden is voldaan:
> - geen andere persoon dan de kinderen, ascendenten en zijverwanten tot en met de tweede graad van de belastingplichtige, en de personen van wie de belastingplichtige als kind volledig of hoofdzakelijk ten laste is geweest, maakt deel uit van het gezin van de belastingplichtige op 1 januari van het aanslagjaar;
> - het belastbare inkomen van de belastingplichtige bedraagt minder dan 24.990 euro (geïndexeerd bedrag);
> - de netto-beroepsinkomsten van de belastingplichtige zijn minstens gelijk aan 4.200 euro (geïndexeerd bedrag), waarbij geen rekening wordt gehouden met de werkloosheidsuitkeringen, leeflonen, pensioenen en afzonderlijk belastbare inkomsten.
> De in het vorige lid bedoelde bijkomende toeslag is gelijk aan:
> - wanneer het belastbare inkomen van de belastingplichtige 19.720 euro (geïndexeerd bedrag) bedraagt of minder: 1.290 euro (geïndexeerd bedrag);
> - wanneer het belastbaar inkomen van de belastingplichtige meer bedraagt dan 19.720 euro (geïndexeerd bedrag): 1.290 euro (geïndexeerd bedrag) vermenigvuldigd met een breuk met als teller het verschil tussen 24.990 euro (geïndexeerd bedrag) en het belastbare inkomen en met als noemer het verschil tussen 24.990 euro (geïndexeerd bedrag) en 19.720 euro (geïndexeerd bedrag).
> Het eerste lid, 1°, is niet van toepassing op de gevallen bedoeld in artikel 126, § 2, eerste lid, 4°.
> Het eerste lid, 2°, is niet van toepassing wanneer zich in hetzelfde jaar een geval voordoet zoals bedoeld in artikel 126, § 2, eerste lid, 3°. De beëindiging van de wettelijke samenwoning door het feit dat de wettelijk samenwonenden met elkaar in het huwelijk treden, wordt voor de toepassing van dit lid niet in aanmerking genomen.

### Art. 134 WIB 92 (`20a503a9-…`)
> 
> Art. 134, § 3, zesde lid, tweede streepje (ingevoegd), en tweede streepje, dat derde streepje is geworden, is van toepassing vanaf aanslagjaar 2027 (art. 10, h) en i), en 13, 1ste lid, W 15.07.2026 - B.S. 29.07.2026; Numac: 
> 2026005724)
> [Zie ook HOOFDSTUK 2. - Minimaal belastingkrediet voor kinderen ten laste (art. 41 en 42, 2de lid, W 15.07.2026 - B.S. 29.07.2026; Numac: 2026005724)]
> [geïndexeerde bedragen - inkomsten 2026 - 
> Automatische indexering - aanslagjaar 2027]
> § 1. De belastingvrije som wordt vastgesteld als het totaal van het, eventueel verhoogde, basisbedrag en de toeslagen vermeld in de artikelen 132 en 133.
> § 2. De overeenkomstig artikel 130 berekende basisbelasting wordt verminderd met de belasting op de belastingvrije som.
> Die belasting op de belastingvrije som wordt bepaald op:
> 25 % voor de schijf van de belastingvrije som van 0,01 euro tot 
> 11.750 euro (geïndexeerd bedrag);
> 30 % voor de schijf van de belastingvrije som van 
> 11.750 euro (geïndexeerd bedrag) tot 
> 16.720 euro (geïndexeerd bedrag);
> 40 % voor de schijf van de belastingvrije som van 
> 16.720 euro (geïndexeerd bedrag) tot 
> 27.860 euro (geïndexeerd bedrag);
> 45 % voor de schijf van de belastingvrije som van 
> 27.860 euro (geïndexeerd bedrag) tot 
> 51.070 euro (geïndexeerd bedrag);
> 50 % voor de schijf van de belastingvrije som boven 
> 51.070 euro (geïndexeerd bedrag).
> § 3. Het deel van de overeenkomstig paragraaf 2, tweede lid, berekende belasting op de belastingvrije som dat niet in mindering kan worden gebracht van de overeenkomstig artikel 130 berekende belasting, wordt in de mate dat het betrekking heeft op de in artikel 132, eerste lid, 1° tot 6°, vermelde toeslagen, omgezet in een terugbetaalbaar belastingkrediet.
> Het in het eerste lid bedoelde belastingkrediet kan niet meer bedragen dan:
> - 
> 550 euro (niet geïndexeerd bedrag) per kind ten laste voor wie artikel 132bis niet wordt toegepast;
> - de helft van het in het eerste streepje vermelde bedrag per kind voor wie artikel 132bis wordt toegepast.
> Voor de toepassing van het tweede lid worden als gehandicapt aangemerkte kinderen voor twee gerekend.
> Om het deel van de belasting op de belastingvrije som dat niet in mindering kan worden gebracht van de overeenkomstig artikel 130 berekende belasting en betrekking heeft op de in artikel 132, eerste lid, 1° tot 6°, vermelde toeslagen, te bepalen:
> 1° wordt de belastingvrije som geacht achtereenvolgens te bestaan uit:
> - het in artikel 131 vermelde basisbedrag van de belastingvrije som;
> - de in de artikelen 132, eerste lid, 7° en 8°, en 133 vermelde toeslagen;
> - de in artikel 132, eerste lid, 1° tot 6°, vermelde toeslagen;
> 2° wordt geen rekening gehouden met het gedeelte van de belastingvrije som dat het belastbare inkomen overschrijdt en niet bestaat uit de in artikel 132, eerste lid, 1° tot 6°, vermelde toeslagen.
> Wanneer de in artikel 133, tweede lid, bedoelde bijkomende toeslag aan de belastingplichtige wordt verleend:
> 1° wordt ook het deel van de overeenkomstig paragraaf 2, tweede lid, berekende belasting op de belastingvrije som dat niet in mindering kan worden gebracht van de overeenkomstig artikel 130 berekende belasting, in de mate dat het betrekking heeft op de in artikel 133, tweede lid, vermelde bijkomende toeslag, omgezet in een verrekenbaar en terugbetaalbaar belastingkrediet;
> 2° gelden de volgende regels om het deel van de belasting op de belastingvrije som, dat betrekking heeft op de in artikel 132, eerste lid, 1° tot 6°, vermelde toeslagen en de in artikel 133, tweede lid, vermelde bijkomende toeslag, te bepalen:
> a) de belastingvrije som wordt geacht achtereenvolgens te bestaan uit:
> - het in artikel 131 vermelde basisbedrag van de belastingvrije som;
> - de in de artikelen 132, eerste lid, 7° en 8°, en 133, eerste lid, vermelde toeslagen;
> - de in artikel 132, eerste lid, 1° tot 6°, vermelde toeslagen;
> - de in artikel 133, tweede lid, vermelde bijkomende toeslag;
> b) er wordt geen rekening gehouden met het gedeelte van de belastingvrije som dat het belastbare inkomen overschrijdt en niet bestaat uit de in artikel 132, eerste lid, 1° tot 6°, vermelde toeslagen en de in artikel 133, tweede lid, vermelde bijkomende toeslag;
> 3° wordt het maximumbedrag van het belastingkrediet per belastingplichtige verhoogd met het bedrag van de overeenkomstig paragraaf 2, tweede lid, en het 2° van dit lid berekende belasting op de in artikel 133, tweede lid, vermelde bijkomende toeslag dat niet in mindering kan worden gebracht van de overeenkomstig artikel 130 berekende belasting.
> Deze paragraaf is niet van toepassing:
> - op de belastingplichtige die beroepsinkomsten heeft die bij overeenkomst zijn vrijgesteld en die niet in aanmerking komen voor de berekening van de belasting op zijn andere inkomsten;
> - op de belastingplichtige die inkomsten geniet uit een studiebeurs die wel aanleiding geeft tot de opbouw van al dan niet volledige rechten inzake sociale zekerheid maar niet onderworpen is aan de inkomstenbelastingen;
> - op de echtgenoot van een in het 
> eerste of tweede streepje vermelde belastingplichtige die overeenkomstig artikel 126, § 2, eerste lid, 4°, alleen wordt belast.
> § 4. Wanneer een gemeenschappelijke aanslag wordt gevestigd, wordt als volgt gehandeld:
> 1° de belastingvrije som wordt per echtgenoot vastgesteld;
> 2° de toeslagen vermeld in artikel 132 worden toegevoegd aan het basisbedrag van de belastingvrije som van de echtgenoot met het hoogste belastbare inkomen;
> 3° wanneer het belastbare inkomen van de echtgenoot bij wie de in artikel 132 bedoelde toeslagen worden toegevoegd aan het basisbedrag van de belastingvrije som bij toepassing van het 2° van dit lid of het derde lid, lager is dan zijn belastingvrije som, wordt het overschot aan belastingvrije som, desgevallend beperkt tot het positieve verschil tussen het belastbare inkomen en de belastingvrije som van de andere echtgenoot, bij de belastingvrije som van de andere echtgenoot gevoegd;
> 4° wanneer het belastbare inkomen van de echtgenoot bij wie de in artikel 132 bedoelde toeslagen niet worden toegevoegd aan het basisbedrag van de belastingvrije som bij toepassing van het 2° van dit lid of het derde lid, lager is dan zijn belastingvrije som, wordt het volledige overschot aan belastingvrije som bij de belastingvrije som van de andere echtgenoot gevoegd;
> 5° de overeenkomstig artikel 130 berekende belasting van elke echtgenoot wordt verminderd met de overeenkomstig paragraaf 2, tweede lid, berekende belasting op zijn overeenkomstig het 1° tot 4° bepaalde belastingvrije som;
> 6° voor elke echtgenoot wordt het deel van de overeenkomstig paragraaf 2, tweede lid, berekende belasting op de belastingvrije som dat niet in mindering kan worden gebracht van de overeenkomstig artikel 130 berekende belasting, in de mate dat het betrekking heeft op de toeslagen vermeld in artikel 132, eerste lid, 1° tot 6°, omgezet in een terugbetaalbaar belastingkrediet. Dit belastingkrediet kan voor beide echtgenoten samengenomen, niet meer bedragen dan het overeenkomstig paragraaf 3, tweede en derde lid, bepaalde maximumbedrag.
> Voor de toepassing van het eerste lid, 6°:
> 1° wordt het gedeelte van de belastingvrije som dat bij toepassing van het eerste lid, 3°, wordt overgeheveld, geacht bij voorrang te bestaan uit het in artikel 131 vermelde basisbedrag van de belastingvrije som en de in artikel 132, eerste lid, 7° en 8° vermelde toeslagen;
> 2° wordt het maximumbedrag desgevallend evenredig omgedeeld in functie van het belastingkrediet van elk van de echtgenoten ten opzichte van de som van de belastingkredieten van de beide echtgenoten.
> In afwijking van het eerste lid, 2°, worden de in artikel 132 bedoelde toeslagen toegevoegd aan het basisbedrag van de belastingvrije som van de echtgenoot met het laagste belastbare inkomen wanneer daardoor de belasting Staat verhoogd met de belasting op de in de artikelen 17, § 1, 1° tot 3° en 6°, en 90, eerste lid, 6° en 9°, bedoelde inkomsten en op de meerwaarden op roerende waarden en titels die op grond van artikel 90, eerste lid, 1°, belastbaar zijn, voor beide echtgenoten samen genomen, wordt verlaagd.

FR (`56f7c2a3-…`), § 1 and § 2:
> § 1. La quotité du revenu exemptée d'impôt comprend le total du montant de base, éventuellement majoré, et des suppléments visés aux articles 132 et 133.
> § 2. L'impôt de base calculé conformément à l'article 130 est diminué de l'impôt sur la quotité du revenu exemptée d'impôt.
> Cet impôt sur la quotité du revenu exemptée d'impôt est fixé à:
> 25 % pour la tranche de la quotité du revenu exemptée d'impôt de 0,01 euro à 
> 11.750 euros (montant indexé);
> 30 % pour la tranche de la quotité du revenu exemptée d'impôt de 
> 11.750 euros (montant indexé) à 
> 16.720 euros (montant indexé);
> 40 % pour la tranche de la quotité du revenu exemptée d'impôt de 
> 16.720 euros (montant indexé) à 
> 27.860 euros (montant indexé);
> 45 % pour la tranche de la quotité du revenu exemptée d'impôt de 
> 27.860 euros (montant indexé) à 
> 51.070 euros (montant indexé);
> 50 % pour la tranche de la quotité du revenu exemptée d'impôt supérieure à 

### Art. 136 WIB 92 (`3ca09601-…`)
> Art. 136 is van toepassing met ingang van het aanslagjaar 2005 (art. 27, W 10.08.2001 - B.S. 20.09.2001; Numac: 2001003402)
> [geïndexeerde bedragen - inkomsten 2026 - Automatische indexering  - aanslagjaar 2027]
> Als ten laste van de belastingplichtigen worden aangemerkt, mits zij deel uitmaken van hun gezin op 1 januari van het aanslagjaar en zij persoonlijk in het belastbare tijdperk geen bestaansmiddelen hebben gehad die meer dan 4.200 euro (geïndexeerd bedrag) netto bedragen:
> 1° hun kinderen;
> 2° hun ascendenten;
> 3° hun zijverwanten tot en met de tweede graad;
> 4° personen van wie de belastingplichtige als kind volledig of hoofdzakelijk ten laste is geweest.

### Art. 141 WIB 92 (`48e0ad6e-…`)
> Art. 141 (vervangen) is van toepassing vanaf aanslagjaar 2026 (art. 38 en 41, W 18.12.2025 - B.S. 30.12.2025; Numac: 2025009647)
> Art. 141, tweede (opheffing) lid, is van toepassing vanaf aanslagjaar 2026 (art. 24, 3°, en 27, 2de lid, W 22.12.2023 - B.S. 29.12.2023; Numac: 2023048700)
> [geïndexeerde bedragen - inkomsten 2026 - Automatische indexering  - aanslagjaar 2027]
> Het in artikel 136 bedoelde bedrag van 4.200 euro (geïndexeerd bedrag) wordt gebracht op 12.300 euro (geïndexeerd bedrag) voor kinderen ten laste.
> (...)

**Implementation.** `tax_free_sum = 11.550-type basic amount (+ disabled-taxpayer increase) + art. 132 increases` (art. 134, § 1). Children: cumulative amount for the number of children, where a disabled child counts for two (art. 132, second paragraph), plus the per-child amount above four; +supplement per child under 3 (a disabled child under 3 also counts for two: the second paragraph covers 1° to 6°); 7°: per person, not doubled; 8°: per person, doubled if disabled. Whether a person is "ten laste" (arts. 136–145: household on 1 January, net means ≤ 4.200 / 12.300 EUR, …) is an **input assumption**, not checked. Then (art. 134, § 2) `tax_on_tax_free_sum` = the § 2 scale (`federal.personal_income_tax.tax_on_tax_free_sum`, its own brackets, not the art. 130 ones) applied to the tax-free sum; `reduction_applied = min(tax_on_tax_free_sum, basic_tax)`; `tax_after_tax_free_sum = basic_tax − reduction_applied` (never negative). The non-deductible remainder is reported as `tax_free_sum_not_deductible`; its conversion into a refundable credit for the part relating to art. 132, 1° to 6° (§ 3, max. 550 EUR per child, layered order of § 3, fourth paragraph) is **not modelled** (hook `child_tax_credit_134_3`). Art. 134 states no rounding; none is applied. Not modelled: art. 133 (single parent, year of marriage), art. 132bis (co-parenting), § 4 (joint assessment), the "minimaal belastingkrediet voor kinderen ten laste" of the W 15.07.2026 (referred to in the Fisconet note above art. 134; its text was not read).

## 4. Employee tax reductions and credits: hooks only (step 4)

The following can change the tax of an employee and are not modelled; each is reported with `status: "not_modelled"` and `amount: null`: art. 134 § 3 (refundable child credit), W 15.07.2026 hoofdstuk 2 (minimum child credit), art. 145/1–145/16 (long-term saving, pension saving, personal group-insurance contributions), art. 145/21 (PWA/dienstencheques), art. 145/33 (giften), art. 145/35 (kinderoppas), art. 154bis (overwerk), art. 289ter (belastingkrediet voor lage activiteitsinkomsten / fiscale werkbonus), art. 178/1 (order of imputation).

### Art. 178/1 WIB 92 (`6af494dc-…`), § 1 and § 2 (why reductions need the regional split)
> § 1. De belastingverminderingen als vermeld in de artikelen 1451 tot 14516, (...) 14526, 14527, 14533, 14535, en 154bis, worden aangerekend op de gereduceerde belasting Staat met betrekking tot de overeenkomstig artikel 130 belaste inkomsten en op de belasting met betrekking tot de in de artikelen 17, § 1, 1° tot 3° en 6°, en 90, eerste lid, 6° en 9°, vermelde inkomsten en de meerwaarden op roerende waarden en titels die belastbaar zijn op grond van artikel 90, eerste lid, 1°, wanneer deze overeenkomstig artikel 130 worden belast.
> De in het eerste lid vermelde belastingverminderingen die niet kunnen worden aangerekend op de aldaar vermelde belasting, worden aangerekend op de gewestelijke personenbelasting met betrekking tot de overeenkomstig artikel 130 belaste inkomsten.
> § 2. De belastingverminderingen en kortingen worden aangerekend op de belasting met betrekking tot elke inkomenscategorie, in verhouding tot de belasting die op elk van die categorieën betrekking heeft.
> De belastingverminderingen worden aangerekend in de hierna vermelde volgorde:
> 1° eerst worden de belastingverminderingen aangerekend die niet in een belastingkrediet kunnen worden omgezet en geen aanleiding kunnen geven tot een latere belastingheffing en dit in de volgorde waarin ze in dit Wetboek zijn opgenomen;
> 2° vervolgens worden de belastingverminderingen aangerekend die niet in een belastingkrediet kunnen worden omgezet maar wel aanleiding kunnen geven tot een latere belastingheffing en dit in de volgorde waarin ze in dit Wetboek zijn opgenomen;
> 3° tenslotte worden de belastingverminderingen aangerekend die in een belastingkrediet kunnen worden omgezet.

### Art. 289ter WIB 92 (`189ea2a8-…`), § 1, first paragraph
> § 1. Wanneer het totale netto-inkomen van het belastbare tijdperk niet meer bedraagt dan 29.120 euro (geïndexeerd bedrag), heeft de rijksinwoner recht op een belastingkrediet waarvan het bedrag wordt bepaald op basis van het bedrag van de activiteitsinkomsten.

## 5. Regional step and "totale belasting": NOT modelled

### Art. 2, § 3, WIB 92 (`2bfeec21-…`), extract
> § 3. De termen "belasting Staat", "gereduceerde belasting Staat", "federale personenbelasting", "gewestelijke opcentiemen", "gewestelijke korting", "gewestelijke belastingvermeerdering", "gewestelijke belastingvermindering", "gewestelijk belastingkrediet", "gewestelijke personenbelasting" en "totale belasting" hebben voor de toepassing van dit Wetboek en de besluiten die in uitvoering ervan worden genomen de betekenis die eraan wordt gegeven in titel III/1 van de bijzondere wet van 16 januari 1989 betreffende de financiering van de Gemeenschappen en de Gewesten.

The tax after the tax-free sum is not yet the "totale belasting": the split into "gereduceerde belasting Staat" and the regional surcharges is defined in the BFW, Titel III/1, which was not read (Fisconet lists it under "Financiering van de gefedereerde entiteiten"; not transcribed in this task). The engine therefore reports `total_tax` as not modelled.

## 6. Aanvullende gemeentebelasting (step 5: `pb_municipal_surcharge`)

### Art. 466 WIB 92 (`81bf3101-…`)
> Art. 466, tweede lid, is van toepassing vanaf 01.01.2026 (art. 32 en 35, 1ste lid, W 06.04.2026 - B.S. 21.04.2026; Numac: 2026002780)
> De aanvullende gemeentebelasting op de personenbelasting en de aanvullende agglomeratiebelasting op de personenbelasting worden berekend op de totale belasting.
> Het overeenkomstig het eerste lid vastgestelde bedrag wordt evenwel verminderd met het gedeelte van de belasting dat betrekking heeft op de roerende inkomsten bedoeld in artikel 17, § 1, 1° en 2°, die geen beroepskarakter hebben, evenals met het gedeelte van de belasting dat betrekking heeft op de in artikel 17, § 1, 6°, bedoelde roerende inkomsten, en met het gedeelte van de belasting dat betrekking heeft op de diverse inkomsten als bedoeld in artikel 90, eerste lid, 9°.

FR (`aa4241fb-…`):
> Art. 466, alinéa 2, est applicable à partir du 01.01.2026 (art. 32 et 35, al. 1, L 06.04.2026 - M.B. 21.04.2026; Numac: 2026002780)
> La taxe communale additionnelle à l'impôt des personnes physiques et la taxe d'agglomération additionnelle à l'impôt des personnes physiques sont calculées sur l'impôt total.
> Toutefois, le montant déterminé conformément à l'alinéa 1er est diminué de la quotité d'impôt afférente aux revenus mobiliers visés à l'article 17, § 1er, 1° et 2°, qui n'ont pas de caractère professionnel, ainsi que de la quotité d'impôt afférente aux revenus mobiliers visés à l'article 17, § 1er, 6°, et de la quotité d'impôt afférente aux revenus divers visés à l'article 90, alinéa 1er, 9°.

### Art. 468 WIB 92 (`4d803548-…`)
> 
> Art. 468, eerste en derde lid, is van toepassing vanaf aanslagjaar 2015 (art. 4 en 7, 1ste lid, W 19.04.2014 - B.S. 16.05.2014; Numac: 
> 2014003218)
> De aanvullende belasting op de personenbelasting wordt voor alle belastingplichtigen van eenzelfde agglomeratie of gemeente vastgesteld op een eenvormig percentage van de berekeningsgrondslag vastgesteld overeenkomstig de artikelen 466 en 466bis.
> Wanneer dat percentage een breukgedeelte omvat, moet dat breukgedeelte tot één decimaal worden beperkt; dat percentage mag niet hoger liggen dan 1 % als de belasting wordt geheven door een agglomeratie.
> Op de aanvullende belasting op de personenbelasting mag geen vermindering, vrijstelling of uitzondering worden toegepast.
> Het percentage van de aanvullende gemeentebelasting op de personenbelasting wordt vastgesteld door een belastingreglement dat van toepassing is vanaf een welbepaald aanslagjaar en dat uiterlijk op 31 januari van het kalenderjaar waarnaar het aanslagjaar wordt genoemd, in werking treedt. Bij ontstentenis daarvan, wordt de aanvullende gemeentebelasting op de personenbelasting gevestigd op grond van het percentage dat van toepassing was voor het vorige aanslagjaar.

FR (`729c5509-…`):
> 
> Art. 468, alinéas 1 et 3, est applicable à partir de l'exercice d'imposition 2015 (art. 4 et 7, al. 1, L 19.04.2014 - M.B. 16.05.2014; Numac: 
> 2014003218)
> La taxe additionnelle à l'impôt des personnes physiques est fixée pour tous les contribuables d'une même agglomération ou commune à un pourcentage uniforme de la base de calcul déterminée conformément aux articles 466 et 466bis.
> Si ce pourcentage comprend une fraction, celle-ci doit être limitée à une décimale; ce pourcentage ne peut excéder 1 % lorsque la taxe est établie par une agglomération.
> La taxe additionnelle à l'impôt des personnes physiques ne peut être l'objet d'aucune réduction, exemption ou exception.
> Le pourcentage de la taxe communale additionnelle à l'impôt des personnes physiques est fixé par un règlement-taxe applicable à partir d'un exercice d'imposition déterminé qui doit entrer en vigueur au plus tard le 31 janvier de l'année civile dont le millésime désigne l'exercice d'imposition. A défaut, la taxe communale additionnelle à l'impôt des personnes physiques est établie sur la base du pourcentage applicable pour l'exercice d'imposition précédent.

### Art. 469 WIB 92 (`2f544d3e-…`)
> 
> Art. 469, eerste lid, treedt in werking op de dag van de bekendmaking in het Belgisch Staatsblad (art. 21 en 99, 1ste lid, W 25.04.2014 - B.S. 16.05.2014; Numac: 
> 2014003219)
> De vestiging en de inning van de aanvullende belastingen op de personenbelasting worden toevertrouwd aan de administratie belast met de vestiging van de inkomstenbelastingen en deze belast met de inning en de invordering van de inkomstenbelastingen, onder de voorwaarden en volgens de regelen die de Koning bepaalt.
> Die aanvullende belastingen worden bij wijze van bedrijfsvoorheffing of voorafbetalingen geïnd alsof het totale tarief van deze belastingen eenvormig op 6,7 % was vastgesteld. De Koning kan bij een besluit vastgesteld na overleg in de Ministerraad dat percentage verhogen tot maximaal 7 %.
> Voor zover hiervan niet wordt afgeweken, zijn de bepalingen van titel VII van dit Wetboek op die belastingen van toepassing.

### Art. 470 WIB 92 (`e2513663-…`)
> 
> Art 470 is van toepassing met ingang van 01.01.2003 (art. 2, B, W 10.12.2001 - B.S. 28.12.2001; Numac: 
> 2001003621)
> Op het bedrag van de in de artikelen 465 tot 469 bedoelde aanvullende belastingen wordt een korting van 1 % ingehouden voor de terugbetaling van de administratiekosten aan de Schatkist.

**Implementation.** `municipal_surcharge = totale_belasting × percentage / 100` (arts. 466 and 468). The percentage must have at most one decimal (art. 468, second paragraph) and no reduction applies (third paragraph). No rounding is stated; none is applied. The 6,7 % of art. 469 is only the rate used for withholding and advance payments, not the assessment rate. The 1 % 'korting' of art. 470 ('voor de terugbetaling van de administratiekosten aan de Schatkist') is not applied to the taxpayer's amount: read as a deduction from what is transferred to the municipality. This is an interpretation, to be confirmed from an FOD comment. The rate is read from `municipal.aanvullende_gemeentebelasting.<municipality>` (a new path, keyed by the municipality NIS code of `web/data/gemeenten.json` (e.g. `24062`): one parameter object per municipality with `value` = percentage, e.g. `7.3`, plus the usual provenance). It does not exist yet (see `pending_gemeentebelasting_bijzondere_bijdrage.md`), so the step fails closed. The reduction of art. 466, second paragraph (certain movable and miscellaneous income) does not arise with wage income only and is not modelled.

## 7. Open points
1. **Rounding.** Arts. 6, 23, 51, 130, 134 and 466–468 state no rounding of intermediate or final amounts. The engine rounds nothing. Rounding rules elsewhere (e.g. KB/WIB 92 or the assessment practice) were not found and are not assumed.
2. **BFW Titel III/1** (regional split, "totale belasting"): to be transcribed before the municipal step can produce an amount.
3. **Art. 134 § 3** and the W 15.07.2026 minimum child credit: to be modelled from their full text.
4. **Joint assessment** (arts. 126, 86–88, 134 § 4): the per-taxpayer functions take one person so that a joint layer can call them per spouse.
