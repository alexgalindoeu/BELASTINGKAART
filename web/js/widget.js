// Embeddable calculator snippet; the embedded calculator stays informational until full calculation is enabled.
(() => {
  function embedCode({language="nl",theme="auto"}={}){
    if(!["nl","fr"].includes(language)) throw new Error("Unsupported language.");
    if(!["auto","light","dark"].includes(theme)) throw new Error("Unsupported theme.");
    const src="https://belastingkaart.be/"+language+"/?embed=1&theme="+encodeURIComponent(theme);
    return '<iframe src="'+src+'" loading="lazy" title="Belastingkaart — Belgian gross-to-net information" width="100%" height="680" style="border:0" loading="lazy"></iframe>';
  }

  // Dedicated widget frame (web/nl/widget/kader.html, web/fr/widget/cadre.html), with a visible
  // attribution link outside the frame. The frame shows the blocked state until the calculation
  // is enabled.
  const SITE="https://belastingkaart.be/";
  const FRAMES=Object.freeze({nl:"nl/widget/kader.html",fr:"fr/widget/cadre.html"});
  const FRAME_TITLES=Object.freeze({nl:"Belastingkaart: bruto-netto voor werknemers in België",fr:"Belastingkaart : brut-net pour salariés en Belgique"});
  const ATTRIBUTION=Object.freeze({nl:"Informatie van",fr:"Informations de"});
  const esc=s=>String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
  function checkOptions({language="nl",theme="auto"}={}){
    if(!["nl","fr"].includes(language)) throw new Error("Unsupported language.");
    if(!["auto","light","dark"].includes(theme)) throw new Error("Unsupported theme.");
    return {language,theme};
  }
  function frameUrl(options={},origin=SITE){
    const {language,theme}=checkOptions(options);
    return origin+FRAMES[language]+(theme==="auto"?"":"?theme="+theme);
  }
  function frameCode(options={}){
    const {language}=checkOptions(options);
    return '<iframe src="'+esc(frameUrl(options))+'" title="'+esc(FRAME_TITLES[language])+'" width="100%" height="460" style="border:0;max-width:480px;display:block" loading="lazy"></iframe>\n'+
      '<p style="font-size:13px;margin:4px 0 0">'+ATTRIBUTION[language]+' <a href="'+SITE+language+'/">Belastingkaart</a></p>';
  }
  window.BKWidget=Object.freeze({embedCode,frameUrl,frameCode,FRAMES});
})();
