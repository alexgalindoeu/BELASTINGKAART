// Generates the validation pages web/nl/validatie/ and web/fr/validation/ from
// web/data/parameters.json (itself generated from params/<income-year>/*.yaml).
// The pages list every parameter with its status and provenance only: status, period,
// income and assessment year, official source link and retrieval date. They never show
// a parameter value, amount, rate or the notes (which may quote amounts).
//   node tools/generate_validation_page.mjs           write both pages
//   node tools/generate_validation_page.mjs --check   exit 1 if a page is stale
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { WEB } from './lib/pages.mjs';
import { renderPage, INFO_PAGES, longDate } from './lib/shell.mjs';
import { escapeAttr } from './lib/head.mjs';

const META = {
  nl: ['Validatie van fiscale parameters | Belastingkaart', 'Hoe Belastingkaart elke fiscale parameter controleert: status, geldigheidsperiode, officiële bron, raadpleegdatum en tests in R en JavaScript.'],
  fr: ['Validation des paramètres fiscaux | Belastingkaart', 'Comment Belastingkaart vérifie chaque paramètre fiscal : statut, période de validité, source officielle, date de consultation et tests en R et JavaScript.']
};

// Human labels per parameter path. Periods are shown separately, so period entries share a label.
const LABELS = [
  [/^federal\.personal_income_tax\.brackets$/, 'Belastingschalen van de personenbelasting', 'Barème de l’impôt des personnes physiques'],
  [/^federal\.personal_income_tax\.basic_personal_tax_allowance$/, 'Belastingvrije som (basisbedrag)', 'Quotité exemptée d’impôt (montant de base)'],
  [/^social_security\.employee_contribution\.rate$/, 'Persoonlijke RSZ-bijdrage van werknemers', 'Cotisation personnelle ONSS des travailleurs'],
  [/^social_security\.employee_contribution\.work_bonus\.method$/, 'Werkbonus: berekeningsmethode', 'Bonus à l’emploi : méthode de calcul'],
  [/^social_security\.employee_contribution\.work_bonus\.periods\./, 'Werkbonus: loongrenzen en bedragen voor de periode', 'Bonus à l’emploi : plafonds et montants pour la période'],
  [/^payroll\.professional_withholding$/, 'Bedrijfsvoorheffing: regels en sleutelformule', 'Précompte professionnel : règles et formule-clé'],
  [/^payroll\.professional_expenses$/, 'Forfaitaire beroepskosten', 'Frais professionnels forfaitaires'],
  [/^payroll\.special_social_security_contribution\.method$/, 'Bijzondere bijdrage voor de sociale zekerheid: methode', 'Cotisation spéciale pour la sécurité sociale : méthode'],
  [/^zelfstandigen\.contributions_2026$/, 'Zelfstandigen: sociale bijdragen 2026', 'Indépendants : cotisations sociales 2026'],
  [/^zelfstandigen\.spouse_income_limit$/, 'Meewerkende echtgenoot: inkomensgrens', 'Conjoint aidant : plafond de revenus'],
  [/^zelfstandigen\.affiliation_fine$/, 'Zelfstandigen: boete bij niet-aansluiting', 'Indépendants : amende pour défaut d’affiliation'],
  [/^zelfstandigen\.side_occupation_reduced_band$/, 'Zelfstandige in bijberoep: verminderde bijdrage', 'Indépendant complémentaire : cotisation réduite'],
  [/^pensioensparen\.ceilings$/, 'Pensioensparen: plafonds', 'Épargne-pension : plafonds'],
  [/^pensioensparen\.indexation_base_amounts$/, 'Pensioensparen: basisbedragen vóór indexering', 'Épargne-pension : montants de base avant indexation'],
  [/^pensioensparen\.reduction_rates$/, 'Pensioensparen: tarief van de belastingvermindering', 'Épargne-pension : taux de la réduction d’impôt'],
  [/^pensioensparen\.long_term_savings_ceiling$/, 'Langetermijnsparen: plafond', 'Épargne à long terme : plafond'],
  [/^pensioensparen\.long_term_savings_tax$/, 'Taks op het langetermijnsparen', 'Taxe sur l’épargne à long terme'],
  [/^pensioensparen\.separate_taxation_rates$/, 'Pensioensparen en levensverzekering: afzonderlijke aanslagvoeten', 'Épargne-pension et assurance-vie : taux distincts'],
  [/^wonen\.reduced_rate_only_own_home$/, 'Verkooprecht: verlaagd tarief enige eigen woning', 'Droit de vente : taux réduit habitation propre unique'],
  [/^wonen\.announced_reduced_rate_2027$/, 'Verkooprecht: aangekondigd tarief vanaf 2027', 'Droit de vente : taux annoncé à partir de 2027'],
  [/^wonen\.general_rate$/, 'Verkooprecht: algemeen tarief', 'Droit de vente : taux général'],
  [/^wonen\.supplementary_duties_surcharge$/, 'Verkooprecht: belastingverhoging op aanvullende rechten', 'Droit de vente : majoration des droits complémentaires'],
  [/^wonen\.cadastral_income_indexation$/, 'Kadastraal inkomen: indexatiecoëfficiënt', 'Revenu cadastral : coefficient d’indexation'],
  [/^payroll\.special_social_security_contribution\.periods\./, 'Bijzondere bijdrage voor de sociale zekerheid: schaal voor de periode', 'Cotisation spéciale pour la sécurité sociale : barème pour la période']
];
const STATUS = {
  nl: { confirmed: 'Bevestigd', provisional: 'Voorlopig', pending: 'In afwachting' },
  fr: { confirmed: 'Confirmé', provisional: 'Provisoire', pending: 'En attente' }
};
const CHIP = { confirmed: 'ok', provisional: 'warn', pending: 'bad' };
const JURISDICTION = {
  nl: { federal: 'Federaal', flanders: 'Vlaams Gewest', brussels: 'Brussels Hoofdstedelijk Gewest', wallonia: 'Waals Gewest', municipal: 'Gemeentelijk' },
  fr: { federal: 'Fédéral', flanders: 'Région flamande', brussels: 'Région de Bruxelles-Capitale', wallonia: 'Région wallonne', municipal: 'Communal' }
};
const AUTHORITY = [
  [/(^|\.)(fin\.belgium\.be|finances\.belgium\.be|minfin\.fgov\.be)$/, 'FOD Financiën', 'SPF Finances'],
  [/(^|\.)socialsecurity\.be$/, 'RSZ', 'ONSS'],
  [/(^|\.)belasting\.vlaanderen\.be$/, 'Vlaamse Belastingdienst', 'Service flamand des impôts'],
  [/(^|\.)vlaanderen\.be$/, 'Vlaamse overheid', 'Autorités flamandes'],
  [/(^|\.)fiscaliteit\.brussels$/, 'Brussel Fiscaliteit', 'Bruxelles Fiscalité'],
  [/(^|\.)finances\.wallonie\.be$/, 'SPW Financiën', 'SPW Finances'],
  [/(^|\.)ejustice\.just\.fgov\.be$/, 'Belgisch Staatsblad', 'Moniteur belge'],
  [/(^|\.)statbel\.fgov\.be$/, 'Statbel', 'Statbel'],
  [/(^|\.)(rsvz\.be|inasti\.be)$/, 'RSVZ', 'INASTI'],
  [/(^|\.)(emploi\.belgique\.be|werk\.belgie\.be)$/, 'FOD Werkgelegenheid', 'SPF Emploi']
];
const TXT = {
  nl: {
    id: 'Technische sleutel', status: 'Status', period: 'Geldigheidsperiode', years: 'Inkomstenjaar / aanslagjaar',
    jurisdiction: 'Bevoegdheid', source: 'Officiële bron', expected: 'Officiële bron die we opvolgen', extra: 'Aanvullende officiële bron',
    retrieved: 'Geraadpleegd op', from: 'vanaf', to: 'tot en met', open: 'geen einddatum vermeld', unset: 'nog niet vastgesteld',
    noAssessment: 'niet van toepassing of nog niet vastgesteld', none: 'geen', count: (c, p, q) => `${c} bevestigd, ${p} voorlopig, ${q} in afwachting.`,
    summary: 'Belastingkaart berekent alleen met bevestigde parameters uit officiële bronnen. Is een noodzakelijke parameter niet bevestigd, dan wordt het resultaat dat ervan afhangt niet getoond.'
  },
  fr: {
    id: 'Clé technique', status: 'Statut', period: 'Période de validité', years: 'Année de revenus / exercice d’imposition',
    jurisdiction: 'Compétence', source: 'Source officielle', expected: 'Source officielle que nous suivons', extra: 'Source officielle complémentaire',
    retrieved: 'Consulté le', from: 'à partir du', to: 'jusqu’au', open: 'pas de date de fin indiquée', unset: 'pas encore établie',
    noAssessment: 'sans objet ou pas encore établi', none: 'aucune', count: (c, p, q) => `${c} confirmé${c > 1 ? 's' : ''}, ${p} provisoire${p > 1 ? 's' : ''}, ${q} en attente.`,
    summary: 'Belastingkaart calcule uniquement avec des paramètres confirmés issus de sources officielles. Si un paramètre nécessaire n’est pas confirmé, le résultat qui en dépend n’est pas affiché.'
  }
};

export function collectParameters(data) {
  const out = [];
  (function walk(node, keys) {
    if (!node || typeof node !== 'object' || Array.isArray(node)) return;
    if ('status' in node && 'source_url' in node) { out.push({ id: keys.join('.'), p: node }); return; }
    for (const k of Object.keys(node)) walk(node[k], [...keys, k]);
  })(data, []);
  return out;
}

const label = (id, lang) => {
  const hit = LABELS.find(([re]) => re.test(id));
  return hit ? hit[lang === 'nl' ? 1 : 2] : id;
};
const authority = (url, lang) => {
  try {
    const host = new URL(url).hostname.toLowerCase();
    const hit = AUTHORITY.find(([re]) => re.test(host));
    return hit ? hit[lang === 'nl' ? 1 : 2] : host;
  } catch { return null; }
};
const date = (iso, lang) => /^\d{4}-\d{2}-\d{2}$/.test(String(iso)) ? `<time datetime="${iso}">${longDate(iso, lang)}</time>` : null;

function period(p, lang) {
  const t = TXT[lang], from = date(p.effective_from, lang), to = date(p.effective_to, lang);
  if (from && to) return `${t.from} ${from} ${t.to} ${to}`;
  if (from) return `${t.from} ${from}, ${t.open}`;
  if (to) return `${t.to} ${to}`;
  return t.unset;
}

function card({ id, p }, lang) {
  const t = TXT[lang];
  const link = (url, kind) => url ? `<div><dt>${kind}</dt><dd><a href="${escapeAttr(url)}" rel="noopener">${authority(url, lang)}</a> <span class="param-host">(${escapeAttr(new URL(url).hostname)})</span></dd></div>` : '';
  const extras = Object.entries(p).filter(([k, v]) => k.endsWith('_url') && k !== 'source_url' && v).map(([, v]) => link(v, t.extra)).join('');
  return `<li class="param" id="p-${id.replace(/[^a-z0-9]+/gi, '-')}">
  <h3>${label(id, lang)}</h3>
  <dl>
    <div><dt>${t.status}</dt><dd><span class="chip ${CHIP[p.status]}">${STATUS[lang][p.status]}</span></dd></div>
    <div><dt>${t.period}</dt><dd>${period(p, lang)}</dd></div>
    <div><dt>${t.years}</dt><dd>${p.income_year ?? t.unset} / ${p.assessment_year ?? t.noAssessment}</dd></div>
    <div><dt>${t.jurisdiction}</dt><dd>${JURISDICTION[lang][p.jurisdiction] ?? escapeAttr(p.jurisdiction)}</dd></div>
    ${link(p.source_url, p.status === 'pending' ? t.expected : t.source)}${extras}
    <div><dt>${t.retrieved}</dt><dd>${date(p.retrieved_at, lang) ?? t.unset}</dd></div>
    <div><dt>${t.id}</dt><dd><code>${escapeAttr(id)}</code></dd></div>
  </dl>
</li>`;
}

const BODY = {
  nl: `<section>
  <h2>Twee motoren, hetzelfde resultaat</h2>
  <p>De berekening bestaat twee keer: een referentiemotor in R en de motor van de website in JavaScript, die in je browser draait. Elke regel krijgt tests in beide talen, ook voor grenzen, afrondingen en uitzonderingen, en beide motoren moeten in die tests hetzelfde resultaat geven. De website toont een nettoloon alleen als alle noodzakelijke regels bevestigd en getest zijn.</p>
</section>
<section>
  <h2>Drie statussen</h2>
  <p>Elke fiscale parameter in Belastingkaart heeft een status:</p>
  <ul>
    <li><b>Bevestigd</b>: de waarde, het toepassingsgebied en de geldigheidsperiode staan in een officiële bron.</li>
    <li><b>Voorlopig</b>: de waarde staat in een officiële bron, maar het precieze toepassingsgebied of de geldigheid moet nog worden gecontroleerd.</li>
    <li><b>In afwachting</b>: de officiële bron is nog niet gepubliceerd of nog niet gecontroleerd. We schatten de waarde nooit.</li>
  </ul>
  <p>Een voorlopige of ontbrekende parameter blokkeert elke publieke berekening die ervan afhangt.</p>
</section>
<section>
  <h2>Alleen officiële bronnen</h2>
  <p>Bij elke parameter noteren we de bevoegdheid, het inkomstenjaar en het aanslagjaar (apart, nooit uit elkaar afgeleid), de geldigheidsperiode, de bron, de raadpleegdatum, de eenheid en de afrondingsregel. Een automatische controle weigert elke bron die geen HTTPS-pagina van een Belgische overheidsdienst is, zoals de FOD Financiën, de RSZ, de gewestelijke belastingdiensten of het Belgisch Staatsblad.</p>
</section>`,
  fr: `<section>
  <h2>Deux moteurs, le même résultat</h2>
  <p>Le calcul existe deux fois : un moteur de référence en R et le moteur du site en JavaScript, qui tourne dans votre navigateur. Chaque règle est testée dans les deux langages, y compris les seuils, les arrondis et les exceptions, et les deux moteurs doivent donner le même résultat dans ces tests. Le site n’affiche un salaire net que si toutes les règles nécessaires sont confirmées et testées.</p>
</section>
<section>
  <h2>Trois statuts</h2>
  <p>Chaque paramètre fiscal de Belastingkaart a un statut :</p>
  <ul>
    <li><b>Confirmé</b> : la valeur, le champ d’application et la période de validité figurent dans une source officielle.</li>
    <li><b>Provisoire</b> : la valeur figure dans une source officielle, mais le champ d’application exact ou la validité doivent encore être vérifiés.</li>
    <li><b>En attente</b> : la source officielle n’est pas encore publiée ou pas encore vérifiée. Nous n’estimons jamais la valeur.</li>
  </ul>
  <p>Un paramètre provisoire ou manquant bloque tout calcul public qui en dépend.</p>
</section>
<section>
  <h2>Uniquement des sources officielles</h2>
  <p>Pour chaque paramètre, nous enregistrons la compétence, l’année de revenus et l’exercice d’imposition (séparément, jamais déduits l’un de l’autre), la période de validité, la source, la date de consultation, l’unité et la règle d’arrondi. Un contrôle automatique refuse toute source qui n’est pas une page HTTPS d’un service public belge, comme le SPF Finances, l’ONSS, les administrations fiscales régionales ou le Moniteur belge.</p>
</section>`
};

export function validationPages(data) {
  const params = collectParameters(data);
  const counts = s => params.filter(x => x.p.status === s).length;
  const [nlRoute, frRoute] = INFO_PAGES.validation;
  return Object.fromEntries(['nl', 'fr'].map(lang => {
    const t = TXT[lang];
    const list = `<section>
  <h2>${lang === 'nl' ? 'Overzicht van de parameters' : 'Liste des paramètres'}</h2>
  <p>${lang === 'nl' ? `Inkomstenjaar ${data.income_year}, aanslagjaar ${data.assessment_year}. Gegenereerd uit de parameterbestanden van Belastingkaart op` : `Année de revenus ${data.income_year}, exercice d’imposition ${data.assessment_year}. Généré à partir des fichiers de paramètres de Belastingkaart le`} ${date(data.generated_at, lang)}. ${t.count(counts('confirmed'), counts('provisional'), counts('pending'))}</p>
  <p>${lang === 'nl' ? 'Deze pagina toont alleen de status en de herkomst van elke parameter, geen bedragen of percentages.' : 'Cette page indique uniquement le statut et l’origine de chaque paramètre, sans montants ni pourcentages.'}</p>
  <ol class="param-list">
${params.map(x => card(x, lang)).join('\n')}
  </ol>
</section>`;
    const route = lang === 'nl' ? nlRoute : frRoute;
    const html = renderPage({
      lang, route, pair: lang === 'nl' ? frRoute : nlRoute,
      title: META[lang][0], description: META[lang][1],
      h1: lang === 'nl' ? 'Hoe we de parameters controleren' : 'Comment nous vérifions les paramètres',
      crumb: lang === 'nl' ? 'Validatie' : 'Validation',
      updated: data.generated_at,
      lead: lang === 'nl' ? 'Hoe elke fiscale parameter wordt gecontroleerd, met de status en de officiële bron van elke parameter.' : 'Comment chaque paramètre fiscal est vérifié, avec le statut et la source officielle de chacun.',
      summary: t.summary,
      body: BODY[lang] + '\n' + list,
      actions: lang === 'nl' ? [['bronnen/', 'Onze officiële bronnen'], ['methodologie/', 'Hoe we rekenen']] : [['sources/', 'Nos sources officielles'], ['methodologie/', 'Notre méthode de calcul']]
    });
    return [route, html];
  }));
}

const isMain = process.argv[1] && path.resolve(process.argv[1]) === path.resolve(new URL(import.meta.url).pathname);
if (isMain) {
  const data = JSON.parse(await readFile(path.join(WEB, 'data/parameters.json'), 'utf8'));
  const pages = validationPages(data);
  const check = process.argv.includes('--check');
  const stale = [];
  for (const [route, html] of Object.entries(pages)) {
    const file = path.join(WEB, route, 'index.html');
    const current = await readFile(file, 'utf8').catch(() => '');
    if (current === html) continue;
    stale.push(route);
    if (!check) { await mkdir(path.dirname(file), { recursive: true }); await writeFile(file, html); }
  }
  if (check && stale.length) { console.error('Validation page stale: ' + stale.join(', ') + '\nRun npm run build:validation'); process.exit(1); }
  console.log(check ? 'Validation pages are up to date.' : `Wrote ${stale.length} validation page(s).`);
}
