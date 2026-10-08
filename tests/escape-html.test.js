import test from 'node:test';
import assert from 'node:assert/strict';
import { escapeHtml } from '../src/escape-html.js';

test('escapes text and attribute metacharacters before template rendering', () => {
  assert.equal(escapeHtml(`&<>"'`), '&amp;&lt;&gt;&quot;&#39;');
});
