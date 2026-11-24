import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const yaml = await readFile(new URL('../params/2026/social_security.yaml', import.meta.url), 'utf8');

test('2026 social-security parameter file records official provenance and pending work bonus', () => {
  assert.match(yaml, /value: 0\.1307/);
  assert.match(yaml, /status: confirmed/);
  assert.match(yaml, /socialsecurity\.be/);
  assert.match(yaml, /work_bonus:[\s\S]*status: pending/);
});

test('federal personal income tax remains explicitly pending', async () => {
  const federal = await readFile(new URL('../params/2026/federal.yaml', import.meta.url), 'utf8');
  assert.match(federal, /status: pending/);
  assert.match(federal, /value: null/);
});
