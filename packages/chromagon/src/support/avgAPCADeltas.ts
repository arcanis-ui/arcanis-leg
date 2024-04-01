/**
 * Copyright (c) DragonSpark 2024
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this repository.
 *
 * May your code be mighty and your dragons ever fierce.
 */

/**
 * Represents an APCA-based delta of contrast.
 *
 * @property {number} shade - The shade value for the APCADelta.
 * @property {number} onWhite - The value when the comparison color is on a white background.
 * @property {number} onBlack - The value when the comparison color is on a black background.
 */
type APCADelta = {
  shade: number;
  onWhite: number;
  onBlack: number;
};

export const apcaDeltas: APCADelta[] = [
  {
    shade: 50,
    onWhite: 0,
    onBlack: -103
  },
  {
    shade: 100,
    onWhite: 5,
    onBlack: -97
  },
  {
    shade: 200,
    onWhite: 16,
    onBlack: -88
  },
  {
    shade: 300,
    onWhite: 28,
    onBlack: -75
  },
  {
    shade: 400,
    onWhite: 42,
    onBlack: -60
  },
  {
    shade: 500,
    onWhite: 55,
    onBlack: -47
  },
  {
    shade: 600,
    onWhite: 67,
    onBlack: -34
  },
  {
    shade: 700,
    onWhite: 78,
    onBlack: -23
  },
  {
    shade: 800,
    onWhite: 86,
    onBlack: -16
  },
  {
    shade: 900,
    onWhite: 92,
    onBlack: -10
  },
  {
    shade: 950,
    onWhite: 101,
    onBlack: 0
  }
];
