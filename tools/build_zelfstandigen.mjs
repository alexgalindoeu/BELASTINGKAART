// Builds the self-employed section (web/nl/zelfstandigen/, web/fr/independants/) from
// tools/lib/zelfstandigen-content.mjs, in the format of Mapafiscal's autonomos/ section:
// answer box, pending calculator (topic pages), table card, explanation cards, second table
// (index), "not covered" list, actions, FAQ, sources, related links and the trust line.
//   node tools/build_zelfstandigen.mjs           write the pages
//   node tools/build_zelfstandigen.mjs --check   exit 1 if a page is missing or stale
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { WEB, SITE } from './lib/pages.mjs';
import { applyHead, escapeAttr } from './lib/head.mjs';
import { navHtml, footerHtml, longDate } from './lib/shell.mjs';
import { PAGES, PAGES_ORDER, SLUGS, ROOT, SOURCES, TERMS, CALC } from './lib/zelfstandigen-content.mjs';

export const UPDATED = '2026-11-27';
const BRAND_SVG = '<svg class="brand-icon" viewBox="0 -2 102 86" aria-hidden="true" focusable="false"><path class="p" fill-rule="evenodd" d="M16,4H62L77,18V28L68,37L84,52V66L70,80H2Z M28,16L25,33H57L62,28V21L57,16Z M23,47L19,68H64L70,62V54L63,47Z"/><polygon class="p2" points="46,80 60,80 99,30 91,18"/></svg>';
const THEME_SVG = '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><circle cx="12" cy="12" r="8"/><path class="fill" d="M12 4a8 8 0 0 1 0 16z"/></svg>';

const T = {
  nl: { skip: 'Naar de inhoud', home: 'Belastingkaart, startpagina', sections: 'Secties', crumbHome: 'Startpagina', section: 'Zelfstandigen',
    theme: ['Thema: automatisch (zoals het systeem). Wijzigen naar licht', 'Thema: automatisch (zoals het systeem)'],
    switchLabel: 'Version française', cta: 'Naar de simulator', updated: 'Bijgewerkt op', short: 'In het kort:',
    footerIntro: '<b>Belastingkaart</b> is een onafhankelijk informatieproject. Geen officiële overheidswebsite en geen fiscaal advies.',
    footerNav: 'Meer over Belastingkaart', lang: 'Taal', faq: 'Veelgestelde vragen', sources: 'Bronnen', consulted: 'Geraadpleegd op',
    more: 'Meer over zelfstandigen', terms: 'Begrippen uit deze pagina', glossary: 'Woordenlijst', glossaryRoot: 'woordenlijst/',
    actions: [['#simulator', 'Naar de simulator'], ['woordenlijst/', 'Naar de woordenlijst']],
    trustLabel: 'Over deze informatie',
    trust: d => [`Bijdragejaar 2026 · inkomsten 2026`, `Nagekeken op <time datetime="${d}">${longDate(d, 'nl')}</time>`, `Bronnen: RSVZ en FOD Financiën · <a href="{L}methodologie/">Methodologie</a>`] },
  fr: { skip: 'Aller au contenu', home: 'Belastingkaart, accueil', sections: 'Sections', crumbHome: 'Accueil', section: 'Indépendants',
    theme: ['Thème : automatique (comme le système). Passer en mode clair', 'Thème : automatique (comme le système)'],
    switchLabel: 'Nederlandse versie', cta: 'Vers le simulateur', updated: 'Mis à jour le', short: 'En bref :',
    footerIntro: '<b>Belastingkaart</b> est un projet d’information indépendant. Ce n’est pas un site officiel des pouvoirs publics ni un conseil fiscal.',
    footerNav: 'En savoir plus sur Belastingkaart', lang: 'Langue', faq: 'Questions fréquentes', sources: 'Sources', consulted: 'Consulté le',
    more: 'En savoir plus sur les indépendants', terms: 'Notions de cette page', glossary: 'Lexique', glossaryRoot: 'lexique/',
    actions: [['#simulator', 'Vers le simulateur'], ['lexique/', 'Vers le lexique']],
    trustLabel: 'À propos de ces informations',
    trust: d => [`Année de cotisation 2026 · revenus 2026`, `Vérifié le <time datetime="${d}">${longDate(d, 'fr')}</time>`, `Sources : INASTI et SPF Finances · <a href="{L}methodologie/">Méthodologie</a>`] }
};

export const routeOf = (key, lang) => ROOT[lang] + SLUGS[key][lang === 'nl' ? 0 : 1];

function table(tb, label) {
  const head = tb.head.map((h, i) => `<th scope="col"${i && !tb.text ? ' class="num"' : ''}>${h}</th>`).join('');
  const rows = tb.rows.map(r => `<tr>${r.map((c, i) => i ? `<td${tb.text ? '' : ' class="num"'}>${c}</td>` : `<th scope="row">${c}</th>`).join('')}</tr>`).join('');
  return `<div class="table-wrap" tabindex="0" role="region" aria-label="${escapeAttr(label)}"><table class="data-table${tb.text ? ' text-table' : ''}"><thead><tr>${head}</tr></thead><tbody>${rows}</tbody></table></div>`;
}
const tableCard = (tb, id) => `<section class="card table-card zs-table" id="${id}"><h2 class="card-title">${tb.title}</h2>
    <p class="help">${tb.help}</p>
    ${table(tb, tb.title)}${tb.after ? `\n    <p class="help">${tb.after}</p>` : ''}
  </section>`;
const card = ([title, body]) => `<section class="card"><h2 class="card-title">${title}</h2>${body}</section>`;
const listCard = ([title, items]) => `<section class="card"><h2 class="card-title">${title}</h2><ul>${items.map(i => `<li>${i}</li>`).join('')}</ul></section>`;

function calcBlock(lang, L) {
  const c = CALC[lang];
  return `<form class="quickcalc zs-calc" id="zs-calc" autocomplete="off" novalidate aria-labelledby="zs-calc-title" onsubmit="return false">
    <h2 class="zs-calc-title" id="zs-calc-title">${c.title}</h2>
    <div class="quickcalc-fields">
      <div class="field"><label for="zs-income">${c.income}</label><input id="zs-income" name="zsIncome" type="text" inputmode="decimal" placeholder="—"></div>
      <div class="field"><label for="zs-category">${c.category}</label><select id="zs-category" name="zsCategory">${c.options.map(([v, l]) => `<option value="${v}">${l}</option>`).join('')}</select></div>
    </div>
    <div class="quickcalc-res" aria-live="polite">
      <div class="quickcalc-figure"><span class="figure-xl" aria-hidden="true">—</span><span class="quickcalc-label">${c.unit}</span><span class="quickcalc-pending">${c.pending}</span></div>
      <p class="quickcalc-sentence">${c.sentence}</p>
      <div class="quickcalc-actions"><a class="btn btn-primary" href="${L}#simulator">${c.go} <span class="arrow" aria-hidden="true">→</span></a><a class="btn btn-text" href="${L}methodologie/">${c.method}</a></div>
      <p class="quickcalc-note">${c.note}</p>
    </div>
  </form>`;
}

export function renderSectionPage(key, lang) {
  const t = T[lang], p = PAGES[key][lang];
  const route = routeOf(key, lang), nl = routeOf(key, 'nl'), fr = routeOf(key, 'fr');
  const other = lang === 'nl' ? fr : nl;
  const up = '../'.repeat(route.split('/').length - 1);
  const L = `${up}${lang}/`;
  const G = `${L}${t.glossaryRoot}`;
  const fill = s => s.replaceAll('{G}', G).replaceAll('{L}', L);
  const crumbs = key === 'index' ? `<a href="${L}">${t.crumbHome}</a> › ${p.crumb}` : `<a href="${L}">${t.crumbHome}</a> › <a href="../">${t.section}</a> › ${p.crumb}`;
  const blocks = [];
  if (key !== 'index') blocks.push(calcBlock(lang, L));
  blocks.push('<div class="prose zs-prose">');
  // Index: intro card, then the table (Mapafiscal's "paso a paso"); topic pages: table first.
  if (key === 'index') blocks.push(...p.cards.map(card), tableCard(p.table, 'stappen'), ...p.cards2.map(card));
  else blocks.push(tableCard(p.table, 'stappen'), ...p.cards.map(card));
  if (p.table2) blocks.push(tableCard(p.table2, 'categorieen'));
  if (p.lists) blocks.push(...p.lists.map(listCard));
  if (p.notCovered) blocks.push(listCard(p.notCovered));
  blocks.push(`<div class="page-actions">${t.actions.map(([h, label], i) => `<a class="btn ${i ? 'btn-secondary' : 'btn-primary'}" href="${L}${h}">${label}${i ? '' : ' <span class="arrow" aria-hidden="true">→</span>'}</a>`).join(' ')}</div>`);
  blocks.push(`<section class="card faq" id="faq"><h2 class="card-title">${t.faq}</h2>${p.faq.map(([q, a]) => `<details><summary>${q}</summary><p>${a}</p></details>`).join('')}</section>`);
  blocks.push(`<section class="card zs-sources" id="bronnen"><h2 class="card-title">${t.sources}</h2><ul class="link-list">${p.sources.map(k => {
    const [url, label, date] = SOURCES[k][lang];
    return `<li><a href="${url}" rel="noopener">${label}</a><span>${t.consulted} ${date}</span></li>`;
  }).join('')}</ul></section>`);
  const more = PAGES_ORDER.filter(k => k !== key).map(k => `<li><a href="${up}${routeOf(k, lang)}">${PAGES[k][lang].crumb}</a></li>`).join('');
  const terms = p.terms.map(k => { const [ns, nlabel, fs, flabel] = TERMS[k]; return `<a href="${G}${lang === 'nl' ? ns : fs}">${lang === 'nl' ? nlabel : flabel}</a>`; }).join(' · ');
  blocks.push(`<section class="card"><h2 class="card-title">${t.more}</h2><ul class="link-list">${more}</ul><p>${t.terms}${lang === 'fr' ? ' :' : ':'} ${terms} · <a href="${G}">${t.glossary}</a></p></section>`);
  blocks.push('</div>');
  blocks.push(`<ul class="trust" aria-label="${t.trustLabel}">${t.trust(UPDATED).map(i => `<li>${fill(i)}</li>`).join('')}</ul>`);
  const html = `<!doctype html>
<html lang="${lang}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${escapeAttr(p.title)}</title>
<meta name="description" content="${escapeAttr(p.description)}">
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
<link rel="stylesheet" href="${up}css/zelfstandigen.css">
<script defer src="${up}config.js"></script>
<script defer src="${up}js/menu.js"></script>
<script defer src="${up}js/ui.js"></script>
</head>
<body class="page" data-lang="${lang}">
<a class="skip-link" href="#content">${t.skip}</a>
<header class="appbar">
  <div class="appbar-in">
    <a class="brand" href="${L}" aria-label="${t.home}">${BRAND_SVG}<span class="brand-name">Belastingkaart</span></a>
    ${navHtml(lang, route)}
    <div class="appbar-end">
      <button class="btn-icon theme-btn" id="theme-toggle" type="button" aria-label="${t.theme[0]}" title="${t.theme[1]}">${THEME_SVG}</button>
      <a class="lang-switch" href="${up}${other}" hreflang="${lang === 'nl' ? 'fr-BE' : 'nl-BE'}" lang="${lang === 'nl' ? 'fr' : 'nl'}" aria-label="${t.switchLabel}">${lang === 'nl' ? 'FR' : 'NL'}</a>
      <a class="btn btn-primary btn-sm btn-cta" href="${L}#simulator">${t.cta}</a>
    </div>
  </div>
</header>
<main class="container page-main zs-page" id="content" tabindex="-1">
  <p class="breadcrumbs">${crumbs}</p>
  <h1>${p.h1}</h1>
  <p class="updated">${t.updated} <time datetime="${UPDATED}">${longDate(UPDATED, lang)}</time></p>
  <p class="summary-box slash"><b>${t.short}</b> ${p.summary}</p>
  ${blocks.map(fill).join('\n  ')}
</main>
${footerHtml(lang, route)}
</body>
</html>
`;
  return applyHead(html, route);
}

export function allSectionPages() {
  const out = [];
  for (const key of PAGES_ORDER) for (const lang of ['nl', 'fr']) out.push({ key, lang, route: routeOf(key, lang), html: renderSectionPage(key, lang) });
  return out;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const check = process.argv.includes('--check');
  const stale = [];
  for (const page of allSectionPages()) {
    const file = path.join(WEB, page.route, 'index.html');
    const current = await readFile(file, 'utf8').catch(() => null);
    if (current === page.html) continue;
    stale.push(page.route);
    if (!check) { await mkdir(path.dirname(file), { recursive: true }); await writeFile(file, page.html); }
  }
  if (check && stale.length) { console.error('Self-employed pages missing or stale: ' + stale.join(', ') + '\nRun npm run build:zelfstandigen'); process.exit(1); }
  console.log(check ? 'Self-employed pages are up to date.' : `Wrote ${stale.length} self-employed page(s).`);
}
