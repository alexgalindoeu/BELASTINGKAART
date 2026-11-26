// Joint assessment (gemeenschappelijke aanslag / imposition commune) for married or legally
// cohabiting partners. The shell validates the household and adds up gross income (pure
// arithmetic). The tax of the couple, the marriage quotient and the split of allowances are
// fiscal results and stay blocked.
(() => {
  const K = window.BKToolKit;
  const COUPLES = ["married", "legal_cohabitant"];
  const MAX_ANNUAL = 10000000;

  function validate(raw = {}, language = "nl") {
    const errors = [];
    const a = K.readAmount(raw.grossA, language, { max: MAX_ANNUAL, allowZero: true });
    if (!a.ok) errors.push("grossA");
    const b = K.readAmount(raw.grossB, language, { max: MAX_ANNUAL, allowZero: true });
    if (!b.ok) errors.push("grossB");
    if (a.ok && b.ok && a.value + b.value === 0) errors.push("grossA");
    const grossErrors = [...errors];
    const situation = K.validateSituation(raw);
    const all = [...grossErrors, ...situation.errors];
    if (!COUPLES.includes(raw.familyStatus) && !all.includes("familyStatus")) all.push("familyStatus");
    return { grossValid: grossErrors.length === 0, errors: all, situation, value: { grossA: a.value, grossB: b.value } };
  }

  function household({ grossA, grossB }) {
    return { kind: "gross", grossA: K.round2(grossA), grossB: K.round2(grossB), total: K.round2(grossA + grossB) };
  }

  const TEXT = {
    nl: {
      errors: {
        grossA: "Vul voor jezelf een geldig brutojaarloon in. Samen moeten jullie een inkomen hebben.",
        grossB: "Vul voor je partner een geldig brutojaarloon in, of 0 als je partner geen beroepsinkomen heeft.",
        familyStatus: "Deze tool is voor gehuwden en wettelijk samenwonenden.",
        region: "Kies jullie gewest.", municipality: "Vul jullie gemeente in.",
        children: "Vul het aantal kinderen ten laste in (0 tot 20).", taxYears: "Kies een geldig inkomstenjaar."
      },
      invalid: "Controleer de gemarkeerde velden.",
      grossChip: "Bruto · geen belasting",
      label: "Jullie brutoinkomen samen per jaar",
      rows: ["Brutojaarloon (jij)", "Brutojaarloon (je partner)", "Samen"],
      note: "Dit is alleen de som van jullie brutolonen. De belasting van het gezin wordt nog niet berekend.",
      extra: ["Huwelijksquotiënt", "Belastingvrije som en kinderen ten laste binnen het gezin"]
    },
    fr: {
      errors: {
        grossA: "Saisissez un salaire annuel brut valide pour vous. Ensemble, vous devez avoir un revenu.",
        grossB: "Saisissez un salaire annuel brut valide pour votre partenaire, ou 0 s’il n’a pas de revenu professionnel.",
        familyStatus: "Cet outil s’adresse aux personnes mariées et aux cohabitants légaux.",
        region: "Choisissez votre région.", municipality: "Indiquez votre commune.",
        children: "Indiquez le nombre d’enfants à charge (de 0 à 20).", taxYears: "Choisissez une année de revenus valide."
      },
      invalid: "Vérifiez les champs signalés.",
      grossChip: "Brut · pas d’impôt",
      label: "Vos revenus bruts ensemble par an",
      rows: ["Salaire annuel brut (vous)", "Salaire annuel brut (votre partenaire)", "Ensemble"],
      note: "Il s’agit uniquement de la somme de vos salaires bruts. L’impôt du ménage n’est pas encore calculé.",
      extra: ["Quotient conjugal", "Quotité exemptée d’impôt et enfants à charge au sein du ménage"]
    }
  };

  window.BKJointAssessment = Object.freeze({ COUPLES, TEXT, validate, household });

  if (typeof document === "undefined" || !document.getElementById) return;
  const form = document.getElementById("ga-form");
  if (!form) return;
  const lang = K.pageLanguage(), T = TEXT[lang], $ = id => document.getElementById(id), e = K.escapeHTML;
  const eur = n => K.formatAmount(n, lang);

  function render(showErrors) {
    const v = validate(K.formValues(form), lang);
    const box = $("ga-errors");
    if (showErrors && v.errors.length) {
      K.markInvalid(form, v.errors);
      box.innerHTML = `<p>${e(T.invalid)}</p><ul>${v.errors.map(x => `<li>${e(T.errors[x])}</li>`).join("")}</ul>`;
      box.hidden = false;
    } else if (!v.errors.length) { K.markInvalid(form, []); box.hidden = true; }
    K.renderBlocked($("ga-net"), lang, { extra: T.extra });
    if (!v.grossValid) return;
    const h = household(v.value);
    $("ga-gross").innerHTML = `<div class="result-status"><span class="chip yours">${e(T.grossChip)}</span></div>
      <p class="tool-figure-label">${e(T.label)}</p>
      <p class="tool-figure" id="ga-total">${e(eur(h.total))} <small>${lang === "fr" ? "brut" : "bruto"}</small></p>
      <dl class="tool-kpis"><div><dt>${e(T.rows[0])}</dt><dd>${e(eur(h.grossA))}</dd></div><div><dt>${e(T.rows[1])}</dt><dd>${e(eur(h.grossB))}</dd></div><div><dt>${e(T.rows[2])}</dt><dd>${e(eur(h.total))}</dd></div></dl>
      <p class="help">${e(T.note)}</p>`;
    $("ga-gross").dataset.result = "gross";
  }

  K.renderBlocked($("ga-net"), lang, { extra: T.extra });
  form.addEventListener("submit", ev => { ev.preventDefault(); render(true); });
  form.addEventListener("change", () => render(false));
})();
