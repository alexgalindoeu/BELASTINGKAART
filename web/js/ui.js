// Shared interface helpers for every page; no tax logic belongs in this module.
//   - small DOM helpers used by app.js (setText, setStatus);
//   - light / dark / automatic theme (button in the top bar, stored in localStorage);
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

  function mount() {
    applyTheme(readTheme(), false);
    const button = document.getElementById("theme-toggle");
    if (button) button.addEventListener("click", () => applyTheme(THEMES[(THEMES.indexOf(readTheme()) + 1) % THEMES.length], true));
    window.addEventListener("storage", e => { if (e.key === THEME_KEY) applyTheme(readTheme(), false); });

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

  window.BKUI = Object.freeze({ setText, setStatus, THEME_KEY, readTheme, applyTheme });
  if (typeof document !== "undefined" && document.addEventListener) {
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", mount);
    else mount();
  }
})();
