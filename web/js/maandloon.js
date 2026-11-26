// Monthly pay and payments (maandloon / salaire mensuel): gross pay per year, per month, per
// payment and per hour, in 12, 13 or 14 equal payments. Pure arithmetic on gross pay: no tax,
// no social contribution and no net figure. The net panel shows the shared blocked state.
(() => {
  const K = window.BKToolKit;
  const PAYMENTS = [12, 13, 14];
  const UNITS = ["year", "month", "hour"];
  const WEEKS = 52;
  const MAX_ANNUAL = 10000000;
  const DEFAULTS = { amount: "", unit: "year", payments: "12", hours: "38", parttime: "100" };

  function validate(raw = {}, language = "nl") {
    const errors = [];
    const unit = UNITS.includes(raw.unit) ? raw.unit : (errors.push("unit"), "year");
    const payments = PAYMENTS.includes(Number(raw.payments)) ? Number(raw.payments) : (errors.push("payments"), 12);
    const hours = K.readNumber(raw.hours, { min: 1, max: 60 });
    if (!hours.ok) errors.push("hours");
    const parttime = K.readInteger(raw.parttime, { min: 1, max: 100 });
    if (!parttime.ok) errors.push("parttime");
    const amount = K.readAmount(raw.amount, language, { max: MAX_ANNUAL });
    if (!amount.ok) errors.push("amount");
    const value = { amount: amount.value, unit, payments, hours: hours.value, parttime: parttime.value };
    if (!errors.length && fullTimeAnnual(value) > MAX_ANNUAL) errors.push("amount");
    return { valid: errors.length === 0, errors, amountError: amount.error, value };
  }

  function fullTimeAnnual({ amount, unit, payments, hours }) {
    if (unit === "month") return K.round2(amount * payments);
    if (unit === "hour") return K.round2(amount * hours * WEEKS);
    return K.round2(amount);
  }

  // The same gross annual pay split into 12, 13 or 14 equal payments. A 13th or 14th payment is
  // paid in a month on top of the regular one, so that month carries two payments.
  function split(annual, payments) {
    const d = window.BKSalarySchedule.distributeAnnualGross(annual, payments);
    return {
      payments: d.paidMonths, perPayment: d.regularPayment, extraPayments: d.extraPayments,
      monthWithExtra: d.extraPayments > 0 ? K.round2(2 * d.regularPayment) : null
    };
  }

  function schedule(value) {
    const full = fullTimeAnnual(value);
    const fraction = value.parttime / 100;
    const annual = K.round2(full * fraction);
    const weeklyHours = K.round2(value.hours * fraction);
    return {
      kind: "gross",
      fullTimeAnnual: full, annual, parttime: value.parttime, weeklyHours,
      averageMonthly: K.round2(annual / 12),
      hourly: K.round2(annual / (weeklyHours * WEEKS)),
      ...split(annual, value.payments),
      comparison: PAYMENTS.map(p => split(annual, p))
    };
  }

  function toHash(raw) {
    const v = { ...DEFAULTS, ...raw };
    return K.writeHash({ amount: v.amount, unit: v.unit !== "year" ? v.unit : "", payments: v.payments !== "12" ? v.payments : "",
      hours: v.hours !== "38" ? v.hours : "", parttime: v.parttime !== "100" ? v.parttime : "" });
  }
  function fromHash(hash) {
    const h = K.readHash(hash), out = {};
    if (h.amount && /^[\d.,\s]{1,16}$/.test(h.amount)) out.amount = h.amount;
    if (UNITS.includes(h.unit)) out.unit = h.unit;
    if (PAYMENTS.includes(Number(h.payments))) out.payments = String(Number(h.payments));
    if (/^\d{1,2}([.,]\d)?$/.test(h.hours || "")) out.hours = h.hours;
    if (/^\d{1,3}$/.test(h.parttime || "")) out.parttime = h.parttime;
    return out;
  }

  const TEXT = {
    nl: {
      errors: {
        amount: "Vul een geldig brutobedrag in, bijvoorbeeld 42000 of 42.000,00.",
        unit: "Kies of het bedrag per jaar, per maand of per uur is.",
        payments: "Kies 12, 13 of 14 uitbetalingen.",
        hours: "Vul de wekelijkse arbeidsduur van een voltijdse job in (tussen 1 en 60 uur).",
        parttime: "Vul je tewerkstelling in als een geheel getal tussen 1 en 100."
      },
      invalid: "Controleer de gemarkeerde velden.",
      grossChip: "Bruto · geen nettoloon",
      unitLabel: { year: "per jaar", month: "per maand", hour: "per uur" },
      lead: (annual, p) => `${annual} bruto per jaar in ${p} uitbetalingen is per maand`,
      unitNote: (amount, unit, full) => `${amount} bruto ${unit} is ${full} bruto per jaar bij een voltijdse job.`,
      partNote: (pct, annual, full) => `Bij een tewerkstelling van ${pct} procent: ${annual} bruto per jaar (deel van ${full} voltijds).`,
      extra: (n, amount) => `In ${n === 1 ? "de maand" : "de twee maanden"} met een extra uitbetaling ontvang je ${amount} bruto.`,
      noExtra: "Bij 12 uitbetalingen is er geen extra uitbetaling: elke maand hetzelfde brutobedrag.",
      kpis: ["Bruto per uitbetaling", "Bruto per jaar", "Gemiddeld bruto per maand (jaar gedeeld door 12)", "Bruto per uur"],
      hoursNote: hours => `Per uur gerekend met ${hours} uur per week en 52 weken per jaar.`,
      grossOnly: "Dit zijn brutobedragen. Er zijn geen sociale bijdragen, bedrijfsvoorheffing of andere inhoudingen afgetrokken.",
      tableHead: ["", "12 uitbetalingen", "13 uitbetalingen", "14 uitbetalingen"],
      tableRows: ["Bruto per uitbetaling", "Aantal extra uitbetalingen", "Bruto in een maand met extra uitbetaling", "Bruto per jaar"],
      caption: "Hetzelfde brutojaarloon in 12, 13 of 14 uitbetalingen",
      none: "geen",
      copied: "Link gekopieerd.",
      notCopied: "Kopiëren lukt niet: selecteer de link en kopieer hem zelf."
    },
    fr: {
      errors: {
        amount: "Saisissez un montant brut valide, par exemple 42000 ou 42.000,00.",
        unit: "Indiquez si le montant est annuel, mensuel ou horaire.",
        payments: "Choisissez 12, 13 ou 14 paiements.",
        hours: "Indiquez la durée hebdomadaire d’un emploi à temps plein (entre 1 et 60 heures).",
        parttime: "Indiquez votre temps de travail par un nombre entier entre 1 et 100."
      },
      invalid: "Vérifiez les champs signalés.",
      grossChip: "Brut · pas de salaire net",
      unitLabel: { year: "par an", month: "par mois", hour: "par heure" },
      lead: (annual, p) => `${annual} brut par an en ${p} paiements, cela fait par mois`,
      unitNote: (amount, unit, full) => `${amount} brut ${unit} correspond à ${full} brut par an pour un emploi à temps plein.`,
      partNote: (pct, annual, full) => `Avec un temps de travail de ${pct} pour cent : ${annual} brut par an (part de ${full} à temps plein).`,
      extra: (n, amount) => `${n === 1 ? "Le mois" : "Les deux mois"} avec un paiement supplémentaire, vous recevez ${amount} brut.`,
      noExtra: "Avec 12 paiements, il n’y a pas de paiement supplémentaire : le même montant brut chaque mois.",
      kpis: ["Brut par paiement", "Brut par an", "Brut mensuel moyen (année divisée par 12)", "Brut par heure"],
      hoursNote: hours => `Calcul horaire sur la base de ${hours} heures par semaine et de 52 semaines par an.`,
      grossOnly: "Ce sont des montants bruts. Aucune cotisation sociale, aucun précompte professionnel ni aucune autre retenue n’a été déduit.",
      tableHead: ["", "12 paiements", "13 paiements", "14 paiements"],
      tableRows: ["Brut par paiement", "Nombre de paiements supplémentaires", "Brut d’un mois avec paiement supplémentaire", "Brut par an"],
      caption: "Le même salaire annuel brut en 12, 13 ou 14 paiements",
      none: "aucun",
      copied: "Lien copié.",
      notCopied: "La copie a échoué : sélectionnez le lien et copiez-le vous-même."
    }
  };

  window.BKMonthlyPay = Object.freeze({ PAYMENTS, UNITS, WEEKS, DEFAULTS, TEXT, validate, fullTimeAnnual, split, schedule, toHash, fromHash });

  if (typeof document === "undefined" || !document.getElementById) return;
  const form = document.getElementById("ml-form");
  if (!form) return;
  const lang = K.pageLanguage();
  const T = TEXT[lang];
  const $ = id => document.getElementById(id);
  const eur = n => K.formatAmount(n, lang);
  const e = K.escapeHTML;

  function render(showErrors) {
    const raw = K.formValues(form);
    const v = validate(raw, lang);
    const box = $("ml-errors");
    if (!v.valid) {
      if (showErrors) {
        K.markInvalid(form, v.errors);
        box.innerHTML = `<p>${e(T.invalid)}</p><ul>${v.errors.map(x => `<li>${e(T.errors[x])}</li>`).join("")}</ul>`;
        box.hidden = false;
      }
      return;
    }
    K.markInvalid(form, []);
    box.hidden = true;
    const s = schedule(v.value);
    const notes = [];
    if (v.value.unit !== "year") notes.push(T.unitNote(eur(v.value.amount), T.unitLabel[v.value.unit], eur(s.fullTimeAnnual)));
    if (s.parttime < 100) notes.push(T.partNote(s.parttime, eur(s.annual), eur(s.fullTimeAnnual)));
    notes.push(s.extraPayments ? T.extra(s.extraPayments, eur(s.monthWithExtra)) : T.noExtra);
    const kpi = [s.perPayment, s.annual, s.averageMonthly, s.hourly].map((x, i) => `<div><dt>${e(T.kpis[i])}</dt><dd>${e(eur(x))}</dd></div>`).join("");
    $("ml-gross").innerHTML = `<div class="result-status"><span class="chip yours">${e(T.grossChip)}</span></div>
      <p class="tool-figure-label">${e(T.lead(eur(s.annual), s.payments))}</p>
      <p class="tool-figure" id="ml-per-month">${e(eur(s.perPayment))} <small>${lang === "fr" ? "brut" : "bruto"}</small></p>
      ${notes.map(n => `<p>${e(n)}</p>`).join("")}
      <dl class="tool-kpis">${kpi}</dl>
      <p class="help">${e(T.hoursNote(K.formatNumber(s.weeklyHours, lang)))} ${e(T.grossOnly)}</p>`;
    $("ml-gross").dataset.result = "gross";
    const cell = (c, x) => `<td class="num${c.payments === s.payments ? " is-yours" : ""}">${x}</td>`;
    $("ml-table").innerHTML = `<caption class="sr-only">${e(T.caption)}</caption><thead><tr>${T.tableHead.map((h, i) => `<th scope="col"${i ? ` class="num${PAYMENTS[i - 1] === s.payments ? " is-yours" : ""}"` : ""}>${e(h)}</th>`).join("")}</tr></thead><tbody>
      <tr><th scope="row">${e(T.tableRows[0])}</th>${s.comparison.map(c => cell(c, e(eur(c.perPayment)))).join("")}</tr>
      <tr><th scope="row">${e(T.tableRows[1])}</th>${s.comparison.map(c => cell(c, c.extraPayments || e(T.none))).join("")}</tr>
      <tr><th scope="row">${e(T.tableRows[2])}</th>${s.comparison.map(c => cell(c, c.monthWithExtra == null ? "—" : e(eur(c.monthWithExtra)))).join("")}</tr>
      <tr class="total"><th scope="row">${e(T.tableRows[3])}</th>${s.comparison.map(c => cell(c, e(eur(s.annual)))).join("")}</tr></tbody>`;
    const hash = toHash(raw);
    try { history.replaceState(null, "", hash || location.pathname); } catch (_) { /* no history API */ }
    $("ml-link").value = location.href;
  }

  K.fillForm(form, { ...DEFAULTS, ...fromHash(location.hash) });
  K.renderBlocked($("ml-net"), lang);
  let timer;
  form.addEventListener("input", () => { clearTimeout(timer); timer = setTimeout(() => render(false), 200); });
  form.addEventListener("change", () => render(false));
  form.addEventListener("submit", ev => { ev.preventDefault(); render(true); });
  $("ml-copy").addEventListener("click", async () => {
    const ok = await K.copyText($("ml-link").value, $("ml-link"));
    $("ml-copied").textContent = ok ? T.copied : T.notCopied;
  });
  window.addEventListener("hashchange", () => { K.fillForm(form, { ...DEFAULTS, ...fromHash(location.hash) }); render(false); });
  $("ml-link").value = location.href;
  render(false);
})();
