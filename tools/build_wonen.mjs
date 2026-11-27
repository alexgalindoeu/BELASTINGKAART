// Generator for the housing section (web/nl/wonen/, web/fr/logement/), Flanders only.
// Same template as Mapafiscal's web/vivienda/ (index + topic pages), with Belgian content
// taken only from official pages consulted on 25-11-2026 (docs/sources/wonen_2026-11-25.md).
//   node tools/build_wonen.mjs           write the pages (head block included)
//   node tools/build_wonen.mjs --check   exit 1 if a page differs from this generator
import { writeFile, readFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { SITE, WEB } from './lib/pages.mjs';
import { fillFigures } from './lib/figures.mjs';
import { applyHead } from './lib/head.mjs';
import { navHtml, footerHtml, finalizePage } from './lib/shell.mjs';
export { S as SOURCES, R as ROUTES };
const DATE = '2026-11-25';
const VL = 'https://www.vlaanderen.be/belastingen-en-begroting/vlaamse-belastingen';

// Official sources consulted on 25-11-2026 (see docs/sources/wonen_2026-11-25.md).
const S = {
  gwb: { url: 'https://www.vlaanderen.be/geintegreerde-woonbonus', nl: 'Geïntegreerde woonbonus', fr: 'Geïntegreerde woonbonus (bonus logement intégré, en néerlandais)', org: 'Vlaamse overheid' },
  wbfaq: { url: 'https://www.vlaanderen.be/departement-financien-en-begroting/facts-figures/personenbelasting/woonbonus', nl: 'Woonbonus: veelgestelde vragen over het uitdoven', fr: 'Woonbonus : questions fréquentes sur l’extinction (en néerlandais)', org: 'Departement Financiën en Begroting' },
  wb: { url: 'https://www.vlaanderen.be/belastingvermindering-voor-de-enige-en-eigen-woning-woonbonus', nl: 'Belastingvermindering voor de enige en eigen woning (woonbonus)', fr: 'Belastingvermindering voor de enige en eigen woning (woonbonus, en néerlandais)', org: 'Vlaamse overheid' },
  reg: { url: `${VL}/registratiebelasting`, nl: 'Registratiebelasting', fr: 'Registratiebelasting (droits d’enregistrement, en néerlandais)', org: 'Vlaamse Belastingdienst' },
  vkr: { url: `${VL}/registratiebelasting/verkooprecht`, nl: 'Verkooprecht', fr: 'Verkooprecht (droit de vente, en néerlandais)', org: 'Vlaamse Belastingdienst' },
  waar: { url: `${VL}/registratiebelasting/verkooprecht/wanneer-en-waar-is-het-verkooprecht-verschuldigd`, nl: 'Wanneer en waar is het verkooprecht verschuldigd?', fr: 'Wanneer en waar is het verkooprecht verschuldigd? (en néerlandais)', org: 'Vlaamse Belastingdienst' },
  enig: { url: `${VL}/registratiebelasting/verkooprecht/tarieven-in-het-verkooprecht/verlaagd-tarief-in-het-verkooprecht-voor-de-aankoop-van-de-enige-eigen-woning`, nl: 'Verlaagd tarief in het verkooprecht voor de aankoop van de enige eigen woning', fr: 'Verlaagd tarief … enige eigen woning (taux réduit pour l’habitation propre et unique, en néerlandais)', org: 'Vlaamse Belastingdienst' },
  alg: { url: `${VL}/registratiebelasting/verkooprecht/tarieven-in-het-verkooprecht/algemeen-tarief-in-het-verkooprecht`, nl: 'Algemeen tarief in het verkooprecht', fr: 'Algemeen tarief in het verkooprecht (taux général, en néerlandais)', org: 'Vlaamse Belastingdienst' },
  sp: { url: 'https://www.vlaanderen.be/vlaamse-belastingdienst/sp26021', nl: 'SP 26021 – Inwerkingtreding tarief {{announced:wonen.announced_reduced_rate_2027|pct}}% enige eigen woning 2027', fr: 'SP 26021 – Inwerkingtreding tarief {{announced:wonen.announced_reduced_rate_2027|pct}}% enige eigen woning 2027 (en néerlandais)', org: 'Vlaamse Belastingdienst' },
  btw: { url: 'https://www.vlaanderen.be/bouwen-wonen-en-energie/kopen-en-verkopen/betaal-ik-btw-of-registratierechten-bij-aankoop-van-een-woning-of-bouwgrond', nl: 'Betaal ik btw of registratierechten bij aankoop van een woning of bouwgrond?', fr: 'Betaal ik btw of registratierechten …? (TVA ou droits d’enregistrement, en néerlandais)', org: 'Vlaamse overheid' },
  ov: { url: `${VL}/onroerende-voorheffing`, nl: 'Onroerende voorheffing', fr: 'Onroerende voorheffing (en néerlandais)', org: 'Vlaamse Belastingdienst' },
  ovfr: { url: 'https://www.vlaanderen.be/fr/demenager-et-se-loger/precompte-immobilier', nl: 'Précompte immobilier (Franstalige pagina)', fr: 'Précompte immobilier', org: 'Vlaamse overheid' },
  ovwie: { url: `${VL}/onroerende-voorheffing/wie-moet-de-onroerende-voorheffing-betalen`, nl: 'Wie moet de onroerende voorheffing betalen?', fr: 'Wie moet de onroerende voorheffing betalen? (qui paie, en néerlandais)', org: 'Vlaamse Belastingdienst' },
  ovber: { url: `${VL}/onroerende-voorheffing/berekening-van-de-onroerende-voorheffing`, nl: 'Berekening van de onroerende voorheffing', fr: 'Berekening van de onroerende voorheffing (calcul, en néerlandais)', org: 'Vlaamse Belastingdienst' },
  ovbet: { url: `${VL}/onroerende-voorheffing/betaling-van-de-onroerende-voorheffing`, nl: 'Betaling van de onroerende voorheffing', fr: 'Betaling van de onroerende voorheffing (paiement, en néerlandais)', org: 'Vlaamse Belastingdienst' },
  ki: { url: 'https://www.vlaanderen.be/bouwen-wonen-en-energie/kopen-en-verkopen/het-kadastraal-inkomen', nl: 'Het kadastraal inkomen', fr: 'Het kadastraal inkomen (revenu cadastral, en néerlandais)', org: 'Vlaamse overheid' },
  vlabel: { url: 'https://www.vlaanderen.be/vlaamse-belastingdienst/mijn-vlabel', nl: 'MijnVlabel', fr: 'MijnVlabel (en néerlandais)', org: 'Vlaamse Belastingdienst' },
  mbp: { url: 'https://www.vlaanderen.be/uw-overheid/mijn-burgerprofiel', nl: 'Mijn Burgerprofiel', fr: 'Mijn Burgerprofiel (en néerlandais)', org: 'Vlaamse overheid' }
};

const a = (key, label) => `<a href="${S[key].url}" rel="noopener">${label}</a>`;

const T = {
  nl: {
    skip: 'Naar de inhoud', home: 'Belastingkaart, startpagina', sections: 'Secties',
    theme: 'aria-label="Thema: automatisch (zoals het systeem). Wijzigen naar licht" title="Thema: automatisch (zoals het systeem)"',
    switchLabel: 'FR – Version française', cta: 'Naar de simulator', crumbHome: 'Startpagina',
    updated: 'Bijgewerkt op', updatedLong: '25 november 2026',
    footerIntro: '<b>Belastingkaart</b> is een onafhankelijk informatieproject. Geen officiële overheidswebsite en geen fiscaal advies.', footerNav: 'Meer over Belastingkaart', langTitle: 'Taal',
    sourcesH2: 'Bronnen', consulted: 'geraadpleegd op 25-11-2026',
    sourcesNote: 'Alleen officiële pagina’s van de Vlaamse overheid, alle geraadpleegd op 25 november 2026. De volledige lijst met citaten staat in ons bronnenregister.',
    faqH2: 'Veelgestelde vragen', more: 'In deze sectie'
  },
  fr: {
    skip: 'Aller au contenu', home: 'Belastingkaart, accueil', sections: 'Sections',
    theme: 'aria-label="Thème : automatique (comme le système). Passer en mode clair" title="Thème : automatique (comme le système)"',
    switchLabel: 'NL – Nederlandse versie', cta: 'Vers le simulateur', crumbHome: 'Accueil',
    updated: 'Mis à jour le', updatedLong: '25 novembre 2026',
    footerIntro: '<b>Belastingkaart</b> est un projet d’information indépendant. Ce n’est pas un site officiel des pouvoirs publics ni un conseil fiscal.', footerNav: 'En savoir plus sur Belastingkaart', langTitle: 'Langue',
    sourcesH2: 'Sources', consulted: 'consulté le 25-11-2026',
    sourcesNote: 'Uniquement des pages officielles de l’Autorité flamande, toutes consultées le 25 novembre 2026. La plupart n’existent qu’en néerlandais&nbsp;; les termes néerlandais officiels sont indiqués entre parenthèses. La liste complète des citations figure dans notre registre des sources.',
    faqH2: 'Questions fréquentes', more: 'Dans cette section'
  }
};

const BRAND = '<svg class="brand-icon" viewBox="0 -2 102 86" aria-hidden="true" focusable="false"><path class="p" fill-rule="evenodd" d="M16,4H62L77,18V28L68,37L84,52V66L70,80H2Z M28,16L25,33H57L62,28V21L57,16Z M23,47L19,68H64L70,62V54L63,47Z"/><polygon class="p2" points="46,80 60,80 99,30 91,18"/></svg>';
const THEME = '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><circle cx="12" cy="12" r="8"/><path class="fill" d="M12 4a8 8 0 0 1 0 16z"/></svg>';

// ---- routes -------------------------------------------------------------------------------
const R = {
  index: ['nl/wonen/', 'fr/logement/'],
  reg: ['nl/wonen/registratiebelasting/', 'fr/logement/droits-d-enregistrement/'],
  wb: ['nl/wonen/woonbonus/', 'fr/logement/bonus-logement/'],
  ov: ['nl/wonen/onroerende-voorheffing/', 'fr/logement/precompte-immobilier/'],
  check: ['nl/wonen/nakijken/', 'fr/logement/verifier/']
};
const NAV = {
  nl: { index: 'Wonen in Vlaanderen', reg: 'Registratiebelasting bij aankoop', wb: 'Woonbonus en nieuwe leningen', ov: 'Kadastraal inkomen en onroerende voorheffing', check: 'Uw situatie nakijken' },
  fr: { index: 'Logement en Flandre', reg: 'Droits d’enregistrement à l’achat', wb: 'Bonus logement et nouveaux prêts', ov: 'Revenu cadastral et précompte immobilier', check: 'Vérifier votre situation' }
};
const SUB = {
  nl: { reg: 'Verkooprecht, verlaagd tarief, btw bij nieuwbouw', wb: 'Geen Vlaamse woonbonus voor leningen vanaf 2020', ov: 'Wat ze zijn en wie ze vaststelt en int', check: 'MijnVlabel, MyMinfin en Mijn Burgerprofiel' },
  fr: { reg: 'Droit de vente, taux réduit, TVA pour le neuf', wb: 'Pas de bonus logement flamand pour les prêts depuis 2020', ov: 'Ce qu’ils sont, qui les fixe et qui les perçoit', check: 'MijnVlabel, MyMinfin et Mijn Burgerprofiel' }
};

function sectionLinks(lang, from, exclude) {
  const up = '../'.repeat(from.split('/').length - 1);
  return `<ul class="link-list">\n${['reg', 'wb', 'ov', 'check'].filter(k => k !== exclude).map(k =>
    `<li><a href="${up}${R[k][lang === 'nl' ? 0 : 1]}">${NAV[lang][k]}</a><span>${SUB[lang][k]}</span></li>`).join('\n')}\n</ul>`;
}

// ---- content ------------------------------------------------------------------------------
// Each page: { key, title{nl,fr}, desc{nl,fr}, eyebrow, h1, lead, summary, sections:[{h2, body}], faq:[[q,a]], sources:[keys] }
const PAGES = [];

PAGES.push({
  key: 'index',
  title: { nl: 'Woonfiscaliteit in Vlaanderen | Belastingkaart', fr: 'Fiscalité du logement en Flandre | Belastingkaart' },
  desc: {
    nl: 'Welke belastingen gelden voor uw woning in Vlaanderen: registratiebelasting bij aankoop, jaarlijkse onroerende voorheffing en het einde van de woonbonus.',
    fr: 'Quels impôts touchent votre logement en Flandre : droits d’enregistrement à l’achat, précompte immobilier et fin du bonus logement pour les nouveaux prêts.'
  },
  eyebrow: { nl: 'Wonen', fr: 'Logement' },
  h1: { nl: 'Woonfiscaliteit in Vlaanderen: kopen, lenen en bezitten', fr: 'Fiscalité du logement en Flandre : acheter, emprunter, posséder' },
  lead: {
    nl: 'Een woning in Vlaanderen komt op drie momenten met belastingen in aanraking: wanneer u ze koopt, wanneer u er een hypothecaire lening voor afsluit en elk jaar dat u ze bezit. Deze pagina zet de regels per moment op een rij en verwijst naar een gids per onderwerp.',
    fr: 'Un logement situé en Flandre rencontre l’impôt à trois moments : quand vous l’achetez, quand vous contractez un prêt hypothécaire pour le financer et chaque année où vous en êtes propriétaire. Cette page reprend les règles moment par moment et renvoie vers un guide par sujet.'
  },
  summary: {
    nl: '<b>Kort:</b> bij de aankoop van een bestaande woning betaalt u verkooprecht (registratiebelasting), bij nieuwbouw btw; voor hypothecaire leningen aangegaan na 31 december 2019 bestaat geen Vlaamse woonbonus meer; en elk jaar betaalt de eigenaar onroerende voorheffing op basis van het kadastraal inkomen.',
    fr: '<b>En bref :</b> à l’achat d’un logement existant, vous payez le droit de vente (droits d’enregistrement), pour un logement neuf la TVA ; il n’existe plus de bonus logement flamand pour les prêts hypothécaires contractés après le 31 décembre 2019 ; et chaque année, le propriétaire paie le précompte immobilier calculé sur le revenu cadastral.'
  },
  sections: [
    {
      cls: 'card-table', h2: { nl: 'Welke belasting op welk moment', fr: 'Quel impôt à quel moment' },
      body: {
        nl: `<div class="table-scroll"><table class="data-table">
<thead><tr><th scope="col">Moment</th><th scope="col">Belasting of voordeel</th><th scope="col">Wie stelt vast of int</th><th scope="col">Officiële bron</th><th scope="col">Gids</th></tr></thead>
<tbody>
<tr><td>Aankoop van een bestaande woning</td><td>Verkooprecht (registratiebelasting), met een verlaagd tarief voor de enige eigen woning</td><td>Vlaamse Belastingdienst; de notaris past het tarief toe in de akte</td><td>${a('enig', 'Verlaagd tarief enige eigen woning')}</td><td><a href="registratiebelasting/">Registratiebelasting</a></td></tr>
<tr><td>Aankoop van een nieuwe woning</td><td>Btw in plaats van verkooprecht</td><td>FOD Financiën</td><td>${a('btw', 'Btw of registratierechten?')}</td><td><a href="registratiebelasting/">Registratiebelasting</a></td></tr>
<tr><td>Hypothecaire lening</td><td>Geïntegreerde woonbonus alleen voor leningen van 2016 tot en met 2019; daarna geen Vlaamse belastingvermindering meer</td><td>Aangifte personenbelasting; de FOD Financiën beoordeelt de voorwaarden</td><td>${a('gwb', 'Geïntegreerde woonbonus')}</td><td><a href="woonbonus/">Woonbonus</a></td></tr>
<tr><td>Elk jaar dat u eigenaar bent</td><td>Onroerende voorheffing op het geïndexeerde kadastraal inkomen</td><td>Kadaster (FOD Financiën) stelt het KI vast; de Vlaamse Belastingdienst berekent en int de voorheffing</td><td>${a('ovber', 'Berekening onroerende voorheffing')}</td><td><a href="onroerende-voorheffing/">Onroerende voorheffing</a></td></tr>
</tbody></table></div>
<p class="help">Overzicht op basis van de officiële pagina’s in de bronnenlijst onderaan. Belastingkaart berekent geen persoonlijke bedragen.</p>`,
        fr: `<div class="table-scroll"><table class="data-table">
<thead><tr><th scope="col">Moment</th><th scope="col">Impôt ou avantage</th><th scope="col">Qui fixe ou perçoit</th><th scope="col">Source officielle</th><th scope="col">Guide</th></tr></thead>
<tbody>
<tr><td>Achat d’un logement existant</td><td>Droit de vente (droits d’enregistrement), avec un taux réduit pour l’habitation propre et unique</td><td>Vlaamse Belastingdienst ; le notaire applique le taux dans l’acte</td><td>${a('enig', 'Verlaagd tarief enige eigen woning')} (nl)</td><td><a href="droits-d-enregistrement/">Droits d’enregistrement</a></td></tr>
<tr><td>Achat d’un logement neuf</td><td>TVA au lieu du droit de vente</td><td>SPF Finances</td><td>${a('btw', 'Btw of registratierechten?')} (nl)</td><td><a href="droits-d-enregistrement/">Droits d’enregistrement</a></td></tr>
<tr><td>Prêt hypothécaire</td><td>Bonus logement intégré uniquement pour les prêts de 2016 à 2019 inclus ; ensuite plus de réduction d’impôt flamande</td><td>Déclaration à l’impôt des personnes physiques ; le SPF Finances apprécie les conditions</td><td>${a('gwb', 'Geïntegreerde woonbonus')} (nl)</td><td><a href="bonus-logement/">Bonus logement</a></td></tr>
<tr><td>Chaque année de propriété</td><td>Précompte immobilier sur le revenu cadastral indexé</td><td>Le Cadastre (SPF Finances) fixe le RC ; le Vlaamse Belastingdienst calcule et perçoit le précompte</td><td>${a('ovfr', 'Précompte immobilier')}</td><td><a href="precompte-immobilier/">Précompte immobilier</a></td></tr>
</tbody></table></div>
<p class="help">Synthèse établie à partir des pages officielles de la liste des sources en bas de page. Belastingkaart ne calcule aucun montant personnel.</p>`
      }
    },
    {
      step: 1, h2: { nl: 'Wanneer u een woning koopt', fr: 'Quand vous achetez un logement' },
      body: {
        nl: `<p>Wie in Vlaanderen een woning, een appartement of een bouwgrond koopt, betaalt op de aankoopsom het verkooprecht, een van de vier soorten registratiebelasting. Voor de aankoop van de enige eigen woning bestaat een verlaagd tarief, onder strikte voorwaarden. Een nieuwe woning wordt niet met verkooprecht maar met btw belast.</p>
<p class="engine-fact"><a href="registratiebelasting/">Gids: registratiebelasting bij de aankoop van een woning</a></p>`,
        fr: `<p>Qui achète en Flandre une maison, un appartement ou un terrain à bâtir paie sur le prix d’achat le droit de vente, l’une des quatre formes de droits d’enregistrement. Un taux réduit existe pour l’achat de l’habitation propre et unique, à des conditions strictes. Un logement neuf n’est pas soumis au droit de vente mais à la TVA.</p>
<p class="engine-fact"><a href="droits-d-enregistrement/">Guide : droits d’enregistrement à l’achat d’un logement</a></p>`
      }
    },
    {
      step: 2, h2: { nl: 'Wanneer u ervoor leent', fr: 'Quand vous empruntez pour l’acheter' },
      body: {
        nl: `<p>De Vlaamse Regering heeft de geïntegreerde woonbonus vanaf 1 januari 2020 laten uitdoven. Nieuwe hypothecaire leningen geven sindsdien geen recht meer op een Vlaamse belastingvermindering. Wie de leningsakte uiterlijk op 31 december 2019 bij de notaris tekende, behoudt de woonbonus zolang aan de voorwaarden is voldaan.</p>
<p class="engine-fact"><a href="woonbonus/">Gids: wat er met de woonbonus gebeurde</a></p>`,
        fr: `<p>Le Gouvernement flamand a mis fin au bonus logement intégré à partir du 1er janvier 2020. Depuis lors, les nouveaux prêts hypothécaires ne donnent plus droit à une réduction d’impôt flamande. Qui a signé l’acte de prêt chez le notaire au plus tard le 31 décembre 2019 conserve le bonus logement tant que les conditions restent remplies.</p>
<p class="engine-fact"><a href="bonus-logement/">Guide : ce qu’il est advenu du bonus logement</a></p>`
      }
    },
    {
      step: 3, h2: { nl: 'Elk jaar dat u eigenaar bent', fr: 'Chaque année où vous êtes propriétaire' },
      body: {
        nl: `<p>Het kadastraal inkomen (KI) is geen echt inkomen maar een fictief huurinkomen dat het Kadaster van de FOD Financiën aan elk onroerend goed toekent. Op het jaarlijks geïndexeerde KI berekent de Vlaamse Belastingdienst de onroerende voorheffing, aangevuld met opcentiemen die de provincie en de gemeente zelf vastleggen.</p>
<p class="engine-fact"><a href="onroerende-voorheffing/">Gids: kadastraal inkomen en onroerende voorheffing</a></p>`,
        fr: `<p>Le revenu cadastral (RC) n’est pas un revenu réel mais un revenu locatif fictif que le Cadastre du SPF Finances attribue à chaque bien immobilier. Sur le RC indexé chaque année, le Vlaamse Belastingdienst calcule le précompte immobilier, complété par des centimes additionnels que la province et la commune fixent elles-mêmes.</p>
<p class="engine-fact"><a href="precompte-immobilier/">Guide : revenu cadastral et précompte immobilier</a></p>`
      }
    },
    {
      step: 4, h2: { nl: 'Uw eigen gegevens nakijken', fr: 'Consulter vos propres données' },
      body: {
        nl: `<p>Uw aanslagbiljetten voor onroerende voorheffing en registratiebelasting vindt u in MijnVlabel, het digitale loket van de Vlaamse Belastingdienst. De gegevens van uw onroerende goederen kunt u ook opvragen in MyMinfin van de FOD Financiën.</p>
<p class="engine-fact"><a href="nakijken/">Gids: waar u uw situatie nakijkt</a></p>`,
        fr: `<p>Vos avertissements-extraits de rôle du précompte immobilier et des droits d’enregistrement se trouvent dans MijnVlabel, le guichet numérique du Vlaamse Belastingdienst. Les données de vos biens immobiliers peuvent aussi être consultées dans MyMinfin, du SPF Finances.</p>
<p class="engine-fact"><a href="verifier/">Guide : où vérifier votre situation</a></p>`
      }
    },
    {
      h2: { nl: 'In deze sectie', fr: 'Dans cette section' },
      body: {
        nl: `%LINKS%
<p class="help">Deze pagina’s behandelen alleen woningen in het Vlaams Gewest. Het verkooprecht is verschuldigd in het Gewest waar het verkochte goed ligt, en de Vlaamse Belastingdienst is enkel bevoegd voor registratiebelasting die in het Vlaams Gewest gelokaliseerd is. Voor woningen in het Brussels Hoofdstedelijk Gewest of het Waals Gewest gelden de regels van die Gewesten; die staan niet op deze pagina’s.</p>
<p class="cite">Officiële bronnen: ${a('vkr', 'Verkooprecht')}, ${a('gwb', 'Geïntegreerde woonbonus')} en ${a('ov', 'Onroerende voorheffing')} (Vlaamse overheid). Volledige lijst onderaan.</p>`,
        fr: `%LINKS%
<p class="help">Ces pages traitent uniquement des logements situés en Région flamande. Le droit de vente est dû dans la Région où se trouve le bien vendu, et le Vlaamse Belastingdienst n’est compétent que pour les droits d’enregistrement localisés en Région flamande. Pour un logement en Région de Bruxelles-Capitale ou en Région wallonne, ce sont les règles de ces Régions qui s’appliquent ; elles ne figurent pas sur ces pages.</p>
<p class="cite">Sources officielles : ${a('vkr', 'Verkooprecht')} (nl), ${a('gwb', 'Geïntegreerde woonbonus')} (nl) et ${a('ovfr', 'Précompte immobilier')} (Autorité flamande). Liste complète en bas de page.</p>`
      }
    }
  ],
  faq: {
    nl: [
      ['Krijg ik nog woonbonus voor een lening die ik nu afsluit?', 'Nee. De geïntegreerde woonbonus wordt niet langer toegekend voor hypothecaire leningen die zijn aangegaan na 31 december 2019. Bepalend is de datum van de authentieke leningsakte, niet die van de koopovereenkomst.'],
      ['Wie int de onroerende voorheffing in Vlaanderen?', 'De Vlaamse Belastingdienst. Die berekent ze op basis van het geïndexeerde kadastraal inkomen; de provincie en de gemeente bepalen zelf hun opcentiemen.'],
      ['Betaal ik verkooprecht als ik een nieuwbouwwoning koop?', 'Nee, op de aankoop van een nieuwe woning betaalt u btw. Een woning geldt als nieuw tot en met 31 december van het tweede jaar na het jaar van de eerste ingebruikname.']
    ],
    fr: [
      ['Ai-je encore droit au bonus logement pour un prêt conclu aujourd’hui ?', 'Non. Le bonus logement intégré n’est plus accordé pour les prêts hypothécaires contractés après le 31 décembre 2019. C’est la date de l’acte authentique de prêt qui compte, pas celle du compromis de vente.'],
      ['Qui perçoit le précompte immobilier en Flandre ?', 'Le Vlaamse Belastingdienst (Service flamand des impôts). Il le calcule sur la base du revenu cadastral indexé ; la province et la commune fixent elles-mêmes leurs centimes additionnels.'],
      ['Dois-je payer le droit de vente si j’achète un logement neuf ?', 'Non, l’achat d’un logement neuf est soumis à la TVA. Un logement est considéré comme neuf jusqu’au 31 décembre de la deuxième année qui suit l’année de sa première occupation.']
    ]
  },
  sources: ['vkr', 'reg', 'waar', 'enig', 'btw', 'gwb', 'wbfaq', 'ov', 'ovfr', 'ovber', 'ki', 'vlabel']
});

PAGES.push({
  key: 'reg',
  title: { nl: 'Registratiebelasting woning Vlaanderen | Belastingkaart', fr: 'Droits d’enregistrement en Flandre : achat | Belastingkaart' },
  desc: {
    nl: 'Verkooprecht bij aankoop van een woning in Vlaanderen: verlaagd tarief voor de enige eigen woning, voorwaarden sinds 2026, algemeen tarief en btw bij nieuwbouw.',
    fr: 'Droit de vente à l’achat d’un logement en Flandre : taux réduit pour l’habitation propre et unique, conditions depuis 2026, taux général et TVA pour le neuf.'
  },
  eyebrow: { nl: 'Wonen · kopen', fr: 'Logement · acheter' },
  h1: { nl: 'Registratiebelasting bij de aankoop van een woning in Vlaanderen', fr: 'Droits d’enregistrement à l’achat d’un logement en Flandre' },
  lead: {
    nl: 'Bij de aankoop van een woning, een appartement of een bouwgrond in Vlaanderen betaalt u verkooprecht op de aankoopsom. Hoeveel hangt af van wat u koopt en of het uw enige eigen woning wordt.',
    fr: 'À l’achat d’une maison, d’un appartement ou d’un terrain à bâtir en Flandre, vous payez le droit de vente sur le prix d’achat. Le taux dépend de ce que vous achetez et du fait qu’il s’agit ou non de votre habitation propre et unique.'
  },
  summary: {
    nl: '<b>Kort:</b> voor authentieke aankoopaktes vanaf 1 januari 2025 bedraagt het verlaagd tarief voor de enige eigen woning {{wonen.reduced_rate_only_own_home.from_2025|pct}}%. Het algemeen tarief bedraagt sinds 1 januari 2022 {{wonen.general_rate.from_2022|pct}}%. Op een nieuwe woning betaalt u btw in plaats van verkooprecht.',
    fr: '<b>En bref :</b> pour les actes authentiques d’achat passés à partir du 1er janvier 2025, le taux réduit pour l’habitation propre et unique est de {{wonen.reduced_rate_only_own_home.from_2025|pct}} %. Le taux général est de {{wonen.general_rate.from_2022|pct}} % depuis le 1er janvier 2022. Un logement neuf est soumis à la TVA au lieu du droit de vente.'
  },
  sections: [
    {
      h2: { nl: 'Wat is registratiebelasting?', fr: 'Que sont les droits d’enregistrement ?' },
      body: {
        nl: `<p>Registratiebelasting is verschuldigd bij de registratie van een akte of een geschrift, zoals bij de aankoop van een woning. Er bestaan vier soorten: het verkooprecht, de schenkbelasting, het verdeelrecht en het recht op hypotheekvestiging. Bij een aankoop gaat het om het verkooprecht.</p>
<p>Het verkooprecht is verschuldigd vanaf het ogenblik dat een (mondelinge) verkoopovereenkomst gesloten is; om de heffing mogelijk te maken, moet de akte geregistreerd worden. De kopers betalen de registratiebelasting.</p>
<p>Het verkooprecht is verschuldigd in het Gewest waar het verkochte goed ligt. De Vlaamse Belastingdienst is enkel bevoegd voor de registratiebelasting die in het Vlaams Gewest gelokaliseerd is.</p>`,
        fr: `<p>Les droits d’enregistrement (registratiebelasting) sont dus lors de l’enregistrement d’un acte ou d’un écrit, par exemple à l’achat d’un logement. Il en existe quatre formes : le droit de vente (verkooprecht), le droit de donation (schenkbelasting), le droit de partage (verdeelrecht) et le droit d’hypothèque (recht op hypotheekvestiging). Pour un achat, il s’agit du droit de vente.</p>
<p>Le droit de vente est dû dès la conclusion d’une convention de vente, même verbale ; pour permettre sa perception, l’acte doit être enregistré. Ce sont les acheteurs qui paient les droits d’enregistrement.</p>
<p>Le droit de vente est dû dans la Région où se trouve le bien vendu. Le Vlaamse Belastingdienst n’est compétent que pour les droits d’enregistrement localisés en Région flamande.</p>`
      }
    },
    {
      h2: { nl: 'Het verlaagd tarief voor de enige eigen woning', fr: 'Le taux réduit pour l’habitation propre et unique' },
      body: {
        nl: `<p>Volgens de Vlaamse Belastingdienst betaalt u vanaf 1 januari 2025 op de aankoop van een enige eigen woning nog maar {{wonen.reduced_rate_only_own_home.from_2025|pct}}% registratiebelasting. Dit tarief geldt voor authentieke aankoopaktes die vanaf 1 januari 2025 verleden worden. Van 1 januari 2022 tot en met 31 december 2024 bedroeg het verlaagd tarief {{wonen.reduced_rate_only_own_home.from_2022_to_2024|pct}}%.</p>
<p>Alle voorwaarden moeten vervuld zijn; bij een aankoop met meerdere kopers worden ze per koper beoordeeld. De belangrijkste:</p>
<ul>
<li>een zuivere aankoop: een verkoop tegen een prijs in geld, geen ruil;</li>
<li>de aankoop van de hele volle eigendom; voor verkoopovereenkomsten vanaf 1 januari 2026 zijn gesplitste aankopen van alleen vruchtgebruik of blote eigendom uitgesloten;</li>
<li>voor verkoopovereenkomsten vanaf 1 januari 2026: aankoop uitsluitend door natuurlijke personen; koopt een rechtspersoon mee, dan geldt voor niemand het verlaagd tarief;</li>
<li>het goed is een woning; bouwgronden zijn uitgesloten;</li>
<li>u bent geen volledige en volle eigenaar van een andere woning of bouwgrond, in België of in het buitenland;</li>
<li>u laat u binnen drie jaar na de notariële akte inschrijven op het adres van de woning; voor verkoopovereenkomsten vanaf 1 januari 2026 moet die inschrijving minstens één jaar ononderbroken behouden blijven.</li>
</ul>
<p>Bent u bij de aankoop nog eigenaar van een andere woning of bouwgrond, dan kan de tolerantie “causaal verband” gelden als u zich ertoe verbindt dat goed binnen de termijn te vervreemden. De notaris zorgt ervoor dat het juiste tarief in de akte wordt toegepast; het verlaagd tarief moet uitdrukkelijk gevraagd worden.</p>
<p>Blijkt achteraf dat een voorwaarde niet (tijdig) vervuld is, dan betaalt u het verschil met het normale tarief, met een belastingverhoging op die aanvullende rechten.</p>`,
        fr: `<p>Selon le Vlaamse Belastingdienst, à partir du 1er janvier 2025, vous ne payez plus que {{wonen.reduced_rate_only_own_home.from_2025|pct}} % de droits d’enregistrement sur l’achat d’une habitation propre et unique (enige eigen woning). Ce taux s’applique aux actes authentiques d’achat passés à partir du 1er janvier 2025. Du 1er janvier 2022 au 31 décembre 2024 inclus, le taux réduit était de {{wonen.reduced_rate_only_own_home.from_2022_to_2024|pct}} %.</p>
<p>Toutes les conditions doivent être remplies ; en cas d’achat par plusieurs acheteurs, elles sont appréciées par acheteur. Les principales :</p>
<ul>
<li>un achat pur : une vente contre un prix en argent, pas un échange ;</li>
<li>l’achat de la totalité de la pleine propriété ; pour les conventions de vente à partir du 1er janvier 2026, les achats scindés portant uniquement sur l’usufruit ou la nue-propriété sont exclus ;</li>
<li>pour les conventions de vente à partir du 1er janvier 2026 : achat exclusivement par des personnes physiques ; si une personne morale achète conjointement, aucun acheteur ne bénéficie du taux réduit ;</li>
<li>le bien est une habitation ; les terrains à bâtir sont exclus ;</li>
<li>vous n’êtes pas plein propriétaire de la totalité d’une autre habitation ou d’un autre terrain à bâtir, en Belgique ou à l’étranger ;</li>
<li>vous vous inscrivez à l’adresse du logement dans les trois ans qui suivent l’acte notarié ; pour les conventions de vente à partir du 1er janvier 2026, cette inscription doit être maintenue pendant au moins un an sans interruption.</li>
</ul>
<p>Si vous êtes encore propriétaire d’une autre habitation ou d’un terrain à bâtir au moment de l’achat, la tolérance du « lien causal » (causaal verband) peut s’appliquer si vous vous engagez à aliéner ce bien dans le délai prévu. Le notaire veille à ce que le bon taux soit appliqué dans l’acte ; le taux réduit doit être demandé expressément.</p>
<p>S’il apparaît ensuite qu’une condition n’est pas (ou pas à temps) remplie, vous payez la différence avec le taux normal, majorée d’un accroissement d’impôt sur ces droits complémentaires.</p>`
      }
    },
    {
      h2: { nl: 'Aangekondigde wijziging vanaf 2027', fr: 'Modification annoncée à partir de 2027' },
      body: {
        nl: `<p>In de Septemberverklaring heeft de Vlaamse Regering de intentie geuit om het verlaagd tarief voor de enige eigen woning vanaf 1 januari 2027 aan te passen naar {{announced:wonen.announced_reduced_rate_2027|pct}}%. De Vlaamse Belastingdienst licht de werkwijze toe in standpunt 26021 van 1 oktober 2026, onder voorbehoud dat de decreetgever geen afwijkende regeling uitwerkt.</p>
<p>Volgens dat standpunt is de datum van de verkoopovereenkomst doorslaggevend: onderhandse verkoopovereenkomsten gesloten vóór 1 januari 2027 kunnen nog in aanmerking komen voor het tarief van {{wonen.reduced_rate_only_own_home.from_2025|pct}}%. Een wederzijdse aankoop- en verkoopbelofte (gekruiste optie) is geen verkoopovereenkomst; dan telt de datum van de authentieke akte.</p>`,
        fr: `<p>Dans sa Déclaration de septembre (Septemberverklaring), le Gouvernement flamand a exprimé l’intention de porter le taux réduit pour l’habitation propre et unique à {{announced:wonen.announced_reduced_rate_2027|pct}} % à partir du 1er janvier 2027. Le Vlaamse Belastingdienst en précise les modalités dans sa position administrative 26021 du 1er octobre 2026, sous réserve que le législateur décrétal n’adopte pas une règle différente.</p>
<p>Selon cette position, c’est la date de la convention de vente qui est déterminante : les conventions de vente sous seing privé conclues avant le 1er janvier 2027 peuvent encore bénéficier du taux de {{wonen.reduced_rate_only_own_home.from_2025|pct}} %. Une promesse réciproque d’achat et de vente (option croisée) n’est pas une convention de vente ; c’est alors la date de l’acte authentique qui compte.</p>`
      }
    },
    {
      h2: { nl: 'Algemeen tarief en nieuwbouw', fr: 'Taux général et logement neuf' },
      body: {
        nl: `<p>Sinds 1 januari 2022 bedraagt het algemeen tarief in het verkooprecht, bijvoorbeeld bij de aankoop van een tweede verblijf, {{wonen.general_rate.from_2022|pct}} procent. Dat tarief geldt voor aankopen waarvoor de koopovereenkomst vanaf 2022 gesloten is. Voor onbebouwde landbouwgronden en natuurgoederen met een beheerplan type 2 of type 3 blijft het tarief {{wonen.general_rate.agricultural_land_and_nature|pct}} procent.</p>
<p>Op de aankoop van een nieuwe woning betaalt u btw en geen verkooprecht. Een woning geldt als nieuw tot en met 31 december van het tweede jaar na het jaar van de eerste ingebruikname. Wie alleen een bouwgrond koopt, betaalt verkooprecht aan het algemeen tarief.</p>`,
        fr: `<p>Depuis le 1er janvier 2022, le taux général du droit de vente, par exemple pour l’achat d’une seconde résidence, est de {{wonen.general_rate.from_2022|pct}} pour cent. Ce taux s’applique aux achats dont le compromis est conclu à partir de 2022. Pour les terres agricoles non bâties et les biens naturels dotés d’un plan de gestion de type 2 ou de type 3, le taux reste de {{wonen.general_rate.agricultural_land_and_nature|pct}} pour cent.</p>
<p>L’achat d’un logement neuf est soumis à la TVA et non au droit de vente. Un logement est considéré comme neuf jusqu’au 31 décembre de la deuxième année qui suit l’année de sa première occupation. Qui achète uniquement un terrain à bâtir paie le droit de vente au taux général.</p>`
      }
    }
  ],
  faq: {
    nl: [
      ['Telt de datum van het compromis of die van de akte voor het tarief van {{wonen.reduced_rate_only_own_home.from_2025|pct}}%?', 'Voor de overgang van {{wonen.reduced_rate_only_own_home.from_2022_to_2024|pct}}% naar {{wonen.reduced_rate_only_own_home.from_2025|pct}}% telde de datum van de notariële akte: aktes verleden vanaf 1 januari 2025 krijgen {{wonen.reduced_rate_only_own_home.from_2025|pct}}%. Voor de aangekondigde overgang naar {{announced:wonen.announced_reduced_rate_2027|pct}}% in 2027 kijkt de Vlaamse Belastingdienst volgens standpunt 26021 naar de datum van de verkoopovereenkomst.'],
      ['Kan ik het verlaagd tarief achteraf nog krijgen?', 'Ja, het verlaagd tarief kan ook via een teruggave worden genoten, bijvoorbeeld als u een verhinderend onroerend goed binnen de gestelde termijn vervreemdt.']
    ],
    fr: [
      ['Est-ce la date du compromis ou celle de l’acte qui compte pour le taux de {{wonen.reduced_rate_only_own_home.from_2025|pct}} % ?', 'Pour le passage de {{wonen.reduced_rate_only_own_home.from_2022_to_2024|pct}} % à {{wonen.reduced_rate_only_own_home.from_2025|pct}} %, c’était la date de l’acte notarié : les actes passés à partir du 1er janvier 2025 bénéficient de {{wonen.reduced_rate_only_own_home.from_2025|pct}} %. Pour le passage annoncé à {{announced:wonen.announced_reduced_rate_2027|pct}} % en 2027, le Vlaamse Belastingdienst se fonde, selon la position 26021, sur la date de la convention de vente.'],
      ['Puis-je encore obtenir le taux réduit après coup ?', 'Oui, le taux réduit peut aussi être obtenu par voie de restitution (teruggave), par exemple si vous aliénez dans le délai prévu un bien immobilier qui y faisait obstacle.']
    ]
  },
  sources: ['reg', 'vkr', 'waar', 'enig', 'sp', 'alg', 'btw']
});

PAGES.push({
  key: 'wb',
  title: { nl: 'Woonbonus Vlaanderen: uitgedoofd sinds 2020 | Belastingkaart', fr: 'Bonus logement flamand après 2019 | Belastingkaart' },
  desc: {
    nl: 'Wat gebeurde er met de Vlaamse woonbonus? Geen belastingvermindering meer voor hypothecaire leningen na 2019, wel behoud voor bestaande leningen.',
    fr: 'Qu’est devenu le bonus logement flamand ? Plus de réduction d’impôt pour les prêts hypothécaires après 2019, maintien pour les prêts existants : explications.'
  },
  eyebrow: { nl: 'Wonen · lenen', fr: 'Logement · emprunter' },
  h1: { nl: 'Woonbonus: geen Vlaams belastingvoordeel meer voor nieuwe leningen', fr: 'Bonus logement : plus d’avantage fiscal flamand pour les nouveaux prêts' },
  lead: {
    nl: 'De woonbonus was een Vlaamse belastingvermindering voor de uitgaven van een hypothecaire lening voor de eigen woning. Voor leningen aangegaan na 31 december 2019 bestaat die niet meer. Bestaande leningen behouden hun regeling.',
    fr: 'Le bonus logement (woonbonus) était une réduction d’impôt flamande pour les dépenses liées à un prêt hypothécaire contracté pour l’habitation propre. Pour les prêts contractés après le 31 décembre 2019, il n’existe plus. Les prêts existants conservent leur régime.'
  },
  summary: {
    nl: '<b>Kort:</b> leningsakte getekend uiterlijk op 31 december 2019? Dan kunt u de woonbonus behouden zolang u aan de voorwaarden voldoet. Dateert de akte van later, dan is er geen Vlaamse belastingvermindering voor die lening.',
    fr: '<b>En bref :</b> acte de prêt signé au plus tard le 31 décembre 2019 ? Vous pouvez conserver le bonus logement tant que vous remplissez les conditions. Si l’acte est postérieur, ce prêt ne donne droit à aucune réduction d’impôt flamande.'
  },
  sections: [
    {
      h2: { nl: 'Wat was de woonbonus?', fr: 'Qu’était le bonus logement ?' },
      body: {
        nl: `<p>De woonbonus was een Vlaamse belastingvermindering voor de eigen woning: wie een hypothecaire lening afsloot voor de aankoop van een enige en eigen woning, kon gedurende de looptijd van de lening een belastingvermindering krijgen. Voor leningen vanaf 1 januari 2016 werden drie Vlaamse belastingverminderingen voor de eigen woning samengevoegd in de geïntegreerde woonbonus, voor zowel enige als niet-enige eigen woningen.</p>
<p>Volgens de Vlaamse overheid koos de Vlaamse Regering voor een tax shift van het hebben van een woning naar het verwerven ervan: sinds 1 januari 2020 komen nieuwe leningen niet meer in aanmerking voor de woonbonus en werd het tarief van de registratiebelasting verlaagd.</p>`,
        fr: `<p>Le bonus logement (woonbonus) était une réduction d’impôt flamande pour l’habitation propre : qui contractait un prêt hypothécaire pour acheter une habitation propre et unique pouvait obtenir une réduction d’impôt pendant la durée du prêt. Pour les prêts à partir du 1er janvier 2016, trois réductions d’impôt flamandes pour l’habitation propre ont été fusionnées dans le bonus logement intégré (geïntegreerde woonbonus), pour une habitation propre unique ou non unique.</p>
<p>Selon l’Autorité flamande, le Gouvernement flamand a opté pour un glissement fiscal (tax shift) de la possession d’un logement vers son acquisition : depuis le 1er janvier 2020, les nouveaux prêts ne donnent plus droit au bonus logement et le taux des droits d’enregistrement a été réduit.</p>`
      }
    },
    {
      h2: { nl: 'Welke datum telt?', fr: 'Quelle date compte ?' },
      body: {
        nl: `<p>Voor de woonbonus is de datum van de authentieke, bij de notaris getekende hypothecaire leningsakte bepalend. De datum van de koopovereenkomst (compromis) speelt geen rol.</p>
<ul>
<li>Wordt er geen authentieke leningsakte verleden, bijvoorbeeld bij een wederopname, dan geldt de datum van aanvaarding van het kredietaanbod.</li>
<li>Een <b>wederopname</b> is altijd een nieuwe, bijkomende lening: alleen als ze vóór 1 januari 2020 is aangegaan, valt ze onder de geïntegreerde woonbonus.</li>
<li>Een loutere <b>herfinanciering</b> zet de oorspronkelijke lening voort, ook bij een andere bank. Een bijkomend ontleend bedrag geldt als een nieuwe lening.</li>
<li>Een <b>looptijdverlenging</b> vanaf 1 januari 2020 wordt geneutraliseerd: betalingen buiten de looptijd zoals die gold op 31 december 2019 komen niet meer in aanmerking, behalve bij COVID-19-betalingsuitstel.</li>
</ul>
<p>Voor het verlaagd tarief van de registratiebelasting telt een andere datum: die van de koopakte, niet die van de lening.</p>`,
        fr: `<p>Pour le bonus logement, c’est la date de l’acte authentique de prêt hypothécaire, signé chez le notaire, qui est déterminante. La date du compromis de vente ne joue aucun rôle.</p>
<ul>
<li>S’il n’y a pas d’acte authentique de prêt, par exemple en cas de reprise d’encours (wederopname), c’est la date d’acceptation de l’offre de crédit qui vaut.</li>
<li>Une <b>reprise d’encours</b> est toujours un nouveau prêt supplémentaire : elle ne relève du bonus logement intégré que si elle a été contractée avant le 1er janvier 2020.</li>
<li>Un simple <b>refinancement</b> (herfinanciering) prolonge le prêt d’origine, même auprès d’une autre banque. Un montant supplémentaire emprunté est considéré comme un nouveau prêt.</li>
<li>Un <b>allongement de la durée</b> à partir du 1er janvier 2020 est neutralisé : les paiements effectués au-delà de la durée applicable au 31 décembre 2019 ne sont plus pris en compte, sauf en cas de report de paiement lié à la COVID-19.</li>
</ul>
<p>Pour le taux réduit des droits d’enregistrement, une autre date compte : celle de l’acte d’achat, pas celle du prêt.</p>`
      }
    },
    {
      h2: { nl: 'Als u de woonbonus nog geniet', fr: 'Si vous bénéficiez encore du bonus logement' },
      body: {
        nl: `<p>Voor bestaande leningen blijft de woonbonus behouden zolang u aan de voorwaarden voldoet. U vermeldt de betaalde interesten en kapitaalaflossingen onder de juiste rubriek van uw aangifte in de personenbelasting en hebt daarvoor de fiscale attesten van uw kredietverstrekker nodig.</p>
<p>De woning moet op het ogenblik van de uitgaven uw eigen woning zijn. De FOD Financiën beoordeelt die voorwaarde op basis van de feiten; een domicilie is geen formele voorwaarde. Hebt u leningen onder verschillende Vlaamse regelingen, dan moet u kiezen; de keuze voor de geïntegreerde woonbonus is definitief.</p>`,
        fr: `<p>Pour les prêts existants, le bonus logement est maintenu tant que vous remplissez les conditions. Vous mentionnez les intérêts et amortissements en capital payés à la rubrique adéquate de votre déclaration à l’impôt des personnes physiques et vous avez besoin pour cela des attestations fiscales de votre prêteur.</p>
<p>Le logement doit être votre habitation propre au moment des dépenses. Le SPF Finances apprécie cette condition sur la base des faits ; le domicile n’est pas une condition formelle. Si vous avez des prêts relevant de régimes flamands différents, vous devez choisir ; le choix du bonus logement intégré est définitif.</p>`
      }
    }
  ],
  faq: {
    nl: [
      ['Verliest mijn lening van vóór 2020 haar woonbonus door de uitdoving?', 'Nee. Volgens het Departement Financiën en Begroting heeft de uitdoving geen impact op lopende hypothecaire leningen; de geldende Vlaamse belastingverminderingen blijven onverminderd van toepassing.'],
      ['Waar kan ik met vragen terecht?', 'Voor het invullen van de woonbonus in uw aangifte verwijst de Vlaamse overheid naar de FOD Financiën; voor de regelgeving naar de Vlaamse infolijn 1700; voor uw lening naar uw kredietinstelling.']
    ],
    fr: [
      ['Mon prêt antérieur à 2020 perd-il son bonus logement ?', 'Non. Selon le Departement Financiën en Begroting, l’extinction n’a pas d’impact sur les prêts hypothécaires en cours ; les réductions d’impôt flamandes applicables restent intégralement d’application.'],
      ['À qui m’adresser en cas de question ?', 'Pour remplir le bonus logement dans votre déclaration, l’Autorité flamande renvoie au SPF Finances ; pour la réglementation, à la ligne d’information flamande 1700 ; pour votre prêt, à votre établissement de crédit.']
    ]
  },
  sources: ['gwb', 'wbfaq', 'wb']
});

PAGES.push({
  key: 'ov',
  title: { nl: 'Onroerende voorheffing en KI in Vlaanderen | Belastingkaart', fr: 'Revenu cadastral et précompte immobilier | Belastingkaart' },
  desc: {
    nl: 'Wat het kadastraal inkomen en de onroerende voorheffing zijn, wie ze in Vlaanderen vaststelt en int, wie moet betalen en wanneer het aanslagbiljet komt.',
    fr: 'Revenu cadastral et précompte immobilier en Flandre : ce qu’ils sont, qui les fixe et les perçoit, qui paie et quand arrive l’avertissement-extrait de rôle.'
  },
  eyebrow: { nl: 'Wonen · bezitten', fr: 'Logement · posséder' },
  h1: { nl: 'Kadastraal inkomen en onroerende voorheffing in Vlaanderen', fr: 'Revenu cadastral et précompte immobilier en Flandre' },
  lead: {
    nl: 'Wie in Vlaanderen een woning bezit, krijgt elk jaar een aanslagbiljet onroerende voorheffing. Twee overheden zijn betrokken: het Kadaster van de FOD Financiën stelt het kadastraal inkomen vast, de Vlaamse Belastingdienst berekent en int de voorheffing.',
    fr: 'Qui possède un logement en Flandre reçoit chaque année un avertissement-extrait de rôle de précompte immobilier. Deux administrations interviennent : le Cadastre du SPF Finances fixe le revenu cadastral, le Vlaamse Belastingdienst calcule et perçoit le précompte.'
  },
  summary: {
    nl: '<b>Kort:</b> de onroerende voorheffing is een jaarlijkse Vlaamse belasting op onroerende goederen in het Vlaams Gewest. Ze bestaat uit een basisheffing voor het Vlaamse Gewest plus provinciale en gemeentelijke opcentiemen, berekend op het geïndexeerde kadastraal inkomen.',
    fr: '<b>En bref :</b> le précompte immobilier est un impôt régional annuel sur les biens immobiliers. En Flandre, il se compose d’un montant de base pour la Région flamande et de centimes additionnels de la province et de la commune, calculés sur le revenu cadastral indexé.'
  },
  sections: [
    {
      h2: { nl: 'Wat is het kadastraal inkomen?', fr: 'Qu’est-ce que le revenu cadastral ?' },
      body: {
        nl: `<p>Het kadastraal inkomen (KI) is geen reëel inkomen, maar een fictief huurinkomen dat aan elk onroerend goed wordt toegekend, ook als het niet verhuurd wordt. Het komt overeen met het jaarlijkse netto-huurinkomen dat u in 1975 voor het goed zou ontvangen als u het verhuurde.</p>
<p>Het KI wordt vastgesteld door de Algemene Administratie van de Patrimoniumdocumentatie (Kadaster) van de FOD Financiën. Voor vragen over de vaststelling of herziening ervan moet u bij het Kadaster zijn, niet bij de Vlaamse Belastingdienst.</p>
<p>Het KI wordt jaarlijks geïndexeerd: het wordt vermenigvuldigd met een indexatiecoëfficiënt en afgerond tot de dichtstbijgelegen euro. Voor aanslagjaar 2026 bedraagt die coëfficiënt volgens de Vlaamse overheid {{wonen.cadastral_income_indexation.coefficient|d4}}. Bouwt of verbouwt u grondig, dan moet u het Kadaster zelf op de hoogte brengen binnen 30 dagen na de ingebruikname of de voltooiing van de werken.</p>`,
        fr: `<p>Le revenu cadastral (RC, kadastraal inkomen) n’est pas un revenu réel mais un revenu locatif fictif attribué à chaque bien immobilier, même s’il n’est pas loué. Il correspond au revenu locatif net annuel que le bien aurait rapporté en 1975 s’il avait été loué.</p>
<p>Le RC est fixé par l’Administration générale de la Documentation patrimoniale (Cadastre) du SPF Finances. Pour toute question sur sa fixation ou sa révision, il faut s’adresser au Cadastre, et non au Vlaamse Belastingdienst.</p>
<p>Le RC est indexé chaque année : il est multiplié par un coefficient d’indexation puis arrondi à l’euro le plus proche. Pour l’exercice d’imposition 2026, ce coefficient est de {{wonen.cadastral_income_indexation.coefficient|d4}} selon l’Autorité flamande. Si vous construisez ou rénovez en profondeur, vous devez vous-même en informer le Cadastre dans les 30 jours de l’occupation ou de l’achèvement des travaux.</p>`
      }
    },
    {
      h2: { nl: 'Wat is de onroerende voorheffing?', fr: 'Qu’est-ce que le précompte immobilier ?' },
      body: {
        nl: `<p>De onroerende voorheffing is een jaarlijkse Vlaamse belasting op onroerende goederen die in het Vlaams Gewest liggen: gronden, gebouwen en sommige soorten bedrijfsuitrusting. De Vlaamse Belastingdienst berekent ze op basis van het geïndexeerde kadastraal inkomen.</p>
<p>Ze bestaat uit drie delen: de basisheffing voor het Vlaamse Gewest, de opcentiemen voor de provincie en de opcentiemen voor de gemeente, beide berekend op de basisheffing. Elke gemeente en provincie bepaalt zelf de hoogte van haar opcentiemen; sinds aanslagjaar 2019 kan een gemeente die binnen haar grondgebied differentiëren.</p>
<p>Sommige verminderingen en vrijstellingen kent de Vlaamse Belastingdienst automatisch toe, andere moet u aanvragen. Het totaal van de verminderingen is altijd beperkt tot de onroerende voorheffing die u moet betalen.</p>`,
        fr: `<p>Le précompte immobilier est une taxe régionale sur les biens immobiliers, à payer chaque année. En Flandre, c’est le Vlaamse Belastingdienst (Service flamand des impôts) qui le perçoit ; il le calcule sur la base du revenu cadastral indexé. Les biens immobiliers sont les terrains, les bâtiments et certains types de matériel et d’outillage.</p>
<p>Il se compose de trois parties : le montant de base pour la Région flamande, les centimes additionnels de la province et ceux de la commune, tous deux calculés sur le montant de base. Chaque commune et chaque province fixe elle-même ses centimes additionnels ; depuis l’exercice d’imposition 2019, une commune peut les différencier sur son territoire.</p>
<p>Certaines réductions et exonérations sont accordées automatiquement par le Vlaamse Belastingdienst, d’autres doivent être demandées. Le total des réductions est toujours limité au précompte immobilier dû.</p>`
      }
    },
    {
      h2: { nl: 'Wie betaalt?', fr: 'Qui paie ?' },
      body: {
        nl: `<p>Belastingplichtig is in de overgrote meerderheid van de gevallen wie op 1 januari van het aanslagjaar volgens het kadaster de eigenaar is. Bij een splitsing tussen blote eigendom en vruchtgebruik is de vruchtgebruiker belastingplichtig. Voor de onroerende voorheffing is het aanslagjaar het kalenderjaar zelf, en de belasting geldt voor de volle twaalf maanden.</p>
<p>Verkoopt u in de loop van het jaar, dan blijft u als eigenaar op 1 januari belastingplichtig voor het hele jaar; de verkoopakte kan wel een verdeling tussen koper en verkoper voorzien, die de notaris afrekent. Een huurder kan in de meeste gevallen niet belastingplichtig zijn, ook niet als dat in de huurovereenkomst staat.</p>
<p>Voor een nieuw gebouwd goed is de voorheffing voor het eerst verschuldigd voor het jaar na het jaar van de ingebruikname.</p>`,
        fr: `<p>Dans la très grande majorité des cas, le redevable est la personne qui, selon le cadastre, est propriétaire du bien au 1er janvier de l’exercice d’imposition. En cas de démembrement entre nue-propriété et usufruit, c’est l’usufruitier qui est redevable. Pour le précompte immobilier, l’exercice d’imposition est l’année civile elle-même, et l’impôt couvre la période complète de douze mois.</p>
<p>Si vous vendez en cours d’année, vous restez, comme propriétaire au 1er janvier, redevable pour toute l’année ; l’acte de vente peut toutefois prévoir une répartition entre acheteur et vendeur, que le notaire règle. Dans la plupart des cas, un locataire ne peut pas être redevable, même si le bail le prévoit.</p>
<p>Pour un bien nouvellement construit, le précompte est dû pour la première fois pour l’année qui suit celle de l’occupation.</p>`
      }
    },
    {
      h2: { nl: 'Aanslagbiljet en betaling', fr: 'Avertissement-extrait de rôle et paiement' },
      body: {
        nl: `<p>Er is geen vast verzendschema; de overgrote meerderheid van de aanslagbiljetten wordt verzonden tussen eind april en eind december. Is uw eBox actief, dan krijgt u het aanslagbiljet daar; anders per post. U betaalt binnen twee maanden na de verzending. Uitstel van betaling is niet mogelijk, een afbetalingsplan aanvragen wel.</p>
<p>De Vlaamse Belastingdienst verstuurt de aanslagbiljetten in het Nederlands; alleen inwoners van de faciliteitengemeenten kunnen op aanvraag een Franstalig aanslagbiljet krijgen.</p>
<p>Wilt u een raming maken, dan heeft de Vlaamse Belastingdienst een eigen simulatietool. Daarvoor moet u het kadastraal inkomen van uw goed kennen. Belastingkaart berekent zelf geen onroerende voorheffing.</p>`,
        fr: `<p>Il n’y a pas de calendrier d’envoi fixe ; la très grande majorité des avertissements-extraits de rôle sont envoyés entre fin avril et fin décembre. Si votre eBox est active, vous le recevez dans celle-ci ; sinon, par la poste. Vous payez dans les deux mois de l’envoi. Un délai de paiement n’est pas possible, mais vous pouvez demander un plan d’apurement.</p>
<p>Le Vlaamse Belastingdienst envoie les avertissements-extraits de rôle en néerlandais ; seuls les habitants des communes à facilités peuvent, sur demande, obtenir un avertissement-extrait de rôle en français.</p>
<p>Pour une estimation, le Vlaamse Belastingdienst propose son propre outil de simulation (en néerlandais), qui demande le revenu cadastral de votre bien. Belastingkaart ne calcule pas lui-même le précompte immobilier.</p>`
      }
    }
  ],
  faq: {
    nl: [
      ['Waarom betaal ik meer onroerende voorheffing dan vorig jaar?', 'De Vlaamse Belastingdienst noemt vier mogelijke redenen: de jaarlijkse indexering van het KI, hogere provinciale of gemeentelijke opcentiemen, het wegvallen van een vermindering, of een verhoogd KI, bijvoorbeeld na renovatie.'],
      ['Waar vind ik het kadastraal inkomen van mijn woning?', 'Onder meer op uw aanslagbiljet onroerende voorheffing of personenbelasting, in MijnVlabel, in MyMinfin, in uw aankoopakte of bij het Kadaster.']
    ],
    fr: [
      ['Pourquoi mon précompte immobilier augmente-t-il par rapport à l’an dernier ?', 'Le Vlaamse Belastingdienst cite quatre raisons possibles : l’indexation annuelle du RC, la hausse des centimes additionnels provinciaux ou communaux, la perte d’une réduction, ou un RC relevé, par exemple après rénovation.'],
      ['Où trouver le revenu cadastral de mon logement ?', 'Notamment sur votre avertissement-extrait de rôle du précompte immobilier ou de l’impôt des personnes physiques, dans MijnVlabel, dans MyMinfin, dans votre acte d’achat ou auprès du Cadastre.']
    ]
  },
  sources: ['ov', 'ovfr', 'ovwie', 'ovber', 'ovbet', 'ki']
});

PAGES.push({
  key: 'check',
  title: { nl: 'Woonbelastingen online nakijken | Belastingkaart', fr: 'Vérifier sa fiscalité du logement en ligne | Belastingkaart' },
  desc: {
    nl: 'Waar u uw eigen woongegevens nakijkt: aanslagbiljetten in MijnVlabel, gegevens van uw onroerende goederen in MyMinfin en uw eBox via Mijn Burgerprofiel.',
    fr: 'Où consulter vos propres données de logement : avertissements-extraits de rôle dans MijnVlabel, biens immobiliers dans MyMinfin et eBox via Mijn Burgerprofiel.'
  },
  eyebrow: { nl: 'Wonen · nakijken', fr: 'Logement · vérifier' },
  h1: { nl: 'Waar u uw eigen woonfiscaliteit nakijkt', fr: 'Où vérifier votre propre fiscalité du logement' },
  lead: {
    nl: 'Belastingkaart berekent geen persoonlijke bedragen. Uw eigen gegevens staan in de beveiligde loketten van de overheid. Deze pagina zegt welk loket wat toont.',
    fr: 'Belastingkaart ne calcule aucun montant personnel. Vos propres données se trouvent dans les guichets sécurisés des pouvoirs publics. Cette page indique ce que montre chaque guichet.'
  },
  summary: {
    nl: '<b>Kort:</b> Vlaamse belastingen op uw woning (onroerende voorheffing, registratiebelasting) staan in MijnVlabel. Federale gegevens, zoals uw onroerende goederen en uw aangifte personenbelasting, staan in MyMinfin. Digitale aanslagbiljetten komen in uw eBox.',
    fr: '<b>En bref :</b> les impôts flamands sur votre logement (précompte immobilier, droits d’enregistrement) figurent dans MijnVlabel. Les données fédérales, comme vos biens immobiliers et votre déclaration à l’impôt des personnes physiques, figurent dans MyMinfin. Les avertissements-extraits de rôle numériques arrivent dans votre eBox.'
  },
  sections: [
    {
      h2: { nl: 'MijnVlabel (Vlaamse Belastingdienst)', fr: 'MijnVlabel (Vlaamse Belastingdienst)' },
      body: {
        nl: `<p>MijnVlabel is het digitale loket van de Vlaamse Belastingdienst. U kunt er onder meer:</p>
<ul>
<li>een overzicht bekijken van de belastingen die voor u gelden, waaronder onroerende voorheffing en registratiebelasting;</li>
<li>zien welke belastingen nog openstaan, wanneer en hoe aanslagbiljetten verzonden zijn, en ze downloaden;</li>
<li>de detailgegevens van het laatste kohierartikel onroerende voorheffing openen, waar ook het niet-geïndexeerde kadastraal inkomen staat;</li>
<li>de onroerende voorheffing simuleren en een bezwaar indienen.</li>
</ul>
<p>Let op: bij natuurlijke personen worden aanslagbiljetten onroerende voorheffing alleen getoond aan de persoon op wie de aanslag gevestigd is. Mede-eigenaars vinden het daarom niet altijd terug.</p>
<p><a href="https://belastingen.fenb.be/ui/public/landing" rel="noopener">Naar MijnVlabel</a></p>`,
        fr: `<p>MijnVlabel est le guichet numérique du Vlaamse Belastingdienst (en néerlandais). Vous pouvez notamment y :</p>
<ul>
<li>consulter un aperçu des impôts qui vous concernent, dont le précompte immobilier et les droits d’enregistrement ;</li>
<li>voir quels impôts restent dus, quand et comment les avertissements-extraits de rôle ont été envoyés, et les télécharger ;</li>
<li>ouvrir le détail du dernier article de rôle du précompte immobilier, où figure aussi le revenu cadastral non indexé ;</li>
<li>simuler le précompte immobilier et introduire une réclamation.</li>
</ul>
<p>Attention : pour les personnes physiques, l’avertissement-extrait de rôle du précompte immobilier n’est affiché qu’à la personne au nom de laquelle l’imposition est établie. Les copropriétaires ne le retrouvent donc pas toujours.</p>
<p><a href="https://belastingen.fenb.be/ui/public/landing" rel="noopener">Vers MijnVlabel</a></p>`
      }
    },
    {
      h2: { nl: 'MyMinfin (FOD Financiën)', fr: 'MyMinfin (SPF Finances)' },
      body: {
        nl: `<p>Het kadastraal inkomen is een federale bevoegdheid. De Vlaamse overheid verwijst ernaar dat u zich kunt aanmelden op MyMinfin van de FOD Financiën om de gegevens van uw onroerende goederen op te vragen. Het kadastraal inkomen staat ook op uw aanslagbiljet personenbelasting.</p>
<p>Geniet u nog de woonbonus voor een lening van vóór 2020, dan geeft u de betaalde interesten en kapitaalaflossingen aan in uw aangifte personenbelasting, met de fiscale attesten van uw kredietverstrekker.</p>
<p><a href="https://www.myminfin.be" rel="noopener">Naar MyMinfin</a></p>`,
        fr: `<p>Le revenu cadastral est une compétence fédérale. L’Autorité flamande indique que vous pouvez vous connecter à MyMinfin, du SPF Finances, pour consulter les données de vos biens immobiliers. Le revenu cadastral figure aussi sur votre avertissement-extrait de rôle à l’impôt des personnes physiques.</p>
<p>Si vous bénéficiez encore du bonus logement pour un prêt antérieur à 2020, vous déclarez les intérêts et amortissements en capital payés dans votre déclaration à l’impôt des personnes physiques, avec les attestations fiscales de votre prêteur.</p>
<p><a href="https://www.myminfin.be" rel="noopener">Vers MyMinfin</a></p>`
      }
    },
    {
      h2: { nl: 'Mijn Burgerprofiel en eBox (Vlaamse overheid)', fr: 'Mijn Burgerprofiel et eBox (Autorité flamande)' },
      body: {
        nl: `<p>Mijn Burgerprofiel verzamelt uw officiële gegevens en overheidsadministratie op één plek. U kunt er uw eBox aan koppelen en overheidsdocumenten digitaal ontvangen. Is uw eBox actief, dan verstuurt de Vlaamse Belastingdienst ook het aanslagbiljet onroerende voorheffing via eBox, met een verwittiging via de documentendienst die u kiest, zoals Mijn Burgerprofiel.</p>
<p>Aanmelden kan met itsme, uw eID en een kaartlezer, of een beveiligingscode via een mobiele app of sms.</p>
<p><a href="https://www.burgerprofiel.be" rel="noopener">Naar Mijn Burgerprofiel</a></p>`,
        fr: `<p>Mijn Burgerprofiel rassemble vos données officielles et vos démarches administratives en un seul endroit (en néerlandais). Vous pouvez y relier votre eBox et recevoir les documents officiels sous forme numérique. Si votre eBox est active, le Vlaamse Belastingdienst y envoie aussi l’avertissement-extrait de rôle du précompte immobilier, avec une notification via le service documentaire de votre choix, comme Mijn Burgerprofiel.</p>
<p>La connexion se fait avec itsme, votre eID et un lecteur de carte, ou un code de sécurité via une application mobile ou un SMS.</p>
<p><a href="https://www.burgerprofiel.be" rel="noopener">Vers Mijn Burgerprofiel</a></p>`
      }
    }
  ],
  faq: {
    nl: [
      ['Ik ben mede-eigenaar en zie het aanslagbiljet niet in MijnVlabel. Is dat normaal?', 'Ja. Bij natuurlijke personen toont MijnVlabel het aanslagbiljet onroerende voorheffing alleen aan de persoon op wie de aanslag gevestigd is.'],
      ['Ik heb mijn aanslagbiljet nog niet ontvangen. Waar kijk ik na?', 'In MijnVlabel ziet u welke aanslagbiljetten aangemaakt en verzonden zijn. Kijk ook uw eBox na als die actief is.']
    ],
    fr: [
      ['Je suis copropriétaire et je ne vois pas l’avertissement-extrait de rôle dans MijnVlabel. Est-ce normal ?', 'Oui. Pour les personnes physiques, MijnVlabel n’affiche l’avertissement-extrait de rôle du précompte immobilier qu’à la personne au nom de laquelle l’imposition est établie.'],
      ['Je n’ai pas encore reçu mon avertissement-extrait de rôle. Où vérifier ?', 'Dans MijnVlabel, vous voyez quels avertissements-extraits de rôle ont été établis et envoyés. Vérifiez aussi votre eBox si elle est active.']
    ]
  },
  sources: ['vlabel', 'ki', 'ovbet', 'mbp', 'gwb']
});

// ---- template extras (Mapafiscal vivienda/ format) ---------------------------------------
// table: inserted card-table at position `at`; limit: nota-limite card; cite; cta; faq4: 4th question; more: footer line card.
const MORE = {
  nl: up => `<p>Meer op Belastingkaart: <a href="${up}nl/methodologie/">hoe we rekenen</a> · <a href="${up}nl/bronnen/">officiële bronnen</a> · <a href="${up}nl/#simulator">bruto-netto simulator</a>.</p>`,
  fr: up => `<p>Plus sur Belastingkaart : <a href="${up}fr/methodologie/">comment nous calculons</a> · <a href="${up}fr/sources/">sources officielles</a> · <a href="${up}fr/#simulator">simulateur brut-net</a>.</p>`
};
const MORE_TITLE = { nl: 'Meer over wonen in Vlaanderen', fr: 'Plus sur le logement en Flandre' };
const LIMIT_TITLE = { nl: 'Wat Belastingkaart niet berekent', fr: 'Ce que Belastingkaart ne calcule pas' };
const EXTRA = {
  index: {
    cta: { nl: ['nakijken/', 'Uw eigen situatie nakijken'], fr: ['verifier/', 'Vérifier votre propre situation'] },
    faq4: {
      nl: ['Gelden deze regels ook voor een woning in Brussel of Wallonië?', 'Nee. Het verkooprecht is verschuldigd in het Gewest waar het goed ligt, en de Vlaamse Belastingdienst is alleen bevoegd voor registratiebelasting die in het Vlaams Gewest gelokaliseerd is. Deze pagina’s behandelen alleen Vlaanderen.'],
      fr: ['Ces règles valent-elles pour un logement à Bruxelles ou en Wallonie ?', 'Non. Le droit de vente est dû dans la Région où se trouve le bien, et le Vlaamse Belastingdienst n’est compétent que pour les droits d’enregistrement localisés en Région flamande. Ces pages ne traitent que de la Flandre.']
    }
  },
  reg: {
    at: 2,
    table: {
      h2: { nl: 'Tarieven van het verkooprecht per periode', fr: 'Taux du droit de vente par période' },
      nl: `<p class="help">Percentages zoals de Vlaamse Belastingdienst ze vermeldt, met de periode waarin ze gelden. Belastingkaart past ze niet toe op een aankoopsom.</p>
<div class="table-scroll"><table class="data-table"><thead><tr><th scope="col">Tarief</th><th scope="col">Periode</th><th scope="col" class="num">Tarief</th><th scope="col">Bepalende datum</th></tr></thead><tbody>
<tr><td>Verlaagd tarief enige eigen woning</td><td>akten verleden vóór 01/01/2020</td><td class="num">{{wonen.reduced_rate_only_own_home.before_2020|pct}}%</td><td>notariële akte</td></tr>
<tr><td>Verlaagd tarief enige eigen woning</td><td>01/01/2020 tot en met 31/12/2021</td><td class="num">{{wonen.reduced_rate_only_own_home.from_2020_to_2021|pct}}%</td><td>notariële akte</td></tr>
<tr><td>Verlaagd tarief enige eigen woning</td><td>01/01/2022 tot en met 31/12/2024</td><td class="num">{{wonen.reduced_rate_only_own_home.from_2022_to_2024|pct}}%</td><td>notariële akte</td></tr>
<tr><td>Verlaagd tarief enige eigen woning</td><td>vanaf 01/01/2025</td><td class="num">{{wonen.reduced_rate_only_own_home.from_2025|pct}}%</td><td>notariële akte</td></tr>
<tr><td>Algemeen tarief</td><td>koopovereenkomst vóór 2022</td><td class="num">{{wonen.general_rate.before_2022|pct}}%</td><td>koopovereenkomst</td></tr>
<tr><td>Algemeen tarief</td><td>koopovereenkomst vanaf 2022</td><td class="num">{{wonen.general_rate.from_2022|pct}}%</td><td>koopovereenkomst</td></tr>
</tbody></table></div>
<p>De aangekondigde verhoging van het verlaagd tarief naar {{announced:wonen.announced_reduced_rate_2027|pct}}% vanaf 2027 staat niet in de tabel: ze steunt op een intentie van de Vlaamse Regering en geldt onder voorbehoud van het decreet.</p>`,
      fr: `<p class="help">Taux tels que les mentionne le Vlaamse Belastingdienst, avec leur période d’application. Belastingkaart ne les applique à aucun prix d’achat.</p>
<div class="table-scroll"><table class="data-table"><thead><tr><th scope="col">Taux</th><th scope="col">Période</th><th scope="col" class="num">Taux</th><th scope="col">Date déterminante</th></tr></thead><tbody>
<tr><td>Taux réduit habitation propre et unique</td><td>actes passés avant le 01/01/2020</td><td class="num">{{wonen.reduced_rate_only_own_home.before_2020|pct}} %</td><td>acte notarié</td></tr>
<tr><td>Taux réduit habitation propre et unique</td><td>du 01/01/2020 au 31/12/2021 inclus</td><td class="num">{{wonen.reduced_rate_only_own_home.from_2020_to_2021|pct}} %</td><td>acte notarié</td></tr>
<tr><td>Taux réduit habitation propre et unique</td><td>du 01/01/2022 au 31/12/2024 inclus</td><td class="num">{{wonen.reduced_rate_only_own_home.from_2022_to_2024|pct}} %</td><td>acte notarié</td></tr>
<tr><td>Taux réduit habitation propre et unique</td><td>à partir du 01/01/2025</td><td class="num">{{wonen.reduced_rate_only_own_home.from_2025|pct}} %</td><td>acte notarié</td></tr>
<tr><td>Taux général</td><td>compromis conclu avant 2022</td><td class="num">{{wonen.general_rate.before_2022|pct}} %</td><td>compromis</td></tr>
<tr><td>Taux général</td><td>compromis conclu à partir de 2022</td><td class="num">{{wonen.general_rate.from_2022|pct}} %</td><td>compromis</td></tr>
</tbody></table></div>
<p>Le relèvement annoncé du taux réduit à {{announced:wonen.announced_reduced_rate_2027|pct}} % à partir de 2027 ne figure pas dans le tableau : il repose sur une intention du Gouvernement flamand et reste sous réserve du décret.</p>`
    },
    limit: {
      nl: '<p>Belastingkaart berekent geen registratiebelasting op een aankoopsom en controleert niet of u aan de voorwaarden voldoet. Ook de verminderingen van het verkooprecht, zoals de meeneembaarheid, de vermindering voor een bescheiden woning en die voor een beschermd monument, worden hier niet uitgewerkt. De notaris past het tarief toe in de akte.</p>',
      fr: '<p>Belastingkaart ne calcule pas les droits d’enregistrement sur un prix d’achat et ne vérifie pas si vous remplissez les conditions. Les réductions du droit de vente, comme la reportabilité (meeneembaarheid), la réduction pour une habitation modeste et celle pour un monument protégé, ne sont pas détaillées ici. C’est le notaire qui applique le taux dans l’acte.</p>'
    },
    cite: {
      nl: `Officiële bronnen: ${a('vkr', 'Verkooprecht')}, ${a('enig', 'Verlaagd tarief enige eigen woning')}, ${a('alg', 'Algemeen tarief')} en ${a('sp', 'standpunt 26021')} (Vlaamse Belastingdienst).`,
      fr: `Sources officielles : ${a('vkr', 'Verkooprecht')}, ${a('enig', 'Verlaagd tarief enige eigen woning')}, ${a('alg', 'Algemeen tarief')} et ${a('sp', 'position 26021')} (Vlaamse Belastingdienst, en néerlandais).`
    },
    cta: { nl: ['../nakijken/', 'Uw registratiebelasting nakijken in MijnVlabel'], fr: ['../verifier/', 'Vérifier vos droits d’enregistrement dans MijnVlabel'] },
    faq4: {
      nl: ['Wie betaalt de registratiebelasting, de koper of de verkoper?', 'Bij de verkoop van een onroerend goed betalen de kopers de registratiebelasting.'],
      fr: ['Qui paie les droits d’enregistrement, l’acheteur ou le vendeur ?', 'Lors de la vente d’un bien immobilier, ce sont les acheteurs qui paient les droits d’enregistrement.']
    },
    faq5: {
      nl: ['Wat als ik een woning en een bouwgrond samen koop van een bouwpromotor?', 'Op de bijhorende bouwgrond betaalt u ook btw als er een toelating is om te bouwen en het gebouw met btw verkocht wordt, grond en gebouw door dezelfde persoon verkocht worden en de grond tegelijk met het gebouw wordt overgedragen. Anders betaalt u op de grond verkooprecht.'],
      fr: ['Et si j’achète une maison et son terrain à un promoteur ?', 'Le terrain est lui aussi soumis à la TVA s’il existe une autorisation de bâtir et que le bâtiment est vendu sous TVA, si terrain et bâtiment sont vendus par la même personne et si le terrain est cédé en même temps que le bâtiment. Sinon, le terrain est soumis au droit de vente.']
    }
  },
  wb: {
    at: 2,
    table: {
      h2: { nl: 'Welke regeling voor welke lening', fr: 'Quel régime pour quel prêt' },
      nl: `<p class="help">Bepalend is de datum van de authentieke hypothecaire leningsakte; zonder akte de datum van aanvaarding van het kredietaanbod.</p>
<div class="table-scroll"><table class="data-table"><thead><tr><th scope="col">Lening aangegaan</th><th scope="col">Vlaamse regeling</th><th scope="col">Wat nu</th></tr></thead><tbody>
<tr><td>vóór 1 januari 2016</td><td>Woonbonus voor de enige en eigen woning</td><td>Blijft behouden zolang de voorwaarden vervuld zijn</td></tr>
<tr><td>van 1 januari 2016 tot en met 31 december 2019</td><td>Geïntegreerde woonbonus</td><td>Blijft behouden zolang de voorwaarden vervuld zijn</td></tr>
<tr><td>na 31 december 2019</td><td>Geen</td><td>Geen Vlaamse belastingvermindering</td></tr>
<tr><td>Wederopname na 31 december 2019</td><td>Geen (geldt als nieuwe lening)</td><td>Geen woonbonus voor het heropgenomen deel</td></tr>
</tbody></table></div>
<p>Een loutere herfinanciering is geen nieuwe lening: de regeling van de oorspronkelijke lening loopt door voor het deel dat het openstaande saldo aflost.</p>`,
      fr: `<p class="help">C’est la date de l’acte authentique de prêt hypothécaire qui compte ; à défaut d’acte, la date d’acceptation de l’offre de crédit.</p>
<div class="table-scroll"><table class="data-table"><thead><tr><th scope="col">Prêt contracté</th><th scope="col">Régime flamand</th><th scope="col">Situation actuelle</th></tr></thead><tbody>
<tr><td>avant le 1er janvier 2016</td><td>Bonus logement pour l’habitation propre et unique</td><td>Maintenu tant que les conditions sont remplies</td></tr>
<tr><td>du 1er janvier 2016 au 31 décembre 2019 inclus</td><td>Bonus logement intégré</td><td>Maintenu tant que les conditions sont remplies</td></tr>
<tr><td>après le 31 décembre 2019</td><td>Aucun</td><td>Pas de réduction d’impôt flamande</td></tr>
<tr><td>Reprise d’encours après le 31 décembre 2019</td><td>Aucun (nouveau prêt)</td><td>Pas de bonus logement pour la partie reprise</td></tr>
</tbody></table></div>
<p>Un simple refinancement n’est pas un nouveau prêt : le régime du prêt d’origine continue pour la partie qui rembourse le solde restant dû.</p>`
    },
    limit: {
      nl: '<p>Belastingkaart berekent geen woonbonus of belastingvermindering voor uw lening. Wie nog een woonbonus geniet, vindt het bedrag in de aangifte en het aanslagbiljet personenbelasting van de FOD Financiën.</p>',
      fr: '<p>Belastingkaart ne calcule ni le bonus logement ni aucune réduction d’impôt pour votre prêt. Qui bénéficie encore du bonus logement en retrouve le montant dans la déclaration et l’avertissement-extrait de rôle à l’impôt des personnes physiques du SPF Finances.</p>'
    },
    cite: {
      nl: `Officiële bronnen: ${a('gwb', 'Geïntegreerde woonbonus')}, ${a('wb', 'Woonbonus voor de enige en eigen woning')} (Vlaamse overheid) en ${a('wbfaq', 'Veelgestelde vragen over het uitdoven')} (Departement Financiën en Begroting).`,
      fr: `Sources officielles : ${a('gwb', 'Geïntegreerde woonbonus')}, ${a('wb', 'Woonbonus voor de enige en eigen woning')} (Autorité flamande) et ${a('wbfaq', 'questions fréquentes sur l’extinction')} (Departement Financiën en Begroting), en néerlandais.`
    },
    cta: { nl: ['../nakijken/', 'Waar u uw aangifte en attesten vindt'], fr: ['../verifier/', 'Où trouver votre déclaration et vos attestations'] },
    faq4: {
      nl: ['Wat gebeurt er met mijn woonbonus als ik herfinanciert?', 'Bij een loutere herfinanciering geldt in principe de datum van de oorspronkelijke lening, ook bij een andere bank. Een bijkomend ontleend bedrag geldt als een nieuwe lening en krijgt dus geen woonbonus.'],
      fr: ['Que devient mon bonus logement si je refinance mon prêt ?', 'Pour un simple refinancement, c’est en principe la date du prêt d’origine qui vaut, même auprès d’une autre banque. Un montant supplémentaire emprunté est un nouveau prêt et ne donne donc pas droit au bonus logement.']
    },
    faq5: {
      nl: ['Verlies ik de woonbonus als ik later een tweede woning verwerf?', 'In principe niet, maar u hebt dan geen recht meer op de verhoging(en) die u eventueel nog genoot, en dat verlies is definitief. De FOD Financiën beslist uiteindelijk of u de verhoging(en) kunt behouden.'],
      fr: ['Est-ce que je perds le bonus logement si j’acquiers plus tard un second logement ?', 'En principe non, mais vous perdez alors le droit aux majorations dont vous bénéficiiez encore éventuellement, et cette perte est définitive. C’est le SPF Finances qui décide finalement si vous pouvez conserver les majorations.']
    }
  },
  ov: {
    at: 2,
    table: {
      h2: { nl: 'Wie doet wat bij de onroerende voorheffing', fr: 'Qui fait quoi pour le précompte immobilier' },
      nl: `<p class="help">Rolverdeling volgens de Vlaamse overheid en de Vlaamse Belastingdienst.</p>
<div class="table-scroll"><table class="data-table"><thead><tr><th scope="col">Onderdeel</th><th scope="col">Wie</th><th scope="col">Wat</th></tr></thead><tbody>
<tr><td>Kadastraal inkomen</td><td>Kadaster (Algemene Administratie van de Patrimoniumdocumentatie, FOD Financiën)</td><td>Stelt het KI vast en herziet het</td></tr>
<tr><td>Indexatie</td><td>Jaarlijkse indexatiecoëfficiënt</td><td>Aanslagjaar 2026: {{wonen.cadastral_income_indexation.coefficient|d4}}</td></tr>
<tr><td>Basisheffing</td><td>Vlaams Gewest</td><td>Percentage op het geïndexeerde KI</td></tr>
<tr><td>Provinciale opcentiemen</td><td>Provincie</td><td>Bepaalt zelf de hoogte, berekend op de basisheffing</td></tr>
<tr><td>Gemeentelijke opcentiemen</td><td>Gemeente</td><td>Bepaalt zelf de hoogte, berekend op de basisheffing; kan differentiëren sinds aanslagjaar 2019</td></tr>
<tr><td>Berekening, aanslagbiljet en inning</td><td>Vlaamse Belastingdienst</td><td>Verstuurt het aanslagbiljet en int de voorheffing</td></tr>
</tbody></table></div>
<p>Het percentage van de basisheffing en de opcentiemen van uw gemeente en provincie staan niet in deze tabel; de Vlaamse Belastingdienst publiceert een overzicht van de opcentiemen.</p>`,
      fr: `<p class="help">Répartition des rôles selon l’Autorité flamande et le Vlaamse Belastingdienst.</p>
<div class="table-scroll"><table class="data-table"><thead><tr><th scope="col">Élément</th><th scope="col">Qui</th><th scope="col">Quoi</th></tr></thead><tbody>
<tr><td>Revenu cadastral</td><td>Cadastre (Administration générale de la Documentation patrimoniale, SPF Finances)</td><td>Fixe et révise le RC</td></tr>
<tr><td>Indexation</td><td>Coefficient d’indexation annuel</td><td>Exercice d’imposition 2026 : {{wonen.cadastral_income_indexation.coefficient|d4}}</td></tr>
<tr><td>Montant de base</td><td>Région flamande</td><td>Pourcentage du RC indexé</td></tr>
<tr><td>Centimes additionnels provinciaux</td><td>Province</td><td>En fixe elle-même le niveau, calculé sur le montant de base</td></tr>
<tr><td>Centimes additionnels communaux</td><td>Commune</td><td>En fixe elle-même le niveau, calculé sur le montant de base ; différenciation possible depuis l’exercice 2019</td></tr>
<tr><td>Calcul, avertissement-extrait de rôle et perception</td><td>Vlaamse Belastingdienst</td><td>Envoie l’avertissement-extrait de rôle et perçoit le précompte</td></tr>
</tbody></table></div>
<p>Le pourcentage du montant de base et les centimes additionnels de votre commune et de votre province ne figurent pas dans ce tableau ; le Vlaamse Belastingdienst publie un aperçu des centimes additionnels.</p>`
    },
    limit: {
      nl: '<p>Belastingkaart berekent geen onroerende voorheffing en past geen verminderingen of vrijstellingen toe. Voor een raming verwijzen we naar de officiële simulatietool van de Vlaamse Belastingdienst; het definitieve bedrag staat op uw aanslagbiljet.</p>',
      fr: '<p>Belastingkaart ne calcule pas le précompte immobilier et n’applique ni réductions ni exonérations. Pour une estimation, nous renvoyons à l’outil de simulation officiel du Vlaamse Belastingdienst ; le montant définitif figure sur votre avertissement-extrait de rôle.</p>'
    },
    cite: {
      nl: `Officiële bronnen: ${a('ov', 'Onroerende voorheffing')}, ${a('ovber', 'Berekening')}, ${a('ovwie', 'Wie betaalt?')}, ${a('ovbet', 'Betaling')} (Vlaamse Belastingdienst) en ${a('ki', 'Het kadastraal inkomen')} (Vlaamse overheid).`,
      fr: `Sources officielles : ${a('ovfr', 'Précompte immobilier')} (Autorité flamande, en français), ${a('ovber', 'Berekening')}, ${a('ovwie', 'Wie betaalt?')}, ${a('ovbet', 'Betaling')} et ${a('ki', 'Het kadastraal inkomen')} (en néerlandais).`
    },
    cta: { nl: ['https://belastingen.fenb.be/ui/public/simulaties/ov', 'Simulatietool van de Vlaamse Belastingdienst'], fr: ['https://belastingen.fenb.be/ui/public/simulaties/ov', 'Outil de simulation du Vlaamse Belastingdienst (en néerlandais)'] },
    faq5: {
      nl: ['Kan ik als huurder de onroerende voorheffing moeten betalen?', 'In de meeste gevallen niet, ook niet als het in de huurovereenkomst staat. Alleen bij een handelspand kan worden afgesproken dat de huurder betaalt, maar ook dan blijft de verhuurder de belastingplichtige van wie de Vlaamse Belastingdienst de betaling eist.'],
      fr: ['En tant que locataire, puis-je devoir payer le précompte immobilier ?', 'Dans la plupart des cas, non, même si le bail le prévoit. Ce n’est que pour un bien commercial qu’il peut être convenu que le locataire paie, mais même alors le bailleur reste le redevable auquel le Vlaamse Belastingdienst réclame le paiement.']
    },
    faq4: {
      nl: ['Ik heb mijn woning verkocht. Moet ik nog onroerende voorheffing betalen?', 'Wie op 1 januari eigenaar is, betaalt de onroerende voorheffing voor het hele jaar, ook als het goed in de loop van het jaar verkocht wordt. De verkoopakte kan een verdeling tussen koper en verkoper voorzien. Verkocht u vóór 1 januari en kreeg u toch een aanslagbiljet, dan dient u bezwaar in.'],
      fr: ['J’ai vendu mon logement. Dois-je encore payer le précompte immobilier ?', 'Le propriétaire au 1er janvier paie le précompte immobilier pour toute l’année, même si le bien est vendu en cours d’année. L’acte de vente peut prévoir une répartition entre acheteur et vendeur. Si vous avez vendu avant le 1er janvier et recevez malgré tout un avertissement-extrait de rôle, introduisez une réclamation.']
    }
  },
  check: {
    at: 2,
    table: {
      h2: { nl: 'Welk loket voor welke vraag', fr: 'Quel guichet pour quelle question' },
      nl: `<p class="help">U meldt zich bij elk loket zelf aan; Belastingkaart heeft geen toegang tot uw gegevens.</p>
<div class="table-scroll"><table class="data-table"><thead><tr><th scope="col">U wilt</th><th scope="col">Loket</th><th scope="col">Van</th></tr></thead><tbody>
<tr><td>Uw aanslagbiljet onroerende voorheffing zien of downloaden</td><td>MijnVlabel</td><td>Vlaamse Belastingdienst</td></tr>
<tr><td>Uw betaalde of nog te betalen registratiebelasting zien</td><td>MijnVlabel</td><td>Vlaamse Belastingdienst</td></tr>
<tr><td>Het niet-geïndexeerde kadastraal inkomen vinden</td><td>MijnVlabel (detail van het kohierartikel) of MyMinfin</td><td>Vlaamse Belastingdienst / FOD Financiën</td></tr>
<tr><td>De gegevens van uw onroerende goederen opvragen</td><td>MyMinfin</td><td>FOD Financiën</td></tr>
<tr><td>Aanslagbiljetten digitaal ontvangen</td><td>eBox, ook via Mijn Burgerprofiel</td><td>Vlaamse overheid</td></tr>
</tbody></table></div>
<p>Het aanslagbiljet onroerende voorheffing staat in MijnVlabel alleen op naam van de persoon op wie de aanslag gevestigd is.</p>`,
      fr: `<p class="help">Vous vous connectez vous-même à chaque guichet ; Belastingkaart n’a pas accès à vos données.</p>
<div class="table-scroll"><table class="data-table"><thead><tr><th scope="col">Vous voulez</th><th scope="col">Guichet</th><th scope="col">De</th></tr></thead><tbody>
<tr><td>Voir ou télécharger votre avertissement-extrait de rôle du précompte immobilier</td><td>MijnVlabel</td><td>Vlaamse Belastingdienst</td></tr>
<tr><td>Voir les droits d’enregistrement payés ou encore dus</td><td>MijnVlabel</td><td>Vlaamse Belastingdienst</td></tr>
<tr><td>Trouver le revenu cadastral non indexé</td><td>MijnVlabel (détail de l’article de rôle) ou MyMinfin</td><td>Vlaamse Belastingdienst / SPF Finances</td></tr>
<tr><td>Consulter les données de vos biens immobiliers</td><td>MyMinfin</td><td>SPF Finances</td></tr>
<tr><td>Recevoir les avertissements-extraits de rôle sous forme numérique</td><td>eBox, aussi via Mijn Burgerprofiel</td><td>Autorité flamande</td></tr>
</tbody></table></div>
<p>Dans MijnVlabel, l’avertissement-extrait de rôle du précompte immobilier n’apparaît qu’au nom de la personne au nom de laquelle l’imposition est établie.</p>`
    },
    limit: {
      nl: '<p>Belastingkaart heeft geen toegang tot MijnVlabel, MyMinfin of Mijn Burgerprofiel en vraagt nooit uw aanmeldgegevens. Deel uw inloggegevens met niemand; de Vlaamse overheid waarschuwt voor phishing.</p>',
      fr: '<p>Belastingkaart n’a accès ni à MijnVlabel, ni à MyMinfin, ni à Mijn Burgerprofiel et ne vous demande jamais vos identifiants. Ne partagez vos identifiants avec personne ; l’Autorité flamande met en garde contre l’hameçonnage.</p>'
    },
    cite: {
      nl: `Officiële bronnen: ${a('vlabel', 'MijnVlabel')}, ${a('ovbet', 'Betaling van de onroerende voorheffing')} (Vlaamse Belastingdienst), ${a('ki', 'Het kadastraal inkomen')} en ${a('mbp', 'Mijn Burgerprofiel')} (Vlaamse overheid).`,
      fr: `Sources officielles : ${a('vlabel', 'MijnVlabel')}, ${a('ovbet', 'Betaling van de onroerende voorheffing')} (Vlaamse Belastingdienst), ${a('ki', 'Het kadastraal inkomen')} et ${a('mbp', 'Mijn Burgerprofiel')} (Autorité flamande), en néerlandais.`
    },
    cta: { nl: ['https://belastingen.fenb.be/ui/public/landing', 'Naar MijnVlabel'], fr: ['https://belastingen.fenb.be/ui/public/landing', 'Vers MijnVlabel (en néerlandais)'] },
    faq5: {
      nl: ['Kan ik mijn aanslagbiljet onroerende voorheffing in het Frans krijgen?', 'De Vlaamse Belastingdienst verstuurt de aanslagbiljetten in het Nederlands. Alleen inwoners van de faciliteitengemeenten kunnen, na ontvangst van het Nederlandstalige aanslagbiljet, op aanvraag een Franstalig aanslagbiljet krijgen; die aanvraag moet elk jaar opnieuw.'],
      fr: ['Puis-je recevoir mon avertissement-extrait de rôle du précompte immobilier en français ?', 'Le Vlaamse Belastingdienst envoie les avertissements-extraits de rôle en néerlandais. Seuls les habitants des communes à facilités peuvent, après réception de la version néerlandaise, obtenir sur demande une version française ; la demande doit être renouvelée chaque année.']
    },
    faq4: {
      nl: ['Kan iemand anders mijn aanslagbiljetten ontvangen?', 'Ja. U kunt de Vlaamse Belastingdienst schriftelijk vragen uw correspondentie naar een gevolmachtigde te sturen, bijvoorbeeld via het digitaal loket, met de documenten die de volmacht bewijzen.'],
      fr: ['Quelqu’un d’autre peut-il recevoir mes avertissements-extraits de rôle ?', 'Oui. Vous pouvez demander par écrit au Vlaamse Belastingdienst d’envoyer votre correspondance à un mandataire, par exemple via son guichet numérique, avec les documents qui prouvent la procuration.']
    }
  }
};

// ---- render (template of Mapafiscal web/vivienda/) ---------------------------------------
function render(page, lang) {
  const t = T[lang];
  const x = EXTRA[page.key];
  const [nl, fr] = R[page.key];
  const route = lang === 'nl' ? nl : fr;
  const other = lang === 'nl' ? fr : nl;
  const up = '../'.repeat(route.split('/').length - 1);
  const indexRoute = R.index[lang === 'nl' ? 0 : 1];
  const section = lang === 'nl' ? 'Wonen' : 'Logement';
  const crumbs = page.key === 'index'
    ? `<a href="${up}${lang}/">${t.crumbHome}</a> › ${section}`
    : `<a href="${up}${lang}/">${t.crumbHome}</a> › <a href="${up}${indexRoute}">${section}</a> › ${NAV[lang][page.key]}`;
  const links = sectionLinks(lang, route, page.key === 'index' ? null : page.key);
  const card = (cls, h2, body) => `  <section class="card${cls ? ' ' + cls : ''}">
    <h2 class="card-title">${h2}</h2>
${body.trim().split('\n').map(l => '    ' + l).join('\n')}
  </section>`;
  const blocks = page.sections.map(s => {
    if (s.step) return card('step-card', `<span class="step-num">${s.step}.</span> ${s.h2[lang]}`, s.body[lang]);
    if (s.cls === 'card-table') return card('table-card', s.h2[lang], s.body[lang]);
    return card('', s.h2[lang], s.body[lang].replace('%LINKS%', links));
  });
  if (x.table) blocks.splice(x.at, 0, card('table-card', x.table.h2[lang], x.table[lang]));
  const tail = [];
  if (x.limit) tail.push(card('limit-note', LIMIT_TITLE[lang], x.limit[lang]));
  if (x.cite) tail.push(`  <p class="cite">${x.cite[lang]}</p>`);
  const [ctaHref, ctaLabel] = x.cta[lang];
  const ext = /^https:/.test(ctaHref);
  tail.push(`  <p class="page-actions"><a class="btn btn-primary" href="${ctaHref}"${ext ? ' rel="noopener"' : ''}>${ctaLabel} <span class="arrow" aria-hidden="true">→</span></a></p>`);
  const faq = [...page.faq[lang], x.faq4[lang], ...(x.faq5 ? [x.faq5[lang]] : [])];
  tail.push(`  <section class="card faq">
    <h2 class="card-title">${t.faqH2}</h2>
${faq.map(([q, ans]) => `    <details><summary>${q}</summary><p>${ans}</p></details>`).join('\n')}
  </section>`);
  if (page.key !== 'index') tail.push(card('', MORE_TITLE[lang], links.replace('<ul class="link-list">\n', `<ul class="link-list">\n<li><a href="${up}${indexRoute}">${NAV[lang].index}</a><span>${lang === 'nl' ? 'Overzicht van de sectie' : 'Vue d’ensemble de la section'}</span></li>\n`)));
  tail.push(`  <div class="card">${MORE[lang](up)}</div>`);
  tail.push(card('sources', t.sourcesH2, `<p class="help">${t.sourcesNote}</p>
<ul class="link-list source-list">
${page.sources.map(k => `<li><a href="${S[k].url}" rel="noopener">${S[k][lang]}</a><span>${S[k].url} · ${S[k].org} · ${t.consulted}</span></li>`).join('\n')}
</ul>`));
  return `<!doctype html>
<html lang="${lang}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${page.title[lang]}</title>
<meta name="description" content="${page.desc[lang]}">
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
<link rel="stylesheet" href="${up}css/wonen.css">
<script defer src="${up}config.js"></script>
<script defer src="${up}js/menu.js"></script>
<script defer src="${up}js/ui.js"></script>
</head>
<body class="page" data-lang="${lang}">
<a class="skip-link" href="#content">${t.skip}</a>
<header class="appbar">
  <div class="appbar-in">
    <a class="brand" href="${up}${lang}/" aria-label="${t.home}">${BRAND}<span class="brand-name">Belastingkaart</span></a>
    ${navHtml(lang, route)}
    <div class="appbar-end">
      <button class="btn-icon theme-btn" id="theme-toggle" type="button" ${t.theme}>${THEME}</button>
      <a class="lang-switch" href="${up}${other}" hreflang="${lang === 'nl' ? 'fr-BE' : 'nl-BE'}" lang="${lang === 'nl' ? 'fr' : 'nl'}" aria-label="${t.switchLabel}">${lang === 'nl' ? 'FR' : 'NL'}</a>
      <a class="btn btn-primary btn-sm btn-cta" href="${up}${lang}/#simulator">${t.cta}</a>
    </div>
  </div>
</header>
<main class="container page-main wonen" id="content" tabindex="-1">
  <p class="breadcrumbs">${crumbs}</p>
  <h1>${page.h1[lang]}</h1>
  <p class="updated">${t.updated} <time datetime="${DATE}">${t.updatedLong}</time></p>
  <p class="summary-box slash">${page.summary[lang]}</p>
  <div class="prose wonen-stack">
  <p class="lead">${page.lead[lang]}</p>
${blocks.join('\n')}
${tail.join('\n')}
  </div>
</main>
${footerHtml(lang, route, lang === 'nl' ? fr : nl)}
</body>
</html>
`;
}

export const pages = {};
for (const page of PAGES) for (const lang of ['nl', 'fr']) {
  const route = R[page.key][lang === 'nl' ? 0 : 1];
  pages[route] = applyHead(finalizePage(fillFigures(render(page, lang)), lang), route);
}
if (process.argv.includes('--check')) {
  const stale = [];
  for (const [route, html] of Object.entries(pages))
    if (await readFile(path.join(WEB, route, 'index.html'), 'utf8').catch(() => '') !== html) stale.push(route);
  if (stale.length) { console.error('Stale housing pages: ' + stale.join(', ') + '\nRun npm run build:wonen'); process.exit(1); }
  console.log('Housing pages are up to date.');
} else if (process.argv[1] && import.meta.url.endsWith(path.basename(process.argv[1]))) {
  for (const [route, html] of Object.entries(pages)) {
    const file = path.join(WEB, route, 'index.html');
    await mkdir(path.dirname(file), { recursive: true });
    await writeFile(file, html);
  }
  console.log(`Wrote ${Object.keys(pages).length} housing pages.`);
}
