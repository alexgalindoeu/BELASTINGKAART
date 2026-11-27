// Official figures on the content pages come from web/data/parameters.json (generated from
// params/2026/*.yaml), never from literals in the generators (audit P2-16).
//
// Content strings write a figure as a token: {{section.parameter.path|format}}
//   {{zelfstandigen.contributions_2026.main_occupation.ceiling_low|eur}}  -> 75.024,54
//   {{zelfstandigen.contributions_2026.main_occupation.rate_low|pct2}}    -> 20,50
//   {{pensioensparen.reduction_rates.standard|pct}}                       -> 30
// The unit (%, euro, euros) stays in the text, so NL and FR share one token.
// fillFigures() replaces every token and THROWS when the parameter is not `confirmed`.
// The only exception is the prefix `announced:`, allowed solely for a provisional parameter
// flagged `announced: true` (an official announcement, shown as such, never calculated).
//
// R mirror: R/10_content_figures.R; shared cases: test/fixtures/content_figures.json.
import { readFileSync } from 'node:fs';

const DATA = JSON.parse(readFileSync(new URL('../../web/data/parameters.json', import.meta.url), 'utf8'));
const TOKEN = /\{\{(announced:)?([a-z0-9_.]+)(?:\|([a-z0-9]+))?\}\}/g;
export const MARK = ['⟦', '⟧']; // ⟦ ⟧, used only when BK_MARK_FIGURES=1 (tests)

// Belgian notation, shared by NL and FR pages: 75.024,54 / 3.000 / 20,50.
export function formatBE(n, decimals) {
  const [int, dec] = Math.abs(n).toFixed(decimals).split('.');
  return (n < 0 ? '-' : '') + int.replace(/\B(?=(\d{3})+(?!\d))/g, '.') + (dec ? ',' + dec : '');
}

// Formats: eur (integer without decimals, otherwise 2), pct (x100, as few decimals as needed),
// pctN (x100, N decimals), dN (N decimals), int.
export function formatFigure(value, fmt = 'eur') {
  if (typeof value !== 'number' || !Number.isFinite(value)) throw new Error(`Figure is not a number: ${value}`);
  const fix = x => Number(x.toFixed(10));
  if (fmt === 'eur') return formatBE(value, Number.isInteger(fix(value)) ? 0 : 2);
  if (fmt === 'int') return formatBE(value, 0);
  let m = /^pct(\d)?$/.exec(fmt);
  if (m) {
    const p = fix(value * 100);
    const d = m[1] !== undefined ? Number(m[1]) : (String(p).split('.')[1] ?? '').length;
    return formatBE(p, d);
  }
  m = /^d(\d+)$/.exec(fmt);
  if (m) return formatBE(value, Number(m[1]));
  throw new Error(`Unknown figure format: ${fmt}`);
}

// Resolve a dotted path: the first object carrying `status` and `source_url` is the
// parameter; the rest of the path is read inside its `value`.
export function resolveFigure(path, data = DATA) {
  const keys = path.split('.');
  let node = data, i = 0;
  for (; i < keys.length; i++) {
    if (node && typeof node === 'object' && 'status' in node && 'source_url' in node) break;
    node = node?.[keys[i]];
    if (node === undefined) throw new Error(`Unknown parameter path: ${path}`);
  }
  if (!(node && typeof node === 'object' && 'status' in node && 'source_url' in node))
    throw new Error(`Path does not reach a parameter: ${path}`);
  const param = node;
  let value = param.value;
  for (; i < keys.length; i++) {
    value = value?.[keys[i]];
    if (value === undefined) throw new Error(`Unknown value path: ${path}`);
  }
  return { param, value, id: keys.slice(0, keys.length - (keys.length - i)).join('.') };
}

export const usedFigures = new Map(); // path -> status, for the tests

export function figure(path, fmt, { announced = false, data = DATA } = {}) {
  const { param, value } = resolveFigure(path, data);
  if (announced) {
    if (!(param.status === 'provisional' && param.announced === true))
      throw new Error(`${path}: 'announced:' is only allowed for a provisional parameter flagged announced: true`);
  } else if (param.status !== 'confirmed') {
    throw new Error(`${path}: parameter status is '${param.status}'; only confirmed figures may be shown`);
  }
  usedFigures.set(path, param.status);
  return formatFigure(value, fmt);
}

export function fillFigures(html, data = DATA) {
  const mark = process.env.BK_MARK_FIGURES === '1';
  const out = html.replace(TOKEN, (_, ann, path, fmt) => {
    const s = figure(path, fmt ?? 'eur', { announced: Boolean(ann), data });
    return mark ? MARK[0] + s + MARK[1] : s;
  });
  if (/\{\{/.test(out)) throw new Error('Unresolved figure token: ' + out.match(/\{\{[^}]*\}\}?/)[0]);
  return out;
}

// A figure-like number in visible text: a number followed by a unit, or a decimal number.
export const FIGURE_RE = /(?<![\w.,⟦])(?:\d{1,3}(?:\.\d{3})+|\d+)(?:,\d+)?(?:\s|&nbsp;| | )?(?:%|euros?\b|EUR\b|€|pct\b|procent\b|pour cent\b)|(?<![\w.,⟦])\d+,\d+(?![\w⟧])/g;
