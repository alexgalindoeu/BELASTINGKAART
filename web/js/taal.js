// One language per visitor (NL or FR), never mixed.
//   - The choice is stored in localStorage under "bk-lang" ("nl" or "fr") only when the
//     visitor clicks a language link: the NL/FR switch (.lang-switch) or any link that
//     carries hreflang and lang attributes (footer language links, the root chooser).
//   - Without a stored choice, the browser languages decide: the first entry of
//     navigator.languages that is Dutch or French wins; otherwise Dutch.
//   - Loaded synchronously in <head> right after the hreflang links: if the visitor chose
//     the other language, the page is replaced by its own translation before it is shown.
//     Crawlers have no stored choice, so every URL stays crawlable in its own language.
// Used by web/index.html (root redirect) and web/404.html. No tax logic, no cookies.
(function (w) {
  "use strict";
  var KEY = "bk-lang";
  var HREFLANG = { nl: "nl-BE", fr: "fr-BE" };

  function normalize(v) {
    v = String(v == null ? "" : v).toLowerCase();
    return v === "nl" || v === "fr" ? v : null;
  }
  function fromBrowser(list) {
    list = list && list.length ? list : [];
    for (var i = 0; i < list.length; i++) {
      var l = String(list[i] || "").toLowerCase().slice(0, 2);
      if (l === "fr" || l === "nl") return l;
    }
    return "nl";
  }
  function pick(saved, list) { return normalize(saved) || fromBrowser(list); }
  function storage() { try { return w.localStorage; } catch (e) { return null; } }
  function readSaved() { try { var s = storage(); return s ? normalize(s.getItem(KEY)) : null; } catch (e) { return null; } }
  function save(lang) {
    lang = normalize(lang);
    if (!lang) return false;
    try { var s = storage(); if (!s) return false; s.setItem(KEY, lang); return true; } catch (e) { return false; }
  }
  function browserLanguages() {
    var n = w.navigator || {};
    return n.languages && n.languages.length ? n.languages : [n.language];
  }
  function detect() { return pick(readSaved(), browserLanguages()); }

  // Path of this page's translation in `target`, or null. Works on the custom domain and
  // under a project path (e.g. /BELASTINGKAART/nl/bronnen/ -> /BELASTINGKAART/fr/sources/).
  function translationPath(doc, pathname, target) {
    var pageLang = normalize((doc.documentElement.getAttribute("lang") || "").slice(0, 2));
    if (!pageLang || pageLang === target) return null;
    function alt(l) {
      var el = doc.querySelector('link[rel="alternate"][hreflang="' + HREFLANG[l] + '"]');
      if (!el) return null;
      var m = String(el.getAttribute("href") || "").match(/^https?:\/\/[^/]+(\/.*)$/);
      return m ? m[1] : null;
    }
    var own = alt(pageLang), other = alt(target);
    if (!own || !other) return null;
    var p = String(pathname).replace(/index\.html$/, "");
    if (p.slice(-own.length) !== own) return null;
    return p.slice(0, p.length - own.length) + other;
  }
  function redirectIfNeeded(doc, loc) {
    var saved = readSaved();
    if (!saved) return null;
    var target = translationPath(doc, loc.pathname, saved);
    if (target) loc.replace(target + (loc.search || "") + (loc.hash || ""));
    return target;
  }
  function onClick(event) {
    var el = event.target;
    while (el && el.nodeType === 1 && el.tagName !== "A") el = el.parentNode;
    if (!el || el.nodeType !== 1) return;
    var isSwitch = (" " + (el.className || "") + " ").indexOf(" lang-switch ") >= 0;
    if (isSwitch || (el.hasAttribute("hreflang") && el.hasAttribute("lang"))) save(el.getAttribute("lang"));
  }

  w.BKTaal = { KEY: KEY, normalize: normalize, fromBrowser: fromBrowser, pick: pick, readSaved: readSaved,
    save: save, detect: detect, translationPath: translationPath, redirectIfNeeded: redirectIfNeeded, onClick: onClick };

  if (w.document && w.location) {
    try { redirectIfNeeded(w.document, w.location); } catch (e) { /* stay on this page */ }
    if (w.document.addEventListener) w.document.addEventListener("click", onClick, true);
  }
})(window);
