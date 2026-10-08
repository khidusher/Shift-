import test from 'node:test';
import assert from 'node:assert/strict';
import { resolvePublicAsset } from '../src/public-path.js';

test('maps only approved site routes to public files', () => {
  assert.equal(resolvePublicAsset('/'), 'index.html');
  assert.equal(resolvePublicAsset('/privacy'), 'privacy.html');
  assert.equal(resolvePublicAsset('/terms'), 'terms.html');
  assert.equal(resolvePublicAsset('/src/main.js'), 'src/main.js');
  assert.equal(resolvePublicAsset('/styles.css'), 'styles.css');
});

test('rejects source, repository, and malformed paths outside the public allowlist', () => {
  for (const path of ['/server.mjs', '/package.json', '/.git/config', '/.env', '/tests/countdown.test.js', '/%E0%A4%A', '/%2e%2e/server.mjs']) {
    assert.equal(resolvePublicAsset(path), null, `${path} must not resolve to a public file`);
  }
});
