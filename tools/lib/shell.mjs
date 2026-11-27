// Shared page shell: the static header nav and the footer of EVERY page (navHtml, footerHtml,
// applied to hand-written pages by tools/apply_shell.mjs and used by every generator), and
// the information-page templates (renderPage). The <head> block is added by applyHead().
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import path from 'node:path';
import { SITE, WEB } from './pages.mjs';
import { applyHead, escapeAttr } from './head.mjs';

// The menu registry of the site (web/js/menu.js) is the single source for the static header
// nav and the footer links of every page, generated or hand-written (tools/apply_shell.mjs).
const menuContext = { window: {} };
vm.runInNewContext(readFileSync(path.join(WEB, 'js/menu.js'), 'utf8'), menuContext);
export const MENU = menuContext.window.BKMenu;

const BRAND_SVG = '<svg class="brand-icon" viewBox="0 -2 102 86" aria-hidden="true" focusable="false"><path class="p" fill-rule="evenodd" d="M16,4H62L77,18V28L68,37L84,52V66L70,80H2Z M28,16L25,33H57L62,28V21L57,16Z M23,47L19,68H64L70,62V54L63,47Z"/><polygon class="p2" points="46,80 60,80 99,30 91,18"/></svg>';
const THEME_SVG = '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><circle cx="12" cy="12" r="8"/><path class="fill" d="M12 4a8 8 0 0 1 0 16z"/></svg>';

// Information pages, NL route -> FR route.
export const INFO_PAGES = {
  about: ['nl/over-belastingkaart/', 'fr/a-propos/'],
  legal: ['nl/juridische-informatie/', 'fr/mentions-legales/'],
  cookies: ['nl/cookies/', 'fr/cookies/'],
  disclaimer: ['nl/disclaimer/', 'fr/avertissement/'],
  validation: ['nl/validatie/', 'fr/validation/']
};

const T = {
  nl: {
    skip: 'Naar de inhoud', home: 'Belastingkaart, startpagina', sections: 'Secties',
    theme: ['Thema: automatisch (zoals het systeem). Wijzigen naar licht', 'Thema: automatisch (zoals het systeem)'],
    switchLabel: 'Version française', cta: 'Naar de simulator', crumbHome: 'Startpagina',
    updated: 'Bijgewerkt op', months: ['januari', 'februari', 'maart', 'april', 'mei', 'juni', 'juli', 'augustus', 'september', 'oktober', 'november', 'december'],
    footerIntro: '<b>Belastingkaart</b> is een onafhankelijk informatieproject. Geen officiële overheidswebsite en geen fiscaal advies.',
    footerNav: 'Meer over Belastingkaart',
    footerSmall: 'Inkomstenjaar 2026 · aanslagjaar 2027 · Alleen officiële bronnen.'
  },
  fr: {
    skip: 'Aller au contenu', home: 'Belastingkaart, accueil', sections: 'Sections',
    theme: ['Thème : automatique (comme le système). Passer en mode clair', 'Thème : automatique (comme le système)'],
    switchLabel: 'Nederlandse versie', cta: 'Vers le simulateur', crumbHome: 'Accueil',
    updated: 'Mis à jour le', months: ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'],
    footerIntro: '<b>Belastingkaart</b> est un projet d’information indépendant. Ce n’est pas un site officiel des pouvoirs publics ni un conseil fiscal.',
    footerNav: 'En savoir plus sur Belastingkaart',
    footerSmall: 'Revenus 2026 · exercice d’imposition 2027 · Uniquement des sources officielles.'
  }
};

export const longDate = (iso, lang) => {
  const [y, m, d] = iso.split('-').map(Number);
  return `${lang === 'fr' && d === 1 ? '1er' : d} ${T[lang].months[m - 1]} ${y}`;
};

const upOf = route => '../'.repeat(route.split('/').length - 1);
const linkTo = (lang, route, href) => `${upOf(route)}${lang}/${href}`;
const isCurrent = (lang, route, href) => !href.includes('#') && `${lang}/${href}` === route;

// Static header nav (the no-JavaScript fallback of js/ui.js), from MENU.NAV.
export function navHtml(lang, route) {
  const links = MENU.NAV[lang].map(it =>
    `      <a href="${linkTo(lang, route, it.href)}"${isCurrent(lang, route, it.href) ? ' aria-current="page"' : ''}>${it.label}</a>`).join('\n');
  return `<nav class="nav" aria-label="${T[lang].sections}">\n${links}\n    </nav>`;
}

// Footer, in the reference layout: intro, three columns of links, the dates line and the
// legal links in a bottom row. Columns come from the drawer groups: the first five tools, the
// last five topics (guides and glossary included) and the about group; the legal row is the
// drawer's legal group.
const FOOTER_COLS = { nl: ['Berekenen', 'Ontdek', 'Belastingkaart'], fr: ['Calculer', 'Découvrir', 'Belastingkaart'] };
export function footerHtml(lang, route) {
  const t = T[lang];
  const groups = MENU.GROUPS[lang];
  const a = it => `<a href="${linkTo(lang, route, it.href)}"${isCurrent(lang, route, it.href) ? ' aria-current="page"' : ''}>${it.label}</a>`;
  const cols = FOOTER_COLS[lang].map((title, i) =>
    `<div class="footer-col"><p class="footer-title">${title}</p><ul>${(i === 1 ? groups[i].items.slice(-5) : groups[i].items.slice(0, 5)).map(it => `<li>${a(it)}</li>`).join('')}</ul></div>`).join('');
  const legal = groups[groups.length - 1].items.map(a).join(' · ');
  return `<footer class="footer">
  <div class="container footer-in">
    <p>${t.footerIntro}</p>
    <nav class="footer-nav" aria-label="${t.footerNav}">${cols}</nav>
    <p class="footer-small footer-dates">${t.footerSmall}</p>
    <p class="footer-small footer-legal">${legal}</p>
  </div>
</footer>`;
}

// page: { lang, route, pair, title, description, eyebrow, h1, updated, lead, summary, body, actions }
export function renderPage(page) {
  const { lang, route } = page;
  const t = T[lang];
  const up = '../'.repeat(route.split('/').length - 1);
  const nl = lang === 'nl' ? route : page.pair, fr = lang === 'fr' ? route : page.pair;
  const other = lang === 'nl' ? fr : nl;
  const L = href => `${up}${lang}/${href}`;
  const html = `<!doctype html>
<html lang="${lang}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${escapeAttr(page.title)}</title>
<meta name="description" content="${escapeAttr(page.description)}">
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
<link rel="stylesheet" href="${up}css/legal.css">
<script defer src="${up}config.js"></script>
<script defer src="${up}js/menu.js"></script>
<script defer src="${up}js/ui.js"></script>
</head>
<body class="page" data-lang="${lang}">
<a class="skip-link" href="#content">${t.skip}</a>
<header class="appbar">
  <div class="appbar-in">
    <a class="brand" href="${L('')}" aria-label="${t.home}">${BRAND_SVG}<span class="brand-name">Belastingkaart</span></a>
    ${navHtml(lang, route)}
    <div class="appbar-end">
      <button class="btn-icon theme-btn" id="theme-toggle" type="button" aria-label="${t.theme[0]}" title="${t.theme[1]}">${THEME_SVG}</button>
      <a class="lang-switch" href="${up}${other}" hreflang="${lang === 'nl' ? 'fr-BE' : 'nl-BE'}" lang="${lang === 'nl' ? 'fr' : 'nl'}" aria-label="${t.switchLabel}">${lang === 'nl' ? 'FR' : 'NL'}</a>
      <a class="btn btn-primary btn-sm btn-cta" href="${L('#simulator')}">${t.cta}</a>
    </div>
  </div>
</header>
<main class="container page-main" id="content" tabindex="-1">
  <p class="breadcrumbs"><a href="${L('')}">${t.crumbHome}</a> › ${page.crumb || page.h1}</p>
  <p class="eyebrow">${page.eyebrow}</p>
  <h1>${page.h1}</h1>
  <p class="updated">${t.updated} <time datetime="${page.updated}">${longDate(page.updated, lang)}</time></p>
  <p class="lead">${page.lead}</p>
  <div class="prose">
    <p class="summary-box slash">${page.summary}</p>
${page.body.trim().split('\n').map(l => '    ' + l).join('\n')}
  </div>
  <div class="page-actions">${page.actions.map(([h, label], i) => `<a class="btn ${i ? 'btn-secondary' : 'btn-secondary'}" href="${L(h)}">${label}${i === 0 ? ' <span class="arrow" aria-hidden="true">→</span>' : ''}</a>`).join(' ')}</div>
</main>
${footerHtml(lang, route)}
</body>
</html>
`;
  return applyHead(html, route);
}
