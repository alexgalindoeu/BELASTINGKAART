// Two job offers side by side (jobaanbiedingen vergelijken / comparer deux offres d'emploi).
// Only gross components are compared: monthly gross x payments + other gross bonuses.
// Extra-legal benefits are recorded but never valued: their tax and social treatment is not
// confirmed. The net comparison shows the shared blocked state.
(() => {
  const K = window.BKToolKit;
  const PAYMENTS = [12, 13, 14];
  const BENEFITS = ["Meal", "Car", "Group", "Hospital"];
  const OFFERS = ["a", "b"];
  const DEFAULTS = {
    aMonthly: "", aPayments: "12", aBonus: "", bMonthly: "", bPayments: "12", bBonus: "",
    region: "flanders", municipality: "", familyStatus: "single", children: "0", incomeYear: "2026", assessmentYear: "2027"
  };

  function readOffer(raw, p, language) {
    const errors = [];
    const monthly = K.readAmount(raw[p + "Monthly"], language, { max: 100000 });
    if (!monthly.ok) errors.push(p + "Monthly");
    const payments = Number(raw[p + "Payments"]);
    if (!PAYMENTS.includes(payments)) errors.push(p + "Payments");
    const bonus = K.readAmount(raw[p + "Bonus"], language, { max: 1000000, required: false, allowZero: true });
    if (!bonus.ok) errors.push(p + "Bonus");
    const benefits = Object.fromEntries(BENEFITS.map(b => [b, raw[p + b] === true || raw[p + b] === "1"]));
    return { errors, value: { monthly: monthly.value, payments, bonus: bonus.value ?? 0, benefits } };
  }

  function validate(raw = {}, language = "nl") {
    const a = readOffer(raw, "a", language), b = readOffer(raw, "b", language);
    const situation = K.validateSituation(raw);
    const grossErrors = [...a.errors, ...b.errors];
    return { grossValid: grossErrors.length === 0, errors: [...grossErrors, ...situation.errors], situation, a: a.value, b: b.value };
  }

  function offerGross({ monthly, payments, bonus = 0 }) {
    const fromSalary = K.round2(monthly * payments);
    const total = K.round2(fromSalary + bonus);
    return { monthly, payments, fromSalary, bonus: K.round2(bonus), total, averageMonthly: K.round2(total / 12) };
  }

  // Difference is always A minus B, in gross.
  function compare(a, b) {
    const A = offerGross(a), B = offerGross(b);
    const diff = {};
    for (const k of ["monthly", "fromSalary", "bonus", "total", "averageMonthly"]) diff[k] = K.round2(A[k] - B[k]);
    return { kind: "gross", a: A, b: B, diff, higher: diff.total > 0 ? "a" : diff.total < 0 ? "b" : "equal" };
  }

  const HASH_KEYS = ["aMonthly", "aPayments", "aBonus", "bMonthly", "bPayments", "bBonus"];
  function toHash(raw) {
    const s = {};
    for (const k of HASH_KEYS) s[k] = raw[k] === DEFAULTS[k] ? "" : raw[k];
    for (const p of OFFERS) for (const b of BENEFITS) s[p + b] = raw[p + b] === true ? "1" : "";
    return K.writeHash(s);
  }
  function fromHash(hash) {
    const h = K.readHash(hash), out = {};
    for (const k of HASH_KEYS) if (h[k] && /^[\d.,\s]{1,16}$/.test(h[k])) out[k] = h[k];
    for (const p of OFFERS) {
      if (out[p + "Payments"] && !PAYMENTS.includes(Number(out[p + "Payments"]))) delete out[p + "Payments"];
      for (const b of BENEFITS) if (h[p + b] === "1") out[p + b] = true;
    }
    return out;
  }

  const TEXT = {
    nl: {
      errors: {
        aMonthly: "Aanbieding A: vul een geldig bruto maandloon in, bijvoorbeeld 3500 of 3.500,00.",
        bMonthly: "Aanbieding B: vul een geldig bruto maandloon in, bijvoorbeeld 3500 of 3.500,00.",
        aPayments: "Aanbieding A: kies 12, 13 of 14 uitbetalingen.",
        bPayments: "Aanbieding B: kies 12, 13 of 14 uitbetalingen.",
        aBonus: "Aanbieding A: vul de andere brutopremies in als een geldig bedrag, of laat het veld leeg.",
        bBonus: "Aanbieding B: vul de andere brutopremies in als een geldig bedrag, of laat het veld leeg.",
        region: "Kies je gewest.",
        municipality: "Vul je gemeente in. Die is nodig voor het nettoloon, niet voor de brutovergelijking.",
        familyStatus: "Kies je gezinssituatie.",
        children: "Vul het aantal kinderen ten laste in (0 tot 20).",
        taxYears: "Kies een geldig inkomstenjaar."
      },
      invalid: "Controleer de gemarkeerde velden.",
      grossChip: "Bruto · geen nettoloon",
      headline: { a: "Aanbieding A geeft meer brutoloon per jaar", b: "Aanbieding B geeft meer brutoloon per jaar", equal: "Beide aanbiedingen geven hetzelfde brutoloon per jaar" },
      figureLabel: "Verschil in brutoloon per jaar",
      perMonth: amount => `Gemiddeld ${amount} bruto per maand verschil (jaarbedrag gedeeld door 12).`,
      cols: ["", "Aanbieding A", "Aanbieding B", "Verschil (A min B)"],
      rows: ["Bruto maandloon", "Uitbetalingen per jaar", "Bruto per jaar uit het loon", "Andere brutopremies per jaar", "Totaal bruto per jaar", "Gemiddeld bruto per maand"],
      benefitRows: { Meal: "Maaltijd\u00adcheques", Car: "Bedrijfs\u00adwagen", Group: "Groeps\u00adverzekering", Hospital: "Hospitalisatie\u00adverzekering" },
      yes: "ja, niet gewaardeerd", no: "nee",
      caption: "De twee aanbiedingen, bruto, cijfer per cijfer",
      benefitsNote: "Extralegale voordelen worden niet in euro omgerekend: hun fiscale en sociale behandeling is nog niet bevestigd in officiële bronnen.",
      grossOnly: "Dit zijn brutobedragen. Er zijn geen sociale bijdragen, bedrijfsvoorheffing of andere inhoudingen afgetrokken.",
      extra: ["Fiscale en sociale behandeling van extralegale voordelen"],
      copied: "Link gekopieerd.",
      notCopied: "Kopiëren lukt niet: selecteer de link en kopieer hem zelf."
    },
    fr: {
      errors: {
        aMonthly: "Offre A : saisissez un salaire mensuel brut valide, par exemple 3500 ou 3.500,00.",
        bMonthly: "Offre B : saisissez un salaire mensuel brut valide, par exemple 3500 ou 3.500,00.",
        aPayments: "Offre A : choisissez 12, 13 ou 14 paiements.",
        bPayments: "Offre B : choisissez 12, 13 ou 14 paiements.",
        aBonus: "Offre A : saisissez les autres primes brutes sous forme de montant valide, ou laissez le champ vide.",
        bBonus: "Offre B : saisissez les autres primes brutes sous forme de montant valide, ou laissez le champ vide.",
        region: "Choisissez votre région.",
        municipality: "Indiquez votre commune. Elle est nécessaire pour le salaire net, pas pour la comparaison en brut.",
        familyStatus: "Choisissez votre situation familiale.",
        children: "Indiquez le nombre d’enfants à charge (de 0 à 20).",
        taxYears: "Choisissez une année de revenus valide."
      },
      invalid: "Vérifiez les champs signalés.",
      grossChip: "Brut · pas de salaire net",
      headline: { a: "L’offre A rapporte plus de salaire brut par an", b: "L’offre B rapporte plus de salaire brut par an", equal: "Les deux offres rapportent le même salaire brut par an" },
      figureLabel: "Différence de salaire brut par an",
      perMonth: amount => `En moyenne ${amount} brut de différence par mois (montant annuel divisé par 12).`,
      cols: ["", "Offre A", "Offre B", "Différence (A moins B)"],
      rows: ["Salaire mensuel brut", "Paiements par an", "Brut annuel du salaire", "Autres primes brutes par an", "Total brut par an", "Brut mensuel moyen"],
      benefitRows: { Meal: "Chèques-repas", Car: "Voiture de société", Group: "Assurance de groupe", Hospital: "Assurance hospitali\u00adsation" },
      yes: "oui, non valorisé", no: "non",
      caption: "Les deux offres, en brut, chiffre par chiffre",
      benefitsNote: "Les avantages extralégaux ne sont pas convertis en euros : leur traitement fiscal et social n’est pas encore confirmé dans les sources officielles.",
      grossOnly: "Ce sont des montants bruts. Aucune cotisation sociale, aucun précompte professionnel ni aucune autre retenue n’a été déduit.",
      extra: ["Traitement fiscal et social des avantages extralégaux"],
      copied: "Lien copié.",
      notCopied: "La copie a échoué : sélectionnez le lien et copiez-le vous-même."
    }
  };

  window.BKOffers = Object.freeze({ PAYMENTS, BENEFITS, DEFAULTS, TEXT, validate, offerGross, compare, toHash, fromHash });

  if (typeof document === "undefined" || !document.getElementById) return;
  const form = document.getElementById("of-form");
  if (!form) return;
  const lang = K.pageLanguage();
  const T = TEXT[lang];
  const $ = id => document.getElementById(id);
  const e = K.escapeHTML;
  const eur = n => K.formatAmount(n, lang);
  const signed = n => (n > 0 ? "+" : n < 0 ? "−" : "") + eur(Math.abs(n));

  function render(showErrors) {
    const raw = K.formValues(form);
    const v = validate(raw, lang);
    const box = $("of-errors");
    if (showErrors && v.errors.length) {
      K.markInvalid(form, v.errors);
      box.innerHTML = `<p>${e(T.invalid)}</p><ul>${v.errors.map(x => `<li>${e(T.errors[x])}</li>`).join("")}</ul>`;
      box.hidden = false;
    } else if (!v.errors.length) { K.markInvalid(form, []); box.hidden = true; }
    K.renderBlocked($("of-net"), lang, { extra: T.extra });
    if (!v.grossValid) return;
    const c = compare(v.a, v.b);
    const rows = [
      [T.rows[0], eur(c.a.monthly), eur(c.b.monthly), signed(c.diff.monthly)],
      [T.rows[1], c.a.payments, c.b.payments, "—"],
      [T.rows[2], eur(c.a.fromSalary), eur(c.b.fromSalary), signed(c.diff.fromSalary)],
      [T.rows[3], eur(c.a.bonus), eur(c.b.bonus), signed(c.diff.bonus)],
      [T.rows[4], eur(c.a.total), eur(c.b.total), signed(c.diff.total), "total"],
      [T.rows[5], eur(c.a.averageMonthly), eur(c.b.averageMonthly), signed(c.diff.averageMonthly)],
      ...BENEFITS.map(b => [T.benefitRows[b], v.a.benefits[b] ? T.yes : T.no, v.b.benefits[b] ? T.yes : T.no, "—"])
    ];
    $("of-table").innerHTML = `<caption class="sr-only">${e(T.caption)}</caption><thead><tr>${T.cols.map((h, i) => `<th scope="col"${i ? ' class="num"' : ""}>${e(h)}</th>`).join("")}</tr></thead><tbody>` +
      rows.map((r, i) => { const c = i >= 6 ? "num wrap" : "num"; return `<tr${r[4] ? ' class="total"' : ""}><th scope="row">${e(r[0])}</th><td class="${c}">${e(r[1])}</td><td class="${c}">${e(r[2])}</td><td class="${c}">${e(r[3])}</td></tr>`; }).join("") + "</tbody>";
    $("of-gross").innerHTML = `<div class="result-status"><span class="chip yours">${e(T.grossChip)}</span></div>
      <h2 class="result-title">${e(T.headline[c.higher])}</h2>
      <p class="tool-figure-label">${e(T.figureLabel)}</p>
      <p class="tool-figure" id="of-diff">${e(eur(Math.abs(c.diff.total)))} <small>${lang === "fr" ? "brut" : "bruto"}</small></p>
      <p>${e(T.perMonth(eur(Math.abs(c.diff.averageMonthly))))}</p>
      <p class="help">${e(T.benefitsNote)} ${e(T.grossOnly)}</p>`;
    $("of-gross").dataset.result = "gross";
    try { history.replaceState(null, "", toHash(raw) || location.pathname); } catch (_) { /* no history API */ }
    $("of-link").value = location.href;
  }

  K.fillForm(form, { ...DEFAULTS, ...fromHash(location.hash) });
  K.renderBlocked($("of-net"), lang, { extra: T.extra });
  let timer;
  form.addEventListener("input", () => { clearTimeout(timer); timer = setTimeout(() => render(false), 200); });
  form.addEventListener("change", () => render(false));
  form.addEventListener("submit", ev => { ev.preventDefault(); render(true); });
  $("of-copy").addEventListener("click", async () => {
    const ok = await K.copyText($("of-link").value, $("of-link"));
    $("of-copied").textContent = ok ? T.copied : T.notCopied;
  });
  $("of-link").value = location.href;
  render(false);
})();
