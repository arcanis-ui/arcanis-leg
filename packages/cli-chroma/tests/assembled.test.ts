/**
 * Copyright (c) DragonSpark 2024
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this repository.
 *
 * May your code be mighty and your dragons ever fierce.
 */

import * as c from '../src';
import { describe, it, expect } from 'vitest';

const colors = [
  ['reset', '\x1b[0m', '\x1b[0m'],
  ['bold', '\x1b[1m', '\x1b[22m'],
  ['dim', '\x1b[2m', '\x1b[22m'],
  ['italic', '\x1b[3m', '\x1b[23m'],
  ['underline', '\x1b[4m', '\x1b[24m'],
  ['inverse', '\x1b[7m', '\x1b[27m'],
  ['hidden', '\x1b[8m', '\x1b[28m'],
  ['strikethrough', '\x1b[9m', '\x1b[29m'],
  ['black', '\x1b[30m', '\x1b[39m'],
  ['red', '\x1b[31m', '\x1b[39m'],
  ['green', '\x1b[32m', '\x1b[39m'],
  ['yellow', '\x1b[33m', '\x1b[39m'],
  ['blue', '\x1b[34m', '\x1b[39m'],
  ['magenta', '\x1b[35m', '\x1b[39m'],
  ['cyan', '\x1b[36m', '\x1b[39m'],
  ['white', '\x1b[37m', '\x1b[39m'],
  ['gray', '\x1b[90m', '\x1b[39m'],
  ['bgBlack', '\x1b[40m', '\x1b[49m'],
  ['bgRed', '\x1b[41m', '\x1b[49m'],
  ['bgGreen', '\x1b[42m', '\x1b[49m'],
  ['bgYellow', '\x1b[43m', '\x1b[49m'],
  ['bgBlue', '\x1b[44m', '\x1b[49m'],
  ['bgMagenta', '\x1b[45m', '\x1b[49m'],
  ['bgCyan', '\x1b[46m', '\x1b[49m'],
  ['bgWhite', '\x1b[47m', '\x1b[49m'],
  ['blackBright', '\x1b[90m', '\x1b[39m'],
  ['redBright', '\x1b[91m', '\x1b[39m'],
  ['greenBright', '\x1b[92m', '\x1b[39m'],
  ['yellowBright', '\x1b[93m', '\x1b[39m'],
  ['blueBright', '\x1b[94m', '\x1b[39m'],
  ['magentaBright', '\x1b[95m', '\x1b[39m'],
  ['cyanBright', '\x1b[96m', '\x1b[39m'],
  ['whiteBright', '\x1b[97m', '\x1b[39m'],
  ['bgBlackBright', '\x1b[100m', '\x1b[49m'],
  ['bgRedBright', '\x1b[101m', '\x1b[49m'],
  ['bgGreenBright', '\x1b[102m', '\x1b[49m'],
  ['bgYellowBright', '\x1b[103m', '\x1b[49m'],
  ['bgBlueBright', '\x1b[104m', '\x1b[49m'],
  ['bgMagentaBright', '\x1b[105m', '\x1b[49m'],
  ['bgCyanBright', '\x1b[106m', '\x1b[49m'],
  ['bgWhiteBright', '\x1b[107m', '\x1b[49m']
];

describe('base color application', () => {
  describe('simple', () => {
    colors.forEach(([name, open, close]) => {
      it(`should apply ${name} color`, () => {
        expect(c[name](name)).toBe(open + name + close);
      });
    });
  });

  describe('nesting', () => {
    it('should handle nested colors', () => {
      expect(c.bold(`bold ${c.red(`red ${c.dim('dim')} red`)} bold`)).toBe(
        '\x1B[1mbold \x1B[31mred \x1B[2mdim\x1B[22m\x1B[1m red\x1B[39m bold\x1B[22m'
      );

      expect(
        c.magenta(
          `magenta ${c.yellow(
            `yellow ${c.cyan('cyan')} ${c.red('red')} ${c.green(
              'green'
            )} yellow`
          )} magenta`
        )
      ).toBe(
        '\x1B[35mmagenta \x1B[33myellow \x1B[36mcyan\x1B[33m \x1B[31mred\x1B[33m \x1B[32mgreen\x1B[33m yellow\x1B[35m magenta\x1B[39m'
      );
    });
  });

  describe('numbers & others', () => {
    [new Date(), -1e10, -1, -0.1, 0, 0.1, 1, 1e10].forEach((n) => {
      it(`should handle ${n}`, () => {
        expect(c.red(n)).toBe(`\x1b[31m${n}\x1b[39m`);
      });
    });
  });

  describe('empty & falsy values', () => {
    it('should handle empty and falsy values', () => {
      expect(c.blue()).toBe('');
      expect(c.blue('')).toBe('');
      expect(c.blue(undefined)).toBe('');
      expect(c.blue(0)).toBe('\x1b[34m0\x1b[39m');
      expect(c.blue(NaN)).toBe('\x1b[34mNaN\x1b[39m');
      expect(c.blue(null)).toBe('');
      expect(c.blue(true)).toBe('\x1b[34mtrue\x1b[39m');
      expect(c.blue(false)).toBe('\x1b[34mfalse\x1b[39m');
      expect(c.blue(Infinity)).toBe('\x1b[34mInfinity\x1b[39m');
    });
  });
});
