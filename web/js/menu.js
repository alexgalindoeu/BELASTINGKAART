// Belastingkaart — menu registry: the ONE source for the top-bar navigation and the
// "Alles / Tout" drawer (rendered by js/ui.js). No tax logic and no figures belong here.
//
// To add a page: add one line to the right group in BOTH languages (same position), e.g.
//   { label: "Woordenlijst", text: "Fiscale begrippen van A tot Z.", href: "woordenlijst/", icon: "glossary" },
// - href is relative to the language root (/nl/ or /fr/): "methodologie/", "#simulator", "" (home);
// - icon is a key of ICONS below;
// - test/menu.test.mjs checks that every href exists and that NL and FR have the same shape.
// Static header navs in the HTML are the no-JavaScript fallback; the test checks they match NAV.
(() => {
  // Pictograms: solid straight-edged polygons on a 24×24 grid, brand blue with at most one
  // accent piece (class="r"), as on the home page tool index.
  const ICONS = {
    payslip: '<polygon points="3,2 17,2 21,6 21,22 3,22"/><polygon class="r" points="7,15 17,15 17,18 7,18"/>',
    family: '<polygon points="3,9 9,9 9,22 3,22"/><polygon points="11,6 17,6 17,22 11,22"/><polygon class="r" points="19,14 22,14 22,22 19,22"/>',
    municipality: '<polygon points="12,2 21,10 21,22 3,22 3,10"/><polygon class="r" points="10,15 14,15 14,22 10,22"/>',
    selfemployed: '<polygon points="2,8 22,8 22,21 2,21"/><polygon points="8,3 16,3 16,7 14,7 14,5 10,5 10,7 8,7"/><polygon class="r" points="2,12 22,12 22,14 2,14"/>',
    pension: '<polygon points="2,3 5,3 5,19 19,19 19,3 22,3 22,22 2,22"/><polygon class="r" points="7,17 17,17 17,9 7,9"/>',
    scenarios: '<polygon points="2,9 7,9 7,21 2,21"/><polygon class="r" points="9.5,4 14.5,4 14.5,21 9.5,21"/><polygon points="17,12 22,12 22,21 17,21"/>',
    // a sheet with ruled steps and the checked line
    method: '<path fill-rule="evenodd" d="M4 2h12l4 4v16H4zM7 7v2h8V7zM7 11v2h10v-2z"/><polygon class="r" points="7,16 13,16 13,19 7,19"/>',
    // a book standing and one leaning on the slant
    sources: '<polygon points="3,3 8,3 8,21 3,21"/><polygon class="r" points="10,21 14.5,21 22,8 17.5,8"/><polygon points="2,22 22,22 22,23.5 2,23.5"/>',
    // an envelope cut by the slant
    contact: '<polygon points="2,4 22,4 12,12"/><polygon points="2,7 12,15 22,7 22,20 2,20"/><polygon class="r" points="15,20 22,20 22,14"/>',
    // a shield with a straight top
    privacy: '<polygon points="4,3 20,3 20,13 12,22 4,13"/><polygon class="r" points="9,9 15,9 15,13 9,13"/>'
  };

  const COPY = {
    nl: { button: "Alles", title: "Alles wat we aanbieden", close: "Het paneel sluiten", drawerNav: "Alle pagina’s", menu: "Menu", nav: "Secties" },
    fr: { button: "Tout", title: "Tout ce que nous proposons", close: "Fermer le panneau", drawerNav: "Toutes les pages", menu: "Menu", nav: "Sections" }
  };

  // Main navigation of the top bar.
  const NAV = {
    nl: [
      { label: "Simulator", href: "#simulator" },
      { label: "Methodologie", href: "methodologie/" },
      { label: "Bronnen", href: "bronnen/" },
      { label: "Contact", href: "contact/" }
    ],
    fr: [
      { label: "Simulateur", href: "#simulator" },
      { label: "Méthodologie", href: "methodologie/" },
      { label: "Sources", href: "sources/" },
      { label: "Contact", href: "contact/" }
    ]
  };

  // Groups of the "Alles / Tout" drawer.
  const GROUPS = {
    nl: [
      { group: "Berekenen", items: [
        { label: "Bruto-netto voor werknemers", text: "Maandelijkse en jaarlijkse begrippen duidelijk gescheiden.", href: "#simulator", icon: "payslip" }
      ] },
      { group: "Thema’s", items: [
        { label: "Gezinssituatie en bedrijfsvoorheffing", text: "Gezinslast en inhoudingen op je loon, volgens de Belgische regels.", href: "gezin-en-bedrijfsvoorheffing/", icon: "family" },
        { label: "Gemeentebelasting en gewest", text: "De aanvullende gemeentebelasting en het juiste gewest voor je woonplaats.", href: "gemeentebelasting/", icon: "municipality" },
        { label: "Zelfstandigen", text: "Inkomen en sociale bijdragen, pas nadat de officiële regels gedekt zijn.", href: "zelfstandigen/", icon: "selfemployed" },
        { label: "Pensioenen en andere inkomsten", text: "Waar de Belgische wetgeving en het toepassingsgebied gedocumenteerd zijn.", href: "pensioenen/", icon: "pension" },
        { label: "Scenario’s en vergelijkingen", text: "Toelichtingen, verslagen en vergelijkingen voor Belgische situaties.", href: "scenarios/", icon: "scenarios" }
      ] },
      { group: "Over Belastingkaart", items: [
        { label: "Hoe we rekenen", text: "De rekenmotor, de officiële bronnen en wat nog niet gedekt is.", href: "methodologie/", icon: "method" },
        { label: "Bronnen", text: "De officiële bronnen achter elke parameter.", href: "bronnen/", icon: "sources" },
        { label: "Contact", text: "Hoe je Belastingkaart kunt bereiken.", href: "contact/", icon: "contact" },
        { label: "Privacy", text: "Hoe we met je gegevens omgaan.", href: "privacy/", icon: "privacy" }
      ] }
    ],
    fr: [
      { group: "Calculer", items: [
        { label: "Brut-net pour salariés", text: "Notions mensuelles et annuelles clairement séparées.", href: "#simulator", icon: "payslip" }
      ] },
      { group: "Thèmes", items: [
        { label: "Situation familiale et précompte professionnel", text: "Charges de famille et retenues sur votre salaire, selon les règles belges.", href: "famille-et-precompte-professionnel/", icon: "family" },
        { label: "Taxe communale et région", text: "La taxe communale additionnelle et la bonne région pour votre domicile.", href: "taxe-communale/", icon: "municipality" },
        { label: "Indépendants", text: "Revenus et cotisations sociales, seulement lorsque les règles officielles sont couvertes.", href: "independants/", icon: "selfemployed" },
        { label: "Pensions et autres revenus", text: "Lorsque la législation belge et le champ d’application sont documentés.", href: "pensions/", icon: "pension" },
        { label: "Scénarios et comparaisons", text: "Explications, rapports et comparaisons pour des situations belges.", href: "scenarios/", icon: "scenarios" }
      ] },
      { group: "À propos de Belastingkaart", items: [
        { label: "Notre méthode de calcul", text: "Le moteur de calcul, les sources officielles et ce qui n’est pas encore couvert.", href: "methodologie/", icon: "method" },
        { label: "Sources", text: "Les sources officielles derrière chaque paramètre.", href: "sources/", icon: "sources" },
        { label: "Contact", text: "Comment joindre Belastingkaart.", href: "contact/", icon: "contact" },
        { label: "Confidentialité", text: "Comment nous traitons vos données.", href: "confidentialite/", icon: "privacy" }
      ] }
    ]
  };

  window.BKMenu = Object.freeze({ ICONS, COPY, NAV, GROUPS });
})();
