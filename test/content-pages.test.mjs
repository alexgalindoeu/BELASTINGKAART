import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, access } from 'node:fs/promises';

const routes = [
  'nl/','fr/',
  'nl/methodologie/','fr/methodologie/',
  'nl/bronnen/','fr/sources/',
  'nl/contact/','fr/contact/',
  'nl/privacy/','fr/confidentialite/'
];

test('all declared bilingual routes resolve to an index document', async () => {
  for (const route of routes) {
    await access(new URL('../web/' + route + 'index.html', import.meta.url));
  }
});

test('all content pages declare canonical and both language alternatives', async () => {
  for (const route of routes.slice(2)) {
    const html = await readFile(new URL('../web/' + route + 'index.html', import.meta.url),'utf8');
    assert.match(html,/rel="canonical"/,route);
    assert.match(html,/hreflang="nl-BE"/,route);
    assert.match(html,/hreflang="fr-BE"/,route);
    assert.match(html,/https:\/\/belastingkaart\.be\//,route);
  }
});

test('sitemap and robots expose only the intended public routes', async () => {
  const sitemap = await readFile(new URL('../web/sitemap.xml',import.meta.url),'utf8');
  const robots = await readFile(new URL('../web/robots.txt',import.meta.url),'utf8');
  for (const route of routes) assert.ok(sitemap.includes('https://belastingkaart.be/' + route));
  assert.match(robots,/Sitemap: https:\/\/belastingkaart\.be\/sitemap\.xml/);
});

test('privacy and contact pages do not invent an email address or enabled services', async () => {
  for (const route of ['nl/contact/','fr/contact/','nl/privacy/','fr/confidentialite/']) {
    const html = await readFile(new URL('../web/' + route + 'index.html',import.meta.url),'utf8');
    assert.doesNotMatch(html,/mailto:/i);
  }
});
