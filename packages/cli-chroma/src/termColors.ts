/**
 * Copyright (c) DragonSpark 2024
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this repository.
 *
 * May your code be mighty and your dragons ever fierce.
 */

import { ColorFunction } from './colorGenerator';
import { colorFunctions } from './colorFunctions';
import { isColorSupported } from 'std-env';

interface Colors {
  [key: string]: ColorFunction;
}

/**
 * A function that creates colors based on the value of `useColor` parameter.
 * If `useColor` is true, it returns the `colorFunctions` object.
 * If `useColor` is false, it returns a new object with keys from `colorFunctions`
 * and values set to the `String` function.
 *
 * @param {boolean} useColor - Indicates whether to use color or not.
 * @returns {Colors} - The colors object based on the value of `useColor`.
 */
export const createColors = (useColor: boolean): Colors =>
  useColor ? colorFunctions : (
    Object.keys(colorFunctions).reduce(
      (colors: Colors, key: string) => ({ ...colors, [key]: String }),
      {}
    )
  );

const colors = createColors(isColorSupported);

export const {
  reset,
  bold,
  dim,
  italic,
  underline,
  inverse,
  hidden,
  strikethrough,
  black,
  red,
  green,
  yellow,
  blue,
  magenta,
  cyan,
  white,
  gray,
  bgBlack,
  bgRed,
  bgGreen,
  bgYellow,
  bgBlue,
  bgMagenta,
  bgCyan,
  bgWhite,
  blackBright,
  redBright,
  greenBright,
  yellowBright,
  blueBright,
  magentaBright,
  cyanBright,
  whiteBright,
  bgBlackBright,
  bgRedBright,
  bgGreenBright,
  bgYellowBright,
  bgBlueBright,
  bgMagentaBright,
  bgCyanBright,
  bgWhiteBright
} = colors;

export type ANSIColorName = keyof typeof colors;

/**
 * Retrieves a color function based on the provided color name.
 *
 * @param {ANSIColorName} color - The color name to retrieve the color function for.
 * @param {ANSIColorName} [fallback='reset'] - The fallback color name to use if the requested color is not found.
 * @returns {ColorFunction} - The color function corresponding to the provided color name, or the fallback color function if not found.
 */
export const getColor = (
  color: ANSIColorName,
  fallback: ANSIColorName = 'reset'
): ColorFunction => colors[color] || colors[fallback];
