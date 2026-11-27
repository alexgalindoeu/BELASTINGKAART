// Generator for the pensions section (web/nl/pensioenen/, web/fr/pensions/).
// Same template as Mapafiscal's web/guias/: an index of guides grouped in cards, and topic
// pages built like a guide (summary, callout, intro, table of contents, numbered section
// cards with tables, call to action, FAQ, related pages, sources). Content comes only from
// official pages listed in docs/sources/pensioenen_2026-11-25.md (claim → quote → URL).
//   node tools/build_pensioenen.mjs           write the pages (head block included)
//   node tools/build_pensioenen.mjs --check   exit 1 if a page differs from this generator
import { writeFile, readFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { SITE, WEB } from './lib/pages.mjs';
import { applyHead } from './lib/head.mjs';
import { footerColumns, footerSmall } from './lib/shell.mjs';
export { S as SOURCES, R as ROUTES, PENDING };

const DATE = '2026-11-25';
const FPD = 'https://www.sfpd.fgov.be';
const FISCONET = 'https://eservices.minfin.fgov.be/myminfin-web/pages/public/fisconet/document/';

// Official sources. url/title per language; `date` is the day the page was opened (DD-MM-YYYY).
const S = {
  brutnet: {
    org: { nl: 'Federale Pensioendienst', fr: 'Service fédéral des Pensions' }, date: { nl: '25-11-2026', fr: '25-11-2026' },
    url: { nl: `${FPD}/nl/betaling/brut-net`, fr: `${FPD}/fr/paiement/brut-net` },
    title: { nl: 'Bruto – netto', fr: 'Brut-net' }
  },
  fiche: {
    org: { nl: 'Federale Pensioendienst', fr: 'Service fédéral des Pensions' }, date: { nl: '25-11-2026', fr: '25-11-2026' },
    url: { nl: `${FPD}/nl/betaling/fiscale-fiche`, fr: `${FPD}/fr/paiement/fiche-fiscale` },
    title: { nl: 'Fiscale fiche (pensioenfiche 281.11)', fr: 'Fiche fiscale (fiche de pension 281.11)' }
  },
  mypension: {
    org: { nl: 'Federale Pensioendienst', fr: 'Service fédéral des Pensions' }, date: { nl: '25-11-2026', fr: '25-11-2026' },
    url: { nl: `${FPD}/nl/mypension-be`, fr: `${FPD}/fr/mypension-be` },
    title: { nl: 'mypension.be', fr: 'mypension.be' }
  },
  opdracht: {
    org: { nl: 'Federale Pensioendienst', fr: 'Service fédéral des Pensions' }, date: { nl: '25-11-2026', fr: '25-11-2026' },
    url: { nl: `${FPD}/nl/over-ons/opdracht-en-visie`, fr: `${FPD}/fr/a-propos-de-nous/mission-et-vision` },
    title: { nl: 'Wat doet de Federale Pensioendienst?', fr: 'Que fait le Service fédéral des Pensions ?' }
  },
  art147: {
    org: { nl: 'FOD Financiën, Fisconetplus', fr: 'SPF Finances, Fisconetplus' }, date: { nl: '25-11-2026', fr: '26-11-2026' },
    url: { nl: `${FISCONET}29f2d0bb-6658-4cf8-b870-283c99274b07`, fr: `${FISCONET}727430aa-9d41-4ecf-84e9-6a68c0f39ca3` },
    title: { nl: 'Artikel 147, WIB 92 (inkomsten 2026)', fr: 'Article 147, CIR 92 (revenus 2026)' }
  }
};
const MYPENSION = 'https://www.mypension.be';

const T = {
  nl: {
    skip: 'Naar de inhoud', home: 'Belastingkaart, startpagina', sections: 'Secties',
    theme: 'aria-label="Thema: automatisch (zoals het systeem). Wijzigen naar licht" title="Thema: automatisch (zoals het systeem)"',
    switchLabel: 'Version française', cta: 'Naar de simulator', crumbHome: 'Startpagina', section: 'Pensioenen',
    nav: [['#simulator', 'Simulator'], ['kaart/', 'Kaart'], ['methodologie/', 'Methodologie'], ['bronnen/', 'Bronnen'], ['contact/', 'Contact']],
    updated: 'Bijgewerkt op', updatedLong: '25 november 2026',
    footerIntro: '<b>Belastingkaart</b> is een onafhankelijk informatieproject. Geen officiële overheidswebsite en geen fiscaal advies.', footerNav: 'Meer over Belastingkaart', langTitle: 'Taal',
    toc: 'Op deze pagina', faq: 'Veelgestelde vragen', sources: 'Bronnen', consulted: 'geraadpleegd op',
    sourcesNote: 'Alleen officiële pagina’s van de Federale Pensioendienst en van de FOD Financiën (Fisconetplus). De citaten staan in ons bronnenregister.',
    more: 'Meer over pensioenen', terms: 'Begrippen uit deze gids', overview: 'Overzicht van de sectie'
  },
  fr: {
    skip: 'Aller au contenu', home: 'Belastingkaart, accueil', sections: 'Sections',
    theme: 'aria-label="Thème : automatique (comme le système). Passer en mode clair" title="Thème : automatique (comme le système)"',
    switchLabel: 'Nederlandse versie', cta: 'Vers le simulateur', crumbHome: 'Accueil', section: 'Pensions',
    nav: [['#simulator', 'Simulateur'], ['carte/', 'Carte'], ['methodologie/', 'Méthodologie'], ['sources/', 'Sources'], ['contact/', 'Contact']],
    updated: 'Mis à jour le', updatedLong: '25 novembre 2026',
    footerIntro: '<b>Belastingkaart</b> est un projet d’information indépendant. Ce n’est pas un site officiel des pouvoirs publics ni un conseil fiscal.', footerNav: 'En savoir plus sur Belastingkaart', langTitle: 'Langue',
    toc: 'Sur cette page', faq: 'Questions fréquentes', sources: 'Sources', consulted: 'consulté le',
    sourcesNote: 'Uniquement des pages officielles du Service fédéral des Pensions et du SPF Finances (Fisconetplus). Les citations figurent dans notre registre des sources.',
    more: 'Plus sur les pensions', terms: 'Notions de ce guide', overview: 'Vue d’ensemble de la section'
  }
};

const BRAND = '<svg class="brand-icon" viewBox="0 -2 102 86" aria-hidden="true" focusable="false"><path class="p" fill-rule="evenodd" d="M16,4H62L77,18V28L68,37L84,52V66L70,80H2Z M28,16L25,33H57L62,28V21L57,16Z M23,47L19,68H64L70,62V54L63,47Z"/><polygon class="p2" points="46,80 60,80 99,30 91,18"/></svg>';
const THEME = '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><circle cx="12" cy="12" r="8"/><path class="fill" d="M12 4a8 8 0 0 1 0 16z"/></svg>';

// ---- routes -------------------------------------------------------------------------------
const R = {
  index: ['nl/pensioenen/', 'fr/pensions/'],
  wettelijk: ['nl/pensioenen/wettelijk-pensioen/', 'fr/pensions/pension-legale/'],
  inhoudingen: ['nl/pensioenen/sociale-inhoudingen/', 'fr/pensions/retenues-sociales/'],
  belasting: ['nl/pensioenen/belasting-op-pensioen/', 'fr/pensions/impot-sur-la-pension/']
};
// Pensioensparen is built in another branch; until it is merged these links carry
// data-pending-link and the link tests skip them.
const PENDING = { nl: 'nl/pensioensparen/', fr: 'fr/epargne-pension/' };
const NAV = {
  nl: { index: 'Pensioenen', wettelijk: 'Het wettelijk pensioen', inhoudingen: 'Sociale inhoudingen op uw pensioen', belasting: 'Belasting op uw pensioen' },
  fr: { index: 'Pensions', wettelijk: 'La pension légale', inhoudingen: 'Retenues sociales sur votre pension', belasting: 'Impôt sur votre pension' }
};
const SUB = {
  nl: {
    wettelijk: 'Wie het pensioen berekent en betaalt, en wat u op mypension.be vindt',
    inhoudingen: 'ZIV-bijdrage en solidariteitsbijdrage: wat ze zijn en wie ze inhoudt',
    belasting: 'Bedrijfsvoorheffing, fiscale fiche 281.11 en de vermindering voor pensioenen'
  },
  fr: {
    wettelijk: 'Qui calcule et paie la pension, et ce que vous trouvez sur mypension.be',
    inhoudingen: 'Cotisation AMI et cotisation de solidarité : ce qu’elles sont et qui les retient',
    belasting: 'Précompte professionnel, fiche fiscale 281.11 et réduction pour pensions'
  }
};

const ext = (href, label) => `<a href="${href}" rel="noopener">${label}</a>`;
const src = (key, lang, label) => ext(S[key].url[lang], label);
const table = (head, rows, numCols = []) => `<div class="table-scroll"><table class="data-table">
<thead><tr>${head.map((h, i) => `<th scope="col"${numCols.includes(i) ? ' class="num"' : ''}>${h}</th>`).join('')}</tr></thead>
<tbody>
${rows.map(r => `<tr>${r.map((c, i) => `<td${numCols.includes(i) ? ' class="num"' : ''}>${c}</td>`).join('')}</tr>`).join('\n')}
</tbody></table></div>`;

// ---- topic pages ---------------------------------------------------------------------------
// { key, title, desc, h1, summary, callout:[title, html], lead, sections:[{h2, body}], cta:[[href, label]], faq:[[q, a]], sources:[keys], terms:[[href, label]] }
// Hrefs in cta/terms are relative to the language root.
const PAGES = [];

PAGES.push({
  key: 'wettelijk',
  title: { nl: 'Wettelijk pensioen en mypension.be | Belastingkaart', fr: 'Pension légale : SFP et mypension.be | Belastingkaart' },
  desc: {
    nl: 'Wie uw wettelijk pensioen berekent en uitbetaalt, wat de Federale Pensioendienst doet en welke gegevens u over uw eigen pensioen vindt op mypension.be.',
    fr: 'Qui calcule et paie votre pension légale, ce que fait le Service fédéral des Pensions et quelles données sur votre propre pension vous trouvez sur mypension.be.'
  },
  h1: { nl: 'Het wettelijk pensioen: wie betaalt het en waar kijkt u het na?', fr: 'La pension légale : qui la paie et où la vérifier ?' },
  summary: {
    nl: '<b>In het kort:</b> de Federale Pensioendienst berekent de pensioenen van werknemers en ambtenaren en betaalt de pensioenen van werknemers, ambtenaren en zelfstandigen. Uw eigen pensioengegevens, betalingen en fiscale en sociale situatie vindt u op mypension.be.',
    fr: '<b>En bref :</b> le Service fédéral des Pensions calcule les pensions des salariés et des fonctionnaires et paie les pensions des salariés, des fonctionnaires et des indépendants. Vos propres données de pension, vos paiements et votre situation sociale et fiscale se trouvent sur mypension.be.'
  },
  callout: {
    nl: ['Uw eigen pensioen', `Belastingkaart berekent geen pensioenbedrag. Uw persoonlijke gegevens staan in uw online pensioendossier op ${ext(MYPENSION, 'mypension.be')}.`],
    fr: ['Votre propre pension', `Belastingkaart ne calcule aucun montant de pension. Vos données personnelles figurent dans votre dossier de pension en ligne sur ${ext(MYPENSION, 'mypension.be')}.`]
  },
  lead: {
    nl: 'Wie zijn wettelijk pensioen wil begrijpen, begint bij de instelling die het berekent en uitbetaalt. Deze gids legt uit wat de Federale Pensioendienst doet, wat u in uw online pensioendossier vindt en wat er vanaf 2027 verandert.',
    fr: 'Pour comprendre sa pension légale, il faut partir de l’institution qui la calcule et la paie. Ce guide explique ce que fait le Service fédéral des Pensions, ce que vous trouvez dans votre dossier de pension en ligne et ce qui change à partir de 2027.'
  },
  sections: [
    {
      h2: { nl: 'De Federale Pensioendienst', fr: 'Le Service fédéral des Pensions' },
      body: {
        nl: `<p>De Federale Pensioendienst (FPD) vermeldt vier wettelijke opdrachten:</p>
<ul>
<li>u informeren en adviseren over uw (toekomstig) pensioen;</li>
<li>de pensioenrechten bepalen en toekennen: de FPD berekent de pensioenen van werknemers en ambtenaren, en de inkomensgarantie voor ouderen (IGO);</li>
<li>de pensioenen, de IGO, renten en uitkeringen van werknemers, ambtenaren en zelfstandigen betalen;</li>
<li>het beleidswerk ondersteunen met gegevens, analyses en expertise.</li>
</ul>
<p class="help">Bron: ${src('opdracht', 'nl', 'Wat doet de Federale Pensioendienst?')} (FPD).</p>`,
        fr: `<p>Le Service fédéral des Pensions (SFP) mentionne quatre missions légales :</p>
<ul>
<li>vous informer et vous conseiller sur votre (future) pension ;</li>
<li>déterminer et octroyer les droits de pension : le SFP calcule les pensions des salariés, des fonctionnaires, ainsi que la garantie de revenus aux personnes âgées (GRAPA) ;</li>
<li>payer les pensions, rentes et indemnités et la GRAPA pour les salariés, les fonctionnaires et les indépendants ;</li>
<li>soutenir la prise de décision politique par ses données, ses analyses et son expertise.</li>
</ul>
<p class="help">Source : ${src('opdracht', 'fr', 'Que fait le Service fédéral des Pensions ?')} (SFP).</p>`
      }
    },
    {
      h2: { nl: 'Uw pensioen nakijken op mypension.be', fr: 'Vérifier votre pension sur mypension.be' },
      body: {
        nl: `<p>Volgens de FPD is mypension.be de digitale toegangspoort tot uw pensioen, of u nu al met pensioen bent of niet. Naargelang uw situatie vindt u er onder meer:</p>
${table(['Wat u er vindt', 'Toelichting'], [
  ['Persoonlijke gegevens en briefwisseling', 'Uw gegevens en uw briefwisseling met de Pensioendienst, het RSVZ en Sigedis'],
  ['Pensioenaanvraag', 'De mogelijkheid om uw pensioen aan te vragen (rust, overleving, IGO)'],
  ['Ramingen', 'Een raming van uw wettelijke pensioendatum en van uw vroegst mogelijke pensioendatum'],
  ['Aanvullend pensioen', 'Een overzicht van uw eventueel aanvullend pensioen (2e pijler)'],
  ['Betalingen', 'Een overzicht van uw betalingen en een betaalkalender met de datums van uw toekomstige betalingen'],
  ['Fiscale en sociale situatie', 'Uw fiscale en sociale situatie, de berekening van uw netto pensioenbedrag en uw fiscale fiche']
])}
<p class="help">Bron: ${src('mypension', 'nl', 'mypension.be')}, ${src('brutnet', 'nl', 'Bruto – netto')} en ${src('fiche', 'nl', 'Fiscale fiche')} (FPD).</p>`,
        fr: `<p>Selon le SFP, mypension.be est votre portail numérique vers votre pension, que vous soyez déjà pensionné(e) ou non. Selon votre situation, vous y trouvez notamment :</p>
${table(['Ce que vous y trouvez', 'Précision'], [
  ['Données personnelles et correspondance', 'Vos données et votre correspondance avec le Service Pensions, l’INASTI et Sigedis'],
  ['Demande de pension', 'La possibilité de demander votre pension (de retraite, de survie, GRAPA)'],
  ['Estimations', 'Une estimation de votre date de pension légale et de votre date de pension la plus proche'],
  ['Pension complémentaire', 'Un aperçu de votre éventuelle pension complémentaire (2e pilier)'],
  ['Paiements', 'Un relevé de vos paiements et un calendrier des dates de vos futurs paiements'],
  ['Situation sociale et fiscale', 'Votre situation sociale et fiscale, le calcul de votre montant de pension net et votre fiche fiscale']
])}
<p class="help">Source : ${src('mypension', 'fr', 'mypension.be')}, ${src('brutnet', 'fr', 'Brut-net')} et ${src('fiche', 'fr', 'Fiche fiscale')} (SFP).</p>`
      }
    },
    {
      h2: { nl: 'De hervorming vanaf 2027', fr: 'La réforme à partir de 2027' },
      body: {
        nl: `<p>Op mypension.be raamt de FPD uw toekomstig pensioen op basis van de huidige pensioenwetgeving. Vanaf 1 januari 2027 veranderen de regels voor de berekening van de vroegste pensioendatum en van het pensioenbedrag. Daarom worden bepaalde ramingen tijdelijk niet meer getoond; uw wettelijke pensioendatum blijft zichtbaar.</p>
<p>Sinds 3 november 2026 vindt u uw loopbaangegevens enkel nog op mycareer.be.</p>
<p class="help">Bron: ${src('mypension', 'nl', 'mypension.be')} (FPD).</p>`,
        fr: `<p>Sur mypension.be, le SFP estime votre future pension selon la législation actuellement en vigueur. À partir du 1er janvier 2027, les règles changent pour le calcul de la date de pension la plus proche et du montant de la pension. C’est pourquoi certaines estimations sont provisoirement indisponibles ; votre date de pension légale reste visible.</p>
<p>Depuis le 3 novembre 2026, vos données de carrière sont disponibles uniquement sur mycareer.be.</p>
<p class="help">Source : ${src('mypension', 'fr', 'mypension.be')} (SFP).</p>`
      }
    }
  ],
  cta: { nl: [[MYPENSION, 'Naar mypension.be'], ['pensioenen/sociale-inhoudingen/', 'Sociale inhoudingen op uw pensioen']], fr: [[MYPENSION, 'Vers mypension.be'], ['pensions/retenues-sociales/', 'Retenues sociales sur votre pension']] },
  faq: {
    nl: [
      ['Wie betaalt het pensioen van een zelfstandige?', 'Volgens de opdrachten van de Federale Pensioendienst betaalt de FPD de pensioenen, renten en uitkeringen van werknemers, ambtenaren en zelfstandigen.'],
      ['Berekent de FPD ook pensioenen van ambtenaren?', 'Ja. De FPD berekent de pensioenen van werknemers en ambtenaren, en de inkomensgarantie voor ouderen (IGO).'],
      ['Waarom zie ik op mypension.be geen raming van mijn vroegste pensioendatum meer?', 'Omdat de regels voor de vroegste pensioendatum en het pensioenbedrag vanaf 1 januari 2027 veranderen, toont de FPD bepaalde ramingen tijdelijk niet om geen foute verwachtingen te wekken. Uw wettelijke pensioendatum blijft zichtbaar.'],
      ['Waar staat mijn loopbaan?', 'Sinds 3 november 2026 vindt u uw loopbaangegevens enkel nog op mycareer.be.']
    ],
    fr: [
      ['Qui paie la pension d’un indépendant ?', 'Selon les missions du Service fédéral des Pensions, le SFP paie les pensions, rentes et indemnités des salariés, des fonctionnaires et des indépendants.'],
      ['Le SFP calcule-t-il aussi les pensions des fonctionnaires ?', 'Oui. Le SFP calcule les pensions des salariés, des fonctionnaires, ainsi que la garantie de revenus aux personnes âgées (GRAPA).'],
      ['Pourquoi ne vois-je plus d’estimation de ma date de pension la plus proche sur mypension.be ?', 'Comme les règles relatives à la date de pension la plus proche et au montant de la pension changent à partir du 1er janvier 2027, le SFP n’affiche provisoirement plus certaines estimations, pour éviter de fausses attentes. Votre date de pension légale reste visible.'],
      ['Où trouver ma carrière ?', 'Depuis le 3 novembre 2026, vos données de carrière sont disponibles uniquement sur mycareer.be.']
    ]
  },
  sources: ['opdracht', 'mypension', 'brutnet', 'fiche'],
  terms: { nl: [['woordenlijst/myminfin/', 'MyMinfin'], ['woordenlijst/personenbelasting/', 'Personenbelasting']], fr: [['lexique/myminfin/', 'MyMinfin'], ['lexique/impot-des-personnes-physiques/', 'Impôt des personnes physiques']] }
});

PAGES.push({
  key: 'inhoudingen',
  title: { nl: 'ZIV- en solidariteitsbijdrage op pensioen | Belastingkaart', fr: 'Cotisation AMI et de solidarité sur pension | Belastingkaart' },
  desc: {
    nl: 'Sociale inhoudingen op uw brutopensioen: de ZIV-bijdrage van 3,55 % en de solidariteitsbijdrage van 0 tot 2 %, met de drempels vanaf 1 september 2026.',
    fr: 'Retenues sociales sur votre pension brute : cotisation AMI de 3,55 % et cotisation de solidarité de 0 à 2 %, avec les seuils à partir du 1er septembre 2026.'
  },
  h1: { nl: 'Sociale inhoudingen op uw pensioen: ZIV- en solidariteitsbijdrage', fr: 'Retenues sociales sur votre pension : cotisation AMI et de solidarité' },
  summary: {
    nl: '<b>In het kort:</b> de Pensioendienst houdt op het brutobedrag van uw pensioen eerst sociale bijdragen in: de ZIV-bijdrage (3,55 % boven een drempel) en de solidariteitsbijdrage (0 tot 2 %). Beide hangen af van het totale brutobedrag van al uw pensioenen en van uw gezinssituatie.',
    fr: '<b>En bref :</b> le Service Pensions retient d’abord des cotisations sociales sur le montant brut de votre pension : la cotisation AMI (3,55 % au-delà d’un seuil) et la cotisation de solidarité (de 0 à 2 %). Toutes deux dépendent notamment du montant brut total de vos pensions et de votre situation familiale.'
  },
  callout: {
    nl: ['Bedragen vanaf 1 september 2026', 'De drempels hieronder zijn de bedragen die de Federale Pensioendienst publiceert vanaf 01.09.2026, aan index 186,83. Belastingkaart past ze niet toe op uw pensioen.'],
    fr: ['Montants à partir du 1er septembre 2026', 'Les seuils ci-dessous sont les montants publiés par le Service fédéral des Pensions à partir du 01.09.2026, à l’indice 186,83. Belastingkaart ne les applique pas à votre pension.']
  },
  lead: {
    nl: 'Tussen het brutobedrag en het nettobedrag van uw pensioen zitten twee soorten inhoudingen: sociale bijdragen en bedrijfsvoorheffing. Deze gids gaat over de sociale bijdragen; de bedrijfsvoorheffing komt aan bod in de gids over de belasting op uw pensioen.',
    fr: 'Entre le montant brut et le montant net de votre pension, il y a deux sortes de retenues : des cotisations sociales et le précompte professionnel. Ce guide traite des cotisations sociales ; le précompte professionnel est abordé dans le guide sur l’impôt sur votre pension.'
  },
  sections: [
    {
      h2: { nl: 'Van bruto naar netto: de volgorde op de betaalfiche', fr: 'Du brut au net : l’ordre sur la fiche de paiement' },
      body: {
        nl: `<p>De Federale Pensioendienst toont de berekening van uw nettopensioen in deze volgorde:</p>
${table(['Stap', 'Inhouding of resultaat', 'Voor wie'], [
  ['1', 'Bruto pensioenbedrag', 'Iedereen'],
  ['2', '− Ziekte- en invaliditeitsverzekering bijdrage (ZIV-bijdrage)', 'Boven een drempel'],
  ['3', '− Solidariteitsbijdrage', 'Boven een drempel'],
  ['4', '− Inhouding begrafenisvergoeding', 'Enkel ambtenarenpensioenen en pensioenen van HR Rail'],
  ['5', '− Sociaal solidariteitsfonds (SSF)', 'Enkel pensioenen van HR Rail'],
  ['6', '= Belastbaar pensioenbedrag', ''],
  ['7', '− Bedrijfsvoorheffing', 'Op alle belastbare uitkeringen'],
  ['8', '= Netto pensioenbedrag', ''],
  ['9', '− Terugvorderingen, beslag en alimentatie; vakbondsbijdrage (enkel HR Rail)', 'Alleen in die gevallen'],
  ['10', '= Betaalbaar pensioenbedrag', '']
])}
<p class="help">Bron: ${src('brutnet', 'nl', 'Bruto – netto')} (FPD). Op mypension.be toont de FPD hoe uw eigen nettobedrag berekend is.</p>`,
        fr: `<p>Le Service fédéral des Pensions présente le calcul de votre pension nette dans cet ordre :</p>
${table(['Étape', 'Retenue ou résultat', 'Pour qui'], [
  ['1', 'Montant de pension brut', 'Tout le monde'],
  ['2', '− Cotisation assurance maladie-invalidité (cotisation AMI)', 'Au-delà d’un seuil'],
  ['3', '− Cotisation de solidarité', 'Au-delà d’un seuil'],
  ['4', '− Retenue pour frais de funérailles', 'Uniquement pensions de fonctionnaires et de HR Rail'],
  ['5', '− Caisse sociale de solidarité (CSS)', 'Uniquement pensions de HR Rail'],
  ['6', '= Montant de pension imposable', ''],
  ['7', '− Précompte professionnel', 'Sur tous les revenus imposables'],
  ['8', '= Montant de pension net', ''],
  ['9', '− Récupérations, saisies et rentes alimentaires ; cotisation syndicale (uniquement HR Rail)', 'Seulement dans ces cas'],
  ['10', '= Montant de pension payable', '']
])}
<p class="help">Source : ${src('brutnet', 'fr', 'Brut-net')} (SFP). Sur mypension.be, le SFP montre comment votre propre montant net est calculé.</p>`
      }
    },
    {
      h2: { nl: 'De ZIV-bijdrage', fr: 'La cotisation AMI' },
      body: {
        nl: `<p>De ZIV-bijdrage is een sociale-zekerheidsbijdrage voor de financiering van de ziekte- en invaliditeitsverzekering. Ze bedraagt maandelijks 3,55 % van het brutobedrag van uw pensioen als het totale maandelijkse brutobedrag van uw pensioenen een bepaalde drempel overschrijdt. Daarbij tellen ook buitenlandse en aanvullende pensioenen en pensioenen van internationale instellingen mee.</p>
${table(['Gezinssituatie', 'Totaal maandelijks brutobedrag (geïndexeerd)', 'Inhouding'], [
  ['Alleenstaande (plafond I)', 'kleiner dan 2 120,08 euro', 'geen inhouding'],
  ['Alleenstaande (plafond I)', 'van 2 120,08 euro tot en met 2 198,09 euro', 'bruto geïndexeerd maandbedrag – 2 120,08'],
  ['Alleenstaande (plafond I)', 'groter dan 2 198,09 euro', '3,55 % van het brutobedrag'],
  ['Met gezinslast (plafond II)', 'kleiner dan 2 512,58 euro', 'geen inhouding'],
  ['Met gezinslast (plafond II)', 'van 2 512,58 euro tot en met 2 605,04 euro', 'bruto geïndexeerd maandbedrag – 2 512,58'],
  ['Met gezinslast (plafond II)', 'groter dan 2 605,04 euro', '3,55 % van het brutobedrag']
])}
<p>Ontvangt u pensioenvoordelen van meerdere pensioeninstellingen en moet de inhouding beperkt worden tot de drempel, dan houdt de Pensioendienst de bijdrage in voor alle pensioenuitkeringen, ook die van de andere instellingen. Het ingehouden percentage kan dan hoger zijn dan 3,55 %.</p>
<p class="help">Bedragen vanaf 01.09.2026 aan index 186,83. Bron: ${src('brutnet', 'nl', 'Bruto – netto')} (FPD).</p>`,
        fr: `<p>La cotisation AMI est une cotisation de sécurité sociale visant à financer l’assurance maladie-invalidité. Elle s’élève mensuellement à 3,55 % du montant brut de votre pension si le montant mensuel brut total de vos pensions dépasse un certain seuil. Les pensions étrangères et complémentaires et les pensions d’institutions internationales sont comprises dans ce total.</p>
${table(['Situation familiale', 'Montant mensuel brut total (indexé)', 'Retenue'], [
  ['Isolé (plafond I)', 'inférieur à 2 120,08 euros', 'pas de retenue'],
  ['Isolé (plafond I)', 'de 2 120,08 euros à 2 198,09 euros', 'montant mensuel brut indexé – 2 120,08 euros'],
  ['Isolé (plafond I)', 'supérieur à 2 198,09 euros', '3,55 % du montant brut'],
  ['Avec charge de famille (plafond II)', 'inférieur à 2 512,58 euros', 'pas de retenue'],
  ['Avec charge de famille (plafond II)', 'de 2 512,58 euros à 2 605,04 euros', 'montant mensuel brut indexé – 2 512,58 euros'],
  ['Avec charge de famille (plafond II)', 'supérieur à 2 605,04 euros', '3,55 % du montant brut']
])}
<p>Si plusieurs organismes de pension vous paient un avantage et que la retenue doit être limitée au seuil, c’est le SFP qui retient la cotisation pour la pension qu’il paie et pour toutes les pensions payées par les autres organismes. Le pourcentage retenu peut alors être supérieur à 3,55 %.</p>
<p class="help">Montants à partir du 01.09.2026 à l’indice 186,83. Source : ${src('brutnet', 'fr', 'Brut-net')} (SFP).</p>`
      }
    },
    {
      h2: { nl: 'De solidariteitsbijdrage', fr: 'La cotisation de solidarité' },
      body: {
        nl: `<p>De solidariteitsbijdrage is een sociale inhouding die varieert van 0 tot 2 %, naargelang het totale brutobedrag van al uw pensioenen en uw gezinssituatie. Om het percentage te bepalen telt de Pensioendienst alle pensioenen mee, ook buitenlandse pensioenen, pensioenen van internationale instellingen en aanvullende pensioenen (2e pijler). Een individuele levensverzekering of pensioensparen (3e pijler) telt niet mee.</p>
${table(['Pensioen', 'Totaal maandelijks brutobedrag', 'Solidariteitsbijdrage'], [
  ['Alleenstaande', '0,01 euro tot 3 356,17 euro', '0'],
  ['Alleenstaande', '3 356,18 euro tot 3 459,95 euro', '(brutobedrag – 3 356,17) x 0,5'],
  ['Alleenstaande', '3 459,96 euro tot 3 717,23 euro', 'brutobedrag x 0,015'],
  ['Alleenstaande', '3 717,24 euro tot 3 755,96 euro', '(brutobedrag – 3 717,23) x 0,5 + 55,76'],
  ['Alleenstaande', 'vanaf 3 755,97 euro', 'brutobedrag x 0,02'],
  ['Met gezinslast', '0,01 euro tot 3 880,15 euro', '0'],
  ['Met gezinslast', '3 880,16 euro tot 4 000,12 euro', '(brutobedrag – 3 880,15) x 0,5'],
  ['Met gezinslast', '4 000,13 euro tot 4 252,44 euro', 'brutobedrag x 0,015'],
  ['Met gezinslast', '4 252,45 euro tot 4 296,74 euro', '(brutobedrag – 4 252,44) x 0,5 + 63,79'],
  ['Met gezinslast', 'vanaf 4 296,75 euro', 'brutobedrag x 0,02']
])}
<p class="help">Bedragen vanaf 01.09.2026 aan index 186,83, overgenomen zoals de FPD ze vermeldt. Bron: ${src('brutnet', 'nl', 'Bruto – netto')} (FPD).</p>`,
        fr: `<p>La cotisation de solidarité est une retenue sociale progressive qui varie de 0 à 2 %, en fonction notamment du montant brut total de vos pensions et de votre situation familiale. Pour déterminer le pourcentage, le Service Pensions tient compte de toutes les pensions, y compris les pensions étrangères, les pensions d’institutions internationales et les pensions complémentaires (2e pilier). Une éventuelle assurance vie ou épargne-pension individuelle (3e pilier) n’est pas prise en compte.</p>
${table(['Pension', 'Montant mensuel brut total', 'Cotisation de solidarité'], [
  ['Isolé', '0,01 euro à 3 356,17 euros', '0'],
  ['Isolé', '3 356,18 euros à 3 459,95 euros', '(montant brut – 3 356,17) x 0,5'],
  ['Isolé', '3 459,96 euros à 3 717,23 euros', 'montant brut x 0,015'],
  ['Isolé', '3 717,24 euros à 3 755,96 euros', '(montant brut – 3 717,23) x 0,5 + 55,76'],
  ['Isolé', 'à partir de 3 755,97 euros', 'montant brut x 0,02'],
  ['Avec charge de famille', '0,01 euro à 3 880,15 euros', '0'],
  ['Avec charge de famille', '3 880,16 euros à 4 000,12 euros', '(montant brut – 3 880,15) x 0,5'],
  ['Avec charge de famille', '4 000,13 euros à 4 252,44 euros', 'montant brut x 0,015'],
  ['Avec charge de famille', '4 252,45 euros à 4 296,74 euros', '(montant brut – 4 252,44) x 0,5 + 63,79'],
  ['Avec charge de famille', 'à partir de 4 296,75 euros', 'montant brut x 0,02']
])}
<p class="help">Montants à partir du 01.09.2026 à l’indice 186,83, repris tels que les mentionne le SFP. Source : ${src('brutnet', 'fr', 'Brut-net')} (SFP).</p>`
      }
    },
    {
      h2: { nl: 'Inhoudingen voor ambtenaren en HR Rail', fr: 'Retenues pour les fonctionnaires et HR Rail' },
      body: {
        nl: `<p>Op het bruto rustpensioen van ambtenaren en van de Spoorwegen houdt de Pensioendienst maandelijks 0,5 % in om de begrafenisvergoeding te financieren; niet op het overlevingspensioen, het koloniale pensioen, de arbeidsongevallenrente en het vakantiegeld. Voor de pensioenen van HR Rail komt daar de inhouding voor het sociaal solidariteitsfonds bij: 0,75 % van het brutobedrag boven een plafondbedrag.</p>
<p class="help">Bron: ${src('brutnet', 'nl', 'Bruto – netto')} (FPD).</p>`,
        fr: `<p>Sur le montant brut des pensions de retraite des fonctionnaires et de HR Rail, le Service Pensions retient chaque mois 0,5 % pour financer les indemnités pour frais de funérailles ; pas sur la pension de survie, la pension coloniale, la rente d’accident de travail et le pécule de vacances. Pour les pensions de HR Rail s’y ajoute la retenue pour la caisse sociale de solidarité : 0,75 % du montant brut au-delà d’un montant plancher.</p>
<p class="help">Source : ${src('brutnet', 'fr', 'Brut-net')} (SFP).</p>`
      }
    }
  ],
  cta: { nl: [['pensioenen/belasting-op-pensioen/', 'Belasting op uw pensioen'], [MYPENSION, 'Uw inhoudingen op mypension.be']], fr: [['pensions/impot-sur-la-pension/', 'Impôt sur votre pension'], [MYPENSION, 'Vos retenues sur mypension.be']] },
  faq: {
    nl: [
      ['Wie houdt de ZIV- en de solidariteitsbijdrage in?', 'De Federale Pensioendienst, op het brutobedrag van uw pensioen. Bij meerdere pensioeninstellingen kan de Pensioendienst de ZIV-bijdrage voor alle uitkeringen inhouden.'],
      ['Vervangt de ZIV-bijdrage mijn bijdrage aan het ziekenfonds?', 'Nee. De ZIV-bijdrage vervangt niet de bijdrage die u betaalt aan uw ziekenfonds.'],
      ['Telt mijn aanvullend pensioen mee?', 'Ja. Voor de drempel van de ZIV-bijdrage en voor het percentage van de solidariteitsbijdrage tellen ook aanvullende pensioenen (2e pijler) mee, net als buitenlandse pensioenen en pensioenen van internationale instellingen.'],
      ['Telt mijn pensioensparen mee voor de solidariteitsbijdrage?', 'Nee. Bij de berekening van de solidariteitsbijdrage houdt de Pensioendienst geen rekening met een individuele levensverzekering of pensioensparen (3e pijler).']
    ],
    fr: [
      ['Qui retient la cotisation AMI et la cotisation de solidarité ?', 'Le Service fédéral des Pensions, sur le montant brut de votre pension. Lorsque plusieurs organismes de pension interviennent, le SFP peut retenir la cotisation AMI pour toutes les prestations.'],
      ['La cotisation AMI remplace-t-elle ma cotisation à la mutuelle ?', 'Non. La cotisation AMI ne remplace pas la cotisation que vous payez à votre mutuelle.'],
      ['Ma pension complémentaire est-elle prise en compte ?', 'Oui. Pour le seuil de la cotisation AMI et pour le pourcentage de la cotisation de solidarité, les pensions complémentaires (2e pilier) sont prises en compte, comme les pensions étrangères et les pensions d’institutions internationales.'],
      ['Mon épargne-pension compte-t-elle pour la cotisation de solidarité ?', 'Non. Le calcul de la cotisation de solidarité ne tient pas compte d’une éventuelle assurance vie ou épargne-pension individuelle (3e pilier).']
    ]
  },
  sources: ['brutnet'],
  terms: { nl: [['woordenlijst/bedrijfsvoorheffing/', 'Bedrijfsvoorheffing'], ['woordenlijst/nettoloon/', 'Nettoloon']], fr: [['lexique/precompte-professionnel/', 'Précompte professionnel'], ['lexique/salaire-net/', 'Salaire net']] }
});

PAGES.push({
  key: 'belasting',
  title: { nl: 'Belasting op pensioen en voorheffing | Belastingkaart', fr: 'Impôt sur la pension et précompte | Belastingkaart' },
  desc: {
    nl: 'Hoe uw pensioen belast wordt: de bedrijfsvoorheffing als voorschot, de fiscale fiche 281.11 en de vermindering voor pensioenen (artikel 147 WIB 92).',
    fr: 'Comment votre pension est imposée : le précompte professionnel comme avance, la fiche fiscale 281.11 et la réduction pour pensions (article 147 CIR 92).'
  },
  h1: { nl: 'Belasting op uw pensioen: voorheffing en vermindering', fr: 'L’impôt sur votre pension : précompte et réduction' },
  summary: {
    nl: '<b>In het kort:</b> op uw belastbaar pensioen houdt de Pensioendienst bedrijfsvoorheffing in, een voorschot op de personenbelasting. Na het jaar berekent de FOD Financiën de belasting op al uw inkomsten en verleent hij op de belasting op pensioenen een vermindering voor pensioenen en vervangingsinkomsten.',
    fr: '<b>En bref :</b> sur votre pension imposable, le Service Pensions retient le précompte professionnel, une avance sur l’impôt des personnes physiques. Après l’année, le SPF Finances calcule l’impôt sur l’ensemble de vos revenus et accorde, sur l’impôt afférent aux pensions, une réduction pour pensions et revenus de remplacement.'
  },
  callout: {
    nl: ['Inkomsten 2026, aanslagjaar 2027', 'De bedragen van de vermindering hieronder zijn de geïndexeerde bedragen voor inkomsten 2026 uit artikel 147 WIB 92 op Fisconetplus. Belastingkaart berekent geen persoonlijke belasting op een pensioen.'],
    fr: ['Revenus 2026, exercice d’imposition 2027', 'Les montants de la réduction ci-dessous sont les montants indexés pour les revenus 2026 de l’article 147 CIR 92 sur Fisconetplus. Belastingkaart ne calcule aucun impôt personnel sur une pension.']
  },
  lead: {
    nl: 'Een pensioen wordt in twee stappen belast: tijdens het jaar via de bedrijfsvoorheffing die op elke betaling wordt ingehouden, en na het jaar via de personenbelasting, waarop die voorheffing een voorschot is. Deze gids legt beide stappen uit, zonder bedragen voor uw situatie te berekenen.',
    fr: 'Une pension est imposée en deux temps : pendant l’année, par le précompte professionnel retenu sur chaque paiement, et après l’année, par l’impôt des personnes physiques, dont ce précompte est une avance. Ce guide explique ces deux étapes, sans calculer de montant pour votre situation.'
  },
  sections: [
    {
      h2: { nl: 'Bedrijfsvoorheffing op uw pensioen', fr: 'Le précompte professionnel sur votre pension' },
      body: {
        nl: `<p>De bedrijfsvoorheffing is een bedrag dat de Pensioendienst inhoudt op al uw belastbare uitkeringen. Het is een voorschot op de personenbelasting dat aan de FOD Financiën wordt doorgestort. Het bedrag hangt af van:</p>
<ul>
<li>het belastbaar bedrag van de inkomsten van het gezin;</li>
<li>het aantal kinderen ten laste (met of zonder handicap);</li>
<li>de gezinssituatie (alleenstaand, gehuwd, …).</li>
</ul>
<p>Bij die berekening weet de Pensioendienst niet of u andere inkomsten hebt, zoals beroeps- of vervangingsinkomsten, en houdt hij er dus geen rekening mee. De FOD Financiën houdt bij de belastingaanslag wél rekening met al uw inkomsten. Daardoor kan het dat u bij de eindafrekening een aanzienlijk bedrag moet bijbetalen.</p>
<p class="help">Bron: ${src('brutnet', 'nl', 'Bruto – netto, bedrijfsvoorheffing')} (FPD).</p>`,
        fr: `<p>Le précompte professionnel est un montant que le Service Pensions retient sur tous vos revenus imposables. C’est une avance sur l’impôt des personnes physiques qui est transférée au SPF Finances. Le montant dépend :</p>
<ul>
<li>du montant imposable des revenus du ménage ;</li>
<li>du nombre de personnes à charge (porteuses d’un handicap ou non) ;</li>
<li>de la situation familiale (isolé, marié, …).</li>
</ul>
<p>Pour ce calcul, le Service Pensions ne sait pas si vous avez d’autres revenus, par exemple des revenus professionnels ou de remplacement, et n’en tient donc pas compte. Le SPF Finances, en revanche, tient compte de l’ensemble de vos revenus pour calculer vos impôts. Il est donc possible que vous deviez payer un montant important lors du décompte final (avertissement-extrait de rôle).</p>
<p class="help">Source : ${src('brutnet', 'fr', 'Brut-net, précompte professionnel')} (SFP).</p>`
      }
    },
    {
      h2: { nl: 'Meer voorheffing laten inhouden', fr: 'Faire retenir plus de précompte' },
      body: {
        nl: `<p>Om een grote bijbetaling te vermijden, noemt de FPD drie mogelijkheden:</p>
${table(['Mogelijkheid', 'Hoe', 'Bij wie'], [
  ['Voorafbetalingen', 'Zelf voorafbetalingen doen; daarvoor geldt een belastingvermindering', 'FOD Financiën'],
  ['Fiscaal voluntariaat', 'Maandelijks een aanvullend bedrag laten inhouden bovenop de wettelijke bedrijfsvoorheffing, via mypension.be of het contactformulier', 'Pensioendienst'],
  ['Vrijwillige fiscaliteit op uw loon', 'Als u werkt: meer bedrijfsvoorheffing laten inhouden op uw beroepsinkomsten', 'Uw werkgever']
])}
<p class="help">Bron: ${src('brutnet', 'nl', 'Bruto – netto')} (FPD).</p>`,
        fr: `<p>Pour éviter de payer un montant important, le SFP cite trois options :</p>
${table(['Option', 'Comment', 'Auprès de qui'], [
  ['Versements anticipés', 'Effectuer vous-même des versements anticipés, qui donnent droit à une réduction d’impôts', 'SPF Finances'],
  ['Volontariat fiscal', 'Faire retenir chaque mois un montant supplémentaire en plus du précompte professionnel légal, via mypension.be ou le formulaire de contact', 'Service Pensions'],
  ['Volontariat fiscal sur votre salaire', 'Si vous travaillez : faire retenir plus de précompte professionnel sur votre revenu professionnel', 'Votre employeur']
])}
<p class="help">Source : ${src('brutnet', 'fr', 'Brut-net')} (SFP).</p>`
      }
    },
    {
      h2: { nl: 'De fiscale fiche 281.11', fr: 'La fiche fiscale 281.11' },
      body: {
        nl: `<p>Uw fiscale fiche of pensioenfiche 281.11 vermeldt de belastbare bedragen die u in het voorgaande jaar ontving en de bedrijfsvoorheffing die al ingehouden en doorgestort werd. Elk jaar in februari bezorgt de Pensioendienst de fiche aan de FOD Financiën, die de gegevens gebruikt om uw belastingaangifte voor te bereiden. In de loop van maart staat de fiche op mypension.be en in uw eBox.</p>
<p>Woont u in België, dan hebt u de fiche meestal niet nodig: in een voorstel van vereenvoudigde aangifte en in MyMinfin (Tax-on-web) zijn uw pensioengegevens al ingevuld.</p>
<p class="help">Bron: ${src('fiche', 'nl', 'Fiscale fiche (pensioenfiche 281.11)')} (FPD).</p>`,
        fr: `<p>Votre fiche fiscale ou fiche de pension 281.11 reprend les montants de pension imposables reçus au cours de l’année précédente et le précompte professionnel déjà retenu et transféré. Chaque année, en février, le Service Pensions transmet la fiche au SPF Finances, qui utilise ces données pour préparer votre déclaration d’impôts. Dans le courant du mois de mars, la fiche est placée sur mypension.be et dans votre eBox.</p>
<p>Si vous résidez en Belgique, vous n’en avez généralement pas besoin : dans une proposition de déclaration simplifiée et dans MyMinfin (Tax-on-web), vos données de pension sont déjà préremplies.</p>
<p class="help">Source : ${src('fiche', 'fr', 'Fiche fiscale (fiche de pension 281.11)')} (SFP).</p>`
      }
    },
    {
      h2: { nl: 'De vermindering voor pensioenen en vervangingsinkomsten', fr: 'La réduction pour pensions et revenus de remplacement' },
      body: {
        nl: `<p>Artikel 147 van het Wetboek van de inkomstenbelastingen 1992 (WIB 92) verleent een vermindering op de belasting die met betrekking tot pensioenen en vervangingsinkomsten berekend is. Bestaat het netto-inkomen uitsluitend uit pensioenen, dan bestaat ze uit een basisvermindering en een aanvullende vermindering. Bestaat het netto-inkomen maar gedeeltelijk uit pensioenen, dan krijgt u een gedeelte van die bedragen, evenredig met het aandeel van de pensioenen in het netto-inkomen; voor wie de wettelijke pensioenleeftijd heeft bereikt, bevat het artikel daarbij bijzondere regels voor activiteitsinkomsten.</p>
${table(['Netto-inkomen bestaat uitsluitend uit', 'Vermindering (inkomsten 2026, geïndexeerd)'], [
  ['Pensioenen', 'basisvermindering 2.182,06 euro en aanvullende vermindering 467,87 euro'],
  ['Andere vervangingsinkomsten', 'basisvermindering 2.182,06 euro en aanvullende vermindering 467,87 euro'],
  ['Werkloosheidsuitkeringen', '545,51 euro'],
  ['Wettelijke ziekte- en invaliditeitsuitkeringen', '2.959,25 euro']
])}
<p>Het artikel bepaalt ook dat de Koning de aanvullende vermindering verhoogt wanneer de belasting niet tot nul is teruggebracht voor een belastingplichtige met een belastbaar inkomen van 20.110 euro (geïndexeerd bedrag) dat uitsluitend uit pensioenen, leeflonen of andere vervangingsinkomsten bestaat.</p>
<p class="help">Bedragen voor inkomsten 2026 (aanslagjaar 2027). Bron: ${src('art147', 'nl', 'Artikel 147, WIB 92 (inkomsten 2026)')} (Fisconetplus).</p>`,
        fr: `<p>L’article 147 du Code des impôts sur les revenus 1992 (CIR 92) accorde une réduction sur l’impôt afférent aux pensions et aux revenus de remplacement. Lorsque le revenu net se compose exclusivement de pensions, elle comprend une réduction de base et une réduction additionnelle. Lorsque le revenu net ne se compose que partiellement de pensions, vous obtenez une quotité de ces montants, proportionnelle à la part des pensions dans le revenu net ; pour le contribuable qui a atteint l’âge légal de la retraite, l’article prévoit en outre des règles particulières pour les revenus d’activités.</p>
${table(['Le revenu net se compose exclusivement de', 'Réduction (revenus 2026, montants indexés)'], [
  ['Pensions', 'réduction de base 2.182,06 euros et réduction additionnelle 467,87 euros'],
  ['Autres revenus de remplacement', 'réduction de base 2.182,06 euros et réduction additionnelle 467,87 euros'],
  ['Allocations de chômage', '545,51 euros'],
  ['Indemnités légales d’assurance maladie-invalidité', '2.959,25 euros']
])}
<p>L’article prévoit aussi que le Roi majore la réduction additionnelle lorsque l’impôt n’est pas ramené à zéro pour un contribuable dont le revenu imposable de 20.110 euros (montant indexé) se compose exclusivement de pensions, de revenus d’intégration ou d’autres revenus de remplacement.</p>
<p class="help">Montants pour les revenus 2026 (exercice d’imposition 2027). Source : ${src('art147', 'fr', 'Article 147, CIR 92 (revenus 2026)')} (Fisconetplus).</p>`
      }
    }
  ],
  cta: { nl: [['pensioenen/sociale-inhoudingen/', 'Sociale inhoudingen op uw pensioen'], ['gidsen/bedrijfsvoorheffing-en-personenbelasting/', 'Gids: bedrijfsvoorheffing en personenbelasting']], fr: [['pensions/retenues-sociales/', 'Retenues sociales sur votre pension'], ['guides/precompte-professionnel-et-impot/', 'Guide : précompte et impôt des personnes physiques']] },
  faq: {
    nl: [
      ['Is de bedrijfsvoorheffing op mijn pensioen een aparte belasting?', 'Nee. Het is een voorschot op de personenbelasting dat de Pensioendienst inhoudt en aan de FOD Financiën doorstort.'],
      ['Waarom moet ik belasting bijbetalen terwijl er voorheffing is ingehouden?', 'De Pensioendienst kent uw andere inkomsten niet en houdt er geen rekening mee. De FOD Financiën belast al uw inkomsten samen, waardoor u bij de eindafrekening kunt moeten bijbetalen.'],
      ['Kan ik vragen om meer voorheffing in te houden?', 'Ja. Met het fiscaal voluntariaat laat u de Pensioendienst maandelijks een aanvullend bedrag inhouden bovenop de wettelijke bedrijfsvoorheffing. U vraagt het aan via mypension.be of het online contactformulier.'],
      ['Geldt de vermindering alleen voor pensioenen?', 'Nee. Artikel 147 WIB 92 voorziet ook verminderingen voor andere vervangingsinkomsten, leeflonen, werkloosheidsuitkeringen en wettelijke ziekte- en invaliditeitsuitkeringen, elk met een eigen bedrag. Belastingkaart berekent die verminderingen niet voor uw situatie.']
    ],
    fr: [
      ['Le précompte professionnel sur ma pension est-il un impôt distinct ?', 'Non. C’est une avance sur l’impôt des personnes physiques que le Service Pensions retient et transfère au SPF Finances.'],
      ['Pourquoi dois-je payer un supplément alors que du précompte a été retenu ?', 'Le Service Pensions ne connaît pas vos autres revenus et n’en tient pas compte. Le SPF Finances impose l’ensemble de vos revenus, ce qui peut entraîner un supplément lors du décompte final.'],
      ['Puis-je demander qu’on retienne plus de précompte ?', 'Oui. Avec le volontariat fiscal, le Service Pensions retient chaque mois un montant supplémentaire en plus du précompte professionnel légal. Vous en faites la demande via mypension.be ou le formulaire de contact en ligne.'],
      ['La réduction vaut-elle uniquement pour les pensions ?', 'Non. L’article 147 CIR 92 prévoit aussi des réductions pour les autres revenus de remplacement, les revenus d’intégration, les allocations de chômage et les indemnités légales d’assurance maladie-invalidité, chacune avec son propre montant. Belastingkaart ne calcule pas ces réductions pour votre situation.']
    ]
  },
  sources: ['brutnet', 'fiche', 'art147'],
  terms: {
    nl: [['woordenlijst/bedrijfsvoorheffing/', 'Bedrijfsvoorheffing'], ['woordenlijst/personenbelasting/', 'Personenbelasting'], ['woordenlijst/aanslagbiljet/', 'Aanslagbiljet'], ['woordenlijst/inkomstenjaar/', 'Inkomstenjaar'], ['woordenlijst/aanslagjaar/', 'Aanslagjaar'], ['woordenlijst/voorstel-vereenvoudigde-aangifte/', 'Voorstel van vereenvoudigde aangifte']],
    fr: [['lexique/precompte-professionnel/', 'Précompte professionnel'], ['lexique/impot-des-personnes-physiques/', 'Impôt des personnes physiques'], ['lexique/avertissement-extrait-de-role/', 'Avertissement-extrait de rôle'], ['lexique/annee-de-revenus/', 'Année de revenus'], ['lexique/exercice-d-imposition/', 'Exercice d’imposition'], ['lexique/proposition-de-declaration-simplifiee/', 'Proposition de déclaration simplifiée']]
  }
});

// ---- index -----------------------------------------------------------------------------------
const INDEX = {
  title: { nl: 'Pensioenen: inhoudingen en belasting | Belastingkaart', fr: 'Pensions : retenues sociales et impôt | Belastingkaart' },
  desc: {
    nl: 'Gidsen over het Belgische wettelijk pensioen: wie het betaalt, de sociale inhoudingen, de bedrijfsvoorheffing en de belastingvermindering, met bronnen.',
    fr: 'Guides sur la pension légale belge : qui la paie, les retenues sociales, le précompte professionnel et la réduction d’impôt, avec les sources officielles.'
  },
  h1: { nl: 'Pensioenen: van bruto tot belasting', fr: 'Pensions : du brut à l’impôt' },
  lead: {
    nl: 'Het wettelijk pensioen uitgelegd met de officiële informatie van de Federale Pensioendienst en de FOD Financiën: wie het betaalt, welke sociale bijdragen erop worden ingehouden en hoe het belast wordt. Elke gids vermeldt zijn bronnen; uw eigen bedragen staan op mypension.be.',
    fr: 'La pension légale expliquée à partir des informations officielles du Service fédéral des Pensions et du SPF Finances : qui la paie, quelles cotisations sociales sont retenues et comment elle est imposée. Chaque guide cite ses sources ; vos propres montants figurent sur mypension.be.'
  },
  groups: {
    nl: [['Het wettelijk pensioen', ['wettelijk']], ['Van brutopensioen tot nettopensioen', ['inhoudingen', 'belasting']]],
    fr: [['La pension légale', ['wettelijk']], ['De la pension brute à la pension nette', ['inhoudingen', 'belasting']]]
  },
  sparen: {
    nl: up => `<p>Pensioensparen (de 3e pijler) heeft een eigen fiscale regeling en een eigen sectie: <a href="${up}${PENDING.nl}" data-pending-link>pensioensparen</a>.</p>`,
    fr: up => `<p>L’épargne-pension (le 3e pilier) a son propre régime fiscal et sa propre section : <a href="${up}${PENDING.fr}" data-pending-link>épargne-pension</a>.</p>`
  },
  sparenTitle: { nl: 'Pensioensparen', fr: 'Épargne-pension' },
  glossTitle: { nl: 'Woordenlijst en gidsen', fr: 'Lexique et guides' },
  gloss: {
    nl: up => `<p>Fiscale begrippen van A tot Z: <a href="${up}nl/woordenlijst/">woordenlijst</a>. Meer uitleg over loon en belastingen: <a href="${up}nl/gidsen/">gidsen</a>.</p>`,
    fr: up => `<p>Les notions fiscales de A à Z : <a href="${up}fr/lexique/">lexique</a>. Plus d’explications sur le salaire et les impôts : <a href="${up}fr/guides/">guides</a>.</p>`
  },
  cta: { nl: [[MYPENSION, 'Naar mypension.be'], ['bronnen/', 'Onze officiële bronnen']], fr: [[MYPENSION, 'Vers mypension.be'], ['sources/', 'Nos sources officielles']] },
  sources: ['opdracht', 'mypension', 'brutnet', 'fiche', 'art147']
};

// ---- rendering --------------------------------------------------------------------------------
function actions(list, lang, up) {
  return `<div class="page-actions">${list.map(([href, label], i) => {
    const external = /^https:/.test(href);
    return `<a class="btn ${i ? 'btn-secondary' : 'btn-primary'}" href="${external ? href : up + lang + '/' + href}"${external ? ' rel="noopener"' : ''}>${label}${i ? '' : ' <span class="arrow" aria-hidden="true">→</span>'}</a>`;
  }).join(' ')}</div>`;
}
function sourcesCard(keys, lang) {
  const t = T[lang];
  return `<div class="card sources"><h2 class="card-title">${t.sources}</h2><p class="help">${t.sourcesNote}</p><ul class="link-list source-list">${keys.map(k =>
    `<li><a href="${S[k].url[lang]}" rel="noopener">${S[k].org[lang]}${lang === 'fr' ? ' : ' : ': '}${S[k].title[lang]}</a><span>${S[k].url[lang]} · ${t.consulted} ${S[k].date[lang]}</span></li>`).join('')}</ul></div>`;
}
function topicList(lang, up, keys) {
  return `<ul class="guide-list">${keys.map(k => `<li><a href="${up}${R[k][lang === 'nl' ? 0 : 1]}">${NAV[lang][k]}</a><span>${SUB[lang][k]}</span></li>`).join('')}</ul>`;
}

function shell({ lang, route, other, title, desc, crumbs, main }) {
  const t = T[lang];
  const up = '../'.repeat(route.split('/').length - 1);
  const [nl, fr] = lang === 'nl' ? [route, other] : [other, route];
  const nav = t.nav.map(([h, l]) => `      <a href="${up}${lang}/${h}">${l}</a>`).join('\n');
  return `<!doctype html>
<html lang="${lang}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${title}</title>
<meta name="description" content="${desc}">
<link rel="canonical" href="${SITE}/${route}">
<link rel="alternate" hreflang="nl-BE" href="${SITE}/${nl}">
<link rel="alternate" hreflang="fr-BE" href="${SITE}/${fr}">
<link rel="alternate" hreflang="x-default" href="${SITE}/nl/">
<meta name="theme-color" content="#1f3fc4">
<meta name="color-scheme" content="light dark">
<script>try{var t=localStorage.getItem("bk-theme");if(t==="light"||t==="dark")document.documentElement.setAttribute("data-theme",t)}catch(e){}</script>
<link rel="preload" href="${up}fonts/public-sans-latin-var.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="${up}fonts/archivo-latin-var.woff2" as="font" type="font/woff2" crossorigin>
<link rel="icon" href="${up}favicon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="${up}icons/apple-touch-icon.png">
<link rel="manifest" href="${up}${lang}/manifest.webmanifest">
<link rel="stylesheet" href="${up}css/site.css">
<link rel="stylesheet" href="${up}css/components.css">
<link rel="stylesheet" href="${up}css/pensioenen.css">
<script defer src="${up}config.js"></script>
<script defer src="${up}js/menu.js"></script>
<script defer src="${up}js/ui.js"></script>
</head>
<body class="page" data-lang="${lang}">
<a class="skip-link" href="#content">${t.skip}</a>
<header class="appbar">
  <div class="appbar-in">
    <a class="brand" href="${up}${lang}/" aria-label="${t.home}">${BRAND}<span class="brand-name">Belastingkaart</span></a>
    <nav class="nav" aria-label="${t.sections}">
${nav}
    </nav>
    <div class="appbar-end">
      <button class="btn-icon theme-btn" id="theme-toggle" type="button" ${t.theme}>${THEME}</button>
      <a class="lang-switch" href="${up}${other}" hreflang="${lang === 'nl' ? 'fr-BE' : 'nl-BE'}" lang="${lang === 'nl' ? 'fr' : 'nl'}" aria-label="${t.switchLabel}">${lang === 'nl' ? 'FR' : 'NL'}</a>
      <a class="btn btn-primary btn-sm btn-cta" href="${up}${lang}/#simulator">${t.cta}</a>
    </div>
  </div>
</header>
<main class="container page-main pensioenen" id="content" tabindex="-1">
  <p class="breadcrumbs">${crumbs}</p>
${main}
</main>
<footer class="footer">
  <div class="container footer-in">
    <p>${t.footerIntro}</p>
    <nav class="footer-nav" aria-label="${t.footerNav}">
      ${footerColumns(lang, route)}
      <div><p class="footer-title">${t.langTitle}</p><ul><li><a href="${up}${nl}" hreflang="nl-BE" lang="nl">Nederlands</a></li><li><a href="${up}${fr}" hreflang="fr-BE" lang="fr">Français</a></li></ul></div>
    </nav>
    <p class="footer-small">${footerSmall(lang)}</p>
  </div>
</footer>
</body>
</html>
`;
}

function renderIndex(lang) {
  const t = T[lang], x = INDEX;
  const [nl, fr] = R.index;
  const route = lang === 'nl' ? nl : fr;
  const up = '../'.repeat(route.split('/').length - 1);
  const cards = x.groups[lang].map(([h2, keys]) => `  <div class="card"><h2 class="card-title">${h2}</h2>${topicList(lang, up, keys)}</div>`);
  const main = `  <h1>${x.h1[lang]}</h1>
  <p class="updated">${t.updated} <time datetime="${DATE}">${t.updatedLong}</time></p>
  <p class="lead">${x.lead[lang]}</p>
  <div class="prose">
${cards.join('\n')}
  <div class="card"><h2 class="card-title">${x.sparenTitle[lang]}</h2>${x.sparen[lang](up)}</div>
  <div class="card"><h2 class="card-title">${x.glossTitle[lang]}</h2>${x.gloss[lang](up)}</div>
  ${actions(x.cta[lang], lang, up)}
  ${sourcesCard(x.sources, lang)}
  </div>`;
  return shell({ lang, route, other: lang === 'nl' ? fr : nl, title: x.title[lang], desc: x.desc[lang], crumbs: `<a href="${up}${lang}/">${t.crumbHome}</a> › ${t.section}`, main });
}

function renderTopic(page, lang) {
  const t = T[lang];
  const [nl, fr] = R[page.key];
  const route = lang === 'nl' ? nl : fr;
  const up = '../'.repeat(route.split('/').length - 1);
  const indexRoute = R.index[lang === 'nl' ? 0 : 1];
  const toc = page.sections.map((s, i) => `<li><a href="#s${i + 1}">${s.h2[lang]}</a></li>`).join('') + `<li><a href="#faq">${t.faq}</a></li>`;
  const cards = page.sections.map((s, i) => `  <div class="card" id="s${i + 1}"><h2 class="card-title">${s.h2[lang]}</h2>
${s.body[lang].trim().split('\n').map(l => '  ' + l).join('\n')}
  </div>`);
  const others = ['wettelijk', 'inhoudingen', 'belasting'].filter(k => k !== page.key);
  const more = `<ul class="link-list"><li><a href="${up}${indexRoute}">${NAV[lang].index}</a><span>${t.overview}</span></li>${others.map(k =>
    `<li><a href="${up}${R[k][lang === 'nl' ? 0 : 1]}">${NAV[lang][k]}</a><span>${SUB[lang][k]}</span></li>`).join('')}<li><a href="${up}${PENDING[lang]}" data-pending-link>${INDEX.sparenTitle[lang]}</a><span>${lang === 'nl' ? 'De 3e pijler, in een eigen sectie' : 'Le 3e pilier, dans sa propre section'}</span></li></ul>`;
  const terms = page.terms[lang].map(([h, l]) => `<a href="${up}${lang}/${h}">${l}</a>`).join(' · ');
  const main = `  <h1>${page.h1[lang]}</h1>
  <p class="updated">${t.updated} <time datetime="${DATE}">${t.updatedLong}</time></p>
  <p class="summary-box slash">${page.summary[lang]}</p>
  <div class="callout neutral"><p class="callout-title">${page.callout[lang][0]}</p><p>${page.callout[lang][1]}</p></div>
  <div class="prose">
  <p class="lead">${page.lead[lang]}</p>
  <nav class="toc" aria-labelledby="toc-title"><p class="toc-title" id="toc-title">${t.toc}</p><ol>${toc}</ol></nav>
${cards.join('\n')}
  ${actions(page.cta[lang], lang, up)}
  <div class="card faq" id="faq"><h2 class="card-title">${t.faq}</h2>${page.faq[lang].map(([q, a]) => `<details><summary>${q}</summary><p>${a}</p></details>`).join('')}</div>
  <div class="card"><h2 class="card-title">${t.more}</h2>${more}</div>
  <div class="card"><h2 class="card-title">${t.terms}</h2><p>${terms}</p></div>
  ${sourcesCard(page.sources, lang)}
  </div>`;
  const crumbs = `<a href="${up}${lang}/">${t.crumbHome}</a> › <a href="${up}${indexRoute}">${t.section}</a> › ${NAV[lang][page.key]}`;
  return shell({ lang, route, other: lang === 'nl' ? fr : nl, title: page.title[lang], desc: page.desc[lang], crumbs, main });
}

const pages = {};
for (const lang of ['nl', 'fr']) {
  pages[R.index[lang === 'nl' ? 0 : 1]] = renderIndex(lang);
  for (const page of PAGES) pages[R[page.key][lang === 'nl' ? 0 : 1]] = renderTopic(page, lang);
}
for (const route of Object.keys(pages)) pages[route] = applyHead(pages[route], route);

if (process.argv[1] && path.resolve(process.argv[1]) === path.resolve(new URL(import.meta.url).pathname)) {
  if (process.argv.includes('--check')) {
    const stale = [];
    for (const [route, html] of Object.entries(pages))
      if (await readFile(path.join(WEB, route, 'index.html'), 'utf8').catch(() => '') !== html) stale.push(route);
    if (stale.length) { console.error('Stale pension pages: ' + stale.join(', ') + '\nRun npm run build:pensioenen'); process.exit(1); }
    console.log('Pension pages are up to date.');
  } else {
    for (const [route, html] of Object.entries(pages)) {
      const file = path.join(WEB, route, 'index.html');
      await mkdir(path.dirname(file), { recursive: true });
      await writeFile(file, html);
    }
    console.log(`Wrote ${Object.keys(pages).length} pension pages.`);
  }
}
