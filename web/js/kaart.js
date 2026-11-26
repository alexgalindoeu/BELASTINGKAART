// The map of Belastingkaart: municipalities of Belgium as pre-projected SVG paths
// (web/data/kaart_be.json, built by tools/build_kaart.mjs). No map library.
//
// Markup (home hero and the full-page map use the same block; see web/nl/kaart/):
//   <div class="cover-map" data-kaart data-kaart-src="…/data/kaart_be.json" data-kaart-params="…/data/parameters.json">
//     <h2 class="card-title" id="…">…</h2>
//     <div class="map-wrap"><svg class="kaart-svg" role="group" aria-labelledby="…"></svg><div class="kaart-tip" hidden></div></div>
//     <div class="legend"></div><p class="note">…</p><p class="sr-only" aria-live="polite" data-kaart-live></p>
//   </div>
// Optional on the full page: <input data-kaart-search list="…"> and buttons [data-nis] (the list alternative).
//
// Behaviour:
//   - hover (mouse) or focus (keyboard) shows a tooltip with the name in the page language and the region;
//   - click selects "your municipality" (marker yellow, drawn last, with a label); with a finger the first tap
//     shows the tooltip and the second tap on the same municipality selects it;
//   - keyboard: one tab stop; arrow keys move to the nearest municipality in that direction, Enter/Space selects,
//     Escape hides the tooltip; the search field and the list select too; every selection is announced;
//   - nothing is stored: the choice lives in the page (other maps on the page follow via a
//     "bk:gemeente" event).
//
// Colour: neutral region tint until EVERY municipality drawn has an officially confirmed rate of the
// aanvullende gemeentebelasting in parameters.json (RATE_PATH). Only then the diverging ramp
// (lower ← yours → higher) and the rate in the tooltip are shown. A single pending, provisional or
// missing value keeps the whole map neutral.
(function (root) {
  "use strict";
  const RATE_PATH = ["municipal_surcharge", "municipalities"];
  const T = {
    nl: {
      yours: "Jouw gemeente", you: "Jij", tapAgain: "Tik nog eens om deze gemeente als jouw gemeente te kiezen",
      chosen: (n, r) => `Jouw gemeente: ${n} (${r}).`, lower: "Lager tarief", higher: "Hoger tarief",
      rate: "Aanvullende gemeentebelasting", same: "Hetzelfde tarief als in", lowerThan: "lager dan in", higherThan: "hoger dan in",
      pp: "procentpunt", notFound: q => `Geen gemeente gevonden voor „${q}”.`, all: "Heel de kaart",
      zoomed: n => `Ingezoomd op ${n}.`
    },
    fr: {
      yours: "Votre commune", you: "Vous", tapAgain: "Touchez à nouveau pour choisir cette commune comme la vôtre",
      chosen: (n, r) => `Votre commune : ${n} (${r}).`, lower: "Taux plus bas", higher: "Taux plus élevé",
      rate: "Taxe communale additionnelle", same: "Même taux qu’à", lowerThan: "de moins qu’à", higherThan: "de plus qu’à",
      pp: "point de pourcentage", notFound: q => `Aucune commune trouvée pour « ${q} ».`, all: "Toute la carte",
      zoomed: n => `Zoom sur ${n}.`
    }
  };
  const REGION_VAR = { VLG: "--m-vlg", BRU: "--m-bru", WAL: "--m-wal" };

  const esc = s => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  const fold = s => String(s).normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().trim();
  const langOf = l => (l === "fr" ? "fr" : "nl");

  // ---- data-driven colouring ----------------------------------------------------------
  function rateTable(params) {
    let node = params;
    for (const k of RATE_PATH) node = node && node[k];
    return node && typeof node === "object" ? node : null;
  }
  const rateOf = e => (e && Number.isFinite(Number(e.rate ?? e.value)) ? Number(e.rate ?? e.value) : NaN);
  // {active:true, rates:{nis:rate}} only when every municipality drawn has status "confirmed" and a number.
  function choropleth(kaart, table) {
    if (!table) return { active: false, reason: "no-data" };
    const rates = {};
    for (const m of kaart.municipalities) {
      const e = table[m.nis];
      if (!e) return { active: false, reason: "missing", nis: m.nis };
      if (e.status !== "confirmed") return { active: false, reason: "not-confirmed", nis: m.nis };
      const r = rateOf(e);
      if (!Number.isFinite(r)) return { active: false, reason: "no-value", nis: m.nis };
      rates[m.nis] = r;
    }
    return { active: true, rates };
  }
  // Diverging ramp around a reference value: three steps each side, "equal" below the threshold.
  function ramp(diffs, equal) {
    const maxAbs = Math.max(...diffs.map(Math.abs)) || 1;
    return d => {
      if (Math.abs(d) < equal) return "--m-0";
      const k = Math.min(3, Math.ceil(Math.abs(d) / maxAbs * 3));
      return d < 0 ? `--m-g${k}` : `--m-r${k}`;
    };
  }
  const median = xs => { const s = xs.slice().sort((a, b) => a - b); const i = s.length >> 1; return s.length % 2 ? s[i] : (s[i - 1] + s[i]) / 2; };
  const EQUAL = 0.0005; // rates are fractions (0.07 = 7 %): below 0.05 percentage point counts as the same rate

  // ---- pure markup builders (tested in Node) -------------------------------------------
  const regionName = (kaart, m, lang) => kaart.regions[m.region].name[lang];
  const nameOf = (m, lang) => m.name[lang];
  function fillOf(kaart, m, state, yours) {
    if (m.nis === yours) return "var(--m-tu)";
    if (!state.active) return `var(${REGION_VAR[m.region]})`;
    return `var(${state.cls(state.rates[m.nis] - state.ref)})`;
  }
  function prepare(kaart, state, yours) {
    if (!state.active) return state;
    const vals = Object.values(state.rates);
    const ref = yours && state.rates[yours] != null ? state.rates[yours] : median(vals);
    return Object.assign({}, state, { ref, cls: ramp(vals.map(v => v - ref), EQUAL) });
  }
  const pct = (v, lang) => (100 * v).toLocaleString(lang === "fr" ? "fr-BE" : "nl-BE", { minimumFractionDigits: 1, maximumFractionDigits: 2 }) + (lang === "fr" ? " %" : "%");
  function ariaLabel(kaart, m, state, lang, yours) {
    let s = `${nameOf(m, lang)}, ${regionName(kaart, m, lang)}`;
    if (state.active) s += `: ${pct(state.rates[m.nis], lang)}`;
    if (m.nis === yours) s += ` (${T[lang].yours})`;
    return s;
  }
  function svgMarkup(kaart, state, lang, yours, focusNis) {
    const st = prepare(kaart, state, yours);
    let h = "", mine = "";
    const tab = focusNis || yours || kaart.municipalities[0].nis;
    for (const m of kaart.municipalities) {
      const p = `<path class="gem${m.nis === yours ? " yours" : ""}" data-nis="${m.nis}" d="${m.d}" fill="${fillOf(kaart, m, st, yours)}" tabindex="${m.nis === tab ? 0 : -1}" role="button" aria-label="${esc(ariaLabel(kaart, m, st, lang, yours))}"/>`;
      if (m.nis === yours) mine = p; else h += p;
    }
    const b = kaart.borders;
    h += `<path class="b-gem" d="${b.municipal}"/><path class="b-prov" d="${b.provinces}"/><path class="b-reg" d="${b.region}"/>`;
    if (b.national) h += `<path class="b-nat" d="${b.national}"/>`;
    h += mine;
    const m = yours && kaart.municipalities.find(x => x.nis === yours);
    if (m) h += `<text class="kaart-label" x="${m.anchor[0]}" y="${m.anchor[1] + 5}" text-anchor="middle" aria-hidden="true">${T[lang].you}</text>`;
    return h;
  }
  function legendMarkup(kaart, state, lang) {
    const t = T[lang];
    const yoursGroup = `<span class="legend-group"><span class="legend-yours"></span>${t.yours}</span>`;
    if (state.active) {
      const steps = ["--m-g3", "--m-g2", "--m-g1", "--m-0", "--m-r1", "--m-r2", "--m-r3"];
      return `<span class="legend-group">${t.lower}<span class="legend-ramp">${steps.map(s => `<span style="background:var(${s})"></span>`).join("")}</span>${t.higher}</span>${yoursGroup}`;
    }
    return kaart.coverage.map(r => `<span class="legend-group"><span class="legend-ramp"><span style="background:var(${REGION_VAR[r]})"></span></span>${esc(kaart.regions[r].name[lang])}</span>`).join("") + yoursGroup;
  }
  function tipMarkup(kaart, m, state, lang, yours) {
    const t = T[lang], st = prepare(kaart, state, yours);
    let h = `<b>${esc(nameOf(m, lang))}</b>${esc(regionName(kaart, m, lang))}`;
    if (st.active) {
      h += `<br>${t.rate} ${pct(st.rates[m.nis], lang)}`;
      const y = yours && kaart.municipalities.find(x => x.nis === yours);
      if (y && y.nis !== m.nis) {
        const d = st.rates[m.nis] - st.rates[y.nis];
        const n = esc(nameOf(y, lang));
        h += "<br>" + (Math.abs(d) < EQUAL ? `${t.same} ${n}` : `${(100 * Math.abs(d)).toLocaleString(lang === "fr" ? "fr-BE" : "nl-BE", { maximumFractionDigits: 2 })} ${t.pp} ${d < 0 ? t.lowerThan : t.higherThan} ${n}`);
      }
    }
    if (m.nis === yours) h += `<br>${t.yours}`;
    return h;
  }
  // Nearest municipality from `from` in an arrow direction (anchor points, 90° cone).
  function neighbour(kaart, from, key) {
    const a = from.anchor;
    const dir = { ArrowRight: [1, 0], ArrowLeft: [-1, 0], ArrowDown: [0, 1], ArrowUp: [0, -1] }[key];
    if (!dir) return null;
    let best = null, bestScore = Infinity;
    for (const m of kaart.municipalities) {
      if (m === from) continue;
      const dx = m.anchor[0] - a[0], dy = m.anchor[1] - a[1];
      const along = dx * dir[0] + dy * dir[1], across = Math.abs(dx * dir[1] - dy * dir[0]);
      if (along <= 0 || across > along) continue;
      const score = along + 2 * across;
      if (score < bestScore) { bestScore = score; best = m; }
    }
    return best;
  }
  function search(kaart, q, lang) {
    const f = fold(q);
    if (!f) return null;
    const ms = kaart.municipalities;
    return ms.find(m => fold(m.name[lang]) === f) || ms.find(m => fold(m.name.nl) === f || fold(m.name.fr) === f)
      || ms.find(m => fold(m.name[lang]).startsWith(f)) || ms.find(m => fold(m.name[lang]).includes(f)) || null;
  }

  // ---- browser wiring -----------------------------------------------------------------
  const cache = {};
  const getJson = url => (cache[url] = cache[url] || fetch(url).then(r => { if (!r.ok) throw new Error(url + ": " + r.status); return r.json(); }));

  async function mount(block) {
    const doc = block.ownerDocument;
    const lang = langOf((doc.documentElement.getAttribute("lang") || "nl").slice(0, 2));
    const t = T[lang];
    const svg = block.querySelector(".kaart-svg"), tip = block.querySelector(".kaart-tip");
    const legend = block.querySelector(".legend"), live = block.querySelector("[data-kaart-live]");
    const kaart = await getJson(block.dataset.kaartSrc);
    let params = null;
    if (block.dataset.kaartParams) params = await getJson(block.dataset.kaartParams).catch(() => null);
    const state = choropleth(kaart, rateTable(params));
    block.dataset.kaartState = state.active ? "rates" : "regions";
    const byNis = new Map(kaart.municipalities.map(m => [m.nis, m]));
    let yours = null;
    let pointer = "mouse", armed = null, focusNis = null;

    if (!svg.getAttribute("viewBox")) svg.setAttribute("viewBox", kaart.viewBox.join(" "));
    const draw = () => {
      const keepFocus = doc.activeElement && doc.activeElement.closest && doc.activeElement.closest(".kaart-svg") === svg ? doc.activeElement.dataset.nis : null;
      svg.innerHTML = svgMarkup(kaart, state, lang, yours, focusNis);
      legend.innerHTML = legendMarkup(kaart, state, lang);
      if (keepFocus) { const p = svg.querySelector(`[data-nis="${keepFocus}"]`); if (p) p.focus({ preventScroll: true }); }
      doc.querySelectorAll("[data-nis]").forEach(b => { if (b.tagName === "BUTTON") b.setAttribute("aria-pressed", String(b.dataset.nis === yours)); });
    };
    const showTip = (m, x, y, extra) => {
      const r = svg.parentElement.getBoundingClientRect();
      tip.innerHTML = tipMarkup(kaart, m, state, lang, yours) + (extra ? `<span class="kaart-tip-hint">${extra}</span>` : "");
      tip.hidden = false;
      tip.style.left = Math.max(0, Math.min(x - r.left + 14, r.width - 190)) + "px";
      tip.style.top = (y - r.top + 14) + "px";
    };
    const anchorPx = m => {
      const r = svg.getBoundingClientRect(), vb = svg.viewBox.baseVal, k = r.width / vb.width;
      return [r.left + (m.anchor[0] - vb.x) * k, r.top + (m.anchor[1] - vb.y) * k];
    };
    const select = (nis, announce) => {
      const m = byNis.get(nis);
      if (!m) return;
      yours = nis; focusNis = nis;
      draw();
      if (live && announce !== false) live.textContent = t.chosen(nameOf(m, lang), regionName(kaart, m, lang));
      doc.dispatchEvent(new CustomEvent("bk:gemeente", { detail: { nis, name: m.name, region: m.region } }));
    };

    svg.addEventListener("pointerdown", e => { pointer = e.pointerType; });
    svg.addEventListener("mousemove", e => {
      const p = e.target.closest(".gem");
      if (!p || pointer === "touch") { if (!p) tip.hidden = true; return; }
      showTip(byNis.get(p.dataset.nis), e.clientX, e.clientY);
    });
    svg.addEventListener("mouseleave", () => { if (pointer !== "touch") tip.hidden = true; });
    svg.addEventListener("click", e => {
      const p = e.target.closest(".gem");
      if (!p) { armed = null; tip.hidden = true; return; }
      const nis = p.dataset.nis;
      if (pointer === "touch" && armed !== nis && nis !== yours) {
        armed = nis;
        showTip(byNis.get(nis), e.clientX - 109, e.clientY + 4, t.tapAgain);
        return;
      }
      armed = null; tip.hidden = true;
      select(nis);
    });
    svg.addEventListener("focusin", e => {
      const p = e.target.closest(".gem");
      if (!p) return;
      focusNis = p.dataset.nis;
      svg.querySelectorAll('.gem[tabindex="0"]').forEach(x => { if (x !== p) x.setAttribute("tabindex", "-1"); });
      p.setAttribute("tabindex", "0");
      if (p.matches(":focus-visible")) { const [x, y] = anchorPx(byNis.get(p.dataset.nis)); showTip(byNis.get(p.dataset.nis), x, y); }
    });
    svg.addEventListener("focusout", e => { if (!svg.contains(e.relatedTarget)) tip.hidden = true; });
    svg.addEventListener("keydown", e => {
      const p = e.target.closest(".gem");
      if (!p) return;
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); select(p.dataset.nis); return; }
      if (e.key === "Escape") { tip.hidden = true; return; }
      const n = neighbour(kaart, byNis.get(p.dataset.nis), e.key);
      if (e.key.startsWith("Arrow")) e.preventDefault();
      if (n) { const q = svg.querySelector(`[data-nis="${n.nis}"]`); if (q) q.focus(); }
    });

    // full page: zoom to a province (useful on small screens), search field and list alternative
    const zoom = block.querySelector("[data-kaart-zoom]");
    if (zoom) {
      zoom.innerHTML = `<option value="">${t.all}</option>` + kaart.provinces
        .filter(p => kaart.municipalities.some(m => m.province === p.nis))
        .map(p => `<option value="${p.nis}">${esc(p.name[lang])}</option>`).join("");
      zoom.addEventListener("change", () => {
        tip.hidden = true;
        const nis = zoom.value;
        if (!nis) { svg.setAttribute("viewBox", kaart.viewBox.join(" ")); svg.classList.remove("zoomed"); if (live) live.textContent = ""; return; }
        let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
        svg.querySelectorAll(".gem").forEach(p => {
          if (byNis.get(p.dataset.nis).province !== nis) return;
          const b = p.getBBox();
          x0 = Math.min(x0, b.x); y0 = Math.min(y0, b.y); x1 = Math.max(x1, b.x + b.width); y1 = Math.max(y1, b.y + b.height);
        });
        // the province's own shape, but never taller than wide (so the block stays on screen)
        const pad = 6;
        let w = x1 - x0 + 2 * pad, h = y1 - y0 + 2 * pad;
        if (w / h < 1.1) w = h * 1.1;
        const cx = (x0 + x1) / 2, cy = (y0 + y1) / 2;
        svg.setAttribute("viewBox", [cx - w / 2, cy - h / 2, w, h].map(v => Math.round(v * 10) / 10).join(" "));
        svg.classList.add("zoomed");
        if (live) live.textContent = t.zoomed(zoom.options[zoom.selectedIndex].text);
      });
    }

    const input = doc.querySelector("[data-kaart-search]");
    if (input && block.hasAttribute("data-kaart-main")) {
      const dl = input.getAttribute("list") && doc.getElementById(input.getAttribute("list"));
      if (dl) dl.innerHTML = kaart.municipalities.map(m => nameOf(m, lang)).sort((a, b) => a.localeCompare(b, lang)).map(n => `<option value="${esc(n)}"></option>`).join("");
      const go = () => {
        const m = search(kaart, input.value, lang);
        if (m) { select(m.nis); input.value = nameOf(m, lang); }
        else if (input.value.trim() && live) live.textContent = t.notFound(input.value.trim());
      };
      input.addEventListener("change", go);
      input.addEventListener("keydown", e => { if (e.key === "Enter") { e.preventDefault(); go(); } });
      doc.addEventListener("click", e => {
        const b = e.target.closest("button[data-nis]");
        if (!b) return;
        select(b.dataset.nis);
        const p = svg.querySelector(`[data-nis="${b.dataset.nis}"]`);
        if (p) { block.scrollIntoView({ block: "nearest", behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" }); }
      });
    }
    doc.addEventListener("bk:gemeente", e => { if (e.detail.nis !== yours && byNis.has(e.detail.nis)) { yours = e.detail.nis; draw(); } });
    draw();
    return { kaart, state };
  }

  const api = { RATE_PATH, T, rateTable, choropleth, ramp, svgMarkup, legendMarkup, tipMarkup, ariaLabel, neighbour, search, mount };
  root.BKKaart = api;
  if (root.document && root.document.querySelectorAll) {
    const start = () => root.document.querySelectorAll("[data-kaart]").forEach(b => mount(b).catch(err => {
      b.dataset.kaartState = "error";
      if (root.console) root.console.warn("kaart:", err.message);
    }));
    if (root.document.readyState === "loading") root.document.addEventListener("DOMContentLoaded", start); else start();
  }
})(typeof window !== "undefined" ? window : globalThis);
