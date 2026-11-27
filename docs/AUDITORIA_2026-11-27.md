# Auditoría de calidad de Belastingkaart, 2026-11-27

Auditoría de solo lectura de `main` en `bb26851` (PR #12 a #30 incluidos). No se ha cambiado código. El listón es Mapafiscal (`/home/user/alexgalindoeu/mapafiscal/web`) y el público son personas sin formación fiscal.

## Método

- **Sitio servido:** `python3 -m http.server` (`web/` en el puerto 8731 y Mapafiscal en el 8732), con Playwright y Chromium.
- **Páginas:** las 154 páginas HTML de `web/`: 75 NL, 75 FR, `/`, `404.html` y `widget/{nl,fr}.html`.
- **Accesibilidad:** axe-core 4.x, instalado con `npm i --no-save` fuera del repo, con las etiquetas `wcag2a`, `wcag2aa`, `wcag21a`, `wcag21aa`, `wcag22aa` y `best-practice`. Se pasó en cada página con `colorScheme` claro y oscuro. Además:
  - recorrido con Tab (hasta 120 paradas) en 12 páginas representativas, comprobando el foco visible;
  - landmarks, orden de encabezados, objetivos táctiles a 390 px, reflow a 320 px y `prefers-reduced-motion`;
  - contraste de los tokens calculado a mano para lo que axe deja como «incomplete».
- **Rendimiento:** 390 px, DPR 3, red emulada (150 ms RTT, 1,6 Mbit/s de bajada y 750 kbit/s de subida), CPU ×4 y caché desactivada. LCP y CLS se miden con `PerformanceObserver` (`buffered`). Es la mejor de dos pasadas. El servidor local no comprime, así que se da el peso en bruto y el peso con gzip estimado.
- **Enlaces:** se resolvieron los 205 enlaces y recursos internos distintos que salen de las 154 páginas, además de los fragmentos, `canonical`, `hreflang` y `sitemap.xml`.
- **Paridad NL/FR:** se emparejó cada página por su `hreflang`. Se compararon los recuentos de h2, h3, campos, tablas, filas, enlaces y `<details>`, y se buscaron palabras del otro idioma fuera de los elementos con `lang`.
- **Guardas:** `BKTaxEngine.calculate()` en el navegador y envío real de los formularios en NL y FR. Además, búsqueda de importes y porcentajes en todo el contenido y de texto español en el HTML y en las cadenas de `web/js/`.
- **Comprobaciones del repo:** `npm test` (216 en verde) y `npm run validate:params` (23 parámetros, OK).

**Capturas:** 46 composiciones lado a lado, Belastingkaart a la izquierda y Mapafiscal a la derecha, a 390 y 1280 px. Están en `/tmp/claude-0/-home-user-belastingkaart/becffa7d-79f2-5d47-a710-8bd51d4acab7/scratchpad/shots-auditoria/` y no se suben al repo (51 MB). Los nombres siguen el patrón `NN-tipo-ancho.png`: `01-portada`, `02-simulador`, `03-maandloon`, …, `23-sueldo-neto`. Las capturas sueltas están en `raw/`.

## Resumen

**Lo que está bien:**
- No hay errores de JavaScript ni respuestas 4xx/5xx en ninguna página.
- `canonical` correcto en las 150 páginas NL/FR y `hreflang` NL⇄FR recíproco en todas.
- El sitemap cubre las 148 páginas indexables.
- Ninguna página muestra un neto, el motor sigue `blocked` y no se filtra texto español.
- La portada es más ligera y rápida que la de Mapafiscal: LCP de 2,06 s frente a 3,17 s.

**Lo que preocupa:**
- Un fallo de entrada de datos que hay que cerrar antes de desbloquear el motor.
- Metadatos y textos que prometen un cálculo que hoy no existe.
- Algunos fallos de accesibilidad repetidos en todas las páginas: el nombre del botón de idioma, el foco del mapa y el reflow a 320 px.
- Muchas tablas llenas de guiones, que para una persona normal parecen una web rota.

**Escala de prioridades:**
- **P0:** bloquea la publicación o el desbloqueo del cálculo.
- **P1:** se corrige antes de publicar.
- **P2:** mejora.

---

## P0

### P0-1 · El importe bruto «3.500» se guarda como 3,50 € y se da por válido
- **Páginas:** `web/nl/index.html` y `web/fr/index.html`, formulario `#salary-form`. Ocurre lo mismo en todas las herramientas que usen `input[type=number]` para importes.
- **Problema:**
  - El campo `grossMonthly` es `type="number"` y su placeholder es «Bijv. 3.500» (FR: «Ex. 3 500»).
  - Un usuario belga que escribe el punto de miles, como sugiere el propio ejemplo, envía `3.500`.
  - `BKGross.parseMonthlyGross` lo convierte en `3.5`.
  - La validación pasa y el panel dice «Je gegevens zijn correct ingevuld» (FR: «données correctes»).
  - `#result[data-input]` queda con `"grossMonthly":3.5`.
  - Con «3500,50» Chromium descarta la coma: el valor queda en `350050` y el navegador lo rechaza por superar el máximo.
  - Hoy no se muestra ningún neto, pero el día que se desbloquee el motor calcularía sobre 3,50 €.
- **Reproducir:**
  1. Abrir `/nl/` y bajar al simulador.
  2. Escribir `3.500` en «Bruto maandloon (€)», elegir «Namen» y pulsar «Berekenen».
  3. En la consola, `document.getElementById('result').dataset.input` muestra `"grossMonthly":3.5`.
- **Solución:**
  - Usar `type="text" inputmode="decimal"` y `BKAmount.parse` (`web/js/importe.js`), que ya rechaza los formatos ambiguos y ya usa el cálculo rápido (`#qc-gross`).
  - Mostrar el error en el campo con `aria-invalid` y `aria-describedby`.
  - Añadir tests Node para «3.500», «3 500», «3500,50» y «3.500,50».

### P0-2 · Títulos, descripciones y textos prometen un cálculo que la web no hace
- **Páginas y archivos:**
  - `web/nl/index.html`: `<title>Bruto netto berekenen in België</title>` y la descripción «Bereken je nettoloon in België … met RSZ-bijdragen en bedrijfsvoorheffing volgens officiële bronnen».
  - `web/fr/index.html`: «Calcul salaire brut-net en Belgique» y «Calculez votre salaire net…».
  - Lo mismo en `og:*` y `twitter:*`, generados por `tools/build_head.mjs`.
  - En el cuerpo del simulador: «Federale belasting, sociale bijdragen en gemeentebelasting worden afzonderlijk berekend en toegelicht».
  - `nl/scenarios/`: «…berekend met dezelfde regels» (FR «calculées avec les mêmes règles»).
  - `nl/methodologie/`: «Zo berekenen we je nettoloon».
  - Bloque de la portada «Waarom je de cijfers kunt vertrouwen», cuando no hay cifras.
  - Cada página de región: el bloque «Bereken je nettoloon in Vlaanderen» y tres tablas de «—».
  - El widget para terceros, con el botón «Bereken mijn nettoloon».
- **Problema:** quien llegue desde un buscador espera un neto y encuentra «Resultaat volgt». Contradice el espíritu de la regla del producto (no fingir cobertura) y daña la confianza antes del lanzamiento.
- **Reproducir:** ver el `<head>` de `/nl/` y `/fr/` y leer el bloque `#simulator`.
- **Solución:**
  - Mientras `calculation_status` sea `blocked_until_all_required_parameters_confirmed`, hablar en futuro o en modo de preparación. Por ejemplo: «Bruto-netto in België: simulator in opbouw, op basis van officiële bronnen».
  - Que `build_head.mjs` lea el estado del motor y elija la frase.
  - No ofrecer el widget para incrustar hasta que haya resultado (o marcarlo como «beschikbaar zodra…»).

---

## P1

### Accesibilidad

**P1-1 · El botón de idioma «FR»/«NL» incumple 2.5.3 (Label in Name)**
- **Páginas:** 151 páginas, todas salvo `404.html` y los widgets. axe lo marca como serio en modo claro y en modo oscuro.
- **Problema:** `.lang-switch` muestra «FR», pero su `aria-label` es «Version française», así que quien usa control por voz y dice «FR» no lo activa.
- **Reproducir:** axe en `/nl/` → `label-content-name-mismatch` → `.lang-switch`.
- **Solución:**
  - Quitar el `aria-label` y añadir `<span class="visually-hidden"> – Version française</span>` después de «FR».
  - O bien usar `aria-label="FR – Version française"`.
  - Mantener `lang="fr"` y `hreflang`.

**P1-2 · El mapa tiene una parada de tabulación sin foco visible (2.4.7)**
- **Páginas y archivos:** `/nl/`, `/fr/`, `/nl/kaart/`, `/fr/carte/`, con `web/css/kaart.css` (líneas 45 y 48) y `web/js/kaart.js`.
- **Problema:**
  - En el recorrido con Tab, el `<svg class="kaart-svg">` recibe el foco en Chromium y `.kaart-svg:focus { outline: none; }` lo deja invisible.
  - El siguiente Tab llega al primer municipio («Aartselaar»). Su `:focus-visible` solo cambia el trazo, que con 3 px y sin halo apenas se distingue sobre los bordes de los municipios vecinos.
- **Reproducir:** en `/nl/kaart/`, tabular desde «Heel de kaart»: una parada no muestra nada y la siguiente apenas se ve.
- **Solución:**
  - Poner `focusable="false"` en el `<svg>` o quitarlo del orden de tabulación.
  - Dar a `.gem:focus-visible` un contorno de 2 colores (anillo + halo) con contraste ≥ 3:1 frente al relleno y al fondo.

**P1-3 · Hay desplazamiento horizontal a 320 px (1.4.10 Reflow)**
- **Páginas:**
  - `nl/gemeenschappelijke-aanslag/`: 353 px.
  - `nl/woordenlijst/gemeenschappelijke-aanslag/`: 353 px.
  - `nl/woordenlijst/werknemersbijdrage/`: 347 px.
  - `nl/gemeentebelasting/` y `nl/woordenlijst/gemeentebelasting/`: 332 px.
  - `nl/pensioensparen/langetermijnsparen/`: 337 px.
  - `nl/wonen/registratiebelasting/`: 337 px (la tabla llega a 410 px).
  - `fr/guide-de-style/`: 348 px.
- **Problema:**
  - En los 5 primeros casos, el enlace «Contact» de la barra `.nav` sobresale del documento: `window.scrollTo(200,0)` desplaza 12–33 px.
  - En `registratiebelasting` es la tabla de tarifas, que no está dentro de un contenedor con scroll.
- **Reproducir:** ventana de 320×700, abrir la página y ejecutar `window.scrollTo(200,0); scrollX` → mayor que 0.
- **Solución:**
  - En `site.css`, dentro de `@media (max-width:1023px)`, cambiar en `.nav` `margin: 0 -12px` por `width: calc(100% + 24px)` con `max-width: 100vw`, o recortarlo dentro de `.appbar-in` con `overflow-x: clip`.
  - Envolver las tablas largas en `.table-scroll { overflow-x: auto }` con `tabindex="0"` y un `aria-label`.

**P1-4 · La página 404 tiene un «saltar al contenido» que lleva a la portada**
- **Página:** `web/404.html`.
- **Problema:** por `<base href="/">`, el enlace `href="#content"` se resuelve como `/#content`. Al usar el salto con el teclado se sale de la 404 y se carga la portada.
- **Reproducir:** abrir `/404.html`, pulsar Tab y Enter.
- **Solución:** generar `href` con la ruta absoluta de la propia página por script, o enfocar `#content` con JS (`onclick="document.getElementById('content').focus();return false"`).

**P1-5 · Los encabezados de las herramientas se saltan niveles (1.3.1)**
- **Páginas:** las 12 herramientas NL/FR: `maandloon`, `marginaal-tarief`, `jobaanbiedingen-vergelijken`, `gemeenschappelijke-aanslag`, `twee-werkgevers`, `scenarios` y sus equivalentes FR.
- **Problema:** el panel de resultado inyecta un `<h3>` (por ejemplo `#ml-gross > h3`) directamente bajo el `<h1>`.
- **Reproducir:** axe → `heading-order`.
- **Solución:** que el título del panel sea un `<h2>` (con el estilo `card-title`), o añadir un `<h2 class="visually-hidden">Resultaat</h2>`.

### Contenido y experiencia de uso

**P1-6 · Las tablas llenas de «—» hacen que la web parezca rota**
- **Páginas:**
  - `nl|fr/gewesten|regions/*`: «Personenbelasting … tegenover de andere gewesten» y «Marginaal en gemiddeld tarief», con 4 filas × 2 columnas de «—».
  - Columna «Gewestelijke opcentiemen» con «volgt zodra bevestigd», que además se corta («bevestig…»; ver `12-region-1280.png`).
  - Portada: «— nettoloon per maand» y la barra Vlaanderen/Brussel/Wallonië vacía.
- **Problema:**
  - Para una persona normal, una tabla de guiones parece un error.
  - Mapafiscal no muestra nunca tablas vacías; muestra el dato o no muestra el bloque.
- **Solución:**
  - Mientras el dato esté pendiente, sustituir la tabla por un solo aviso breve («Deze vergelijking verschijnt zodra…»), sin la estructura vacía.
  - Arreglar el desbordamiento de la columna con `white-space: normal` y `text-align: start` en móvil.

**P1-7 · La página de contacto no deja contactar**
- **Páginas:** `nl/contact/`, `fr/contact/`.
- **Problema:** el texto invita a «Meld … een mogelijke fout», pero también dice que no hay dirección. Es un callejón sin salida.
- **Solución:** está pendiente de una decisión del dueño (ver TABLERO). Hasta entonces, quitar «Contact» de la barra superior (dejarlo en el pie) o enlazar las issues públicas de GitHub si el dueño lo aprueba.

**P1-8 · Las fuentes en neerlandés dentro de páginas FR no llevan `lang="nl"` (3.1.2)**
- **Páginas:** `fr/logement/*`, `fr/regions/flandre/` y bloques de fuentes de `fr/epargne-pension/*`.
- **Problema:** títulos como «Wanneer en waar is het verkooprecht verschuldigd?», «Het kadastraal inkomen» o «Woonbonus voor de enige en eigen woning» se leen con voz francesa.
- **Solución:** en los generadores (`tools/build_wonen.mjs`, `tools/build_pensioensparen.mjs`, `tools/lib/*`), poner los títulos de fuente en `<cite lang="nl">`. Ya se indica «(en néerlandais)»; mantenerlo.

**P1-9 · Los campos `type=number` no aceptan la coma decimal**
- **Páginas:** «Kinderen ten laste» y los importes de varias herramientas.
- **Problema:**
  - Los mensajes de validación nativos salen en el idioma del navegador, no en el de la página (con el navegador en inglés: «Please fill out this field.»).
  - En cifras con decimales, el `type=number` de Chromium no acepta la coma belga (ver P0-1).
- **Solución:** `novalidate` en el `<form>` y mensajes propios NL/FR asociados con `aria-describedby`, como ya hace el cálculo rápido.

---

## P2

### Accesibilidad

**P2-1 · Cabeceras de tabla vacías**
- **Páginas:** `nl/jobaanbiedingen-vergelijken`, `nl/gemeenschappelijke-aanslag`, `nl/pensioensparen/langetermijnsparen` y sus equivalentes FR.
- **Problema:** `<th scope="col"></th>` vacío (axe `empty-table-header`).
- **Solución:** usar `<td>` o poner texto oculto («Omschrijving / Libellé»).

**P2-2 · Contraste bajo en la guía de estilo**
- **Páginas:** `nl/stijlgids/`, `fr/guide-de-style/`.
- **Problema:** el ejemplo del estado bloqueado (`.locked-back .card p`) da 2,94:1. Está en `noindex`, pero el componente `.locked` no debe llegar así a una página pública.
- **Solución:** `aria-hidden="true"` en `.locked-back`, o un texto de muestra con contraste suficiente.

**P2-3 · El borde de los campos tiene poco contraste (1.4.11)**
- **Archivo:** `web/css/site.css`, línea 231 (`--line-2`).
- **Problema:** `#c3cbda` sobre blanco da 1,63:1 y `#313d55` sobre `#111827` también 1,63:1. Dentro de las tarjetas blancas, el borde es lo único que delimita el campo. Mapafiscal tiene el mismo valor.
- **Solución:** borde de campo `--ink-3` (5,9:1), o fondo `--surface-2` dentro de la tarjeta.

**P2-4 · `aria-controls` del cajón apunta a un id que no existe**
- **Archivo:** `web/js/ui.js`.
- **Problema:** `#drawer-toggle` lleva `aria-controls="drawer"` y el `<dialog id="drawer">` no existe hasta que se abre. axe lo deja como `aria-valid-attr-value` incompleto en 152 páginas.
- **Solución:** insertar el `<dialog>` vacío al montar, o añadir `aria-controls` solo al abrir.

**P2-5 · Los widgets no tienen `<h1>`**
- **Páginas:** `widget/nl.html`, `widget/fr.html` (`page-has-heading-one`).
- **Solución:** un `<h1 class="visually-hidden">` o `role="region"` con `aria-label` dentro del iframe.

**P2-6 · Dos parones de lectura en la 404**
- **Página:** `404.html`.
- **Problema:** los dos `<h1>` (NL y FR) están en el DOM. Se ocultan con CSS, así que los lectores de pantalla no los ven, pero sin JS se ven los dos.
- **Solución:** aceptable. Opcional: `hidden` en lugar de CSS.

**Bien resuelto, sin acción:**
- El cajón «Alles/Tout» es un `<dialog>` modal: atrapa el foco, Escape lo cierra y devuelve el foco a `#drawer-toggle`.
- `prefers-reduced-motion` anula todas las transiciones (0 elementos animados).
- Los objetivos táctiles de la barra y el pie cumplen 24/44 px (axe `target-size` ya no falla).
- Los únicos objetivos de menos de 24 px a 390 px son enlaces en línea dentro de párrafos, que son la excepción de 2.5.8.

### Rendimiento

Medido a 390 px en red lenta, con CPU ×4:

| Página | Peticiones | KB en bruto / gzip | FCP | LCP | CLS |
|---|---|---|---|---|---|
| BK `/nl/` | 37 | 593 / 221 | 2.064 ms | 2.064 ms | 0 |
| MF `/` | 36 | 1.397 / 447 | 2.828 ms | 3.168 ms | 0,054 |
| BK `/nl/maandloon/` | 17 | 337 / 187 | 1.844 ms | 1.844 ms | 0 |
| MF `/sueldo-mensual/` | 8 | 307 / 164 | 1.816 ms | 1.816 ms | 0 |
| BK `/nl/kaart/` | 13 | 654 / 273 | 2.000 ms | 2.000 ms | 0 |
| MF `/ranking-irpf-comunidades/` | 8 | 361 / 179 | 2.064 ms | 2.064 ms | 0 |
| BK `/nl/woordenlijst/` | 10 | 268 / 164 | 1.556 ms | 1.556 ms | 0 |
| MF `/glosario/` | 9 | 300 / 165 | 1.828 ms | 1.828 ms | 0 |
| BK `/nl/zelfstandigen/` | 11 | 271 / 165 | 1.548 ms | 1.548 ms | 0 |
| MF `/autonomos/` | 9 | 312 / 169 | 1.880 ms | 1.880 ms | 0 |
| BK `/nl/gidsen/van-bruto-naar-netto/` | 10 | 270 / 165 | 1.600 ms | 1.600 ms | 0 |
| MF `/guias/12-o-14-pagas/` | 15 | 713 / 239 | 1.988 ms | 1.988 ms | 0 |
| BK `/nl/pensioensparen/` | 11 | 275 / 166 | 1.620 ms | 1.620 ms | 0 |
| MF `/rescate-plan-pensiones/` | 11 | 325 / 184 | 1.912 ms | 1.912 ms | 0 |
| BK `/nl/methodologie/` | 10 | 263 / 163 | 1.532 ms | 1.532 ms | 0 |
| MF `/metodologia/` | 8 | 285 / 161 | 1.792 ms | 1.792 ms | 0 |

Belastingkaart iguala o mejora a Mapafiscal en todas las páginas comparadas y no tiene desplazamientos de diseño. Margen de mejora:

**P2-7 · La portada carga 29 `<script>`**
- **Archivo:** `web/nl/index.html` (y `fr/`).
- **Problema:**
  - Siete de esos scripts son esqueletos sin función hoy: `cuentas.js` (6 líneas), `informe.js` (6), `csv.js`, `anuncios.js`, `analitica.js`, `widget.js` y `escenarios.js`.
  - Además están `deducciones.js`, `conjunta.js`, `explicacion.js` y `sueldo_mes.js`.
  - Son 37 peticiones frente a 8–11 en las páginas de contenido.
- **Solución:** no cargar los módulos desactivados en `config.js`, o concatenar en un solo `app.bundle.js` en el build.

**P2-8 · `taal.js` es un script síncrono que bloquea el renderizado**
- **Páginas:** todas, en el `<head>`.
- **Problema:** es necesario para redirigir antes de pintar, pero cuesta un viaje de red completo en móvil.
- **Solución:** incrustar en línea las ~40 líneas de `redirectIfNeeded` y dejar el resto en `defer`.

**P2-9 · `kaart_be.json` (325 KB en bruto) se precarga en la portada**
- **Archivo:** `web/nl/index.html`, línea 45, `<link rel="preload" … as="fetch">`.
- **Problema:** en red lenta compite con las fuentes y el CSS, aunque el mapa queda por debajo del pliegue a 390 px.
- **Solución:**
  - Quitar el `preload` a ≤ 760 px (`media="(min-width: 761px)"`) o cargar el mapa con `IntersectionObserver`.
  - Simplificar la geometría para la vista de portada (existe `tools/build_kaart.mjs`).

**P2-10 · IBM Plex Mono se descarga en todas las páginas**
- **Problema:** son 15 KB solo para el antetítulo. Mapafiscal no la carga en la mayoría de sus páginas.
- **Solución:** usar `font-display: optional` para la mono, o la mono del sistema en el antetítulo.

### Enlaces, SEO y paridad

**P2-11 · `x-default` apunta a la portada en 148 páginas**
- **Problema:** `hreflang="x-default"` es siempre `https://belastingkaart.be/nl/` (también en el sitemap). Google interpreta que la versión por defecto de, por ejemplo, `/nl/woordenlijst/aanslagjaar/` es la portada.
- **Solución:** que `x-default` sea la versión NL de la misma página, o quitarlo en las subpáginas.

**P2-12 · El sitemap no tiene `<lastmod>`**
- **Archivo:** `web/sitemap.xml`.
- **Solución:** generarlo desde la fecha «Bijgewerkt op» de cada página (`tools/generate_sitemap.mjs`).

**Sin acción:**
- 0 enlaces internos rotos, 0 recursos 404, `canonical` correcto en 150/150 y `hreflang` recíproco en 150/150.
- Los fragmentos «ausentes» son estados de herramienta en el hash (`#amount=…`), no anclas.
- Las páginas `stijlgids/guide-de-style` son `noindex` y quedan fuera del sitemap a propósito.
- Todos los dominios externos son oficiales: `minfin.fgov.be`, `fin.belgium.be`, `finances.belgium.be`, `myminfin.be`, `belastingen.fenb.be`, `socialsecurity.be`, `rsvz.be`, `inasti.be`, `statbel.fgov.be`, `vlaanderen.be`, `belasting.vlaanderen.be`, `burgerprofiel.be`, `fiscaliteit.brussels`, `finances.wallonie.be` y `ejustice.just.fgov.be`.

**P2-13 · A dos páginas FR de épargne-pension les falta una fuente**
- **Páginas:**
  - `nl/pensioensparen/` frente a `fr/epargne-pension/`: 14 frente a 13 fuentes.
  - `nl/pensioensparen/anticipatieve-heffing/` frente a `fr/epargne-pension/taxe-a-60-ans/`: 8 frente a 7.
- **Problema:** la versión NL cita un documento Fisconet más que no aparece en FR (en NL: `…/052c12fb-…` y `…/fb2a08b6-…`).
- **Solución:** añadir la versión FR del documento Fisconet, o explicar por qué solo existe en NL. Fuera de esto, las 75 parejas tienen la misma estructura. Las diferencias de h2 en `woordenlijst/lexique` son solo las letras del índice alfabético.

**P2-14 · Terminología**
- **Problema:**
  - La barra dice «Methodologie», pero la página se titula «Zo berekenen we je nettoloon» y la miga dice «Hoe we rekenen». El usuario ve tres nombres para la misma página; en FR pasa lo mismo («Méthodologie» y «Notre méthode de calcul»).
  - En el simulador, «12 maanden» frente a «13 betalingen / 14 betalingen». La herramienta `maandloon` usa «uitbetalingen»: unificar en «12 / 13 / 14 uitbetalingen» y «12 / 13 / 14 paiements».
- **Solución:** fijar un único nombre por página y un único término por concepto en NL y en FR.

**P2-15 · `TABLERO.md` está desactualizado**
- **Problema:**
  - La tabla «Tareas» sigue marcando como «Bloqueada» la verificación de los tramos 2026 y del mínimo exento, cuando ya se hizo con Fisconet (#14).
  - «Bedrijfsvoorheffing» y «Forfait beroepskosten» siguen «Libre» aunque se hicieron en #14 y #16.
- **Solución:** actualizar la tabla para que la página de validación y el registro de tareas no se contradigan.

### Paridad visual y de experiencia con Mapafiscal

Por tipo de página, con las capturas en `shots-auditoria/`:

| Tipo | Captura | Qué le falta a Belastingkaart |
|---|---|---|
| Portada | `01-portada-*` | Mapafiscal enseña un resultado de ejemplo (4.598 €), un ranking en barra y una frase con cifras («Con 30.000 € … 552 € de diferencia»). BK enseña un hueco «— nettoloon per maand» y una barra vacía (ver P1-6). El placeholder «3.500» del cálculo rápido, alineado a la derecha y en gris oscuro, parece un valor ya rellenado: usar un gris más claro o un valor real de ejemplo. MF también muestra «Herramientas» con etiqueta «Te puede interesar»; BK mezcla en «Hulpmiddelen» herramientas operativas con módulos de la hoja de ruta («Pensioenen en andere inkomsten») sin distinguirlos. |
| Simulador | `02-simulador-*` | Estructura equivalente: pasos numerados y panel de resultado fijo. Faltan las palancas («Afina con tu familia y deducciones»), el desglose, el informe y la opción de guardar, todo condicionado al motor. |
| Herramientas (`maandloon`, `marginaal`, ofertas, conjunta, dos pagadores) | `03`–`07` | Paridad de componentes buena. A 1280 px, el «Kort gezegd» de `maandloon` y la tarjeta del mapa de `kaart` se salen por la izquierda de la columna de contenido (empiezan en x≈47 cuando la columna empieza en x≈160; ver `03-maandloon-1280.png` y `16-mapa-1280.png`). Revisar el `margin-inline` negativo de `.summary-box` y `.cover-map` fuera de la portada. MF incluye ejemplos resueltos con tabla; BK los da solo en bruto, correctamente. |
| Glosario y término | `08`, `09` | Paridad completa. |
| Guías | `10`, `11` | Paridad completa. MF añade en cada guía un ejemplo numérico paso a paso: pendiente del motor. |
| Región | `12-region-*` | MF tiene una calculadora integrada con cifras, KPI y tabla de tramos. BK tiene la tabla de tramos federal (con fuente) y tres bloques de «—» (P1-6). |
| Vivienda, autónomos, pensiones | `13`–`15` | Paridad de plantilla buena: resumen, tabla de cifras oficiales con fuente y bloques de explicación. MF tiene páginas por territorio (17–19 por sección), que en Bélgica corresponderían a una por región: hoy solo hay `wonen` para Flandes, coherente con el alcance. |
| Mapa y ranking | `16-mapa-*` | MF tiene «Las cinco conclusiones», un mapa coloreado por cuota y un ranking con datos abiertos (CC BY 4.0). BK tiene un mapa por región, sin color de tarifa hasta que estén confirmados los porcentajes municipales. Falta el conjunto de datos de las aanvullende gemeentebelasting (tarea «Libre» del TABLERO). |
| Metodología, validación, acerca de, legal y contacto | `17`–`21` | Paridad de plantilla buena. Contacto sin dirección (P1-7). |
| Widget | `22-widget-*` | Paridad visual. Problema de contenido descrito en P0-2. |
| Páginas por salario | `23-sueldo-neto-*` | MF tiene 513 páginas `sueldo-neto/<importe>/` con el neto por territorio. Su equivalente belga (`nettoloon/<bruto>/`) no existe y no debe existir hasta que haya resultado confirmado. Se compara con `gezin-en-bedrijfsvoorheffing/` solo como referencia. |
| Barra superior | todas | MF tiene «Entrar / Crear cuenta» y anuncios laterales. BK no los tiene, con razón: el dueño aún no ha activado cuentas ni anuncios. A 390 px, la quinta entrada de la barra («Contact») queda cortada con degradado y obliga a desplazar la barra (mismo patrón que MF). |

### Guardas de corrección

- **Motor:** `BKTaxEngine.calculate()` devuelve `{status:"blocked", missing:[7 reglas]}` y `data-parameter-status="blocked_until_all_required_parameters_confirmed"` en `/nl/` y `/fr/`. Con un formulario válido, el panel dice «Resultaat volgt zodra alle regels bevestigd zijn». No aparece ningún importe con «€» tras enviar los formularios en NL ni en FR.
- **Importes visibles:** solo hay de dos tipos.
  1. Aritmética de bruto en las herramientas (`maandloon`, ofertas, conjunta, dos pagadores, `marginaal`), siempre con la etiqueta «bruto/brut». No son cifras fiscales.
  2. Parámetros oficiales con fuente en la misma página: tramos 16.720 / 29.510 / 51.070 € y 11.550 € en `gewesten/*` e `inkomstenjaar`; cotizaciones de autónomos 20,50 % / 14,16 % y los umbrales RSVZ; pensioensparen 1.050 / 1.350 €, 30 % / 25 % y 8 % / 33 % / 10 %; registratiebelasting 2–12 %; 13,07 % y 108 % de la RSZ.
- **Riesgo:** los importes de `zelfstandigen`, `pensioensparen` y `wonen` están en `tools/lib/*-content.mjs` y en `docs/sources/*.md`, no en `params/2026/*.yaml`. Por tanto, `validate:params` no los comprueba y no tienen `status`. **(P2-16)** Migrarlos a `params/` (o a un YAML de contenido con el mismo validador), para que un cambio de fuente los marque como `pending` y no queden cifras obsoletas en la web.
- **Texto español:** 0 coincidencias en el HTML visible y en las cadenas de `web/js/`. Los nombres de algunos módulos (`anuncios.js`, `cuentas.js`, `sueldo_mes.js`…) son españoles. No se ven en la interfaz, pero sí en las herramientas de desarrollo y en las URL. **(P2-17)** Renombrarlos cuando se toque el build.
- **Idioma por página:** no hay mezcla de idiomas, salvo los títulos de fuentes NL sin `lang` en FR (P1-8). El bloque «Nederlands · Français» del antetítulo y los enlaces de idioma llevan `lang` correcto.
