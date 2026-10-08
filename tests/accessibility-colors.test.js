import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

function luminance(hex) {
  const channels = [1, 3, 5].map((index) => parseInt(hex.slice(index, index + 2), 16) / 255);
  const linear = channels.map((value) => value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4);
  return 0.2126 * linear[0] + 0.7152 * linear[1] + 0.0722 * linear[2];
}

function contrast(first, second) {
  const values = [luminance(first), luminance(second)].sort((a, b) => b - a);
  return (values[0] + 0.05) / (values[1] + 0.05);
}

test('body copy and accent text meet AA contrast against their intended surfaces', async () => {
  const css = await readFile(new URL('../styles.css', import.meta.url), 'utf8');
  const root = css.match(/:root\s*\{([\s\S]*?)\}/)?.[1] ?? '';
  const color = (name) => root.match(new RegExp(`--${name}:\\s*(#[0-9a-f]{6})`, 'i'))?.[1];
  const muted = color('muted');
  const accent = color('accent');
  const paper = color('paper');
  const paperDeep = color('paper-deep');
  assert.ok(muted && accent && paper && paperDeep, 'expected the site color tokens to be defined');
  assert.ok(contrast(muted, paper) >= 4.5, 'muted text on paper should meet WCAG AA');
  assert.ok(contrast(muted, paperDeep) >= 4.5, 'muted text on deep paper should meet WCAG AA');
  assert.ok(contrast(accent, paper) >= 4.5, 'accent text on paper should meet WCAG AA');
  assert.ok(contrast('#ffffff', accent) >= 4.5, 'white text on the accent button should meet WCAG AA');
});
