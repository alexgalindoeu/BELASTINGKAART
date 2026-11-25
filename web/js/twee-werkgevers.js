// Two employers in one year (twee werkgevers / deux employeurs). The shell validates both
// employers and adds up gross pay (pure arithmetic). Withholding typed in by the user is kept in
// the form state for the future calculation but never echoed, summed or compared: the final tax,
// and whether extra tax is due, are fiscal results and stay blocked.
(() => {
  const K = window.BKToolKit;
  const EMPLOYERS = [1, 2];
  const MAX_ANNUAL = 10000000;

  function readEmployer(raw, n, language) {
    const errors = [];
    const gross = K.readAmount(raw["gross" + n], language, { max: MAX_ANNUAL });
    if (!gross.ok) errors.push("gross" + n);
    const months = K.readInteger(raw["months" + n], { min: 1, max: 12 });
    if (!months.ok) errors.push("months" + n);
    const withholding = K.readAmount(raw["withholding" + n], language, { max: MAX_ANNUAL, required: false, allowZero: true });
    if (!withholding.ok) errors.push("withholding" + n);
    const provided = String(raw["withholding" + n] ?? "").trim() !== "";
    return { errors, value: { gross: gross.value, months: months.value, withholdingProvided: withholding.ok && provided } };
  }

  function validate(raw = {}, language = "nl") {
    const list = EMPLOYERS.map(n => readEmployer(raw, n, language));
    const grossErrors = list.flatMap(x => x.errors);
    const situation = K.validateSituation(raw);
    return { grossValid: grossErrors.length === 0, errors: [...grossErrors, ...situation.errors], situation, employers: list.map(x => x.value) };
  }

  function grossTotal(employers) {
    const rows = employers.map(x => ({ gross: K.round2(x.gross), months: x.months, perMonthInService: K.round2(x.gross / x.months) }));
    return { kind: "gross", employers: rows, total: K.round2(rows.reduce((s, x) => s + x.gross, 0)) };
  }

  const TEXT = {
    nl: {
      errors: {
        gross1: "Werkgever 1: vul een geldig brutoloon voor het jaar in, bijvoorbeeld 18000 of 18.000,00.",
        gross2: "Werkgever 2: vul een geldig brutoloon voor het jaar in, bijvoorbeeld 9000 of 9.000,00.",
        months1: "Werkgever 1: vul het aantal maanden in dienst in (1 tot 12).",
        months2: "Werkgever 2: vul het aantal maanden in dienst in (1 tot 12).",
        withholding1: "Werkgever 1: vul de ingehouden bedrijfsvoorheffing in als een geldig bedrag, of laat het veld leeg.",
        withholding2: "Werkgever 2: vul de ingehouden bedrijfsvoorheffing in als een geldig bedrag, of laat het veld leeg.",
        region: "Kies je gewest.", municipality: "Vul je gemeente in.", familyStatus: "Kies je gezinssituatie.",
        children: "Vul het aantal kinderen ten laste in (0 tot 20).", taxYears: "Kies een geldig inkomstenjaar."
      },
      invalid: "Controleer de gemarkeerde velden.",
      grossChip: "Bruto · geen belasting",
      label: "Je brutoloon van beide werkgevers samen",
      employer: n => `Werkgever ${n}`,
      perMonth: (amount, months) => `${amount} bruto per maand in dienst (${months} ${months === 1 ? "maand" : "maanden"})`,
      withholding: { yes: "ingehouden bedrijfsvoorheffing ingevuld", no: "ingehouden bedrijfsvoorheffing niet ingevuld" },
      note: "Dit is alleen de som van je brutolonen. Of je moet bijbetalen of iets terugkrijgt, wordt nog niet berekend.",
      extra: ["Samentelling van lonen van meerdere werkgevers in de aangifte"]
    },
    fr: {
      errors: {
        gross1: "Employeur 1 : saisissez un salaire brut annuel valide, par exemple 18000 ou 18.000,00.",
        gross2: "Employeur 2 : saisissez un salaire brut annuel valide, par exemple 9000 ou 9.000,00.",
        months1: "Employeur 1 : indiquez le nombre de mois en service (de 1 à 12).",
        months2: "Employeur 2 : indiquez le nombre de mois en service (de 1 à 12).",
        withholding1: "Employeur 1 : saisissez le précompte professionnel retenu sous forme de montant valide, ou laissez le champ vide.",
        withholding2: "Employeur 2 : saisissez le précompte professionnel retenu sous forme de montant valide, ou laissez le champ vide.",
        region: "Choisissez votre région.", municipality: "Indiquez votre commune.", familyStatus: "Choisissez votre situation familiale.",
        children: "Indiquez le nombre d’enfants à charge (de 0 à 20).", taxYears: "Choisissez une année de revenus valide."
      },
      invalid: "Vérifiez les champs signalés.",
      grossChip: "Brut · pas d’impôt",
      label: "Votre salaire brut des deux employeurs ensemble",
      employer: n => `Employeur ${n}`,
      perMonth: (amount, months) => `${amount} brut par mois en service (${months} mois)`,
      withholding: { yes: "précompte professionnel retenu indiqué", no: "précompte professionnel retenu non indiqué" },
      note: "Il s’agit uniquement de la somme de vos salaires bruts. Le fait de devoir payer un supplément ou d’être remboursé n’est pas encore calculé.",
      extra: ["Addition des salaires de plusieurs employeurs dans la déclaration"]
    }
  };

  window.BKTwoEmployers = Object.freeze({ EMPLOYERS, TEXT, validate, grossTotal });

  if (typeof document === "undefined" || !document.getElementById) return;
  const form = document.getElementById("tw-form");
  if (!form) return;
  const lang = K.pageLanguage(), T = TEXT[lang], $ = id => document.getElementById(id), e = K.escapeHTML;
  const eur = n => K.formatAmount(n, lang);

  function render(showErrors) {
    const v = validate(K.formValues(form), lang);
    const box = $("tw-errors");
    if (showErrors && v.errors.length) {
      K.markInvalid(form, v.errors);
      box.innerHTML = `<p>${e(T.invalid)}</p><ul>${v.errors.map(x => `<li>${e(T.errors[x])}</li>`).join("")}</ul>`;
      box.hidden = false;
    } else if (!v.errors.length) { K.markInvalid(form, []); box.hidden = true; }
    K.renderBlocked($("tw-net"), lang, { extra: T.extra });
    if (!v.grossValid) return;
    const g = grossTotal(v.employers);
    $("tw-gross").innerHTML = `<div class="result-status"><span class="chip yours">${e(T.grossChip)}</span></div>
      <p class="tool-figure-label">${e(T.label)}</p>
      <p class="tool-figure" id="tw-total">${e(eur(g.total))} <small>${lang === "fr" ? "brut" : "bruto"}</small></p>
      <dl class="tool-kpis">${g.employers.map((x, i) => `<div><dt>${e(T.employer(i + 1))}</dt><dd>${e(eur(x.gross))}</dd><dd class="help">${e(T.perMonth(eur(x.perMonthInService), x.months))}; ${e(v.employers[i].withholdingProvided ? T.withholding.yes : T.withholding.no)}</dd></div>`).join("")}</dl>
      <p class="help">${e(T.note)}</p>`;
    $("tw-gross").dataset.result = "gross";
  }

  K.renderBlocked($("tw-net"), lang, { extra: T.extra });
  form.addEventListener("submit", ev => { ev.preventDefault(); render(true); });
  form.addEventListener("change", () => render(false));
})();
