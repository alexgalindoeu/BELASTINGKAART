(() => {
  const form = document.querySelector("#salary-form");
  if (!form) return;
  const lang = document.body.dataset.lang || window.BK_CONFIG?.defaultLanguage || "nl";
  const copy = (window.BK_I18N && window.BK_I18N[lang]) || window.BK_I18N.nl;
  const result = document.querySelector("#result");

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
      window.BKUI.setText("h3",copy.invalidSalary,result);
      window.BKUI.setText("p",copy.noEstimate,result);
      return;
    }
    const payload = {
      grossMonthly: gross,
      region: data.get("region"),
      municipality: String(data.get("municipality") || "").trim(),
      family: data.get("family"),
      employment: data.get("employment"),
      incomeYear: Number(data.get("taxYear"))
    };
    result.dataset.input = JSON.stringify(payload);
    window.BKUI.setText("h3",copy.ready,result);
    window.BKUI.setText("p",copy.noEstimate,result);
  });
})();
