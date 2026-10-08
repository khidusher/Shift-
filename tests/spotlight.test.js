import test from 'node:test';
import assert from 'node:assert/strict';
import { getSpotlightPosition } from '../src/spotlight.js';

test('maps pointer coordinates to a normalized spotlight position', () => {
  assert.deepEqual(
    getSpotlightPosition(150, 125, { left: 50, top: 25, width: 200, height: 200 }),
    { x: 50, y: 50 },
  );
});

test('keeps the spotlight position inside the target when the pointer leaves its bounds', () => {
  assert.deepEqual(
    getSpotlightPosition(500, -20, { left: 50, top: 25, width: 200, height: 100 }),
    { x: 100, y: 0 },
  );
});
