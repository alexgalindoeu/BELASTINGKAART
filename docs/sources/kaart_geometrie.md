# Kaart: geometry source (web/data/kaart_be.json)

Retrieved on 2026-11-26. Generator: `tools/build_kaart.mjs` (`npm run build:kaart`), check: `npm run check:kaart`.

## Geometry in use: Flemish Region, 285 municipalities

| Field | Value |
|---|---|
| Publisher | Digitaal Vlaanderen (Vlaamse overheid) |
| Dataset | Voorlopig referentiebestand gemeentegrenzen 2025 (VRBG 2025) |
| Layer | `VRBG2025:RefgemG10` (municipal boundaries generalised to 10 m by the publisher) |
| Service | WFS 2.0, `https://geo.api.vlaanderen.be/VRBG2025/wfs?service=WFS&request=GetCapabilities` ("WFS Voorlopig referentiebestand gemeentegrenzen 2025") |
| Exact request | `https://geo.api.vlaanderen.be/VRBG2025/wfs?service=WFS&version=2.0.0&request=GetFeature&typeNames=VRBG2025:RefgemG10&outputFormat=application/json&srsName=EPSG:3812` |
| CRS | EPSG:3812, ETRS89 / Belgian Lambert 2008 |
| Records | 285 features, the official count of Flemish municipalities on 1-1-2025 (after the mergers), equal to the Flemish entries in Statbel REFNIS 2025 (`web/data/gemeenten.json`) |
| Attributes used | `NISCODE` (join key) and `NAAM` (cross-check against REFNIS) |
| Checksum | SHA-256 of the downloaded GeoJSON in `kaart_be.json → source.sha256` |
| Service terms | "Het gebruik van de service is kosteloos" (GetCapabilities, `Fees`). Terms of use: https://www.vlaanderen.be/digitaal-vlaanderen/onze-diensten-en-platformen/geografische-webdiensten/gebruiksrecht-en-privacyverklaring-geografische-webdiensten ("De service kan door iedereen gebruikt worden … Gelieve de toegangs- en gebruiksbepalingen te raadplegen in de metadata van alle datasets"). |
| Dataset licence | **pending verification.** The dataset metadata (https://metadata.vlaanderen.be/srv/dut/catalog.search#/metadata/72dca52e-b57d-4933-922c-d57ada0e0986) is on `metadata.vlaanderen.be`, which this session cannot reach (proxy 403). Recorded as `source.licence.status: "pending"`. |
| Attribution shown | NL "Bron: Digitaal Vlaanderen, Voorlopig referentiebestand gemeentegrenzen 2025"; FR "Source : Digitaal Vlaanderen, Voorlopig referentiebestand gemeentegrenzen 2025" |

## Names, regions and provinces

The NIS code joins each shape to the official Statbel REFNIS 2025 list (`web/data/gemeenten.json`, see that file's `source`). Names come from it: NL `name_nl` and FR `name_fr` (for example Gent / Gand, Leuven / Louvain). The build stops if a NIS code is missing from REFNIS or if the geometry's `NAAM` differs from `name_nl`. `check:kaart` repeats both checks and recounts each covered region against REFNIS. The short region and province names on the map are those of the Constitution (art. 3 and 5): `tools/lib/kaart.mjs`.

## Processing (reproducible)

1. Download the GeoJSON above (cached in `.cache/kaart/`, not committed; `--refresh` downloads it again).
2. mapshaper 0.6.102 (devDependency): Visvalingam weighted simplification to 14 % of the vertices, keeping every shape; repair (`-clean`); shared inner lines for the municipal borders; dissolve by province and region for the province borders and the regional outline; interior label points.
3. Projection: the source is already in Belgian Lambert 2008 (EPSG:3812, a Lambert conformal conic for Belgium), so only a uniform scale to a 1000-unit-wide viewBox is applied, with the y axis flipped. Paths are written as relative integer steps.
4. Output: about 119 KB, about 34 KB gzip.

`check:kaart` validates the schema and fails if the generator or `gemeenten.json` changed since the build. When the source is cached, it also requires a byte-identical rebuild.

## Not yet covered: Brussels (19) and Wallonia (261)

The data model already holds the three regions (`regions`, `coverage`, `borders.national`). The map draws only what `coverage` lists, and no region is shown as covered when it is not.

| Candidate | Result on 2026-11-26 |
|---|---|
| NGI, "Territorial Divisions" (includes AdminVector, all Belgian municipalities, EPSG:3812 and 4326, GeoPackage/Shapefile, CC BY 4.0 according to geo.be; revised 2026-07-16). Catalogue: https://www.geo.be/catalog/details/1cd00540-b0ca-11ec-a863-186571a04de2?l=nl | Download links point to **`ac.ngi.be`** (`https://ac.ngi.be/remoteclient-open/ngi-standard-open/Vectordata/TerritorialDivisions/TerritorialDivisions-All/1cd00540-b0ca-11ec-a863-186571a04de2_x-shapefile_3812.zip`, 110 MB). That host is **not allowed** in this environment (proxy 403). |
| Statbel open data (statistical sectors 2025) | Image CAPTCHA for automated clients. Not bypassed. |
| data.gov.be | Image CAPTCHA for automated clients. Not bypassed. |

Once `ac.ngi.be` is allowed, the generator can read the AdminVector municipalities layer for the whole of Belgium, keep the REFNIS join and add `BRU` and `WAL` to `coverage`. National border: `borders.national`. Region borders: from the dissolve that already exists.
