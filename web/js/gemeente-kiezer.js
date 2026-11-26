// Municipality picker (gemeente / commune): an ARIA 1.2 combobox with a listbox popup and
// list autocomplete. Data: web/data/gemeenten.json, generated from Statbel REFNIS 2025.
// It only identifies the municipality (NIS code and region); it never uses tax rates.
(() => {
  const TEXT = {
    nl: {
      found: n => (n === 1 ? '1 gemeente gevonden' : n + ' gemeenten gevonden'),
      none: 'Geen gemeente gevonden',
      chosen: name => name + ' gekozen',
      error: 'De lijst met gemeenten kon niet worden geladen.'
    },
    fr: {
      found: n => (n === 1 ? '1 commune trouvée' : n + ' communes trouvées'),
      none: 'Aucune commune trouvée',
      chosen: name => name + ' sélectionnée',
      error: 'La liste des communes n’a pas pu être chargée.'
    }
  };
  const other = lang => (lang === 'fr' ? 'nl' : 'fr');

  // Case-, accent- and punctuation-insensitive form used for matching only.
  function normalize(value) {
    return String(value || '')
      .normalize('NFD').replace(/[̀-ͯ]/g, '')
      .toLowerCase()
      .replace(/œ/g, 'oe').replace(/æ/g, 'ae').replace(/ß/g, 'ss')
      .replace(/[’‘`´']/g, '')
      .replace(/[^a-z0-9]+/g, ' ')
      .trim();
  }

  // Names in the page language. Officially bilingual municipalities (Brussels-Capital) keep
  // both official names, as written by Statbel; the other one is shown as a secondary name.
  function entries(municipalities, lang, provinces) {
    const key = 'name_' + lang;
    const list = municipalities.map(m => {
      const name = m[key];
      const alt = m.bilingual && m['name_' + other(lang)] !== name ? m['name_' + other(lang)] : null;
      return { m, name, alt, altLang: alt ? other(lang) : null, hint: null,
        keys: [normalize(name)].concat(alt ? [normalize(alt)] : []) };
    });
    const counts = new Map();
    for (const e of list) counts.set(e.name, (counts.get(e.name) || 0) + 1);
    const provinceName = new Map((provinces || []).map(p => [p.nis, p[key]]));
    for (const e of list) if (counts.get(e.name) > 1) e.hint = provinceName.get(e.m.province_nis) || e.m.nis;
    const collator = new Intl.Collator(lang === 'fr' ? 'fr-BE' : 'nl-BE', { sensitivity: 'base' });
    return list.sort((a, b) => collator.compare(a.name, b.name) || collator.compare(a.hint || '', b.hint || ''));
  }

  // 0: name starts with the query, 1: a word starts with it, 2: contains it, -1: no match.
  function rank(entry, query) {
    let best = -1;
    for (const k of entry.keys) {
      const r = k.startsWith(query) ? 0 : (' ' + k).includes(' ' + query) ? 1 : k.includes(query) ? 2 : -1;
      if (r >= 0 && (best < 0 || r < best)) best = r;
    }
    return best;
  }

  function search(list, query) {
    const q = normalize(query);
    if (!q) return list.slice();
    const scored = [];
    list.forEach((e, i) => { const r = rank(e, q); if (r >= 0) scored.push([r, i, e]); });
    return scored.sort((a, b) => a[0] - b[0] || a[1] - b[1]).map(x => x[2]);
  }

  function create(root, options) {
    const doc = root.ownerDocument;
    const lang = options.lang === 'fr' ? 'fr' : 'nl';
    const text = TEXT[lang];
    const list = entries(options.municipalities, lang, options.provinces);
    const input = root.querySelector('[role="combobox"]');
    const listbox = root.querySelector('[role="listbox"]');
    const nisField = root.querySelector('[data-gk-nis]');
    const regionField = root.querySelector('[data-gk-region]');
    const status = root.querySelector('[data-gk-status]');
    const regionSelect = options.regionSelect || null;
    const prefix = listbox.id || 'gk-list';
    let shown = [], active = -1, selected = null, open = false;

    input.setAttribute('aria-expanded', 'false');
    input.setAttribute('aria-autocomplete', 'list');
    input.setAttribute('aria-controls', listbox.id);
    input.setAttribute('autocomplete', 'off');

    function say(message) { if (status) status.textContent = message; }

    function render() {
      const nodes = shown.map((e, i) => {
        const li = doc.createElement('li');
        li.id = prefix + '-' + e.m.nis;
        li.setAttribute('role', 'option');
        li.setAttribute('aria-selected', i === active ? 'true' : 'false');
        li.dataset.nis = e.m.nis;
        const name = doc.createElement('span');
        name.className = 'gk-name';
        name.textContent = e.name;
        li.appendChild(name);
        if (e.alt || e.hint) {
          const extra = doc.createElement('span');
          extra.className = 'gk-alt';
          if (e.alt) extra.setAttribute('lang', e.altLang);
          extra.textContent = e.alt || e.hint;
          li.appendChild(extra);
        }
        return li;
      });
      listbox.replaceChildren(...nodes);
    }

    function setActive(index) {
      const previous = listbox.children[active];
      if (previous) previous.setAttribute('aria-selected', 'false');
      active = index;
      const node = listbox.children[active];
      if (node) {
        node.setAttribute('aria-selected', 'true');
        input.setAttribute('aria-activedescendant', node.id);
        if (typeof node.scrollIntoView === 'function') node.scrollIntoView({ block: 'nearest' });
      } else {
        input.removeAttribute('aria-activedescendant');
      }
    }

    function show(query) {
      shown = search(list, query);
      active = -1;
      render();
      open = true;
      listbox.hidden = shown.length === 0;
      input.setAttribute('aria-expanded', shown.length ? 'true' : 'false');
      input.removeAttribute('aria-activedescendant');
      say(shown.length ? text.found(shown.length) : text.none);
    }

    function close() {
      open = false;
      active = -1;
      listbox.hidden = true;
      input.setAttribute('aria-expanded', 'false');
      input.removeAttribute('aria-activedescendant');
    }

    function commit(entry) {
      selected = entry;
      if (nisField) nisField.value = entry ? entry.m.nis : '';
      if (regionField) regionField.value = entry ? entry.m.region : '';
      if (entry) {
        input.value = entry.name;
        input.removeAttribute('aria-invalid');
        if (regionSelect && regionSelect.value !== entry.m.region) {
          regionSelect.value = entry.m.region;
          regionSelect.dispatchEvent(new options.Event('change', { bubbles: true }));
        }
        say(text.chosen(entry.name));
      }
      root.dispatchEvent(new options.CustomEvent('gemeente-change', {
        bubbles: true,
        detail: entry ? { nis: entry.m.nis, region: entry.m.region, name: entry.name } : null
      }));
    }

    function choose(entry) { commit(entry); close(); }

    function exactMatch() {
      const q = normalize(input.value);
      if (!q) return null;
      const hits = list.filter(e => e.keys.includes(q));
      return hits.length === 1 ? hits[0] : null;
    }

    input.addEventListener('input', () => {
      if (selected) commit(null);
      show(input.value);
    });

    input.addEventListener('click', () => { if (open) close(); else show(selected ? '' : input.value); });

    input.addEventListener('keydown', event => {
      const key = event.key;
      if (key === 'ArrowDown' || key === 'ArrowUp') {
        event.preventDefault();
        if (!open || listbox.hidden) {
          show(selected ? '' : input.value);
          if (event.altKey) return;
          const start = selected ? shown.indexOf(selected) : -1;
          setActive(start >= 0 ? start : key === 'ArrowDown' ? 0 : shown.length - 1);
          return;
        }
        if (event.altKey && key === 'ArrowUp') { close(); return; }
        if (!shown.length) return;
        const next = key === 'ArrowDown'
          ? (active + 1) % shown.length
          : (active <= 0 ? shown.length - 1 : active - 1);
        setActive(next);
      } else if ((key === 'PageDown' || key === 'PageUp') && open && shown.length) {
        event.preventDefault();
        const step = key === 'PageDown' ? 10 : -10;
        setActive(Math.max(0, Math.min(shown.length - 1, (active < 0 ? 0 : active) + step)));
      } else if (key === 'Enter') {
        if (!open) return;
        const entry = active >= 0 ? shown[active] : shown.length === 1 ? shown[0] : exactMatch();
        if (entry) { event.preventDefault(); choose(entry); }
      } else if (key === 'Escape') {
        if (open && !listbox.hidden) { event.preventDefault(); close(); }
        else if (input.value) { event.preventDefault(); input.value = ''; commit(null); }
      } else if (key === 'Tab') {
        if (open && active >= 0) choose(shown[active]); else close();
      }
    });

    input.addEventListener('blur', () => {
      if (!selected) {
        const match = exactMatch();
        if (match) commit(match);
        else if (input.value.trim()) input.setAttribute('aria-invalid', 'true');
      }
      close();
    });

    // Pointer and touch: keep the focus in the input while choosing an option.
    listbox.addEventListener('mousedown', event => event.preventDefault());
    listbox.addEventListener('click', event => {
      let node = event.target;
      while (node && node !== listbox && !(node.dataset && node.dataset.nis)) node = node.parentNode;
      if (!node || node === listbox) return;
      const entry = shown.find(e => e.m.nis === node.dataset.nis);
      if (entry) { choose(entry); input.focus(); }
    });

    return {
      get value() { return selected ? { nis: selected.m.nis, region: selected.m.region, name: selected.name } : null; },
      select(nis) { const e = list.find(x => x.m.nis === String(nis)); if (e) choose(e); return Boolean(e); },
      clear() { input.value = ''; commit(null); close(); }
    };
  }

  // Wires every [data-gemeente-kiezer] element of the page to the JSON in its data-src.
  function init(doc) {
    doc = doc || document;
    const roots = Array.from(doc.querySelectorAll('[data-gemeente-kiezer]'));
    if (!roots.length) return Promise.resolve([]);
    const lang = (doc.documentElement.lang || 'nl').slice(0, 2);
    const src = roots[0].dataset.src || '../data/gemeenten.json';
    return fetch(src).then(r => { if (!r.ok) throw new Error(String(r.status)); return r.json(); })
      .then(data => roots.map(root => {
        const regionSelect = root.dataset.regionSelect ? doc.querySelector(root.dataset.regionSelect) : null;
        return create(root, { municipalities: data.municipalities, provinces: data.provinces, lang, regionSelect,
          Event: window.Event, CustomEvent: window.CustomEvent });
      }))
      .catch(() => {
        for (const root of roots) {
          const status = root.querySelector('[data-gk-status]');
          if (status) status.textContent = (TEXT[lang] || TEXT.nl).error;
        }
        return [];
      });
  }

  window.BKGemeenteKiezer = Object.freeze({ normalize, entries, search, create, init });
  if (typeof document !== 'undefined' && document.querySelector && document.querySelector('[data-gemeente-kiezer]')) {
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', () => init(document));
    else init(document);
  }
})();
