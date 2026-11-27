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

// ---- municipality picker fields (municipalityNis, municipalityRegion) -----------------
const gemeenten = JSON.parse(await readFile(new URL('../web/data/gemeenten.json', import.meta.url), 'utf8')).municipalities;
const flemish = gemeenten.find(m => m.region === 'flanders');
const walloon = gemeenten.find(m => m.region === 'wallonia');

test('BKForm checks the picked NIS code against gemeenten.json and its region', () => {
  const base = {
    grossMonthly: 3500, region: 'flanders', municipality: flemish.name_nl, familyStatus: 'single', children: 0,
    employment: 'employee', incomeYear: 2026, assessmentYear: 2027, paidMonths: 12,
    municipalityNis: flemish.nis, municipalityRegion: 'flanders'
  };
  // before the official list is registered no NIS code can be confirmed
  assert.deepEqual(Array.from(BKForm.validate(base).errors), ['municipalityNis']);
  assert.equal(BKForm.registerMunicipalities(gemeenten), gemeenten.length);
  assert.equal(BKForm.validate(base).valid, true);
  assert.deepEqual(Array.from(BKForm.validate({ ...base, municipalityNis: '' }).errors), ['municipalityNis']);
  assert.deepEqual(Array.from(BKForm.validate({ ...base, municipalityNis: '99999' }).errors), ['municipalityNis']);
  assert.deepEqual(Array.from(BKForm.validate({ ...base, municipalityNis: 'abc' }).errors), ['municipalityNis']);
  // the region must match the official region of the code, both as reported and in the form
  assert.deepEqual(Array.from(BKForm.validate({ ...base, municipalityRegion: 'wallonia' }).errors), ['municipalityRegion']);
  assert.deepEqual(Array.from(BKForm.validate({ ...base, region: 'wallonia' }).errors), ['municipalityRegion']);
  assert.equal(BKForm.validate({ ...base, region: 'wallonia', municipalityNis: walloon.nis, municipalityRegion: 'wallonia' }).valid, true);
  // legacy callers without the hidden fields keep the free-text rule
  const { municipalityNis, municipalityRegion, ...legacy } = base;
  assert.equal(BKForm.validate(legacy).valid, true);
  assert.deepEqual(Array.from(BKForm.validate({ ...base, municipality: ' ' }).errors), ['municipality']);
});

test('the app forwards the picker fields and rejects a municipality typed but not chosen', async () => {
  BKForm.registerMunicipalities(gemeenten);
  const run = async values => {
    const form = { addEventListener(type, callback) { this.submit = callback; } };
    const result = { dataset: {} };
    const context = {
      document: { querySelector: s => (s === '#salary-form' ? form : result), body: { dataset: { lang: 'nl' } }, documentElement: { dataset: {} } },
      window: {
        BK_CONFIG: { defaultLanguage: 'nl' }, BK_I18N: { nl: { invalidForm: 'x', ready: 'r', noEstimate: 'n', invalidSalary: 's' } },
        BKParameters: { load: async () => ({}) }, BKGross: { parseMonthlyGross: Number }, BKForm, BKUI: { setText() {} }
      },
      FormData: class { get(k) { return k in values ? values[k] : null; } }
    };
    vm.runInNewContext(await readFile(new URL('../web/js/app.js', import.meta.url), 'utf8'), context);
    form.submit({ preventDefault() {} });
    return result;
  };
  const values = { grossMonthly: '3500', region: 'flanders', municipality: flemish.name_nl, familyStatus: 'single', children: '0',
    employment: 'employee', incomeYear: '2026', assessmentYear: '2027', paidMonths: '12',
    municipalityNis: flemish.nis, municipalityRegion: 'flanders' };
  const ok = await run(values);
  assert.equal(ok.dataset.validation, 'valid');
  assert.equal(JSON.parse(ok.dataset.input).municipalityNis, flemish.nis);
  const typed = await run({ ...values, municipalityNis: '', municipalityRegion: '' });
  assert.equal(typed.dataset.validation, 'invalid');
  assert.equal(typed.dataset.validationErrors, 'municipalityNis');
});
