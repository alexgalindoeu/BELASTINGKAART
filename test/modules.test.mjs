import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';

const files = ['importe.js','bruto.js','ui.js','escenarios.js','csv.js','analitica.js','anuncios.js'];
const context = {window:{BK_CONFIG:{features:{advertising:false},analyticsProvider:null}},document:{querySelector:()=>null},localStorage:{getItem:()=>null,setItem:()=>{}}};
for (const file of files) {
  const source = await readFile(new URL('../web/js/'+file,import.meta.url),'utf8');
  vm.runInNewContext(source,context);
}

test('gross input parsing and annualization are explicit',()=>{
  assert.equal(context.window.BKGross.parseMonthlyGross('3500,50'),3500.5);
  // nl-BE / fr-BE: the dot groups thousands. "3.500" must never become 3.50 (audit P0).
  assert.equal(context.window.BKGross.parseMonthlyGross('3.500'),3500);
  assert.equal(context.window.BKGross.parseMonthlyGross('3.500,50'),3500.5);
  assert.equal(context.window.BKGross.parseMonthlyGross('3 500'),3500);
  assert.equal(context.window.BKGross.parseMonthlyGross('3500.5'),3500.5);
  assert.throws(()=>context.window.BKGross.parseMonthlyGross('3,500'),/between/);
  assert.throws(()=>context.window.BKGross.parseMonthlyGross('abc'),/between/);
  assert.equal(context.window.BKGross.annualize(3500,13),45500);
  assert.throws(()=>context.window.BKGross.parseMonthlyGross(-1),/between/);
});

test('scenario percentages generate a deterministic gross range',()=>{
  const values=context.window.BKScenarios.grossSteps(3000);
  assert.deepEqual(Array.from(values,x=>x.grossMonthly),[2700,2850,3000,3150,3300]);
});

test('CSV serializer escapes separators and quotes',()=>{
  const csv=context.window.BKCSV.serialize([{name:'A; "B"'}],[{key:'name',label:'Name'}]);
  assert.match(csv,/"A; ""B"""/);
});

test('advertising remains disabled by default',()=>{
  const node={dataset:{},hidden:false};
  assert.equal(context.window.BKAds.registerSlot(node,'sidebar'),false);
  assert.equal(node.hidden,true);
});
