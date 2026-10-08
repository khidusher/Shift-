import test from 'node:test';
import assert from 'node:assert/strict';
import { getCountdown } from '../src/countdown.js';

test('counts down to the event start in whole days, hours, minutes, and seconds', () => {
  const now = new Date('2026-11-27T08:00:00Z');
  const target = new Date('2026-11-28T09:00:00Z');

  assert.deepEqual(getCountdown(target, now), {
    days: 1,
    hours: 1,
    minutes: 0,
    seconds: 0,
    isPast: false,
  });
});

test('returns zeroed values when the event time has arrived', () => {
  const now = new Date('2026-11-28T09:00:00Z');

  assert.deepEqual(getCountdown(now, now), {
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isPast: true,
  });
});
