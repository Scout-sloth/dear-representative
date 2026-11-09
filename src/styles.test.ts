/// <reference types="vite/client" />
import css from './styles.css?raw';
import {describe, expect, it} from 'vitest';

const blocks = [...css.matchAll(/:root\s*\{([^}]+)\}/g)].map(match => match[1]);
const palettes = blocks.slice(0, 2).map(block => Object.fromEntries(
  [...block.matchAll(/--([\w-]+):\s*(#[\da-f]+)/gi)].map(match => [match[1], match[2]]),
));

function luminance(hex: string) {
  const rgb = [1,3,5].map(i => parseInt(hex.slice(i, i + 2), 16) / 255)
    .map(c => c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
  return rgb[0] * 0.2126 + rgb[1] * 0.7152 + rgb[2] * 0.0722;
}
function contrast(a: string, b: string) {
  const values = [luminance(a), luminance(b)].sort((a,b) => b-a);
  return (values[0] + 0.05) / (values[1] + 0.05);
}

describe('semantic theme contrast', () => {
  for (const [index, palette] of palettes.entries()) {
    it(`${index === 0 ? 'light' : 'dark'} text meets AA contrast on its surfaces`, () => {
      for (const background of ['page','section','section-alternate','surface','input','preview','selected']) {
        for (const foreground of ['text','muted','link','accent-text']) {
          expect(contrast(palette[foreground], palette[background]), `${foreground} on ${background}`).toBeGreaterThanOrEqual(4.5);
        }
      }
      for (const [foreground, background] of [['link','secondary'], ['button-text','button'], ['secondary-text','secondary'], ['hero-text','hero'], ['hero-muted','hero'], ['hero-accent','hero']]) {
        expect(contrast(palette[foreground], palette[background]), `${foreground} on ${background}`).toBeGreaterThanOrEqual(4.5);
      }
    });
    it(`${index === 0 ? 'light' : 'dark'} boundaries and focus indicators meet 3:1`, () => {
      for (const background of ['page','section','section-alternate','surface','input','selected','preview','secondary']) {
        for (const foreground of ['control-border','focus']) {
          expect(contrast(palette[foreground], palette[background]), `${foreground} on ${background}`).toBeGreaterThanOrEqual(3);
        }
      }
      expect(contrast(palette['selected-border'], palette.selected)).toBeGreaterThanOrEqual(3);
    });
  }
  it('uses system preference, complete palettes, and distinct alternating surfaces', () => {
    expect(css).toContain('@media (prefers-color-scheme: dark)');
    expect(css).toContain('color-scheme: light dark');
    expect(palettes).toHaveLength(2);
    expect(Object.keys(palettes[0]).sort()).toEqual(Object.keys(palettes[1]).sort());
    // Visual separation target, not a WCAG requirement for decorative backgrounds.
    for (const palette of palettes) expect(contrast(palette.section, palette['section-alternate'])).toBeGreaterThanOrEqual(1.2);
    for (const [, token] of css.matchAll(/var\(--([\w-]+)\)/g)) expect(palettes[0]).toHaveProperty(token);
  });
});
