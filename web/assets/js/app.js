(() => {
  const form = document.querySelector("#salary-form");
  if (!form) return;
  const lang = document.body.dataset.lang || "nl";
  const copy = (window.BK_I18N && window.BK_I18N[lang]) || window.BK_I18N.nl;
  const result = document.querySelector("#result");

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(form);
    const gross = Number(data.get("grossMonthly"));
    if (!Number.isFinite(gross) || gross <= 0 || gross > 100000) {
      result.querySelector("h3").textContent = copy.invalidSalary;
      result.querySelector("p").textContent = copy.noEstimate;
      return;
    }
    const payload = {
      grossMonthly: gross,
      region: data.get("region"),
      municipality: String(data.get("municipality") || "").trim(),
      family: data.get("family"),
      employment: data.get("employment"),
      taxYear: Number(data.get("taxYear"))
    };
    result.dataset.input = JSON.stringify(payload);
    result.querySelector("h3").textContent = copy.ready;
    result.querySelector("p").textContent = copy.noEstimate;
  });
})();

  // Load the generated, versioned dataset without enabling an incomplete net-pay result.
  window.BKParameters.load().then((parameters) => {
    window.BK_TAX_PARAMETERS = parameters;
    document.documentElement.dataset.parameterYear = String(parameters.income_year);
  }).catch(() => {
    document.documentElement.dataset.parameterStatus = "unavailable";
  });
