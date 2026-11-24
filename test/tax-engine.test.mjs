import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';

const source = await readFile(new URL('../web/js/tax-engine.js', import.meta.url), 'utf8');
const context = { window: {} };
vm.runInNewContext(source, context);
const engine = context.window.BKTaxEngine;

test('progressive federal scale calculates marginal slices', () => {
  const brackets = [
    {upper:16720,rate:0.25},{upper:29510,rate:0.40},
    {upper:51070,rate:0.45},{upper:null,rate:0.50}
  ];
  const expected = 16720*.25 + (29510-16720)*.40 + (40000-29510)*.45;
  assert.ok(Math.abs(engine.progressiveTax(40000,brackets) - expected) < 1e-9);
});

test('invalid bases and malformed brackets are rejected', () => {
  assert.throws(()=>engine.progressiveTax(-1,[{upper:null,rate:.5}]),/non-negative/);
  assert.throws(()=>engine.progressiveTax(100,[{upper:100,rate:-.1}]),/Invalid/);
  assert.throws(()=>engine.progressiveTax(100,[{upper:50,rate:.1},{upper:40,rate:.2},{upper:null,rate:.3}]),/strictly increasing/);
  assert.throws(()=>engine.progressiveTax(100,[{upper:50,rate:.1}]),/open-ended/);
});

test('JS engine matches the shared R/JS parity fixture', async () => {
  const fx = JSON.parse(await readFile(new URL('./fixtures/progressive_scale_cases.json', import.meta.url), 'utf8'));
  for (const c of fx.cases)
    assert.ok(Math.abs(engine.progressiveTax(c.base, fx.brackets) - c.expected) < 1e-6, 'base ' + c.base);
});

test('parity fixture uses the published 2026 brackets', async () => {
  const fx = JSON.parse(await readFile(new URL('./fixtures/progressive_scale_cases.json', import.meta.url), 'utf8'));
  const data = JSON.parse(await readFile(new URL('../web/data/parameters.json', import.meta.url), 'utf8'));
  assert.deepEqual(fx.brackets, data.federal.personal_income_tax.brackets.value);
});

test('complete net-pay calculation stays blocked', () => {
  assert.equal(engine.calculate().status,'blocked');
});
