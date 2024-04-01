// noinspection ExceptionCaughtLocallyJS

/**
 * Copyright (c) DragonSpark 2024
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this repository.
 *
 * May your code be mighty and your dragons ever fierce.
 */

import { expect, it, suite } from 'vitest';
import { buildPalette, CompositePalette } from '../src';
import { SimplePalette } from '../src/generator';

const baseColor = '#6e5b95';

suite('paletteBuilder', () => {
  it('should generate a standard color palette', () => {
    let palette: CompositePalette;

    expect(() => (palette = buildPalette(baseColor, false))).not.toThrow();
    expect(palette.name).toBe('Deluge');
    expect(palette.shades.length).toBe(11);
  });

  it('should generate an APCA-compliant color palette', () => {
    let palette: CompositePalette;

    expect(() => (palette = buildPalette(baseColor, true))).not.toThrow();
    expect(palette.name).toBe('Deluge');
    expect(palette.shades.length).toBe(11);
  });

  it('should handle baseline TW colors', () => {
    let palette: CompositePalette;

    expect(() => (palette = buildPalette('#22c55e', false))).not.toThrow();
    expect(palette.name).toBe('Emerald');
    expect(palette.shades.length).toBe(11);
  });

  it('should flatten in the correct space', () => {
    let palette: CompositePalette;
    expect(() => (palette = buildPalette('#22c55e', true))).not.toThrow();

    const referenceShade = palette.shades.find((s) => s.number === 500);
    let flatPalette: SimplePalette;

    expect(() => (flatPalette = palette.flat())).not.toThrow();
    expect(flatPalette[referenceShade.number]).toBe(referenceShade.hex);
  });
});
