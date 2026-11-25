// Marginal rate (marginaal tarief / taux marginal): what is left of a gross raise.
// The tool shell validates the situation and shows the gross effect of the raise (pure
// arithmetic). The share that remains after tax and contributions is a fiscal result and stays
// blocked: no rate, tax or net amount is computed or shown.
(() => {
  const K = window.BKToolKit;
  const PAYMENTS = [12, 13, 14];
  const MAX_MONTHLY = 100000;

  function validate(raw = {}, language = "nl") {
    const errors = [];
    const gross = K.readAmount(raw.grossMonthly, language, { max: MAX_MONTHLY });
    if (!gross.ok) errors.push("grossMonthly");
    const paidMonths = Number(raw.paidMonths);
    if (!PAYMENTS.includes(paidMonths)) errors.push("paidMonths");
    const raise = K.readAmount(raw.raise, language, { max: MAX_MONTHLY });
    if (!raise.ok) errors.push("raise");
    if (gross.ok && raise.ok && gross.value + raise.value > MAX_MONTHLY) errors.push("raise");
    const grossErrors = [...errors];
    const situation = K.validateSituation(raw);
    return { grossValid: grossErrors.length === 0, errors: [...grossErrors, ...situation.errors], situation,
      value: { grossMonthly: gross.value, paidMonths, raise: raise.value } };
  }

  function grossEffect({ grossMonthly, paidMonths, raise }) {
    return {
      kind: "gross",
      currentMonthly: K.round2(grossMonthly), nextMonthly: K.round2(grossMonthly + raise), raiseMonthly: K.round2(raise),
      currentAnnual: K.round2(grossMonthly * paidMonths), nextAnnual: K.round2((grossMonthly + raise) * paidMonths),
      raiseAnnual: K.round2(raise * paidMonths), paidMonths
    };
  }

  const TEXT = {
    nl: {
      errors: {
        grossMonthly: "Vul een geldig bruto maandloon in, bijvoorbeeld 3500 of 3.500,00.",
        paidMonths: "Kies 12, 13 of 14 uitbetalingen.",
        raise: "Vul een geldige brutoverhoging per maand in, bijvoorbeeld 100.",
        region: "Kies je gewest.", municipality: "Vul je gemeente in.", familyStatus: "Kies je gezinssituatie.",
        children: "Vul het aantal kinderen ten laste in (0 tot 20).", taxYears: "Kies een geldig inkomstenjaar."
      },
      invalid: "Controleer de gemarkeerde velden.",
      grossChip: "Bruto · geen nettoloon",
      label: "Je brutoloon na de verhoging",
      perMonth: "per maand",
      rows: ["Bruto maandloon nu", "Bruto maandloon na de verhoging", "Extra bruto per jaar"],
      annual: (raise, p, total) => `${raise} extra per maand in ${p} uitbetalingen is ${total} extra bruto per jaar.`,
      blockedNote: "Hoeveel daarvan netto overblijft, hangt af van regels die nog niet bevestigd zijn.",
      extra: ["Samenspel van alle regels bij een hoger brutoloon"]
    },
    fr: {
      errors: {
        grossMonthly: "Saisissez un salaire mensuel brut valide, par exemple 3500 ou 3.500,00.",
        paidMonths: "Choisissez 12, 13 ou 14 paiements.",
        raise: "Saisissez une augmentation brute mensuelle valide, par exemple 100.",
        region: "Choisissez votre région.", municipality: "Indiquez votre commune.", familyStatus: "Choisissez votre situation familiale.",
        children: "Indiquez le nombre d’enfants à charge (de 0 à 20).", taxYears: "Choisissez une année de revenus valide."
      },
      invalid: "Vérifiez les champs signalés.",
      grossChip: "Brut · pas de salaire net",
      label: "Votre salaire brut après l’augmentation",
      perMonth: "par mois",
      rows: ["Salaire mensuel brut actuel", "Salaire mensuel brut après l’augmentation", "Brut supplémentaire par an"],
      annual: (raise, p, total) => `${raise} de plus par mois en ${p} paiements, cela fait ${total} brut de plus par an.`,
      blockedNote: "La part qui vous en reste en net dépend de règles qui ne sont pas encore confirmées.",
      extra: ["Interaction de toutes les règles lorsque le salaire brut augmente"]
    }
  };

  window.BKMarginalTool = Object.freeze({ PAYMENTS, TEXT, validate, grossEffect });

  if (typeof document === "undefined" || !document.getElementById) return;
  const form = document.getElementById("mt-form");
  if (!form) return;
  const lang = K.pageLanguage(), T = TEXT[lang], $ = id => document.getElementById(id), e = K.escapeHTML;
  const eur = n => K.formatAmount(n, lang);

  function render(showErrors) {
    const v = validate(K.formValues(form), lang);
    const box = $("mt-errors");
    if (showErrors && v.errors.length) {
      K.markInvalid(form, v.errors);
      box.innerHTML = `<p>${e(T.invalid)}</p><ul>${v.errors.map(x => `<li>${e(T.errors[x])}</li>`).join("")}</ul>`;
      box.hidden = false;
    } else if (!v.errors.length) { K.markInvalid(form, []); box.hidden = true; }
    K.renderBlocked($("mt-net"), lang, { extra: T.extra });
    if (!v.grossValid) return;
    const g = grossEffect(v.value);
    $("mt-gross").innerHTML = `<div class="result-status"><span class="chip yours">${e(T.grossChip)}</span></div>
      <p class="tool-figure-label">${e(T.label)}</p>
      <p class="tool-figure" id="mt-next">${e(eur(g.nextMonthly))} <small>${lang === "fr" ? "brut" : "bruto"} ${e(T.perMonth)}</small></p>
      <p>${e(T.annual(eur(g.raiseMonthly), g.paidMonths, eur(g.raiseAnnual)))}</p>
      <dl class="tool-kpis"><div><dt>${e(T.rows[0])}</dt><dd>${e(eur(g.currentMonthly))}</dd></div><div><dt>${e(T.rows[1])}</dt><dd>${e(eur(g.nextMonthly))}</dd></div><div><dt>${e(T.rows[2])}</dt><dd>${e(eur(g.raiseAnnual))}</dd></div></dl>
      <p class="help">${e(T.blockedNote)}</p>`;
    $("mt-gross").dataset.result = "gross";
  }

  K.renderBlocked($("mt-net"), lang, { extra: T.extra });
  form.addEventListener("submit", ev => { ev.preventDefault(); render(true); });
  form.addEventListener("change", () => render(false));
})();
