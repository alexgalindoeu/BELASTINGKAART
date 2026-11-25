// Widget page configurator (/nl/widget/, /fr/widget/) and the embeddable frame itself
// (kader.html / cadre.html). The frame only ever shows the blocked state: no fiscal figure.
(() => {
  const K = window.BKToolKit;
  const THEMES = ["auto", "light", "dark"];
  const TEXT = {
    nl: { copied: "Code gekopieerd.", notCopied: "Kopiëren lukt niet: selecteer de code en kopieer hem zelf.",
      invalid: "Vul een geldig bruto maandloon in, bijvoorbeeld 3500 of 3.500,00." },
    fr: { copied: "Code copié.", notCopied: "La copie a échoué : sélectionnez le code et copiez-le vous-même.",
      invalid: "Saisissez un salaire mensuel brut valide, par exemple 3500 ou 3.500,00." }
  };
  // Preview paths relative to the widget page (web/<lang>/widget/).
  const PREVIEW = { nl: "../../nl/widget/kader.html", fr: "../../fr/widget/cadre.html" };

  function previewSrc({ language = "nl", theme = "auto" } = {}) {
    if (!PREVIEW[language]) throw new Error("Unsupported language.");
    if (!THEMES.includes(theme)) throw new Error("Unsupported theme.");
    return PREVIEW[language] + (theme === "auto" ? "" : "?theme=" + theme);
  }
  function themeFromSearch(search) {
    const m = /(?:^|[?&])theme=(light|dark)(?:&|$)/.exec(String(search || ""));
    return m ? m[1] : "auto";
  }

  window.BKWidgetTool = Object.freeze({ THEMES, previewSrc, themeFromSearch });
  if (typeof document === "undefined" || !document.getElementById) return;
  const lang = K.pageLanguage(), T = TEXT[lang], $ = id => document.getElementById(id);

  // ---- configurator ----
  const config = $("wg-form");
  if (config) {
    const read = () => ({ language: config.elements.widgetLanguage.value, theme: (config.querySelector('input[name="widgetTheme"]:checked') || {}).value || "auto" });
    const update = () => {
      const o = read();
      const src = previewSrc(o);
      if ($("wg-preview").getAttribute("src") !== src) $("wg-preview").setAttribute("src", src);
      $("wg-code").value = window.BKWidget.frameCode(o);
    };
    config.addEventListener("change", update);
    config.addEventListener("submit", ev => ev.preventDefault());
    $("wg-copy").addEventListener("click", async () => {
      const ok = await K.copyText($("wg-code").value, $("wg-code"));
      $("wg-copied").textContent = ok ? T.copied : T.notCopied;
    });
    window.addEventListener("message", ev => {
      if (ev.origin !== location.origin || ev.source !== $("wg-preview").contentWindow || ev.data?.type !== "belastingkaart:height") return;
      $("wg-preview").style.height = Math.min(Math.max(Number(ev.data.height) || 0, 240), 1200) + "px";
    });
    update();
  }

  // ---- embedded frame ----
  const frame = $("wf-form");
  if (frame) {
    const sendHeight = () => { try { if (window.parent !== window) window.parent.postMessage({ type: "belastingkaart:height", height: document.documentElement.scrollHeight }, "*"); } catch (_) { /* not framed */ } };
    K.renderBlocked($("wf-net"), lang);
    frame.addEventListener("submit", ev => {
      ev.preventDefault();
      const a = K.readAmount(frame.elements.grossMonthly.value, lang, { max: 100000 });
      K.markInvalid(frame, a.ok ? [] : ["grossMonthly"]);
      $("wf-error").textContent = a.ok ? "" : T.invalid;
      $("wf-error").hidden = a.ok;
      K.renderBlocked($("wf-net"), lang);
      sendHeight();
    });
    window.addEventListener("load", sendHeight);
    sendHeight();
  }
})();
