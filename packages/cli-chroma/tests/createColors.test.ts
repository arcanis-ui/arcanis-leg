/**
 * Copyright (c) DragonSpark 2024
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this repository.
 *
 * May your code be mighty and your dragons ever fierce.
 */

import { describe, it, expect } from 'vitest';
import { createColors } from '../src';

describe('color override handling', () => {
  describe('useColor overrides automatic color detection', () => {
    it('should use colors when useColor is true', () => {
      expect(createColors(true).blue('blue')).toBe('\x1b[34mblue\x1b[39m');
    });

    it('should not use colors when useColor is false', () => {
      expect(createColors(false).blue('nope')).toBe('nope');
    });

    it('should convert non-string values to strings when useColor is false', () => {
      expect(createColors(false).blue(42)).toBe('42');
    });
  });
});
