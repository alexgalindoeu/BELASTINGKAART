# Kaart: geometry source (web/data/kaart_be.json)

Retrieved on 2026-11-26. Generator: `tools/build_kaart.mjs` (`npm run build:kaart`), check: `npm run check:kaart`.

## Geometry in use: all of Belgium, 565 municipalities

| Field | Value |
|---|---|
| Publisher | Nationaal Geografisch Instituut / Institut géographique national (NGI-IGN), the federal mapping agency |
| Dataset | Territorial Divisions (includes AdminVector). Catalogue: https://www.geo.be/catalog/details/1cd00540-b0ca-11ec-a863-186571a04de2?l=nl (created 2022-03-30, revised 2026-07-16) |
| File | `https://ac.ngi.be/remoteclient-open/ngi-standard-open/Vectordata/TerritorialDivisions/TerritorialDivisions-All/1cd00540-b0ca-11ec-a863-186571a04de2_x-shapefile_3812.zip` (Esri Shapefile, 115,473,505 bytes; files dated 2026-07-15) |
| Layer | `municipality_3812`: 565 polygons, fields `niscode`, `namedut`, `namefre`, `nameger`, … |
| CRS | EPSG:3812, ETRS89 / Belgian Lambert 2008 |
| Records | 565 = the official number of municipalities on 1-1-2025 (Flanders 285, Brussels 19, Wallonia 261), equal to Statbel REFNIS 2025 (`web/data/gemeenten.json`) |
| Checksum | SHA-256 of the zip in `kaart_be.json → source.sha256` (`dca315a0…711471a` on 2026-11-26) |
| Licence | **CC BY 4.0, verified.** NGI, "Beleid rond openheid en hergebruik van geografische gegevens van het NGI" (https://ngi.be/beleid-rond-openheid-en-hergebruik-van-geografische-gegevens-van-het-ngi/): "De gratis open data van het NGI zijn beschikbaar onder de CC_BY 4.0-gebruikerslicentie … Het NGI moet op correcte wijze vermeld worden als bron van de gegevens. Bijvoorbeeld: ‘Gebruikte dataset – © NGI-IGN, jaar, licentie CC BY 4.0’." The file is in the `ngi-standard-open` (free open data) folder of the download portal, and the geo.be record links CC BY 4.0 under its terms of use. |
| Attribution shown | NL "Territorial Divisions – © NGI-IGN, 2026, licentie CC BY 4.0"; FR "Territorial Divisions – © NGI-IGN, 2026, licence CC BY 4.0" (map pages, and `source.attribution` in the JSON) |

## Names, regions and provinces

The NIS code joins each shape to the official Statbel REFNIS 2025 list (`web/data/gemeenten.json`), which supplies the NL and FR names (`name_nl`, `name_fr`), the province and the region. The build stops in three cases:
- a NIS code is missing from either side;
- the NGI Dutch name differs from REFNIS once accents are ignored. NGI writes, for example, *Blegny* and *Genepiën* where REFNIS has *Blégny* and *Genepien*. REFNIS is the official list, and its spelling is shown.

`check:kaart` repeats the join and name checks and recounts each region against REFNIS. Short region and province names on the map follow the Constitution (art. 3 and 5): see `tools/lib/kaart.mjs`. The Brussels-Capital Region has no province, so it forms its own group, keyed by its region code `04000`.

## Processing (reproducible)

1. Download the zip above. It is cached in `.cache/kaart/` and not committed; `--refresh` downloads it again. mapshaper reads the layer straight from the zip.
2. mapshaper 0.6.102 (devDependency):
   - simplification `interval=130` (metres, Visvalingam weighted, every shape kept), then `-clean`;
   - shared inner lines for the municipal borders;
   - dissolves by province (internal province borders), by region (internal region borders) and for the whole country (national border, `borders.national`);
   - interior label points.
3. Projection: the source is already in Belgian Lambert 2008 (EPSG:3812, a Lambert conformal conic with Belgium's standard parallels 49°50′ and 51°10′). Only a uniform scale to a 2000-unit-wide viewBox is applied, with the y axis flipped, so one unit is about 136 m. Paths are written as relative integer steps; that resolution keeps the Brussels municipalities sharp when zoomed.
4. Output: 325,179 bytes, 98,202 bytes gzip.

`check:kaart` validates the schema and fails if the generator or `gemeenten.json` changed since the build. When the source is cached, it also requires a byte-identical rebuild.

## Earlier source (until PR #19): Digitaal Vlaanderen VRBG 2025

The first version (Flanders only) used Digitaal Vlaanderen's "Voorlopig referentiebestand gemeentegrenzen, toestand 01/01/2025 – correctie 11/02/2025" (WFS `geo.api.vlaanderen.be/VRBG2025`, layer `RefgemG10`). Its licence is now verified in the metadata record (https://metadata.vlaanderen.be/srv/dut/catalog.search#/metadata/72dca52e-b57d-4933-922c-d57ada0e0986, date stamp 2026-09-22):
- "Modellicentie voor gratis hergebruik" (https://data.vlaanderen.be/id/licentie/modellicentie-gratis-hergebruik/v1.0);
- "Geen beperkingen op de publieke toegang";
- required attribution: "Bron: Digitaal Vlaanderen".

To keep one consistent source and one generalisation for the whole country, the map now uses NGI for all three regions. VRBG is no longer used.

## Not used

Statbel open data (statistical sectors) and data.gov.be show an image CAPTCHA to automated clients. They were not bypassed and are not needed.
