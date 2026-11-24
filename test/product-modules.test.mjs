import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';

const context={window:{BK_CONFIG:{features:{grossToNet:true,scenarios:false,csvExport:false,paidReports:false,accounts:false}}}};
for(const file of ['importe.js','formulario.js','sueldo_mes.js','confianza.js','herramientas.js','deducciones.js','conjunta.js','explicacion.js','informe.js','widget.js','cuentas.js']){
 const source=await readFile(new URL('../web/js/'+file,import.meta.url),'utf8');
 vm.runInNewContext(source,context);
}

test('money parser handles Dutch and French-style decimal input without guessing ambiguous values',()=>{
 assert.equal(context.window.BKAmount.parse('3.500,50'),3500.5);
 assert.equal(context.window.BKAmount.parse('3500,50'),3500.5);
 assert.equal(context.window.BKAmount.parse('3500.50'),3500.5);
 assert.throws(()=>context.window.BKAmount.parse('3,500'),/Ambiguous/);
});

test('household form requires municipality and valid year pair',()=>{
 const state={...context.window.BKForm.initialState(),municipality:'Leuven'};
 assert.equal(context.window.BKForm.validate(state).valid,true);
 assert.equal(context.window.BKForm.validate({...state,assessmentYear:2026}).valid,false);
});

test('gross annual pay distribution does not claim net pay',()=>{
 const result=context.window.BKSalarySchedule.distributeAnnualGross(42000,14);
 assert.equal(result.regularPayment,3000);
 assert.equal(result.extraPayments,2);
});

test('tax tools and accounts respect disabled feature flags',()=>{
 assert.deepEqual(Array.from(context.window.BKTools.available(),x=>x.id),['gross-net']);
 assert.equal(context.window.BKAccounts.status().enabled,false);
 assert.throws(()=>context.window.BKAccounts.requireEnabled(),/not available/);
});

test('deduction entries remain pending and report generation is blocked',()=>{
 assert.ok(context.window.BKTaxAdvantages.list().every(x=>x.status==='pending'));
 assert.equal(context.window.BKReport.canGenerate({status:'blocked'}),false);
});

test('family and explanation modules do not invent a Belgian tax result',()=>{
 assert.equal(context.window.BKHousehold.eligibilityState({children:2}).status,'not_calculated');
 assert.equal(context.window.BKExplanation.build({status:'blocked'}).status,'unavailable');
});

test('widget embed uses the Belastingkaart host and allowed languages',()=>{
 assert.match(context.window.BKWidget.embedCode({language:'fr'}),/belastingkaart\.be\/fr/);
 assert.throws(()=>context.window.BKWidget.embedCode({language:'es'}),/Unsupported/);
});
