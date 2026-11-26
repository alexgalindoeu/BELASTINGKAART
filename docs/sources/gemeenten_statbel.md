# Gemeenten / communes: Statbel REFNIS nomenclature valid from 1 January 2025

- **Publisher:** Statbel (Algemene Directie Statistiek - Statistics Belgium), the federal statistics office.
- **Page:** https://statbel.fgov.be/nl/over-statbel/methodologie/classificaties/geografie (FR: https://statbel.fgov.be/fr/propos-de-statbel/methodologie/classifications/geographie)
- **File:** `REFNIS_2025.csv`, https://statbel.fgov.be/sites/default/files/Over_Statbel_FR/Nomenclaturen/REFNIS_2025.csv
  (`Last-Modified: Thu, 28 Nov 2024 13:56:13 GMT`, SHA-256 `5e88a229cdbe1356e01ca950802d8eeaa04a1ab5c0dab0ab393c74cdf7c7879d`)
- **Retrieved:** 2026-11-25, and checked again on 2026-11-26 with `node tools/build_gemeenten.mjs --check`. HTTP 200.
- **Official count:** the page states "Nomenclatuur geldig vanaf 1/01/2025 (565 gemeenten)" (FR: "Nomenclature valable à partir du 1/01/2025 (565 communes)"). The file contains 565 municipalities: 285 in the Flemish Region, 261 in the Walloon Region and 19 in the Brussels-Capital Region.
- **Generated file:** `web/data/gemeenten.json`, written by `tools/build_gemeenten.mjs`. The header (`source`) holds the URLs, file name, retrieval date, SHA-256, the quoted statement, the official count and the record count. Do not edit it by hand.

## Content of the file

Columns are separated by `|`: `Code INS | Entités administratives | Langue | Code NIS | Administratieve eenheden | Taal`. The rows follow the hierarchy Kingdom → region → province → arrondissement → municipality. Municipality rows are the ones with a language code:

| Code | Meaning (Statbel) | Count |
|---|---|---|
| `N` | Dutch-language municipality | 285 |
| `F` | French-language municipality | 252 |
| `D` | German-language municipality (the NL column holds the German name) | 9 |
| `FN` / `NF` | bilingual municipality of the Brussels-Capital Region | 19 |

The script gets the region, province and arrondissement from that hierarchy. It does not use a separate list. Brussels-Capital has no province (`province_nis: null`).

## Mergers

The same page has the table "NIS-codes van de nieuwe gemeenten door fusies van 02/12/2024 en 01/01/2025". The script reads it and records each merger on the new municipality (`merger.effective_from`, `merger.merged_from`) and in `mergers`:

- 02/12/2024: Bastenaken (82003) + Bertogne (82005) → Bastenaken (82039), Walloon Region.
- 01/01/2025: 13 new Flemish municipalities formed from 28 former ones (the page text says "28 Vlaamse gemeenten zullen fuseren op 1 januari 2025"). The script checks that the table adds up to this number. It also checks that every new code is in `REFNIS_2025.csv` and that no former code still appears as a municipality.

## Access notes

- With plain `curl`, `statbel.fgov.be` and `data.gov.be` answer with a JavaScript bot challenge page (`/TSPD/`). It was not solved or bypassed. Node's built-in `fetch` (through the session proxy, `NODE_USE_ENV_PROXY=1`) received the normal pages and files directly. If the challenge ever appears for the script, the script stops with an error. Then a person downloads the page (save it as `geografie.html`) and `REFNIS_2025.csv` in a browser, and runs `node tools/build_gemeenten.mjs --offline <dir>`.
- The open-data file `TU_COM_REFNIS` (https://statbel.fgov.be/nl/open-data/refnis-code) dates from 2019 and does not include the 2025 mergers. It is not used.

## Scope

This dataset identifies the municipality (NIS code, official names, region) only. It contains no tax rates. The aanvullende gemeentebelasting / taxe communale additionnelle is a separate dataset and task.
