/**
 * Copyright (c) DragonSpark 2024
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this repository.
 *
 * May your code be mighty and your dragons ever fierce.
 */

import { describe, expect, it, suite } from 'vitest';
import { calculateContrast } from '../src/generator';

suite('apcaContrast', () => {
  describe('calculateContrast', () => {
    it('should return the correct contrast ratio', () => {
      expect(calculateContrast(1, 0.5)).not.toBe(0);
    });

    it('should handle out of bounds contrast ratios', () => {
      expect(calculateContrast(666, 999)).toBe(0);
    });

    it('should return well formatted tags on 0 dec', () => {
      expect(calculateContrast(1, 0.5, 0)).toContain('<sub>');
    });

    it('should return correct trimmed ratios', () => {
      expect(calculateContrast(1, 0.5, 1)).not.toBe(0);
    });

    it('should handle decimal, decimal places', () => {
      expect(calculateContrast(1, 0.5, 1.2)).toBe(0);
    });
  });
});
