// "What if?" scenarios (scenario's / scénarios): start from a situation and add changes such as a
// raise, another number of payments, a move or another household. Each scenario shows its gross
// pay (pure arithmetic); the net result of every scenario stays blocked until the engine and this
// tool are confirmed. Scenarios live in memory only.
(() => {
  const K = window.BKToolKit;
  const PAYMENTS = [12, 13, 14];
  const CHANGES = ["raise", "gross", "payments", "move", "family", "children"];
  const MAX_SCENARIOS = 6;
  const MAX_MONTHLY = 100000;

  function validateBase(raw = {}, language = "nl") {
    const errors = [];
    const gross = K.readAmount(raw.grossMonthly, language, { max: MAX_MONTHLY });
    if (!gross.ok) errors.push("grossMonthly");
    const paidMonths = Number(raw.paidMonths);
    if (!PAYMENTS.includes(paidMonths)) errors.push("paidMonths");
    const situation = K.validateSituation(raw);
    errors.push(...situation.errors);
    return {
      valid: errors.length === 0, errors,
      value: { grossMonthly: gross.value, paidMonths, region: raw.region, municipality: String(raw.municipality ?? "").trim(),
        familyStatus: raw.familyStatus, children: Number(raw.children), incomeYear: Number(raw.incomeYear), assessmentYear: Number(raw.assessmentYear) }
    };
  }

  // Reads the "add a scenario" fields. Returns { valid, errors, change }.
  function readChange(raw = {}, language = "nl") {
    const type = raw.change;
    if (!CHANGES.includes(type)) return { valid: false, errors: ["change"], change: null };
    if (type === "raise" || type === "gross") {
      const a = K.readAmount(raw.changeAmount, language, { max: MAX_MONTHLY });
      return a.ok ? { valid: true, errors: [], change: { type, amount: a.value } } : { valid: false, errors: ["changeAmount"], change: null };
    }
    if (type === "payments") {
      const p = Number(raw.changePayments);
      return PAYMENTS.includes(p) ? { valid: true, errors: [], change: { type, payments: p } } : { valid: false, errors: ["changePayments"], change: null };
    }
    if (type === "move") {
      const errors = [];
      if (!window.BKForm.regions.includes(raw.changeRegion)) errors.push("changeRegion");
      const municipality = String(raw.changeMunicipality ?? "").trim();
      if (!municipality) errors.push("changeMunicipality");
      return errors.length ? { valid: false, errors, change: null } : { valid: true, errors: [], change: { type, region: raw.changeRegion, municipality } };
    }
    if (type === "family") {
      return window.BKForm.familyStatuses.includes(raw.changeFamily)
        ? { valid: true, errors: [], change: { type, familyStatus: raw.changeFamily } } : { valid: false, errors: ["changeFamily"], change: null };
    }
    const c = K.readInteger(raw.changeChildren, { min: 0, max: 20 });
    return c.ok ? { valid: true, errors: [], change: { type, children: c.value } } : { valid: false, errors: ["changeChildren"], change: null };
  }

  function apply(base, change) {
    const s = { ...base };
    if (change.type === "raise") s.grossMonthly = K.round2(base.grossMonthly + change.amount);
    if (change.type === "gross") s.grossMonthly = K.round2(change.amount);
    if (change.type === "payments") s.paidMonths = change.payments;
    if (change.type === "move") { s.region = change.region; s.municipality = change.municipality; }
    if (change.type === "family") s.familyStatus = change.familyStatus;
    if (change.type === "children") s.children = change.children;
    if (s.grossMonthly > MAX_MONTHLY) throw new RangeError("Scenario gross exceeds the supported range.");
    return s;
  }

  // Gross figures of the base and every scenario, and the gross difference with the base.
  function compareGross(base, changes) {
    const annual = s => K.round2(s.grossMonthly * s.paidMonths);
    const baseAnnual = annual(base);
    const rows = [{ change: null, situation: base, grossMonthly: base.grossMonthly, grossAnnual: baseAnnual, diffAnnual: 0, net: "blocked" }];
    for (const change of changes) {
      const s = apply(base, change);
      rows.push({ change, situation: s, grossMonthly: s.grossMonthly, grossAnnual: annual(s), diffAnnual: K.round2(annual(s) - baseAnnual), net: "blocked" });
    }
    return { kind: "gross", rows };
  }

  const TEXT = {
    nl: {
      errors: {
        grossMonthly: "Huidige situatie: vul een geldig bruto maandloon in, bijvoorbeeld 3500 of 3.500,00.",
        paidMonths: "Huidige situatie: kies 12, 13 of 14 uitbetalingen.",
        region: "Huidige situatie: kies je gewest.", municipality: "Huidige situatie: vul je gemeente in.",
        familyStatus: "Huidige situatie: kies je gezinssituatie.", children: "Huidige situatie: vul het aantal kinderen ten laste in (0 tot 20).",
        taxYears: "Kies een geldig inkomstenjaar.",
        change: "Kies wat er verandert.", changeAmount: "Vul een geldig brutobedrag per maand in.",
        changePayments: "Kies 12, 13 of 14 uitbetalingen.", changeRegion: "Kies het nieuwe gewest.",
        changeMunicipality: "Vul de nieuwe gemeente in.", changeFamily: "Kies de nieuwe gezinssituatie.",
        changeChildren: "Vul het nieuwe aantal kinderen ten laste in (0 tot 20).", tooMany: "Je kunt maximaal zes scenario’s vergelijken. Verwijder er eerst één.",
        range: "Met dit scenario komt het brutoloon buiten het ondersteunde bereik."
      },
      invalid: "Controleer de gemarkeerde velden.",
      added: "Scenario toegevoegd.", removed: "Scenario verwijderd.",
      empty: "Nog geen scenario’s. Voeg hierboven een verandering toe.",
      remove: "Verwijderen",
      base: "Huidige situatie",
      describe: {
        raise: (c, f) => `Loonsverhoging van ${f(c.amount)} bruto per maand`,
        gross: (c, f) => `Ander brutoloon: ${f(c.amount)} per maand`,
        payments: c => `${c.payments} uitbetalingen per jaar`,
        move: (c, f, labels) => `Verhuizen naar ${c.municipality} (${labels.region[c.region]})`,
        family: (c, f, labels) => `Gezinssituatie: ${labels.family[c.familyStatus]}`,
        children: c => `${c.children} ${c.children === 1 ? "kind" : "kinderen"} ten laste`
      },
      labels: {
        region: { flanders: "Vlaams Gewest", brussels: "Brussels Hoofdstedelijk Gewest", wallonia: "Waals Gewest" },
        family: { single: "alleenstaand", married: "gehuwd", legal_cohabitant: "wettelijk samenwonend", separated: "uit de echt / feitelijk gescheiden", widowed: "weduwe / weduwnaar" }
      },
      cols: ["Scenario", "Bruto per maand", "Bruto per jaar", "Verschil bruto per jaar", "Nettoloon"],
      blockedCell: "volgt",
      caption: "Brutoloon per scenario; het nettoloon volgt zodra alle regels bevestigd zijn",
      chip: n => `${n} ${n === 1 ? "scenario" : "scenario’s"}`,
      extra: ["Dezelfde volledige berekening voor elk scenario"]
    },
    fr: {
      errors: {
        grossMonthly: "Situation actuelle : saisissez un salaire mensuel brut valide, par exemple 3500 ou 3.500,00.",
        paidMonths: "Situation actuelle : choisissez 12, 13 ou 14 paiements.",
        region: "Situation actuelle : choisissez votre région.", municipality: "Situation actuelle : indiquez votre commune.",
        familyStatus: "Situation actuelle : choisissez votre situation familiale.", children: "Situation actuelle : indiquez le nombre d’enfants à charge (de 0 à 20).",
        taxYears: "Choisissez une année de revenus valide.",
        change: "Choisissez ce qui change.", changeAmount: "Saisissez un montant brut mensuel valide.",
        changePayments: "Choisissez 12, 13 ou 14 paiements.", changeRegion: "Choisissez la nouvelle région.",
        changeMunicipality: "Indiquez la nouvelle commune.", changeFamily: "Choisissez la nouvelle situation familiale.",
        changeChildren: "Indiquez le nouveau nombre d’enfants à charge (de 0 à 20).", tooMany: "Vous pouvez comparer six scénarios au maximum. Supprimez-en d’abord un.",
        range: "Avec ce scénario, le salaire brut sort de la plage prise en charge."
      },
      invalid: "Vérifiez les champs signalés.",
      added: "Scénario ajouté.", removed: "Scénario supprimé.",
      empty: "Pas encore de scénario. Ajoutez un changement ci-dessus.",
      remove: "Supprimer",
      base: "Situation actuelle",
      describe: {
        raise: (c, f) => `Augmentation de ${f(c.amount)} brut par mois`,
        gross: (c, f) => `Autre salaire brut : ${f(c.amount)} par mois`,
        payments: c => `${c.payments} paiements par an`,
        move: (c, f, labels) => `Déménagement à ${c.municipality} (${labels.region[c.region]})`,
        family: (c, f, labels) => `Situation familiale : ${labels.family[c.familyStatus]}`,
        children: c => `${c.children} ${c.children === 1 ? "enfant" : "enfants"} à charge`
      },
      labels: {
        region: { flanders: "Région flamande", brussels: "Région de Bruxelles-Capitale", wallonia: "Région wallonne" },
        family: { single: "isolé", married: "marié", legal_cohabitant: "cohabitant légal", separated: "divorcé / séparé de fait", widowed: "veuf / veuve" }
      },
      cols: ["Scénario", "Brut par mois", "Brut par an", "Différence brute par an", "Salaire net"],
      blockedCell: "à venir",
      caption: "Salaire brut par scénario ; le salaire net s’affichera lorsque toutes les règles seront confirmées",
      chip: n => `${n} ${n === 1 ? "scénario" : "scénarios"}`,
      extra: ["Le même calcul complet pour chaque scénario"]
    }
  };

  function describe(change, language = "nl") {
    const l = language === "fr" ? "fr" : "nl";
    return TEXT[l].describe[change.type](change, n => K.formatAmount(n, l), TEXT[l].labels);
  }

  window.BKScenarioTool = Object.freeze({ PAYMENTS, CHANGES, MAX_SCENARIOS, TEXT, validateBase, readChange, apply, compareGross, describe });

  if (typeof document === "undefined" || !document.getElementById) return;
  const form = document.getElementById("sc-form");
  if (!form) return;
  const lang = K.pageLanguage(), T = TEXT[lang], $ = id => document.getElementById(id), e = K.escapeHTML;
  const eur = n => K.formatAmount(n, lang);
  const signed = n => (n > 0 ? "+" : n < 0 ? "−" : "") + eur(Math.abs(n));
  const scenarios = [];
  const FIELDS = { raise: "sc-f-amount", gross: "sc-f-amount", payments: "sc-f-payments", move: "sc-f-move", family: "sc-f-family", children: "sc-f-children" };

  function showFields() {
    const type = form.elements.change.value;
    for (const id of new Set(Object.values(FIELDS))) $(id).hidden = FIELDS[type] !== id;
  }

  function showErrors(errors) {
    const box = $("sc-errors");
    K.markInvalid(form, errors);
    if (!errors.length) { box.hidden = true; return; }
    box.innerHTML = `<p>${e(T.invalid)}</p><ul>${errors.map(x => `<li>${e(T.errors[x])}</li>`).join("")}</ul>`;
    box.hidden = false;
  }

  function render() {
    const list = $("sc-list");
    list.innerHTML = scenarios.length
      ? scenarios.map((c, i) => `<li><span>${e(describe(c, lang))}</span> <button class="btn btn-secondary btn-sm" type="button" data-remove="${i}">${e(T.remove)}</button></li>`).join("")
      : `<li class="help">${e(T.empty)}</li>`;
    $("sc-chip").textContent = T.chip(scenarios.length);
    K.renderBlocked($("sc-net"), lang, { extra: T.extra });
    const base = validateBase(K.formValues(form), lang);
    if (!base.valid) return;
    let cmp;
    try { cmp = compareGross(base.value, scenarios); } catch (_) { return; }
    $("sc-table").innerHTML = `<caption class="sr-only">${e(T.caption)}</caption><thead><tr>${T.cols.map((h, i) => `<th scope="col"${i ? ' class="num"' : ""}>${e(h)}</th>`).join("")}</tr></thead><tbody>` +
      cmp.rows.map(r => `<tr${r.change ? "" : ' class="is-base"'}><th scope="row">${e(r.change ? describe(r.change, lang) : T.base)}</th><td class="num">${e(eur(r.grossMonthly))}</td><td class="num">${e(eur(r.grossAnnual))}</td><td class="num">${r.change ? e(signed(r.diffAnnual)) : "—"}</td><td class="num"><span class="chip">${e(T.blockedCell)}</span></td></tr>`).join("") + "</tbody>";
    $("sc-table").dataset.result = "gross";
  }

  form.addEventListener("submit", ev => {
    ev.preventDefault();
    const raw = K.formValues(form);
    const base = validateBase(raw, lang);
    const ch = readChange(raw, lang);
    const errors = [...base.errors, ...ch.errors];
    if (!errors.length && scenarios.length >= MAX_SCENARIOS) errors.push("tooMany");
    if (!errors.length) { try { apply(base.value, ch.change); } catch (_) { errors.push("range"); } }
    showErrors(errors.filter(x => x !== "tooMany" && x !== "range"));
    if (errors.length) {
      if (errors.includes("tooMany") || errors.includes("range")) { const box = $("sc-errors"); box.innerHTML = `<p>${e(T.errors[errors.includes("tooMany") ? "tooMany" : "range"])}</p>`; box.hidden = false; }
      return;
    }
    scenarios.push(ch.change);
    $("sc-msg").textContent = T.added;
    render();
  });
  $("sc-list").addEventListener("click", ev => {
    const btn = ev.target.closest("[data-remove]");
    if (!btn) return;
    scenarios.splice(Number(btn.dataset.remove), 1);
    $("sc-msg").textContent = T.removed;
    render();
  });
  form.elements.change.addEventListener("change", showFields);
  form.addEventListener("change", ev => { if (!String(ev.target.name).startsWith("change")) render(); });
  showFields();
  render();
})();
