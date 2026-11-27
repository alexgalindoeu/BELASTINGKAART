// Generator for the pension-savings section (web/nl/pensioensparen/, web/fr/epargne-pension/).
// Same template as Mapafiscal's web/rescate-plan-pensiones/ (index + topic pages): breadcrumbs,
// h1, update line, lead with the key figures, rules card with numbered list and legal citation,
// table card, two buttons, FAQ, trust line; plus the Belastingkaart sources card at the end.
// Content comes only from Fisconetplus (FOD Financiën) documents consulted on 27-11-2026;
// the claim → quote → URL log is docs/sources/pensioensparen_2026-11-27.md.
//   node tools/build_pensioensparen.mjs           write the pages (head block included)
//   node tools/build_pensioensparen.mjs --check   exit 1 if a page differs from this generator
import { writeFile, readFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { SITE, WEB } from './lib/pages.mjs';
import { fillFigures } from './lib/figures.mjs';
import { applyHead } from './lib/head.mjs';
import { navHtml, footerHtml } from './lib/shell.mjs';
export { S as SOURCES, R as ROUTES, CONSULTED };

const DATE = '2026-11-27';
const CONSULTED = '27-11-2026';
const DOC = guid => `https://www.minfin.fgov.be/myminfin-web/pages/public/fisconet/document/${guid}`;

// Fisconetplus documents, NL and FR version of the same text (see the source log).
const S = {
  a1451: { nl: ['c06c831e-30de-44e2-af79-c380a0798b1c', 'Artikel 145/1, WIB 92 (inkomsten 2026)'], fr: ['2fe2c695-badc-4d71-9efe-1eec7031e5b6', 'Article 145/1, CIR 92 (revenus 2026)'] },
  a1452: { nl: ['bbab9898-8738-4184-9278-187768359a3b', 'Artikel 145/2, WIB 92 (inkomsten 2026)'], fr: ['2c5852d2-17b5-4dd0-911b-9c55267b20a7', 'Article 145/2, CIR 92 (revenus 2026)'] },
  a1454: { nl: ['e3d2de27-5ac4-4116-9b59-f6b80a3bc9e1', 'Artikel 145/4, WIB 92 (inkomsten 2026)'], fr: ['29ffe126-1c12-4223-abff-b5d45bae6a11', 'Article 145/4, CIR 92 (revenus 2026)'] },
  a1456: { nl: ['f3ed8f21-ac56-4810-aeb6-f648afbb7f35', 'Artikel 145/6, WIB 92 (inkomsten 2026)'], fr: ['c24c4324-cfc1-4b8e-b4a8-c1b5e5b3f638', 'Article 145/6, CIR 92 (revenus 2026)'] },
  a1458: { nl: ['d811dab7-9607-417e-ba02-1c25e129bb8a', 'Artikel 145/8, WIB 92 (inkomsten 2026)'], fr: ['62bf4033-a88e-4a46-bd41-a7a9eb2b0a91', 'Article 145/8, CIR 92 (revenus 2026)'] },
  a1459: { nl: ['3225f08b-95fc-459d-83a1-35408bba7a47', 'Artikel 145/9, WIB 92 (inkomsten 2026)'], fr: ['985a3467-38ef-42c9-9cfe-8d08f99c7e0f', 'Article 145/9, CIR 92 (revenus 2026)'] },
  a14516: { nl: ['95e758a1-acba-48f8-8099-e7239103e407', 'Artikel 145/16, WIB 92 (inkomsten 2026)'], fr: ['242ed7aa-0e2f-4217-858a-099b6c1edea1', 'Article 145/16, CIR 92 (revenus 2026)'] },
  a34: { nl: ['6edb5e0f-a8c2-40e5-a490-4269b6aad662', 'Artikel 34, WIB 92 (inkomsten 2026)'], fr: ['4e474aec-3101-4564-95e5-908e6a5dcffc', 'Article 34, CIR 92 (revenus 2026)'] },
  a39: { nl: ['2ff65d34-0027-41bc-b5d8-03698ac49954', 'Artikel 39, WIB 92 (inkomsten 2026)'], fr: ['4ae169e2-0e6d-4149-be2f-15c3874fda24', 'Article 39, CIR 92 (revenus 2026)'] },
  a171: { nl: ['c67e2c6d-c7b0-4fef-bf88-70e579734c21', 'Artikel 171, WIB 92 (inkomsten 2026)'], fr: ['d9683eeb-c029-4bc0-bb2c-b17f7990f2d4', 'Article 171, CIR 92 (revenus 2026)'] },
  t184: { nl: ['5e0f25e3-5911-4430-9449-d0792d4dd086', 'Artikel 184, Wetboek diverse rechten en taksen'], fr: ['2a463df6-5791-4222-a128-7b23f9f6c3fc', 'Article 184, Code des droits et taxes divers'] },
  t185: { nl: ['cc7452c2-9a8f-45fd-9853-2661e7699a15', 'Artikel 185, Wetboek diverse rechten en taksen'], fr: ['fc8415b7-c41c-43cc-823c-aaa496f01c1b', 'Article 185, Code des droits et taxes divers'] },
  t186: { nl: ['fb2a08b6-7d19-499e-a9ec-a836bc6a8ae1', 'Artikel 186, Wetboek diverse rechten en taksen'], fr: ['823e0dcd-f90d-454a-8073-6287487a7098', 'Article 186, Code des droits et taxes divers'] },
  t1871: { nl: ['17767830-273e-442d-9dc0-c49c1709a232', 'Artikel 187/1, Wetboek diverse rechten en taksen'], fr: ['2c276c92-3b7d-4b92-8e6c-d732ddd5dc8e', 'Article 187/1, Code des droits et taxes divers'] },
  idx: { nl: ['e3a471be-e270-4962-9fbf-67ce0d7571f0', 'Automatische indexering – Inkomsten 2026 – Aanslagjaar 2027'], fr: ['042cb526-403e-4f40-9a45-dbccd0a12583', 'Indexation automatique – revenus 2026 – exercice d’imposition 2027'] },
  circ: { nl: ['052c12fb-0c25-4261-b7d0-67ccb136cdb1', 'Circulaire 2018/C/72 over het duaal pensioensparen'], fr: ['1e2e3504-3565-43f9-8596-9a16e6d4151f', 'Circulaire 2018/C/72 relative à l’épargne-pension duale'] },
  pv: { nl: ['2a7f0cce-e7f8-4369-9ed7-26e60d599f6c', 'Parlementaire vraag nr. 1785 van 23.11.2023: Anticipatieve heffing op pensioensparen'] }
};
const url = (key, lang) => DOC(S[key][lang][0]);
const a = (key, lang, label) => `<a href="${url(key, lang)}" rel="noopener">${label}</a>`;

const T = {
  nl: {
    skip: 'Naar de inhoud', home: 'Belastingkaart, startpagina',
    theme: 'aria-label="Thema: automatisch (zoals het systeem). Wijzigen naar licht" title="Thema: automatisch (zoals het systeem)"',
    switchLabel: 'Version française', cta: 'Naar de simulator', crumbHome: 'Startpagina', section: 'Pensioensparen',
    updated: 'Bijgewerkt op', updatedLong: '27 november 2026',
    faqH2: 'Veelgestelde vragen', sourcesH2: 'Bronnen', consulted: `geraadpleegd op ${CONSULTED}`, org: 'FOD Financiën, Fisconetplus',
    sourcesNote: 'Alleen officiële teksten van de FOD Financiën (Fisconetplus), alle geraadpleegd op 27 november 2026. De citaten staan in ons bronnenregister.',
    all: 'Alle onderwerpen', trustLabel: 'Over deze uitleg',
    trust: up => [`Inkomstenjaar 2026 · aanslagjaar 2027`, `Nagekeken op <time datetime="${DATE}">27 november 2026</time>`, `Geen persoonlijke berekening: de bedragen zijn de wettelijke plafonds en tarieven`, `Bron: Fisconetplus (FOD Financiën) · <a href="${up}nl/methodologie/">Methodologie</a>`]
  },
  fr: {
    skip: 'Aller au contenu', home: 'Belastingkaart, accueil',
    theme: 'aria-label="Thème : automatique (comme le système). Passer en mode clair" title="Thème : automatique (comme le système)"',
    switchLabel: 'Nederlandse versie', cta: 'Vers le simulateur', crumbHome: 'Accueil', section: 'Épargne-pension',
    updated: 'Mis à jour le', updatedLong: '27 novembre 2026',
    faqH2: 'Questions fréquentes', sourcesH2: 'Sources', consulted: `consulté le ${CONSULTED}`, org: 'SPF Finances, Fisconetplus',
    sourcesNote: 'Uniquement des textes officiels du SPF Finances (Fisconetplus), tous consultés le 27 novembre 2026. Les citations figurent dans notre registre des sources.',
    all: 'Tous les sujets', trustLabel: 'À propos de ces explications',
    trust: up => [`Revenus 2026 · exercice d’imposition 2027`, `Vérifié le <time datetime="${DATE}">27 novembre 2026</time>`, `Aucun calcul personnel : les montants sont les plafonds et taux légaux`, `Source : Fisconetplus (SPF Finances) · <a href="${up}fr/methodologie/">Méthodologie</a>`]
  }
};

const BRAND = '<svg class="brand-icon" viewBox="0 -2 102 86" aria-hidden="true" focusable="false"><path class="p" fill-rule="evenodd" d="M16,4H62L77,18V28L68,37L84,52V66L70,80H2Z M28,16L25,33H57L62,28V21L57,16Z M23,47L19,68H64L70,62V54L63,47Z"/><polygon class="p2" points="46,80 60,80 99,30 91,18"/></svg>';
const THEME = '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><circle cx="12" cy="12" r="8"/><path class="fill" d="M12 4a8 8 0 0 1 0 16z"/></svg>';

// ---- routes -------------------------------------------------------------------------------
const R = {
  index: ['nl/pensioensparen/', 'fr/epargne-pension/'],
  red: ['nl/pensioensparen/belastingvermindering/', 'fr/epargne-pension/reduction-d-impot/'],
  tax: ['nl/pensioensparen/anticipatieve-heffing/', 'fr/epargne-pension/taxe-a-60-ans/'],
  lts: ['nl/pensioensparen/langetermijnsparen/', 'fr/epargne-pension/epargne-a-long-terme/'],
  early: ['nl/pensioensparen/vervroegd-opnemen/', 'fr/epargne-pension/retrait-anticipe/']
};
const CRUMB = {
  nl: { red: 'Belastingvermindering en plafonds', tax: 'Anticipatieve heffing', lts: 'Langetermijnsparen', early: 'Vervroegd opnemen' },
  fr: { red: 'Réduction d’impôt et plafonds', tax: 'Taxe à 60 ans', lts: 'Épargne à long terme', early: 'Retrait anticipé' }
};
const rel = (from, key, lang) => {
  const up = '../'.repeat(from.split('/').length - 1);
  return up + R[key][lang === 'nl' ? 0 : 1];
};

// ---- content ------------------------------------------------------------------------------
// Each page: title, desc, h1, lead, table {h2, help, head, rows, note}, rules {h2, items, cite},
// actions [[key, label], [key, label]], faq [[q, a]], sources [keys].
const PAGES = {};

PAGES.index = {
  title: { nl: 'Pensioensparen belastingvoordeel 2026 | Belastingkaart', fr: 'Épargne-pension avantage fiscal 2026 | Belastingkaart' },
  desc: {
    nl: 'Pensioensparen in 2026: {{pensioensparen.reduction_rates.standard|pct}} % belastingvermindering tot {{pensioensparen.ceilings.standard|eur}} euro of {{pensioensparen.reduction_rates.higher_ceiling|pct}} % tot {{pensioensparen.ceilings.higher_on_choice|eur}} euro, de taks van {{pensioensparen.long_term_savings_tax.pension_savings|pct}} % op 60 jaar en het verschil met langetermijnsparen.',
    fr: 'L’épargne-pension en 2026 : réduction d’impôt de {{pensioensparen.reduction_rates.standard|pct}} % jusqu’à {{pensioensparen.ceilings.standard|eur}} euros ou de {{pensioensparen.reduction_rates.higher_ceiling|pct}} % jusqu’à {{pensioensparen.ceilings.higher_on_choice|eur}} euros, taxe de {{pensioensparen.long_term_savings_tax.pension_savings|pct}} % à 60 ans et épargne à long terme.'
  },
  h1: { nl: 'Pensioensparen 2026: belastingvoordeel, plafonds en de taks op 60 jaar', fr: 'Épargne-pension 2026 : avantage fiscal, plafonds et taxe à 60 ans' },
  lead: {
    nl: 'Wie in 2026 stort voor pensioensparen, krijgt een belastingvermindering van <b>{{pensioensparen.reduction_rates.standard|pct}} %</b> op maximaal <b>{{pensioensparen.ceilings.standard|eur}} euro</b>, of van <b>{{pensioensparen.reduction_rates.higher_ceiling|pct}} %</b> op maximaal <b>{{pensioensparen.ceilings.higher_on_choice|eur}} euro</b> als u vooraf voor het hogere plafond kiest. Wanneer u 60 wordt, houdt uw instelling een taks van <b>{{pensioensparen.long_term_savings_tax.pension_savings|pct}} %</b> in op uw tegoed. Neemt u het eerder op, buiten uw pensionering, de vijf jaren ervoor of een overlijden, dan geldt <b>{{pensioensparen.separate_taxation_rates.pension_savings_other_payout|pct}} %</b>.',
    fr: 'Si vous versez en 2026 pour votre épargne-pension, vous obtenez une réduction d’impôt de <b>{{pensioensparen.reduction_rates.standard|pct}} %</b> sur <b>{{pensioensparen.ceilings.standard|eur}} euros</b> au maximum, ou de <b>{{pensioensparen.reduction_rates.higher_ceiling|pct}} %</b> sur <b>{{pensioensparen.ceilings.higher_on_choice|eur}} euros</b> au maximum si vous choisissez au préalable le plafond le plus élevé. Lorsque vous atteignez 60 ans, votre établissement retient une taxe de <b>{{pensioensparen.long_term_savings_tax.pension_savings|pct}} %</b> sur votre épargne. Si elle est payée avant, en dehors de votre mise à la retraite, des cinq années qui la précèdent ou d’un décès, le taux est de <b>{{pensioensparen.separate_taxation_rates.pension_savings_other_payout|pct}} %</b>.'
  },
  rules: {
    h2: { nl: 'Hoe pensioensparen fiscaal werkt', fr: 'Le régime fiscal de l’épargne-pension' },
    items: {
      nl: [
        'Stortingen voor pensioensparen geven recht op een belastingvermindering op de werkelijk betaalde bedragen. U spaart via een collectieve spaarrekening (een pensioenspaarfonds), een individuele spaarrekening of een spaarverzekering.',
        'Voor inkomstenjaar 2026 (aanslagjaar 2027) telt maximaal {{pensioensparen.ceilings.standard|eur}} euro mee. Wie zijn keuze vooraf aan de bank of verzekeraar meldt, mag tot {{pensioensparen.ceilings.higher_on_choice|eur}} euro inbrengen; die keuze is onherroepelijk en geldt alleen voor dat jaar.',
        'De belastingvermindering bedraagt {{pensioensparen.reduction_rates.standard|pct}} %. Voor stortingen in het hogere plafond is ze {{pensioensparen.reduction_rates.higher_ceiling|pct}} %.',
        'Elke echtgenoot heeft recht op de vermindering als hij zelf houder is van de rekening of de verzekering. Per jaar mag u voor één enkel contract storten.',
        'U opent het contract tussen uw 18e en uw 65e verjaardag, voor minstens 10 jaar.',
        'Wanneer u 60 wordt, betaalt uw instelling op het gespaarde tegoed een taks op het lange termijnsparen van {{pensioensparen.long_term_savings_tax.pension_savings|pct}} %, die ze op uw tegoed inhoudt. Wie op 55 jaar of later begon, betaalt die taks op de tiende verjaardag van het contract.',
        'Wat aan die taks onderworpen is geweest, is daarna vrijgesteld van inkomstenbelasting.'
      ],
      fr: [
        'Les versements pour l’épargne-pension donnent droit à une réduction d’impôt calculée sur les montants réellement payés. Vous épargnez au moyen d’un compte-épargne collectif (un fonds d’épargne-pension), d’un compte-épargne individuel ou d’une assurance-épargne.',
        'Pour les revenus 2026 (exercice d’imposition 2027), {{pensioensparen.ceilings.standard|eur}} euros au maximum sont pris en considération. Si vous communiquez votre choix au préalable à votre banque ou à votre assureur, vous pouvez prendre en considération jusqu’à {{pensioensparen.ceilings.higher_on_choice|eur}} euros ; ce choix est irrévocable et ne vaut que pour l’année concernée.',
        'La réduction d’impôt est de {{pensioensparen.reduction_rates.standard|pct}} %. Pour les versements dans le plafond le plus élevé, elle est de {{pensioensparen.reduction_rates.higher_ceiling|pct}} %.',
        'Chaque conjoint a droit à la réduction s’il est personnellement titulaire du compte ou de l’assurance. Chaque année, vous ne pouvez verser que pour un seul contrat.',
        'Vous ouvrez le contrat entre 18 et 65 ans, pour une durée d’au moins 10 ans.',
        'Lorsque vous atteignez 60 ans, votre établissement paie sur l’épargne constituée une taxe sur l’épargne à long terme de {{pensioensparen.long_term_savings_tax.pension_savings|pct}} %, qu’il retient sur votre épargne. Si vous avez commencé à 55 ans ou plus, la taxe est due au dixième anniversaire du contrat.',
        'Ce qui a été soumis à cette taxe est ensuite exonéré d’impôt sur les revenus.'
      ]
    },
    cite: {
      nl: `Wet: ${a('a1451', 'nl', 'WIB 92, art. 145/1, 5°')}, ${a('a1452', 'nl', 'art. 145/2')}, ${a('a1458', 'nl', 'art. 145/8')}, ${a('a1459', 'nl', 'art. 145/9')} en ${a('a39', 'nl', 'art. 39, § 2, 4°')} (inkomsten 2026); Wetboek diverse rechten en taksen, ${a('t184', 'nl', 'art. 184')}, ${a('t185', 'nl', 'art. 185')} en ${a('t1871', 'nl', 'art. 187/1')}; ${a('idx', 'nl', 'automatische indexering aanslagjaar 2027')}.`,
      fr: `Loi : ${a('a1451', 'fr', 'CIR 92, art. 145/1, 5°')}, ${a('a1452', 'fr', 'art. 145/2')}, ${a('a1458', 'fr', 'art. 145/8')}, ${a('a1459', 'fr', 'art. 145/9')} et ${a('a39', 'fr', 'art. 39, § 2, 4°')} (revenus 2026) ; Code des droits et taxes divers, ${a('t184', 'fr', 'art. 184')}, ${a('t185', 'fr', 'art. 185')} et ${a('t1871', 'fr', 'art. 187/1')} ; ${a('idx', 'fr', 'indexation automatique, exercice d’imposition 2027')}.`
    }
  },
  table: {
    h2: { nl: 'Pensioensparen en langetermijnsparen naast elkaar', fr: 'Épargne-pension et épargne à long terme côte à côte' },
    help: {
      nl: 'Wettelijke plafonds en tarieven voor inkomstenjaar 2026 (aanslagjaar 2027). Klik op een onderwerp voor de uitleg.',
      fr: 'Plafonds et taux légaux pour les revenus 2026 (exercice d’imposition 2027). Cliquez sur un sujet pour l’explication.'
    },
    head: { nl: ['Onderwerp', 'Pensioensparen', 'Langetermijnsparen'], fr: ['Sujet', 'Épargne-pension', 'Épargne à long terme'] },
    rows: {
      nl: [
        ['red', 'Belastingvermindering', '{{pensioensparen.reduction_rates.standard|pct}} %, of {{pensioensparen.reduction_rates.higher_ceiling|pct}} % bij het hogere plafond', '{{pensioensparen.reduction_rates.standard|pct}} %'],
        ['red', 'Plafond inkomstenjaar 2026', '{{pensioensparen.ceilings.standard|eur}} euro, of {{pensioensparen.ceilings.higher_on_choice|eur}} euro na een uitdrukkelijke keuze', '{{pensioensparen.long_term_savings_ceiling.first_slice_rate|pct}} % van de eerste {{pensioensparen.long_term_savings_ceiling.first_slice|eur}} euro beroepsinkomen en {{pensioensparen.long_term_savings_ceiling.remainder_rate|pct}} % van het overige, met een maximum van {{pensioensparen.long_term_savings_ceiling.maximum|eur}} euro'],
        ['tax', 'Taks op 60 jaar', '{{pensioensparen.long_term_savings_tax.pension_savings|pct}} %', '{{pensioensparen.long_term_savings_tax.general|pct}} %'],
        ['early', 'Uitkering vóór de taks', '{{pensioensparen.separate_taxation_rates.pension_savings_payout|pct}} % bij pensionering op de normale datum, in de 5 jaren ervoor of bij overlijden; anders {{pensioensparen.separate_taxation_rates.pension_savings_other_payout|pct}} %', '{{pensioensparen.separate_taxation_rates.life_insurance_normal|pct}} % bij overlijden of normale afloop (afkoop: in de 5 jaren ervoor); afkoop op een ander moment: {{pensioensparen.separate_taxation_rates.life_insurance_other_surrender|pct}} %'],
        ['lts', 'Contract', 'Openen tussen 18 en 65 jaar, looptijd minstens 10 jaar', 'Afsluiten vóór 65 jaar, alleen uzelf verzekerd, minstens 10 jaar bij voordelen bij leven']
      ],
      fr: [
        ['red', 'Réduction d’impôt', '{{pensioensparen.reduction_rates.standard|pct}} %, ou {{pensioensparen.reduction_rates.higher_ceiling|pct}} % avec le plafond le plus élevé', '{{pensioensparen.reduction_rates.standard|pct}} %'],
        ['red', 'Plafond revenus 2026', '{{pensioensparen.ceilings.standard|eur}} euros, ou {{pensioensparen.ceilings.higher_on_choice|eur}} euros après un choix exprès', '{{pensioensparen.long_term_savings_ceiling.first_slice_rate|pct}} % de la première tranche de {{pensioensparen.long_term_savings_ceiling.first_slice|eur}} euros des revenus professionnels et {{pensioensparen.long_term_savings_ceiling.remainder_rate|pct}} % du surplus, avec un maximum de {{pensioensparen.long_term_savings_ceiling.maximum|eur}} euros'],
        ['tax', 'Taxe à 60 ans', '{{pensioensparen.long_term_savings_tax.pension_savings|pct}} %', '{{pensioensparen.long_term_savings_tax.general|pct}} %'],
        ['early', 'Paiement avant la taxe', '{{pensioensparen.separate_taxation_rates.pension_savings_payout|pct}} % à la mise à la retraite à la date normale, au cours des 5 années qui précèdent ou au décès ; sinon {{pensioensparen.separate_taxation_rates.pension_savings_other_payout|pct}} %', '{{pensioensparen.separate_taxation_rates.life_insurance_normal|pct}} % au décès ou à l’expiration normale (rachat : au cours des 5 années qui précèdent) ; rachat à un autre moment : {{pensioensparen.separate_taxation_rates.life_insurance_other_surrender|pct}} %'],
        ['lts', 'Contrat', 'Ouverture entre 18 et 65 ans, durée d’au moins 10 ans', 'Conclusion avant 65 ans, vous seul comme assuré, au moins 10 ans si des avantages en cas de vie sont prévus']
      ]
    },
    note: {
      nl: 'Bij langetermijnsparen gaan van het plafond de uitgaven voor de eigen woning af waarvoor een woningvermindering kan worden verleend, en het plafond geldt samen voor de premies en voor de aflossingen van bepaalde hypothecaire leningen. Belastingkaart berekent geen persoonlijke bedragen.',
      fr: 'Pour l’épargne à long terme, le plafond est diminué des dépenses pour l’habitation propre qui peuvent bénéficier d’une réduction pour l’habitation, et il vaut ensemble pour les primes et pour les remboursements de certains emprunts hypothécaires. Belastingkaart ne calcule aucun montant personnel.'
    }
  },
  actions: { nl: [['red', 'Uw plafond kiezen'], ['early', 'Vervroegd opnemen']], fr: [['red', 'Choisir votre plafond'], ['early', 'Retrait anticipé']] },
  faq: {
    nl: [
      ['Hoeveel mag ik in 2026 storten voor pensioensparen?', 'Voor inkomstenjaar 2026 komt maximaal {{pensioensparen.ceilings.standard|eur}} euro in aanmerking voor de belastingvermindering. Wie zijn bank of verzekeraar vooraf meldt dat hij meer wil sparen, mag tot {{pensioensparen.ceilings.higher_on_choice|eur}} euro inbrengen.'],
      ['Welk plafond moet ik kiezen?', 'Tot het lagere plafond krijgt u {{pensioensparen.reduction_rates.standard|pct}} %. Kiest u het hogere plafond en stort u meer, dan wordt de vermindering op alles wat u betaalde berekend tegen {{pensioensparen.reduction_rates.higher_ceiling|pct}} %. De FOD Financiën wijst erop dat u zo een lager fiscaal voordeel kunt krijgen dan met het lagere bedrag; daarom moet de instelling u elk jaar over de gevolgen informeren.'],
      ['Wat is de anticipatieve heffing?', 'Zo wordt de taks op het lange termijnsparen op pensioensparen genoemd: {{pensioensparen.long_term_savings_tax.pension_savings|pct}} % op uw tegoed wanneer u 60 wordt, of op de tiende verjaardag van het contract als u na uw 55e begon. Wat daarna wordt uitgekeerd, is vrijgesteld van inkomstenbelasting.'],
      ['Wat gebeurt er als ik mijn pensioensparen vóór 60 opneem?', 'Gebeurt de uitkering bij uw pensionering op de normale datum, in de vijf jaren daarvoor of na een overlijden, dan geldt {{pensioensparen.separate_taxation_rates.pension_savings_payout|pct}} %. In alle andere gevallen wordt het tegoed afzonderlijk belast tegen {{pensioensparen.separate_taxation_rates.pension_savings_other_payout|pct}} %.'],
      ['Wat is het verschil met langetermijnsparen?', 'Langetermijnsparen is de belastingvermindering van {{pensioensparen.reduction_rates.standard|pct}} % voor premies van een individuele levensverzekering. Het plafond hangt af van uw beroepsinkomen (maximaal {{pensioensparen.long_term_savings_ceiling.maximum|eur}} euro voor 2026) en de taks op 60 jaar bedraagt {{pensioensparen.long_term_savings_tax.general|pct}} %.'],
      ['Wat moet ik bij mijn belastingaangifte doen?', 'U moet een attest kunnen voorleggen van de instelling waar u spaart. Het model daarvan wordt door de Minister van Financiën vastgelegd.']
    ],
    fr: [
      ['Combien puis-je verser en 2026 pour mon épargne-pension ?', 'Pour les revenus 2026, {{pensioensparen.ceilings.standard|eur}} euros au maximum sont pris en considération pour la réduction d’impôt. Si vous informez au préalable votre banque ou votre assureur que vous voulez épargner davantage, vous pouvez aller jusqu’à {{pensioensparen.ceilings.higher_on_choice|eur}} euros.'],
      ['Quel plafond choisir ?', 'Jusqu’au plafond le plus bas, vous obtenez {{pensioensparen.reduction_rates.standard|pct}} %. Si vous choisissez le plafond le plus élevé et versez davantage, la réduction est calculée à {{pensioensparen.reduction_rates.higher_ceiling|pct}} % sur tout ce que vous avez payé. Le SPF Finances souligne que vous pouvez ainsi obtenir un avantage fiscal moins élevé qu’avec le montant le plus bas ; l’établissement doit donc vous informer chaque année des conséquences.'],
      ['Qu’est-ce que la taxe à 60 ans ?', 'C’est la taxe sur l’épargne à long terme appliquée à l’épargne-pension : {{pensioensparen.long_term_savings_tax.pension_savings|pct}} % sur votre épargne lorsque vous atteignez 60 ans, ou au dixième anniversaire du contrat si vous avez commencé à 55 ans ou plus. Ce qui est payé ensuite est exonéré d’impôt sur les revenus.'],
      ['Que se passe-t-il si je retire mon épargne-pension avant 60 ans ?', 'Si le paiement a lieu à l’occasion de votre mise à la retraite à la date normale, au cours des cinq années qui la précèdent ou à l’occasion d’un décès, le taux est de {{pensioensparen.separate_taxation_rates.pension_savings_payout|pct}} %. Dans tous les autres cas, l’épargne est imposée distinctement au taux de {{pensioensparen.separate_taxation_rates.pension_savings_other_payout|pct}} %.'],
      ['Quelle est la différence avec l’épargne à long terme ?', 'L’épargne à long terme est la réduction d’impôt de {{pensioensparen.reduction_rates.standard|pct}} % pour les primes d’une assurance-vie individuelle. Son plafond dépend de vos revenus professionnels ({{pensioensparen.long_term_savings_ceiling.maximum|eur}} euros au maximum pour 2026) et la taxe à 60 ans est de {{pensioensparen.long_term_savings_tax.general|pct}} %.'],
      ['Que dois-je faire dans ma déclaration d’impôt ?', 'Vous devez pouvoir produire une attestation de l’établissement auprès duquel vous épargnez. Son modèle est fixé par le Ministre des Finances.']
    ]
  },
  sources: { nl: ['a1451', 'a1452', 'a1458', 'a1459', 'a1456', 'a39', 'a171', 't184', 't185', 't1871', 'idx', 'circ', 'pv'], fr: ['a1451', 'a1452', 'a1458', 'a1459', 'a1456', 'a39', 'a171', 't184', 't185', 't1871', 'idx', 'circ'] }
};

PAGES.red = {
  title: { nl: 'Pensioensparen 2026: plafond kiezen | Belastingkaart', fr: 'Épargne-pension 2026 : choisir le plafond | Belastingkaart' },
  desc: {
    nl: 'Pensioensparen 2026: tot {{pensioensparen.ceilings.standard|eur}} euro aan {{pensioensparen.reduction_rates.standard|pct}} % of tot {{pensioensparen.ceilings.higher_on_choice|eur}} euro aan {{pensioensparen.reduction_rates.higher_ceiling|pct}} %. Hoe u het hogere plafond kiest, wanneer en wat er gebeurt als u te veel stort.',
    fr: 'Épargne-pension 2026 : jusqu’à {{pensioensparen.ceilings.standard|eur}} euros à {{pensioensparen.reduction_rates.standard|pct}} % ou jusqu’à {{pensioensparen.ceilings.higher_on_choice|eur}} euros à {{pensioensparen.reduction_rates.higher_ceiling|pct}} %. Comment et quand choisir le plafond plus élevé, et que se passe-t-il au-delà.'
  },
  h1: { nl: 'Pensioensparen 2026: 1.050 of {{pensioensparen.ceilings.higher_on_choice|eur}} euro, en hoe u kiest', fr: 'Épargne-pension 2026 : 1.050 ou {{pensioensparen.ceilings.higher_on_choice|eur}} euros, et comment choisir' },
  lead: {
    nl: 'Voor inkomstenjaar 2026 telt een storting voor pensioensparen mee tot <b>{{pensioensparen.ceilings.standard|eur}} euro</b>, tegen een belastingvermindering van <b>{{pensioensparen.reduction_rates.standard|pct}} %</b>. Wie vooraf aan zijn bank of verzekeraar meldt dat hij meer wil sparen, mag tot <b>{{pensioensparen.ceilings.higher_on_choice|eur}} euro</b> inbrengen; dan wordt de vermindering berekend tegen <b>{{pensioensparen.reduction_rates.higher_ceiling|pct}} %</b>.',
    fr: 'Pour les revenus 2026, un versement d’épargne-pension est pris en considération jusqu’à <b>{{pensioensparen.ceilings.standard|eur}} euros</b>, avec une réduction d’impôt de <b>{{pensioensparen.reduction_rates.standard|pct}} %</b>. Si vous informez au préalable votre banque ou votre assureur que vous voulez épargner davantage, vous pouvez aller jusqu’à <b>{{pensioensparen.ceilings.higher_on_choice|eur}} euros</b> ; la réduction est alors calculée à <b>{{pensioensparen.reduction_rates.higher_ceiling|pct}} %</b>.'
  },
  table: {
    h2: { nl: 'De twee plafonds voor inkomstenjaar 2026', fr: 'Les deux plafonds pour les revenus 2026' },
    help: {
      nl: 'Geïndexeerde bedragen voor aanslagjaar 2027 per belastbaar tijdperk en per belastingplichtige die zelf houder is van het contract.',
      fr: 'Montants indexés pour l’exercice d’imposition 2027, par période imposable et par contribuable personnellement titulaire du contrat.'
    },
    head: { nl: ['Regeling', 'Maximaal in aanmerking', 'Belastingvermindering', 'Wat u moet doen'], fr: ['Régime', 'Maximum pris en considération', 'Réduction d’impôt', 'Ce que vous devez faire'] },
    rows: {
      nl: [
        [null, 'Lager plafond', '{{pensioensparen.ceilings.standard|eur}} euro', '{{pensioensparen.reduction_rates.standard|pct}} %', 'Niets: zonder keuze aanvaardt de instelling niet meer'],
        [null, 'Hoger plafond', '{{pensioensparen.ceilings.higher_on_choice|eur}} euro', '{{pensioensparen.reduction_rates.higher_ceiling|pct}} %', 'Uw definitieve keuze aan de instelling meedelen voordat u het lagere plafond overschrijdt, elk jaar opnieuw']
      ],
      fr: [
        [null, 'Plafond le plus bas', '{{pensioensparen.ceilings.standard|eur}} euros', '{{pensioensparen.reduction_rates.standard|pct}} %', 'Rien : sans choix, l’établissement n’accepte pas davantage'],
        [null, 'Plafond le plus élevé', '{{pensioensparen.ceilings.higher_on_choice|eur}} euros', '{{pensioensparen.reduction_rates.higher_ceiling|pct}} %', 'Communiquer votre choix définitif à l’établissement avant de dépasser le plafond le plus bas, chaque année']
      ]
    },
    note: {
      nl: 'Basisbedragen vóór indexering: {{pensioensparen.indexation_base_amounts.standard|eur}} en {{pensioensparen.indexation_base_amounts.higher_on_choice|eur}} euro. De wet laat de Koning toe het lagere plafond te verhogen tot ten hoogste {{pensioensparen.ceilings.royal_decree_maximum|eur}} euro (geïndexeerd). Belastingkaart berekent geen persoonlijke bedragen.',
      fr: 'Montants de base avant indexation : {{pensioensparen.indexation_base_amounts.standard|eur}} et {{pensioensparen.indexation_base_amounts.higher_on_choice|eur}} euros. La loi permet au Roi de porter le plafond le plus bas à un maximum de {{pensioensparen.ceilings.royal_decree_maximum|eur}} euros (montant indexé). Belastingkaart ne calcule aucun montant personnel.'
    }
  },
  rules: {
    h2: { nl: 'Hoe de keuze werkt', fr: 'Comment fonctionne le choix' },
    items: {
      nl: [
        'Zonder uitdrukkelijke en voorafgaande keuze mag de instelling niet meer aanvaarden dan het lagere plafond; wat u te veel stort, moet ze kosteloos terugstorten.',
        'U deelt uw definitieve keuze mee aan de bank of verzekeraar voordat u het lagere plafond overschrijdt. De keuze is onherroepelijk, geldt alleen voor dat jaar en moet elk jaar opnieuw worden gemaakt.',
        'Het tarief hangt af van wat u werkelijk betaalde. Stort u na uw keuze meer dan het lagere plafond, dan geldt {{pensioensparen.reduction_rates.higher_ceiling|pct}} % op het hele bedrag. U kunt niet een lager bedrag aangeven om {{pensioensparen.reduction_rates.standard|pct}} % te krijgen.',
        'Het bedrag dat meetelt, is wat u spaart inclusief de instapkosten.',
        'Met het hogere plafond kan uw voordeel lager uitvallen dan met het lagere; daarom moet de instelling u telkens over de gevolgen van uw keuze informeren.',
        'Per jaar mag u voor één enkel contract storten. Elke echtgenoot heeft een eigen recht op de vermindering als hij zelf houder is van een rekening of verzekering.',
        'De belastingvermindering wordt niet meer verleend vanaf het jaar waarin u 65 wordt of waarin uw tegoed tegen {{pensioensparen.separate_taxation_rates.pension_savings_payout|pct}} % wordt uitgekeerd, behalve als die uitkering het gevolg is van uw overlijden.'
      ],
      fr: [
        'Sans choix exprès et préalable, l’établissement ne peut pas accepter davantage que le plafond le plus bas ; ce que vous versez en trop doit vous être remboursé sans frais.',
        'Vous communiquez votre choix définitif à la banque ou à l’assureur avant de dépasser le plafond le plus bas. Ce choix est irrévocable, ne vaut que pour l’année concernée et doit être renouvelé chaque année.',
        'Le taux dépend de ce que vous avez réellement payé. Si, après votre choix, vous versez plus que le plafond le plus bas, le taux de {{pensioensparen.reduction_rates.higher_ceiling|pct}} % s’applique à tout le montant. Vous ne pouvez pas déclarer un montant inférieur pour obtenir {{pensioensparen.reduction_rates.standard|pct}} %.',
        'Le montant pris en considération est le montant épargné, frais d’entrée compris.',
        'Avec le plafond le plus élevé, votre avantage peut être moins élevé qu’avec le plus bas ; l’établissement doit donc vous informer à chaque fois des conséquences de votre choix.',
        'Chaque année, vous ne pouvez verser que pour un seul contrat. Chaque conjoint a son propre droit à la réduction s’il est personnellement titulaire d’un compte ou d’une assurance.',
        'La réduction n’est plus accordée à partir de l’année où vous atteignez 65 ans ou de celle où votre épargne est payée au taux de {{pensioensparen.separate_taxation_rates.pension_savings_payout|pct}} %, sauf si ce paiement fait suite à votre décès.'
      ]
    },
    cite: {
      nl: `Wet: ${a('a1458', 'nl', 'WIB 92, art. 145/8, § 1')}, ${a('a1452', 'nl', 'art. 145/2')} en ${a('a1459', 'nl', 'art. 145/9')} (inkomsten 2026); toelichting: ${a('circ', 'nl', 'circulaire 2018/C/72')}, nrs. 11 tot 21; bedragen: ${a('idx', 'nl', 'automatische indexering aanslagjaar 2027')}.`,
      fr: `Loi : ${a('a1458', 'fr', 'CIR 92, art. 145/8, § 1er')}, ${a('a1452', 'fr', 'art. 145/2')} et ${a('a1459', 'fr', 'art. 145/9')} (revenus 2026) ; commentaire : ${a('circ', 'fr', 'circulaire 2018/C/72')}, nos 11 à 21 ; montants : ${a('idx', 'fr', 'indexation automatique, exercice d’imposition 2027')}.`
    }
  },
  actions: { nl: [['tax', 'De taks op 60 jaar'], ['index', null]], fr: [['tax', 'La taxe à 60 ans'], ['index', null]] },
  faq: {
    nl: [
      ['Kan ik mijn keuze voor het hogere plafond later intrekken?', 'Nee. De keuze is onherroepelijk en geldt alleen voor het betrokken jaar. Het jaar daarop kiest u opnieuw.'],
      ['Wat als ik meer stort dan het lagere plafond zonder keuze?', 'Zonder voorafgaande keuze moet de instelling het bedrag boven het lagere plafond kosteloos aan u terugstorten. Voor het bedrag tot het plafond krijgt u {{pensioensparen.reduction_rates.standard|pct}} %.'],
      ['Kan ik voor twee pensioenspaarcontracten tegelijk storten?', 'Per jaar mag u maar voor één collectieve spaarrekening, één individuele spaarrekening of één spaarverzekering storten. In het jaar van een overstap kunt u maar de stortingen voor één contract inbrengen.'],
      ['Hebben mijn partner en ik elk een eigen plafond?', 'Elke echtgenoot heeft recht op de vermindering als hij zelf houder is van een spaarrekening of een spaarverzekering.'],
      ['Tot welke leeftijd krijg ik de belastingvermindering?', 'U moet het contract openen vóór 65 jaar. De vermindering stopt vanaf het jaar waarin u 65 wordt of waarin uw tegoed tegen {{pensioensparen.separate_taxation_rates.pension_savings_payout|pct}} % wordt uitgekeerd, behalve als die uitkering het gevolg is van uw overlijden.']
    ],
    fr: [
      ['Puis-je revenir plus tard sur mon choix du plafond élevé ?', 'Non. Le choix est irrévocable et ne vaut que pour l’année concernée. L’année suivante, vous choisissez à nouveau.'],
      ['Et si je verse plus que le plafond bas sans avoir fait de choix ?', 'Sans choix préalable, l’établissement doit vous rembourser sans frais le montant qui dépasse le plafond le plus bas. Pour le montant jusqu’au plafond, vous obtenez {{pensioensparen.reduction_rates.standard|pct}} %.'],
      ['Puis-je verser pour deux contrats d’épargne-pension en même temps ?', 'Chaque année, vous ne pouvez verser que pour un seul compte-épargne collectif, un seul compte-épargne individuel ou une seule assurance-épargne. L’année d’un transfert, vous ne pouvez faire valoir que les versements pour un seul contrat.'],
      ['Mon conjoint et moi avons-nous chacun notre plafond ?', 'Chaque conjoint a droit à la réduction s’il est personnellement titulaire d’un compte-épargne ou d’une assurance-épargne.'],
      ['Jusqu’à quel âge ai-je droit à la réduction ?', 'Vous devez ouvrir le contrat avant 65 ans. La réduction cesse à partir de l’année où vous atteignez 65 ans ou de celle où votre épargne est payée au taux de {{pensioensparen.separate_taxation_rates.pension_savings_payout|pct}} %, sauf si ce paiement fait suite à votre décès.']
    ]
  },
  sources: ['a1458', 'a1452', 'a1459', 'a1451', 'idx', 'circ']
};

PAGES.tax = {
  title: { nl: 'Anticipatieve heffing pensioensparen | Belastingkaart', fr: 'Épargne-pension : la taxe à 60 ans | Belastingkaart' },
  desc: {
    nl: 'De anticipatieve heffing op pensioensparen: {{pensioensparen.long_term_savings_tax.pension_savings|pct}} % op uw tegoed wanneer u 60 wordt, of op de 10e verjaardag van het contract. Wie ze betaalt en wat daarna vrij is.',
    fr: 'Taxe sur l’épargne à long terme de l’épargne-pension : {{pensioensparen.long_term_savings_tax.pension_savings|pct}} % à 60 ans ou au 10e anniversaire du contrat. Qui la paie et ce qui est ensuite exonéré d’impôt.'
  },
  h1: { nl: 'Anticipatieve heffing: de taks van {{pensioensparen.long_term_savings_tax.pension_savings|pct}} % op uw pensioensparen', fr: 'La taxe de {{pensioensparen.long_term_savings_tax.pension_savings|pct}} % sur votre épargne-pension à 60 ans' },
  lead: {
    nl: 'Wanneer u 60 wordt, houdt uw bank of verzekeraar op uw pensioenspaartegoed een taks op het lange termijnsparen van <b>{{pensioensparen.long_term_savings_tax.pension_savings|pct}} %</b> in, ook anticipatieve heffing genoemd. Wat aan die taks onderworpen is geweest, is daarna vrijgesteld van inkomstenbelasting.',
    fr: 'Lorsque vous atteignez 60 ans, votre banque ou votre assureur retient sur votre épargne-pension une taxe sur l’épargne à long terme de <b>{{pensioensparen.long_term_savings_tax.pension_savings|pct}} %</b>. Ce qui a été soumis à cette taxe est ensuite exonéré d’impôt sur les revenus.'
  },
  table: {
    h2: { nl: 'Wanneer en op welk bedrag de taks verschuldigd is', fr: 'Quand et sur quel montant la taxe est due' },
    help: { nl: 'Taks op het lange termijnsparen op pensioensparen, per situatie.', fr: 'Taxe sur l’épargne à long terme appliquée à l’épargne-pension, par situation.' },
    head: { nl: ['Situatie', 'Wanneer', 'Grondslag', 'Tarief'], fr: ['Situation', 'Quand', 'Base', 'Taux'] },
    rows: {
      nl: [
        [null, 'Contract begonnen vóór uw 55e', 'De dag waarop u 60 wordt', 'Het spaartegoed op die dag (rekening) of de theoretische afkoopwaarde (spaarverzekering)', '{{pensioensparen.long_term_savings_tax.pension_savings|pct}} %'],
        [null, 'Contract begonnen op of na uw 55e', 'De tiende verjaardag van het contract', 'Dezelfde grondslag, op die dag', '{{pensioensparen.long_term_savings_tax.pension_savings|pct}} %'],
        [null, 'Begonnen op of na uw 55e en uitgekeerd vóór die tiende verjaardag, terwijl u 60 of ouder bent', 'De dag van de uitkering', 'Het uitgekeerde tegoed of de afkoopwaarde', '{{pensioensparen.long_term_savings_tax.pension_savings|pct}} %, of {{pensioensparen.long_term_savings_tax.article_171_f_g|pct}} % als de uitkering niet samenvalt met uw pensionering op de normale datum, de vijf jaren ervoor of een overlijden']
      ],
      fr: [
        [null, 'Contrat commencé avant 55 ans', 'Le jour où vous atteignez 60 ans', 'L’épargne à cette date (compte) ou la valeur de rachat théorique (assurance-épargne)', '{{pensioensparen.long_term_savings_tax.pension_savings|pct}} %'],
        [null, 'Contrat commencé à 55 ans ou plus', 'Le dixième anniversaire du contrat', 'La même base, à cette date', '{{pensioensparen.long_term_savings_tax.pension_savings|pct}} %'],
        [null, 'Commencé à 55 ans ou plus et payé avant ce dixième anniversaire alors que vous avez 60 ans ou plus', 'Le jour du paiement', 'L’épargne ou la valeur de rachat payée', '{{pensioensparen.long_term_savings_tax.pension_savings|pct}} %, ou {{pensioensparen.long_term_savings_tax.article_171_f_g|pct}} % si le paiement n’a pas lieu à la mise à la retraite à la date normale, au cours des cinq années qui précèdent ou à l’occasion d’un décès']
      ]
    },
    note: {
      nl: 'Een contract dat vanaf 55 jaar in hogere stortingen voorziet, wordt voor de taks gelijkgesteld met een contract dat op de dag van de verhoging is begonnen. Belastingkaart berekent geen persoonlijke bedragen.',
      fr: 'Un contrat qui prévoit une augmentation des versements à partir de 55 ans est assimilé, pour la taxe, à un contrat commencé le jour de l’augmentation. Belastingkaart ne calcule aucun montant personnel.'
    }
  },
  rules: {
    h2: { nl: 'Hoe de taks werkt', fr: 'Comment fonctionne la taxe' },
    items: {
      nl: [
        'De taks wordt gevestigd op het spaartegoed van een collectieve of individuele spaarrekening en op de theoretische afkoopwaarde van een spaarverzekering, wanneer u 60 wordt en voor die stortingen een belastingvermindering voor pensioensparen kreeg.',
        'Voor pensioensparen bedraagt ze {{pensioensparen.long_term_savings_tax.pension_savings|pct}} %. Voor andere levensverzekeringen met belastingvoordeel is het algemene tarief {{pensioensparen.long_term_savings_tax.general|pct}} %.',
        'De grondslag is het tegoed of de theoretische afkoopwaarde op de dag waarop u 60 wordt: de reserve die door de gekapitaliseerde premies is gevormd.',
        'Wie het contract op of na zijn 55e opent, betaalt de taks niet op 60 maar op de tiende verjaardag van het contract.',
        'De taks wordt betaald door de bank of verzekeraar, die ze op uw tegoed mag inhouden.',
        'Van 2015 tot 2019 werd elk jaar {{pensioensparen.long_term_savings_tax.advance_levy_2015_2019|pct}} % van de taks vooraf geïnd; dat bedrag wordt afgetrokken van de taks die op 60 jaar verschuldigd is.',
        'Wat aan de taks onderworpen is geweest, is daarna vrijgesteld van inkomstenbelasting; die vrijstelling geldt niet voor de vervroegde inning zelf.'
      ],
      fr: [
        'La taxe est établie sur l’épargne d’un compte-épargne collectif ou individuel et sur la valeur de rachat théorique d’une assurance-épargne, lorsque vous atteignez 60 ans et avez obtenu pour ces versements une réduction d’impôt pour épargne-pension.',
        'Pour l’épargne-pension, elle est de {{pensioensparen.long_term_savings_tax.pension_savings|pct}} %. Pour les autres assurances sur la vie ayant bénéficié d’un avantage fiscal, le taux général est de {{pensioensparen.long_term_savings_tax.general|pct}} %.',
        'La base est l’épargne ou la valeur de rachat théorique au jour de vos 60 ans : la réserve constituée par la capitalisation des primes versées.',
        'Si vous ouvrez le contrat à 55 ans ou plus, la taxe n’est pas due à 60 ans mais au dixième anniversaire du contrat.',
        'La taxe est payée par la banque ou l’assureur, qui a le droit de la retenir sur votre épargne.',
        'De 2015 à 2019, une perception anticipée de {{pensioensparen.long_term_savings_tax.advance_levy_2015_2019|pct}} % de la taxe a eu lieu chaque année ; ce montant est déduit de la taxe due à 60 ans.',
        'Ce qui a été soumis à la taxe est ensuite exonéré d’impôt sur les revenus ; cette exonération ne vise pas la perception anticipée elle-même.'
      ]
    },
    cite: {
      nl: `Wet: Wetboek diverse rechten en taksen, ${a('t184', 'nl', 'art. 184')}, ${a('t185', 'nl', 'art. 185')}, ${a('t186', 'nl', 'art. 186')} en ${a('t1871', 'nl', 'art. 187/1')}; ${a('a39', 'nl', 'WIB 92, art. 39, § 2, 4°')} (inkomsten 2026). Benaming: ${a('pv', 'nl', 'parlementaire vraag nr. 1785')}.`,
      fr: `Loi : Code des droits et taxes divers, ${a('t184', 'fr', 'art. 184')}, ${a('t185', 'fr', 'art. 185')}, ${a('t186', 'fr', 'art. 186')} et ${a('t1871', 'fr', 'art. 187/1')} ; ${a('a39', 'fr', 'CIR 92, art. 39, § 2, 4°')} (revenus 2026).`
    }
  },
  actions: { nl: [['early', 'Vervroegd opnemen'], ['index', null]], fr: [['early', 'Retrait anticipé'], ['index', null]] },
  faq: {
    nl: [
      ['Moet ik de anticipatieve heffing zelf betalen?', 'Nee. De taks wordt betaald door de bank of verzekeraar, die ze mag inhouden op uw tegoed.'],
      ['Wordt mijn pensioensparen na de taks nog belast?', 'Wat aan de taks op het lange termijnsparen onderworpen is geweest, is vrijgesteld van inkomstenbelasting.'],
      ['Ik begon pas na mijn 55e. Wanneer betaal ik?', 'Dan is de taks verschuldigd op de tiende verjaardag van het contract, niet op uw 60e verjaardag. Wordt het tegoed vóór die verjaardag uitgekeerd terwijl u al 60 bent, dan is de taks op de dag van de uitkering verschuldigd.'],
      ['Wat was de vervroegde inning van 2015 tot 2019?', 'In die jaren werd elk jaar {{pensioensparen.long_term_savings_tax.advance_levy_2015_2019|pct}} % van de taks vooraf geïnd. Dat bedrag wordt afgetrokken van de taks die op 60 jaar verschuldigd is.']
    ],
    fr: [
      ['Dois-je payer moi-même la taxe à 60 ans ?', 'Non. La taxe est payée par la banque ou l’assureur, qui a le droit de la retenir sur votre épargne.'],
      ['Mon épargne-pension est-elle encore imposée après la taxe ?', 'Ce qui a été soumis à la taxe sur l’épargne à long terme est exonéré d’impôt sur les revenus.'],
      ['J’ai commencé après 55 ans. Quand la taxe est-elle due ?', 'Elle est due au dixième anniversaire du contrat et non à vos 60 ans. Si l’épargne est payée avant cet anniversaire alors que vous avez déjà 60 ans, la taxe est due le jour du paiement.'],
      ['Qu’était la perception anticipée de 2015 à 2019 ?', 'Au cours de ces années, {{pensioensparen.long_term_savings_tax.advance_levy_2015_2019|pct}} % de la taxe a été perçu chaque année par anticipation. Ce montant est déduit de la taxe due à 60 ans.']
    ]
  },
  sources: { nl: ['t184', 't185', 't186', 't1871', 'a39', 'a1459', 'pv'], fr: ['t184', 't185', 't186', 't1871', 'a39', 'a1459'] }
};

PAGES.lts = {
  title: { nl: 'Langetermijnsparen of pensioensparen? | Belastingkaart', fr: 'Épargne à long terme ou épargne-pension ? | Belastingkaart' },
  desc: {
    nl: 'Langetermijnsparen in 2026: {{pensioensparen.reduction_rates.standard|pct}} % op premies van een levensverzekering, een plafond volgens uw beroepsinkomen tot {{pensioensparen.long_term_savings_ceiling.maximum|eur}} euro en een taks van {{pensioensparen.long_term_savings_tax.general|pct}} % op 60 jaar.',
    fr: 'Épargne à long terme en 2026 : {{pensioensparen.reduction_rates.standard|pct}} % sur les primes d’assurance-vie, un plafond lié aux revenus professionnels jusqu’à {{pensioensparen.long_term_savings_ceiling.maximum|eur}} euros et une taxe de {{pensioensparen.long_term_savings_tax.general|pct}} % à 60 ans.'
  },
  h1: { nl: 'Langetermijnsparen of pensioensparen: de verschillen in 2026', fr: 'Épargne à long terme ou épargne-pension : les différences en 2026' },
  lead: {
    nl: 'Langetermijnsparen is de belastingvermindering voor premies van een individuele levensverzekering. Ze bedraagt <b>{{pensioensparen.reduction_rates.standard|pct}} %</b>, maar het plafond hangt af van uw beroepsinkomen, met een maximum van <b>{{pensioensparen.long_term_savings_ceiling.maximum|eur}} euro</b> voor inkomstenjaar 2026. De taks op 60 jaar bedraagt <b>{{pensioensparen.long_term_savings_tax.general|pct}} %</b> in plaats van {{pensioensparen.long_term_savings_tax.pension_savings|pct}} %.',
    fr: 'L’épargne à long terme est la réduction d’impôt pour les primes d’une assurance-vie individuelle. Elle est de <b>{{pensioensparen.reduction_rates.standard|pct}} %</b>, mais son plafond dépend de vos revenus professionnels, avec un maximum de <b>{{pensioensparen.long_term_savings_ceiling.maximum|eur}} euros</b> pour les revenus 2026. La taxe à 60 ans est de <b>{{pensioensparen.long_term_savings_tax.general|pct}} %</b> au lieu de {{pensioensparen.long_term_savings_tax.pension_savings|pct}} %.'
  },
  table: {
    h2: { nl: 'De verschillen in één oogopslag', fr: 'Les différences en un coup d’œil' },
    help: { nl: 'Inkomstenjaar 2026 (aanslagjaar 2027).', fr: 'Revenus 2026 (exercice d’imposition 2027).' },
    head: { nl: ['', 'Pensioensparen', 'Langetermijnsparen'], fr: ['', 'Épargne-pension', 'Épargne à long terme'] },
    rows: {
      nl: [
        [null, 'Wettelijke basis', 'Art. 145/1, 5°, en 145/8 tot 145/16 WIB 92', 'Art. 145/1, 2°, 145/4 en 145/6 WIB 92'],
        [null, 'Product', 'Pensioenspaarfonds, individuele spaarrekening of spaarverzekering', 'Individuele levensverzekering voor een rente of kapitaal bij leven of overlijden'],
        [null, 'Belastingvermindering', '{{pensioensparen.reduction_rates.standard|pct}} %, of {{pensioensparen.reduction_rates.higher_ceiling|pct}} % bij het hogere plafond', '{{pensioensparen.reduction_rates.standard|pct}} %'],
        [null, 'Plafond', 'Vast: 1.050 of {{pensioensparen.ceilings.higher_on_choice|eur}} euro', '{{pensioensparen.long_term_savings_ceiling.first_slice_rate|pct}} % van de eerste {{pensioensparen.long_term_savings_ceiling.first_slice|eur}} euro beroepsinkomen en {{pensioensparen.long_term_savings_ceiling.remainder_rate|pct}} % van het overige, met een maximum van {{pensioensparen.long_term_savings_ceiling.maximum|eur}} euro, verminderd met uitgaven voor de eigen woning'],
        [null, 'Taks op 60 jaar', '{{pensioensparen.long_term_savings_tax.pension_savings|pct}} %', '{{pensioensparen.long_term_savings_tax.general|pct}} %'],
        [null, 'Uitkering vóór de taks', '{{pensioensparen.separate_taxation_rates.pension_savings_payout|pct}} % of {{pensioensparen.separate_taxation_rates.pension_savings_other_payout|pct}} %', '{{pensioensparen.separate_taxation_rates.life_insurance_normal|pct}} % of {{pensioensparen.separate_taxation_rates.life_insurance_other_surrender|pct}} %']
      ],
      fr: [
        [null, 'Base légale', 'Art. 145/1, 5°, et 145/8 à 145/16 CIR 92', 'Art. 145/1, 2°, 145/4 et 145/6 CIR 92'],
        [null, 'Produit', 'Fonds d’épargne-pension, compte-épargne individuel ou assurance-épargne', 'Assurance-vie individuelle pour une rente ou un capital en cas de vie ou de décès'],
        [null, 'Réduction d’impôt', '{{pensioensparen.reduction_rates.standard|pct}} %, ou {{pensioensparen.reduction_rates.higher_ceiling|pct}} % avec le plafond le plus élevé', '{{pensioensparen.reduction_rates.standard|pct}} %'],
        [null, 'Plafond', 'Fixe : 1.050 ou {{pensioensparen.ceilings.higher_on_choice|eur}} euros', '{{pensioensparen.long_term_savings_ceiling.first_slice_rate|pct}} % de la première tranche de {{pensioensparen.long_term_savings_ceiling.first_slice|eur}} euros des revenus professionnels et {{pensioensparen.long_term_savings_ceiling.remainder_rate|pct}} % du surplus, avec un maximum de {{pensioensparen.long_term_savings_ceiling.maximum|eur}} euros, diminué des dépenses pour l’habitation propre'],
        [null, 'Taxe à 60 ans', '{{pensioensparen.long_term_savings_tax.pension_savings|pct}} %', '{{pensioensparen.long_term_savings_tax.general|pct}} %'],
        [null, 'Paiement avant la taxe', '{{pensioensparen.separate_taxation_rates.pension_savings_payout|pct}} % ou {{pensioensparen.separate_taxation_rates.pension_savings_other_payout|pct}} %', '{{pensioensparen.separate_taxation_rates.life_insurance_normal|pct}} % ou {{pensioensparen.separate_taxation_rates.life_insurance_other_surrender|pct}} %']
      ]
    },
    note: {
      nl: 'Het beroepsinkomen voor het plafond van langetermijnsparen is het totale beroepsinkomen, zonder het beroepsinkomen dat afzonderlijk wordt belast. Belastingkaart berekent geen persoonlijke bedragen.',
      fr: 'Les revenus professionnels retenus pour le plafond de l’épargne à long terme sont le total des revenus professionnels, à l’exclusion de ceux imposés distinctement. Belastingkaart ne calcule aucun montant personnel.'
    }
  },
  rules: {
    h2: { nl: 'De voorwaarden van langetermijnsparen', fr: 'Les conditions de l’épargne à long terme' },
    items: {
      nl: [
        'De vermindering geldt voor bijdragen van een aanvullende verzekering tegen ouderdom en vroegtijdige dood, die u ter uitvoering van een individueel levensverzekeringscontract definitief in de Europese Economische Ruimte betaalt.',
        'U sluit het contract zelf af, verzekert alleen uzelf en doet dat vóór 65 jaar; als het voordelen bij leven voorziet, loopt het minstens 10 jaar.',
        'De voordelen bij leven gaan naar uzelf vanaf 65 jaar; bij overlijden gaan ze, als het contract niet aan een lening verbonden is, naar uw echtgenoot of naar bloedverwanten tot de tweede graad.',
        'Het contract mag niet dienen om een lening voor de eigen woning (aangegaan tot en met 2023) of voor een onroerend goed (aangegaan vanaf 2024) weder samen te stellen of te waarborgen.',
        'Het plafond is {{pensioensparen.long_term_savings_ceiling.first_slice_rate|pct}} % van de eerste {{pensioensparen.long_term_savings_ceiling.first_slice|eur}} euro van uw totale beroepsinkomen en {{pensioensparen.long_term_savings_ceiling.remainder_rate|pct}} % van het overige, met een maximum van {{pensioensparen.long_term_savings_ceiling.maximum|eur}} euro, verminderd met de uitgaven voor de eigen woning waarvoor een woningvermindering kan worden verleend. Het geldt samen voor de premies en voor aflossingen van een hypothecaire lening voor een andere woning dan de eigen woning, aangegaan tot en met 2023.',
        'Op 60 jaar is een taks op het lange termijnsparen van {{pensioensparen.long_term_savings_tax.general|pct}} % verschuldigd op de theoretische afkoopwaarde.',
        'Wordt het kapitaal vóór de taks uitgekeerd bij overlijden of bij de normale afloop van het contract, of de afkoopwaarde in de vijf jaren daarvoor, dan geldt {{pensioensparen.separate_taxation_rates.life_insurance_normal|pct}} %. Een afkoop op een ander moment wordt tegen {{pensioensparen.separate_taxation_rates.life_insurance_other_surrender|pct}} % belast.'
      ],
      fr: [
        'La réduction vise les cotisations d’une assurance complémentaire contre la vieillesse et le décès prématuré que vous payez à titre définitif dans l’Espace économique européen en exécution d’un contrat d’assurance-vie individuel.',
        'Vous concluez vous-même le contrat, vous êtes le seul assuré et vous le faites avant 65 ans ; s’il prévoit des avantages en cas de vie, il dure au moins 10 ans.',
        'Les avantages en cas de vie vous reviennent à partir de 65 ans ; en cas de décès, si le contrat n’est pas lié à un emprunt, ils reviennent à votre conjoint ou à vos parents jusqu’au deuxième degré.',
        'Le contrat ne peut pas servir à reconstituer ou à garantir un emprunt pour l’habitation propre (contracté jusqu’en 2023 inclus) ou pour un bien immobilier (contracté à partir de 2024).',
        'Le plafond est de {{pensioensparen.long_term_savings_ceiling.first_slice_rate|pct}} % de la première tranche de {{pensioensparen.long_term_savings_ceiling.first_slice|eur}} euros du total de vos revenus professionnels et de {{pensioensparen.long_term_savings_ceiling.remainder_rate|pct}} % du surplus, avec un maximum de {{pensioensparen.long_term_savings_ceiling.maximum|eur}} euros, diminué des dépenses pour l’habitation propre qui peuvent bénéficier d’une réduction pour l’habitation. Il vaut ensemble pour les primes et pour les remboursements d’un emprunt hypothécaire pour une habitation autre que l’habitation propre, contracté jusqu’en 2023 inclus.',
        'À 60 ans, une taxe sur l’épargne à long terme de {{pensioensparen.long_term_savings_tax.general|pct}} % est due sur la valeur de rachat théorique.',
        'Si le capital est payé avant la taxe au décès ou à l’expiration normale du contrat, ou la valeur de rachat au cours des cinq années qui précèdent, le taux est de {{pensioensparen.separate_taxation_rates.life_insurance_normal|pct}} %. Un rachat à un autre moment est imposé à {{pensioensparen.separate_taxation_rates.life_insurance_other_surrender|pct}} %.'
      ]
    },
    cite: {
      nl: `Wet: ${a('a1451', 'nl', 'WIB 92, art. 145/1, 2° en 3°')}, ${a('a1452', 'nl', 'art. 145/2')}, ${a('a1454', 'nl', 'art. 145/4')}, ${a('a1456', 'nl', 'art. 145/6')}, ${a('a34', 'nl', 'art. 34')} en ${a('a171', 'nl', 'art. 171')} (inkomsten 2026); Wetboek diverse rechten en taksen, ${a('t184', 'nl', 'art. 184')} en ${a('t185', 'nl', 'art. 185')}.`,
      fr: `Loi : ${a('a1451', 'fr', 'CIR 92, art. 145/1, 2° et 3°')}, ${a('a1452', 'fr', 'art. 145/2')}, ${a('a1454', 'fr', 'art. 145/4')}, ${a('a1456', 'fr', 'art. 145/6')}, ${a('a34', 'fr', 'art. 34')} et ${a('a171', 'fr', 'art. 171')} (revenus 2026) ; Code des droits et taxes divers, ${a('t184', 'fr', 'art. 184')} et ${a('t185', 'fr', 'art. 185')}.`
    }
  },
  actions: { nl: [['red', 'Plafond pensioensparen kiezen'], ['index', null]], fr: [['red', 'Choisir le plafond d’épargne-pension'], ['index', null]] },
  faq: {
    nl: [
      ['Is langetermijnsparen hetzelfde als pensioensparen?', 'Nee. Het zijn twee afzonderlijke belastingverminderingen in het WIB 92, elk met een eigen plafond: pensioensparen (art. 145/1, 5°) en premies van een individuele levensverzekering (art. 145/1, 2°).'],
      ['Waarom is mijn plafond voor langetermijnsparen lager dan {{pensioensparen.long_term_savings_ceiling.maximum|eur}} euro?', 'Het plafond hangt af van uw totale beroepsinkomen en wordt verminderd met de uitgaven voor de eigen woning waarvoor een woningvermindering kan worden verleend. {{pensioensparen.long_term_savings_ceiling.maximum|eur}} euro is het maximum voor 2026.'],
      ['Hoeveel bedraagt de taks op 60 jaar bij langetermijnsparen?', 'Voor levensverzekeringen bedraagt de taks op het lange termijnsparen {{pensioensparen.long_term_savings_tax.general|pct}} %, tegenover {{pensioensparen.long_term_savings_tax.pension_savings|pct}} % voor pensioensparen.'],
      ['Mag de levensverzekering dienen voor mijn woonlening?', 'Niet voor langetermijnsparen: het kapitaal mag geen lening voor de eigen woning (aangegaan tot en met 2023) of voor een onroerend goed (aangegaan vanaf 2024) weder samenstellen of waarborgen.']
    ],
    fr: [
      ['L’épargne à long terme est-elle la même chose que l’épargne-pension ?', 'Non. Ce sont deux réductions d’impôt distinctes du CIR 92, chacune avec son propre plafond : l’épargne-pension (art. 145/1, 5°) et les primes d’une assurance-vie individuelle (art. 145/1, 2°).'],
      ['Pourquoi mon plafond d’épargne à long terme est-il inférieur à {{pensioensparen.long_term_savings_ceiling.maximum|eur}} euros ?', 'Le plafond dépend du total de vos revenus professionnels et il est diminué des dépenses pour l’habitation propre qui peuvent bénéficier d’une réduction pour l’habitation. {{pensioensparen.long_term_savings_ceiling.maximum|eur}} euros est le maximum pour 2026.'],
      ['Quel est le taux de la taxe à 60 ans pour l’épargne à long terme ?', 'Pour les assurances sur la vie, la taxe sur l’épargne à long terme est de {{pensioensparen.long_term_savings_tax.general|pct}} %, contre {{pensioensparen.long_term_savings_tax.pension_savings|pct}} % pour l’épargne-pension.'],
      ['L’assurance-vie peut-elle servir pour mon emprunt hypothécaire ?', 'Pas pour l’épargne à long terme : le capital ne peut pas reconstituer ou garantir un emprunt pour l’habitation propre (contracté jusqu’en 2023 inclus) ou pour un bien immobilier (contracté à partir de 2024).']
    ]
  },
  sources: ['a1451', 'a1452', 'a1454', 'a1456', 'a34', 'a171', 't184', 't185', 'idx']
};

PAGES.early = {
  title: { nl: 'Pensioensparen vervroegd opnemen | Belastingkaart', fr: 'Retirer son épargne-pension avant terme | Belastingkaart' },
  desc: {
    nl: 'Pensioensparen opnemen vóór 60: {{pensioensparen.separate_taxation_rates.pension_savings_payout|pct}} % bij pensionering, in de vijf jaren ervoor of bij overlijden, anders {{pensioensparen.separate_taxation_rates.pension_savings_other_payout|pct}} %. Ook welke overdrachten fiscaal als opname tellen.',
    fr: 'Épargne-pension payée avant 60 ans : {{pensioensparen.separate_taxation_rates.pension_savings_payout|pct}} % à la retraite, dans les cinq ans qui précèdent ou au décès, sinon {{pensioensparen.separate_taxation_rates.pension_savings_other_payout|pct}} %. Et quels transferts comptent comme retrait.'
  },
  h1: { nl: 'Pensioensparen vervroegd opnemen: {{pensioensparen.separate_taxation_rates.pension_savings_payout|pct}} % of {{pensioensparen.separate_taxation_rates.pension_savings_other_payout|pct}} %', fr: 'Retrait anticipé de l’épargne-pension : {{pensioensparen.separate_taxation_rates.pension_savings_payout|pct}} % ou {{pensioensparen.separate_taxation_rates.pension_savings_other_payout|pct}} %' },
  lead: {
    nl: 'Neemt u uw pensioenspaartegoed op vóór de taks op 60 jaar, dan wordt het afzonderlijk belast: tegen <b>{{pensioensparen.separate_taxation_rates.pension_savings_payout|pct}} %</b> als de uitkering gebeurt bij uw pensionering op de normale datum, in de vijf jaren daarvoor of na een overlijden, en tegen <b>{{pensioensparen.separate_taxation_rates.pension_savings_other_payout|pct}} %</b> in alle andere gevallen.',
    fr: 'Si votre épargne-pension est payée avant la taxe à 60 ans, elle est imposée distinctement : au taux de <b>{{pensioensparen.separate_taxation_rates.pension_savings_payout|pct}} %</b> si le paiement a lieu à l’occasion de votre mise à la retraite à la date normale, au cours des cinq années qui précèdent ou à l’occasion d’un décès, et au taux de <b>{{pensioensparen.separate_taxation_rates.pension_savings_other_payout|pct}} %</b> dans tous les autres cas.'
  },
  table: {
    h2: { nl: 'Belasting bij uitkering vóór de taks op 60 jaar', fr: 'Imposition d’un paiement avant la taxe à 60 ans' },
    help: { nl: 'Afzonderlijke aanslag op inkomsten uit pensioensparen, inkomstenjaar 2026.', fr: 'Imposition distincte des revenus de l’épargne-pension, revenus 2026.' },
    head: { nl: ['Situatie', 'Tarief', 'Wettelijke basis'], fr: ['Situation', 'Taux', 'Base légale'] },
    rows: {
      nl: [
        [null, 'Uitkering bij uw pensionering op de normale datum', '{{pensioensparen.separate_taxation_rates.pension_savings_payout|pct}} %', 'Art. 171, 1°bis, WIB 92'],
        [null, 'Uitkering in één van de 5 jaren vóór die datum', '{{pensioensparen.separate_taxation_rates.pension_savings_payout|pct}} %', 'Art. 171, 1°bis, WIB 92'],
        [null, 'Uitkering aan een rechtverkrijgende na overlijden', '{{pensioensparen.separate_taxation_rates.pension_savings_payout|pct}} %', 'Art. 171, 1°bis, WIB 92'],
        [null, 'Uitkering op een ander moment', '{{pensioensparen.separate_taxation_rates.pension_savings_other_payout|pct}} %', 'Art. 171, 1°, g, WIB 92']
      ],
      fr: [
        [null, 'Paiement à votre mise à la retraite à la date normale', '{{pensioensparen.separate_taxation_rates.pension_savings_payout|pct}} %', 'Art. 171, 1°bis, CIR 92'],
        [null, 'Paiement au cours d’une des 5 années qui précèdent cette date', '{{pensioensparen.separate_taxation_rates.pension_savings_payout|pct}} %', 'Art. 171, 1°bis, CIR 92'],
        [null, 'Paiement à un ayant cause à l’occasion d’un décès', '{{pensioensparen.separate_taxation_rates.pension_savings_payout|pct}} %', 'Art. 171, 1°bis, CIR 92'],
        [null, 'Paiement à un autre moment', '{{pensioensparen.separate_taxation_rates.pension_savings_other_payout|pct}} %', 'Art. 171, 1°, g, CIR 92']
      ]
    },
    note: {
      nl: 'De afzonderlijke aanslag geldt niet wanneer de belasting volgens de gewone regels voor al uw inkomsten samen lager uitvalt. Belastingkaart berekent geen persoonlijke bedragen.',
      fr: 'L’imposition distincte ne s’applique pas lorsque l’impôt calculé selon les règles ordinaires sur l’ensemble de vos revenus est moins élevé. Belastingkaart ne calcule aucun montant personnel.'
    }
  },
  rules: {
    h2: { nl: 'Wat als opname telt', fr: 'Ce qui compte comme un retrait' },
    items: {
      nl: [
        'Tot de inkomsten uit pensioensparen behoren het tegoed op een collectieve of individuele spaarrekening en de pensioenen, renten, kapitalen en afkoopwaarden van een spaarverzekering.',
        'Ook bepaalde overdrachten tellen als inkomsten: een gedeeltelijke overdracht, een volledige overdracht van een spaarrekening naar een spaarverzekering of omgekeerd, en een overdracht naar een rekening of verzekering die niet aan de wettelijke voorwaarden voldoet.',
        'Gebeurt de uitkering bij uw pensionering op de normale datum, in één van de vijf jaren daarvoor of naar aanleiding van een overlijden, dan geldt een afzonderlijke aanslag van {{pensioensparen.separate_taxation_rates.pension_savings_payout|pct}} %.',
        'In alle andere gevallen geldt een afzonderlijke aanslag van {{pensioensparen.separate_taxation_rates.pension_savings_other_payout|pct}} %.',
        'Vanaf het jaar waarin uw tegoed tegen {{pensioensparen.separate_taxation_rates.pension_savings_payout|pct}} % wordt uitgekeerd, krijgt u geen belastingvermindering voor pensioensparen meer, behalve als de uitkering het gevolg is van uw overlijden.',
        'Opende u het contract op of na uw 55e en wordt het vóór de tiende verjaardag uitgekeerd terwijl u al 60 bent, dan is de taks op het lange termijnsparen verschuldigd op de dag van de uitkering: {{pensioensparen.long_term_savings_tax.pension_savings|pct}} %, of {{pensioensparen.long_term_savings_tax.article_171_f_g|pct}} % als de uitkering niet samenvalt met uw pensionering, de vijf jaren ervoor of een overlijden.'
      ],
      fr: [
        'Les revenus de l’épargne-pension comprennent l’épargne placée sur un compte-épargne collectif ou individuel et les pensions, rentes, capitaux et valeurs de rachat d’une assurance-épargne.',
        'Certains transferts comptent aussi comme revenus : un transfert partiel, un transfert total d’un compte-épargne vers une assurance-épargne ou l’inverse, et un transfert vers un compte ou une assurance qui ne satisfait pas aux conditions légales.',
        'Si le paiement a lieu à l’occasion de votre mise à la retraite à la date normale, au cours d’une des cinq années qui précèdent ou à l’occasion d’un décès, une imposition distincte de {{pensioensparen.separate_taxation_rates.pension_savings_payout|pct}} % s’applique.',
        'Dans tous les autres cas, une imposition distincte de {{pensioensparen.separate_taxation_rates.pension_savings_other_payout|pct}} % s’applique.',
        'À partir de l’année où votre épargne est payée au taux de {{pensioensparen.separate_taxation_rates.pension_savings_payout|pct}} %, vous n’avez plus droit à la réduction pour épargne-pension, sauf si le paiement fait suite à votre décès.',
        'Si vous avez ouvert le contrat à 55 ans ou plus et qu’il est payé avant son dixième anniversaire alors que vous avez déjà 60 ans, la taxe sur l’épargne à long terme est due le jour du paiement : {{pensioensparen.long_term_savings_tax.pension_savings|pct}} %, ou {{pensioensparen.long_term_savings_tax.article_171_f_g|pct}} % si le paiement n’a pas lieu à votre mise à la retraite, au cours des cinq années qui précèdent ou à l’occasion d’un décès.'
      ]
    },
    cite: {
      nl: `Wet: ${a('a171', 'nl', 'WIB 92, art. 171, 1°, g, en 1°bis')}, ${a('a34', 'nl', 'art. 34, § 1, 3°, en § 2')} en ${a('a1459', 'nl', 'art. 145/9')} (inkomsten 2026); Wetboek diverse rechten en taksen, ${a('t184', 'nl', 'art. 184, § 2')} en ${a('t185', 'nl', 'art. 185, § 3')}.`,
      fr: `Loi : ${a('a171', 'fr', 'CIR 92, art. 171, 1°, g, et 1°bis')}, ${a('a34', 'fr', 'art. 34, § 1er, 3°, et § 2')} et ${a('a1459', 'fr', 'art. 145/9')} (revenus 2026) ; Code des droits et taxes divers, ${a('t184', 'fr', 'art. 184, § 2')} et ${a('t185', 'fr', 'art. 185, § 3')}.`
    }
  },
  actions: { nl: [['tax', 'De taks op 60 jaar'], ['index', null]], fr: [['tax', 'La taxe à 60 ans'], ['index', null]] },
  faq: {
    nl: [
      ['Hoeveel belasting betaal ik als ik mijn pensioensparen vóór 60 opneem?', 'Gebeurt de uitkering bij uw pensionering op de normale datum, in de vijf jaren daarvoor of na een overlijden, dan {{pensioensparen.separate_taxation_rates.pension_savings_payout|pct}} %. Anders wordt het tegoed afzonderlijk belast tegen {{pensioensparen.separate_taxation_rates.pension_savings_other_payout|pct}} %.'],
      ['Telt een overstap naar een andere bank als opname?', 'Een gedeeltelijke overdracht, een overdracht tussen een spaarrekening en een spaarverzekering en een overdracht naar een contract dat niet aan de wettelijke voorwaarden voldoet, gelden als inkomsten uit pensioensparen.'],
      ['Krijg ik na een opname nog belastingvermindering?', 'Vanaf het jaar waarin uw tegoed tegen {{pensioensparen.separate_taxation_rates.pension_savings_payout|pct}} % wordt uitgekeerd, krijgt u geen belastingvermindering voor pensioensparen meer, behalve als de uitkering het gevolg is van uw overlijden.'],
      ['Is de afzonderlijke aanslag altijd van toepassing?', 'Nee. Valt de belasting volgens de gewone regels voor al uw inkomsten samen lager uit, dan wordt die toegepast.']
    ],
    fr: [
      ['Combien d’impôt si je retire mon épargne-pension avant 60 ans ?', 'Si le paiement a lieu à votre mise à la retraite à la date normale, au cours des cinq années qui précèdent ou à l’occasion d’un décès, {{pensioensparen.separate_taxation_rates.pension_savings_payout|pct}} %. Sinon, l’épargne est imposée distinctement à {{pensioensparen.separate_taxation_rates.pension_savings_other_payout|pct}} %.'],
      ['Un changement de banque compte-t-il comme un retrait ?', 'Un transfert partiel, un transfert entre un compte-épargne et une assurance-épargne et un transfert vers un contrat qui ne satisfait pas aux conditions légales sont des revenus de l’épargne-pension.'],
      ['Ai-je encore droit à la réduction après un retrait ?', 'À partir de l’année où votre épargne est payée au taux de {{pensioensparen.separate_taxation_rates.pension_savings_payout|pct}} %, vous n’avez plus droit à la réduction pour épargne-pension, sauf si le paiement fait suite à votre décès.'],
      ['L’imposition distincte s’applique-t-elle toujours ?', 'Non. Si l’impôt calculé selon les règles ordinaires sur l’ensemble de vos revenus est moins élevé, c’est celui-là qui s’applique.']
    ]
  },
  sources: ['a171', 'a34', 'a1459', 't184', 't185']
};

// ---- render -------------------------------------------------------------------------------
const card = (cls, h2, body) => `  <section class="card${cls ? ' ' + cls : ''}">
    <h2 class="card-title">${h2}</h2>
${body.trim().split('\n').map(l => '    ' + l).join('\n')}
  </section>`;

function tableHtml(t, lang, route) {
  const head = t.head[lang].map(h => `<th scope="col">${h}</th>`).join('');
  const rows = t.rows[lang].map(([key, label, ...cells]) => {
    const th = key ? `<a href="${rel(route, key, lang)}">${label}</a>` : label;
    return `<tr><th scope="row">${th}</th>${cells.map(c => `<td>${c}</td>`).join('')}</tr>`;
  }).join('\n');
  return `<p class="help">${t.help[lang]}</p>
<div class="table-scroll"><table class="data-table text-table">
<thead><tr>${head}</tr></thead>
<tbody>
${rows}
</tbody></table></div>
<p class="help">${t.note[lang]}</p>`;
}

function render(key, lang) {
  const page = PAGES[key];
  const t = T[lang];
  const [nl, fr] = R[key];
  const route = lang === 'nl' ? nl : fr;
  const other = lang === 'nl' ? fr : nl;
  const up = '../'.repeat(route.split('/').length - 1);
  const crumbs = key === 'index'
    ? `<a href="${up}${lang}/">${t.crumbHome}</a> › ${t.section}`
    : `<a href="${up}${lang}/">${t.crumbHome}</a> › <a href="${rel(route, 'index', lang)}">${t.section}</a> › ${CRUMB[lang][key]}`;
  const rules = card('rules', page.rules.h2[lang], `<ol class="req-list">
${page.rules.items[lang].map(i => `<li>${i}</li>`).join('\n')}
</ol>
<p class="cite">${page.rules.cite[lang]}</p>`);
  const table = card('table-card', page.table.h2[lang], tableHtml(page.table, lang, route));
  // Mapafiscal order: index = rules, table, buttons, FAQ; topic page = table, rules, buttons, FAQ.
  const blocks = key === 'index' ? [rules, table] : [table, rules];
  const actions = page.actions[lang].map(([k, label], i) =>
    `<a class="btn ${i ? 'btn-secondary' : 'btn-primary'}" href="${rel(route, k, lang)}">${label ?? t.all}${i ? '' : ' <span class="arrow" aria-hidden="true">→</span>'}</a>`).join(' ');
  const sources = Array.isArray(page.sources) ? page.sources : page.sources[lang];
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
<link rel="stylesheet" href="${up}css/pensioensparen.css">
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
<main class="container page-main pensioensparen" id="content" tabindex="-1">
  <p class="breadcrumbs">${crumbs}</p>
  <h1>${page.h1[lang]}</h1>
  <p class="updated">${t.updated} <time datetime="${DATE}">${t.updatedLong}</time></p>
  <div class="prose ps-stack">
  <p class="lead">${page.lead[lang]}</p>
${blocks.join('\n')}
  <p class="page-actions">${actions}</p>
  <section class="card faq">
    <h2 class="card-title">${t.faqH2}</h2>
${page.faq[lang].map(([q, ans]) => `    <details><summary>${q}</summary><p>${ans}</p></details>`).join('\n')}
  </section>
  <ul class="trust" aria-label="${t.trustLabel}">
${t.trust(up).map(li => `    <li>${li}</li>`).join('\n')}
  </ul>
${card('sources', t.sourcesH2, `<p class="help">${t.sourcesNote}</p>
<ul class="link-list source-list">
${sources.map(k => `<li><a href="${url(k, lang)}" rel="noopener">${S[k][lang][1]}</a><span>${url(k, lang)} · ${t.org} · ${t.consulted}</span></li>`).join('\n')}
</ul>`)}
  </div>
</main>
${footerHtml(lang, route, other)}
</body>
</html>
`;
}

export const pages = {};
for (const key of Object.keys(R)) for (const lang of ['nl', 'fr']) {
  const route = R[key][lang === 'nl' ? 0 : 1];
  pages[route] = applyHead(fillFigures(render(key, lang)), route);
}
if (process.argv.includes('--check')) {
  const stale = [];
  for (const [route, html] of Object.entries(pages))
    if (await readFile(path.join(WEB, route, 'index.html'), 'utf8').catch(() => '') !== html) stale.push(route);
  if (stale.length) { console.error('Stale pension-savings pages: ' + stale.join(', ') + '\nRun npm run build:pensioensparen'); process.exit(1); }
  console.log('Pension-savings pages are up to date.');
} else if (process.argv[1] && import.meta.url.endsWith(path.basename(process.argv[1]))) {
  for (const [route, html] of Object.entries(pages)) {
    const file = path.join(WEB, route, 'index.html');
    await mkdir(path.dirname(file), { recursive: true });
    await writeFile(file, html);
  }
  console.log(`Wrote ${Object.keys(pages).length} pension-savings pages.`);
}
