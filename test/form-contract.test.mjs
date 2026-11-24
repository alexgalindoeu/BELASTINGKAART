import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';

const moduleContext = { window: {} };
const formModule = await readFile(new URL('../web/js/formulario.js', import.meta.url), 'utf8');
vm.runInNewContext(formModule, moduleContext);
const BKForm = moduleContext.window.BKForm;

test('NL and FR forms expose the same contract as BKForm', async () => {
  for (const language of ['nl', 'fr']) {
    const html = await readFile(new URL('../web/' + language + '/index.html', import.meta.url), 'utf8');
    for (const field of ['grossMonthly','region','municipality','familyStatus','children',
      'employment','incomeYear','assessmentYear','paidMonths']) {
      assert.match(html, new RegExp('name="' + field + '"'), language + ' missing ' + field);
    }
    assert.doesNotMatch(html, /name="family"|name="taxYear"/, language + ' contains obsolete field names');
  }
});

test('the shared household schema accepts a complete Flanders employee payload', () => {
  const payload = {
    grossMonthly: 3500,
    region: 'flanders',
    municipality: 'Leuven',
    familyStatus: 'legal_cohabitant',
    children: 1,
    employment: 'employee',
    incomeYear: 2026,
    assessmentYear: 2027,
    paidMonths: 13
  };
  const validation = BKForm.validate(payload);
  assert.equal(validation.valid, true);
  assert.deepEqual(Array.from(validation.errors), []);
});

test('the shared schema rejects unsupported family values and invalid periods', () => {
  const base = {
    grossMonthly: 3500, region: 'flanders', municipality: 'Leuven',
    familyStatus: 'single', children: 0, employment: 'employee',
    incomeYear: 2026, assessmentYear: 2027, paidMonths: 12
  };
  assert.equal(BKForm.validate({...base, familyStatus: 'partner'}).valid, false);
  assert.equal(BKForm.validate({...base, paidMonths: 15}).valid, false);
  assert.equal(BKForm.validate({...base, grossMonthly: 0}).valid, false);
});

test('the browser app stores a validated payload but never calculates net pay', async () => {
  const form = { addEventListener(type, callback) { this.submit = callback; } };
  const result = { dataset: {} };
  const messages = [];
  class FakeFormData {
    constructor() {
      this.values = {
        grossMonthly: '3500.50', region: 'flanders', municipality: 'Leuven',
        familyStatus: 'single', children: '0', employment: 'employee',
        incomeYear: '2026', assessmentYear: '2027', paidMonths: '12'
      };
    }
    get(key) { return this.values[key]; }
  }
  const context = {
    document: {
      querySelector(selector) { return selector === '#salary-form' ? form : result; },
      body: { dataset: { lang: 'nl' } },
      documentElement: { dataset: {} }
    },
    window: {
      BK_CONFIG: { defaultLanguage: 'nl' },
      BK_I18N: { nl: { invalidSalary: 'invalid salary', invalidForm: 'invalid form', ready: 'ready', noEstimate: 'no estimate' } },
      BKParameters: { load: async () => ({ income_year: 2026, calculation_status: 'blocked' }) },
      BKGross: { parseMonthlyGross: value => Number(value) },
      BKForm,
      BKUI: { setText(selector, value) { messages.push([selector, value]); } }
    },
    FormData: FakeFormData
  };
  const app = await readFile(new URL('../web/js/app.js', import.meta.url), 'utf8');
  vm.runInNewContext(app, context);
  form.submit({ preventDefault() {} });
  await Promise.resolve();
  assert.equal(result.dataset.validation, 'valid');
  assert.equal(JSON.parse(result.dataset.input).familyStatus, 'single');
  assert.ok(messages.some(([selector, value]) => selector === 'p' && value === 'no estimate'));
  assert.equal(context.document.documentElement.dataset.parameterStatus, 'blocked');
});
