(() => {
  const form = document.querySelector("#salary-form");
  if (!form) return;

  const lang = document.body.dataset.lang || window.BK_CONFIG?.defaultLanguage || "nl";
  const copy = (window.BK_I18N && window.BK_I18N[lang]) || window.BK_I18N.nl;
  const result = document.querySelector("#result");
  // The panel's markup already shows the pending state without JavaScript; the renderer
  // redraws it from the engine's own answer (today always "blocked": no figure is shown).
  if (window.BKResult && window.BKTaxEngine) window.BKResult.render(result, window.BKTaxEngine.calculate(), lang);

  // Quick calculator on the cover: the region ruler follows the select (and the other way
  // round); "to the full simulator" carries the gross and the region into the main form.
  // It shows no figure: the cover result stays pending like the main result panel.
  const qc = typeof document.getElementById === "function" ? document.getElementById("quickcalc") : null;
  if (qc) {
    const qcRegion = qc.querySelector("#qc-region"), qcGross = qc.querySelector("#qc-gross");
    const marks = Array.from(qc.querySelectorAll(".ruler-track i"));
    const mark = () => marks.forEach(i => i.classList.toggle("yours", i.dataset.region === qcRegion.value));
    qcRegion.addEventListener("change", mark);
    marks.forEach(i => i.addEventListener("click", () => { qcRegion.value = i.dataset.region; mark(); }));
    qc.addEventListener("submit", e => e.preventDefault());
    qc.querySelector("[data-qc-go]")?.addEventListener("click", () => {
      if (form.elements.region) form.elements.region.value = qcRegion.value;
      if (form.elements.grossMonthly && qcGross.value.trim()) form.elements.grossMonthly.value = qcGross.value.trim().replace(/\./g, "").replace(",", ".");
    });
    mark();
  }

  window.BKParameters.load().then((parameters) => {
    window.BK_TAX_PARAMETERS = parameters;
    document.documentElement.dataset.parameterYear = String(parameters.income_year);
    document.documentElement.dataset.parameterStatus = parameters.calculation_status;
  }).catch(() => {
    document.documentElement.dataset.parameterStatus = "unavailable";
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(form);
    let gross;
    try {
      gross = window.BKGross.parseMonthlyGross(data.get("grossMonthly"));
    } catch (_) {
      window.BKUI.setText("h3", copy.invalidSalary, result);
      window.BKUI.setText("p", copy.noEstimate, result);
      return;
    }

    const payload = {
      grossMonthly: gross,
      region: data.get("region"),
      municipality: String(data.get("municipality") || "").trim(),
      familyStatus: data.get("familyStatus"),
      children: Number(data.get("children")),
      employment: data.get("employment"),
      incomeYear: Number(data.get("incomeYear")),
      assessmentYear: Number(data.get("assessmentYear")),
      paidMonths: Number(data.get("paidMonths"))
    };
    const validation = window.BKForm.validate(payload);
    if (!validation.valid) {
      result.dataset.validation = "invalid";
      result.dataset.validationErrors = validation.errors.join(",");
      window.BKUI.setText("h3", copy.invalidForm, result);
      window.BKUI.setText("p", copy.noEstimate, result);
      return;
    }

    result.dataset.validation = "valid";
    result.dataset.validationErrors = "";
    result.dataset.input = JSON.stringify(payload);
    window.BKUI.setText("h3", copy.ready, result);
    window.BKUI.setText("p", copy.noEstimate, result);
  });
})();
