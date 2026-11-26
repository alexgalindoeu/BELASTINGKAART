// Shared interface helpers for every page; no tax logic belongs in this module.
//   - small DOM helpers used by app.js (setText, setStatus);
//   - light / dark / automatic theme (button in the top bar, stored in localStorage);
//   - top-bar navigation and the "Alles / Tout" drawer, both built from the registry in
//     js/menu.js (window.BKMenu). The drawer button and the compact "Menu" button are injected
//     here, so the page HTML only carries the plain header; without JavaScript the static
//     header nav keeps working;
//   - on narrow screens the top bar slides away while scrolling down and returns on scroll up.
// The <head> of each page applies the stored theme before first paint (see THEME_KEY).
(() => {
  const THEME_KEY = "bk-theme";
  const THEMES = ["auto", "light", "dark"];
  const LABELS = {
    nl: { auto: "automatisch (zoals het systeem)", light: "licht", dark: "donker", theme: "Thema", next: "Wijzigen naar" },
    fr: { auto: "automatique (comme le système)", light: "clair", dark: "sombre", theme: "Thème", next: "Passer en mode" }
  };
  const ICONS = {
    auto: '<circle cx="12" cy="12" r="8"/><path class="fill" d="M12 4a8 8 0 0 1 0 16z"/>',
    light: '<circle cx="12" cy="12" r="4"/><path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.3 5.3l1.4 1.4M17.3 17.3l1.4 1.4M5.3 18.7l1.4-1.4M17.3 6.7l1.4-1.4"/>',
    dark: '<path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z"/>'
  };
  const esc = s => String(s == null ? "" : s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  function setText(selector, value, root=document) {
    const node = root.querySelector(selector);
    if (!node) return false;
    node.textContent = String(value);
    return true;
  }
  function setStatus(node, status, message) {
    if (!node) return;
    node.dataset.status = status;
    node.textContent = message;
    node.setAttribute("role","status");
  }

  function pageLang(doc) {
    const l = (doc.body && doc.body.dataset.lang) || (doc.documentElement.lang || "nl");
    return l.slice(0, 2) === "fr" ? "fr" : "nl";
  }

  function readTheme() {
    try { const t = localStorage.getItem(THEME_KEY); return t === "light" || t === "dark" ? t : "auto"; } catch (_) { return "auto"; }
  }
  function applyTheme(theme, save) {
    const root = document.documentElement;
    if (theme === "light" || theme === "dark") root.setAttribute("data-theme", theme); else root.removeAttribute("data-theme");
    if (save) { try { if (theme === "auto") localStorage.removeItem(THEME_KEY); else localStorage.setItem(THEME_KEY, theme); } catch (_) { /* no storage: this visit only */ } }
    const button = document.getElementById("theme-toggle");
    if (!button) return;
    const lang = (root.lang || "nl").slice(0, 2) === "fr" ? "fr" : "nl";
    const l = LABELS[lang];
    const next = THEMES[(THEMES.indexOf(theme) + 1) % THEMES.length];
    button.setAttribute("aria-label", `${l.theme}: ${l[theme]}. ${l.next} ${l[next]}`);
    button.title = `${l.theme}: ${l[theme]}`;
    button.dataset.theme = theme;
    const svg = button.querySelector("svg");
    if (svg) svg.innerHTML = ICONS[theme];
  }

  // ---- menu registry -> HTML -------------------------------------------------------------
  const icon = (menu, key) => menu.ICONS[key]
    ? `<svg class="ico" viewBox="0 0 24 24" aria-hidden="true" focusable="false">${menu.ICONS[key]}</svg>` : "";

  // root: absolute URL of the language root (/nl/ or /fr/), taken from the brand link.
  function resolve(href, root) { return new URL(href, root).href; }

  function isCurrent(url, loc) {
    const u = new URL(url);
    if (u.hash) return false;  // sections of the home page are never "the current page"
    const path = p => p.replace(/index\.html$/, "");
    return path(u.pathname) === path(loc.pathname);
  }

  function drawerHtml(menu, lang, root, loc) {
    const c = menu.COPY[lang];
    const groups = menu.GROUPS[lang].map((g, i) => `
      <section class="drawer-group" aria-labelledby="drawer-g${i}"><h3 class="card-title" id="drawer-g${i}">${esc(g.group)}</h3><ul>${g.items.map(it => {
        const url = resolve(it.href, root);
        return `
        <li><a class="drawer-item" href="${esc(url)}"${loc && isCurrent(url, loc) ? ' aria-current="page"' : ""}>${icon(menu, it.icon)}<span class="drawer-text"><b>${esc(it.label)}</b><span>${esc(it.text)}</span></span></a></li>`;
      }).join("")}</ul></section>`).join("");
    return `<div class="drawer-in">
      <div class="drawer-head"><h2 id="drawer-title">${esc(c.title)}</h2>
        <button class="drawer-close" type="button" data-close-drawer aria-label="${esc(c.close)}"><svg viewBox="0 0 16 16" aria-hidden="true" focusable="false"><path d="M4 4l8 8M12 4l-8 8"/></svg></button></div>
      <nav class="drawer-body" aria-label="${esc(c.drawerNav)}">${groups}</nav>
    </div>`;
  }

  function drawerButtonHtml(menu, lang) {
    const c = menu.COPY[lang];
    return `<button class="btn-icon drawer-btn" id="drawer-toggle" type="button" aria-haspopup="dialog" aria-expanded="false" aria-controls="drawer" aria-label="${esc(c.title)}" title="${esc(c.title)}"><svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M4 6.5h16M4 12h16M4 17.5h10"/></svg><span class="drawer-btn-text">${esc(c.button)}</span></button>`;
  }

  function menuButtonHtml(menu, lang) {
    return `<button class="btn btn-secondary btn-sm menu-btn" id="menu-toggle" type="button" aria-expanded="false" aria-controls="nav-main"><svg viewBox="0 0 20 20" aria-hidden="true" focusable="false"><path d="M3 5.5h14M3 10h14M3 14.5h14"/></svg><span class="menu-btn-text">${esc(menu.COPY[lang].menu)}</span></button>`;
  }

  // Rebuilds the header nav from the registry (same links as the static fallback).
  function renderNav(nav, menu, lang, root, loc) {
    nav.id = "nav-main";
    nav.setAttribute("aria-label", menu.COPY[lang].nav);
    nav.innerHTML = menu.NAV[lang].map(it => {
      const url = resolve(it.href, root);
      return `<a href="${esc(url)}"${loc && isCurrent(url, loc) ? ' aria-current="page"' : ""}>${esc(it.label)}</a>`;
    }).join("");
  }

  function mountMenu(doc, win) {
    const menu = win.BKMenu;
    const bar = doc.querySelector(".appbar-in");
    const lang0 = pageLang(doc);
    const brand = bar && (bar.querySelector(".brand.l-" + lang0) || bar.querySelector(".brand"));
    if (!menu || !bar || !brand) return;
    const lang = pageLang(doc);
    const root = new URL(brand.getAttribute("href") || "/" + lang + "/", win.location.href).href;
    const loc = win.location;

    const nav = bar.querySelector(".nav");
    if (nav) renderNav(nav, menu, lang, root, loc);

    // compact "Menu" button (folds the nav; see .menu-btn in components.css)
    const appbar = bar.closest(".appbar");
    if (nav && appbar && !doc.getElementById("menu-toggle")) {
      bar.insertAdjacentHTML("beforeend", menuButtonHtml(menu, lang));
      const mb = doc.getElementById("menu-toggle");
      const setMenu = open => { appbar.classList.toggle("nav-open", open); mb.setAttribute("aria-expanded", String(open)); };
      mb.addEventListener("click", () => setMenu(!appbar.classList.contains("nav-open")));
      nav.addEventListener("click", e => { if (e.target.closest("a")) setMenu(false); });
      doc.addEventListener("click", e => { if (!e.target.closest(".appbar")) setMenu(false); });
      doc.addEventListener("keydown", e => {
        if (e.key === "Escape" && appbar.classList.contains("nav-open")) { setMenu(false); mb.focus(); }
      });
    }

    // "Alles / Tout" drawer
    if (!doc.getElementById("drawer-toggle")) bar.insertAdjacentHTML("afterbegin", drawerButtonHtml(menu, lang));
    const button = doc.getElementById("drawer-toggle");
    // The open drawer is a history entry (same URL): "back" (button or swipe) closes it instead
    // of leaving the page. Closing it another way removes that entry; when it closes through a
    // link, navigation follows once the entry is gone.
    let drawer = null, opener = null, inHistory = false, byHistory = false, target = null;
    const goTarget = () => { if (target) { const u = target; target = null; win.location.assign(u); } };
    win.addEventListener("popstate", () => {
      if (drawer && drawer.open) { byHistory = true; close(); }
      else goTarget();
    });
    function create() {
      drawer = doc.createElement("dialog");
      drawer.className = "drawer";
      drawer.id = "drawer";
      drawer.setAttribute("aria-labelledby", "drawer-title");
      drawer.innerHTML = drawerHtml(menu, lang, root, loc);
      drawer.addEventListener("click", e => {
        const a = e.target.closest("a");
        if (a && inHistory && !(e.button > 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) && a.target !== "_blank") {
          e.preventDefault(); e.stopPropagation();
          target = a.href; close();
          win.setTimeout(goTarget, 600);   // in case the browser never reports the way back
          return;
        }
        if (e.target === drawer || e.target.closest("[data-close-drawer]") || a) close();
      });
      // focus stays inside the drawer: Tab from the last item goes to the first and back
      drawer.addEventListener("keydown", e => {
        if (e.key !== "Tab") return;
        const items = Array.from(drawer.querySelectorAll("a[href], button:not([disabled])"));
        if (!items.length) return;
        const first = items[0], last = items[items.length - 1];
        if (e.shiftKey && (doc.activeElement === first || !drawer.contains(doc.activeElement))) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && doc.activeElement === last) { e.preventDefault(); first.focus(); }
      });
      drawer.addEventListener("close", () => {
        doc.documentElement.classList.remove("drawer-open");
        if (button) button.setAttribute("aria-expanded", "false");
        if (opener && opener.focus && !target) opener.focus({ preventScroll: true });
        if (inHistory) {
          inHistory = false;
          if (!byHistory) { try { win.history.back(); } catch (_) { goTarget(); } }
        }
        byHistory = false;
      });
      doc.body.appendChild(drawer);
    }
    function open() {
      if (!drawer) create();
      opener = doc.activeElement;
      if (typeof drawer.showModal === "function") drawer.showModal(); else drawer.setAttribute("open", "");
      doc.documentElement.classList.add("drawer-open");
      if (button) button.setAttribute("aria-expanded", "true");
      try { win.history.pushState(Object.assign({}, win.history.state, { drawer: true }), ""); inHistory = true; } catch (_) { /* no history */ }
      const current = drawer.querySelector('[aria-current="page"]') || drawer.querySelector(".drawer-item");
      if (current) current.focus();
    }
    function close() {
      if (!drawer) return;
      if (typeof drawer.close === "function" && drawer.open) drawer.close();
      else { drawer.removeAttribute("open"); drawer.dispatchEvent(new Event("close")); }
    }
    if (button) button.addEventListener("click", open);
    doc.addEventListener("keydown", e => { if (e.key === "Escape" && drawer && drawer.open) { e.preventDefault(); close(); } });
  }

  function mount() {
    applyTheme(readTheme(), false);
    const button = document.getElementById("theme-toggle");
    if (button) button.addEventListener("click", () => applyTheme(THEMES[(THEMES.indexOf(readTheme()) + 1) % THEMES.length], true));
    window.addEventListener("storage", e => { if (e.key === THEME_KEY) applyTheme(readTheme(), false); });

    mountMenu(document, window);

    const appbar = document.querySelector(".appbar");
    if (appbar && window.matchMedia) {
      const narrow = window.matchMedia("(max-width: 760px)");
      let lastY = window.scrollY, pending = false;
      window.addEventListener("scroll", () => {
        if (pending) return;
        pending = true;
        window.requestAnimationFrame(() => {
          pending = false;
          const y = window.scrollY, d = y - lastY;
          if (!narrow.matches || y < 120 || appbar.contains(document.activeElement)) appbar.classList.remove("tucked");
          else if (d > 6) appbar.classList.add("tucked");
          else if (d < -6) appbar.classList.remove("tucked");
          if (Math.abs(d) > 6 || y < 120) lastY = y;
        });
      }, { passive: true });
    }
  }

  window.BKUI = Object.freeze({ setText, setStatus, THEME_KEY, readTheme, applyTheme, drawerHtml, resolve });
  if (typeof document !== "undefined" && document.addEventListener) {
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", mount);
    else mount();
  }
})();
