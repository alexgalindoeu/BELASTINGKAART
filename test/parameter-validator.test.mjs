import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { execFileSync } from 'node:child_process';

const script = new URL('../tools/validate_parameters.mjs', import.meta.url);

function parameter(status, value, sourceUrl) {
  return {
    value, status, jurisdiction: 'federal', income_year: 2026,
    assessment_year: 2027, effective_from: status === 'confirmed' ? '2026-01-01' : null,
    effective_to: null, source_name: 'Official authority', source_url: sourceUrl,
    source_title: 'Official source title', retrieved_at: '2026-11-24',
    unit: 'EUR', rounding: 'official_rule_pending', notes: 'Test fixture'
  };
}

test('provenance validator accepts official nested parameters and rejects a private domain', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'belastingkaart-validator-'));
  try {
    const fixture = {
      income_year: 2026,
      federal: { personal_income_tax: { brackets: parameter('confirmed', [{upper:null,rate:0.5}], 'https://finances.belgium.be/tax') } },
      social_security: { employee_contribution: { rate: parameter('provisional', 0.1307, 'https://www.socialsecurity.be/contributions') } },
      payroll: { professional_withholding: parameter('pending', null, 'https://finances.belgium.be/payroll') },
      zelfstandigen: { contributions_2026: parameter('confirmed', { rate: 0.205 }, 'https://www.rsvz.be/sites/rsvz/files/folder.pdf') },
      pensioensparen: { ceilings: parameter('confirmed', { standard: 1050 }, 'https://www.minfin.fgov.be/myminfin-web/pages/public/fisconet/document/x') },
      wonen: { general_rate: parameter('confirmed', { from_2022: 0.12 }, 'https://www.vlaanderen.be/registratiebelasting') }
    };
    const file = join(dir, 'parameters.json');
    await writeFile(file, JSON.stringify(fixture));
    assert.match(execFileSync(process.execPath, [script.pathname, file], {encoding:'utf8'}), /6 parameters/);

    fixture.payroll.professional_withholding.source_url = 'https://example.com/not-official';
    await writeFile(file, JSON.stringify(fixture));
    assert.throws(
      () => execFileSync(process.execPath, [script.pathname, file], {encoding:'utf8'}),
      /not HTTPS on an official-source domain/
    );
  } finally {
    await rm(dir, {recursive:true,force:true});
  }
});
