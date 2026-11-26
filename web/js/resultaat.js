// Result panel renderer for the calculator (markup and classes: css/site.css + css/components.css).
//
// It only presents a result object that the engine already produced; it never calculates.
//
//   BKResult.html(result, lang)          -> HTML string for the inside of <div class="result">
//   BKResult.render(node, result, lang)  -> fills the node, sets data-status and the ok/bad ribbon
//   BKResult.isConfirmed(result)         -> true only for a complete, confirmed result
//
// Result contract
//   blocked:  { status: "blocked", missing: ["<rule key>", …] }   (BKTaxEngine.calculate() today)
//   complete: { status: "complete", confirmed: true,
//               chip?, headline: { label, amount, tone?: "ok"|"bad" }, sub?,
//               kpis?: [{ label, value, format?: "eur"|"percent"|"text" }],
//               bars?: [{ title, note?, parts: [{ label, amount, tone: "net"|"tax"|"social"|"federal"|"regional" }] }],
//               breakdown: [{ label, amount, kind?: "minus"|"info"|"sub"|"total", code? }],
//               explanation?: { steps: [{ title, rows: [{ label, amount, kind? }], note?, source? }] },
//               scenarios?: [{ label, amount, yours? }], notes?: [string] }
//
// Anything that is not a complete AND confirmed result renders the pending state: a neutral
// message and, in a <details>, the rules still to be confirmed, translated, with no figure at all. The engine's own (English)
// reason is never shown; rule keys without a translation get a neutral label.
(() => {
  const COPY = {
    nl: {
      pendingTitle: "Resultaat volgt zodra alle regels bevestigd zijn",
      pendingText: "Elke regel komt uit een officiële bron en wordt getest voordat er een bedrag verschijnt.",
      missingLabel: "Regels die nog bevestigd worden",
      unknownRule: "Andere regel in voorbereiding",
      title: "Resultaat",
      breakdown: "Overzicht van de berekening",
      explain: "Hoe is dit bedrag berekend?",
      source: "Bron",
      scenarios: "Scenario’s",
      yours: "jouw situatie",
      notes: "Waar je op moet letten",
      estimate: "Een raming op basis van officieel bevestigde regels; geen officieel aanslagbiljet."
    },
    fr: {
      pendingTitle: "Le résultat s’affichera lorsque toutes les règles seront confirmées",
      pendingText: "Chaque règle provient d’une source officielle et est testée avant qu’un montant n’apparaisse.",
      missingLabel: "Règles en cours de confirmation",
      unknownRule: "Autre règle en préparation",
      title: "Résultat",
      breakdown: "Détail du calcul",
      explain: "Comment ce montant a-t-il été calculé ?",
      source: "Source",
      scenarios: "Scénarios",
      yours: "votre situation",
      notes: "Points d’attention",
      estimate: "Une estimation fondée sur des règles officiellement confirmées ; pas un avertissement-extrait de rôle officiel."
    }
  };

  // Rule keys as BKTaxEngine.calculate() reports them -> visible labels (same meaning NL/FR).
  const RULES = {
    "work bonus and applicable employee contribution": { nl: "Werkbonus en werknemersbijdragen", fr: "Bonus à l’emploi et cotisations des travailleurs" },
    "professional withholding formula": { nl: "Bedrijfsvoorheffing", fr: "Précompte professionnel" },
    "professional expenses": { nl: "Forfaitaire beroepskosten", fr: "Frais professionnels forfaitaires" },
    "family-specific tax allowance and credits": { nl: "Gezinsgebonden belastingvoordelen", fr: "Avantages fiscaux liés à la situation familiale" },
    "regional rules": { nl: "Gewestelijke regels", fr: "Règles régionales" },
    "municipal surcharge": { nl: "Gemeentelijke opcentiemen", fr: "Additionnels communaux" },
    "special social-security contribution": { nl: "Bijzondere bijdrage voor de sociale zekerheid", fr: "Cotisation spéciale pour la sécurité sociale" }
  };
  const TONES = new Set(["net", "tax", "social", "federal", "regional"]);
  const KINDS = new Set(["minus", "info", "sub", "total"]);

  const pickLang = lang => (lang === "fr" ? "fr" : "nl");
  const esc = s => String(s == null ? "" : s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const finite = x => typeof x === "number" && Number.isFinite(x);

  function formatters(lang) {
    const locale = lang === "fr" ? "fr-BE" : "nl-BE";
    const eur = new Intl.NumberFormat(locale, { style: "currency", currency: "EUR", minimumFractionDigits: 2, maximumFractionDigits: 2 });
    const pct = new Intl.NumberFormat(locale, { style: "percent", minimumFractionDigits: 1, maximumFractionDigits: 1 });
    // a minus sign (U+2212) instead of a hyphen, as in the reference design
    return {
      eur: x => (x < 0 ? "−" : "") + eur.format(Math.abs(x)),
      pct: x => pct.format(x)
    };
  }

  function isConfirmed(result) {
    return !!result && result.status === "complete" && result.confirmed === true &&
      !!result.headline && finite(result.headline.amount) && Array.isArray(result.breakdown) &&
      result.breakdown.every(r => finite(r.amount));
  }

  function ruleLabel(key, lang) {
    const entry = RULES[key];
    return entry ? entry[lang] : COPY[lang].unknownRule;
  }

  function blockedHtml(result, lang) {
    const c = COPY[lang];
    const keys = Array.isArray(result && result.missing) ? result.missing : [];
    // unknown keys collapse into one neutral line, never the raw (English) key
    const labels = [];
    for (const key of keys) { const label = ruleLabel(String(key), lang); if (!labels.includes(label)) labels.push(label); }
    // a calm, neutral state: no warning banner; the rules still being confirmed sit in a <details>
    return `<div class="result-head"><div class="card-title">${esc(c.title)}</div></div>` +
      `<h3 class="result-label">${esc(c.pendingTitle)}</h3>` +
      `<p class="result-sub">${esc(c.pendingText)}</p>` +
      (labels.length ? `<details class="result-rules"><summary>${esc(c.missingLabel)}</summary><ul class="result-list">${labels.map(l => `<li>${esc(l)}</li>`).join("")}</ul></details>` : "");
  }

  function barHtml(bar, f) {
    const parts = (bar.parts || []).filter(p => finite(p.amount));
    const total = parts.reduce((s, p) => s + Math.max(0, p.amount), 0) || 1;
    const tone = p => (TONES.has(p.tone) ? p.tone : "net");
    return `<div><div class="chart-title"><span>${esc(bar.title)}</span><span>${esc(bar.note || "")}</span></div>` +
      `<div class="split-bar" role="img" aria-label="${esc(parts.map(p => `${p.label}: ${f.eur(p.amount)}`).join(", "))}">` +
      parts.filter(p => p.amount > 0).map(p => `<i class="${tone(p)}" style="flex-grow:${(p.amount / total).toFixed(4)}"></i>`).join("") +
      `</div><ul class="split-legend">${parts.map(p => `<li><i class="${tone(p)}"></i>${esc(p.label)} <b>${esc(f.eur(Math.max(0, p.amount)))}</b></li>`).join("")}</ul></div>`;
  }

  function kpiValue(k, f) {
    if (k.format === "text" || !finite(k.value)) return esc(k.value);
    return esc(k.format === "percent" ? f.pct(k.value) : f.eur(k.value));
  }

  function rowsHtml(rows, f, cls) {
    return rows.map(r => {
      const kind = KINDS.has(r.kind) ? r.kind : "";
      const amount = finite(r.amount) ? esc(f.eur(r.amount)) : "";
      return cls === "breakdown"
        ? `<tr${kind ? ` class="${kind}"` : ""}><td>${esc(r.label)}</td><td class="code-cell">${r.code ? `<span class="code">${esc(r.code)}</span>` : ""}</td><td class="amount">${amount}</td></tr>`
        : `<tr${kind ? ` class="${kind}"` : ""}><td>${esc(r.label)}</td><td class="num">${amount}</td></tr>`;
    }).join("");
  }

  function completeHtml(r, lang) {
    const c = COPY[lang], f = formatters(lang);
    const tone = r.headline.tone === "ok" || r.headline.tone === "bad" ? r.headline.tone : "";
    const out = [];
    out.push(`<div class="result-head"><h3 class="card-title">${esc(c.title)}</h3>${r.chip ? `<span class="chip">${esc(r.chip)}</span>` : ""}</div>`);
    out.push(`<div class="result-label">${esc(r.headline.label)}</div>`);
    out.push(`<p class="result-figure${tone ? " " + tone : ""}">${esc(f.eur(r.headline.amount))}</p>`);
    if (r.sub) out.push(`<p class="result-sub">${esc(r.sub)}</p>`);
    if (Array.isArray(r.kpis) && r.kpis.length)
      out.push(`<dl class="kpis">${r.kpis.map(k => `<div><dt>${esc(k.label)}</dt><dd>${kpiValue(k, f)}</dd></div>`).join("")}</dl>`);
    if (Array.isArray(r.bars) && r.bars.length) out.push(`<div class="result-charts">${r.bars.map(b => barHtml(b, f)).join("")}</div>`);
    out.push(`<h4 class="card-title">${esc(c.breakdown)}</h4><table class="breakdown"><tbody>${rowsHtml(r.breakdown, f, "breakdown")}</tbody></table>`);
    const steps = r.explanation && Array.isArray(r.explanation.steps) ? r.explanation.steps : [];
    if (steps.length) {
      out.push(`<details class="explain"><summary>${esc(c.explain)}</summary><ol class="explain-steps">` +
        steps.map(s => `<li class="explain-step"><h4>${esc(s.title)}</h4>` +
          (Array.isArray(s.rows) && s.rows.length ? `<table class="explain-rows"><tbody>${rowsHtml(s.rows, f, "explain")}</tbody></table>` : "") +
          (s.note ? `<p class="explain-note">${esc(s.note)}</p>` : "") +
          (s.source ? `<p class="explain-source">${esc(c.source)}: ${esc(s.source)}</p>` : "") + `</li>`).join("") +
        `</ol><p class="explain-note">${esc(c.estimate)}</p></details>`);
    }
    const scen = Array.isArray(r.scenarios) ? r.scenarios.filter(s => finite(s.amount)) : [];
    if (scen.length) {
      const max = Math.max(...scen.map(s => Math.abs(s.amount))) || 1;
      out.push(`<h4 class="card-title">${esc(c.scenarios)}</h4><div class="scenario-bars">` + scen.map(s =>
        `<div class="scenario-bar${s.yours ? " yours" : ""}"><div class="chart-title"><span>${esc(s.label)}${s.yours ? ` · ${esc(c.yours)}` : ""}</span><span><b>${esc(f.eur(s.amount))}</b></span></div>` +
        `<div class="split-bar"><i class="${s.yours ? "tax" : "net"}" style="flex:0 0 ${(100 * Math.abs(s.amount) / max).toFixed(2)}%"></i></div></div>`).join("") + `</div>`);
    }
    const notes = Array.isArray(r.notes) ? r.notes : [];
    if (notes.length) out.push(`<details class="warnings"><summary>${esc(c.notes)}</summary><ul>${notes.map(n => `<li>${esc(n)}</li>`).join("")}</ul></details>`);
    return out.join("");
  }

  function html(result, lang) {
    const l = pickLang(lang);
    return isConfirmed(result) ? completeHtml(result, l) : blockedHtml(result, l);
  }

  function render(node, result, lang) {
    if (!node) return null;
    const confirmed = isConfirmed(result);
    node.innerHTML = html(result, lang);
    node.dataset.status = confirmed ? "complete" : "pending";
    if (node.classList) {
      const tone = confirmed ? result.headline.tone : null;
      node.classList.toggle("ok", tone === "ok");
      node.classList.toggle("bad", tone === "bad");
    }
    return node.dataset.status;
  }

  window.BKResult = Object.freeze({ html, render, isConfirmed, ruleLabel, RULES });
})();
