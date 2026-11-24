// Small DOM helpers; no tax logic belongs in this module.
(() => {
  function setText(selector, value, root=document) {
    const node = root.querySelector(selector);
    if (!node) return false;
    node.textContent = String(value);
    return true;
  }
  function setStatus(node, status, message) {
    if (!node) return;
    node.dataset.status = status;
    node.textContent = message;
    node.setAttribute("role","status");
  }
  window.BKUI = Object.freeze({setText,setStatus});
})();
