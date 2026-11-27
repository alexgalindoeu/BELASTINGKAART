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
    // an open book: two pages and the slanted bookmark
    glossary: '<polygon points="2,4 11,6 11,22 2,20"/><polygon points="13,6 22,4 22,20 13,22"/><polygon class="r" points="15,9 20,8 20,10 15,11"/>',
    // a guide: stacked steps
    guides: '<polygon points="3,3 21,3 21,7 3,7"/><polygon points="3,10 17,10 17,14 3,14"/><polygon class="r" points="3,17 12,17 12,21 3,21"/>',
    payslip: '<polygon points="3,2 17,2 21,6 21,22 3,22"/><polygon class="r" points="7,15 17,15 17,18 7,18"/>',
    family: '<polygon points="3,9 9,9 9,22 3,22"/><polygon points="11,6 17,6 17,22 11,22"/><polygon class="r" points="19,14 22,14 22,22 19,22"/>',
    // a folded map in three strips, the middle strip accented
    regions: '<polygon points="2,6 8,4 8,20 2,22"/><polygon class="r" points="9,4 15,6 15,22 9,20"/><polygon points="16,6 22,4 22,20 16,22"/>',
    // a house with a pitched roof and an accented door on the slant side
    home: '<polygon points="12,2 22,11 22,22 2,22 2,11"/><polygon class="r" points="14,14 19,14 19,22 14,22"/>',
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
    privacy: '<polygon points="4,3 20,3 20,13 12,22 4,13"/><polygon class="r" points="9,9 15,9 15,13 9,13"/>',
    // a card with a portrait block and two lines
    about: '<path fill-rule="evenodd" d="M2 4h20v16H2zM5 8v6h5V8zM12 8v2h7V8zM12 12v2h5v-2z"/><polygon class="r" points="5,16 19,16 19,18 5,18"/>',
    // a tick on the slant inside a frame
    validation: '<path fill-rule="evenodd" d="M2 3h20v18H2zM5 6v12h14V6z"/><polygon class="r" points="6.5,12 9,9.5 11,11.5 15.5,7 18,9.5 11,16.5"/>',
    // a paragraph sign built from blocks: a sheet with a section mark
    legal: '<polygon points="5,2 19,2 19,22 5,22"/><polygon class="r" points="9,6 15,6 15,9 9,9"/><polygon class="r" points="9,15 15,15 15,18 9,18"/>',
    // a triangle sign with its bar
    disclaimer: '<polygon points="12,2 23,22 1,22"/><polygon class="r" points="10.75,9 13.25,9 13.25,16 10.75,16"/>',
    // a browser window with its stored item
    cookies: '<path fill-rule="evenodd" d="M2 3h20v18H2zM4 8v11h16V8z"/><polygon class="r" points="7,11 13,11 13,16 7,16"/>'
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
        { label: "Bruto-netto voor werknemers", text: "Maandelijkse en jaarlijkse begrippen duidelijk gescheiden.", href: "#simulator", icon: "payslip" },
        { label: "Maandloon en uitbetalingen", text: "Je brutojaarloon per maand, in 12, 13 of 14 uitbetalingen.", href: "maandloon/", icon: "payslip" },
        { label: "Marginaal tarief", text: "Wat blijft er over van een loonsverhoging?", href: "marginaal-tarief/", icon: "scenarios" },
        { label: "Twee jobaanbiedingen vergelijken", text: "Twee aanbiedingen naast elkaar, eerst in bruto.", href: "jobaanbiedingen-vergelijken/", icon: "selfemployed" },
        { label: "Gemeenschappelijke aanslag", text: "Voor gehuwden en wettelijk samenwonenden.", href: "gemeenschappelijke-aanslag/", icon: "family" },
        { label: "Twee werkgevers in één jaar", text: "Moet je bijbetalen als je bij twee werkgevers werkte?", href: "twee-werkgevers/", icon: "payslip" },
        { label: "Scenario’s en vergelijkingen", text: "Wat als je loon, gemeente of gezin verandert?", href: "scenarios/", icon: "scenarios" },
        { label: "Widget voor je website", text: "Zet de simulator op je eigen website.", href: "widget/", icon: "validation" }
      ] },
      { group: "Thema’s", items: [
        { label: "Gezinssituatie en bedrijfsvoorheffing", text: "Gezinslast en inhoudingen op je loon, volgens de Belgische regels.", href: "gezin-en-bedrijfsvoorheffing/", icon: "family" },
        { label: "Gemeentebelasting en gewest", text: "De aanvullende gemeentebelasting en het juiste gewest voor je woonplaats.", href: "gemeentebelasting/", icon: "municipality" },
        { label: "Belastingen per gewest", text: "Wat Vlaanderen, Brussel en Wallonië regelen in je personenbelasting en voor je woning.", href: "gewesten/", icon: "regions" },
        { label: "Wonen in Vlaanderen", text: "Registratiebelasting, woonbonus, kadastraal inkomen en onroerende voorheffing.", href: "wonen/", icon: "home" },
        { label: "Zelfstandigen", text: "Inkomen en sociale bijdragen, pas nadat de officiële regels gedekt zijn.", href: "zelfstandigen/", icon: "selfemployed" },
        { label: "Pensioenen en andere inkomsten", text: "Waar de Belgische wetgeving en het toepassingsgebied gedocumenteerd zijn.", href: "pensioenen/", icon: "pension" },
        { label: "Gidsen", text: "Van bruto naar netto, werkbonus, vakantiegeld en de belastingaangifte, stap voor stap.", href: "gidsen/", icon: "guides" },
        { label: "Woordenlijst", text: "Loon- en belastingbegrippen van A tot Z, met officiële bronnen.", href: "woordenlijst/", icon: "glossary" }
      ] },
      { group: "Over Belastingkaart", items: [
        { label: "Over ons", text: "Wat Belastingkaart is, wat het berekent en hoe we werken.", href: "over-belastingkaart/", icon: "about" },
        { label: "Hoe we rekenen", text: "De rekenmotor, de officiële bronnen en wat gedekt is.", href: "methodologie/", icon: "method" },
        { label: "Validatie", text: "Hoe elke fiscale parameter wordt gecontroleerd.", href: "validatie/", icon: "validation" },
        { label: "Bronnen", text: "De officiële bronnen achter elke parameter.", href: "bronnen/", icon: "sources" },
        { label: "Contact", text: "Hoe je Belastingkaart kunt bereiken.", href: "contact/", icon: "contact" }
      ] },
      { group: "Juridisch", items: [
        { label: "Juridische informatie", text: "De voorwaarden waaronder je Belastingkaart kunt gebruiken.", href: "juridische-informatie/", icon: "legal" },
        { label: "Disclaimer", text: "Wat je van Belastingkaart kunt verwachten, en wat niet.", href: "disclaimer/", icon: "disclaimer" },
        { label: "Privacy", text: "Hoe we met je gegevens omgaan.", href: "privacy/", icon: "privacy" },
        { label: "Cookies", text: "Wat Belastingkaart in je browser bewaart, en wat niet.", href: "cookies/", icon: "cookies" }
      ] }
    ],
    fr: [
      { group: "Calculer", items: [
        { label: "Brut-net pour salariés", text: "Notions mensuelles et annuelles clairement séparées.", href: "#simulator", icon: "payslip" },
        { label: "Salaire mensuel et paiements", text: "Votre salaire annuel brut par mois, en 12, 13 ou 14 paiements.", href: "salaire-mensuel/", icon: "payslip" },
        { label: "Taux marginal", text: "Que vous reste-t-il d’une augmentation ?", href: "taux-marginal/", icon: "scenarios" },
        { label: "Comparer deux offres d’emploi", text: "Deux offres côte à côte, d’abord en brut.", href: "comparer-offres-emploi/", icon: "selfemployed" },
        { label: "Imposition commune", text: "Pour les personnes mariées et les cohabitants légaux.", href: "imposition-commune/", icon: "family" },
        { label: "Deux employeurs la même année", text: "Devrez-vous payer un supplément après deux employeurs ?", href: "deux-employeurs/", icon: "payslip" },
        { label: "Scénarios et comparaisons", text: "Et si votre salaire, votre commune ou votre famille changeait ?", href: "scenarios/", icon: "scenarios" },
        { label: "Widget pour votre site", text: "Intégrez le simulateur à votre propre site.", href: "widget/", icon: "validation" }
      ] },
      { group: "Thèmes", items: [
        { label: "Situation familiale et précompte professionnel", text: "Charges de famille et retenues sur votre salaire, selon les règles belges.", href: "famille-et-precompte-professionnel/", icon: "family" },
        { label: "Taxe communale et région", text: "La taxe communale additionnelle et la bonne région pour votre domicile.", href: "taxe-communale/", icon: "municipality" },
        { label: "Impôts par région", text: "Ce que la Flandre, Bruxelles et la Wallonie règlent dans votre impôt et pour votre logement.", href: "regions/", icon: "regions" },
        { label: "Logement en Flandre", text: "Droits d’enregistrement, bonus logement, revenu cadastral et précompte immobilier.", href: "logement/", icon: "home" },
        { label: "Indépendants", text: "Revenus et cotisations sociales, seulement lorsque les règles officielles sont couvertes.", href: "independants/", icon: "selfemployed" },
        { label: "Pensions et autres revenus", text: "Lorsque la législation belge et le champ d’application sont documentés.", href: "pensions/", icon: "pension" },
        { label: "Guides", text: "Du brut au net, bonus à l’emploi, pécule de vacances et déclaration d’impôt, pas à pas.", href: "guides/", icon: "guides" },
        { label: "Lexique", text: "Les termes du salaire et de l’impôt de A à Z, avec sources officielles.", href: "lexique/", icon: "glossary" }
      ] },
      { group: "À propos de Belastingkaart", items: [
        { label: "À propos", text: "Ce qu’est Belastingkaart, ce qu’il calcule et comment nous travaillons.", href: "a-propos/", icon: "about" },
        { label: "Notre méthode de calcul", text: "Le moteur de calcul, les sources officielles et ce qui est couvert.", href: "methodologie/", icon: "method" },
        { label: "Validation", text: "Comment chaque paramètre fiscal est vérifié.", href: "validation/", icon: "validation" },
        { label: "Sources", text: "Les sources officielles derrière chaque paramètre.", href: "sources/", icon: "sources" },
        { label: "Contact", text: "Comment joindre Belastingkaart.", href: "contact/", icon: "contact" }
      ] },
      { group: "Juridique", items: [
        { label: "Mentions légales", text: "Les conditions dans lesquelles vous pouvez utiliser Belastingkaart.", href: "mentions-legales/", icon: "legal" },
        { label: "Avertissement", text: "Ce que vous pouvez attendre de Belastingkaart, et ce que vous ne pouvez pas en attendre.", href: "avertissement/", icon: "disclaimer" },
        { label: "Confidentialité", text: "Comment nous traitons vos données.", href: "confidentialite/", icon: "privacy" },
        { label: "Cookies", text: "Ce que Belastingkaart conserve dans votre navigateur, et ce qu’il ne conserve pas.", href: "cookies/", icon: "cookies" }
      ] }
    ]
  };

  window.BKMenu = Object.freeze({ ICONS, COPY, NAV, GROUPS });
})();
