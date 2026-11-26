// Generic interface components; no tax logic belongs here.
//  1. Accessible tabs (WAI-ARIA tabs pattern: arrow keys, Home and End move and select).
//  2. Dialog openers: <button data-dialog-open="id"> opens <dialog id="id" class="dialog">;
//     a <form method="dialog"> inside closes it without script.
// Markup: <div class="tabs"><div class="tab-list" role="tablist" aria-label="…">
//   <button role="tab" id="t1" aria-controls="p1" aria-selected="true">…</button>…</div>
//   <div role="tabpanel" id="p1" aria-labelledby="t1" tabindex="0">…</div>…</div>
// Without JavaScript every panel stays visible (only the server-rendered `hidden` hides them,
// and this script is what adds it), so content is never lost.
(() => {
  function select(tabs, tab, focus) {
    for (const t of tabs) {
      const on = t === tab;
      t.setAttribute("aria-selected", on ? "true" : "false");
      t.tabIndex = on ? 0 : -1;
      const panel = t.ownerDocument.getElementById(t.getAttribute("aria-controls"));
      if (panel) panel.hidden = !on;
    }
    if (focus) tab.focus();
  }

  function mount(root) {
    const list = root.querySelector('[role="tablist"]');
    if (!list || list.dataset.ready) return;
    list.dataset.ready = "1";
    const tabs = Array.from(list.querySelectorAll('[role="tab"]'));
    if (!tabs.length) return;
    select(tabs, tabs.find(t => t.getAttribute("aria-selected") === "true") || tabs[0], false);
    list.addEventListener("click", e => {
      const tab = e.target.closest('[role="tab"]');
      if (tab && tab.getAttribute("aria-disabled") !== "true") select(tabs, tab, false);
    });
    list.addEventListener("keydown", e => {
      const i = tabs.indexOf(e.target);
      if (i < 0) return;
      const enabled = tabs.filter(t => t.getAttribute("aria-disabled") !== "true");
      const j = enabled.indexOf(e.target);
      let next = null;
      if (e.key === "ArrowRight") next = enabled[(j + 1) % enabled.length];
      else if (e.key === "ArrowLeft") next = enabled[(j - 1 + enabled.length) % enabled.length];
      else if (e.key === "Home") next = enabled[0];
      else if (e.key === "End") next = enabled[enabled.length - 1];
      if (next) { e.preventDefault(); select(tabs, next, true); }
    });
  }

  function mountDialogs(doc) {
    for (const button of doc.querySelectorAll("[data-dialog-open]")) {
      if (button.dataset.ready) continue;
      button.dataset.ready = "1";
      button.addEventListener("click", () => {
        const dialog = doc.getElementById(button.dataset.dialogOpen);
        if (dialog && typeof dialog.showModal === "function") dialog.showModal();
      });
    }
  }

  function mountAll(doc) { for (const root of doc.querySelectorAll(".tabs")) mount(root); mountDialogs(doc); }
  window.BKComponents = Object.freeze({ mount, mountAll });
  if (typeof document !== "undefined" && document.addEventListener) {
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", () => mountAll(document));
    else mountAll(document);
  }
})();
