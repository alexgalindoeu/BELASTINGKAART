import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';

const source = await readFile(new URL('../web/assets/js/tax-engine.js', import.meta.url), 'utf8');
const context = { window: {} };
vm.runInNewContext(source, context);
const engine = context.window.BKTaxEngine;

test('progressive federal scale calculates marginal slices', () => {
  const brackets = [
    {upper:16720,rate:0.25},{upper:29510,rate:0.40},
    {upper:51070,rate:0.45},{upper:null,rate:0.50}
  ];
  const expected = 16720*.25 + (29510-16720)*.40 + (40000-29510)*.45;
  assert.equal(engine.progressiveTax(40000,brackets), Math.round(expected*100)/100);
});

test('invalid bases and malformed brackets are rejected', () => {
  assert.throws(()=>engine.progressiveTax(-1,[{upper:null,rate:.5}]),/non-negative/);
  assert.throws(()=>engine.progressiveTax(100,[{upper:100,rate:-.1}]),/Invalid/);
});

test('complete net-pay calculation stays blocked', () => {
  assert.equal(engine.calculate().status,'blocked');
});
