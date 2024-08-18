/**
 * Copyright (c) DragonSpark 2024
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this repository.
 *
 * May your code be mighty and your dragons ever fierce.
 */

import { getOptimalContrastHue } from './apcaContrast';
import {
  apcaDeltas,
  colorNames,
  ColorSchema,
  referenceSchemas,
  TransformSchema
} from '../support';
import {
  ColorSpace,
  deltaE,
  HSL,
  OKLCH,
  parse as parseColor,
  serialize as representColor,
  sRGB,
  to as inColorSpace
} from 'colorjs.io/fn';
import { hashCode } from '../utils/hashCode';

export type Shade = {
  number: number;
  isBase: boolean;
  hex: string;
  rgb: string;
  hsl: string;
  oklch: string;
};

export type SimplePalette = { [shade: string]: string };

export class CompositePalette {
  id: string;
  name: string;
  shades: Shade[];

  constructor(id: string, name: string, shades: Shade[]) {
    this.id = id;
    this.name = name;
    this.shades = shades;
  }

  flat(space: 'hex' | 'rgb' | 'hsl' | 'oklch' = 'hex') {
    const simplePalette: SimplePalette = {};

    this.shades.forEach((shade) => {
      simplePalette[shade.number] = shade[space];
    });

    return simplePalette;
  }
}

/**
 * Finds the closest color shade from the given input color and base color families.
 *
 * @param {string} inputColor - The input color in hex format.
 * @param {ColorSchema[]} baseFamilies - An array of base color families.
 * @returns {TransformSchema} - The color family that contains the closest shade to the input color.
 */
const findClosestColorShade = (
  inputColor: string,
  baseFamilies: ColorSchema[]
): TransformSchema => {
  ColorSpace.register(sRGB);
  ColorSpace.register(HSL);

  const colorFamilies = [...baseFamilies] as TransformSchema[];

  colorFamilies.forEach((family) => {
    family.shades = family.shades.map((shade) => ({
      ...shade,
      delta: deltaE(inputColor, parseColor(shade.hexcode), { method: 'Jz' })
    }));
  });

  colorFamilies.forEach((family) => {
    family.closestShade = family.shades.reduce((current, next) =>
      current.delta < next.delta ? current : next
    );
  });

  const closestColorFamily = colorFamilies.reduce(
    (currentFamily, nextFamily) =>
      currentFamily.closestShade.delta < nextFamily.closestShade.delta ?
        currentFamily
      : nextFamily
  );
  closestColorFamily.shades = closestColorFamily.shades.map((shade) => ({
    ...shade,
    lightnessDiff: Math.abs(
      inColorSpace(parseColor(shade.hexcode), HSL).coords[2] -
        inColorSpace(parseColor(inputColor), HSL).coords[2]
    )
  }));
  closestColorFamily.closestShadeLightness = closestColorFamily.shades.reduce(
    (currentShade, nextShade) =>
      currentShade.lightnessDiff < nextShade.lightnessDiff ?
        currentShade
      : nextShade
  );
  return closestColorFamily;
};

/**
 * Finds the closest color name to the given input color.
 *
 * @param {string} inputColor - The input color in string format.
 * @returns {string} - The name of the closest color.
 */
const getClosestColorName = (inputColor: string): string => {
  // Create a deep copy of the ColorNames
  const colorNamesCopy: (string | number)[][] = JSON.parse(
    JSON.stringify(colorNames)
  );

  // Add color difference to each color array
  colorNamesCopy.forEach((colorArray) => {
    colorArray.push(
      deltaE(inputColor, parseColor('#' + colorArray[0].toString()), 'Jz')
    );
  });

  // Find the color array with the smallest color difference and return its name
  return colorNamesCopy
    .reduce((currentMinColor, currentColor) =>
      currentMinColor[2] < currentColor[2] ? currentMinColor : currentColor
    )[1]
    .toString();
};

/**
 * Builds a color palette based on a target color.
 * @param {string} targetColor - The target color in hex format.
 * @param [adjustContrast=false] - Indicates whether to adjust the contrast of the palette shades.
 * @returns {CompositePalette} - The generated color palette.
 */
export const buildPalette = (
  targetColor: string,
  adjustContrast = false
): CompositePalette => {
  ColorSpace.register(sRGB);
  ColorSpace.register(HSL);
  ColorSpace.register(OKLCH);

  // Filter out neutral families
  const filteredSchemas = referenceSchemas.filter(
    (e) =>
      e.name !== 'Slate' &&
      e.name !== 'Gray' &&
      e.name !== 'Zinc' &&
      e.name !== 'Neutral' &&
      e.name !== 'Stone'
  );

  // Find shades of the closest color
  const closestColorShades = findClosestColorShade(
    targetColor,
    filteredSchemas
  );

  const targetHSL = inColorSpace(parseColor(targetColor), HSL);
  const closestHSL = inColorSpace(
    parseColor(closestColorShades.closestShadeLightness.hexcode),
    HSL
  );

  const targetHue = targetHSL.coords[0];
  const contrastHue = closestHSL.coords[0];
  let diffHue: number = targetHue - contrastHue;
  let diffHueMode: 'replace' | 'operate' = 'operate';
  const saturationRatio = targetHSL.coords[1] / closestHSL.coords[1];

  if (diffHue === 0) {
    diffHue = contrastHue;
    diffHueMode = 'replace';
  }

  const builtShades = closestColorShades.shades.map((shade) => {
    const baseHSL = inColorSpace(parseColor(shade.hexcode), HSL);
    const modifiedShade = { ...baseHSL };

    // If we are dealing with a shade lighter than target, retain original color, else, apply hue and saturation
    if (closestColorShades.closestShadeLightness.number !== shade.number) {
      modifiedShade.coords[1] = baseHSL.coords[1] * saturationRatio;
      modifiedShade.coords[0] =
        diffHueMode === 'replace' ? diffHue : baseHSL.coords[0] + diffHue;
    } else {
      modifiedShade.coords = targetHSL.coords;
    }

    let modifiedShadeHex = representColor(inColorSpace(modifiedShade, sRGB), {
      format: 'hex'
    });

    if (adjustContrast) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const delta = apcaDeltas.find((d) => d.shade === shade.number)!;

      if (shade.number < 500) {
        modifiedShadeHex = getOptimalContrastHue(
          delta.onBlack,
          '#000',
          modifiedShadeHex
        );
      } else {
        modifiedShadeHex = getOptimalContrastHue(
          delta.onWhite,
          '#fff',
          modifiedShadeHex
        );
      }
    }

    const finalColor = parseColor(modifiedShadeHex);
    const finalHSL = inColorSpace(finalColor, HSL);

    const prismaticShade: Shade = {
      number: shade.number,
      isBase: closestColorShades.closestShadeLightness.number === shade.number,
      hex: modifiedShadeHex,
      rgb: representColor(finalColor),
      hsl: representColor(finalHSL),
      oklch: representColor(inColorSpace(finalColor, OKLCH))
    };

    return prismaticShade;
  });

  const name = getClosestColorName(targetColor);

  return new CompositePalette(`prismatic${hashCode(name)}`, name, builtShades);
};
