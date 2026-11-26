# Sleutelformule / formule-clé bedrijfsvoorheffing 2026 (FOD Financiën, Fisconet): verbatim transcription for the engine

- **Retrieved:** 2026-11-25. **Source:** Fisconet plus (FOD Financiën / SPF Finances) only.
- **Method:** the Fisconet web app (`https://eservices.minfin.fgov.be/myminfin-web/pages/fisconet`, which redirects to `www.minfin.fgov.be/myminfin-web/pages/public/fisconet/...`) was opened with Playwright (Chromium). No CAPTCHA challenge was shown (the app only loads the reCAPTCHA library). The app fetches each document from the public endpoint `https://www.minfin.fgov.be/myminfin-rest/fisconetPlus/public/document/<guid>`, which returns the official PDF (base64) with its metadata; the PDFs were taken from that endpoint and converted with `pdftotext -layout`. No snippets, payroll providers, blogs or memory were used.
- **Complement:** `docs/sources/bedrijfsvoorheffing_2026_fisconet.md` (PR #14) transcribes Bijlage III and the period timeline. This file adds the **full verbatim text of Deel I, Hoofdstuk 1 (monthly wages, nrs. 1-21) and Bijlagen 1-5(bis)** of both 2026 key formulas, in NL and FR, plus the findings relevant to the engine.
- **Transcription:** text blocks below are the `pdftotext -layout` output, unchanged except trailing spaces and form feeds removed. Page headers/footers (document reference, page numbers) are left in place. Parts that are out of scope (Hoofdstuk 2 for pay other than monthly, Deel II pensions, Deel III non-residents' unemployment benefits) are omitted and marked.

## 0. Documents

| ID | Title | Lang | GUID | Reference | Document date | URL |
|---|---|---|---|---|---|---|
| SF1-NL | Sleutelformule vanaf 1 januari 2026 | NL | `821b117c-eebc-497a-8297-ed2bb1e99d75` | BEO-DR/2025-0928 | 2025-12-17 | https://www.minfin.fgov.be/myminfin-web/pages/public/fisconet/document/821b117c-eebc-497a-8297-ed2bb1e99d75 |
| SF1-FR | Formule-clé à partir du 1er janvier 2026 | FR | `389035ca-432e-422b-859d-2d32fbdaa4cf` | BEO-DR/2025-0928 | 2025-12-17 | https://www.minfin.fgov.be/myminfin-web/pages/public/fisconet/document/389035ca-432e-422b-859d-2d32fbdaa4cf |
| SF11-NL | Sleutelformule vanaf 1 november 2026 | NL | `905faa6f-0a50-407b-ad09-ce1c677a6735` | BEO-DR/2025-0928_v2 | 2026-10-26 | https://www.minfin.fgov.be/myminfin-web/pages/public/fisconet/document/905faa6f-0a50-407b-ad09-ce1c677a6735 |
| SF11-FR | Formule-clé à partir du 1er novembre 2026 | FR | `93032da8-dfe9-4543-9cdf-778272cb86bc` | BEO-DR/2025-0928_v2 | 2026-10-26 | https://www.minfin.fgov.be/myminfin-web/pages/public/fisconet/document/93032da8-dfe9-4543-9cdf-778272cb86bc |
| R-NL | Regels 1 januari 2026 (Bijlage III KB/WIB 92, KB 11.12.2025) | NL | `a38f6c59-3ab9-49d3-8844-d39f91387663` | — | 2025-12-17 | https://www.minfin.fgov.be/myminfin-web/pages/public/fisconet/document/a38f6c59-3ab9-49d3-8844-d39f91387663 |
| R-FR | Règles 1er janvier 2026 | FR | `536a741e-81d6-4605-ad11-8e07ebc4a440` | — | 2025-12-17 | https://www.minfin.fgov.be/myminfin-web/pages/public/fisconet/document/536a741e-81d6-4605-ad11-8e07ebc4a440 |
| B3C-NL | Bijlage III, KB/WIB 92 (inkomsten 2026 - gecoördineerde versie)** | NL | `b14d7617-e298-4210-ab8f-dbb3bced2922` | — | 2026-09-27 | https://www.minfin.fgov.be/myminfin-web/pages/public/fisconet/document/b14d7617-e298-4210-ab8f-dbb3bced2922 |
| B3C-FR | Annexe III, AR/CIR 92 (revenus 2026 - version coordonnée)** | FR | `6c6b27a8-d275-4ab8-bed1-c979ab3d9314` | — | 2026-07-24 | https://www.minfin.fgov.be/myminfin-web/pages/public/fisconet/document/6c6b27a8-d275-4ab8-bed1-c979ab3d9314 |
| C89-NL | Circulaire 2026/C/89 over de verhoging van de fiscale werkbonus | NL | `e2e1e290-47bd-4203-abce-966f56f396eb` | — | 2026-09-23 | https://www.minfin.fgov.be/myminfin-web/pages/public/fisconet/document/e2e1e290-47bd-4203-abce-966f56f396eb |

## 1. Findings for the engine

1. **Three periods by payment date** (income 'betaald of toegekend'), confirmed by the entry-into-force notes at the top of B3C-NL/B3C-FR (quoted in §6):
   - 1 Jan – 31 Jul 2026: SF1 (= R-NL).
   - 1 Aug – 31 Oct 2026: SF1, except nr. 46.2.2 (luik B of the work bonus) **63 pct.** instead of 52,54 pct. (KB 24.07.2026, in force 01.08.2026). **Discrepancy:** SF1 nr. 20 still says 52,54 pct. and FOD published no August key formula; the regulation (Bijlage III) prevails. Circular 2026/C/89 confirms 63 % for the fiscal work bonus from assessment year 2027 (income 2026).
   - 1 Nov – 31 Dec 2026: SF11 (KB 27.09.2026): tax-free sum 11.550 EUR (3.089,63 / 6.179,26 EUR), marital-quotient cap 12.790 EUR (both spouses 66 on 1.1.2027) or 11.780 EUR (all other cases, also when the employer lacks the information), children Bijlage 3bis, other family burdens Bijlagen 4bis/5bis, luik B 63 pct. Scale, flat-rate expenses and the 174/290/579 EUR limits are unchanged. Deel II (pensions) of SF11 keeps the January amounts (B3C: 'niet van toepassing [...] Deel 5').
2. **Rounding** (SF nr. 3, R-NL nr. 12): every amount, at every step, half-up to the cent ('naargelang het cijfer van de duizendsten al dan niet 5 bereikt').
3. **Scale:** the printed cumulative amounts (4.469,93; 9.944,05; 20.320,38 EUR) equal the rounded sums of the lower brackets, so 'fixed + rate × slice' and the bracket sum agree; the engine uses the printed amounts.
4. **Floors:** SF nr. 13 caps the family reductions at the basic tax; SF nr. 21 forbids a negative withholding. The formula is silent on a negative basic tax (net income below the tax-free sum); the engine floors the annual tax at 0, which gives the same final withholding (0) as carrying the negative amount until nr. 21.
5. **Work-bonus reduction:** the two components (33,14 % of luik A, 52,54 %/63 % of luik B of the social work bonus 'dat daadwerkelijk is verleend') are rounded separately (nr. 3, 'in elke stap') and then added. The social work bonus itself comes from the RSZ module.
6. **NL/FR discrepancy in SF11:** FR Annexe 4 and 4bis, item 6, say '565 EUR NETS par mois' while NL Bijlage 4/4bis item 6, the FR footnote (4) of the same annex ('les limites de 290 EUR et 579 EUR NETS'), SF1-FR, R-FR and B3C-FR all say **579 EUR**. 565 is an error in the FR text of SF11; the engine does not use this limit (the spouse situation is an input), but a UI that classifies the spouse must use 579 EUR.
7. **No official worked examples:** neither key formula, nor Bijlage III, nor the Fisconet page 'Bedrijfsvoorheffing berekenen' (`da14799a-...`) contains numerical examples; a Fisconet search ('bedrijfsvoorheffing voorbeeld berekening 2026') found none. FOD publishes a simulator (Excel) for 2026 and from 01.11.2026; it is a tool, not a worked example, and was not used. The acceptance tests are therefore boundary cases computed independently with exact decimal arithmetic.
8. **Out of scope (engine reports 'not modelled'):** exceptional pay, holiday pay, 13th month, arrears (Bijlage III nr. 53 e.v.), non-residents, bedrijfsleiders, pay other than monthly, overtime (nr. 45 / SF nr. 18), low-income public sector (nr. 47 / SF nr. 19). Exemptions applied by the employer before the formula (e.g. commuting, nr. 16) are expected to be already excluded from the gross input.

## 2. SF1-NL — Sleutelformule vanaf 1 januari 2026 (Deel I, Hoofdstuk 1 and Bijlagen)

```text
     INLEIDING


1.   Deze sleutelformule bestaat uit drie delen en vijf bijlagen:

     DEEL I.       BEZOLDIGINGEN


     Dit deel bevat:

     -   de regels voor het berekenen van de BV op maandelijkse bezoldigingen (nrs.
         6 tot 21);

     -   de regels voor het berekenen van de BV op anders dan per maand betaalde
         bezoldigingen (nr. 22).



     DEEL II.      PENSIOENEN EVENALS WERKLOOSHEIDSUITKERINGEN MET
                   BEDRIJFSTOESLAG (VERMELD IN ARTIKEL 146 WIB 92)
                   BETAALD AAN RIJKSINWONERS


     Dit deel bevat de regels voor het berekenen van de BV op deze maandelijkse
     pensioenen en werkloosheidsuitkeringen met bedrijfstoeslag (nrs. 23 tot 36).



     DEEL III.     WERKLOOSHEIDSUITKERINGEN MET BEDRIJFSTOESLAG
                   (VERMELD IN ARTIKEL 146 WIB 92) BETAALD AAN NIET-
                   INWONERS


     Dit deel bevat de regels voor het berekenen van de BV op deze maandelijkse
     werkloosheidsuitkeringen met bedrijfstoeslag (nrs. 37 tot 43).




                                        -3-
                                                                     BEO-DR/2025-0928


     BIJLAGEN

     De bijlagen bevatten de basisschaal (bijlage 1) en de tabellen en gegevens voor het
     berekenen van de verminderingen (bijlagen 2 tot 5) die moeten worden gebruikt
     overeenkomstig de in de delen I, II en III vermelde regels.

     BELANGRIJKE OPMERKINGEN

2.   Deze sleutelformule verschilt ten opzichte van de vorige sleutelformule (BEO/2024-
     0015) hoofdzakelijk ingevolge:
        • de indexering;
        • het einde van een tijdelijke maatregel inzake overwerk (nr. 18).

     Het is mogelijk dat deze sleutelformule in de loop van 2026 wordt aangepast
     als gevolg van fiscale hervormingen die door de regering zullen
     aangenomen worden.

3.   Voor de toepassing van deze sleutelformule, worden alle bedragen, in
     voorkomend geval in elke stap, afgerond tot de hogere of lagere cent,
     naargelang het cijfer van de duizendsten al dan niet 5 bereikt;

4.   De sleutelformule geldt alleen voor de BV verschuldigd op bezoldigingen en op in
     artikel 146 WIB 92 vermelde pensioenen of werkloosheidsuitkeringen met
     bedrijfstoeslag die periodiek worden betaald. In alle andere gevallen wordt de BV
     berekend volgens de schalen en de erbij horende regels die in bijlage III van het
     KB/WIB 92 zijn opgenomen.

5.   Bij de berekening van de BV zoals hierna aangegeven is reeds rekening gehouden
     met een verhoging van 7 pct. voor de aanvullende belastingen (gemeente- en
     agglomeratiebelasting).


                                 * * * * * * * *




                                       -4-
                                                                                BEO-DR/2025-0928


DEEL I.     BEZOLDIGINGEN

            Hoofdstuk 1. BEREKENEN VAN DE BV OP MAANDELIJKSE BEZOLDIGINGEN

6.           De BV die bij betaling van maandelijkse bezoldigingen is verschuldigd, wordt in vijf
             stappen berekend.

             Deze vijf stappen zijn:

             A.      vaststellen van het bruto jaarinkomen;
             B.      omzetten van het bruto jaarinkomen in het belastbare netto jaarinkomen;
             C.      berekenen van de jaarbelasting;
             D.      berekenen van de bedrijfsvoorheffing op maandbasis;
             E.      toepassen van de andere verminderingen.


            A.       BRUTO JAARINKOMEN

7.           Om het bruto jaarinkomen vast te stellen moet men:

                  1° - het betaalde brutobedrag van de maandelijkse bezoldigingen
                       verminderen met de inhoudingen gedaan ter uitvoering van de sociale
                       wetgeving of een ermede gelijkgesteld wettelijk of reglementair statuut;

                       - het betaalde brutobedrag van de maandelijkse bezoldigingen van
                         bedrijfsleiders die onderworpen zijn aan het sociaal statuut van de
                         zelfstandigen, verminderen zoals aangegeven in onderstaande tabel:

          BRUTOBEDRAG VAN DE                                     VERMINDERING
       MAANDELIJKSE BEZOLDIGINGEN

     tot 1.465 EUR                         385 EUR

     van 1.465,01 EUR tot 6.310 EUR        385 EUR + 21,5 pct. op de schijf boven 1.465 EUR

     van 6.310,01 EUR tot 9.290 EUR        1.426,68 EUR + 14,50 pct. op de schijf boven 6.310 EUR

     boven 9.290 EUR                       1.858,78 EUR


                  2° het bekomen verschil vermenigvuldigen met 12.




                                                 -5-
                                                                               BEO-DR/2025-0928




            B.     BELASTBARE NETTO JAARINKOMEN


8.           Het belastbare netto jaarinkomen is gelijk aan het bruto jaarinkomen verminderd
             met de forfaitaire beroepskosten. Die forfaitaire beroepskosten worden als volgt
             bepaald:

            1°     Bezoldigingen (wedden en lonen) van werknemers

                BRUTOJAARINKOMEN                                FORFAITAIRE BEROEPSKOSTEN

     tot 20.233,33 EUR                       30 pct.

     boven 20.233,33 EUR                     6.070 EUR (maximum)


            2°     Periodieke bezoldigingen van bedrijfsleiders

                   BRUTOJAARINKOMEN                               FORFAITAIRE BEROEPSKOSTEN

     Tot 106.666,67 EUR                                3 pct.

     boven 106.666,67 EUR                              3.200 EUR (maximum)




            C.     JAARBELASTING


9.           Om de jaarbelasting te bekomen moet men:

            -      op het belastbare netto jaarinkomen de basisbelasting berekenen;

            -      van de basisbelasting de verminderingen aftrekken.

             De jaarbelasting is dus gelijk aan de basisbelasting verminderd met de
             verminderingen.




                                                -6-
                                                                                         BEO-DR/2025-0928


             1.    BASISBELASTING


10.          De basisbelasting wordt steeds berekend met behulp van de enige basisschaal die
             is opgenomen in bijlage 1.


11.          Afdeling 1.- A. Rijksinwoners
                          B. Niet-inwoners die bezoldigingen verkrijgen:
                             - voor in België geleverde arbeidsprestaties;
                             - ingevolge één of meerdere arbeidsovereenkomsten die
                                 het volledige kalenderjaar bestrijken;
                             - en voor zover die arbeidsprestaties ten minste 75 pct. van
                                 de wettelijk voorziene arbeidsduur per overeenkomst
                                 bedragen

             a)    De verkrijger van de inkomsten is een alleenstaande of de echtgenoot van
                   de verkrijger van de inkomsten heeft eveneens persoonlijke
                   beroepsinkomsten.

                   UITZONDERING
                   -----------------------
                   Wanneer nochtans de echtgenoot van de verkrijger van de inkomsten
                   persoonlijke beroepsinkomsten heeft die uitsluitend bestaan uit pensioenen,
                   renten of ermede gelijkgestelde inkomsten en die niet meer bedragen dan
                   174 EUR NETTO1 per maand, wordt, in afwijking van het vorige lid, de
                   basisbelasting berekend overeenkomstig punt b, hierna.

             De BASISBELASTING is gelijk aan de belasting berekend met behulp van de
             basisschaal en verminderd met 2.987,98 EUR (zijnde de belasting op een
             belastingvrije som ten bedrage van 11.170 EUR).

             b)    De echtgenoot van de verkrijger van de inkomsten heeft geen persoonlijke
                   beroepsinkomsten2.

                   *   Vooreerst wordt aan de echtgenoot van de verkrijger van de inkomsten een
                       beroepsinkomen toegekend dat gelijk is aan 30 pct. van het belastbare
                       netto jaarinkomen.

                       Het toegekende inkomen mag echter niet meer bedragen dan 13.790 EUR
                       (maximum bereikt bij een belastbare netto jaarinkomen van
                       45.966,67 EUR).


1   Bij het beoordelen van de grens van 174 EUR NETTO per maand, moet de toestand per 1 januari 2026 in
    aanmerking worden genomen en moeten de netto beroepsinkomsten als volgt worden vastgesteld :
    1. de brutoberoepsinkomsten verminderen met de verplichte inhoudingen of bijdragen gedaan ter
         uitvoering van de sociale wetgeving of van een ermede gelijkgesteld wettelijk of reglementair statuut;
    2. vervolgens het bekomen verschil verminderen met 20 pct.
2    Zie echter de uitzondering onder nr. 11, a.
                                                     -7-
                                                                    BEO-DR/2025-0928


           *   Vervolgens wordt de belasting op dat toegekende inkomen berekend met
               behulp van de basisschaal (resultaat = belasting A).

           *   Daarna wordt de belasting (eveneens met behulp van de basisschaal)
               berekend op het verschil tussen het belastbare netto jaarinkomen en het
               deel daarvan dat aan de andere echtgenoot werd toegerekend (resultaat =
               belasting B).

           *   De BASISBELASTING tenslotte is gelijk aan de som van de twee
               belastingbedragen (som = belasting A + belasting B) verminderd met
               5.975,96 EUR (zijnde tweemaal de belasting op de belastingvrije som ten
               bedrage van 11.170 EUR).


12.   Afdeling 2. - Niet-inwoners die niet zijn vermeld in afdeling 1, B. hiervoor
                    (nr. 11).

      De BASISBELASTING is gelijk aan de belasting berekend met behulp van de
      basisschaal.


      2.   VERMINDERINGEN

      Voorafgaande opmerking

      Sommige begrippen met betrekking tot de verminderingen worden in bijlage 2
      toegelicht.

      a)   Algemeen
13.
      ➢    Van de basisbelasting vastgesteld overeenkomstig nr. 11 mogen, in
           voorkomend geval, worden afgetrokken:
           ▪   de verminderingen voor kinderen ten laste;
           ▪   de verminderingen voor andere gezinslasten.


           Alle verminderingen mogen worden samengevoegd zonder dat nochtans het
           totaal ervan het bedrag van de basisbelasting mag overtreffen.

      b)   Vermindering voor kinderen ten laste

14.   De vermindering voor kinderen ten laste moet worden toegekend op basis van de
      gegevens opgenomen in de tabel van bijlage 3.

      c)   Verminderingen voor andere gezinslasten

15.   Deze verminderingen zijn naar aard en bedrag gespecificeerd in de tabellen van
      bijlagen 4 en 5.
                                        -8-
                                                                              BEO-DR/2025-0928




               Bijlage 4

               De aldaar vermelde verminderingen zijn enkel van toepassing wanneer de
               verkrijger van de inkomsten een alleenstaande is of wanneer de echtgenoot van de
               verkrijger van de inkomsten eveneens persoonlijke beroepsinkomsten heeft1.

               Bijlage 5

               Die verminderingen zijn enkel van toepassing wanneer de echtgenoot van de
               verkrijger van de inkomsten GEEN persoonlijke beroepsinkomsten heeft1.


              D.     MAANDELIJKSE BEDRIJFSVOORHEFFING


16.           De verschillende bewerkingen waarvan hierboven sprake geven als uitkomst de
              jaarbelasting (zie nr. 9).

              Om het bedrag van de BV te bepalen die op de maandelijks betaalde
              bezoldigingen verschuldigd is, moet men het bedrag van de jaarbelasting delen
              door 12.


              E.     ANDERE VERMINDERINGEN


              a) Algemeen

              Van    de   maandeljikse   verschuldigde    bedrijfsvoorheffing vastgesteld
              overeenkomstig nr. 16 mogen, naar gelang van het geval, achtereenvolgens
              volgende verminderingen nog in mindering worden gebracht:
                    ▪    de vermindering ingevolge persoonlijke bijdragen:
                             o voor groepsverzekering;
                             o voor extrawettelijke verzekering tegen ouderdom of vroegtijdige
                               dood;
                             o die, overeenkomstig artikel 1453, derde lid, WIB 92, betrekking
                               hebben op de individuele voortzetting van een pensioentoezegging;
                             o die, overeenkomstig artikel 1453, vierde lid, WIB 92, betrekking
                               hebben op het vrij aanvullend pensioen van werknemers;
                    ▪    de vermindering voor bezoldigingen ingevolge het presteren van overwerk
                         dat recht geeft op een overwerktoeslag;
                    ▪    de vermindering van de bedrijfsvoorheffing op de bezoldigingen van
                         natuurlijke personen met een laag inkomen die, anders dan krachtens een

1     Zie echter de uitzondering onder nr. 11, a.

                                                    -9-
                                                                       BEO-DR/2025-0928


               arbeidsovereenkomst, arbeid verrichten in de overheidssector;
           ▪   de vermindering van de bedrijfsvoorheffing op de bezoldigingen van
               werknemers en bedrijfsleiders met een laag inkomen die recht hebben op
               de werkbonus.


      b)   Vermindering voor groepsverzekering, voor extrawettelijke verzekering tegen
           ouderdom of vroegtijdige dood en voor inhoudingen overeenkomstig
           artikel 1453, derde en vierde lid, WIB 92

17.   De maandelijkse verschuldigde bedrijfsvoorheffing vastgesteld overeenkomstig
      nr. 16 mag, in voorkomend geval, verminderd worden met 30 pct. van:
      ▪    de verplichte inhoudingen ter uitvoering van een groepsverzekeringscontract;
      ▪    de verplichte inhoudingen ter uitvoering van een extrawettelijke
           voorzorgsregeling van verzekering tegen ouderdom en vroegtijdige dood;
      ▪    de inhoudingen die betrekking hebben op de individuele voortzetting van een
           pensioentoezegging overeenkomstig artikel 1453, derde lid, WIB 92;
      ▪    de inhoudingen die betrekking hebben op een vrij aanvullend pensioen voor
           werknemers overeenkomstig artikel 1453, vierde lid, WIB 92.


      c)   Vermindering voor bezoldigingen ingevolge het presteren van overwerk dat
           recht geeft op een overwerktoeslag

18.   Deze vermindering is van toepassing op werknemers die overwerk hebben
      gepresteerd dat, overeenkomstig artikel 29 van de arbeidswet van 16 maart 1971
      of artikel 7 van het koninklijk besluit nr. 213 van 26 september 1983 betreffende de
      arbeidsduur in de ondernemingen die onder het paritair comité voor het bouwbedrijf
      ressorteren, recht geeft op een overwerktoeslag en die:

      ▪    hetzij onderworpen zijn aan de arbeidswet van 16 maart 1971 en
           tewerkgesteld door een werkgever onderworpen aan de wet van
           5 december 1968 aangaande de collectieve arbeidsovereenkomsten en de
           paritaire comités;
      ▪    hetzij als contractuele of statutaire werknemers tewerkgesteld zijn door één
           van de volgende autonome overheidsbedrijven: de naamloze vennootschap
           van publiek recht Proximus, de naamloze vennootschap van publiek recht
           bpost, de naamloze vennootschap van publiek recht NMBS en de naamloze
           vennootschap van publiek recht Infrabel;
      ▪    hetzij als contractuele of statutaire werknemers tewerkgesteld zijn door de
           naamloze vennootschap van publiek recht HR Rail.

      Deze vermindering is slechts van toepassing op de berekeningsgrondslag voor
      de overwerktoeslag betreffende de eerste 130 uren die de werknemer als
      overwerk heeft gepresteerd.


                                       - 10 -
                                                                       BEO-DR/2025-0928


      Het in het tweede lid bepaalde maximum van 130 uren overwerk wordt
      opgetrokken tot 180 uren voor de werknemers tewerkgesteld bij werkgevers die
      werken in onroerende staat verrichten op voorwaarde dat zij gebruik maken van
      een in hoofdstuk V, afdeling 4, van de wet van 4 augustus 1996 betreffende het
      welzijn van de werknemers bij de uitvoering van hun werk bedoeld elektronisch
      aanwezigheidsregistratiesysteem.

      Het in het tweede lid bepaalde maximum van 130 uren overwerk wordt opgetrokken
      tot 360 uren voor de werknemers tewerkgesteld bij werkgevers die ressorteren
      onder het paritair comité voor het hotelbedrijf of onder het paritair comité voor de
      uitzendarbeid indien de gebruiker ressorteert onder het paritair comité voor het
      hotelbedrijf.

      Het in het tweede lid bepaalde maximum van 130 uren overwerk wordt opgetrokken
      tot 280 uren voor de werknemers tewerkgesteld bij werkgevers die hoofdzakelijk
      wegenwerken uitvoeren, met uitsluiting van het aanleggen van ondergrondse
      leidingen en kabels, of spoorwegwerken en voor wie de overheid oplegt om in het
      weekend, op feestdagen of ‘s nachts te werken, op voorwaarde dat die werkgevers
      gebruik maken van een in hoofdstuk V, afdeling 4, van de wet van 4 augustus 1996
      betreffende het welzijn van de werknemers bij de uitvoering van hun werk bedoeld
      elektronisch aanwezigheidsregistratiesysteem en op voorwaarde en in de mate dat
      die werknemers daadwerkelijk wegenwerken of spoorwegwerken waarvoor de
      overheid oplegt om in het weekend, op feestdagen of ‘s nachts te werken hebben
      uitgevoerd tijdens de overuren die voor die werkgevers worden gepresteerd.

      De vermindering is niet van toepassing op het overwerk dat in aanmerking komt
      voor de toepassing van artikel 38, § 1, eerste lid, 30°, WIB 92.


      De vermindering wordt toegepast op de maandelijkse verschuldigde
      bedrijfsvoorheffing vastgesteld overeenkomstig nr. 16 en na toepassing van nr.
      17, en bedraagt:
      -    voor een gepresteerd uur waarop een wettelijke overwerktoelage van 50 of
           100 pct. van toepassing is: 57,75 pct.;
      -    voor een gepresteerd uur waarop een wettelijke overwerktoeslag van 20 pct.
           van toepassing is: 66,81 pct.,
      van het "sociale brutobedrag" van de bezoldigingen (dit is vóór aftrek van de
      verplichte inhoudingen ter uitvoering van de sociale wetgeving of van een ermede
      gelijkgesteld wettelijk of reglementair statuut), dat als berekeningsgrondslag voor
      de berekening van de overwerktoeslag heeft gediend.


      d)   Vermindering van de bedrijfsvoorheffing op de bezoldigingen van natuurlijke
           personen met een laag inkomen die, anders dan krachtens een
           arbeidsovereenkomst, arbeid verrichten in de overheidssector

19.   De hier bedoelde vermindering moet als volgt worden toegepast:
                                       - 11 -
                                                                      BEO-DR/2025-0928




      Er wordt een vermindering verleend aan personen die als statutair, stagiair of
      tijdelijke in dienst zijn bij de overheid, de gemeenschappen, de gewesten, de
      provincies, inrichtingen die aan de provincies ondergeschikt zijn, de gemeenten en
      inrichtingen die aan de gemeenten ondergeschikt zijn, en die niet in het kader van
      een arbeidsovereenkomst zijn aangeworven, en een belastbare maandbezoldiging
      verkrijgen van minstens 742,26 EUR en maximum 2.722,91 EUR.

      De vermindering wordt toegepast op de maandelijkse verschuldigde
      bedrijfsvoorheffing vastgesteld overeenkomstig nr. 16 en na toepassing van nrs.
      17 en 18, en bedraagt 7,50 EUR.


      e)   Vermindering van de bedrijfsvoorheffing op de bezoldigingen van werknemers
           en bedrijfsleiders met een laag inkomen die recht hebben op de werkbonus

20.   De hier bedoelde vermindering moet als volgt worden toegepast:

      Er wordt een vermindering verleend aan de werknemers en bedrijfsleiders die recht
      hebben op een werkbonus overeenkomstig artikel 2 van de wet van 20 december
      1999 tot toekenning van een werkbonus onder de vorm van een vermindering van
      de persoonlijke bedragen van sociale zekerheid aan werknemers met lage lonen
      en aan sommige werknemers die het slachtoffer waren van een herstructurering.

      De vermindering wordt toegepast op de maandelijkse verschuldigde
      bedrijfsvoorheffing vastgesteld overeenkomstig nr. 16 en na toepassing van nrs.
      17 tot 19, en bedraagt:

           •   33,14 pct. van het bedrag van het luik A van de werkbonus dat
               daadwerkelijk is verleend met toepassing van artikel 2, § 1/1, van de wet
               van 20 december 1999 tot toekenning van een werkbonus aan werknemers
               met lage lonen en van andere verminderingen van de persoonlijke
               bijdragen van sociale zekerheid;
           •   52,54 pct. van het bedrag van het luik B van de werkbonus dat
               daadwerkelijk is verleend met toepassing van artikel 2, § 1/2, van de
               voormelde wet van 20 december 1999.


      f)   Beperking van de verminderingen

21.   De toepassing van de verminderingen kan er niet toe leiden dat de
      bedrijfsvoorheffing negatief wordt.




                                       - 12 -
                                                                      BEO-DR/2025-0928



[... Hoofdstuk 2 (anders dan per maand), Deel II en Deel III: buiten scope, niet overgenomen / hors scope, non repris ...]

                                                     - 22 -
                                     BASISSCHAAL




TOEGEKEND BEROEPSINKOMEN EN
BELASTBAAR NETTO JAARINKOMEN                                 BASISBELASTING
MINUS TOEGEREKEND INKOMEN

van 0,01 EUR tot        16.710 EUR   26,75 pct.

van 16.710,01 EUR tot   29.500 EUR   4.469,93 EUR + 42,80 pct.   op de schijf boven   16.710 EUR

van 29.500,01 EUR tot   51.050 EUR   9.944,05 EUR + 48,15 pct.   "     "              29.500 EUR

boven 51.050 EUR                     20.320,38 EUR + 53,50 pct. "      "              51.050 EUR




                                                                                                   BEO-DR/2025-0928
                                                                                                            Bijlage 1
                                                                   BEO-DR/2025-0928
                                                                          Bijlage 2/1



                   PERSONEN VERMELD IN DEEL I, NR. 10


         BEGRIPPEN IN VERBAND MET VERMINDERING


1°   Personen met een handicap

a)   Kind met een handicap

     Hieronder wordt verstaan:

     -    het kind dat voor ten minste 66 pct. getroffen is door ontoereikendheid of
          vermindering van lichamelijke of psychische geschiktheid wegens één of
          meer aandoeningen;

     -    het kind van wie, ongeacht de leeftijd, is vastgesteld dat ingevolge feiten
          overkomen en vastgesteld vóór de leeftijd van 65 jaar:

          a) ofwel zijn lichamelijke of psychische toestand zijn verdienvermogen
             heeft verminderd tot één derde of minder van wat een valide persoon
             door een of ander beroep op de algemene arbeidsmarkt kan
             verdienen;

          b) ofwel zijn gezondheidstoestand een volledig gebrek aan of een
             vermindering van zelfredzaamheid van ten minste 9 punten met zich
             brengt, gemeten volgens de handleiding en de medisch-sociale
             schaal van toepassing in het kader van de wetgeving met betrekking
             tot de tegemoetkomingen aan personen met een handicap;

          c) ofwel, na de periode van primaire ongeschiktheid bepaald in artikel 87
             van de gecoördineerde wet betreffende de verplichte verzekering voor
             geneeskundige verzorging en uitkeringen, zijn verdienvermogen is
             verminderd tot een derde of minder, zoals bepaald in artikel 100 van
             dezelfde gecoördineerde wet;

          d) ofwel hij, ingevolge een administratieve of gerechtelijke beslissing,
             voor tenminste 66 pct. blijvend fysiek of psychisch gehandicapt of
             arbeidsongeschikt werd verklaard.
                                                                  BEO/DR/2025-0928
                                                                         Bijlage 2/2

b)   Andere persoon met een handicap

     Hieronder wordt verstaan:

     -   diegene van wie vóór 1 januari 1989 werd vastgesteld dat hij voor ten
         minste 66 pct. getroffen is door ontoereikendheid of vermindering van
         lichamelijke of psychische geschiktheid wegens één of meer
         aandoeningen;

     -   diegene van wie, ongeacht de leeftijd, is vastgesteld dat ingevolge feiten
         overkomen en vastgesteld vóór de leeftijd van 65 jaar:

          a) ofwel zijn lichamelijke of psychische toestand zijn verdienvermogen
             heeft verminderd tot één derde of minder van wat een valide persoon
             door een of ander beroep op de algemene arbeidsmarkt kan
             verdienen;

          b) ofwel zijn gezondheidstoestand een volledig gebrek aan of een
             vermindering van zelfredzaamheid van ten minste 9 punten met zich
             brengt, gemeten volgens de handleiding en de medisch-sociale
             schaal van toepassing in het kader van de wetgeving met betrekking
             tot de tegemoetkomingen aan personen met een handicap;

          c) ofwel, na de periode van primaire ongeschiktheid bepaald in artikel 87
             van de gecoördineerde wet betreffende de verplichte verzekering voor
             geneeskundige verzorging en uitkeringen, zijn verdienvermogen is
             verminderd tot een derde of minder, zoals bepaald in artikel 100 van
             dezelfde gecoördineerde wet;

          d) ofwel hij, ingevolge een administratieve of gerechtelijke beslissing,
             voor ten minste 66 pct. blijvend fysiek of psychisch gehandicapt of
             arbeidsongeschikt werd verklaard.


2°   Wanneer een kind ten laste of een in artikel 136, 2° tot 4°, WIB 92 bedoelde
     persoon ten laste overlijdt, wordt de vermindering voor dat kind of die persoon
     verder toegestaan tot het einde van het jaar van overlijden.

3°   Wanneer beide echtgenoten persoonlijke beroepsinkomsten hebben, worden
     de verminderingen voor kinderen ten laste en voor andere gezinslasten,
     behalve die voor de echtgenoot met een handicap, aan de door hen gekozen
     echtgenoot verleend;

     De vermindering voor de echtgenoot met een handicap, wordt aan de
     betrokkene zelf toegekend.
                                                                   BEO/DR/2025-0928
                                                                          Bijlage 2/3



4°   Zorgbehoevend

     Voor de toepassing van artikel 132, eerste lid, 7°, WIB 92 wordt als
     zorgbehoevend aangemerkt, de persoon voor wie de graad van
     zelfredzaamheid op ten minste 9 punten werd vastgesteld krachtens het
     ministerieel besluit van 30 juli 1987 tot vaststelling van de categorieën en van
     de handleiding voor de evaluatie van de graad van zelfredzaamheid met het
     oog op het onderzoek naar het recht op de integratietegemoetkoming. De
     zorgbehoevendheid wordt vastgesteld door de Directie-generaal Personen
     met een handicap van de FOD Sociale Zekerheid, Medex of de adviserend
     geneesheer bij het ziekenfonds of een gelijkwaardige instelling of persoon uit
     een andere lidstaat van de Europese Economische Ruimte.
                                                                    BEO/DR/2025-0928
                                                                             Bijlage 3

                     PERSONEN VERMELD IN DEEL I, NR. 11


                  VERMINDERING VOOR KINDEREN TEN LASTE

AANTAL KINDEREN TEN LASTE (1)           VERMINDERING VAN DE BASISBELASTING
              1                                        624 EUR

              2                                      1.656 EUR

              3                                      4.404 EUR

              4                                      7.620 EUR

              5                                     11.100 EUR

              6                                      14.592EUR

              7                                     18.120 EUR

              8                                     21.996 EUR

meer dan 8:   de basisbelasting wordt verminderd met een vast bedrag van
              21.996 EUR, verhoogd met 3.864 EUR per kind ten laste boven het
              achtste, d.w.z.:
              voor 9 kinderen: 21.996 + (1 x 3.864) = 25.860 EUR
              voor 10 kinderen: 21.996 + (2 x 3.864) = 29.724 EUR
              enz.
(1) het kind met een handicap ten laste wordt voor twee gerekend.
                                                                                     BEO-DR/2025-0928
                                                                                            Bijlage 4/1

                             PERSONEN VERMELD IN DEEL I, NR. 11

 VERMINDERINGEN VOOR ANDERE GEZINSLASTEN VAN TOEPASSING:
        -   OFWEL WANNEER DE VERKRIJGER VAN DE INKOMSTEN EEN
            ALLEENSTAANDE IS;
        -   OFWEL WANNEER DE ECHTGENOOT VAN DE VERKRIJGER VAN DE
            INKOMSTEN EVENEENS PERSOONLIJKE BEROEPSINKOMSTEN
            HEEFT.


                  GROND VAN DE VERMINDERING                                     JAARBEDRAG IN EURO
                                                                              VAN DE VERMINDERING (1)
1.   de verkrijger van de inkomsten is een niet hertrouwde weduwnaar                 624 EUR
     (weduwe), een ongehuwde vader (moeder), of een
     echtgescheiden of feitelijk gescheiden ouder, met één of meer
     kinderen ten laste:

2.   de verkrijger van de inkomsten is zelf gehandicapt:                             624 EUR

3.   de verkrijger van de inkomsten heeft in artikel 136, 2° en 3° van het           1.992 EUR
     WIB 92 bedoelde personen ten laste die de leeftijd van 66 jaar
     hebben bereikt en zorgbehoevend zijn, per persoon (2):

4.   de verkrijger van de inkomsten heeft in artikel 136, 2° tot 4° van het          624 EUR
     WIB 92 bedoelde personen, andere dan diegenen vermeld onder
     punt 3 hiervoor, ten laste, per persoon (3):

5.   de echtgenoot van de verkrijger van de inkomsten heeft                          1.740 EUR
     persoonlijke beroepsinkomsten, andere dan pensioenen, renten of
     ermede gelijkgestelde inkomsten, die niet meer bedragen dan
     290 EUR NETTO per maand (4):

6.   de echtgenoot van de verkrijger van de inkomsten heeft                          3.474 EUR
     persoonlijke beroepsinkomsten die uitsluitend bestaan uit
     pensioenen, renten of ermede gelijkgestelde inkomsten en die niet
     meer bedragen dan 579 EUR NETTO per maand (4):

(1) alle verminderingen mogen worden samengevoegd.

(2) wordt als zorgbehoevend aangemerkt, de persoon voor wie de graad van zelfredzaamheid op ten
    minste 9 punten werd vastgesteld krachtens het ministerieel besluit van 30 juli 1987 tot vaststelling
    van de categorieën en van de handleiding voor de evaluatie van de graad van zelfredzaamheid met
    het oog op het onderzoek naar het recht op de integratietegemoetkoming. De zorgbehoevendheid
    wordt vastgesteld door de Directie-generaal Personen met een handicap van de FOD Sociale
    Zekerheid, Medex of de adviserend geneesheer bij het ziekenfonds of een gelijkwaardige instelling
    of persoon uit een andere lidstaat van de Europese Economische Ruimte.

(3) de persoon met een handicap ten laste wordt voor twee gerekend.

(4) bij het beoordelen van de grenzen van 290 EUR en 579 EUR NETTO per maand, moet de toestand
    per 1 januari 2026 in aanmerking worden genomen en dienen de netto beroepsinkomsten als volgt
    te worden vastgesteld:
                                                                         BEO-DR/2025-0928
                                                                                Bijlage 4/2

1.   de bruto beroepsinkomsten verminderen met de verplichte inhoudingen of bijdragen gedaan
     ter uitvoering van de sociale wetgeving of van een ermede gelijkgesteld wettelijk of
     reglementair statuut;

2.   vervolgens het bekomen verschil verminderen met 20 pct.
                                                                                 BEO-DR/2025-0928
                                                                                          Bijlage 5



                         PERSONEN VERMELD IN DEEL I, NR. 11


          VERMINDERINGEN VOOR ANDERE GEZINSLASTEN VAN TOEPASSING
          WANNEER DE ECHTGENOOT VAN DE VERKRIJGER VAN DE INKOMSTEN
          GEEN PERSOONLIJKE BEROEPSINKOMSTEN HEEFT.


              GROND VAN DE VERMINDERING                                   JAARBEDRAG IN
                                                                           EURO VAN DE
                                                                         VERMINDERING (1)
1.   de verkrijger van de inkomsten is zelf gehandicapt:                        624 EUR

2.   de echtgenoot van de verkrijger van de inkomsten is                        624 EUR
     gehandicapt:

3.   de verkrijger van de inkomsten heeft in artikel 136, 2° en 3°             1.992 EUR
     van het WIB 92 bedoelde personen ten laste die de leeftijd
     van 66 jaar hebben bereikt en zorgbehoevend zijn, per
     persoon (2):

4.   de verkrijger van de inkomsten heeft in artikel 136, 2° tot 4°             624 EUR
     van het WIB 92 bedoelde personen, andere dan diegenen
     vermeld onder punten 3 en 4 hiervoor, ten laste, per
     persoon (3):

(1) alle verminderingen mogen worden samengevoegd.

(2) wordt als zorgbehoevend aangemerkt, de persoon voor wie de graad van zelfredzaamheid op
    ten minste 9 punten werd vastgesteld krachtens het ministerieel besluit van 30 juli 1987 tot
    vaststelling van de categorieën en van de handleiding voor de evaluatie van de graad van
    zelfredzaamheid met het oog op het onderzoek naar het recht op de integratietegemoetkoming.
    De zorgbehoevendheid wordt vastgesteld door de Directie-generaal Personen met een
    handicap van de FOD Sociale Zekerheid, Medex of de adviserend geneesheer bij het
    ziekenfonds of een gelijkwaardige instelling of persoon uit een andere lidstaat van de Europese
    Economische Ruimte.

(3) de gehandicapte persoon ten laste wordt voor twee gerekend.
```

## 3. SF1-FR — Formule-clé à partir du 1er janvier 2026 (Partie I, Chapitre 1 et annexes)

```text
     INTRODUCTION


1.   Cette formule-clé- est constituée de trois parties et cinq annexes :


     PARTIE I.     REMUNERATIONS


     Cette partie comporte :

     -    les règles pour le calcul du Pr.P dû sur les rémunérations mensuelles (nos 6 à
          21) ;
     -    les règles pour le calcul du Pr.P dû sur les rémunérations payées autrement
          que par mois (n° 22).



     PARTIE II.    PENSIONS AINSI QUE ALLOCATIONS DE CHOMAGE AVEC
                   COMPLEMENT D’ENTREPRISE (VISEES A L'ARTICLE 146,
                   CIR 92) PAYEES A DES HABITANTS DU ROYAUME


     Cette partie comporte les règles pour le calcul du Pr.P dû sur les pensions
     mensuelles et les allocations mensuelles de chômage avec complément
     d’entreprise (nos 23 à 36).




     PARTIE III.   ALLOCATIONS    DE   CHOMAGE      AVEC     COMPLEMENT
                   D’ENTREPRISE (VISEES A L’ARTICLE 146, CIR 92) PAYEES A
                   DES NON-RESIDENTS


     Cette partie comporte les règles pour le calcul du Pr.P dû sur les allocations
     mensuelles de chômage avec complément d’entreprise (nos 37 à 43).




                                        -3-
                                                                     ESS-SR/2025-0928


     ANNEXES

     Les annexes comportent le barème de base (annexe 1) ainsi que les tableaux et
     données pour le calcul des réductions (annexes 2 à 5) à utiliser conformément aux
     règles visées aux parties I, II et III.


     REMARQUES IMPORTANTES

2.   Cette formule-clé diffère de la formule-clé précédente (ESS/2024-0015)
     principalement suite à :
           • l’indexation ;
           • la fin d'une mesure temporaire concernant les heures supplémentaires
              (n° 18).

     Il est possible que la présente formule-clé soit adaptée dans le courant de
     l'année 2026 suite à des réformes fiscales adoptées par le gouvernement.

3.   Pour l'application de la présente formule-clé, tous les montants sont, le cas
     échéant à chaque étape du calcul, arrondis au cent supérieur ou inférieur
     selon que le chiffre des millièmes atteint ou non 5 ;

4.   La formule-clé- s'applique uniquement au Pr.P dû sur les rémunérations et sur les
     pensions ou allocations de chômage avec complément d’entreprise visées à l’article
     146, CIR 92, payées périodiquement. Dans tous les autres cas, le Pr.P est calculé
     suivant les barèmes et les règles repris à l'annexe III à l’AR/CIR 92.

5.   Le calcul du Pr.P tel que détaillé ci-après, intègre déjà une majoration de 7 p.c.
     pour les taxes additionnelles (taxe communale et taxe d'agglomération).


                                 * * * * * * * *




                                      -4-
                                                                              ESS-SR/2025-0928


          PARTIE I.      REMUNERATIONS


          Chapitre 1er. CALCUL DU Pr.P DU SUR LES REMUNERATIONS MENSUELLES


6.        Le Pr.P dû sur les rémunérations mensuelles est calculé en cinq étapes.

          Ces cinq étapes sont :

          A.    la détermination du revenu annuel brut ;
          B.    la transformation du revenu annuel brut en revenu annuel net imposable ;
          C.    le calcul de l'impôt annuel ;
          D.    le calcul du précompte professionnel mensuel ;
          E.    l'application des autres réductions.


          A.    REVENU ANNUEL BRUT


7.        Pour établir le revenu annuel brut, il y a lieu :

          1° - de diminuer le montant brut des rémunérations mensuelles payées des
               retenues effectuées en exécution de la législation sociale ou d'un statut légal
               ou réglementaire y assimilé ;

               - de diminuer le montant brut des rémunérations mensuelles payées aux
                 dirigeants d'entreprise qui sont soumis au statut social des travailleurs
                 indépendants de la réduction reprise dans le tableau ci-après :

     MONTANT BRUT DES                                          REDUCTION
 REMUNERATIONS MENSUELLES


 jusqu'à 1.465 EUR                     385 EUR

 de 1.465,01 EUR à 6.310 EUR           385 EUR + 21,50 p.c. de la tranche excédant 1.465 EUR

 de 6.310,01 EUR à 9.290 EUR           1.426,68 EUR + 14,50 p.c. de la tranche excédant 6.310 EUR

 supérieur à 9.290 EUR                 1.858,78 EUR


          2°    de multiplier la différence obtenue par 12.




                                               -5-
                                                                             ESS-SR/2025-0928




          B.    REVENU ANNUEL NET IMPOSABLE


8.        Le revenu annuel net imposable est égal au revenu annuel brut diminué des frais
          professionnels forfaitaires. Ces frais professionnels forfaitaires sont fixés comme
          suit :

          1°    Rémunérations des travailleurs (traitements et salaires)

      REVENU ANNUEL BRUT                          FRAIS PROFESSIONNELS FORFAITAIRES

 jusqu'à 20.233,33 EUR                 30 p.c.

 supérieur à 20.233,33 EUR             6.070 EUR (maximum)


          2°    Rémunérations périodiques des dirigeants d'entreprise

              REVENU ANNUEL BRUT                          FRAIS PROFESSIONNELS FORFAITAIRES

 jusqu'à 106.666,67 EUR                                3 p.c.

 supérieur à 106.666,67 EUR                            3.200 EUR (maximum)




          C.    IMPOT ANNUEL


9.        Pour obtenir l'impôt annuel, il y a lieu :

          -     de calculer l'impôt de base sur le revenu annuel net imposable ;

          -     de déduire les réductions de l'impôt de base.

          L'impôt annuel est donc égal à l'impôt de base diminué des réductions.




                                                 -6-
                                                                                              ESS-SR/2025-0928


              1.    IMPOT DE BASE

10.           L'impôt de base est calculé à l'aide du seul barème de base repris à l'annexe 1.


11.           Section 1ère.-       A.    Habitants du Royaume
                                   B.    Non-résidents qui ont bénéficié de rémunérations :
                                        - pour des prestations de travail effectuées en
                                          Belgique ;
                                        - en exécution d’un ou de plusieurs contrats de travail
                                          couvrant l’année civile complète ;
                                        - et pour autant que les prestations de travail atteignent
                                          au moins 75 p.c. du temps légal de travail par contrat

              a)    Le bénéficiaire des revenus est un isolé ou son conjoint bénéficie également
                    de revenus professionnels propres.

                    EXCEPTION
                    ------------------
                    Lorsque le conjoint du bénéficiaire des revenus recueille des revenus
                    professionnels propres qui sont exclusivement constitués de pensions, rentes
                    ou revenus y assimilés et qui ne dépassent pas 174 EUR NETS1 par mois,
                    l'impôt de base est calculé, par dérogation à l'alinéa précédent, conformément
                    au point b, ci-après.


              L'IMPOT DE BASE est égal à l'impôt calculé à l'aide du barème de base et diminué
              de 2.987,98 EUR (c.-à-d. l'impôt sur la quotité du revenu exemptée d'impôt, qui
              s'élève à 11.170 EUR).


              b)    Le conjoint du bénéficiaire des revenus n'a pas de revenus professionnels
                    propres2.

                    *    Tout d'abord, on impute au conjoint du bénéficiaire des revenus un revenu
                         professionnel égal à 30 p.c. du revenu annuel net imposable.

                         Le revenu imputé ne peut toutefois pas dépasser le montant de
                         13.790 EUR (ce montant maximum est atteint avec un revenu annuel net
                         imposable de 45.966,67 EUR).



1     Pour apprécier la limite de 174 EUR NETS par mois, il y a lieu d'envisager la situation au 1er janvier 2026 et
      de déterminer les revenus professionnels nets comme suit :
      1. diminuer les revenus professionnels bruts des retenues ou cotisations obligatoires applicables en
          exécution de la législation sociale ou d'un statut légal ou réglementaire y assimilé ;
      2. diminuer ensuite la différence obtenue de 20 p.c.
2     Voir toutefois l'exception au n° 11, a.

                                                        -7-
                                                                        ESS-SR/2025-0928


           *   Puis, à l'aide du barème de base, on calcule l'impôt sur le revenu imputé
               au conjoint (résultat = impôt A).

           *   Ensuite, à l'aide du barème de base, on calcule l'impôt sur la différence
               entre le revenu annuel net imposable et le revenu qui a été imputé à l'autre
               conjoint (résultat = impôt B).

           *   Finalement, l'IMPOT DE BASE est égal à la somme des deux montants
               d'impôt (somme = impôt A + impôt B), diminuée de 5.975,96 EUR (étant
               deux fois l'impôt sur la quotité du revenu exemptée d'impôt s'élevant à
               11.170 EUR).


12.   Section 2. - Non-résidents qui ne sont pas visés à la section 1ère, B, ci-dessus
                   (n° 11).

      L'IMPOT DE BASE est égal à l'impôt calculé à l'aide du barème de base.


      2.   REDUCTIONS

      Remarque préliminaire

      Certaines notions en matière de réductions sont précisées à l'annexe 2.

      a)   Généralités
13.
      ➢    L'impôt de base déterminé conformément au no 11 peut, le cas échéant, être
           diminué :
           ▪   de la réduction pour enfants à charge ;
           ▪   des réductions pour autres charges de famille.

      Toutes les réductions peuvent être cumulées sans que le total de celles-ci ne puisse
      cependant excéder le montant de l'impôt de base.

      b)   Réduction pour enfants à charge

14.   La réduction pour enfants à charge doit être octroyée sur la base des données
      reprises dans le tableau de l'annexe 3.

      c)   Réductions pour autres charges de famille

15.   Ces réductions sont spécifiées par nature et par montant dans les tableaux des
      annexes 4 et 5.




                                         -8-
                                                                                      ESS-SR/2025-0928




              Annexe 4

              Les réductions y spécifiées sont applicables uniquement lorsque le bénéficiaire des
              revenus est un isolé ou lorsque le conjoint du bénéficiaire des revenus bénéficie
              également de revenus professionnels propres1.

              Annexe 5

              Ces réductions sont uniquement applicables lorsque le conjoint du bénéficiaire des
              revenus N'A PAS de revenus professionnels propres1.




              D.     PRECOMPTE PROFESSIONNEL MENSUEL


16.           Au terme des opérations dont il vient d'être question, on obtient le montant de l'impôt
              annuel (voir n° 9).

              Pour déterminer le montant du Pr.P dû sur les rémunérations payées
              mensuellement, l'on doit diviser le montant de l'impôt annuel par 12.




              E.     AUTRES REDUCTIONS

              a) Généralités

              ➢      Le montant du précompte professionnel dû mensuellement et déterminé
                     conformément au n° 16 peut, le cas échéant, encore être diminué
                     successivement :
                     ▪    de la réduction pour cotisations personnelles versées :
                              o à une assurance de groupe ;
                              o à une assurance extra-légale contre la vieillesse ou le décès
                                prématuré ;
                              o en continuation à titre individuel d’un engagement de pension,
                                conformément à l’article 1453, alinéa 3, CIR 92 ;
                              o qui, en vertu de l’article 1453, alinéa 4, CIR 92, ont trait à la pension
                                libre complémentaire des travailleurs salariés ;
                     ▪    de la réduction pour rémunérations suite à la prestation de travail
                          supplémentaire donnant droit à un sursalaire ;


1     Voir toutefois l'exception au n° 11, a.

                                                     -9-
                                                                            ESS-SR/2025-0928


           ▪   de la réduction du précompte professionnel sur les rémunérations des
               personnes physiques à bas revenus, autres que les personnes qui,
               autrement qu'en vertu d'un contrat de travail, exécutent des prestations de
               travail dans le secteur public ;
           ▪   de la réduction du précompte professionnel sur les rémunérations des
               travailleurs et des dirigeants d’entreprise à bas revenus qui ont droit au
               bonus à l’emploi.


      b)   Réduction pour assurance de groupe, pour assurance extra-légale contre la
           vieillesse et le décès prématuré et pour des retenues opérées conformément
           à l’article 1453, alinéas 3 et 4, CIR 92

17.   Le précompte professionnel dû mensuellement visé au n° 16 peut le cas échéant
      encore être diminué à concurrence de 30 p.c. :
      ▪    des retenues obligatoires opérées en exécution d'un contrat d'assurance de
           groupe ;
      ▪    des retenues obligatoires opérées en exécution d'un règlement de prévoyance
           extra-légal d'assurance contre la vieillesse et le décès prématuré ;
      ▪    de retenues qui ont trait à la continuation à titre individuel d‘un engagement de
           pension, conformément à l’article 1453, alinéa 3, CIR 92 ;
      ▪    de retenues qui, en vertu de l’article 1453, alinéa 4, CIR 92, ont trait à la pension
           libre complémentaire des travailleurs salariés.


      c)   Réduction pour rémunérations suite à la prestation de travail supplémentaire
           donnant droit à un sursalaire

18.   Cette réduction s’applique aux travailleurs qui ont presté, pendant la période
      imposable, un travail supplémentaire qui donne droit à un sursalaire en vertu de
      l'article 29 de la loi sur le travail du 16 mars 1971 ou de l'article 7 de l'arrêté royal
      n° 213 du 26 septembre 1983 relatif à la durée du travail dans les entreprises
      ressortissant à la commission paritaire de la construction et qui :
      ▪    soit sont soumis à la loi sur le travail du 16 mars 1971 et occupés par un
           employeur soumis à la loi du 5 décembre 1968 relative aux conventions
           collectives de travail et aux commissions paritaires ;
      ▪    soit sont occupés, sous statut ou avec un contrat de travail, par une des
           entreprises publiques autonomes suivantes : la société anonyme de droit
           public Proximus, la société anonyme de droit public bpost, la société
           anonyme de droit public SNCB et la société anonyme de droit public
           Infrabel ;
      ▪    soit sont occupés, sous statut ou avec un contrat de travail, par la société
           anonyme de droit public HR Rail.


                                          - 10 -
                                                                          ESS-SR/2025-0928


      Cette réduction ne s’applique qu’à la base de calcul du sursalaire relatif aux 130
      premières heures de travail supplémentaire que le travailleur a prestées.

      Le maximum de 130 heures de travail supplémentaire visé à l’alinéa 2 est porté à
      180 heures pour les travailleurs employés par des employeurs qui exécutent des
      travaux immobiliers à condition que ces derniers utilisent un système électronique
      d’enregistrement de présence visé au chapitre V, section 4, de la loi du 4 août 1996
      relative au bien-être des travailleurs lors de l’exécution de leur travail.

      Le maximum de 130 heures de travail supplémentaire déterminé à l’alinéa 2 est
      porté à 360 heures pour les travailleurs employés par des employeurs qui
      ressortent de la commission paritaire de l’industrie hôtelière ou de la commission
      paritaire du travail intérimaire si l’utilisateur ressort de la commission paritaire de
      l’industrie hôtelière.

      Le maximum de 130 heures de travail supplémentaire déterminé à l'alinéa 2 est
      porté à 280 heures pour les travailleurs occupés par des employeurs qui effectuent
      principalement des travaux routiers, à l'exclusion des travaux de pose de
      canalisations souterraines et de câbles, ou des travaux ferroviaires et pour lesquels
      les autorités imposent de travailler le week-end, les jours fériés ou la nuit, à
      condition que ces employeurs utilisent un système électronique d'enregistrement
      de présence visé au chapitre V, section 4, de la loi du 4 août 1996 relative au bien-
      être des travailleurs lors de l'exécution de leur travail et à condition que et dans la
      mesure où ces travailleurs aient effectivement effectué des travaux routiers ou
      ferroviaires pour lesquels les autorités imposent de travailler le week-end, les jours
      fériés ou la nuit pendant les heures supplémentaires prestées pour ces employeurs.

      La réduction n’est pas applicable au travail supplémentaire qui entre en
      considération pour l’application de l’article 38, § 1er, alinéa 1er, 30°, CIR 92.
      La réduction s’applique sur le précompte professionnel mensuellement dû visé au
      n° 16 et après application du n° 18, et est égale à :
      -    pour une heure prestée à laquelle s'applique un sursalaire légal de 50 ou
           100 p.c. : 57,75 p.c. ;
      -    pour une heure prestée à laquelle s'applique un sursalaire légal de 20 p.c. :
           66,81 p.c.,
      du "montant brut social" des rémunérations (donc avant déduction des retenues
      obligatoires effectuées en exécution de la législation sociale ou d'un statut légal ou
      réglementaire y assimilé), qui a servi de base de calcul pour établir le sursalaire.


          d)       Réduction du précompte professionnel sur les rémunérations des
           personnes physiques à bas revenus, autres que les personnes qui, autrement
           qu'en vertu d'un contrat de travail, exécutent des prestations de travail dans le
          secteur public

19.   La réduction ci-visée doit être appliquée comme suit :

                                         - 11 -
                                                                         ESS-SR/2025-0928


      Il est accordé une réduction aux personnes qui, en tant que statutaires, stagiaires
      ou temporaires, sont au service de l'Etat, des Communautés, des Régions, des
      provinces et établissements subordonnés aux provinces, des communes et
      établissements subordonnés aux communes, et qui ne sont pas engagées en
      vertu d'un contrat de travail, et qui obtiennent au moins une rémunération
      mensuelle imposable de 742,26 EUR et 2.722,91 EUR maximum.

      La réduction est appliquée sur le précompte professionnel mensuellement dû
      visé au no 16 et après application des nos 17 et 18, et est égale à 7,50 EUR.



      e)   Réduction du précompte professionnel sur les rémunérations des travailleurs
           et des dirigeants d’entreprise à bas revenus qui ont droit au bonus à l’emploi

20.   La réduction ci-visée doit être appliquée comme suit :

      Il est accordé une réduction aux travailleurs et dirigeants d’entreprise qui ont droit
      au bonus à l’emploi en vertu de l'article 2 de la loi du 20 décembre 1999 visant à
      octroyer un bonus à l’emploi sous la forme d’une réduction des cotisations
      personnelles de sécurité sociale aux travailleurs salariés ayant un bas salaire et à
      certains travailleurs qui ont été victimes d’une restructuration.

      La réduction est appliquée sur le précompte professionnel mensuellement dû visé
      au no 16 et après application des n°s 17 à 19, et est égale :

       •   33,14 p.c. du montant du volet A du bonus à l’emploi réellement accordé en
           application de l'article 2, § 1/1, de la loi du 20 décembre 1999 visant à
           octroyer un bonus à l'emploi aux travailleurs salariés ayant un bas salaire et
           d'autres réductions des cotisations personnelles de sécurité sociale ;

       •   52,54 p.c. du montant du volet B du bonus à l’emploi réellement accordé en
           application de l'article 2, § 1/2, de la loi du 20 décembre 1999 précitée.



      f)   Limitation des réductions

21.   L'application des réductions ne peut pas aboutir à ce que le précompte
      professionnel devienne négatif.




                                        - 12 -
                                                                        ESS-SR/2025-0928



[... Hoofdstuk 2 (anders dan per maand), Deel II en Deel III: buiten scope, niet overgenomen / hors scope, non repris ...]


                                      BAREME DE BASE




REVENU PROFESSIONNEL IMPUTE                                         IMPOT DE BASE
   ET REVENU ANNUEL NET
IMPOSABLE DIMINUE DU REVENU
          IMPUTE

de 0,01 EUR à            16.710 EUR   26,75 p.c.

de 16.710,01 EUR à       29.500 EUR   4.469,93 EUR + 42,80 p.c. de la tranche au-delà de   16.710 EUR

de 29.500,01 EUR à       51.050 EUR   9.944,05 EUR + 48,15 p.c. "       "                  29.500 EUR

supérieur à 51.050 EUR                20.320,38 EUR + 53,50 p.c. "          "              51.050 EUR
                                                                   ESS-SR/2025-0928
                                                                           Annexe 2



            PERSONNES VISEES A LA PARTIE I, N° 10


              NOTIONS EN MATIERE DE REDUCTION

1°   Handicapés

a)   Enfant handicapé

     Par "enfant handicapé", il faut entendre :

     -    l'enfant atteint à 66 p.c. au moins d'une insuffisance ou diminution de
          capacité physique ou psychique du chef d'une ou de plusieurs affections ;

     -    l'enfant dont il est établi, indépendamment de son âge, qu'en raison de
          faits survenus et constatés avant l'âge de 65 ans :

          a) soit son état physique ou psychique a réduit sa capacité de gain à un
             tiers ou moins de ce qu'une personne valide est en mesure de gagner
             en exerçant une profession sur le marché général du travail ;

          b) soit son état de santé provoque un manque total d'autonomie ou une
             réduction d'autonomie d'au moins 9 points, mesurés conformément
             aux guide et échelle médico-sociale applicables dans le cadre de la
             législation relative aux allocations aux handicapés ;

          c) soit, après la période d'incapacité primaire prévue à l'article 87 de la
             loi coordonnée relative à l'assurance obligatoire soins de santé et
             indemnités, sa capacité de gain est réduite à un tiers ou moins comme
             prévu à l'article 100 de la même loi coordonnée ;

          d) soit, par une décision administrative ou judiciaire, qu'il est handicapé
             physiquement ou psychiquement ou en incapacité de travail de façon
             permanente pour au moins 66 p.c.
                                                                    ESS-SR/2025-0928
                                                                            Annexe 2
b)   Autre personne handicapée

     Par "autre personne handicapée", il faut entendre :

     -   celle dont il a été établi, avant le 1er janvier 1989, qu'elle est atteinte à
         66 p.c. au moins d'une insuffisance ou diminution de capacité physique ou
         psychique du chef d'une ou de plusieurs affections ;

     -   celle dont il est établi, indépendamment de son âge, qu'en raison de faits
         survenus et constatés avant l'âge de 65 ans :

          a) soit son état physique ou psychique a réduit sa capacité de gain à un
             tiers ou moins de ce qu'une personne valide est en mesure de gagner
             en exerçant une profession sur le marché général du travail ;

          b) soit son état de santé provoque un manque total d'autonomie ou une
             réduction d'autonomie d'au moins 9 points, mesurés conformément
             aux guide et échelle médico-sociale applicables dans le cadre de la
             législation relative aux allocations aux handicapés ;

          c) soit, après la période d'incapacité primaire prévue à l'article 87 de la
             loi coordonnée relative à l'assurance obligatoire soins de santé et
             indemnités, sa capacité de gain est réduite à un tiers ou moins comme
             prévu à l'article 100 de la même loi coordonnée ;

          d) soit, par une décision administrative ou judiciaire, qu'elle est
             handicapée physiquement ou psychiquement ou en incapacité de
             travail de façon permanente pour au moins 66 p.c.


2°   Lorsqu'un enfant à charge ou une personne à charge visée à l'article 136, 2° à
     4°, CIR 92 décède, la réduction pour cet enfant ou cette personne est
     consentie jusqu'à la fin de l'année du décès.


3°   Lorsque les deux conjoints recueillent des revenus professionnels propres, les
     réductions pour enfants à charge et pour autres charges de famille, à
     l'exception de celle pour le conjoint handicapé, sont accordées au conjoint
     choisi par eux ;

     La réduction pour le conjoint handicapé est accordée à l’intéressé même.
                                                                     ESS-SR/2025-0928
                                                                             Annexe 2

4°   Situation de dépendance

     Pour l'application de l’article 132, alinéa 1er, 7°, CIR 92 est considérée comme
     étant en situation de dépendance la personne pour laquelle le degré
     d'autonomie est évalué à au moins 9 points conformément à l'arrêté ministériel
     du 30 juillet 1987 fixant les catégories et le guide pour l'évaluation du degré
     d'autonomie en vue de l'examen du droit à l'allocation d'intégration. La situation
     de dépendance est constatée par la Direction générale Personnes
     handicapées du SPF Sécurité sociale, Medex ou le médecin-conseil auprès
     de la mutualité, ou une institution ou personne similaire d'un autre Etat membre
     de l'Espace économique européen.
                                                                     ESS-SR/2025-0928
                                                                             Annexe 3



                     PERSONNES VISEES A LA PARTIE I, N° 11


                      REDUCTION POUR ENFANTS A CHARGE



   NOMBRE D'ENFANTS                      REDUCTION DE L'IMPOT DE BASE
     A CHARGE (1)

               1                                         624 EUR

               2                                        1.656 EUR

               3                                        4.404 EUR

               4                                        7.620 EUR

               5                                       11.100 EUR

               6                                       14.592 EUR

               7                                       18.120 EUR

               8                                       21.996 EUR

plus de 8 :   l'impôt de base est réduit d'un montant fixe de 21.996 EUR, majoré de
              3.864 EUR par enfant à charge au-delà du huitième, c.-à-d. :
              pour 9 enfants : 21.996 + (1 x 3.864) = 25.860 EUR
              pour 10 enfants: 21.996 + (2 x 3.864) = 29.724 EUR
              etc.
(1) l'enfant handicapé à charge est compté pour deux
                                                                                        ESS-SR/2025-0928
                                                                                                Annexe 4

                           PERSONNES VISEES A LA PARTIE I, N° 11

             REDUCTIONS POUR AUTRES CHARGES DE FAMILLE APPLICABLES :
             -  LORSQUE LE BENEFICIAIRE DES REVENUS EST UN ISOLE ;
             -  LORSQUE LE CONJOINT DU BENEFICIAIRE DES REVENUS A
                EGALEMENT DES REVENUS PROFESSIONNELS PROPRES.



                      MOTIF DE LA REDUCTION                                      MONTANT ANNUEL
                                                                                  EN EURO DE LA
                                                                                  REDUCTION (1)
1.   le bénéficiaire des revenus est un veuf (une veuve) non remarié(e),                624 EUR
     un père (une mère) célibataire, ou un parent divorcé ou séparé de
     fait, avec un ou plusieurs enfants à charge :
2.   le bénéficiaire des revenus est lui-même handicapé :                               624 EUR
3.   le bénéficiaire des revenus a à sa charge des personnes visées à                  1.992 EUR
     l'article 136, 2° et 3°, CIR 92 qui sont dans une situation de
     dépendance et qui ont atteint l’âge de 66 ans (par personne) (2) :
4.   le bénéficiaire des revenus a à sa charge des personnes visées à                   624 EUR
     l'article 136, 2° à 4°, CIR 92 autres que celles visées au point 3 ci-
     avant (par personne) (3) :
5.   le conjoint du bénéficiaire des revenus a des revenus                             1.740 EUR
     professionnels propres, autres que des pensions, rentes ou
     revenus y assimilés, qui ne dépassent pas 290 EUR NETS par
     mois (4) :
6.   le conjoint du bénéficiaire des revenus a des revenus                             3.474 EUR
     professionnels propres qui sont exclusivement constitués de
     pensions, rentes ou revenus y assimilés, qui ne dépassent pas
     579 EUR NETS par mois (4) :

(1) toutes les réductions peuvent être cumulées.
(2) est considérée comme étant en situation de dépendance la personne pour laquelle le degré
    d'autonomie est évalué à au moins 9 points conformément à l'arrêté ministériel du 30 juillet 1987
    fixant les catégories et le guide pour l'évaluation du degré d'autonomie en vue de l'examen du droit
    à l'allocation d'intégration. La situation de dépendance est constatée par la Direction générale
    Personnes handicapées du SPF Sécurité sociale, Medex ou le médecin-conseil auprès de la
    mutualité, ou une institution ou personne similaire d'un autre Etat membre de l'Espace économique
    européen.
(3) la personne handicapée à charge est comptée pour deux.
(4) pour apprécier les limites de 290 EUR et 579 EUR NETS par mois, il y a lieu d'envisager la situation
    au 1er janvier 2026 et de déterminer les revenus professionnels nets comme suit :
     1. diminuer les revenus professionnels bruts des retenues ou des cotisations obligatoires
        applicables en exécution de la législation sociale ou d'un statut légal ou réglementaire y assimilé ;
     2. diminuer ensuite la différence obtenue de 20 p.c.
                                                                                   ESS-SR/2025-0928
                                                                                           Annexe 5



                        PERSONNES VISEES A LA PARTIE I, N° 11


          REDUCTIONS POUR AUTRES CHARGES DE FAMILLE APPLICABLES
          LORSQUE LE CONJOINT DU BENEFICIAIRE DES REVENUS N'A PAS DE
          REVENUS PROFESSIONNELS PROPRES.




                   MOTIF DE LA REDUCTION                                   MONTANT ANNUEL
                                                                            EN EURO DE LA
                                                                            REDUCTION (1)

1.   le bénéficiaire des revenus est lui-même handicapé :                        624 EUR

2.   le conjoint du bénéficiaire des revenus est handicapé :                     624 EUR

3.   le bénéficiaire des revenus a à sa charge des personnes                    1.992 EUR
     visées à l'article 136, 2° et 3°, CIR 92 qui sont dans une
     situation de dépendance et qui ont atteint l’âge de 66 ans
     (par personne) (2) :

4.   le bénéficiaire des revenus a à sa charge des personnes                     624 EUR
     visées à l'article 136, 2° à 4°, CIR 92 autres que celles
     visées au point 3 ci-avant (par personne) (3) :

(1) toutes les réductions peuvent être cumulées.

(2) est considérée comme étant en situation de dépendance la personne pour laquelle le degré
    d'autonomie est évalué à au moins 9 points conformément à l'arrêté ministériel du 30 juillet 1987
    fixant les catégories et le guide pour l'évaluation du degré d'autonomie en vue de l'examen du
    droit à l'allocation d'intégration. La situation de dépendance est constatée par la Direction
    générale Personnes handicapées du SPF Sécurité sociale, Medex ou le médecin-conseil
    auprès de la mutualité, ou une institution ou personne similaire d'un autre Etat membre de
    l'Espace économique européen.

(3) la personne handicapée à charge est comptée pour deux.
```

## 4. SF11-NL — Sleutelformule vanaf 1 november 2026 (Deel I, Hoofdstuk 1 and Bijlagen)

```text
     INLEIDING


1.   Deze sleutelformule bestaat uit drie delen en vijf bijlagen (waarvan sommige een
     bis-versie hebben):

     DEEL I.      BEZOLDIGINGEN


     Dit deel bevat:

     -   de regels voor het berekenen van de BV op maandelijkse bezoldigingen (nrs.
         6 tot 21);

     -   de regels voor het berekenen van de BV op anders dan per maand betaalde
         bezoldigingen (nr. 22).



     DEEL II.     PENSIOENEN EVENALS WERKLOOSHEIDSUITKERINGEN MET
                  BEDRIJFSTOESLAG (VERMELD IN ARTIKEL 146 WIB 92)
                  BETAALD AAN RIJKSINWONERS


     Dit deel bevat de regels voor het berekenen van de BV op deze maandelijkse
     pensioenen en werkloosheidsuitkeringen met bedrijfstoeslag (nrs. 23 tot 36).



     DEEL III.    WERKLOOSHEIDSUITKERINGEN MET BEDRIJFSTOESLAG
                  (VERMELD IN ARTIKEL 146 WIB 92) BETAALD AAN NIET-
                  INWONERS


     Dit deel bevat de regels voor het berekenen van de BV op deze maandelijkse
     werkloosheidsuitkeringen met bedrijfstoeslag (nrs. 37 tot 43).




                                     -3-
                                                                  BEO-DR/2025-0928_v2


     BIJLAGEN

     De bijlagen bevatten de basisschaal (bijlage 1) en de tabellen en gegevens voor het
     berekenen van de verminderingen (bijlagen 2 tot 5bis) die moeten worden gebruikt
     overeenkomstig de in de delen I, II en III vermelde regels.

     BELANGRIJKE OPMERKINGEN

2.   Deze sleutelformule verschilt ten opzichte van de vorige sleutelformule (ESS/2025-
     0928, versie van januari 2026) als gevolg van de wijzigingen die zijn aangebracht
     door de wet van 15 juli 2026 tot hervorming van de personenbelasting.

3.   Voor de toepassing van deze sleutelformule, worden alle bedragen, in
     voorkomend geval in elke stap, afgerond tot de hogere of lagere cent,
     naargelang het cijfer van de duizendsten al dan niet 5 bereikt;

4.   De sleutelformule geldt alleen voor de BV verschuldigd op bezoldigingen en op in
     artikel 146 WIB 92 vermelde pensioenen of werkloosheidsuitkeringen met
     bedrijfstoeslag die periodiek worden betaald. In alle andere gevallen wordt de BV
     berekend volgens de schalen en de erbij horende regels die in bijlage III van het
     KB/WIB 92 zijn opgenomen.

5.   Bij de berekening van de BV zoals hierna aangegeven is reeds rekening gehouden
     met een verhoging van 7 pct. voor de aanvullende belastingen (gemeente- en
     agglomeratiebelasting).


                                 * * * * * * * *




                                       -4-
                                                                            BEO-DR/2025-0928_v2


DEEL I.     BEZOLDIGINGEN

            Hoofdstuk 1. BEREKENEN VAN DE BV OP MAANDELIJKSE BEZOLDIGINGEN

6.           De BV die bij betaling van maandelijkse bezoldigingen is verschuldigd, wordt in vijf
             stappen berekend.

             Deze vijf stappen zijn:

             A.      vaststellen van het bruto jaarinkomen;
             B.      omzetten van het bruto jaarinkomen in het belastbare netto jaarinkomen;
             C.      berekenen van de jaarbelasting;
             D.      berekenen van de bedrijfsvoorheffing op maandbasis;
             E.      toepassen van de andere verminderingen.


            A.       BRUTO JAARINKOMEN

7.           Om het bruto jaarinkomen vast te stellen moet men:

                  1° - het betaalde brutobedrag van de maandelijkse bezoldigingen
                       verminderen met de inhoudingen gedaan ter uitvoering van de sociale
                       wetgeving of een ermede gelijkgesteld wettelijk of reglementair statuut;

                       - het betaalde brutobedrag van de maandelijkse bezoldigingen van
                         bedrijfsleiders die onderworpen zijn aan het sociaal statuut van de
                         zelfstandigen, verminderen zoals aangegeven in onderstaande tabel:

          BRUTOBEDRAG VAN DE                                     VERMINDERING
       MAANDELIJKSE BEZOLDIGINGEN

     tot 1.465 EUR                         385 EUR

     van 1.465,01 EUR tot 6.310 EUR        385 EUR + 21,5 pct. op de schijf boven 1.465 EUR

     van 6.310,01 EUR tot 9.290 EUR        1.426,68 EUR + 14,50 pct. op de schijf boven 6.310 EUR

     boven 9.290 EUR                       1.858,78 EUR


                  2° het bekomen verschil vermenigvuldigen met 12.




                                                 -5-
                                                                             BEO-DR/2025-0928_v2




            B.     BELASTBARE NETTO JAARINKOMEN


8.           Het belastbare netto jaarinkomen is gelijk aan het bruto jaarinkomen verminderd
             met de forfaitaire beroepskosten. Die forfaitaire beroepskosten worden als volgt
             bepaald:

            1°     Bezoldigingen (wedden en lonen) van werknemers

                BRUTOJAARINKOMEN                                FORFAITAIRE BEROEPSKOSTEN

     tot 20.233,33 EUR                       30 pct.

     boven 20.233,33 EUR                     6.070 EUR (maximum)


            2°     Periodieke bezoldigingen van bedrijfsleiders

                   BRUTOJAARINKOMEN                               FORFAITAIRE BEROEPSKOSTEN

     Tot 106.666,67 EUR                                3 pct.

     boven 106.666,67 EUR                              3.200 EUR (maximum)




            C.     JAARBELASTING


9.           Om de jaarbelasting te bekomen moet men:

            -      op het belastbare netto jaarinkomen de basisbelasting berekenen;

            -      van de basisbelasting de verminderingen aftrekken.

             De jaarbelasting is dus gelijk aan de basisbelasting verminderd met de
             verminderingen.




                                                -6-
                                                                                      BEO-DR/2025-0928_v2


             1.    BASISBELASTING


10.          De basisbelasting wordt steeds berekend met behulp van de enige basisschaal die
             is opgenomen in bijlage 1.


11.          Afdeling 1.- A. Rijksinwoners
                          B. Niet-inwoners die bezoldigingen verkrijgen:
                             - voor in België geleverde arbeidsprestaties;
                             - ingevolge één of meerdere arbeidsovereenkomsten die
                                 het volledige kalenderjaar bestrijken;
                             - en voor zover die arbeidsprestaties ten minste 75 pct. van
                                 de wettelijk voorziene arbeidsduur per overeenkomst
                                 bedragen

             a)    De verkrijger van de inkomsten is een alleenstaande of de echtgenoot van
                   de verkrijger van de inkomsten heeft eveneens persoonlijke
                   beroepsinkomsten.

                   UITZONDERING
                   -----------------------
                   Wanneer nochtans de echtgenoot van de verkrijger van de inkomsten
                   persoonlijke beroepsinkomsten heeft die uitsluitend bestaan uit pensioenen,
                   renten of ermede gelijkgestelde inkomsten en die niet meer bedragen dan
                   174 EUR NETTO1 per maand, wordt, in afwijking van het vorige lid, de
                   basisbelasting berekend overeenkomstig punt b, hierna.

             De BASISBELASTING is gelijk aan de belasting berekend met behulp van de
             basisschaal en verminderd met 3.089,63 EUR (zijnde de belasting op een
             belastingvrije som ten bedrage van 11.550 EUR).

             b)    De echtgenoot van de verkrijger van de inkomsten heeft geen persoonlijke
                   beroepsinkomsten2.

                   *    Vooreerst wordt aan de echtgenoot van de verkrijger van de inkomsten een
                        beroepsinkomen toegekend dat gelijk is aan 30 pct. van het belastbare
                        netto jaarinkomen.

                       Het toegekende inkomen mag echter niet meer bedragen dan:
                           a) wanneer beide echtgenoten de leeftijd van 66 jaar hebben bereikt op
                           1 januari 2027: 12.790 EUR (maximum bereikt bij een nettobedrag van
                           de belastbare grondslag van 42.633,33 EUR);

1   Bij het beoordelen van de grens van 174 EUR NETTO per maand, moet de toestand per 1 januari 2026 in
    aanmerking worden genomen en moeten de netto beroepsinkomsten als volgt worden vastgesteld :
    1. de brutoberoepsinkomsten verminderen met de verplichte inhoudingen of bijdragen gedaan ter
         uitvoering van de sociale wetgeving of van een ermede gelijkgesteld wettelijk of reglementair statuut;
    2. vervolgens het bekomen verschil verminderen met 20 pct.
2    Zie echter de uitzondering onder nr. 11, a.
                                                     -7-
                                                                   BEO-DR/2025-0928_v2




                  b) in alle andere gevallen, ook wanneer de schuldenaar van de
                  bedrijfsvoorheffing niet over de nodige informatie beschikt om punt a)
                  toe te passen: 11.780 EUR (maximum bereikt bij een nettobedrag van
                  de belastbare grondslag van 39.266,67 EUR).

           *   Vervolgens wordt de belasting op dat toegekende inkomen berekend met
               behulp van de basisschaal (resultaat = belasting A).

           *   Daarna wordt de belasting (eveneens met behulp van de basisschaal)
               berekend op het verschil tussen het belastbare netto jaarinkomen en het
               deel daarvan dat aan de andere echtgenoot werd toegerekend (resultaat =
               belasting B).

           *   De BASISBELASTING tenslotte is gelijk aan de som van de twee
               belastingbedragen (som = belasting A + belasting B) verminderd met
               6.179,26 EUR (zijnde tweemaal de belasting op de belastingvrije som ten
               bedrage van 11.550 EUR).


12.   Afdeling 2. - Niet-inwoners die niet zijn vermeld in afdeling 1, B. hiervoor
                    (nr. 11).

      De BASISBELASTING is gelijk aan de belasting berekend met behulp van de
      basisschaal.


      2.   VERMINDERINGEN

      Voorafgaande opmerking

      Sommige begrippen met betrekking tot de verminderingen worden in bijlage 2
      toegelicht.

      a)   Algemeen
13.
      ➢    Van de basisbelasting vastgesteld overeenkomstig nr. 11 mogen, in
           voorkomend geval, worden afgetrokken:
           ▪   de verminderingen voor kinderen ten laste;
           ▪   de verminderingen voor andere gezinslasten.

           Alle verminderingen mogen worden samengevoegd zonder dat nochtans het
           totaal ervan het bedrag van de basisbelasting mag overtreffen.

      b)   Vermindering voor kinderen ten laste

14.   De vermindering voor kinderen ten laste moet worden toegekend op basis van de
      gegevens opgenomen in de tabel van bijlage 3bis.
                                        -8-
                                                                             BEO-DR/2025-0928_v2




               c)    Verminderingen voor andere gezinslasten

15.            Deze verminderingen zijn naar aard en bedrag gespecificeerd in de tabellen van
               bijlagen 4bis en 5bis.

               Bijlage 4bis

               De aldaar vermelde verminderingen zijn enkel van toepassing wanneer de
               verkrijger van de inkomsten een alleenstaande is of wanneer de echtgenoot van de
               verkrijger van de inkomsten eveneens persoonlijke beroepsinkomsten heeft1.

               Bijlage 5bis

               Die verminderingen zijn enkel van toepassing wanneer de echtgenoot van de
               verkrijger van de inkomsten GEEN persoonlijke beroepsinkomsten heeft1.


              D.     MAANDELIJKSE BEDRIJFSVOORHEFFING


16.           De verschillende bewerkingen waarvan hierboven sprake geven als uitkomst de
              jaarbelasting (zie nr. 9).

              Om het bedrag van de BV te bepalen die op de maandelijks betaalde
              bezoldigingen verschuldigd is, moet men het bedrag van de jaarbelasting delen
              door 12.


              E.     ANDERE VERMINDERINGEN


              a) Algemeen

              Van    de   maandelijkse   verschuldigde    bedrijfsvoorheffing vastgesteld
              overeenkomstig nr. 16 mogen, naar gelang van het geval, achtereenvolgens
              volgende verminderingen nog in mindering worden gebracht:
                    ▪    de vermindering ingevolge persoonlijke bijdragen:
                              o voor groepsverzekering;
                              o voor extrawettelijke verzekering tegen ouderdom of vroegtijdige
                                dood;
                              o die, overeenkomstig artikel 1453, derde lid, WIB 92, betrekking
                                hebben op de individuele voortzetting van een pensioentoezegging;
                              o die, overeenkomstig artikel 1453, vierde lid, WIB 92, betrekking
                                hebben op het vrij aanvullend pensioen van werknemers;

1     Zie echter de uitzondering onder nr. 11, a.

                                                    -9-
                                                                    BEO-DR/2025-0928_v2


           ▪   de vermindering voor bezoldigingen ingevolge het presteren van overwerk
               dat recht geeft op een overwerktoeslag;
           ▪   de vermindering van de bedrijfsvoorheffing op de bezoldigingen van
               natuurlijke personen met een laag inkomen die, anders dan krachtens een
               arbeidsovereenkomst, arbeid verrichten in de overheidssector;
           ▪   de vermindering van de bedrijfsvoorheffing op de bezoldigingen van
               werknemers en bedrijfsleiders met een laag inkomen die recht hebben op
               de werkbonus.


      b)   Vermindering voor groepsverzekering, voor extrawettelijke verzekering tegen
           ouderdom of vroegtijdige dood en voor inhoudingen overeenkomstig
           artikel 1453, derde en vierde lid, WIB 92

17.   De maandelijkse verschuldigde bedrijfsvoorheffing vastgesteld overeenkomstig
      nr. 16 mag, in voorkomend geval, verminderd worden met 30 pct. van:
      ▪    de verplichte inhoudingen ter uitvoering van een groepsverzekeringscontract;
      ▪    de verplichte inhoudingen ter uitvoering van een extrawettelijke
           voorzorgsregeling van verzekering tegen ouderdom en vroegtijdige dood;
      ▪    de inhoudingen die betrekking hebben op de individuele voortzetting van een
           pensioentoezegging overeenkomstig artikel 1453, derde lid, WIB 92;
      ▪    de inhoudingen die betrekking hebben op een vrij aanvullend pensioen voor
           werknemers overeenkomstig artikel 1453, vierde lid, WIB 92.


      c)   Vermindering voor bezoldigingen ingevolge het presteren van overwerk dat
           recht geeft op een overwerktoeslag

18.   Deze vermindering is van toepassing op werknemers die overwerk hebben
      gepresteerd dat, overeenkomstig artikel 29 van de arbeidswet van 16 maart 1971
      of artikel 7 van het koninklijk besluit nr. 213 van 26 september 1983 betreffende de
      arbeidsduur in de ondernemingen die onder het paritair comité voor het bouwbedrijf
      ressorteren, recht geeft op een overwerktoeslag en die:

      ▪    hetzij onderworpen zijn aan de arbeidswet van 16 maart 1971 en
           tewerkgesteld door een werkgever onderworpen aan de wet van
           5 december 1968 aangaande de collectieve arbeidsovereenkomsten en de
           paritaire comités;
      ▪    hetzij als contractuele of statutaire werknemers tewerkgesteld zijn door één
           van de volgende autonome overheidsbedrijven: de naamloze vennootschap
           van publiek recht Proximus, de naamloze vennootschap van publiek recht
           bpost, de naamloze vennootschap van publiek recht NMBS en de naamloze
           vennootschap van publiek recht Infrabel;
      ▪    hetzij als contractuele of statutaire werknemers tewerkgesteld zijn door de
           naamloze vennootschap van publiek recht HR Rail.


                                       - 10 -
                                                                     BEO-DR/2025-0928_v2


      Deze vermindering is slechts van toepassing op de berekeningsgrondslag voor
      de overwerktoeslag betreffende de eerste 180 uren die de werknemer als
      overwerk heeft gepresteerd.

      Het in het tweede lid bepaalde maximum van 180 uren overwerk wordt opgetrokken
      tot 360 uren voor de werknemers en de uitzendkrachten die respectievelijk
      tewerkgesteld zijn bij of ter beschikking gesteld zijn van werkgevers die ressorteren
      onder het paritair comité voor het hotelbedrijf of onder het paritair comité voor de
      uitzendarbeid indien de gebruiker ressorteert onder het paritair comité voor het
      hotelbedrijf.

      Het in het tweede lid bepaalde maximum van 180 uren overwerk wordt opgetrokken
      tot 280 uren voor de werknemers en de uitzendkrachten die respectievelijk
      tewerkgesteld zijn bij of ter beschikking gesteld zijn van werkgevers die
      hoofdzakelijk wegenwerken uitvoeren, met uitsluiting van het aanleggen van
      ondergrondse leidingen en kabels, of spoorwegwerken en voor wie de overheid
      oplegt om in het weekend, op feestdagen of `s nachts te werken, op voorwaarde
      dat die werkgevers gebruik maken van een in hoofdstuk V, afdeling 4, van de wet
      van 4 augustus 1996 betreffende het welzijn van de werknemers bij de uitvoering
      van hun werk bedoeld elektronisch aanwezigheidsregistratiesysteem en op
      voorwaarde en in de mate dat die werknemers daadwerkelijk wegenwerken of
      spoorwegwerken waarvoor de overheid oplegt om in het weekend, op feestdagen
      of `s nachts te werken hebben uitgevoerd tijdens de overuren die voor die
      werkgevers worden gepresteerd.

      De vermindering is niet van toepassing op het overwerk dat in aanmerking komt
      voor de toepassing van artikel 38, § 1, eerste lid, 29°/1 en 30°, WIB 92.

      De vermindering wordt toegepast op de maandelijkse verschuldigde
      bedrijfsvoorheffing vastgesteld overeenkomstig nr. 16 en na toepassing van nr.
      17, en bedraagt:
      -    voor een gepresteerd uur waarop een wettelijke overwerktoelage van 50 of
           100 pct. van toepassing is: 57,75 pct.;
      -    voor een gepresteerd uur waarop een wettelijke overwerktoeslag van 20 pct.
           van toepassing is: 66,81 pct.,
      van het "sociale brutobedrag" van de bezoldigingen (dit is vóór aftrek van de
      verplichte inhoudingen ter uitvoering van de sociale wetgeving of van een ermede
      gelijkgesteld wettelijk of reglementair statuut), dat als berekeningsgrondslag voor
      de berekening van de overwerktoeslag heeft gediend.


      d)   Vermindering van de bedrijfsvoorheffing op de bezoldigingen van natuurlijke
           personen met een laag inkomen die, anders dan krachtens een
           arbeidsovereenkomst, arbeid verrichten in de overheidssector

19.   De hier bedoelde vermindering moet als volgt worden toegepast:


                                        - 11 -
                                                                   BEO-DR/2025-0928_v2


      Er wordt een vermindering verleend aan personen die als statutair, stagiair of
      tijdelijke in dienst zijn bij de overheid, de gemeenschappen, de gewesten, de
      provincies, inrichtingen die aan de provincies ondergeschikt zijn, de gemeenten en
      inrichtingen die aan de gemeenten ondergeschikt zijn, en die niet in het kader van
      een arbeidsovereenkomst zijn aangeworven, en een belastbare maandbezoldiging
      verkrijgen van minstens 742,26 EUR en maximum 2.722,91 EUR.

      De vermindering wordt toegepast op de maandelijkse verschuldigde
      bedrijfsvoorheffing vastgesteld overeenkomstig nr. 16 en na toepassing van nrs.
      17 en 18, en bedraagt 7,50 EUR.


      e)   Vermindering van de bedrijfsvoorheffing op de bezoldigingen van werknemers
           en bedrijfsleiders met een laag inkomen die recht hebben op de werkbonus

20.   De hier bedoelde vermindering moet als volgt worden toegepast:

      Er wordt een vermindering verleend aan de werknemers en bedrijfsleiders die recht
      hebben op een werkbonus overeenkomstig artikel 2 van de wet van 20 december
      1999 tot toekenning van een werkbonus onder de vorm van een vermindering van
      de persoonlijke bedragen van sociale zekerheid aan werknemers met lage lonen
      en aan sommige werknemers die het slachtoffer waren van een herstructurering.

      De vermindering wordt toegepast op de maandelijkse verschuldigde
      bedrijfsvoorheffing vastgesteld overeenkomstig nr. 16 en na toepassing van nrs.
      17 tot 19, en bedraagt:

           •   33,14 pct. van het bedrag van het luik A van de werkbonus dat
               daadwerkelijk is verleend met toepassing van artikel 2, § 1/1, van de wet
               van 20 december 1999 tot toekenning van een werkbonus aan werknemers
               met lage lonen en van andere verminderingen van de persoonlijke
               bijdragen van sociale zekerheid;

           •   63 pct. van het bedrag van het luik B van de werkbonus dat daadwerkelijk
               is verleend met toepassing van artikel 2, § 1/2, van de voormelde wet van
               20 december 1999.


      f)   Beperking van de verminderingen

21.   De toepassing van de verminderingen kan er niet toe leiden dat de
      bedrijfsvoorheffing negatief wordt.




                                       - 12 -
                                                                   BEO-DR/2025-0928_v2



[... Hoofdstuk 2 (anders dan per maand), Deel II en Deel III: buiten scope, niet overgenomen / hors scope, non repris ...]

                                                     - 22 -
                                     BASISSCHAAL




TOEGEKEND BEROEPSINKOMEN EN
BELASTBAAR NETTO JAARINKOMEN                                 BASISBELASTING
MINUS TOEGEREKEND INKOMEN

van 0,01 EUR tot        16.710 EUR   26,75 pct.

van 16.710,01 EUR tot   29.500 EUR   4.469,93 EUR + 42,80 pct.   op de schijf boven   16.710 EUR

van 29.500,01 EUR tot   51.050 EUR   9.944,05 EUR + 48,15 pct.   "     "              29.500 EUR

boven 51.050 EUR                     20.320,38 EUR + 53,50 pct. "      "              51.050 EUR




                                                                                                   BEO-DR/2025-0928_v2
                                                                                                               Bijlage 1
                                                               BEO-DR/2025-0928_v2
                                                                         Bijlage 2/1



                   PERSONEN VERMELD IN DEEL I, NR. 10


         BEGRIPPEN IN VERBAND MET VERMINDERING


1°   Personen met een handicap

a)   Kind met een handicap

     Hieronder wordt verstaan:

     -    het kind dat voor ten minste 66 pct. getroffen is door ontoereikendheid of
          vermindering van lichamelijke of psychische geschiktheid wegens één of
          meer aandoeningen;

     -    het kind van wie, ongeacht de leeftijd, is vastgesteld dat ingevolge feiten
          overkomen en vastgesteld vóór de leeftijd van 65 jaar:

          a) ofwel zijn lichamelijke of psychische toestand zijn verdienvermogen
             heeft verminderd tot één derde of minder van wat een valide persoon
             door een of ander beroep op de algemene arbeidsmarkt kan
             verdienen;

          b) ofwel zijn gezondheidstoestand een volledig gebrek aan of een
             vermindering van zelfredzaamheid van ten minste 9 punten met zich
             brengt, gemeten volgens de handleiding en de medisch-sociale
             schaal van toepassing in het kader van de wetgeving met betrekking
             tot de tegemoetkomingen aan personen met een handicap;

          c) ofwel, na de periode van primaire ongeschiktheid bepaald in artikel 87
             van de gecoördineerde wet betreffende de verplichte verzekering voor
             geneeskundige verzorging en uitkeringen, zijn verdienvermogen is
             verminderd tot een derde of minder, zoals bepaald in artikel 100 van
             dezelfde gecoördineerde wet;

          d) ofwel hij, ingevolge een administratieve of gerechtelijke beslissing,
             voor tenminste 66 pct. blijvend fysiek of psychisch gehandicapt of
             arbeidsongeschikt werd verklaard.
                                                               BEO/DR/2025-0928_v2
                                                                         Bijlage 2/2

b)   Andere persoon met een handicap

     Hieronder wordt verstaan:

     -   diegene van wie vóór 1 januari 1989 werd vastgesteld dat hij voor ten
         minste 66 pct. getroffen is door ontoereikendheid of vermindering van
         lichamelijke of psychische geschiktheid wegens één of meer
         aandoeningen;

     -   diegene van wie, ongeacht de leeftijd, is vastgesteld dat ingevolge feiten
         overkomen en vastgesteld vóór de leeftijd van 65 jaar:

          a) ofwel zijn lichamelijke of psychische toestand zijn verdienvermogen
             heeft verminderd tot één derde of minder van wat een valide persoon
             door een of ander beroep op de algemene arbeidsmarkt kan
             verdienen;

          b) ofwel zijn gezondheidstoestand een volledig gebrek aan of een
             vermindering van zelfredzaamheid van ten minste 9 punten met zich
             brengt, gemeten volgens de handleiding en de medisch-sociale
             schaal van toepassing in het kader van de wetgeving met betrekking
             tot de tegemoetkomingen aan personen met een handicap;

          c) ofwel, na de periode van primaire ongeschiktheid bepaald in artikel 87
             van de gecoördineerde wet betreffende de verplichte verzekering voor
             geneeskundige verzorging en uitkeringen, zijn verdienvermogen is
             verminderd tot een derde of minder, zoals bepaald in artikel 100 van
             dezelfde gecoördineerde wet;

          d) ofwel hij, ingevolge een administratieve of gerechtelijke beslissing,
             voor ten minste 66 pct. blijvend fysiek of psychisch gehandicapt of
             arbeidsongeschikt werd verklaard.


2°   Wanneer een kind ten laste of een in artikel 136, 2° tot 4°, WIB 92 bedoelde
     persoon ten laste overlijdt, wordt de vermindering voor dat kind of die persoon
     verder toegestaan tot het einde van het jaar van overlijden.

3°   Wanneer beide echtgenoten persoonlijke beroepsinkomsten hebben, worden
     de verminderingen voor kinderen ten laste en voor andere gezinslasten,
     behalve die voor de echtgenoot met een handicap, aan de door hen gekozen
     echtgenoot verleend;

     De vermindering voor de echtgenoot met een handicap, wordt aan de
     betrokkene zelf toegekend.
                                                                BEO/DR/2025-0928_v2
                                                                          Bijlage 2/3



4°   Zorgbehoevend

     Voor de toepassing van artikel 132, eerste lid, 7°, WIB 92 wordt als
     zorgbehoevend aangemerkt, de persoon voor wie de graad van
     zelfredzaamheid op ten minste 9 punten werd vastgesteld krachtens het
     ministerieel besluit van 30 juli 1987 tot vaststelling van de categorieën en van
     de handleiding voor de evaluatie van de graad van zelfredzaamheid met het
     oog op het onderzoek naar het recht op de integratietegemoetkoming. De
     zorgbehoevendheid wordt vastgesteld door de Directie-generaal Personen
     met een handicap van de FOD Sociale Zekerheid, Medex of de adviserend
     geneesheer bij het ziekenfonds of een gelijkwaardige instelling of persoon uit
     een andere lidstaat van de Europese Economische Ruimte.
                                                                    BEO/DR/2025-0928_v2
                                                                                Bijlage 3

                     PERSONEN VERMELD IN DEEL I, NR. 11


                  VERMINDERING VOOR KINDEREN TEN LASTE

AANTAL KINDEREN TEN LASTE (1)           VERMINDERING VAN DE BASISBELASTING
              1                                        624 EUR

              2                                      1.656 EUR

              3                                      4.404 EUR

              4                                      7.620 EUR

              5                                     11.100 EUR

              6                                      14.592EUR

              7                                     18.120 EUR

              8                                     21.996 EUR

meer dan 8:   de basisbelasting wordt verminderd met een vast bedrag van
              21.996 EUR, verhoogd met 3.864 EUR per kind ten laste boven het
              achtste, d.w.z.:
              voor 9 kinderen: 21.996 + (1 x 3.864) = 25.860 EUR
              voor 10 kinderen: 21.996 + (2 x 3.864) = 29.724 EUR
              enz.
(1) het kind met een handicap ten laste wordt voor twee gerekend.
                                                                    BEO/DR/2025-0928_v2
                                                                             Bijlage 3bis

                     PERSONEN VERMELD IN DEEL I, NR. 11


                  VERMINDERING VOOR KINDEREN TEN LASTE

AANTAL KINDEREN TEN LASTE (1)           VERMINDERING VAN DE BASISBELASTING
              1                                        684 EUR

              2                                      1.644 EUR

              3                                      4.344 EUR

              4                                      7.488 EUR

              5                                     10.884 EUR

              6                                     14.292 EUR

              7                                     17.712 EUR

              8                                     21.492 EUR

meer dan 8:   de basisbelasting wordt verminderd met een vast bedrag van
              21.492 EUR, verhoogd met 3.780 EUR per kind ten laste boven het
              achtste, d.w.z.:
              voor 9 kinderen: 21.492 + (1 x 3.780) = 25.272 EUR
              voor 10 kinderen: 21.492 + (2 x 3.780) = 29.052 EUR
              enz.
(1) het kind met een handicap ten laste wordt voor twee gerekend.
                                                                                   BEO/DR/2025-0928_v2
                                                                                               Bijlage 4

                             PERSONEN VERMELD IN DEEL I, NR. 11

 VERMINDERINGEN VOOR ANDERE GEZINSLASTEN VAN TOEPASSING:
        -   OFWEL WANNEER DE VERKRIJGER VAN DE INKOMSTEN EEN
            ALLEENSTAANDE IS;
        -   OFWEL WANNEER DE ECHTGENOOT VAN DE VERKRIJGER VAN DE
            INKOMSTEN EVENEENS PERSOONLIJKE BEROEPSINKOMSTEN
            HEEFT.


                  GROND VAN DE VERMINDERING                                     JAARBEDRAG IN EURO
                                                                              VAN DE VERMINDERING (1)
1.   de verkrijger van de inkomsten is een niet hertrouwde weduwnaar                  624 EUR
     (weduwe), een ongehuwde vader (moeder), of een
     echtgescheiden of feitelijk gescheiden ouder, met één of meer
     kinderen ten laste:

2.   de verkrijger van de inkomsten is zelf gehandicapt:                              624 EUR

3.   de verkrijger van de inkomsten heeft in artikel 136, 2° en 3° van het           1.992 EUR
     WIB 92 bedoelde personen ten laste die de leeftijd van 66 jaar
     hebben bereikt en zorgbehoevend zijn, per persoon (2):

4.   de verkrijger van de inkomsten heeft in artikel 136, 2° tot 4° van het           624 EUR
     WIB 92 bedoelde personen, andere dan diegenen vermeld onder
     punt 3 hiervoor, ten laste, per persoon (3):

5.   de echtgenoot van de verkrijger van de inkomsten heeft                          1.740 EUR
     persoonlijke beroepsinkomsten, andere dan pensioenen, renten of
     ermede gelijkgestelde inkomsten, die niet meer bedragen dan
     290 EUR NETTO per maand (4):

6.   de echtgenoot van de verkrijger van de inkomsten heeft                          3.474 EUR
     persoonlijke beroepsinkomsten die uitsluitend bestaan uit
     pensioenen, renten of ermede gelijkgestelde inkomsten en die niet
     meer bedragen dan 579 EUR NETTO per maand (4):

(1) alle verminderingen mogen worden samengevoegd.

(2) wordt als zorgbehoevend aangemerkt, de persoon voor wie de graad van zelfredzaamheid op ten
    minste 9 punten werd vastgesteld krachtens het ministerieel besluit van 30 juli 1987 tot vaststelling
    van de categorieën en van de handleiding voor de evaluatie van de graad van zelfredzaamheid met
    het oog op het onderzoek naar het recht op de integratietegemoetkoming. De zorgbehoevendheid
    wordt vastgesteld door de Directie-generaal Personen met een handicap van de FOD Sociale
    Zekerheid, Medex of de adviserend geneesheer bij het ziekenfonds of een gelijkwaardige instelling
    of persoon uit een andere lidstaat van de Europese Economische Ruimte.

(3) de persoon met een handicap ten laste wordt voor twee gerekend.

(4) bij het beoordelen van de grenzen van 290 EUR en 579 EUR NETTO per maand, moet de toestand
    per 1 januari 2026 in aanmerking worden genomen en dienen de netto beroepsinkomsten als volgt
    te worden vastgesteld:
                                                                      BEO/DR/2025-0928_v2
                                                                                  Bijlage 4
1.   de bruto beroepsinkomsten verminderen met de verplichte inhoudingen of bijdragen gedaan
     ter uitvoering van de sociale wetgeving of van een ermede gelijkgesteld wettelijk of
     reglementair statuut;

2.   vervolgens het bekomen verschil verminderen met 20 pct.
                                                                                   BEO-DR/202-0928_v2
                                                                                           Bijlage 4bis

                            PERSONEN VERMELD IN DEEL I, NR. 11

 VERMINDERINGEN VOOR ANDERE GEZINSLASTEN VAN TOEPASSING:
        -   OFWEL WANNEER DE VERKRIJGER VAN DE INKOMSTEN EEN
            ALLEENSTAANDE IS;
        -   OFWEL WANNEER DE ECHTGENOOT VAN DE VERKRIJGER VAN DE
            INKOMSTEN EVENEENS PERSOONLIJKE BEROEPSINKOMSTEN
            HEEFT.


                  GROND VAN DE VERMINDERING                                    JAARBEDRAG IN EURO
                                                                             VAN DE VERMINDERING (1)
1.   de verkrijger van de inkomsten is een niet hertrouwde weduwnaar                 636 EUR
     (weduwe), een ongehuwde vader (moeder), of een
     echtgescheiden of feitelijk gescheiden ouder, met één of meer
     kinderen ten laste:

2.   de verkrijger van de inkomsten is zelf gehandicapt:                             648 EUR

3.   de verkrijger van de inkomsten heeft in artikel 136, 2° en 3° van het          1.992 EUR
     WIB 92 bedoelde personen ten laste die de leeftijd van 66 jaar
     hebben bereikt en zorgbehoevend zijn, per persoon (2):

4.   de verkrijger van de inkomsten heeft in artikel 136, 2° tot 4° van              636 EUR
     het WIB 92 bedoelde personen, andere dan diegenen vermeld
     onder punt 3 hiervoor, ten laste, per persoon (3):

5.   de echtgenoot van de verkrijger van de inkomsten heeft                         1.740 EUR
     persoonlijke beroepsinkomsten, andere dan pensioenen, renten
     of ermede gelijkgestelde inkomsten, die niet meer bedragen dan
     290 EUR NETTO per maand (4):

6.   de echtgenoot van de verkrijger van de inkomsten heeft                         3.474 EUR
     persoonlijke beroepsinkomsten die uitsluitend bestaan uit
     pensioenen, renten of ermede gelijkgestelde inkomsten en die
     niet meer bedragen dan 579 EUR NETTO per maand (4):

(1) alle verminderingen mogen worden samengevoegd.

(2) wordt als zorgbehoevend aangemerkt, de persoon voor wie de graad van zelfredzaamheid op ten
    minste 9 punten werd vastgesteld krachtens het ministerieel besluit van 30 juli 1987 tot vaststelling
    van de categorieën en van de handleiding voor de evaluatie van de graad van zelfredzaamheid met
    het oog op het onderzoek naar het recht op de integratietegemoetkoming. De zorgbehoevendheid
    wordt vastgesteld door de Directie-generaal Personen met een handicap van de FOD Sociale
    Zekerheid, Medex of de adviserend geneesheer bij het ziekenfonds of een gelijkwaardige instelling
    of persoon uit een andere lidstaat van de Europese Economische Ruimte.

(3) de persoon met een handicap ten laste wordt voor twee gerekend.

(4) bij het beoordelen van de grenzen van 290 EUR en 579 EUR NETTO per maand, moet de toestand
    per 1 januari 2026 in aanmerking worden genomen en dienen de netto beroepsinkomsten als volgt
    te worden vastgesteld:
                                                                       BEO-DR/202-0928_v2
                                                                               Bijlage 4bis

1.   de bruto beroepsinkomsten verminderen met de verplichte inhoudingen of bijdragen gedaan
     ter uitvoering van de sociale wetgeving of van een ermede gelijkgesteld wettelijk of
     reglementair statuut;

2.   vervolgens het bekomen verschil verminderen met 20 pct.
                                                                             BEO-DR/2025-0928_v2
                                                                                         Bijlage 5



                         PERSONEN VERMELD IN DEEL I, NR. 11


          VERMINDERINGEN VOOR ANDERE GEZINSLASTEN VAN TOEPASSING
          WANNEER DE ECHTGENOOT VAN DE VERKRIJGER VAN DE INKOMSTEN
          GEEN PERSOONLIJKE BEROEPSINKOMSTEN HEEFT.


              GROND VAN DE VERMINDERING                                   JAARBEDRAG IN
                                                                           EURO VAN DE
                                                                         VERMINDERING (1)
1.   de verkrijger van de inkomsten is zelf gehandicapt:                        624 EUR

2.   de echtgenoot van de verkrijger van de inkomsten is                        624 EUR
     gehandicapt:

3.   de verkrijger van de inkomsten heeft in artikel 136, 2° en 3°             1.992 EUR
     van het WIB 92 bedoelde personen ten laste die de leeftijd
     van 66 jaar hebben bereikt en zorgbehoevend zijn, per
     persoon (2):

4.   de verkrijger van de inkomsten heeft in artikel 136, 2° tot 4°             624 EUR
     van het WIB 92 bedoelde personen, andere dan diegenen
     vermeld onder punten 3 en 4 hiervoor, ten laste, per
     persoon (3):

(1) alle verminderingen mogen worden samengevoegd.

(2) wordt als zorgbehoevend aangemerkt, de persoon voor wie de graad van zelfredzaamheid op
    ten minste 9 punten werd vastgesteld krachtens het ministerieel besluit van 30 juli 1987 tot
    vaststelling van de categorieën en van de handleiding voor de evaluatie van de graad van
    zelfredzaamheid met het oog op het onderzoek naar het recht op de integratietegemoetkoming.
    De zorgbehoevendheid wordt vastgesteld door de Directie-generaal Personen met een
    handicap van de FOD Sociale Zekerheid, Medex of de adviserend geneesheer bij het
    ziekenfonds of een gelijkwaardige instelling of persoon uit een andere lidstaat van de Europese
    Economische Ruimte.

(3) de gehandicapte persoon ten laste wordt voor twee gerekend.
                                                                             BEO-DR/2025-0928_v2
                                                                                      Bijlage 5bis



                         PERSONEN VERMELD IN DEEL I, NR. 11


          VERMINDERINGEN VOOR ANDERE GEZINSLASTEN VAN TOEPASSING
          WANNEER DE ECHTGENOOT VAN DE VERKRIJGER VAN DE INKOMSTEN
          GEEN PERSOONLIJKE BEROEPSINKOMSTEN HEEFT.


              GROND VAN DE VERMINDERING                                   JAARBEDRAG IN
                                                                           EURO VAN DE
                                                                         VERMINDERING (1)
1.   de verkrijger van de inkomsten is zelf gehandicapt:                        648 EUR

2.   de echtgenoot van de verkrijger van de inkomsten is                        636 EUR
     gehandicapt:

3.   de verkrijger van de inkomsten heeft in artikel 136, 2° en 3°             1.992 EUR
     van het WIB 92 bedoelde personen ten laste die de leeftijd
     van 66 jaar hebben bereikt en zorgbehoevend zijn, per
     persoon (2):

4.   de verkrijger van de inkomsten heeft in artikel 136, 2° tot                636 EUR
     4° van het WIB 92 bedoelde personen, andere dan
     diegenen vermeld onder punten 3 en 4 hiervoor, ten laste,
     per persoon (3):

(1) alle verminderingen mogen worden samengevoegd.

(2) wordt als zorgbehoevend aangemerkt, de persoon voor wie de graad van zelfredzaamheid op
    ten minste 9 punten werd vastgesteld krachtens het ministerieel besluit van 30 juli 1987 tot
    vaststelling van de categorieën en van de handleiding voor de evaluatie van de graad van
    zelfredzaamheid met het oog op het onderzoek naar het recht op de integratietegemoetkoming.
    De zorgbehoevendheid wordt vastgesteld door de Directie-generaal Personen met een
    handicap van de FOD Sociale Zekerheid, Medex of de adviserend geneesheer bij het
    ziekenfonds of een gelijkwaardige instelling of persoon uit een andere lidstaat van de Europese
    Economische Ruimte.

(3) de gehandicapte persoon ten laste wordt voor twee gerekend.
```

## 5. SF11-FR — Formule-clé à partir du 1er novembre 2026 (Partie I, Chapitre 1 et annexes)

```text
     INTRODUCTION


1.   Cette formule-clé est constituée de trois parties et cinq annexes (certaines
     possédant une version bis) :


     PARTIE I.     REMUNERATIONS


     Cette partie comporte :

     -    les règles pour le calcul du Pr.P dû sur les rémunérations mensuelles (nos 6 à
          21) ;
     -    les règles pour le calcul du Pr.P dû sur les rémunérations payées autrement
          que par mois (n° 22).



     PARTIE II.    PENSIONS AINSI QUE ALLOCATIONS DE CHOMAGE AVEC
                   COMPLEMENT D’ENTREPRISE (VISEES A L'ARTICLE 146,
                   CIR 92) PAYEES A DES HABITANTS DU ROYAUME


     Cette partie comporte les règles pour le calcul du Pr.P dû sur les pensions
     mensuelles et les allocations mensuelles de chômage avec complément
     d’entreprise (nos 23 à 36).




     PARTIE III.   ALLOCATIONS    DE   CHOMAGE      AVEC     COMPLEMENT
                   D’ENTREPRISE (VISEES A L’ARTICLE 146, CIR 92) PAYEES A
                   DES NON-RESIDENTS


     Cette partie comporte les règles pour le calcul du Pr.P dû sur les allocations
     mensuelles de chômage avec complément d’entreprise (nos 37 à 43).




                                       -3-
                                                                    ESS-SR/2025-0928_v2


     ANNEXES

     Les annexes comportent le barème de base (annexe 1) ainsi que les tableaux et
     données pour le calcul des réductions (annexes 2 à 5bis) à utiliser conformément
     aux règles visées aux parties I, II et III.


     REMARQUES IMPORTANTES

2.   Cette formule-clé diffère de la formule-clé précédente (ESS/2025-0928, version de
     janvier 2026) suite aux modifications apportées par la loi du 15 juillet 2026 portant
     réforme de l'impôt des personnes physiques.

3.   Pour l'application de la présente formule-clé, tous les montants sont, le cas
     échéant à chaque étape du calcul, arrondis au cent supérieur ou inférieur
     selon que le chiffre des millièmes atteint ou non 5 ;

4.   La formule-clé- s'applique uniquement au Pr.P dû sur les rémunérations et sur les
     pensions ou allocations de chômage avec complément d’entreprise visées à l’article
     146, CIR 92, payées périodiquement. Dans tous les autres cas, le Pr.P est calculé
     suivant les barèmes et les règles repris à l'annexe III à l’AR/CIR 92.

5.   Le calcul du Pr.P tel que détaillé ci-après, intègre déjà une majoration de 7 p.c.
     pour les taxes additionnelles (taxe communale et taxe d'agglomération).


                                  * * * * * * * *




                                        -4-
                                                                          ESS-SR/2025-0928_v2


          PARTIE I.      REMUNERATIONS


          Chapitre 1er. CALCUL DU Pr.P DU SUR LES REMUNERATIONS MENSUELLES


6.        Le Pr.P dû sur les rémunérations mensuelles est calculé en cinq étapes.

          Ces cinq étapes sont :

          A.    la détermination du revenu annuel brut ;
          B.    la transformation du revenu annuel brut en revenu annuel net imposable ;
          C.    le calcul de l'impôt annuel ;
          D.    le calcul du précompte professionnel mensuel ;
          E.    l'application des autres réductions.


          A.    REVENU ANNUEL BRUT


7.        Pour établir le revenu annuel brut, il y a lieu :

          1° - de diminuer le montant brut des rémunérations mensuelles payées des
               retenues effectuées en exécution de la législation sociale ou d'un statut légal
               ou réglementaire y assimilé ;

               - de diminuer le montant brut des rémunérations mensuelles payées aux
                 dirigeants d'entreprise qui sont soumis au statut social des travailleurs
                 indépendants de la réduction reprise dans le tableau ci-après :

     MONTANT BRUT DES                                          REDUCTION
 REMUNERATIONS MENSUELLES


 jusqu'à 1.465 EUR                     385 EUR

 de 1.465,01 EUR à 6.310 EUR           385 EUR + 21,50 p.c. de la tranche excédant 1.465 EUR

 de 6.310,01 EUR à 9.290 EUR           1.426,68 EUR + 14,50 p.c. de la tranche excédant 6.310 EUR

 supérieur à 9.290 EUR                 1.858,78 EUR


          2°    de multiplier la différence obtenue par 12.




                                               -5-
                                                                             ESS-SR/2025-0928_v2




          B.    REVENU ANNUEL NET IMPOSABLE


8.        Le revenu annuel net imposable est égal au revenu annuel brut diminué des frais
          professionnels forfaitaires. Ces frais professionnels forfaitaires sont fixés comme
          suit :

          1°    Rémunérations des travailleurs (traitements et salaires)

      REVENU ANNUEL BRUT                          FRAIS PROFESSIONNELS FORFAITAIRES

 jusqu'à 20.233,33 EUR                 30 p.c.

 supérieur à 20.233,33 EUR             6.070 EUR (maximum)


          2°    Rémunérations périodiques des dirigeants d'entreprise

              REVENU ANNUEL BRUT                          FRAIS PROFESSIONNELS FORFAITAIRES

 jusqu'à 106.666,67 EUR                                3 p.c.

 supérieur à 106.666,67 EUR                            3.200 EUR (maximum)




          C.    IMPOT ANNUEL


9.        Pour obtenir l'impôt annuel, il y a lieu :

          -     de calculer l'impôt de base sur le revenu annuel net imposable ;

          -     de déduire les réductions de l'impôt de base.

          L'impôt annuel est donc égal à l'impôt de base diminué des réductions.




                                                 -6-
                                                                                          ESS-SR/2025-0928_v2


              1.    IMPOT DE BASE

10.           L'impôt de base est calculé à l'aide du seul barème de base repris à l'annexe 1.


11.           Section 1ère.-       A.    Habitants du Royaume
                                   B.    Non-résidents qui ont bénéficié de rémunérations :
                                        - pour des prestations de travail effectuées en
                                          Belgique ;
                                        - en exécution d’un ou de plusieurs contrats de travail
                                          couvrant l’année civile complète ;
                                        - et pour autant que les prestations de travail atteignent
                                          au moins 75 p.c. du temps légal de travail par contrat

              a)    Le bénéficiaire des revenus est un isolé ou son conjoint bénéficie également
                    de revenus professionnels propres.

                    EXCEPTION
                    ------------------
                    Lorsque le conjoint du bénéficiaire des revenus recueille des revenus
                    professionnels propres qui sont exclusivement constitués de pensions, rentes
                    ou revenus y assimilés et qui ne dépassent pas 174 EUR NETS1 par mois,
                    l'impôt de base est calculé, par dérogation à l'alinéa précédent, conformément
                    au point b, ci-après.


              L'IMPOT DE BASE est égal à l'impôt calculé à l'aide du barème de base et diminué
              de 3.089,63 EUR (c.-à-d. l'impôt sur la quotité du revenu exemptée d'impôt, qui
              s'élève à 11.550 EUR).


              b)    Le conjoint du bénéficiaire des revenus n'a pas de revenus professionnels
                    propres2.

                    *    Tout d'abord, on impute au conjoint du bénéficiaire des revenus un revenu
                         professionnel égal à 30 p.c. du revenu annuel net imposable.

                         Le revenu imputé ne peut toutefois pas dépasser le montant suivant :
                            a) si les deux conjoints ont atteint l'âge de 66 ans au 1er janvier 2027 :
                            12.790 EUR (ce montant maximum est atteint avec un revenu annuel
                            net de la base imposable de 42.633,33 EUR) ;


1     Pour apprécier la limite de 174 EUR NETS par mois, il y a lieu d'envisager la situation au 1er janvier 2026 et
      de déterminer les revenus professionnels nets comme suit :
      1. diminuer les revenus professionnels bruts des retenues ou cotisations obligatoires applicables en
          exécution de la législation sociale ou d'un statut légal ou réglementaire y assimilé ;
      2. diminuer ensuite la différence obtenue de 20 p.c.
2     Voir toutefois l'exception au n° 11, a.

                                                        -7-
                                                                     ESS-SR/2025-0928_v2


                  b) dans tous les autres cas, également si le débiteur du précompte
                  professionnel ne dispose pas des informations nécessaires pour
                  appliquer le a) : 11.780 EUR (ce montant maximum est atteint avec un
                  revenu annuel net de la base imposable de 39.266,67 EUR).

           *   Puis, à l'aide du barème de base, on calcule l'impôt sur le revenu imputé
               au conjoint (résultat = impôt A).

           *   Ensuite, à l'aide du barème de base, on calcule l'impôt sur la différence
               entre le revenu annuel net imposable et le revenu qui a été imputé à l'autre
               conjoint (résultat = impôt B).

           *   Finalement, l'IMPOT DE BASE est égal à la somme des deux montants
               d'impôt (somme = impôt A + impôt B), diminuée de 6.179,26 EUR (étant
               deux fois l'impôt sur la quotité du revenu exemptée d'impôt s'élevant à
               11.550 EUR).


12.   Section 2. - Non-résidents qui ne sont pas visés à la section 1ère, B, ci-dessus
                   (n° 11).

      L'IMPOT DE BASE est égal à l'impôt calculé à l'aide du barème de base.


      2.   REDUCTIONS

      Remarque préliminaire

      Certaines notions en matière de réductions sont précisées à l'annexe 2.

      a)   Généralités
13.
      ➢    L'impôt de base déterminé conformément au no 11 peut, le cas échéant, être
           diminué :
           ▪   de la réduction pour enfants à charge ;
           ▪   des réductions pour autres charges de famille.

      Toutes les réductions peuvent être cumulées sans que le total de celles-ci ne puisse
      cependant excéder le montant de l'impôt de base.

      b)   Réduction pour enfants à charge

14.   La réduction pour enfants à charge doit être octroyée sur la base des données
      reprises dans le tableau de l'annexe 3bis.




                                         -8-
                                                                                  ESS-SR/2025-0928_v2


              c)     Réductions pour autres charges de famille

15.           Ces réductions sont spécifiées par nature et par montant dans les tableaux des
              annexes 4bis et 5bis.

              Annexe 4bis

              Les réductions y spécifiées sont applicables uniquement lorsque le bénéficiaire des
              revenus est un isolé ou lorsque le conjoint du bénéficiaire des revenus bénéficie
              également de revenus professionnels propres1.

              Annexe 5bis

              Ces réductions sont uniquement applicables lorsque le conjoint du bénéficiaire des
              revenus N'A PAS de revenus professionnels propres1.




              D.     PRECOMPTE PROFESSIONNEL MENSUEL


16.           Au terme des opérations dont il vient d'être question, on obtient le montant de l'impôt
              annuel (voir n° 9).

              Pour déterminer le montant du Pr.P dû sur les rémunérations payées
              mensuellement, l'on doit diviser le montant de l'impôt annuel par 12.




              E.     AUTRES REDUCTIONS

              a) Généralités

              ➢      Le montant du précompte professionnel dû mensuellement et déterminé
                     conformément au n° 16 peut, le cas échéant, encore être diminué
                     successivement :
                     ▪    de la réduction pour cotisations personnelles versées :
                              o à une assurance de groupe ;
                              o à une assurance extra-légale contre la vieillesse ou le décès
                                prématuré ;
                              o en continuation à titre individuel d’un engagement de pension,
                                conformément à l’article 1453, alinéa 3, CIR 92 ;
                              o qui, en vertu de l’article 1453, alinéa 4, CIR 92, ont trait à la pension

1     Voir toutefois l'exception au n° 11, a.

                                                     -9-
                                                                         ESS-SR/2025-0928_v2


                      libre complémentaire des travailleurs salariés ;
           ▪   de la réduction pour rémunérations suite à la prestation de travail
               supplémentaire donnant droit à un sursalaire ;
           ▪   de la réduction du précompte professionnel sur les rémunérations des
               personnes physiques à bas revenus, autres que les personnes qui,
               autrement qu'en vertu d'un contrat de travail, exécutent des prestations de
               travail dans le secteur public ;
           ▪   de la réduction du précompte professionnel sur les rémunérations des
               travailleurs et des dirigeants d’entreprise à bas revenus qui ont droit au
               bonus à l’emploi.


      b)   Réduction pour assurance de groupe, pour assurance extra-légale contre la
           vieillesse et le décès prématuré et pour des retenues opérées conformément
           à l’article 1453, alinéas 3 et 4, CIR 92

17.   Le précompte professionnel dû mensuellement visé au n° 16 peut le cas échéant
      encore être diminué à concurrence de 30 p.c. :
      ▪    des retenues obligatoires opérées en exécution d'un contrat d'assurance de
           groupe ;
      ▪    des retenues obligatoires opérées en exécution d'un règlement de prévoyance
           extra-légal d'assurance contre la vieillesse et le décès prématuré ;
      ▪    de retenues qui ont trait à la continuation à titre individuel d‘un engagement de
           pension, conformément à l’article 1453, alinéa 3, CIR 92 ;
      ▪    de retenues qui, en vertu de l’article 1453, alinéa 4, CIR 92, ont trait à la pension
           libre complémentaire des travailleurs salariés.


      c)   Réduction pour rémunérations suite à la prestation de travail supplémentaire
           donnant droit à un sursalaire

18.   Cette réduction s’applique aux travailleurs qui ont presté, pendant la période
      imposable, un travail supplémentaire qui donne droit à un sursalaire en vertu de
      l'article 29 de la loi sur le travail du 16 mars 1971 ou de l'article 7 de l'arrêté royal
      n° 213 du 26 septembre 1983 relatif à la durée du travail dans les entreprises
      ressortissant à la commission paritaire de la construction et qui :
      ▪    soit sont soumis à la loi sur le travail du 16 mars 1971 et occupés par un
           employeur soumis à la loi du 5 décembre 1968 relative aux conventions
           collectives de travail et aux commissions paritaires ;
      ▪    soit sont occupés, sous statut ou avec un contrat de travail, par une des
           entreprises publiques autonomes suivantes : la société anonyme de droit
           public Proximus, la société anonyme de droit public bpost, la société
           anonyme de droit public SNCB et la société anonyme de droit public
           Infrabel ;

                                          - 10 -
                                                                         ESS-SR/2025-0928_v2


      ▪    soit sont occupés, sous statut ou avec un contrat de travail, par la société
           anonyme de droit public HR Rail.

      Cette réduction ne s’applique qu’à la base de calcul du sursalaire relatif aux 180
      premières heures de travail supplémentaire que le travailleur a prestées.

      Le maximum de 180 heures de travail supplémentaire déterminé à l'alinéa 2 est
      porté à 360 heures pour les travailleurs et les intérimaires qui sont respectivement
      occupés par ou mis à disposition des employeurs qui ressortent de la commission
      paritaire de l'industrie hôtelière ou de la commission paritaire du travail intérimaire
      si l'utilisateur ressort de la commission paritaire de l'industrie hôtelière.

      Le maximum de 180 heures de travail supplémentaire déterminé à l'alinéa 2 est
      porté à 280 heures pour les travailleurs et les intérimaires qui sont respectivement
      occupés par ou mis à disposition des employeurs qui effectuent principalement des
      travaux routiers, à l'exclusion des travaux de pose de canalisations souterraines et
      de câbles, ou des travaux ferroviaires et pour lesquels les autorités imposent de
      travailler le week-end, les jours fériés ou la nuit, à condition que ces employeurs
      utilisent un système électronique d'enregistrement de présence visé au chapitre V,
      section 4, de la loi du 4 août 1996 relative au bien-être des travailleurs lors de
      l'exécution de leur travail et à condition que et dans la mesure où ces travailleurs
      aient effectivement effectué des travaux routiers ou ferroviaires pour lesquels les
      autorités imposent de travailler le week-end, les jours fériés ou la nuit pendant les
      heures supplémentaires prestées pour ces employeurs.

      La réduction n’est pas applicable au travail supplémentaire qui entre en
      considération pour l’application de l’article 38, § 1er, alinéa 1er, 29°/1 et 30°, CIR 92.

      La réduction s’applique sur le précompte professionnel mensuellement dû visé au
      n° 16 et après application du n° 18, et est égale à :
      -    pour une heure prestée à laquelle s'applique un sursalaire légal de 50 ou
           100 p.c. : 57,75 p.c. ;
      -    pour une heure prestée à laquelle s'applique un sursalaire légal de 20 p.c. :
           66,81 p.c.,
      du "montant brut social" des rémunérations (donc avant déduction des retenues
      obligatoires effectuées en exécution de la législation sociale ou d'un statut légal ou
      réglementaire y assimilé), qui a servi de base de calcul pour établir le sursalaire.


          d) Réduction du précompte professionnel sur les rémunérations des personnes
          physiques à bas revenus, autres que les personnes qui, autrement qu'en vertu
          d'un contrat de travail, exécutent des prestations de travail dans le secteur
          public

19.   La réduction ci-visée doit être appliquée comme suit :

      Il est accordé une réduction aux personnes qui, en tant que statutaires, stagiaires
      ou temporaires, sont au service de l'Etat, des Communautés, des Régions, des
                                          - 11 -
                                                                      ESS-SR/2025-0928_v2


      provinces et établissements subordonnés aux provinces, des communes et
      établissements subordonnés aux communes, et qui ne sont pas engagées en
      vertu d'un contrat de travail, et qui obtiennent au moins une rémunération
      mensuelle imposable de 742,26 EUR et 2.722,91 EUR maximum.

      La réduction est appliquée sur le précompte professionnel mensuellement dû
      visé au no 16 et après application des nos 17 et 18, et est égale à 7,50 EUR.


      e)   Réduction du précompte professionnel sur les rémunérations des travailleurs
           et des dirigeants d’entreprise à bas revenus qui ont droit au bonus à l’emploi

20.   La réduction ci-visée doit être appliquée comme suit :

      Il est accordé une réduction aux travailleurs et dirigeants d’entreprise qui ont droit
      au bonus à l’emploi en vertu de l'article 2 de la loi du 20 décembre 1999 visant à
      octroyer un bonus à l’emploi sous la forme d’une réduction des cotisations
      personnelles de sécurité sociale aux travailleurs salariés ayant un bas salaire et à
      certains travailleurs qui ont été victimes d’une restructuration.

      La réduction est appliquée sur le précompte professionnel mensuellement dû visé
      au no 16 et après application des n°s 17 à 19, et est égale :

       •   33,14 p.c. du montant du volet A du bonus à l’emploi réellement accordé en
           application de l'article 2, § 1/1, de la loi du 20 décembre 1999 visant à
           octroyer un bonus à l'emploi aux travailleurs salariés ayant un bas salaire et
           d'autres réductions des cotisations personnelles de sécurité sociale ;

       •   63 p.c. du montant du volet B du bonus à l’emploi réellement accordé en
           application de l'article 2, § 1/2, de la loi du 20 décembre 1999 précitée.


      f)   Limitation des réductions

21.   L'application des réductions ne peut pas aboutir à ce que le précompte
      professionnel devienne négatif.




                                        - 12 -
                                                                    ESS-SR/2025-0928_v2



[... Hoofdstuk 2 (anders dan per maand), Deel II en Deel III: buiten scope, niet overgenomen / hors scope, non repris ...]


                                      BAREME DE BASE




REVENU PROFESSIONNEL IMPUTE                                         IMPOT DE BASE
   ET REVENU ANNUEL NET
IMPOSABLE DIMINUE DU REVENU
          IMPUTE

de 0,01 EUR à            16.710 EUR   26,75 p.c.

de 16.710,01 EUR à       29.500 EUR   4.469,93 EUR + 42,80 p.c. de la tranche au-delà de   16.710 EUR

de 29.500,01 EUR à       51.050 EUR   9.944,05 EUR + 48,15 p.c. "       "                  29.500 EUR

supérieur à 51.050 EUR                20.320,38 EUR + 53,50 p.c. "          "              51.050 EUR
                                                                ESS-SR/2025-0928_v2
                                                                           Annexe 2



            PERSONNES VISEES A LA PARTIE I, N° 10


              NOTIONS EN MATIERE DE REDUCTION

1°   Handicapés

a)   Enfant handicapé

     Par "enfant handicapé", il faut entendre :

     -    l'enfant atteint à 66 p.c. au moins d'une insuffisance ou diminution de
          capacité physique ou psychique du chef d'une ou de plusieurs affections ;

     -    l'enfant dont il est établi, indépendamment de son âge, qu'en raison de
          faits survenus et constatés avant l'âge de 65 ans :

          a) soit son état physique ou psychique a réduit sa capacité de gain à un
             tiers ou moins de ce qu'une personne valide est en mesure de gagner
             en exerçant une profession sur le marché général du travail ;

          b) soit son état de santé provoque un manque total d'autonomie ou une
             réduction d'autonomie d'au moins 9 points, mesurés conformément
             aux guide et échelle médico-sociale applicables dans le cadre de la
             législation relative aux allocations aux handicapés ;

          c) soit, après la période d'incapacité primaire prévue à l'article 87 de la
             loi coordonnée relative à l'assurance obligatoire soins de santé et
             indemnités, sa capacité de gain est réduite à un tiers ou moins comme
             prévu à l'article 100 de la même loi coordonnée ;

          d) soit, par une décision administrative ou judiciaire, qu'il est handicapé
             physiquement ou psychiquement ou en incapacité de travail de façon
             permanente pour au moins 66 p.c.
                                                                 ESS-SR/2025-0928_v2
                                                                            Annexe 2
b)   Autre personne handicapée

     Par "autre personne handicapée", il faut entendre :

     -   celle dont il a été établi, avant le 1er janvier 1989, qu'elle est atteinte à
         66 p.c. au moins d'une insuffisance ou diminution de capacité physique ou
         psychique du chef d'une ou de plusieurs affections ;

     -   celle dont il est établi, indépendamment de son âge, qu'en raison de faits
         survenus et constatés avant l'âge de 65 ans :

          a) soit son état physique ou psychique a réduit sa capacité de gain à un
             tiers ou moins de ce qu'une personne valide est en mesure de gagner
             en exerçant une profession sur le marché général du travail ;

          b) soit son état de santé provoque un manque total d'autonomie ou une
             réduction d'autonomie d'au moins 9 points, mesurés conformément
             aux guide et échelle médico-sociale applicables dans le cadre de la
             législation relative aux allocations aux handicapés ;

          c) soit, après la période d'incapacité primaire prévue à l'article 87 de la
             loi coordonnée relative à l'assurance obligatoire soins de santé et
             indemnités, sa capacité de gain est réduite à un tiers ou moins comme
             prévu à l'article 100 de la même loi coordonnée ;

          d) soit, par une décision administrative ou judiciaire, qu'elle est
             handicapée physiquement ou psychiquement ou en incapacité de
             travail de façon permanente pour au moins 66 p.c.


2°   Lorsqu'un enfant à charge ou une personne à charge visée à l'article 136, 2° à
     4°, CIR 92 décède, la réduction pour cet enfant ou cette personne est
     consentie jusqu'à la fin de l'année du décès.


3°   Lorsque les deux conjoints recueillent des revenus professionnels propres, les
     réductions pour enfants à charge et pour autres charges de famille, à
     l'exception de celle pour le conjoint handicapé, sont accordées au conjoint
     choisi par eux ;

     La réduction pour le conjoint handicapé est accordée à l’intéressé même.
                                                                 ESS-SR/2025-0928_v2
                                                                            Annexe 2

4°   Situation de dépendance

     Pour l'application de l’article 132, alinéa 1er, 7°, CIR 92 est considérée comme
     étant en situation de dépendance la personne pour laquelle le degré
     d'autonomie est évalué à au moins 9 points conformément à l'arrêté ministériel
     du 30 juillet 1987 fixant les catégories et le guide pour l'évaluation du degré
     d'autonomie en vue de l'examen du droit à l'allocation d'intégration. La situation
     de dépendance est constatée par la Direction générale Personnes
     handicapées du SPF Sécurité sociale, Medex ou le médecin-conseil auprès
     de la mutualité, ou une institution ou personne similaire d'un autre Etat membre
     de l'Espace économique européen.
                                                                    ESS-SR/2025-0928_v2
                                                                               Annexe 3



                     PERSONNES VISEES A LA PARTIE I, N° 11


                      REDUCTION POUR ENFANTS A CHARGE



   NOMBRE D'ENFANTS                      REDUCTION DE L'IMPOT DE BASE
     A CHARGE (1)

               1                                         624 EUR

               2                                        1.656 EUR

               3                                        4.404 EUR

               4                                        7.620 EUR

               5                                       11.100 EUR

               6                                       14.592 EUR

               7                                       18.120 EUR

               8                                       21.996 EUR

plus de 8 :   l'impôt de base est réduit d'un montant fixe de 21.996 EUR, majoré de
              3.864 EUR par enfant à charge au-delà du huitième, c.-à-d. :
              pour 9 enfants : 21.996 + (1 x 3.864) = 25.860 EUR
              pour 10 enfants: 21.996 + (2 x 3.864) = 29.724 EUR
              etc.
(1) l'enfant handicapé à charge est compté pour deux
                                                                    ESS-SR/2025-0928_v2
                                                                             Annexe 3bis

                     PERSONNES VISEES A LA PARTIE I, N° 11


                      REDUCTION POUR ENFANTS A CHARGE



   NOMBRE D'ENFANTS                      REDUCTION DE L'IMPOT DE BASE
     A CHARGE (1)

               1                                         684 EUR

               2                                        1.644 EUR

               3                                        4.344 EUR

               4                                        7.488 EUR

               5                                       10.884 EUR

               6                                       14.292 EUR

               7                                       17.712 EUR

               8                                       21.492 EUR

plus de 8 :   l'impôt de base est réduit d'un montant fixe de 21.492 EUR, majoré de
              3.780 EUR par enfant à charge au-delà du huitième, c.-à-d. :
              pour 9 enfants : 21.492 + (1 x 3.780) = 25.272 EUR
              pour 10 enfants: 21.492 + (2 x 3.780) = 29.052 EUR
              etc.
(1) l'enfant handicapé à charge est compté pour deux
                                                                                    ESS-SR/2025-0928_v2
                                                                                               Annexe 4

                           PERSONNES VISEES A LA PARTIE I, N° 11

             REDUCTIONS POUR AUTRES CHARGES DE FAMILLE APPLICABLES :
             -  LORSQUE LE BENEFICIAIRE DES REVENUS EST UN ISOLE ;
             -  LORSQUE LE CONJOINT DU BENEFICIAIRE DES REVENUS A
                EGALEMENT DES REVENUS PROFESSIONNELS PROPRES.



                      MOTIF DE LA REDUCTION                                      MONTANT ANNUEL
                                                                                  EN EURO DE LA
                                                                                  REDUCTION (1)
1.   le bénéficiaire des revenus est un veuf (une veuve) non remarié(e),                624 EUR
     un père (une mère) célibataire, ou un parent divorcé ou séparé de
     fait, avec un ou plusieurs enfants à charge :
2.   le bénéficiaire des revenus est lui-même handicapé :                               624 EUR
3.   le bénéficiaire des revenus a à sa charge des personnes visées à                  1.992 EUR
     l'article 136, 2° et 3°, CIR 92 qui sont dans une situation de
     dépendance et qui ont atteint l’âge de 66 ans (par personne) (2) :
4.   le bénéficiaire des revenus a à sa charge des personnes visées à                   624 EUR
     l'article 136, 2° à 4°, CIR 92 autres que celles visées au point 3 ci-
     avant (par personne) (3) :
5.   le conjoint du bénéficiaire des revenus a des revenus                             1.740 EUR
     professionnels propres, autres que des pensions, rentes ou
     revenus y assimilés, qui ne dépassent pas 290 EUR NETS par
     mois (4) :
6.   le conjoint du bénéficiaire des revenus a des revenus                             3.474 EUR
     professionnels propres qui sont exclusivement constitués de
     pensions, rentes ou revenus y assimilés, qui ne dépassent pas
     565 EUR NETS par mois (4) :

(1) toutes les réductions peuvent être cumulées.
(2) est considérée comme étant en situation de dépendance la personne pour laquelle le degré
    d'autonomie est évalué à au moins 9 points conformément à l'arrêté ministériel du 30 juillet 1987
    fixant les catégories et le guide pour l'évaluation du degré d'autonomie en vue de l'examen du droit
    à l'allocation d'intégration. La situation de dépendance est constatée par la Direction générale
    Personnes handicapées du SPF Sécurité sociale, Medex ou le médecin-conseil auprès de la
    mutualité, ou une institution ou personne similaire d'un autre Etat membre de l'Espace économique
    européen.
(3) la personne handicapée à charge est comptée pour deux.
(4) pour apprécier les limites de 290 EUR et 579 EUR NETS par mois, il y a lieu d'envisager la situation
    au 1er janvier 2026 et de déterminer les revenus professionnels nets comme suit :
     1. diminuer les revenus professionnels bruts des retenues ou des cotisations obligatoires
        applicables en exécution de la législation sociale ou d'un statut légal ou réglementaire y assimilé ;
     2. diminuer ensuite la différence obtenue de 20 p.c.
                                                                                    ESS-SR/2025-0928_v2
                                                                                             Annexe 4bis



                           PERSONNES VISEES A LA PARTIE I, N° 11

             REDUCTIONS POUR AUTRES CHARGES DE FAMILLE APPLICABLES :
             -  LORSQUE LE BENEFICIAIRE DES REVENUS EST UN ISOLE ;
             -  LORSQUE LE CONJOINT DU BENEFICIAIRE DES REVENUS A
                EGALEMENT DES REVENUS PROFESSIONNELS PROPRES.



                      MOTIF DE LA REDUCTION                                      MONTANT ANNUEL
                                                                                  EN EURO DE LA
                                                                                  REDUCTION (1)
1.   le bénéficiaire des revenus est un veuf (une veuve) non remarié(e),                636 EUR
     un père (une mère) célibataire, ou un parent divorcé ou séparé de
     fait, avec un ou plusieurs enfants à charge :
2.   le bénéficiaire des revenus est lui-même handicapé :                               648 EUR
3.   le bénéficiaire des revenus a à sa charge des personnes visées à                  1.992 EUR
     l'article 136, 2° et 3°, CIR 92 qui sont dans une situation de
     dépendance et qui ont atteint l’âge de 66 ans (par personne) (2) :
4.   le bénéficiaire des revenus a à sa charge des personnes visées à                   636 EUR
     l'article 136, 2° à 4°, CIR 92 autres que celles visées au point 3 ci-
     avant (par personne) (3) :
5.   le conjoint du bénéficiaire des revenus a des revenus                             1.740 EUR
     professionnels propres, autres que des pensions, rentes ou
     revenus y assimilés, qui ne dépassent pas 290 EUR NETS par
     mois (4) :
6.   le conjoint du bénéficiaire des revenus a des revenus                             3.474 EUR
     professionnels propres qui sont exclusivement constitués de
     pensions, rentes ou revenus y assimilés, qui ne dépassent pas
     565 EUR NETS par mois (4) :

(1) toutes les réductions peuvent être cumulées.
(2) est considérée comme étant en situation de dépendance la personne pour laquelle le degré
    d'autonomie est évalué à au moins 9 points conformément à l'arrêté ministériel du 30 juillet 1987
    fixant les catégories et le guide pour l'évaluation du degré d'autonomie en vue de l'examen du droit
    à l'allocation d'intégration. La situation de dépendance est constatée par la Direction générale
    Personnes handicapées du SPF Sécurité sociale, Medex ou le médecin-conseil auprès de la
    mutualité, ou une institution ou personne similaire d'un autre Etat membre de l'Espace économique
    européen.
(3) la personne handicapée à charge est comptée pour deux.
(4) pour apprécier les limites de 290 EUR et 579 EUR NETS par mois, il y a lieu d'envisager la situation
    au 1er janvier 2026 et de déterminer les revenus professionnels nets comme suit :
     1. diminuer les revenus professionnels bruts des retenues ou des cotisations obligatoires
        applicables en exécution de la législation sociale ou d'un statut légal ou réglementaire y assimilé ;
     2. diminuer ensuite la différence obtenue de 20 p.c.
                                                                                ESS-SR/2025-0928_v2
                                                                                           Annexe 5



                        PERSONNES VISEES A LA PARTIE I, N° 11


          REDUCTIONS POUR AUTRES CHARGES DE FAMILLE APPLICABLES
          LORSQUE LE CONJOINT DU BENEFICIAIRE DES REVENUS N'A PAS DE
          REVENUS PROFESSIONNELS PROPRES.




                   MOTIF DE LA REDUCTION                                   MONTANT ANNUEL
                                                                            EN EURO DE LA
                                                                            REDUCTION (1)

1.   le bénéficiaire des revenus est lui-même handicapé :                        624 EUR

2.   le conjoint du bénéficiaire des revenus est handicapé :                     624 EUR

3.   le bénéficiaire des revenus a à sa charge des personnes                    1.992 EUR
     visées à l'article 136, 2° et 3°, CIR 92 qui sont dans une
     situation de dépendance et qui ont atteint l’âge de 66 ans
     (par personne) (2) :

4.   le bénéficiaire des revenus a à sa charge des personnes                     624 EUR
     visées à l'article 136, 2° à 4°, CIR 92 autres que celles
     visées au point 3 ci-avant (par personne) (3) :

(1) toutes les réductions peuvent être cumulées.

(2) est considérée comme étant en situation de dépendance la personne pour laquelle le degré
    d'autonomie est évalué à au moins 9 points conformément à l'arrêté ministériel du 30 juillet 1987
    fixant les catégories et le guide pour l'évaluation du degré d'autonomie en vue de l'examen du
    droit à l'allocation d'intégration. La situation de dépendance est constatée par la Direction
    générale Personnes handicapées du SPF Sécurité sociale, Medex ou le médecin-conseil
    auprès de la mutualité, ou une institution ou personne similaire d'un autre Etat membre de
    l'Espace économique européen.

(3) la personne handicapée à charge est comptée pour deux.
                                                                                ESS-SR/2025-0928_v2
                                                                                         Annexe 5bis



                        PERSONNES VISEES A LA PARTIE I, N° 11


          REDUCTIONS POUR AUTRES CHARGES DE FAMILLE APPLICABLES
          LORSQUE LE CONJOINT DU BENEFICIAIRE DES REVENUS N'A PAS DE
          REVENUS PROFESSIONNELS PROPRES.




                   MOTIF DE LA REDUCTION                                   MONTANT ANNUEL
                                                                            EN EURO DE LA
                                                                            REDUCTION (1)

1.   le bénéficiaire des revenus est lui-même handicapé :                        648 EUR

2.   le conjoint du bénéficiaire des revenus est handicapé :                     636 EUR

3.   le bénéficiaire des revenus a à sa charge des personnes                    1.992 EUR
     visées à l'article 136, 2° et 3°, CIR 92 qui sont dans une
     situation de dépendance et qui ont atteint l’âge de 66 ans
     (par personne) (2) :

4.   le bénéficiaire des revenus a à sa charge des personnes                     636 EUR
     visées à l'article 136, 2° à 4°, CIR 92 autres que celles
     visées au point 3 ci-avant (par personne) (3) :

(1) toutes les réductions peuvent être cumulées.

(2) est considérée comme étant en situation de dépendance la personne pour laquelle le degré
    d'autonomie est évalué à au moins 9 points conformément à l'arrêté ministériel du 30 juillet 1987
    fixant les catégories et le guide pour l'évaluation du degré d'autonomie en vue de l'examen du
    droit à l'allocation d'intégration. La situation de dépendance est constatée par la Direction
    générale Personnes handicapées du SPF Sécurité sociale, Medex ou le médecin-conseil
    auprès de la mutualité, ou une institution ou personne similaire d'un autre Etat membre de
    l'Espace économique européen.

(3) la personne handicapée à charge est comptée pour deux.
```

## 6. Bijlage III (coordinated version): entry into force and nr. 46

B3C-NL, header and nr. 46:

```text
Schalen en regels die van toepassing zijn om de bedrijfsvoorheffing vast te stellen bij de
bron verschuldigd op inkomsten betaald of toegekend vanaf 01.01.2026 (KB 11.12.2025 -
B.S. 29.12.2025; Numac: 2025009487; bekrachtigd door art. 28, 2°, W 23.09.2026 - B.S.
07.10.2026; Numac : 2026007237)

(art. 88, KB/WIB 92)




Bijlage III, nummer 45.2, 78.3.2, 139 en 144.1, heeft uitwerking met ingang van 01.01.2026 (art.
2, 5 en 6, 2° en 7, tweede lid, KB 24.07.2026 - B.S. 30.07.2026; Numac: 2026005690)

Bijlage III, nummer 45.3, heeft uitwerking met ingang van 01.04.2026 (art. 3 en 7, derde lid, KB
24.07.2026 - B.S. 30.07.2026; Numac: 2026005690)

Bijlage III, nummer 46.2.2, 139 en 144.1, treedt in werking op 01.08.2026 (art. 4, 6, 1°, en 7,
vierde lid, KB 24.07.2026 - B.S. 30.07.2026; Numac: 2026005690)

Bijlage III, nummer 4.2, 5de streepje, en 4.2, 6de streepje en 4.2, 7de streepje (toevoeging), en
32, en 34.1.1, en 34.2, en 38 (tabel), en 39 (tabel), en 40 (tabel), en 41 (tabel) en 54, is van
toepassing op de vanaf 1.11.2026 betaalde of toegekende inkomsten (art. 1, 2, 3, 4, 5, 6, 7, 8, 9
en 10, eerste lid, KB 27.09.2026 - B.S. 02.10.2026; Numac: 2026007167)

[In afwijking van art. 10, eerste lid, KB. 27.09.2026 - B.S. 02.10.2026; numac: 2026007167; zijn de
wijzigingen vervat in dit besluit niet van toepassing wanneer de bedrijfsvoorheffing wordt
berekend overeenkomstig de regels vastgelegd in nummer 80 of Deel 5 van de toepassingsregels
van de bijlage III van het KW/WIB 92.(art. 10, tweede lid, KB 27.09.2026 - B.S. 02.10.2026;
numac: 2026007167)]



[...]
46.1. Er wordt een vermindering verleend aan de werknemers die recht hebben op een
werkbonus overeenkomstig artikel 2 van de wet van 20 december 1999 tot toekenning van een
werkbonus aan werknemers met lage lonen en van andere verminderingen van de persoonlijke
bijdragen van sociale zekerheid.

46.2. De vermindering bedraagt:

46.2.1. 33,14 pct. van het bedrag van het luik A van de werkbonus dat daadwerkelijk is verleend
met toepassing van artikel 2, § 1/1, van de wet van 20 december 1999 tot toekenning van een
werkbonus aan werknemers met lage lonen en van andere verminderingen van de persoonlijke
bijdragen van sociale zekerheid;

46.2.2.63 pct. van het bedrag van het luik B van de werkbonus dat daadwerkelijk is verleend met
toepassing van artikel 2, § 1/2, van de voormelde wet van 20 december 1999.

Afdeling 4. Lage activiteitsinkomsten overheidssector
```

B3C-FR, header and nr. 46:

```text
Barèmes et règles applicables pour le calcul du précompte professionnel dû à la source
sur les revenus payés ou attribués à partir du 01.01.2026 (AR 11.12.2025 - M.B. 29.12.2025;
Numac: 2025009487; conﬁrmé par art. 28, 2°, L 23.09.2026 - M.B. 07.10.2026; Numac :
2026007237)

(art. 88, AR/CIR 92)




Annexe III, numéro 45.2, 78.3.2, 139 et 144.1, produit ses effet à partir du 01.01.2026 (art. 2, 5, 6,
2°, et 7, alinéa 2, AR 24.07.2026 - M.B. 30.07.2026; Numac: 2026005690)

Annexe III, numéro 45.3, produit ses effet à partir du 01.04.2026 (art. 3 et 7, alinéa 3, AR
24.07.2026 - M.B. 30.07.2026; Numac: 2026005690)

Annexe III, numéro 46.2.2, 139 en 144.1, entre en vigueur le 01.08.2026 (art. 4, et 6, 1°, et 7,
alinéa 4, AR 24.07.2026 - M.B. 30.07.2026; Numac: 2026005690)

Annexe III, numéro 4.2, 5ième tiret, et 4.2, 6ième tiret, et 4.2, 7ième tiret (insertion), et 32, et 34.1.1, et
34.2, et 38 (tableau), et 39 (tableau), et 40 (tableau), et 41 (tableau) et 54, est applicable aux
revenus payés ou attribués à partir du 01.11.2026 (art. 1, 2, 3, 4, 5, 6, 7, 8, 9 et 10, alinéa 1, AR
27.09.2026 - M.B. 02.10.2026; Numac: 2026007167)

[Par dérogation à l'article 10, alinéa 1, AR. 27.09.2026 - M.B. 02.10.2026; numac: 2026007167;
les modiﬁcations prévues par le présent arrêté ne s'appliquent pas lorsque le précompte
professionnel est calculé conformément aux règles déterminées au numéro 80 ou à la Partie 5
des règles d'application de l'annexe III de l'AR/CIR 92. (art. 10, alinéa 2, AR 27.09.2026 - M.B.
02.10.2026; numac: 2026007167)]

[...]
46.1. Il est accordé une réduction aux travailleurs et des dirigeants d’entreprise qui ont droit au
bonus à l'emploi en vertu de l'article 2 de la loi du 20 décembre 1999 visant à octroyer un bonus
à l'emploi aux travailleurs salariés ayant un bas salaire et d'autres réductions des cotisations
personnelles de sécurité sociale.

46.2. La réduction est égale à :

46.2.1. 33,14 p.c. du montant du volet A du bonus à l’emploi réellement accordé en application
de l'article 2, § 1/1, de la loi du 20 décembre 1999 visant à octroyer un bonus à l'emploi aux
travailleurs salariés ayant un bas salaire et d'autres réductions des cotisations personnelles de
sécurité sociale ;

46.2.2.63 p.c. du montant du volet B du bonus à l’emploi réellement accordé en application de
l'article 2, § 1/2, de la loi du 20 décembre 1999 précitée.

Section 4. Prestations de travail à bas revenus dans le secteur public
```
