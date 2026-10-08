import test from 'node:test';
import assert from 'node:assert/strict';
import { setPressedChoice } from '../src/selection.js';

test('sets one selected choice and clears its siblings', () => {
  const choices = [
    { attributes: {}, setAttribute(name, value) { this.attributes[name] = value; } },
    { attributes: {}, setAttribute(name, value) { this.attributes[name] = value; } },
    { attributes: {}, setAttribute(name, value) { this.attributes[name] = value; } },
  ];

  setPressedChoice(choices, choices[1]);

  assert.deepEqual(choices.map((choice) => choice.attributes['aria-pressed']), ['false', 'true', 'false']);
});
