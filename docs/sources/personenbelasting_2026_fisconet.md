# Federal personal income tax, income year 2026 / assessment year 2027: scale, tax-free sum, increases, flat-rate professional expenses (FOD Financiën, Fisconet)

- **Source:** FOD Financiën / SPF Finances, Fisconet. These are the codified articles of the WIB 92 ("inkomsten 2026", amounts indexed for aanslagjaar 2027) and the indexation notice published in the Belgisch Staatsblad of 12.08.2026, as reproduced on Fisconet.
- **Retrieved:** 2026-11-25, through the public endpoint `https://www.minfin.fgov.be/myminfin-rest/fisconetPlus/public/document/<guid>` (no CAPTCHA). Human-readable link: `https://www.minfin.fgov.be/myminfin-web/pages/public/fisconet/document/<guid>`.
- **Transcription:** verbatim; only whitespace is normalised. The Fisconet markers "(geïndexeerd bedrag)" / "(montant indexé)" are kept.
- **What this settles:** the scale and the 11.550 EUR tax-free sum in `params/2026/federal.yaml` were previously sourced from a finances.belgium.be page behind a CAPTCHA (unverified). **Fisconet confirms both values exactly.** No value changes.

## 0. Documents consulted

| ID | GUID | Title | Lang. |
|---|---|---|---|
| A130-NL | `796a4fc5-340e-4c89-a72a-88caa804ca96` | Artikel 130, WIB 92 (inkomsten 2026)* | NL |
| A130-FR | `aff72054-004a-4858-8747-1d70964c8e3d` | Article 130, CIR 92 (revenus 2026)* | FR |
| A131-NL | `f3c5d665-cac4-4cbd-b714-bd287f791751` | Artikel 131, WIB 92 (inkomsten 2026)*** | NL |
| A131-FR | `2fb89ed0-b93e-47d7-816c-85f1ac679b8a` | Article 131, CIR 92 (revenus 2026)*** | FR |
| A132-NL | `caa866c3-8820-4ba4-b5bc-f64ae0cd2869` | Artikel 132, WIB 92 (inkomsten 2026)*** | NL |
| A132-FR | `cb45b801-1dc7-4dd4-843f-054fe60e6335` | Article 132, CIR 92 (revenus 2026)*** | FR |
| A134-NL | `20a503a9-4213-4e60-a91c-0ebb907e176a` | Artikel 134, WIB 92 (inkomsten 2026)*** | NL |
| A134-FR | `56f7c2a3-94ab-45dd-85d0-2a0c7f6ddebc` | Article 134, CIR 92 (revenus 2026)*** | FR |
| A51-NL | `e2fb1778-ac33-4e91-8e57-e53c0cac384c` | Artikel 51, WIB 92 (inkomsten 2026)* | NL |
| A51-FR | `21dd9b61-2989-4125-a2e0-6142c607eec8` | Article 51, CIR 92 (revenus 2026)* | FR |
| IDX-NL | `b413b356-a007-46de-a335-c0c0fd9173e8` | 12.08.2026 - Bericht in verband met de automatische indexering inzake inkomstenbelastingen. - Aanslagjaar 2027 | NL |
| IDX-T-NL | `bed349e9-2f8e-40d2-ac85-d904473ab20e` | idem, Bijlagen (table, PDF of B.S. pp. 43738 and following) | NL |
| IDX-FR | `2a8d01ed-4569-4bc9-8301-db19e26d5986` | 12.08.2026 - Avis relatif à l'indexation automatique en matière d'impôts sur les revenus. - Exercice d'imposition 2027 | FR |
| IDX2-NL | `e3a471be-e270-4962-9fbf-67ce0d7571f0` | Automatische indexering - Inkomsten 2026 - Aanslagjaar 2027 (FOD version dated 2026-08-03, with changes marked) | NL |

## 1. Indexation notice (B.S. 12.08.2026)
IDX-NL header: "B.S., 12.08.2026, p. 43734 — Numac : 2026006085 — Algemene Administratie voor Beleidsexpertise en -Ondersteuning. - Dienst Reglementering". IDX-FR: "M.B., 12.08.2026, p. 43734 — Numac : 2026006085".

IDX-NL, A:
> "De coëfficiënt bedoeld in artikel 178, § 2, van het Wetboek van de inkomstenbelastingen 1992 bedraagt voor het aanslagjaar 2027 2,3356, zijnde het resultaat van de deling van het gemiddelde van de indexcijfers van 2025 (135,30) en het gemiddelde van de indexcijfers van 1988 (57,93)."

IDX-NL, J (link between income year and assessment year):
> "Voor de toepassing van artikel 255 van hetzelfde Wetboek valt het inkomstenjaar 2026 samen met het aanslagjaar 2026 en voor de toepassing van de artikelen 7 tot 11, 221,1°, 222, 2°, 234, eerste lid, 1°, van dat Wetboek valt dit inkomstenjaar samen met aanslagjaar 2027."

IDX2-NL (FOD note on the version):
> "Belangrijke opmerking: dit bericht werd aangepast overeenkomstig de wetswijzigingen die werden doorgevoerd tot en met de wet van 15 juli 2026 tot hervorming van de personenbelasting."

Table extracts (IDX-T-NL, columns "Basisbedrag" / "Geïndexeerd bedrag Aj. 2027"; spacing lost in the PDF text layer, values exact):

| Article | Description | Base | Indexed AJ 2027 |
|---|---|---|---|
| Art. 131, 1ste lid | Belastingvrije som | 4.945 | 11.550 |
| Art. 131, 3de lid | Verhoging voor gehandicapte belastingplichtige | 870 | 2.030 |
| Art. 132, 1ste lid, 1° | voor 1 kind | 935 | 2.130 |
| 2° | voor 2 kinderen | 2.250 | 5.130 |
| 3° | voor 3 kinderen | 5.020 | 11.440 |
| 4° | voor 4 kinderen | 8.120 | 18.510 |
| 5° | (supplement per kind boven het vierde) | 3.100 | 7.070 |
| 6° | bijkomende toeslag voor ieder kind jonger dan 3 jaar … | 325 | 740 |
| 7° | persoon ten laste ≥ 66 jaar en zorgbehoevend | 2.610 | 5.950 |
| 8° | iedere andere persoon ten laste | 870 | 1.980 |
| Art. 130 | Belastingtarief - inkomensschijven | 8.120 / 14.330 / 24.800 | 16.720 / 29.510 / 51.070 |
| Art. 134, § 2, 2de lid | Belasting op de belastingvrije sommen - belastingtarief - inkomensschijven | 5.705 / 8.120 / 13.530 / 24.800 | 11.750 / 16.720 / 27.860 / 51.070 |
| Art. 51, 3de lid | Maximumbedrag van de forfaitaire beroepskosten: Bezoldigingen van werknemers en winst | 2.950,00 | 6.070 |

(Art. 131 is in table I, coefficient 2,3356. Art. 132 is in table II, coefficient 2,2793. Art. 130, 134 and 51 are in table III.A, coefficient 2,0592.)

## 2. Art. 130 WIB 92: tax scale (income year 2026, AJ 2027)
A130-NL:
> "Art. 130, eerste lid, treedt in werking vanaf aanslagjaar 2020 (art. 142/C et 153, W 26.12.2015 - B.S. 30.12.2015; Numac: 2015206007 - err. B.S. 25.01.2016)
> [geïndexeerde bedragen - inkomsten 2026 - Automatische indexering - aanslagjaar 2027]
> De basisbelasting wordt bepaald op:
> 25 % voor de inkomensschijf van 0,01 euro tot 16.720 euro (geïndexeerd bedrag);
> 40 % voor de schijf van 16.720 euro (geïndexeerd bedrag) tot 29.510 euro (geïndexeerd bedrag);
> 45 % voor de schijf van 29.510 euro (geïndexeerd bedrag) tot 51.070 euro (geïndexeerd bedrag);
> 50 % voor de schijf boven 51.070 euro (geïndexeerd bedrag).
> Wanneer een gemeenschappelijke aanslag wordt gevestigd, wordt het belastingtarief toegepast op het belastbare inkomen van elke belastingplichtige."

A130-FR:
> "L'impôt de base est fixé à:
> 25 % pour la tranche de revenus de 0,01 euros à 16.720 euros (montant indexé);
> 40 % pour la tranche de 16.720 euros (montant indexé) à 29.510 euros (montant indexé);
> 45 % pour la tranche de 29.510 euros (montant indexé) à 51.070 euros (montant indexé);
> 50 % pour la tranche supérieure à 51.070 euros (montant indexé).
> Lorsqu'une imposition commune est établie, le tarif d'imposition est appliqué au revenu imposable de chaque contribuable."

## 3. Art. 131 WIB 92: basic tax-free sum
A131-NL:
> "Art. 131, eerste lid, is van toepassing vanaf aanslagjaar 2027 (art. 2, 1°, en 4, 1ste lid, W 15.07.2026 - B.S. 29.07.2026; Numac: 2026005724)
> [geïndexeerde bedragen - inkomsten 2026 - Automatische indexering - aanslagjaar 2027]
> Voor de berekening van de belasting wordt een basisbedrag van 11.550 euro (geïndexeerd bedrag) vrijgesteld van belasting.
> Dit bedrag wordt verhoogd met 2.030 euro (geïndexeerd bedrag) indien de belastingplichtige gehandicapt is."

A131-FR:
> "Pour le calcul de l'impôt, un montant de base de 11.550 euros (montant indexé) est exempté d'impôt.
> Ce montant est majoré de 2.030 euros (montant indexé) lorsque le contribuable est atteint d'un handicap."

## 4. Art. 132 WIB 92: increases for dependants
A132-NL:
> "Art. 132, eerste lid, 1° en 2°, is van toepassing vanaf aanslagjaar 2027 (art. 5 en 13, 1ste lid, W 15.07.2026 - B.S. 29.07.2026; Numac: 2026005724)
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
> Voor de toepassing van het eerste lid, 1° tot 6° en 8°, worden als gehandicapt aangemerkte kinderen en andere personen ten laste voor twee gerekend."

A132-FR:
> "Le montant de base fixé conformément à l'article 131 est majoré des suppléments suivants pour personnes à charge:
> 1° pour un enfant: 2.130 euros (montant indexé);
> 2° pour deux enfants: 5.130 euros (montant indexé);
> 3° pour trois enfants: 11.440 euros (montant indexé);
> 4° pour quatre enfants: 18.510 euros (montant indexé);
> 5° pour plus de quatre enfants: 18.510 euros (montant indexé) majorés de 7.070 euros (montant indexé) par enfant au-delà du quatrième;
> 6° un montant supplémentaire de 740 euros (montant indexé) pour chaque enfant n'ayant pas atteint l'âge de 3 ans au 1er janvier de l'exercice d'imposition, étant entendu que ce supplément ne peut s'ajouter à la réduction pour garde d'enfant visée à l'article 14535;
> 7° pour chaque personne à charge visée à l'article 136, 2° et 3°, qui est dans une situation de dépendance et qui a atteint l'âge de 66 ans: 5.950 euros (montant indexé);
> 8° pour chaque autre personne à charge: 1.980 euros (montant indexé)."

Art. 133 (single parent and other increases, e.g. 1.980 EUR) is listed in the indexation table but was **not** transcribed article by article. It is PENDING.

## 5. Art. 134 WIB 92: tax on the tax-free sum (§§ 1–2)
A134-NL:
> "§ 1. De belastingvrije som wordt vastgesteld als het totaal van het, eventueel verhoogde, basisbedrag en de toeslagen vermeld in de artikelen 132 en 133.
> § 2. De overeenkomstig artikel 130 berekende basisbelasting wordt verminderd met de belasting op de belastingvrije som.
> Die belasting op de belastingvrije som wordt bepaald op:
> 25 % voor de schijf van de belastingvrije som van 0,01 euro tot 11.750 euro (geïndexeerd bedrag);
> 30 % voor de schijf van de belastingvrije som van 11.750 euro (geïndexeerd bedrag) tot 16.720 euro (geïndexeerd bedrag);
> 40 % voor de schijf van de belastingvrije som van 16.720 euro (geïndexeerd bedrag) tot 27.860 euro (geïndexeerd bedrag);
> 45 % voor de schijf van de belastingvrije som van 27.860 euro (geïndexeerd bedrag) tot 51.070 euro (geïndexeerd bedrag);
> 50 % voor de schijf van de belastingvrije som boven 51.070 euro (geïndexeerd bedrag)."

A134-FR:
> "§ 2. L'impôt de base calculé conformément à l'article 130 est diminué de l'impôt sur la quotité du revenu exemptée d'impôt.
> Cet impôt sur la quotité du revenu exemptée d'impôt est fixé à:
> 25 % pour la tranche de la quotité du revenu exemptée d'impôt de 0,01 euro à 11.750 euros (montant indexé);
> 30 % pour la tranche de la quotité du revenu exemptée d'impôt de 11.750 euros (montant indexé) à 16.720 euros (montant indexé);
> 40 % pour la tranche de la quotité du revenu exemptée d'impôt de 16.720 euros (montant indexé) à 27.860 euros (montant indexé);
> 45 % pour la tranche de la quotité du revenu exemptée d'impôt de 27.860 euros (montant indexé) à 51.070 euros (montant indexé);
> 50 % pour la tranche de la quotité du revenu exemptée d'impôt supérieure à 51.070 euros (montant indexé)."

§ 3 (refundable tax credit for children, max. "550 euro (niet geïndexeerd bedrag) per kind ten laste"), § 4 (joint assessment: allocation of the tax-free sum between spouses) and the "minimaal belastingkrediet voor kinderen ten laste" (art. 41–42 W 15.07.2026) were read but are **not** transcribed into `params/`. They belong to the annual assessment and are PENDING for the annual module.

Consequence for implementers: the tax-free sum is **not** taxed at the art. 130 rates. It has its own scale, whose first bracket (25 %) runs up to 11.750 EUR. With the single basic amount of 11.550 EUR, the reduction is 11.550 × 25 % = 2.887,50 EUR (computed, not quoted).

## 6. Art. 51 WIB 92: flat-rate professional expenses (forfaitaire beroepskosten)
A51-NL:
> "Art. 51, vierde lid (opgeheven), is van toepassing vanaf aanslagjaar 2026 (art. 55 en 90, 4de lid, W 18.12.2025 - B.S. 30.12.2025; Numac: 2025009647)
> [geïndexeerde bedragen - inkomsten 2026 - Automatische indexering - aanslagjaar 2027]
> Met betrekking tot andere bezoldigingen, winst en baten dan de in de artikelen 25, 7° en 27, tweede lid, 7°, bedoelde inkomsten en vergoedingen verkregen tot volledig of gedeeltelijk herstel van een tijdelijke derving van bezoldigingen, winst of baten, worden de beroepskosten, de in artikel 52, 7° en 8°, bedoelde bijdragen en sommen en, wat winst betreft, de aankoopprijs van de verkochte handelsgoederen en van de grondstoffen uitgezonderd, bij gebrek aan bewijzen forfaitair bepaald op percentages van het brutobedrag van die inkomsten, vooraf verminderd met de voormelde bijdragen en sommen en de voormelde aankoopprijs.
> Die percentages bedragen:
> 1° voor bezoldigingen van werknemers: 30 %;
> […]
> In geen geval mag het forfait meer bedragen dan 6.070 euro (geïndexeerd bedrag) voor het geheel van de inkomsten van éénzelfde categorie als vermeld in het tweede lid, 1° en 5°, noch meer dan 3.200 euro (geïndexeerd bedrag) voor het geheel van de inkomsten als vermeld in het tweede lid, 2°, noch meer dan 5.340 euro (geïndexeerd bedrag) voor het geheel van de inkomsten van éénzelfde categorie als vermeld in het tweede lid, 3° en 4°."

A51-FR:
> "Ces pourcentages sont: 1° pour les rémunérations des travailleurs: 30 %; […] Le forfait ne peut, en aucun cas, dépasser 6.070 euros (montant indexé) pour l'ensemble des revenus d'une même catégorie visés à l'alinéa 2, 1° et 5°, ni 3.200 euros (montant indexé) pour l'ensemble des revenus visés à l'alinéa 2, 2°, ni 5.340 euros (montant indexé) pour l'ensemble des revenus d'une même catégorie visée à l'alinéa 2, 3° et 4°."

→ Employees, income year 2026: **30 %** of gross remuneration (after the deductions named in the article), maximum **6.070 EUR**. The withholding uses the same values (Bijlage III nr. 28: "tot 20.233,33 EUR 30 pct. / boven 20.233,33 EUR 6.070 EUR (maximum)"; see `bedrijfsvoorheffing_2026_fisconet.md`). Note that the 6.070 EUR cap applies "voor het geheel van de inkomsten van éénzelfde categorie": it is per taxpayer and income category, not per employer.

## 7. PENDING
- **Huwelijksquotiënt** in the annual assessment (art. 87–88 WIB 92) and **art. 133** (single person with children, year of marriage, and so on): not transcribed.
- **Art. 134 § 3–4** (refundable child tax credit, joint assessment) and the **minimum tax credit for dependent children** (art. 41–42 W 15.07.2026): not transcribed.
- **Fiscal work bonus as a tax credit** (art. 289ter/1 WIB 92, AJ 2027: 33,14 % luik A, 63 % luik B, cap 970 EUR base = 2.000 EUR indexed, per Circulaire 2026/C/89): noted only, not entered in `params/` (annual module).
- **Regional (Flemish) provisions** affecting the annual tax: not researched in this task.
