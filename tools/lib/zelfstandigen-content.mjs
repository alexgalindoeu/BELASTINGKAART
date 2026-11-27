// Content of the self-employed section (web/nl/zelfstandigen/, web/fr/independants/).
// Every statement is taken from an official source listed on the same page; the
// claim -> quote -> URL log is docs/sources/zelfstandigen_2026-11-25.md.
// Figures appear only where RSVZ/INASTI publishes them with their year ("Bijdragen 2026").
// Rendered by tools/build_zelfstandigen.mjs (npm run build:zelfstandigen).

const D25 = '25-11-2026', D26 = '26-11-2026';
const RSVZ = 'https://www.rsvz.be/nl/', INASTI = 'https://www.inasti.be/fr/';
const FISCONET = 'https://www.minfin.fgov.be/myminfin-web/pages/public/fisconet/document/';

// Official sources, NL and FR equivalent: [url, label, consulted].
export const SOURCES = {
  wie: { nl: [RSVZ + 'wie-zelfstandige', 'RSVZ, Wie is zelfstandige?', D25], fr: [INASTI + 'qui-est-independant', 'INASTI, Qui est indépendant ?', D25] },
  bijDef: { nl: [RSVZ + 'wat-betekent-dat-juist-zelfstandige-bijberoep', 'RSVZ, Wat betekent dat juist: zelfstandige in bijberoep?', D25], fr: [INASTI + 'que-signifie-exactement-independant-titre-complementaire', 'INASTI, Que signifie exactement : indépendant à titre complémentaire ?', D25] },
  bij: { nl: [RSVZ + 'zelfstandige-bijberoep', 'RSVZ, Zelfstandige in bijberoep', D25], fr: [INASTI + 'independant-titre-complementaire', 'INASTI, Indépendant à titre complémentaire', D25] },
  meeDef: { nl: [RSVZ + 'wat-betekent-dat-juist-meewerkende-echtgenoot', 'RSVZ, Wat betekent dat juist: meewerkende echtgenoot?', D25], fr: [INASTI + 'quest-ce-que-le-statut-du-conjoint-aidant', 'INASTI, Qu’est-ce que le statut du conjoint aidant ?', D25] },
  mee: { nl: [RSVZ + 'meewerkende-echtgenoot', 'RSVZ, Meewerkende echtgenoot', D25], fr: [INASTI + 'conjoint-aidant', 'INASTI, Conjoint aidant', D25] },
  helper: { nl: [RSVZ + 'wat-betekent-dat-juist-helper', 'RSVZ, Wat betekent dat juist: helper?', D25], fr: [INASTI + 'que-signifie-exactement-aidant', 'INASTI, Que signifie exactement : aidant ?', D25] },
  aansluiten: { nl: [RSVZ + 'faq/aansluiten-bij-een-socialeverzekeringsfonds-0', 'RSVZ, Aansluiten bij een socialeverzekeringsfonds', D25], fr: [INASTI + 'faq/saffilier-une-caisse-dassurances-sociales', 'INASTI, S’affilier à une caisse d’assurances sociales', D25] },
  hoeveel: { nl: [RSVZ + 'faq/hoeveel-sociale-bijdragen-moet-ik-betalen', 'RSVZ, Hoeveel sociale bijdragen moet ik betalen?', D25], fr: [INASTI + 'faq/combien-de-cotisations-sociales-dois-je-payer', 'INASTI, Combien de cotisations sociales dois-je payer ?', D25] },
  folder: { nl: ['https://www.rsvz.be/sites/rsvz/files/2024-01/folder_sociale_bijdragen.pdf', 'RSVZ, Bijdragen 2026 – Refertejaar 2023 (januari 2026, pdf)', D25], fr: ['https://www.rsvz.be/sites/rsvz/files/2024-01/folder_cotisations_sociales.pdf', 'INASTI, Cotisations 2026 – Année de référence 2023 (janvier 2026, pdf)', D25] },
  waarom: { nl: [RSVZ + 'faq/waarom-moet-ik-sociale-bijdragen-betalen', 'RSVZ, Waarom moet ik sociale bijdragen betalen?', D25], fr: [INASTI + 'faq/pourquoi-dois-je-payer-des-cotisations-sociales', 'INASTI, Pourquoi dois-je payer des cotisations sociales ?', D25] },
  pensioen: { nl: [RSVZ + 'faq/ik-heb-gewerkt-als-zelfstandige-heb-ik-recht-op-een-pensioen', 'RSVZ, Ik heb gewerkt als zelfstandige. Heb ik recht op een pensioen?', D25], fr: [INASTI + 'faq/jai-travaille-comme-independant-ai-je-droit-une-pension', 'INASTI, J’ai travaillé comme indépendant. Ai-je droit à une pension ?', D26] },
  pensioenBij: { nl: [RSVZ + 'faq/krijg-ik-een-pensioen-voor-de-uitoefening-van-een-bijberoep-als-zelfstandige', 'RSVZ, Krijg ik een pensioen voor de uitoefening van een bijberoep als zelfstandige?', D25], fr: [INASTI + 'faq/est-ce-que-lexercice-dune-activite-complementaire-de-travailleur-independant-me-donne-droit-une', 'INASTI, Est-ce que l’exercice d’une activité complémentaire de travailleur indépendant me donne droit à une pension ?', D26] },
  ziektekosten: { nl: [RSVZ + 'faq/hoe-zit-het-met-de-terugbetaling-van-mijn-ziektekosten', 'RSVZ, Hoe zit het met de terugbetaling van mijn ziektekosten?', D25], fr: [INASTI + 'faq/quen-est-il-du-remboursement-de-mes-soins-de-sante', 'INASTI, Qu’en est-il du remboursement de mes soins de santé ?', D26] },
  ongeschikt: { nl: [RSVZ + 'faq/recht-op-uitkering-als-arbeidsongeschikte-zelfstandige', 'RSVZ, Recht op uitkering als arbeidsongeschikte zelfstandige', D25], fr: [INASTI + 'faq/droit-aux-indemnites-en-tant-quindependant-en-incapacite-de-travail', 'INASTI, Droit aux indemnités en tant qu’indépendant en incapacité de travail', D26] },
  stop: { nl: [RSVZ + 'stopzetting-activiteit', 'RSVZ, Stopzetting activiteit', D25], fr: [INASTI + 'cessation-dactivite', 'INASTI, Cessation d’activité', D26] },
  gezin: { nl: [RSVZ + 'gezin-en-kinderen', 'RSVZ, Gezin en kinderen', D25], fr: [INASTI + 'famille-et-enfants', 'INASTI, Famille et enfants', D25] },
  over: { nl: [RSVZ + 'over-het-rsvz', 'RSVZ, Over het RSVZ', D25], fr: [INASTI + 'propos-de-linasti', 'INASTI, À propos de l’INASTI', D25] },
  fondsen: { nl: [RSVZ + 'socialeverzekeringsfondsen', 'RSVZ, Socialeverzekeringsfondsen', D25], fr: [INASTI + 'caisses-dassurances-sociales', 'INASTI, Caisses d’assurances sociales', D25] },
  art23: { nl: [FISCONET + 'faca8178-20de-45b6-acb6-00769cba1c00', 'FOD Financiën, Fisconetplus: Artikel 23, WIB 92 (inkomsten 2026)', D26], fr: [FISCONET + '86349a7b-0970-494f-9fb5-bf0ed37a5ed9', 'SPF Finances, Fisconetplus : Article 23, CIR 92 (revenus 2026)', D26] },
  art52: { nl: [FISCONET + 'e2123748-b2c4-49ab-8b2d-5eacb94fbc34', 'FOD Financiën, Fisconetplus: Artikel 52, WIB 92 (inkomsten 2026)', D26], fr: [FISCONET + '60edb410-72a2-4f9e-b5a4-e42f49c9127c', 'SPF Finances, Fisconetplus : Article 52, CIR 92 (revenus 2026)', D26] }
};

// Section routes: key -> [NL slug, FR slug] under the section root.
export const ROOT = { nl: 'nl/zelfstandigen/', fr: 'fr/independants/' };
export const PAGES_ORDER = ['index', 'wie', 'bijdragen', 'statuut', 'belasting', 'administraties'];
export const SLUGS = {
  index: ['', ''],
  wie: ['wie-is-zelfstandige/', 'qui-est-independant/'],
  bijdragen: ['sociale-bijdragen/', 'cotisations-sociales/'],
  statuut: ['sociaal-statuut/', 'statut-social/'],
  belasting: ['personenbelasting/', 'impot-sur-les-revenus/'],
  administraties: ['administraties/', 'administrations/']
};

// Glossary terms (existing pages): key -> [NL slug, NL label, FR slug, FR label].
export const TERMS = {
  personenbelasting: ['personenbelasting/', 'Personenbelasting', 'impot-des-personnes-physiques/', 'Impôt des personnes physiques'],
  beroepskosten: ['beroepskosten/', 'Beroepskosten', 'frais-professionnels/', 'Frais professionnels'],
  inkomstenjaar: ['inkomstenjaar/', 'Inkomstenjaar', 'annee-de-revenus/', 'Année de revenus'],
  aanslagjaar: ['aanslagjaar/', 'Aanslagjaar', 'exercice-d-imposition/', 'Exercice d’imposition'],
  aangifte: ['belastingaangifte/', 'Belastingaangifte', 'declaration-d-impot/', 'Déclaration d’impôt'],
  aanslagbiljet: ['aanslagbiljet/', 'Aanslagbiljet', 'avertissement-extrait-de-role/', 'Avertissement-extrait de rôle'],
  werknemersbijdrage: ['werknemersbijdrage/', 'Werknemersbijdrage', 'cotisation-personnelle/', 'Cotisation personnelle'],
  myminfin: ['myminfin/', 'MyMinfin', 'myminfin/', 'MyMinfin'],
  gemeenschappelijk: ['gemeenschappelijke-aanslag/', 'Gemeenschappelijke aanslag', 'imposition-commune/', 'Imposition commune']
};

// The pending calculator block shown on every topic page (Mapafiscal's "cálculo rápido").
export const CALC = {
  nl: { title: 'Sociale bijdragen berekenen', income: 'Netto beroepsinkomen van het bijdragejaar', category: 'Bijdragecategorie',
    options: [['hoofdberoep', 'Zelfstandige in hoofdberoep'], ['bijberoep', 'Zelfstandige in bijberoep'], ['meewerkende-echtgenoot', 'Meewerkende echtgenoot (maxistatuut)']],
    unit: 'sociale bijdrage per kwartaal', pending: 'Resultaat volgt zodra alle regels officieel bevestigd en getest zijn.',
    sentence: 'Belastingkaart berekent nog geen bijdrage voor jouw situatie. De officiële bedragen voor 2026 staan in de tabel hieronder; je socialeverzekeringsfonds stelt je bijdrage vast.',
    note: 'Geen persoonlijke berekening. Beheerskosten van het socialeverzekeringsfonds niet inbegrepen.', go: 'Naar de bruto-netto simulator', method: 'Hoe we rekenen' },
  fr: { title: 'Calculer les cotisations sociales', income: 'Revenu professionnel net de l’année de cotisation', category: 'Catégorie de cotisation',
    options: [['hoofdberoep', 'Indépendant à titre principal'], ['bijberoep', 'Indépendant à titre complémentaire'], ['meewerkende-echtgenoot', 'Conjoint aidant (maxi-statut)']],
    unit: 'cotisation sociale par trimestre', pending: 'Le résultat s’affichera lorsque toutes les règles seront officiellement confirmées et testées.',
    sentence: 'Belastingkaart ne calcule pas encore de cotisation pour votre situation. Les montants officiels 2026 figurent dans le tableau ci-dessous ; votre caisse d’assurances sociales fixe votre cotisation.',
    note: 'Aucun calcul personnalisé. Frais de gestion de la caisse d’assurances sociales non compris.', go: 'Vers le simulateur brut-net', method: 'Comment nous calculons' }
};

// Rows of the official 2026 contribution table for a self-employed person in main occupation.
const MAIN_2026 = {
  nl: [
    ['Bijdragepercentage op het beroepsinkomen tot 75.024,54 euro', '20,50 %'],
    ['Bijdragepercentage op het deel van 75.024,54 tot 110.562,42 euro', '14,16 %'],
    ['Minimuminkomen waarop de bijdrage minstens wordt berekend', '17.374,08 euro'],
    ['Minimumbijdrage per kwartaal', '890,42 euro'],
    ['Maximumbijdrage per kwartaal', '5.103,05 euro']
  ],
  fr: [
    ['Taux de cotisation sur le revenu professionnel jusqu’à 75.024,54 euros', '20,50 %'],
    ['Taux de cotisation sur la partie de 75.024,54 à 110.562,42 euros', '14,16 %'],
    ['Revenu minimum sur lequel la cotisation est au moins calculée', '17.374,08 euros'],
    ['Cotisation trimestrielle minimum', '890,42 euros'],
    ['Cotisation trimestrielle maximum', '5.103,05 euros']
  ]
};

export const PAGES = {
  // ---------------------------------------------------------------- index
  index: {
    nl: {
      title: 'Zelfstandigen: bijdragen en belasting 2026 | Belastingkaart',
      description: 'Sociale bijdragen van zelfstandigen in 2026: percentages, voorlopige en definitieve bijdragen, sociaal statuut en personenbelasting, uit officiële bronnen.',
      h1: 'Sociale bijdragen en belasting als zelfstandige (2026)', crumb: 'Zelfstandigen',
      summary: 'Een zelfstandige in hoofdberoep betaalt in 2026 20,50 % sociale bijdragen op zijn beroepsinkomen tot 75.024,54 euro en 14,16 % op het deel tot 110.562,42 euro, met een minimumbijdrage van 890,42 euro per kwartaal. Die bijdragen gaan naar het sociaal statuut; het beroepsinkomen zelf valt onder de personenbelasting.',
      cards: [
        ['Hoe een zelfstandige bijdraagt en belast wordt', `<p>Een zelfstandige is volgens het RSVZ een natuurlijk persoon die in België een beroepsactiviteit uitoefent zonder arbeidsovereenkomst of ambtenarenstatuut. Hij moet zich <b>aansluiten bij een socialeverzekeringsfonds</b> en betaalt daar sociale bijdragen. Die bijdragen zijn een percentage van zijn beroepsinkomsten: de brutoberoepsinkomsten, verminderd met de <a href="{G}beroepskosten/">beroepskosten</a> en beroepsverliezen, zoals de belastingadministratie ze vaststelt.</p><p>Dezelfde beroepsinkomsten zijn ook belastbaar in de <a href="{G}personenbelasting/">personenbelasting</a>. Het WIB 92 rekent de persoonlijke bijdragen ter uitvoering van de sociale wetgeving tot de beroepskosten.</p>`]
      ],
      table: { title: 'Bijdragen 2026 voor een zelfstandige in hoofdberoep', head: ['Regel', 'Bedrag 2026'], rows: MAIN_2026.nl,
        help: 'Zoals het RSVZ ze publiceert in “Bijdragen 2026 – Refertejaar 2023” (januari 2026). Geen persoonlijke berekening; de beheerskosten van het socialeverzekeringsfonds komen erbovenop.',
        after: 'Voor primostarters, zelfstandigen in bijberoep en meewerkende echtgenoten gelden andere bedragen: zie <a href="sociale-bijdragen/">sociale bijdragen</a>.' },
      cards2: [
        ['Voorlopige en definitieve bijdragen', `<p>De definitieve bijdragen worden berekend op de inkomsten van het jaar zelf: de bijdragen voor 2026 op de inkomsten van 2026. Omdat de fiscus die inkomsten meestal pas een of twee jaar later vaststelt, betaal je eerst <b>voorlopige bijdragen</b> op basis van je inkomen van drie jaar voordien. Zodra de fiscus je beroepsinkomsten meedeelt, worden ze geregulariseerd: je betaalt bij of je krijgt geld terug.</p>`],
        ['Wat de bijdragen je opleveren', `<p>Per kwartaal betaal je een globale som die volgens de reële behoeften verdeeld wordt over de gezinsbijslag, de pensioenen, de ziekte- en invaliditeitsverzekering en het overbruggingsrecht. Voor de werkloosheid draag je niet bij. Meer in <a href="sociaal-statuut/">het sociaal statuut</a>.</p>`]
      ],
      table2: { title: 'Bijdragecategorieën in 2026', text: true, head: ['Categorie', 'Definitieve bijdrage 2026', 'Minimum per kwartaal'],
        rows: [
          ['<a href="wie-is-zelfstandige/">Zelfstandige in hoofdberoep</a>', '20,50 % tot 75.024,54 euro, op minstens 17.374,08 euro', '890,42 euro'],
          ['<a href="wie-is-zelfstandige/">Zelfstandige in bijberoep</a>', 'geen bijdrage onder 1.922,16 euro; daarboven 20,50 % tot 75.024,54 euro', '98,51 euro'],
          ['<a href="wie-is-zelfstandige/">Meewerkende echtgenoot (maxistatuut)</a>', '20,50 % tot 75.024,54 euro, op minstens 7.632,44 euro', '391,16 euro']
        ],
        help: 'Bron: RSVZ, “Bijdragen 2026”. Boven 75.024,54 euro geldt voor alle drie 14,16 % tot 110.562,42 euro; de maximumbijdrage is 5.103,05 euro per kwartaal.' },
      notCovered: ['Wat deze pagina niet behandelt', [
        'Bijzondere categorieën: primostarters, student-zelfstandigen, gelijkstelling met bijberoep (artikel 37), gepensioneerden en zelfstandigen vanaf de pensioenleeftijd.',
        'De beheerskosten van je socialeverzekeringsfonds.',
        'De belastingtarieven en de berekening van de personenbelasting op je beroepsinkomen.',
        'Vennootschappen en hun bestuurders: andere regels en andere bijdragen.',
        'De btw, een afzonderlijke belasting.'
      ]],
      faq: [
        ['Hoeveel sociale bijdragen betaalt een zelfstandige in 2026?', 'Een zelfstandige in hoofdberoep betaalt 20,50 % op zijn beroepsinkomen tot 75.024,54 euro en 14,16 % op het deel tot 110.562,42 euro. De minimumbijdrage is 890,42 euro en de maximumbijdrage 5.103,05 euro per kwartaal (RSVZ, Bijdragen 2026).'],
        ['Op welk inkomen worden de bijdragen berekend?', 'Op de brutoberoepsinkomsten, verminderd met de beroepskosten en beroepsverliezen, zoals de belastingadministratie ze vaststelt. De definitieve bijdragen voor een jaar steunen op het inkomen van dat jaar.'],
        ['Waarom betaal ik eerst voorlopige bijdragen?', 'Je socialeverzekeringsfonds kent je inkomen van het jaar pas wanneer de fiscus het vastgesteld heeft, meestal een of twee jaar later. Daarom betaal je eerst voorlopige bijdragen op je inkomen van drie jaar voordien; die worden daarna geregulariseerd.'],
        ['Betaalt een zelfstandige in bijberoep minder?', 'In 2026 betaalt een zelfstandige in bijberoep geen bijdragen op een beroepsinkomen onder 1.922,16 euro. Daarboven betaalt hij 20,50 %, met een minimumbijdrage van 98,51 euro per kwartaal. Zolang hij geen of verminderde bijdragen betaalt (inkomen onder 17.374,08 euro), bouwt hij geen extra rechten op in het sociaal statuut van de zelfstandigen.'],
        ['Draagt een zelfstandige bij voor de werkloosheid?', 'Nee. Volgens het RSVZ worden de bijdragen verdeeld over gezinsbijslag, pensioenen, ziekte en invaliditeit en het overbruggingsrecht; voor de werkloosheid draag je niet bij.']
      ],
      sources: ['wie', 'hoeveel', 'folder', 'waarom', 'bij', 'art52'],
      terms: ['personenbelasting', 'beroepskosten', 'inkomstenjaar', 'aanslagjaar', 'werknemersbijdrage']
    },
    fr: {
      title: 'Indépendant : cotisations sociales et impôt | Belastingkaart',
      description: 'Cotisations sociales des indépendants en 2026 : taux, cotisations provisoires et définitives, statut social et impôt sur les revenus, sources officielles.',
      h1: 'Cotisations sociales et impôt de l’indépendant (2026)', crumb: 'Indépendants',
      summary: 'Un indépendant à titre principal paie en 2026 20,50 % de cotisations sociales sur son revenu professionnel jusqu’à 75.024,54 euros et 14,16 % sur la partie jusqu’à 110.562,42 euros, avec une cotisation minimum de 890,42 euros par trimestre. Ces cotisations financent le statut social ; le revenu professionnel lui-même relève de l’impôt des personnes physiques.',
      cards: [
        ['Comment un indépendant cotise et est imposé', `<p>Selon l’INASTI, un travailleur indépendant est une personne physique qui exerce une activité professionnelle en Belgique sans être liée par un contrat de travail ou un statut de fonctionnaire. Il doit <b>s’affilier à une caisse d’assurances sociales</b> et y paie des cotisations sociales. Ces cotisations représentent un pourcentage de ses revenus professionnels : les revenus professionnels bruts, diminués des <a href="{G}frais-professionnels/">frais professionnels</a> et des pertes professionnelles, tels que l’administration fiscale les fixe.</p><p>Ces mêmes revenus professionnels sont imposables à l’<a href="{G}impot-des-personnes-physiques/">impôt des personnes physiques</a>. Le CIR 92 range les cotisations personnelles dues en exécution de la législation sociale parmi les frais professionnels.</p>`]
      ],
      table: { title: 'Cotisations 2026 d’un indépendant à titre principal', head: ['Règle', 'Montant 2026'], rows: MAIN_2026.fr,
        help: 'Telles que l’INASTI les publie dans « Cotisations 2026 – Année de référence 2023 » (janvier 2026). Aucun calcul personnalisé ; les frais de gestion de la caisse d’assurances sociales s’y ajoutent.',
        after: 'D’autres montants s’appliquent aux primostarters, aux indépendants à titre complémentaire et aux conjoints aidants : voir <a href="cotisations-sociales/">cotisations sociales</a>.' },
      cards2: [
        ['Cotisations provisoires et définitives', `<p>Les cotisations définitives sont calculées sur les revenus de l’année même : les cotisations 2026 sur les revenus de 2026. Comme le fisc fixe ces revenus un à deux ans plus tard dans la majorité des cas, vous payez d’abord des <b>cotisations provisoires</b> sur vos revenus d’il y a trois ans. Dès que le fisc communique vos revenus professionnels, elles sont régularisées : vous payez un supplément ou vous récupérez de l’argent.</p>`],
        ['Ce que les cotisations vous apportent', `<p>Chaque trimestre, vous payez une somme globale répartie, selon les besoins effectifs, entre les prestations familiales, les pensions, l’assurance maladie et invalidité et le droit passerelle. Il n’y a pas de cotisation pour le chômage. Voir <a href="statut-social/">le statut social</a>.</p>`]
      ],
      table2: { title: 'Catégories de cotisation en 2026', text: true, head: ['Catégorie', 'Cotisation définitive 2026', 'Minimum par trimestre'],
        rows: [
          ['<a href="qui-est-independant/">Indépendant à titre principal</a>', '20,50 % jusqu’à 75.024,54 euros, sur au moins 17.374,08 euros', '890,42 euros'],
          ['<a href="qui-est-independant/">Indépendant à titre complémentaire</a>', 'aucune cotisation sous 1.922,16 euros ; au-delà 20,50 % jusqu’à 75.024,54 euros', '98,51 euros'],
          ['<a href="qui-est-independant/">Conjoint aidant (maxi-statut)</a>', '20,50 % jusqu’à 75.024,54 euros, sur au moins 7.632,44 euros', '391,16 euros']
        ],
        help: 'Source : INASTI, « Cotisations 2026 ». Au-delà de 75.024,54 euros, le taux est de 14,16 % jusqu’à 110.562,42 euros pour les trois ; la cotisation maximum est de 5.103,05 euros par trimestre.' },
      notCovered: ['Ce que cette page ne traite pas', [
        'Les catégories particulières : primostarters, étudiants-indépendants, assimilation à une activité complémentaire (article 37), pensionnés et indépendants ayant atteint l’âge de la pension.',
        'Les frais de gestion de votre caisse d’assurances sociales.',
        'Les taux d’imposition et le calcul de l’impôt des personnes physiques sur votre revenu professionnel.',
        'Les sociétés et leurs dirigeants : d’autres règles et d’autres cotisations.',
        'La TVA, qui est un impôt distinct.'
      ]],
      faq: [
        ['Combien de cotisations sociales un indépendant paie-t-il en 2026 ?', 'Un indépendant à titre principal paie 20,50 % sur son revenu professionnel jusqu’à 75.024,54 euros et 14,16 % sur la partie jusqu’à 110.562,42 euros. La cotisation minimum est de 890,42 euros et la cotisation maximum de 5.103,05 euros par trimestre (INASTI, Cotisations 2026).'],
        ['Sur quel revenu les cotisations sont-elles calculées ?', 'Sur les revenus professionnels bruts, diminués des frais professionnels et des pertes professionnelles, tels que l’administration fiscale les fixe. Les cotisations définitives d’une année reposent sur le revenu de cette année.'],
        ['Pourquoi est-ce que je paie d’abord des cotisations provisoires ?', 'Votre caisse d’assurances sociales ne connaît votre revenu de l’année qu’une fois fixé par le fisc, généralement un à deux ans plus tard. Vous payez donc d’abord des cotisations provisoires sur vos revenus d’il y a trois ans, régularisées ensuite.'],
        ['Un indépendant à titre complémentaire paie-t-il moins ?', 'En 2026, un indépendant à titre complémentaire ne paie pas de cotisations sur un revenu professionnel inférieur à 1.922,16 euros. Au-delà, il paie 20,50 %, avec une cotisation minimum de 98,51 euros par trimestre. Tant qu’il ne paie pas de cotisations ou seulement des cotisations réduites (revenu inférieur à 17.374,08 euros), il ne se constitue pas de droits supplémentaires dans le statut social des indépendants.'],
        ['Un indépendant cotise-t-il pour le chômage ?', 'Non. Selon l’INASTI, les cotisations sont réparties entre les prestations familiales, les pensions, la maladie et l’invalidité et le droit passerelle ; il n’y a pas de cotisation pour le chômage.']
      ],
      sources: ['wie', 'hoeveel', 'folder', 'waarom', 'bij', 'art52'],
      terms: ['personenbelasting', 'beroepskosten', 'inkomstenjaar', 'aanslagjaar', 'werknemersbijdrage']
    }
  },

  // ---------------------------------------------------------------- who counts
  wie: {
    nl: {
      title: 'Zelfstandige in hoofd- of bijberoep | Belastingkaart',
      description: 'Wie is zelfstandige volgens het RSVZ: hoofdberoep, bijberoep, helper en meewerkende echtgenoot, het onderscheid met werknemers en wie niet moet aansluiten.',
      h1: 'Wie is zelfstandige? Hoofdberoep, bijberoep en meewerkende echtgenoot', crumb: 'Wie is zelfstandige?',
      summary: 'Zelfstandige ben je als je in België regelmatig en met winstoogmerk een beroepsactiviteit uitoefent zonder arbeidsovereenkomst of ambtenarenstatuut. Oefen je daarnaast een andere beroepsbezigheid uit als werknemer of ambtenaar, dan ben je zelfstandige in bijberoep. Ook helpers en meewerkende echtgenoten vallen onder het sociaal statuut.',
      table: { title: 'Wie valt onder het sociaal statuut van de zelfstandigen?', head: ['Statuut', 'Wanneer', 'Aansluiten bij een fonds'], text: true,
        rows: [
          ['Zelfstandige', 'Beroepsactiviteit in België zonder arbeidsovereenkomst of ambtenarenstatuut, op regelmatige basis en met winstoogmerk.', 'Ja, vóór de start van de activiteit.'],
          ['Zelfstandige in bijberoep', 'Gelijktijdig een andere beroepsbezigheid als werknemer of ambtenaar, of een vervangingsinkomen voor een weggevallen activiteit als werknemer of ambtenaar.', 'Ja, met dezelfde wettelijke verplichtingen als in hoofdberoep.'],
          ['Helper', 'Staat een zelfstandige bij of vervangt hem, zonder arbeidsovereenkomst en niet onder zijn gezag; hoeft geen familie te zijn.', 'Meestal wel, behalve in de uitzonderingen hieronder.'],
          ['Meewerkende echtgenoot', 'Gehuwde of wettelijk samenwonende partner die effectief meehelpt (regelmatig of minstens 90 dagen per jaar), zonder eigen inkomen dat hem volwaardig verzekert.', 'Ja, bij het fonds van de zelfstandige partner (maxistatuut).']
        ],
        help: 'Samenvatting van de omschrijvingen van het RSVZ. Bij twijfel beslist niet Belastingkaart, maar de bevoegde instantie.' },
      cards: [
        ['Zelfstandige of werknemer?', `<p>Werknemers en zelfstandigen verrichten allebei arbeid tegen een verloning, maar een werknemer werkt onder het gezag van een werkgever. Of er een <b>gezagsverhouding</b> is, wordt beoordeeld aan de hand van vier algemene criteria: de wil van de partijen, de vrijheid om de werktijd te organiseren, de vrijheid om het werk te organiseren en de mogelijkheid van hiërarchische controle.</p><p>In de bouw, de bewaking, het vervoer van goederen of personen, de schoonmaak, de land- en tuinbouw en het digitaal platformwerk geldt een vermoeden van werknemer of zelfstandige. Bij twijfel kan je je situatie onder bepaalde voorwaarden laten onderzoeken door de Commissie Arbeidsrelaties.</p>`],
        ['Hoofdberoep en bijberoep', `<p>Je bent zelfstandige in bijberoep wanneer je naast je zelfstandige activiteit nog een andere beroepsbezigheid uitoefent als werknemer of ambtenaar, of een vervangingsinkomen krijgt voor een weggevallen activiteit als werknemer of ambtenaar, zoals een werkloosheidsuitkering of een arbeidsongeschiktheidsuitkering. Dat vervangingsinkomen moet minstens gelijk zijn aan het minimumpensioen voor een alleenstaande zelfstandige; zoniet ben je volgens het RSVZ zelfstandige in hoofdberoep.</p>`],
        ['Bestuurders van een vennootschap', `<p>Wie een mandaat uitoefent in een vennootschap (bestuurder, zaakvoerder…) wordt vermoed zelfstandige te zijn. Dat vermoeden kan je weerleggen door aan te tonen dat het mandaat zowel in rechte als in feite kosteloos is. Oefen je daarnaast geen andere zelfstandige activiteit uit, dan moet je je niet aansluiten bij een socialeverzekeringsfonds.</p>`]
      ],
      lists: [
        ['Voorwaarden voor het hoofdberoep naast een bijberoep', [
          'Als werknemer: minstens de helft van het aantal arbeidsuren per maand van een voltijdse werknemer in dezelfde onderneming of sector.',
          'Als benoemd leerkracht: minstens 6/10 van een volledig lesrooster; als contractueel leerkracht volstaat een half uurrooster.',
          'Als ambtenaar met een eigen pensioenregeling: minstens 8 maanden of 200 dagen per jaar, met minstens de helft van de arbeidsuren van een voltijdse betrekking.'
        ]],
        ['Wie moet niet aansluiten?', [
          'Helpers die ongehuwd en jonger dan 20 zijn, helpers die studeren en recht geven op kinderbijslag, en helpers die niet regelmatig en minder dan 90 dagen per jaar werken.',
          'Wie voor de sociale zekerheid gelijkgesteld wordt met een werknemer, of onder een wettelijk vermoeden van arbeidsovereenkomst valt.',
          'Publieke mandatarissen.',
          'Wie diensten verleent via een door de FOD Financiën erkend platform van de deeleconomie, met inkomsten die volgens die bijzondere regels belast worden.'
        ]]
      ],
      faq: [
        ['Kan ik voor dezelfde opdracht werknemer en zelfstandige zijn?', 'Nee. Werk je op basis van een arbeidsovereenkomst onder het gezag van een werkgever, dan ben je voor die activiteit werknemer en kan je niet aansluiten als zelfstandige.'],
        ['Moet ik al inkomsten hebben om zelfstandige te zijn?', 'Nee. Het RSVZ vraagt een winstoogmerk: de bedoeling om winst te maken volstaat, of er werkelijk inkomsten zijn maakt niet uit. Een occasionele, geïsoleerde activiteit maakt je wel geen zelfstandige.'],
        ['Wanneer ben ik meewerkende echtgenoot?', 'Als gehuwde of wettelijk samenwonende partner van een zelfstandige die effectief meehelpt, regelmatig of minstens 90 dagen per jaar, zonder eigen zelfstandig inkomen van meer dan 3.000 euro per jaar en zonder eigen inkomen als werknemer of ambtenaar of vervangingsinkomen dat je volwaardig verzekert.'],
        ['Moet een helper familie zijn van de zelfstandige?', 'Nee. Een helper staat een zelfstandige bij of vervangt hem zonder arbeidsovereenkomst en mag niet onder zijn gezag werken, maar hoeft geen familie te zijn.'],
        ['Wat als ik twijfel of ik zelfstandige of werknemer ben?', 'Dan kan je je situatie onder bepaalde voorwaarden laten onderzoeken door de Administratieve Commissie ter regeling van de arbeidsrelatie (Commissie Arbeidsrelaties).']
      ],
      sources: ['wie', 'bijDef', 'bij', 'helper', 'meeDef', 'mee', 'aansluiten'],
      terms: ['werknemersbijdrage', 'gemeenschappelijk']
    },
    fr: {
      title: 'Qui est indépendant ? Les statuts | Belastingkaart',
      description: 'Qui est indépendant selon l’INASTI : activité principale ou complémentaire, aidant, conjoint aidant, différence avec les salariés et qui ne doit pas s’affilier.',
      h1: 'Qui est indépendant ? Activité principale, complémentaire et conjoint aidant', crumb: 'Qui est indépendant ?',
      summary: 'Vous êtes indépendant si vous exercez en Belgique, régulièrement et dans un but lucratif, une activité professionnelle sans contrat de travail ni statut de fonctionnaire. Si vous exercez en plus une autre activité professionnelle comme salarié ou fonctionnaire, vous êtes indépendant à titre complémentaire. Les aidants et les conjoints aidants relèvent aussi du statut social.',
      table: { title: 'Qui relève du statut social des indépendants ?', head: ['Statut', 'Quand', 'Affiliation à une caisse'], text: true,
        rows: [
          ['Indépendant', 'Activité professionnelle en Belgique sans contrat de travail ni statut de fonctionnaire, exercée régulièrement et dans un but lucratif.', 'Oui, avant le début de l’activité.'],
          ['Indépendant à titre complémentaire', 'Parallèlement, une autre activité professionnelle comme salarié ou fonctionnaire, ou un revenu de remplacement pour une activité de salarié ou de fonctionnaire qui n’est plus exercée.', 'Oui, avec les mêmes obligations légales qu’à titre principal.'],
          ['Aidant', 'Assiste ou supplée un indépendant, sans contrat de louage de travail et pas sous son autorité ; ne doit pas être un membre de la famille.', 'Généralement oui, sauf dans les exceptions ci-dessous.'],
          ['Conjoint aidant', 'Partenaire marié ou cohabitant légal qui apporte une aide effective (régulièrement ou au moins 90 jours par an), sans revenus propres lui ouvrant des droits sociaux suffisants.', 'Oui, à la caisse du partenaire indépendant (maxi-statut).']
        ],
        help: 'Résumé des définitions de l’INASTI. En cas de doute, ce n’est pas Belastingkaart qui décide, mais l’instance compétente.' },
      cards: [
        ['Indépendant ou salarié ?', `<p>Les travailleurs salariés et les travailleurs indépendants fournissent tous deux un travail contre rémunération, mais le salarié travaille sous l’autorité d’un employeur. L’existence d’un <b>lien de subordination</b> s’apprécie au moyen de quatre critères généraux : la volonté des parties, la liberté d’organiser le temps de travail, la liberté d’organiser le travail et la possibilité d’exercer un contrôle hiérarchique.</p><p>Dans la construction, la surveillance, le transport de choses ou de personnes, le nettoyage, l’agriculture et l’horticulture et le travail via une plateforme numérique, une présomption de salarié ou d’indépendant s’applique. En cas de doute, vous pouvez, sous certaines conditions, faire examiner votre situation par la Commission Relations de travail.</p>`],
        ['Activité principale et complémentaire', `<p>Vous êtes indépendant à titre complémentaire si, parallèlement à votre activité d’indépendant, vous exercez une autre activité professionnelle comme salarié ou fonctionnaire, ou si vous bénéficiez d’un revenu de remplacement pour une activité de salarié ou de fonctionnaire interrompue, comme une allocation de chômage ou une indemnité d’incapacité de travail. Ce revenu doit être au moins égal à la pension minimum d’un travailleur indépendant isolé ; sinon, selon l’INASTI, vous êtes indépendant à titre principal.</p>`],
        ['Mandataires de société', `<p>La personne qui exerce un mandat dans une société (administrateur, gérant…) est présumée exercer une activité indépendante. Elle peut renverser cette présomption en démontrant que le mandat est gratuit aussi bien en droit qu’en fait. Si elle n’exerce en outre aucune autre activité indépendante, elle ne doit pas s’affilier à une caisse d’assurances sociales.</p>`]
      ],
      lists: [
        ['Conditions de l’activité principale à côté d’une activité complémentaire', [
          'Comme salarié : au moins la moitié du nombre d’heures de travail par mois d’un salarié à temps plein dans la même entreprise ou le même secteur.',
          'Comme enseignant nommé : au moins 6/10 d’un horaire complet ; comme enseignant contractuel, une moitié d’horaire suffit.',
          'Comme fonctionnaire avec un autre régime de pension : au moins 8 mois ou 200 jours par an, avec au moins la moitié des heures d’une occupation à temps plein.'
        ]],
        ['Qui ne doit pas s’affilier ?', [
          'Les aidants célibataires de moins de 20 ans, les aidants étudiants qui bénéficient d’allocations familiales et les aidants qui travaillent de manière irrégulière et moins de 90 jours par an.',
          'Les personnes assimilées à des salariés pour la sécurité sociale, ou soumises à une présomption légale de contrat de travail.',
          'Les mandataires publics.',
          'Les personnes qui fournissent des services via une plateforme d’économie collaborative agréée par le SPF Finances, dont les revenus sont imposés selon ces règles particulières.'
        ]]
      ],
      faq: [
        ['Puis-je être salarié et indépendant pour la même mission ?', 'Non. Si vous travaillez en vertu d’un contrat de travail sous l’autorité d’un employeur, vous êtes salarié pour cette activité et vous ne pouvez pas vous affilier en tant qu’indépendant.'],
        ['Dois-je déjà avoir des revenus pour être indépendant ?', 'Non. L’INASTI exige un but lucratif : la volonté de faire du profit suffit, qu’il y ait ou non réellement des revenus. Une activité isolée et ponctuelle ne fait toutefois pas de vous un indépendant.'],
        ['Quand suis-je conjoint aidant ?', 'Lorsque, partenaire marié ou cohabitant légal d’un indépendant, vous apportez une aide effective, régulièrement ou au moins 90 jours par an, sans revenus propres d’une activité indépendante supérieurs à 3.000 euros par an et sans revenus de salarié, de fonctionnaire ou de remplacement vous ouvrant des droits propres en sécurité sociale.'],
        ['Un aidant doit-il être un membre de la famille ?', 'Non. L’aidant assiste ou supplée un indépendant sans contrat de louage de travail et ne peut pas travailler sous son autorité, mais il ne doit pas nécessairement être un membre de sa famille.'],
        ['Que faire si je doute d’être indépendant ou salarié ?', 'Vous pouvez, sous certaines conditions, faire examiner votre situation par la Commission administrative de règlement de la relation de travail (Commission Relations de travail).']
      ],
      sources: ['wie', 'bijDef', 'bij', 'helper', 'meeDef', 'mee', 'aansluiten'],
      terms: ['werknemersbijdrage', 'gemeenschappelijk']
    }
  },

  // ---------------------------------------------------------------- contributions
  bijdragen: {
    nl: {
      title: 'Sociale bijdragen zelfstandige berekenen | Belastingkaart',
      description: 'Hoe de sociale bijdragen van een zelfstandige in 2026 berekend worden: socialeverzekeringsfonds, voorlopige bijdragen, refertejaar en definitieve bijdragen.',
      h1: 'Sociale bijdragen van een zelfstandige berekenen (2026)', crumb: 'Sociale bijdragen',
      summary: 'Je betaalt je sociale bijdragen per kwartaal aan je socialeverzekeringsfonds. De definitieve bijdragen voor 2026 worden berekend op je beroepsinkomen van 2026; tot de fiscus dat kent, betaal je voorlopige bijdragen op je geherwaardeerde inkomen van het refertejaar 2023.',
      table: { title: 'Zelfstandige in hoofdberoep: de bijdragen voor 2026 stap voor stap', head: ['Stap', 'Bedrag 2026'],
        rows: [
          ['Voorlopige bijdrage per kwartaal bij begin van activiteit (tot het einde van het derde volledige kalenderjaar)', '890,42 euro'],
          ['Eerste kwartaal van een primostarter', '771,90 euro'],
          ['Na het begin: 20,50 % op het geherwaardeerde inkomen van het refertejaar tot 75.024,54 euro, op minstens 17.374,08 euro', '20,50 %'],
          ['Deel van 75.024,54 tot 110.562,42 euro', '14,16 %'],
          ['Herwaarderingscoëfficiënt van het refertejaar 2023', '1,07236269'],
          ['Definitieve bijdrage: dezelfde percentages op het inkomen van 2026', '20,50 % / 14,16 %'],
          ['Minimum- en maximumbijdrage per kwartaal', '890,42 / 5.103,05 euro']
        ],
        help: 'Uit “Bijdragen 2026 – Refertejaar 2023” van het RSVZ (januari 2026). Geen persoonlijke berekening; beheerskosten niet inbegrepen.' },
      cards: [
        ['Aansluiten bij een socialeverzekeringsfonds', `<p>Voordat je start als zelfstandige moet je aangesloten zijn bij een socialeverzekeringsfonds naar keuze. Doe je dat niet, dan riskeer je een administratieve boete van 500 tot 2.000 euro en krijg je een aanmaning met 30 dagen om alsnog aan te sluiten. Daarna word je automatisch lid van de Nationale Hulpkas, het socialeverzekeringsfonds van het RSVZ.</p><p>Op 1 januari van elk jaar kan je van fonds veranderen als je minstens 4 jaar bij je huidige fonds bent aangesloten en daar geen schulden hebt.</p>`],
        ['Voorlopige bijdragen en regularisatie', `<p>De definitieve bijdragen worden berekend op de inkomsten van het jaar zelf. De fiscus stelt die meestal pas een of twee jaar later vast; daarom betaal je eerst voorlopige bijdragen op je inkomen van drie jaar voordien. Was je toen nog geen zelfstandige, dan betaal je wettelijk vastgelegde voorlopige bijdragen. Zodra de fiscus je beroepsinkomsten meedeelt, worden de voorlopige bijdragen geregulariseerd.</p>`],
        ['Meer of minder voorlopig betalen', `<p>Verwacht je een hoger inkomen dan drie jaar voordien, dan kan je hogere voorlopige bijdragen betalen om een grote bijbetaling te vermijden. Verwacht je een lager inkomen, dan kan je lagere voorlopige bijdragen vragen; je fonds moet akkoord gaan en je moet dat met objectieve elementen aantonen. Blijkt je werkelijke inkomen toch hoger, dan betaal je bij de eindafrekening een supplement én verhogingen. Een zelfstandige in hoofdberoep, een primostarter en een meewerkende echtgenoot betalen altijd minstens de minimumbijdrage.</p>`]
      ],
      lists: [
        ['Andere bijdragecategorieën', [
          'Meewerkende echtgenoot: maxistatuut met een minimuminkomen van 7.632,44 euro en een minimumbijdrage van 391,16 euro per kwartaal in 2026.',
          'Zelfstandige in bijberoep: geen bijdrage onder 1.922,16 euro beroepsinkomen; minimumbijdrage 98,51 euro per kwartaal in 2026.',
          'Gelijkstelling met bijberoep (artikel 37), student-zelfstandige, gepensioneerde actief als zelfstandige en zelfstandige vanaf pensioenleeftijd zonder rustpensioen: eigen regels in de RSVZ-brochure.'
        ]],
        ['Wat de bijdrage niet omvat', [
          'De beheerskosten die je socialeverzekeringsfonds mag aanrekenen om zijn uitgaven te dekken.',
          'Een bijdrage voor de werkloosheid: die bestaat niet voor zelfstandigen.',
          'De personenbelasting op je beroepsinkomen: zie <a href="../personenbelasting/">belasting op het inkomen van zelfstandigen</a>.'
        ]]
      ],
      faq: [
        ['Op welk inkomen worden mijn bijdragen voor 2026 berekend?', 'De definitieve bijdragen op je beroepsinkomsten van 2026. De voorlopige bijdragen na het begin van je activiteit op je geherwaardeerde beroepsinkomsten van het refertejaar 2023, met herwaarderingscoëfficiënt 1,07236269.'],
        ['Wie stelt mijn beroepsinkomen vast?', 'De belastingadministratie. Je socialeverzekeringsfonds kan je definitieve bijdragen pas bepalen wanneer de fiscus je beroepsinkomsten heeft meegedeeld.'],
        ['Kan ik lagere voorlopige bijdragen betalen?', 'Ja, als je met objectieve elementen aantoont dat je inkomen lager zal zijn en je fonds akkoord gaat. Is je werkelijke inkomen toch hoger, dan volgen een supplement en verhogingen. De minimumbijdrage blijft verschuldigd.'],
        ['Wat gebeurt er als ik me niet aansluit?', 'Je riskeert een administratieve boete van 500 tot 2.000 euro en krijgt een aanmaning met 30 dagen termijn. Daarna word je automatisch aangesloten bij de Nationale Hulpkas van het RSVZ.'],
        ['Hoe vaak betaal ik?', 'Per kwartaal. De bedragen in de RSVZ-brochure zijn kwartaalbijdragen.']
      ],
      sources: ['hoeveel', 'folder', 'aansluiten', 'waarom'],
      terms: ['inkomstenjaar', 'beroepskosten', 'aanslagbiljet']
    },
    fr: {
      title: 'Cotisations sociales indépendant 2026 | Belastingkaart',
      description: 'Cotisations sociales d’un indépendant en 2026 : caisse d’assurances sociales, cotisations provisoires sur l’année de référence et cotisations définitives.',
      h1: 'Calculer les cotisations sociales d’un indépendant (2026)', crumb: 'Cotisations sociales',
      summary: 'Vous payez vos cotisations sociales chaque trimestre à votre caisse d’assurances sociales. Les cotisations définitives 2026 sont calculées sur votre revenu professionnel de 2026 ; tant que le fisc ne le connaît pas, vous payez des cotisations provisoires sur votre revenu réévalué de l’année de référence 2023.',
      table: { title: 'Indépendant à titre principal : les cotisations 2026 pas à pas', head: ['Étape', 'Montant 2026'],
        rows: [
          ['Cotisation trimestrielle provisoire en début d’activité (jusqu’à la fin de la troisième année civile complète)', '890,42 euros'],
          ['Premier trimestre d’un primostarter', '771,90 euros'],
          ['Après le début : 20,50 % sur le revenu réévalué de l’année de référence jusqu’à 75.024,54 euros, sur au moins 17.374,08 euros', '20,50 %'],
          ['Partie de 75.024,54 à 110.562,42 euros', '14,16 %'],
          ['Coefficient de réévaluation de l’année de référence 2023', '1,07236269'],
          ['Cotisation définitive : les mêmes taux sur le revenu de 2026', '20,50 % / 14,16 %'],
          ['Cotisation trimestrielle minimum et maximum', '890,42 / 5.103,05 euros']
        ],
        help: 'Extrait de « Cotisations 2026 – Année de référence 2023 » de l’INASTI (janvier 2026). Aucun calcul personnalisé ; frais de gestion non compris.' },
      cards: [
        ['S’affilier à une caisse d’assurances sociales', `<p>Vous devez être affilié à une caisse d’assurances sociales de votre choix avant le début de votre activité d’indépendant. Sinon, vous risquez une amende administrative de 500 à 2.000 euros et vous recevez une mise en demeure vous laissant 30 jours pour vous affilier. Ensuite, vous êtes automatiquement affilié à la Caisse nationale auxiliaire, la caisse d’assurances sociales de l’INASTI.</p><p>Au 1er janvier de chaque année, vous pouvez changer de caisse si vous y êtes affilié depuis au moins 4 ans et n’y avez pas de dettes.</p>`],
        ['Cotisations provisoires et régularisation', `<p>Les cotisations définitives sont calculées sur les revenus de l’année même. Le fisc les fixe généralement un à deux ans plus tard ; c’est pourquoi vous payez d’abord des cotisations provisoires sur vos revenus d’il y a trois ans. Si vous n’étiez pas encore indépendant à l’époque, vous payez les cotisations provisoires fixées par la loi. Dès que le fisc communique vos revenus professionnels, les cotisations provisoires sont régularisées.</p>`],
        ['Payer plus ou moins à titre provisoire', `<p>Si vous vous attendez à un revenu supérieur à celui d’il y a trois ans, vous pouvez payer des cotisations provisoires plus élevées pour éviter un supplément élevé. Si vous vous attendez à un revenu inférieur, vous pouvez demander des cotisations provisoires réduites ; votre caisse doit marquer son accord et vous devez le démontrer par des éléments objectifs. Si votre revenu réel est quand même plus élevé, vous payez au décompte un supplément et des majorations. L’indépendant à titre principal, le primostarter et le conjoint aidant paient toujours au moins la cotisation minimum.</p>`]
      ],
      lists: [
        ['Autres catégories de cotisation', [
          'Conjoint aidant : maxi-statut avec un revenu minimum de 7.632,44 euros et une cotisation minimum de 391,16 euros par trimestre en 2026.',
          'Indépendant à titre complémentaire : aucune cotisation sous 1.922,16 euros de revenu professionnel ; cotisation minimum de 98,51 euros par trimestre en 2026.',
          'Assimilation à une activité complémentaire (article 37), étudiant-indépendant, pensionné actif comme indépendant et indépendant ayant atteint l’âge de la pension sans pension de retraite : règles propres dans la brochure de l’INASTI.'
        ]],
        ['Ce que la cotisation ne comprend pas', [
          'Les frais de gestion que votre caisse d’assurances sociales est autorisée à prélever pour couvrir ses dépenses.',
          'Une cotisation pour le chômage : elle n’existe pas pour les indépendants.',
          'L’impôt des personnes physiques sur votre revenu professionnel : voir <a href="../impot-sur-les-revenus/">l’impôt sur les revenus des indépendants</a>.'
        ]]
      ],
      faq: [
        ['Sur quel revenu mes cotisations 2026 sont-elles calculées ?', 'Les cotisations définitives sur vos revenus professionnels de 2026. Les cotisations provisoires après le début de l’activité sur vos revenus professionnels réévalués de l’année de référence 2023, avec le coefficient de réévaluation 1,07236269.'],
        ['Qui fixe mon revenu professionnel ?', 'L’administration fiscale. Votre caisse d’assurances sociales ne peut fixer vos cotisations définitives qu’une fois que le fisc lui a communiqué vos revenus professionnels.'],
        ['Puis-je payer des cotisations provisoires réduites ?', 'Oui, si vous démontrez par des éléments objectifs que votre revenu sera inférieur et que votre caisse marque son accord. Si votre revenu réel est quand même supérieur, un supplément et des majorations suivent. La cotisation minimum reste due.'],
        ['Que se passe-t-il si je ne m’affilie pas ?', 'Vous risquez une amende administrative de 500 à 2.000 euros et recevez une mise en demeure avec un délai de 30 jours. Ensuite, vous êtes automatiquement affilié à la Caisse nationale auxiliaire de l’INASTI.'],
        ['À quelle fréquence est-ce que je paie ?', 'Chaque trimestre. Les montants de la brochure de l’INASTI sont des cotisations trimestrielles.']
      ],
      sources: ['hoeveel', 'folder', 'aansluiten', 'waarom'],
      terms: ['inkomstenjaar', 'beroepskosten', 'aanslagbiljet']
    }
  },

  // ---------------------------------------------------------------- social status
  statuut: {
    nl: {
      title: 'Sociaal statuut van de zelfstandige | Belastingkaart',
      description: 'Wat de sociale bijdragen een zelfstandige opleveren: gezinsbijslag, pensioen, ziekte en invaliditeit en overbruggingsrecht, en waarom er geen werkloosheid is.',
      h1: 'Het sociaal statuut: wat je bijdragen als zelfstandige dekken', crumb: 'Sociaal statuut',
      summary: 'Met je sociale bijdragen zorg je voor je sociale zekerheid: gezinsbijslag, pensioen, ziekte en invaliditeit en het overbruggingsrecht. Voor de werkloosheid draag je als zelfstandige niet bij. Je rechten hangen af van de bijdragen die je betaalt.',
      table: { title: 'De takken van het sociaal statuut', head: ['Tak', 'Wat het RSVZ vermeldt', 'Voorwaarde of bevoegde instantie'], text: true,
        rows: [
          ['Gezinsbijslag', 'De kinderbijslag wordt betaald volgens de regeling van de woonplaats van het kind.', 'De gemeenschappen; in Vlaanderen het Groeipakket.'],
          ['Pensioen', 'Het rustpensioen wordt berekend in functie van je bewezen beroepsloopbaan als zelfstandige, helper of meewerkende echtgenoot in het maxistatuut.', 'De loopbaan bewijs je door de betaling van de sociale bijdragen.'],
          ['Geneeskundige verzorging', 'Wettelijk verzekerd tegen grote en kleine risico’s, ook voor de personen ten laste.', 'Aangesloten bij een ziekenfonds; bijdragen van het refertejaar (twee jaar geleden) betaald.'],
          ['Arbeidsongeschiktheid', 'Periodes van minder dan acht dagen worden niet vergoed; langer dan zeven dagen vanaf de eerste dag.', 'Ziekenfonds, wachttijd van 6 maanden, sociale bijdragen betaald (of vrijgesteld).'],
          ['Overbruggingsrecht', 'Bij gedwongen onderbreking of stopzetting van de activiteit.', 'Onder bepaalde voorwaarden.'],
          ['Werkloosheid', 'Voor de werkloosheid draag je niet bij.', '—']
        ],
        help: 'Samenvatting van de RSVZ-pagina’s hieronder. Geen bedragen: die hangen af van je loopbaan, je inkomen en je gezinssituatie.' },
      cards: [
        ['Pensioen als zelfstandige', `<p>Om te bepalen of je recht hebt op een pensioen als zelfstandige, houdt het RSVZ rekening met je leeftijd en je beroepsloopbaan. De wettelijke pensioenleeftijd is 65 jaar als je geboren bent vóór 1 januari 1960, 66 jaar tussen 1 januari 1960 en 31 december 1963 en 67 jaar vanaf 1 januari 1964. Vervroegd met pensioen gaan kan onder leeftijds- en loopbaanvoorwaarden, en dan moet je een aanvraag indienen, ten vroegste 12 maanden vooraf.</p>`],
        ['Ziek of arbeidsongeschikt', `<p>Als zelfstandige ben je wettelijk verzekerd voor geneeskundige verzorging, zoals een bezoek aan de huisarts of de aankoop van geneesmiddelen. Ben je arbeidsongeschikt, dan kent je ziekenfonds een dagvergoeding toe voor elke dag behalve de zondagen. Het eerste jaar heet primaire arbeidsongeschiktheid, vanaf het tweede jaar spreekt men van invaliditeit. Je moet het getuigschrift van arbeidsongeschiktheid binnen 7 kalenderdagen aan je ziekenfonds bezorgen.</p>`],
        ['Bijberoep: rechten via je hoofdberoep', `<p>Betaal je als zelfstandige in bijberoep geen of verminderde bijdragen, dan bouw je geen extra rechten op in het sociaal statuut van de zelfstandigen; je behoudt de rechten uit je hoofdberoep als werknemer of ambtenaar. Betaal je bijdragen aan het tarief van een zelfstandige in hoofdberoep, dan bouw je in principe dezelfde rechten op. Vrijwillig hogere bijdragen openen geen rechten.</p>`]
      ],
      lists: [
        ['Als je je activiteit stopzet', [
          'Bij een gedwongen onderbreking of een stopzetting kan je onder bepaalde voorwaarden aanspraak maken op het overbruggingsrecht.',
          'Stop je vrijwillig, dan kan je de voortgezette verzekering vragen om je rechten in het sociaal statuut te behouden tot je een andere beroepsactiviteit hebt.',
          'Een zelfstandige in bijberoep die stopt, meldt dat binnen de 15 dagen aan zijn socialeverzekeringsfonds.'
        ]],
        ['Wat deze pagina niet behandelt', [
          'Het bedrag van je pensioen en het minimumpensioen.',
          'De bedragen van de uitkeringen bij arbeidsongeschiktheid en bij moederschap, vaderschap of geboorte.',
          'Het aanvullend pensioen en andere vrijwillige verzekeringen.'
        ]]
      ],
      faq: [
        ['Krijg ik een pensioen voor mijn bijberoep?', 'Betaalde je bijdragen voor een bijberoep, dan heb je daarvoor geen recht op een pensioen; je krijgt wel een pensioen voor je hoofdberoep. Betaalde je aan het tarief van een zelfstandige in hoofdberoep, dan kan je wel pensioenrechten opgebouwd hebben. Het RSVZ onderzoekt dat automatisch.'],
        ['Moet ik mijn pensioen aanvragen?', 'In een aantal gevallen onderzoekt het RSVZ je pensioenrechten automatisch. Wil je vervroegd met pensioen gaan, dan moet je een aanvraag indienen, ten vroegste 12 maanden voor de gewenste datum.'],
        ['Word ik vergoed voor een korte ziekte?', 'Periodes van arbeidsongeschiktheid van minder dan acht dagen worden niet vergoed. Duurt ze langer dan zeven dagen, dan word je vergoed vanaf de eerste dag.'],
        ['Wie betaalt de kinderbijslag?', 'De gemeenschappen zijn bevoegd; in het Brussels Hoofdstedelijk Gewest de Gemeenschappelijke Gemeenschapscommissie. De woonplaats van je kind bepaalt wie betaalt; in Vlaanderen is dat het Groeipakket.'],
        ['Heb ik als zelfstandige recht op werkloosheidsuitkeringen?', 'Je draagt als zelfstandige niet bij voor de werkloosheid. Bij een gedwongen onderbreking of stopzetting bestaat wel het overbruggingsrecht, onder bepaalde voorwaarden.']
      ],
      sources: ['waarom', 'pensioen', 'pensioenBij', 'ziektekosten', 'ongeschikt', 'stop', 'gezin', 'bij'],
      terms: ['werknemersbijdrage', 'inkomstenjaar']
    },
    fr: {
      title: 'Statut social de l’indépendant : vos droits | Belastingkaart',
      description: 'Ce que les cotisations sociales apportent à un indépendant : prestations familiales, pension, maladie et invalidité, droit passerelle, mais pas de chômage.',
      h1: 'Le statut social : ce que vos cotisations d’indépendant couvrent', crumb: 'Statut social',
      summary: 'Votre couverture sociale passe par le paiement de cotisations : prestations familiales, pension, maladie et invalidité et droit passerelle. Il n’y a pas de cotisation pour le chômage. Vos droits dépendent des cotisations que vous payez.',
      table: { title: 'Les branches du statut social', head: ['Branche', 'Ce que dit l’INASTI', 'Condition ou instance compétente'], text: true,
        rows: [
          ['Prestations familiales', 'Les allocations familiales sont payées selon le régime du lieu du domicile de l’enfant.', 'Les Communautés ; en Flandre, le Groeipakket.'],
          ['Pension', 'La pension de retraite est calculée en fonction de votre carrière prouvée de travailleur indépendant, d’aidant ou de conjoint aidant sous maxi-statut.', 'La carrière est prouvée par le paiement des cotisations sociales.'],
          ['Soins de santé', 'Assurance légale contre les gros et les petits risques, étendue aux personnes à charge.', 'Affiliation à une mutualité ; cotisations de l’année de référence (2 ans en arrière) payées.'],
          ['Incapacité de travail', 'Les périodes de moins de huit jours ne sont pas indemnisées ; au-delà de sept jours, dès le premier jour.', 'Mutualité, stage de 6 mois, cotisations sociales payées (ou dispense).'],
          ['Droit passerelle', 'En cas d’interruption forcée ou de cessation de l’activité.', 'Sous certaines conditions.'],
          ['Chômage', 'Il n’y a pas de cotisation pour le chômage.', '—']
        ],
        help: 'Résumé des pages de l’INASTI ci-dessous. Pas de montants : ils dépendent de votre carrière, de votre revenu et de votre situation familiale.' },
      cards: [
        ['La pension d’indépendant', `<p>Pour déterminer si vous avez droit à une pension de travailleur indépendant, l’INASTI tient compte de votre âge et de votre carrière professionnelle. L’âge légal de la pension est de 65 ans si vous êtes né avant le 1er janvier 1960, de 66 ans entre le 1er janvier 1960 et le 31 décembre 1963 et de 67 ans à partir du 1er janvier 1964. Une pension anticipée est possible sous des conditions d’âge et de carrière ; il faut alors introduire une demande, au plus tôt 12 mois à l’avance.</p>`],
        ['Malade ou en incapacité de travail', `<p>En tant qu’indépendant, vous êtes légalement assuré pour les soins de santé, comme une visite chez le médecin ou l’achat de médicaments. En cas d’incapacité de travail, votre mutualité octroie une indemnité journalière pour chaque jour sauf les dimanches. La première année est l’incapacité de travail primaire ; à partir de la deuxième année, on parle d’invalidité. Vous devez transmettre le certificat d’incapacité de travail à votre mutualité dans les 7 jours calendrier.</p>`],
        ['Activité complémentaire : des droits par l’activité principale', `<p>Si vous ne payez pas de cotisations ou seulement des cotisations réduites comme indépendant à titre complémentaire, vous ne vous constituez pas de droits supplémentaires dans le statut social des indépendants ; vous conservez les droits de votre activité principale de salarié ou de fonctionnaire. Si vous payez au tarif d’un indépendant à titre principal, vous constituez en principe les mêmes droits. Des cotisations volontairement plus élevées n’ouvrent pas de droits.</p>`]
      ],
      lists: [
        ['Si vous cessez votre activité', [
          'En cas d’interruption forcée ou de cessation, vous pouvez prétendre au droit passerelle sous certaines conditions.',
          'Si vous arrêtez volontairement, l’assurance continuée vous permet de conserver vos droits dans le statut social en attendant une autre activité professionnelle.',
          'L’indépendant à titre complémentaire qui arrête communique sa décision dans les 15 jours à sa caisse d’assurances sociales.'
        ]],
        ['Ce que cette page ne traite pas', [
          'Le montant de votre pension et la pension minimum.',
          'Les montants des indemnités d’incapacité de travail et de maternité, de paternité ou de naissance.',
          'La pension complémentaire et les autres assurances facultatives.'
        ]]
      ],
      faq: [
        ['Ai-je droit à une pension pour mon activité complémentaire ?', 'Si vous avez payé des cotisations pour une activité complémentaire, vous n’ouvrez aucun droit à la pension pour celle-ci ; vous recevez une pension pour votre activité principale. Si vous avez payé au tarif d’un indépendant à titre principal, vous pouvez vous être constitué des droits. L’INASTI l’examine automatiquement.'],
        ['Dois-je demander ma pension ?', 'Dans certains cas, l’INASTI examine d’office vos droits à pension. Si vous souhaitez prendre une pension anticipée, vous devez introduire une demande, au plus tôt 12 mois avant la date souhaitée.'],
        ['Suis-je indemnisé pour une courte maladie ?', 'Les périodes d’incapacité de travail de moins de huit jours ne sont pas indemnisées. Au-delà de sept jours, elles sont indemnisées à partir du premier jour.'],
        ['Qui paie les allocations familiales ?', 'Les Communautés sont compétentes ; en Région de Bruxelles-Capitale, la Commission communautaire commune. Le lieu du domicile de votre enfant détermine qui paie ; en Flandre, c’est le Groeipakket.'],
        ['Un indépendant a-t-il droit aux allocations de chômage ?', 'L’indépendant ne cotise pas pour le chômage. En cas d’interruption forcée ou de cessation, il existe toutefois le droit passerelle, sous certaines conditions.']
      ],
      sources: ['waarom', 'pensioen', 'pensioenBij', 'ziektekosten', 'ongeschikt', 'stop', 'gezin', 'bij'],
      terms: ['werknemersbijdrage', 'inkomstenjaar']
    }
  },

  // ---------------------------------------------------------------- income tax
  belasting: {
    nl: {
      title: 'Belasting op het inkomen van zelfstandigen | Belastingkaart',
      description: 'Hoe het beroepsinkomen van een zelfstandige in de personenbelasting komt: winst en baten, beroepskosten, beroepsverliezen en de sociale bijdragen (WIB 92).',
      h1: 'Personenbelasting op het beroepsinkomen van een zelfstandige', crumb: 'Personenbelasting',
      summary: 'Beroepsinkomsten omvatten volgens het WIB 92 onder meer winst en baten. Belast wordt het nettobedrag: het brutobedrag van elke beroepswerkzaamheid min de beroepskosten, waartoe ook de persoonlijke sociale bijdragen behoren, en min de beroepsverliezen.',
      table: { title: 'Van brutobedrag naar netto beroepsinkomen (artikel 23, § 2, WIB 92)', head: ['Bewerking', 'Wat de wet zegt'], text: true,
        rows: [
          ['Brutobedrag van elke beroepswerkzaamheid', 'Winst, baten, winst en baten van een vorige beroepswerkzaamheid, bezoldigingen, pensioenen (art. 23, § 1).'],
          ['− Beroepskosten', 'Het brutobedrag wordt verminderd met de beroepskosten die op deze inkomsten betrekking hebben (art. 23, § 2, 1°).'],
          ['− Beroepsverliezen van het jaar', 'Verliezen uit een beroepswerkzaamheid worden afgetrokken van de inkomsten van andere beroepswerkzaamheden (art. 23, § 2, 2°).'],
          ['− Vorige beroepsverliezen', 'Beroepsverliezen van vorige belastbare tijdperken worden afgetrokken (art. 23, § 2, 3°).'],
          ['= Netto beroepsinkomen', 'Het totale bedrag van die inkomsten, met uitsluiting van de vrijgestelde inkomsten, na die bewerkingen.']
        ],
        help: 'Uit artikel 23 van het Wetboek van de inkomstenbelastingen 1992, versie inkomsten 2026, op Fisconetplus. Geen berekening van de belasting.' },
      cards: [
        ['Beroepsinkomsten van een zelfstandige', `<p>Het WIB 92 omschrijft beroepsinkomsten als inkomsten die rechtstreeks of onrechtstreeks voortkomen uit werkzaamheden van alle aard. Het noemt onder meer <b>winst</b> en <b>baten</b>, naast de bezoldigingen van werknemers en de pensioenen. Artikel 23 staat in titel II van het WIB 92, over de <a href="{G}personenbelasting/">personenbelasting</a>.</p>`],
        ['De sociale bijdragen als beroepskosten', `<p>Artikel 52 van het WIB 92 somt op wat inzonderheid als <a href="{G}beroepskosten/">beroepskosten</a> wordt aangemerkt. Daartoe behoren onder 7° “de persoonlijke bijdragen ter uitvoering van de sociale wetgeving”. Als beroepskosten verminderen ze het nettobedrag van de beroepsinkomsten (artikel 23, § 2, 1°).</p>`],
        ['Hetzelfde inkomen voor fiscus en sociaal statuut', `<p>Je socialeverzekeringsfonds berekent je bijdragen op je beroepsinkomsten zoals de belastingadministratie ze vaststelt: de brutoberoepsinkomsten, verminderd met de beroepskosten en beroepsverliezen. De fiscus deelt die inkomsten aan het fonds mee, meestal een of twee jaar na het bijdragejaar. Zie <a href="../sociale-bijdragen/">sociale bijdragen</a>.</p>`]
      ],
      lists: [
        ['Welke versie van de wet?', [
          'Fisconetplus publiceert het WIB 92 per inkomstenjaar; deze pagina citeert de versie “inkomsten 2026”.',
          'Elke versie vermeldt bij een gewijzigde bepaling vanaf welk aanslagjaar ze van toepassing is.',
          'De bijdragen voor het sociaal statuut volgen een eigen kalender: zie <a href="../sociale-bijdragen/">sociale bijdragen</a>.'
        ]],
        ['Wat deze pagina niet behandelt', [
          'De belastingtarieven, de belastingvrije som en de gemeentebelasting: die volgen de algemene regels van de personenbelasting.',
          'De forfaitaire beroepskosten en de bijzondere regels per soort winst of baten.',
          'De vennootschapsbelasting en de bezoldiging van bedrijfsleiders.',
          'De btw.'
        ]]
      ],
      faq: [
        ['Betaalt een zelfstandige belasting op zijn omzet?', 'Nee: de personenbelasting treft het nettobedrag van de beroepsinkomsten, na aftrek van de beroepskosten en beroepsverliezen (artikel 23, § 2, WIB 92).'],
        ['Zijn mijn sociale bijdragen aftrekbaar?', 'Artikel 52, 7°, WIB 92 rekent de persoonlijke bijdragen ter uitvoering van de sociale wetgeving tot de beroepskosten. Ze verminderen dus het belastbare beroepsinkomen.'],
        ['Wat gebeurt er met een verlies?', 'Een beroepsverlies van het jaar wordt afgetrokken van de inkomsten van andere beroepswerkzaamheden; beroepsverliezen van vorige belastbare tijdperken worden afgetrokken van de beroepsinkomsten (artikel 23, § 2, 2° en 3°).'],
        ['Berekent Belastingkaart mijn belasting als zelfstandige?', 'Nee. Belastingkaart toont geen bedrag zolang niet elke regel voor jouw situatie officieel bevestigd en getest is.']
      ],
      sources: ['art23', 'art52', 'hoeveel'],
      terms: ['personenbelasting', 'beroepskosten', 'inkomstenjaar', 'aanslagjaar', 'aangifte', 'aanslagbiljet', 'myminfin']
    },
    fr: {
      title: 'Impôt sur les revenus des indépendants | Belastingkaart',
      description: 'Le revenu professionnel de l’indépendant à l’impôt des personnes physiques : bénéfices, profits, frais et pertes professionnels, cotisations sociales (CIR 92).',
      h1: 'L’impôt des personnes physiques sur le revenu professionnel de l’indépendant', crumb: 'Impôt sur les revenus',
      summary: 'Selon le CIR 92, les revenus professionnels comprennent notamment les bénéfices et les profits. C’est le montant net qui est imposé : le montant brut de chaque activité professionnelle diminué des frais professionnels, parmi lesquels les cotisations sociales personnelles, et des pertes professionnelles.',
      table: { title: 'Du montant brut au revenu professionnel net (article 23, § 2, CIR 92)', head: ['Opération', 'Ce que dit la loi'], text: true,
        rows: [
          ['Montant brut de chaque activité professionnelle', 'Bénéfices, profits, bénéfices et profits d’une activité professionnelle antérieure, rémunérations, pensions (art. 23, § 1er).'],
          ['− Frais professionnels', 'Le montant brut est diminué des frais professionnels qui grèvent ces revenus (art. 23, § 2, 1°).'],
          ['− Pertes professionnelles de l’année', 'Les pertes d’une activité professionnelle sont déduites des revenus des autres activités professionnelles (art. 23, § 2, 2°).'],
          ['− Pertes professionnelles antérieures', 'Les pertes professionnelles des périodes imposables antérieures sont déduites (art. 23, § 2, 3°).'],
          ['= Revenu professionnel net', 'Le montant total de ces revenus, à l’exception des revenus exonérés, après ces opérations.']
        ],
        help: 'Extrait de l’article 23 du Code des impôts sur les revenus 1992, version revenus 2026, sur Fisconetplus. Aucun calcul de l’impôt.' },
      cards: [
        ['Les revenus professionnels d’un indépendant', `<p>Le CIR 92 définit les revenus professionnels comme les revenus qui proviennent, directement ou indirectement, d’activités de toute nature. Il cite notamment les <b>bénéfices</b> et les <b>profits</b>, à côté des rémunérations des salariés et des pensions. L’article 23 figure au titre II du CIR 92, consacré à l’<a href="{G}impot-des-personnes-physiques/">impôt des personnes physiques</a>.</p>`],
        ['Les cotisations sociales comme frais professionnels', `<p>L’article 52 du CIR 92 énumère ce qui constitue notamment des <a href="{G}frais-professionnels/">frais professionnels</a>. On y trouve au 7° « les cotisations personnelles dues en exécution de la législation sociale ». En tant que frais professionnels, elles diminuent le montant net des revenus professionnels (article 23, § 2, 1°).</p>`],
        ['Le même revenu pour le fisc et le statut social', `<p>Votre caisse d’assurances sociales calcule vos cotisations sur vos revenus professionnels tels que l’administration fiscale les fixe : les revenus professionnels bruts, diminués des frais professionnels et des pertes professionnelles. Le fisc communique ces revenus à la caisse, généralement un à deux ans après l’année de cotisation. Voir <a href="../cotisations-sociales/">cotisations sociales</a>.</p>`]
      ],
      lists: [
        ['Quelle version de la loi ?', [
          'Fisconetplus publie le CIR 92 par année de revenus ; cette page cite la version « revenus 2026 ».',
          'Chaque version indique, pour une disposition modifiée, à partir de quel exercice d’imposition elle s’applique.',
          'Les cotisations du statut social suivent leur propre calendrier : voir <a href="../cotisations-sociales/">cotisations sociales</a>.'
        ]],
        ['Ce que cette page ne traite pas', [
          'Les taux d’imposition, la quotité exemptée d’impôt et la taxe communale : ils suivent les règles générales de l’impôt des personnes physiques.',
          'Les frais professionnels forfaitaires et les règles particulières par type de bénéfices ou de profits.',
          'L’impôt des sociétés et la rémunération des dirigeants d’entreprise.',
          'La TVA.'
        ]]
      ],
      faq: [
        ['Un indépendant est-il imposé sur son chiffre d’affaires ?', 'Non : l’impôt des personnes physiques frappe le montant net des revenus professionnels, après déduction des frais et des pertes professionnels (article 23, § 2, CIR 92).'],
        ['Mes cotisations sociales sont-elles déductibles ?', 'L’article 52, 7°, CIR 92 range les cotisations personnelles dues en exécution de la législation sociale parmi les frais professionnels. Elles réduisent donc le revenu professionnel imposable.'],
        ['Que se passe-t-il en cas de perte ?', 'Une perte professionnelle de l’année est déduite des revenus des autres activités professionnelles ; les pertes des périodes imposables antérieures sont déduites des revenus professionnels (article 23, § 2, 2° et 3°).'],
        ['Belastingkaart calcule-t-il mon impôt d’indépendant ?', 'Non. Belastingkaart n’affiche aucun montant tant que chaque règle nécessaire à votre situation n’est pas officiellement confirmée et testée.']
      ],
      sources: ['art23', 'art52', 'hoeveel'],
      terms: ['personenbelasting', 'beroepskosten', 'inkomstenjaar', 'aanslagjaar', 'aangifte', 'aanslagbiljet', 'myminfin']
    }
  },

  // ---------------------------------------------------------------- administrations
  administraties: {
    nl: {
      title: 'Administraties voor zelfstandigen | Belastingkaart',
      description: 'Met welke instanties een zelfstandige te maken heeft: RSVZ, socialeverzekeringsfonds, Nationale Hulpkas, FOD Financiën, ziekenfonds, Commissie Arbeidsrelaties.',
      h1: 'Met welke administraties heeft een zelfstandige te maken?', crumb: 'Administraties',
      summary: 'Het RSVZ beheert de sociale zekerheid van de zelfstandigen. Je bijdragen betaal je aan een socialeverzekeringsfonds naar keuze of aan de Nationale Hulpkas van het RSVZ. De belastingadministratie stelt je beroepsinkomen vast; je ziekenfonds betaalt de uitkeringen bij arbeidsongeschiktheid.',
      table: { title: 'Wie doet wat?', head: ['Instantie', 'Rol voor de zelfstandige'], text: true,
        rows: [
          ['RSVZ (Rijksinstituut voor de Sociale Verzekeringen der Zelfstandigen)', 'Beheert de sociale zekerheid van de zelfstandigen, behandelt aanvragen tot vrijstelling van bijdragen (Dienst Vrijstelling van bijdragen) en onderzoekt pensioenrechten.'],
          ['Socialeverzekeringsfonds', 'Aansluiting vóór de start, voorlopige en definitieve bijdragen, regularisatie zodra de fiscus de inkomsten meedeelt.'],
          ['Nationale Hulpkas', 'Het eigen socialeverzekeringsfonds van het RSVZ; wie na een aanmaning niet aansluit, wordt er automatisch lid van.'],
          ['Belastingadministratie (FOD Financiën)', 'Stelt de beroepsinkomsten vast en deelt ze mee aan het socialeverzekeringsfonds; het WIB 92 regelt de personenbelasting op die inkomsten.'],
          ['Ziekenfonds', 'Terugbetaling van geneeskundige verzorging en uitkeringen bij arbeidsongeschiktheid.'],
          ['Commissie Arbeidsrelaties', 'Onderzoekt onder bepaalde voorwaarden of je werknemer of zelfstandige bent.'],
          ['Gemeenschappen', 'Bevoegd voor de kinderbijslag; in Vlaanderen het Groeipakket.']
        ],
        help: 'Volgens de RSVZ-pagina’s hieronder. Belastingkaart is geen van deze instanties en geeft geen advies.' },
      cards: [
        ['Het RSVZ', `<p>Het Rijksinstituut voor de Sociale Verzekeringen der Zelfstandigen beheert de sociale zekerheid van de zelfstandigen. Het heeft een eigen socialeverzekeringsfonds, de Nationale Hulpkas, en verzorgt het secretariaat van het Algemeen Beheerscomité voor het sociaal statuut der zelfstandigen. De directie Eerlijke Concurrentie strijdt tegen sociale fraude.</p>`],
        ['Je socialeverzekeringsfonds', `<p>Als zelfstandige ben je verplicht je aan te sluiten bij een socialeverzekeringsfonds, vóór je start. Het RSVZ publiceert de lijst van de fondsen. Een meewerkende echtgenoot is altijd aangesloten bij het fonds van zijn zelfstandige partner. Een stopzetting meld je aan je fonds; voor een bijberoep binnen de 15 dagen.</p>`],
        ['De fiscus en het ziekenfonds', `<p>De beroepsinkomsten waarop je bijdragen berekend worden, worden vastgesteld door de belastingadministratie, die ze aan je socialeverzekeringsfonds meedeelt. Voor geneeskundige verzorging en arbeidsongeschiktheidsuitkeringen moet je aangesloten zijn bij een ziekenfonds.</p>`]
      ],
      lists: [
        ['Wanneer je bij welke instantie aanklopt', [
          'Voor de start: aansluiten bij een socialeverzekeringsfonds naar keuze.',
          'Bij twijfel over je statuut: de Commissie Arbeidsrelaties, onder bepaalde voorwaarden.',
          'Voor een vrijstelling van bijdragen: de Dienst Vrijstelling van bijdragen (DVR) van het RSVZ.',
          'Bij ziekte: het getuigschrift van arbeidsongeschiktheid binnen 7 kalenderdagen naar je ziekenfonds.'
        ]],
        ['Wat deze pagina niet behandelt', [
          'De oprichting van een onderneming en de inschrijving in de Kruispuntbank van Ondernemingen.',
          'De btw-administratie.',
          'De gewestelijke steunmaatregelen voor ondernemers.'
        ]]
      ],
      faq: [
        ['Kan ik van socialeverzekeringsfonds veranderen?', 'Ja, op 1 januari van elk jaar, als je minstens 4 jaar bij je huidige fonds bent aangesloten en daar geen schulden hebt. Het nieuwe fonds regelt de overstap.'],
        ['Wat is de Nationale Hulpkas?', 'Het socialeverzekeringsfonds van het RSVZ zelf. Het past de sociale wetgeving toe zoals de andere fondsen.'],
        ['Wie zegt welk inkomen ik had?', 'De belastingadministratie stelt je beroepsinkomsten vast en deelt ze mee aan je socialeverzekeringsfonds.'],
        ['Wie betaalt mijn uitkering als ik ziek ben?', 'Je ziekenfonds, op voorwaarde dat je aangesloten bent, de wachttijd doorlopen hebt en je sociale bijdragen betaald hebt of ervan vrijgesteld bent.']
      ],
      sources: ['over', 'fondsen', 'aansluiten', 'hoeveel', 'wie', 'ziektekosten', 'gezin'],
      terms: ['myminfin', 'aangifte']
    },
    fr: {
      title: 'Administrations pour indépendants | Belastingkaart',
      description: 'Les instances d’un indépendant : INASTI, caisse d’assurances sociales, Caisse nationale auxiliaire, SPF Finances, mutualité et Commission Relations de travail.',
      h1: 'Avec quelles administrations un indépendant a-t-il affaire ?', crumb: 'Administrations',
      summary: 'L’INASTI gère la sécurité sociale des travailleurs indépendants. Vous payez vos cotisations à une caisse d’assurances sociales de votre choix ou à la Caisse nationale auxiliaire de l’INASTI. L’administration fiscale fixe votre revenu professionnel ; votre mutualité paie les indemnités d’incapacité de travail.',
      table: { title: 'Qui fait quoi ?', head: ['Instance', 'Rôle pour l’indépendant'], text: true,
        rows: [
          ['INASTI (Institut national d’assurances sociales pour travailleurs indépendants)', 'Gère la sécurité sociale des indépendants, traite les demandes de dispense de cotisations (service Dispense de cotisations) et examine les droits à pension.'],
          ['Caisse d’assurances sociales', 'Affiliation avant le début, cotisations provisoires et définitives, régularisation dès que le fisc communique les revenus.'],
          ['Caisse nationale auxiliaire', 'La caisse d’assurances sociales propre à l’INASTI ; qui ne s’affilie pas après une mise en demeure y est automatiquement affilié.'],
          ['Administration fiscale (SPF Finances)', 'Fixe les revenus professionnels et les communique à la caisse d’assurances sociales ; le CIR 92 règle l’impôt des personnes physiques sur ces revenus.'],
          ['Mutualité', 'Remboursement des soins de santé et indemnités d’incapacité de travail.'],
          ['Commission Relations de travail', 'Examine sous certaines conditions si vous êtes salarié ou indépendant.'],
          ['Communautés', 'Compétentes pour les allocations familiales ; en Flandre, le Groeipakket.']
        ],
        help: 'Selon les pages de l’INASTI ci-dessous. Belastingkaart n’est aucune de ces instances et ne donne pas de conseil.' },
      cards: [
        ['L’INASTI', `<p>L’Institut national d’assurances sociales pour travailleurs indépendants gère la sécurité sociale des travailleurs indépendants. Il dispose de sa propre caisse d’assurances sociales, la Caisse nationale auxiliaire, et assure le secrétariat du Comité général de gestion pour le statut social des travailleurs indépendants. La Direction Concurrence Loyale lutte contre la fraude sociale.</p>`],
        ['Votre caisse d’assurances sociales', `<p>En tant qu’indépendant, vous êtes obligé de vous affilier à une caisse d’assurances sociales, avant le début de l’activité. L’INASTI publie la liste des caisses. Le conjoint aidant est toujours affilié à la caisse de son partenaire indépendant. Une cessation se communique à votre caisse ; pour une activité complémentaire, dans les 15 jours.</p>`],
        ['Le fisc et la mutualité', `<p>Les revenus professionnels sur lesquels vos cotisations sont calculées sont fixés par l’administration fiscale, qui les communique à votre caisse d’assurances sociales. Pour les soins de santé et les indemnités d’incapacité de travail, vous devez être affilié à une mutualité.</p>`]
      ],
      lists: [
        ['À quelle instance s’adresser, et quand', [
          'Avant le début : s’affilier à une caisse d’assurances sociales de votre choix.',
          'En cas de doute sur votre statut : la Commission Relations de travail, sous certaines conditions.',
          'Pour une dispense de cotisations : le service Dispense de cotisations (DVR) de l’INASTI.',
          'En cas de maladie : le certificat d’incapacité de travail à votre mutualité dans les 7 jours calendrier.'
        ]],
        ['Ce que cette page ne traite pas', [
          'La création d’une entreprise et l’inscription à la Banque-Carrefour des Entreprises.',
          'L’administration de la TVA.',
          'Les aides régionales aux entrepreneurs.'
        ]]
      ],
      faq: [
        ['Puis-je changer de caisse d’assurances sociales ?', 'Oui, au 1er janvier de chaque année, si vous êtes affilié depuis au moins 4 ans à votre caisse actuelle et n’y avez pas de dettes. La nouvelle caisse règle le changement.'],
        ['Qu’est-ce que la Caisse nationale auxiliaire ?', 'La caisse d’assurances sociales de l’INASTI lui-même. Elle applique la législation sociale au même titre que les autres caisses.'],
        ['Qui dit quel revenu j’ai eu ?', 'L’administration fiscale fixe vos revenus professionnels et les communique à votre caisse d’assurances sociales.'],
        ['Qui paie mon indemnité si je suis malade ?', 'Votre mutualité, à condition que vous y soyez affilié, que vous ayez accompli le stage et que vous ayez payé vos cotisations sociales ou en soyez dispensé.']
      ],
      sources: ['over', 'fondsen', 'aansluiten', 'hoeveel', 'wie', 'ziektekosten', 'gezin'],
      terms: ['myminfin', 'aangifte']
    }
  }
};
