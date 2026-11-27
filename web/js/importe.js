// Locale-aware money parsing and formatting. Ambiguous values are rejected, never guessed.
(() => {
  function parse(value, locale="nl-BE") {
    if (typeof value==="number") {
      if (!Number.isFinite(value)) throw new TypeError("Amount must be finite.");
      return Math.round((value+Number.EPSILON)*100)/100;
    }
    let s=String(value??"").trim().replace(/[\u00a0\u202f\s]/g,"");
    if (!s) return null;
    const comma=s.lastIndexOf(","), dot=s.lastIndexOf(".");
    if (comma>=0 && dot>=0) {
      const decimal=comma>dot?",":".", grouping=decimal===","?".":",";
      const parts=s.split(decimal);
      if(parts.length!==2 || !/^\d{1,2}$/.test(parts[1]) || !new RegExp("^\\d{1,3}(\\"+grouping+"\\d{3})*$").test(parts[0]))
        throw new Error("Ambiguous amount format.");
      s=parts[0].split(grouping).join("")+"."+parts[1];
    } else if(comma>=0) {
      if((s.match(/,/g)||[]).length!==1) throw new Error("Ambiguous amount format.");
      const [a,b]=s.split(",");
      if(!/^\d+$/.test(a)||!/^[0-9]{1,2}$/.test(b)) throw new Error("Ambiguous amount format.");
      s=a+"."+b;
    } else if(dot>=0) {
      if((s.match(/\./g)||[]).length>1) {
        const groups=s.split(".");
        if(!/^\d{1,3}$/.test(groups[0])||groups.slice(1).some(x=>!/^\d{3}$/.test(x))) throw new Error("Ambiguous amount format.");
        s=groups.join("");
      } else {
        const [a,b]=s.split(".");
        // nl-BE / fr-BE: a dot followed by exactly three digits groups thousands ("3.500" = 3500);
        // a dot followed by one or two digits is a decimal point ("3500.5").
        if(/^\d{1,3}$/.test(a)&&/^\d{3}$/.test(b)) s=a+b;
        else if(!/^\d+$/.test(a)||!/^\d{1,2}$/.test(b)) throw new Error("Ambiguous amount format.");
      }
    }
    const n=Number(s);
    if(!Number.isFinite(n)||n<0) throw new Error("Amount must be a non-negative number.");
    return Math.round((n+Number.EPSILON)*100)/100;
  }
  function format(value,locale="nl-BE") {
    if(!Number.isFinite(value)) return "—";
    return new Intl.NumberFormat(locale,{style:"currency",currency:"EUR",minimumFractionDigits:2,maximumFractionDigits:2}).format(value);
  }
  window.BKAmount=Object.freeze({parse,format});
})();
