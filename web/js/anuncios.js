// Ad placement registry. No ad network is requested by this module.
(() => {
  function registerSlot(element, placement) {
    if (!element || !placement) return false;
    element.dataset.adPlacement = placement;
    element.hidden = !window.BK_CONFIG?.features?.advertising;
    return !element.hidden;
  }
  window.BKAds = Object.freeze({registerSlot});
})();
