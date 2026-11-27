// Shared helpers for the tool pages: amount parsing/formatting, gross-only arithmetic helpers,
// the shared situation check and the blocked state. No tax rule, rate or parameter belongs here.
//
// Where a fiscal result would appear, the tools show a neutral pending state ("Resultaat volgt
// zodra alle regels bevestigd zijn / Le résultat s'affichera lorsque toutes les règles seront
// confirmées") with the rules still to be confirmed, taken from BKTaxEngine.calculate(). A tool stays blocked even if the engine one day reports a complete
// result: each tool needs its own reviewed and tested implementation before it may show a
// fiscal figure.
(() => {
  const LOCALES = { nl: "nl-BE", fr: "fr-BE" };

  const MISSING = {
    "work bonus and applicable employee contribution": { nl: "Werkbonus en werknemersbijdragen", fr: "Bonus à l’emploi et cotisations des travailleurs" },
    "professional withholding formula": { nl: "Bedrijfsvoorheffing", fr: "Précompte professionnel" },
    "professional expenses": { nl: "Forfaitaire beroepskosten", fr: "Frais professionnels forfaitaires" },
    "family-specific tax allowance and credits": { nl: "Gezinsgebonden belastingvoordelen", fr: "Avantages fiscaux liés à la situation familiale" },
    "regional rules": { nl: "Gewestelijke regels", fr: "Règles régionales" },
    "municipal surcharge": { nl: "Gemeentelijke opcentiemen", fr: "Additionnels communaux" },
    "special social-security contribution": { nl: "Bijzondere bijdrage voor de sociale zekerheid", fr: "Cotisation spéciale pour la sécurité sociale" }
  };
  const UNKNOWN = { nl: "Andere regel die nog bevestigd moet worden", fr: "Autre règle encore à confirmer" };

  const COPY = {
    nl: {
      chip: "Resultaat volgt",
      title: "Resultaat volgt zodra alle regels bevestigd zijn",
      text: "Belastingkaart toont een fiscaal resultaat pas wanneer elke regel die ervoor nodig is uit een officiële bron komt en getest is.",
      listLabel: "Welke regels nog bevestigd worden",
      toolLabel: "Ook nodig voor deze berekening:"
    },
    fr: {
      chip: "Résultat à venir",
      title: "Le résultat s’affichera lorsque toutes les règles seront confirmées",
      text: "Belastingkaart n’affiche un résultat fiscal que lorsque chaque règle nécessaire provient d’une source officielle et a été testée.",
      listLabel: "Quelles règles sont encore à confirmer",
      toolLabel: "Également nécessaire pour ce calcul :"
    }
  };

  const round2 = n => Math.round((n + Number.EPSILON) * 100) / 100;
  const lang = l => (l === "fr" ? "fr" : "nl");
  const escapeHTML = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  function pageLanguage(doc = typeof document !== "undefined" ? document : null) {
    return lang(doc?.body?.dataset?.lang || doc?.documentElement?.lang);
  }

  // Amounts typed by people in Belgium. In nl-BE and fr-BE the dot is never a decimal separator,
  // so "42.000" means 42000. Everything else is delegated to BKAmount.parse, which rejects
  // ambiguous input such as "3,500" instead of guessing.
  function parseAmount(value, language = "nl") {
    if (typeof value === "number") return window.BKAmount.parse(value, LOCALES[lang(language)]);
    let s = String(value ?? "").trim().replace(/[  \s]/g, "").replace(/(€|eur|euro)$/i, "").replace(/^€/, "");
    if (!s) return null;
    if (/^\d{1,3}(\.\d{3})+$/.test(s)) s = s.split(".").join("");
    return window.BKAmount.parse(s, LOCALES[lang(language)]);
  }

  // Returns { ok, value, error } with error in "required" | "format" | "range".
  function readAmount(value, language, { min = 0, max = 10000000, required = true, allowZero = false } = {}) {
    let amount;
    try { amount = parseAmount(value, language); } catch (_) { return { ok: false, value: null, error: "format" }; }
    if (amount === null) return required ? { ok: false, value: null, error: "required" } : { ok: true, value: 0, error: null };
    if (!Number.isFinite(amount) || amount < min || amount > max || (!allowZero && amount === 0)) return { ok: false, value: amount, error: "range" };
    return { ok: true, value: amount, error: null };
  }

  function readInteger(value, { min, max }) {
    const s = String(value ?? "").trim();
    if (!/^\d+$/.test(s)) return { ok: false, value: null };
    const n = Number(s);
    return n >= min && n <= max ? { ok: true, value: n } : { ok: false, value: n };
  }

  function readNumber(value, { min, max }) {
    const s = String(value ?? "").trim().replace(",", ".");
    if (!/^\d+(\.\d+)?$/.test(s)) return { ok: false, value: null };
    const n = Number(s);
    return n >= min && n <= max ? { ok: true, value: n } : { ok: false, value: n };
  }

  function formatAmount(value, language = "nl") {
    return window.BKAmount.format(round2(value), LOCALES[lang(language)]);
  }
  function formatNumber(value, language = "nl", digits = 2) {
    return new Intl.NumberFormat(LOCALES[lang(language)], { maximumFractionDigits: digits }).format(value);
  }

  // Residence, household and years, checked with the shared BKForm schema (one source of truth).
  const SITUATION_KEYS = ["region", "municipality", "familyStatus", "children", "taxYears"];
  function validateSituation(raw = {}) {
    const payload = {
      grossMonthly: 1, employment: "employee", paidMonths: 12,
      region: raw.region, municipality: String(raw.municipality ?? "").trim(), familyStatus: raw.familyStatus,
      children: Number(raw.children), incomeYear: Number(raw.incomeYear), assessmentYear: Number(raw.assessmentYear)
    };
    if (raw.municipalityNis !== undefined) {
      payload.municipalityNis = String(raw.municipalityNis ?? "");
      payload.municipalityRegion = String(raw.municipalityRegion ?? "");
    }
    // A municipality not chosen from the official list is reported as "municipality"; one from
    // another region than the selected region as "region" (the tools' existing messages).
    const fold = { municipalityNis: "municipality", municipalityRegion: "region" };
    const errors = Array.from(new Set(window.BKForm.validate(payload).errors.map(e => fold[e] || e)))
      .filter(e => SITUATION_KEYS.includes(e));
    return { valid: errors.length === 0, errors, value: payload };
  }

  // ---- blocked state ---------------------------------------------------------------------
  function engineStatus(engine = window.BKTaxEngine) {
    let result = null;
    try { result = engine && typeof engine.calculate === "function" ? engine.calculate() : null; } catch (_) { result = null; }
    const missing = Array.isArray(result?.missing) ? result.missing.map(String) : [];
    return { blocked: true, engineStatus: result?.status ? String(result.status) : "unavailable", missing };
  }

  function missingLabels(language = "nl", missing = engineStatus().missing) {
    const l = lang(language);
    const keys = missing.length ? missing : Object.keys(MISSING);
    return keys.map(k => (MISSING[k] ? MISSING[k][l] : UNKNOWN[l]));
  }

  // HTML for the pending result panel: a calm, neutral state with the rules still to be
  // confirmed in a <details> element. Contains no digit: it never shows a fiscal amount or rate.
  function blockedHTML(language = "nl", { extra = [] } = {}) {
    const l = lang(language), c = COPY[l], status = engineStatus();
    const li = list => list.map(x => `<li>${escapeHTML(x)}</li>`).join("");
    const more = extra.length ? `<p class="tool-extra-label">${escapeHTML(c.toolLabel)}</p><ul class="result-list tool-extra">${li(extra)}</ul>` : "";
    return `<div class="result-status"><span class="chip">${escapeHTML(c.chip)}</span></div>` +
      `<h3>${escapeHTML(c.title)}</h3><p>${escapeHTML(c.text)}</p>` +
      `<details class="tool-pending"><summary>${escapeHTML(c.listLabel)}</summary><ul class="result-list">${li(missingLabels(l, status.missing))}</ul>${more}</details>`;
  }

  function renderBlocked(node, language, options) {
    if (!node) return false;
    node.innerHTML = blockedHTML(language, options);
    node.dataset.result = "blocked";
    return true;
  }

  // ---- shareable state in the URL fragment (#key=value&...) --------------------------------
  function readHash(hash) {
    const out = {};
    const q = String(hash ?? "").replace(/^#/, "");
    if (!q) return out;
    for (const pair of q.split("&")) {
      if (!pair) continue;
      const i = pair.indexOf("=");
      const k = decodeURIComponent((i < 0 ? pair : pair.slice(0, i)).replace(/\+/g, " "));
      const v = i < 0 ? "" : decodeURIComponent(pair.slice(i + 1).replace(/\+/g, " "));
      if (/^[a-zA-Z][a-zA-Z0-9]{0,23}$/.test(k)) out[k] = v.slice(0, 64);
    }
    return out;
  }
  function writeHash(state) {
    const parts = Object.entries(state).filter(([, v]) => v !== undefined && v !== null && v !== "")
      .map(([k, v]) => encodeURIComponent(k) + "=" + encodeURIComponent(String(v)));
    return parts.length ? "#" + parts.join("&") : "";
  }

  // ---- small browser helpers (used by the tool modules only when a document exists) ---------
  function markInvalid(form, names) {
    if (!form) return;
    for (const el of form.querySelectorAll("[name]")) {
      if (names.includes(el.name)) el.setAttribute("aria-invalid", "true"); else el.removeAttribute("aria-invalid");
    }
  }
  function fillForm(form, values) {
    for (const [name, value] of Object.entries(values)) {
      const els = form.querySelectorAll(`[name="${name}"]`);
      for (const el of els) {
        if (el.type === "radio") el.checked = el.value === String(value);
        else if (el.type === "checkbox") el.checked = value === true || value === "1";
        else el.value = String(value);
      }
    }
  }
  function formValues(form) {
    const out = {};
    for (const el of form.querySelectorAll("[name]")) {
      if (el.type === "radio") { if (el.checked) out[el.name] = el.value; else if (!(el.name in out)) out[el.name] = ""; }
      else if (el.type === "checkbox") out[el.name] = el.checked;
      else out[el.name] = el.value;
    }
    return out;
  }
  async function copyText(text, input) {
    try { await navigator.clipboard.writeText(text); return true; }
    catch (_) { if (input) { input.focus(); input.select(); try { return document.execCommand("copy"); } catch (_) { return false; } } return false; }
  }

  window.BKToolKit = Object.freeze({
    LOCALES, COPY, MISSING, round2, escapeHTML, pageLanguage,
    parseAmount, readAmount, readInteger, readNumber, formatAmount, formatNumber,
    validateSituation, engineStatus, missingLabels, blockedHTML, renderBlocked,
    readHash, writeHash, markInvalid, fillForm, formValues, copyText
  });
})();
