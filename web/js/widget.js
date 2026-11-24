// Embeddable calculator snippet; the embedded calculator stays informational until full calculation is enabled.
(() => {
  function embedCode({language="nl",theme="auto"}={}){
    if(!["nl","fr"].includes(language)) throw new Error("Unsupported language.");
    if(!["auto","light","dark"].includes(theme)) throw new Error("Unsupported theme.");
    const src="https://belastingkaart.be/"+language+"/?embed=1&theme="+encodeURIComponent(theme);
    return '<iframe src="'+src+'" loading="lazy" title="Belastingkaart — Belgian gross-to-net information" width="100%" height="680" style="border:0" loading="lazy"></iframe>';
  }
  window.BKWidget=Object.freeze({embedCode});
})();
