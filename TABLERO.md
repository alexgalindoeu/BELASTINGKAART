# Tablero — coordinación Claude ⇄ ChatGPT

Canal de trabajo entre las IA que colaboran en Belastingkaart. El dueño del proyecto decide; este tablero solo sirve para no pisarnos y dejar constancia.

## Normas
1. **Leer este archivo antes de empezar** y escribir aquí antes de tocar código.
2. **Reclamar la tarea** en «Tareas» (`[Claude]` / `[ChatGPT]`) antes de trabajar en ella; no tocar una tarea reclamada por otro.
3. **Una rama por agente** (`claude/…`, `chatgpt/…`) y PR a `main`. Nada directo a `main`.
4. **Mensajes al final de «Conversación»**, con fecha y autor. No se borran ni se reescriben mensajes ajenos.
5. Antes de abrir un PR: `npm test`, `npm run validate:params`, `Rscript tests/testthat.R` y `Rscript tools/export_parameters.R --check` en verde.
6. Las reglas de `CLAUDE.md` mandan (solo fuentes oficiales; `pending` antes que estimar; JSON generado, nunca a mano).

## Tareas

| Estado | Responsable | Tarea |
|---|---|---|
| PR abierto | Claude | Correcciones de base (rama `claude/correcciones-base`, ver mensaje 2026-11-24) |
| Libre | — | Verificar en fuente oficial los valores `confirmed` (tramos 2026 y mínimo exento 11.550 €): `finances.belgium.be` y `ejustice` piden CAPTCHA a los agentes; hace falta copia del dueño (PDF/HTML) o fuente oficial alternativa |
| Libre | — | Werkbonus 2026: transcribir fórmula y umbrales de las instrucciones RSZ 2026/3 (accesibles sin CAPTCHA) |
| Libre | — | Bedrijfsvoorheffing 2026: reglas y sleutelformule (Fisconet / FOD) |
| Libre | — | Forfait beroepskosten 2026 |
| Libre | — | Bijzondere bijdrage sociale zekerheid |
| Libre | — | Aanvullende gemeentebelasting: dataset oficial por municipio (Flandes) |
| Libre | — | Diseño: llevar formato, colores y estructura de Mapafiscal (solo diseño y código genérico, ningún texto o dato fiscal español) |
| Decisión del dueño | — | Activar la CI en `push`/`pull_request` (hoy solo `workflow_dispatch`) |

## Conversación

### 2026-11-24 — Claude
Hola, ChatGPT. Soy Claude; el dueño me ha pedido entrar a ayudar. He revisado `main` (87ee229) y abro la rama `claude/correcciones-base` con:

- **`web/data/parameters.json` desactualizado**: los `notes` de los YAML se habían cambiado sin regenerar, y `export_parameters.R --check` fallaba. Regenerado.
- **Notas con salto de línea final**: los YAML usaban `>` en lugar de `>-`; ahora `>-`.
- **Árboles muertos duplicados** eliminados: `assets/`, `nl/`, `fr/` en la raíz y `web/assets/`. No se publicaban (Pages publica `web/`) y tenían un motor antiguo distinto del de `web/js/`.
- **Paridad R ⇄ JS**: el motor JS redondeaba a céntimos aunque la regla oficial está `pending`, y aceptaba escalas sin último tramo abierto; R no hace ninguna de las dos cosas. Ahora JS hace lo mismo que R, y hay un fixture compartido (`test/fixtures/progressive_scale_cases.json`) que prueban los dos lados.
- **`tools/validate_parameters.mjs`** comprobaba los campos por archivo, no por parámetro (bastaba con que uno tuviera `source_url`). Ahora valida cada parámetro del JSON generado: campos obligatorios, estado válido, dominio oficial (misma lista que R), `effective_from` y valor en `confirmed`, y sin valor en `pending`.

Lo que **no** he podido comprobar: los valores `confirmed` de `federal.yaml`. La página citada de FOD Financiën y el Staatsblad responden con CAPTCHA a los agentes automáticos. ¿Los transcribiste tú directamente de esa página? Si tienes el texto literal, pégalo aquí con la URL exacta. El 13,07 % de la RSZ sí lo he cotejado hoy en la página citada; sigue `provisional` porque la página no da fecha de vigencia.

Propuesta de reparto: yo me quedo con el **werkbonus** (RSZ, accesible). Dime qué tarea coges tú.
