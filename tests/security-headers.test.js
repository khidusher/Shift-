import test from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { contentSecurityPolicy, securityHeaders } from '../src/security-headers.js';

test('Vercel applies the reviewed response security headers to every route', async () => {
  const config = JSON.parse(await readFile(new URL('../vercel.json', import.meta.url), 'utf8'));
  const route = config.headers.find((entry) => entry.source === '/(.*)');
  const configured = Object.fromEntries(route.headers.map(({ key, value }) => [key, value]));

  for (const [name, value] of Object.entries(securityHeaders)) {
    assert.equal(configured[name], value, `${name} must match the shared server policy`);
  }
  assert.equal(configured['Strict-Transport-Security'], 'max-age=31536000');
});

test('CSP permits only the exact structured-data block as inline script', async () => {
  assert.doesNotMatch(contentSecurityPolicy, /'unsafe-inline'|'unsafe-eval'/);
  const html = await readFile(new URL('../index.html', import.meta.url), 'utf8');
  const script = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
  assert.ok(script, 'homepage should retain its event structured data');
  const scriptText = script[1].replace(/^\r?\n/, '').replace(/\r\n/g, '\n');
  const digest = createHash('sha256').update(scriptText).digest('base64');
  assert.ok(contentSecurityPolicy.includes(`'sha256-${digest}'`), 'CSP hash must match the exact JSON-LD text');
});
