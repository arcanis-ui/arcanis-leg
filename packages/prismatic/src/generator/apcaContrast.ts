/**
 * Copyright (c) DragonSpark 2024
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this repository.
 *
 * May your code be mighty and your dragons ever fierce.
 */

import { SA98G } from '../support';
import {
  parse as parseColor,
  to as inColorSpace,
  serialize as representColor,
  ColorSpace,
  sRGB,
  HSL,
  PlainColorObject
} from 'colorjs.io/fn';

const MIN_COLOR_VALUE = 0;
const MAX_COLOR_VALUE = 1.1;
const PERCENTAGE_MULTIPLIER = 100;

/**
 * Checks if the given colors are invalid.
 *
 * @param {number} color1 - The first color value.
 * @param {number} color2 - The second color value.
 * @returns {boolean} - True if either color is not a number or if any of the colors are outside the valid range.
 */
const areColorsInvalid = (color1: number, color2: number): boolean =>
  isNaN(color1) ||
  isNaN(color2) ||
  Math.min(color1, color2) < MIN_COLOR_VALUE ||
  Math.max(color1, color2) > MAX_COLOR_VALUE;

/**
 * Adjusts color values based on given threshold values.
 *
 * @param {number} color1 - The first color value to be adjusted.
 * @param {number} color2 - The second color value to be adjusted.
 * @returns {number[]} An array containing the adjusted color values.
 */
const adjustColorValues = (color1: number, color2: number): number[] => {
  const adjustedColor1 =
    color1 > SA98G.blkThrs ?
      color1
    : color1 + Math.pow(SA98G.blkThrs - color1, SA98G.blkClmp);
  const adjustedColor2 =
    color2 > SA98G.blkThrs ?
      color2
    : color2 + Math.pow(SA98G.blkThrs - color2, SA98G.blkClmp);
  return [adjustedColor1, adjustedColor2];
};

/**
 * Calculates the contrast between two colors using the BoW (black on white) method.
 *
 * @param {number} color1 - The first color value.
 * @param {number} color2 - The second color value.
 * @returns {object} An object containing the contrast direction and contrast result.
 */
const calculateBoWContrast = (
  color1: number,
  color2: number
): {
  contrastDirection: string;
  contrastResult: number;
} => {
  const contrastDirection = 'BoW';
  const contrastRatio =
    (Math.pow(color2, SA98G.normBG) - Math.pow(color1, SA98G.normTXT)) *
    SA98G.scaleBoW;
  const contrastResult =
    contrastRatio < SA98G.loClip ?
      MIN_COLOR_VALUE
    : contrastRatio - SA98G.loBoWoffset;
  return { contrastDirection, contrastResult };
};

/**
 * Calculates the contrast between two colors in the context of contrast direction WoB (White on Black).
 *
 * @param {number} color1 - The first color value.
 * @param {number} color2 - The second color value.
 * @returns {object} - An object containing the contrast direction and the contrast result.
 */
const calculateWoBContrast = (
  color1: number,
  color2: number
): {
  contrastDirection: string;
  contrastResult: number;
} => {
  const contrastDirection = 'WoB';
  const contrastRatio =
    (Math.pow(color2, SA98G.revBG) - Math.pow(color1, SA98G.revTXT)) *
    SA98G.scaleWoB;
  const contrastResult =
    contrastRatio > -SA98G.loClip ?
      MIN_COLOR_VALUE
    : contrastRatio + SA98G.loWoBoffset;
  return { contrastDirection, contrastResult };
};

/**
 * Calculates the contrast ratio between two colors.
 *
 * @param {number} color1 - The value of the first color.
 * @param {number} color2 - The value of the second color.
 * @param [decimalPlaces=-1] - The number of decimal places to round the result to.
 *                                      If negative, the result will be multiplied by 100.
 *                                      If 0, the result will have a subscript indicating the contrast direction.
 *                                      If positive, the result will be rounded to the specified number of decimal places.
 * @returns {number | string} - The contrast ratio between the two colors, rounded according to the decimalPlaces parameter.
 *                            If the color values are outside the valid range, returns 0.
 */
export const calculateContrast = (
  color1: number,
  color2: number,
  decimalPlaces = -1
): number | string => {
  // Check if the provided color values are within the defined range
  if (areColorsInvalid(color1, color2)) {
    return MIN_COLOR_VALUE; // Return 0 if colors are outside the valid range
  }

  const [adjustedColor1, adjustedColor2] = adjustColorValues(color1, color2);

  // If the absolute color difference is too small, return 0
  if (Math.abs(adjustedColor2 - adjustedColor1) < SA98G.deltaYmin) {
    return MIN_COLOR_VALUE;
  } else {
    let contrastDirection: string;
    let contrastResult: number;

    if (adjustedColor2 > adjustedColor1) {
      ({ contrastDirection, contrastResult } = calculateBoWContrast(
        adjustedColor1,
        adjustedColor2
      ));
    } else {
      ({ contrastDirection, contrastResult } = calculateWoBContrast(
        adjustedColor1,
        adjustedColor2
      ));
    }

    // Format the contrastResult based on the value of decimalPlaces
    if (decimalPlaces < 0) {
      return contrastResult * PERCENTAGE_MULTIPLIER;
    } else if (decimalPlaces === 0) {
      return (
        Math.round(Math.abs(contrastResult) * PERCENTAGE_MULTIPLIER) +
        '<sub>' +
        contrastDirection +
        '</sub>'
      );
    } else if (Number.isInteger(decimalPlaces)) {
      return (contrastResult * PERCENTAGE_MULTIPLIER).toFixed(decimalPlaces);
    } else {
      return MIN_COLOR_VALUE;
    }
  }
};

/**
 * Calculates the lightness of an RGB color.
 *
 * @param {number[]} rgb - The RGB color values as an array of three integers.
 * @returns {number} - The calculated lightness value.
 */
export const calculateLightness = (rgb: number[] = [0, 0, 0]): number => {
  const normalizeValue = (value: number) => Math.pow(value, SA98G.mainTRC);

  // Calculate lightness by taking into account the sRGB constants for each color channel and their normalized values
  return (
    SA98G.sRco * normalizeValue(rgb[0]) +
    SA98G.sGco * normalizeValue(rgb[1]) +
    SA98G.sBco * normalizeValue(rgb[2])
  );
};

/**
 * Calculates the optimal contrast hue for a given target contrast, base color, and source color.
 *
 * @param {number} targetContrast - The desired contrast ratio.
 * @param {string} baseColorHex - The base color in hexadecimal format.
 * @param {string} sourceColorHex - The source color in hexadecimal format.
 * @returns {string} - The optimal contrast hue in hexadecimal format.
 */
export const getOptimalContrastHue = (
  targetContrast: number,
  baseColorHex: string,
  sourceColorHex: string
): string => {
  ColorSpace.register(sRGB);
  ColorSpace.register(HSL);

  const sourceHSL = inColorSpace(parseColor(sourceColorHex), HSL);
  const baseRGB = inColorSpace(parseColor(baseColorHex), sRGB);

  const hue = sourceHSL.coords[0];
  const saturation = sourceHSL.coords[1];

  // Initialize minimum difference with a high number
  let minDifference = 110;
  let optimalTone = 1;

  for (let tone = 1; tone < 100; tone++) {
    const currentRGB: PlainColorObject = inColorSpace(
      {
        space: HSL,
        coords: [hue, saturation, tone],
        alpha: 100
      },
      sRGB
    );

    // Calculate contrast between baseColor and the color with current lightness value
    const lighnessA = calculateLightness(currentRGB.coords);
    const lightnessB = calculateLightness(baseRGB.coords);

    const currentContrast = calculateContrast(lighnessA, lightnessB) as number;

    const diff = Math.abs(Math.abs(targetContrast) - Math.abs(currentContrast));

    // If the current difference is less than the minimum recorded difference,
    // update minimum difference and optimal tone
    if (diff < minDifference) {
      minDifference = diff;
      optimalTone = tone;
    }
  }

  const baseObj: PlainColorObject = {
    space: HSL,
    coords: [hue, saturation, optimalTone],
    alpha: 100
  };

  return representColor(inColorSpace(baseObj, sRGB), { format: 'hex' });
};
