/**
 * Copyright (c) DragonSpark 2024
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this repository.
 *
 * May your code be mighty and your dragons ever fierce.
 */

/**
 * Represents the SA98G variable for APCA contrast compatibility..
 * @namespace
 */
export const SA98G = {
  // 2.4 exponent for emulating actual monitor perception
  mainTRC: 2.4,

  // sRGB coefficients
  sRco: 0.2126729,
  sGco: 0.7151522,
  sBco: 0.072175,

  // G-4g constants for use with 2.4 exponent
  normBG: 0.56,
  normTXT: 0.57,
  revTXT: 0.62,
  revBG: 0.65,

  // G-4g Clamps and Scalers
  blkThrs: 0.022,
  blkClmp: 1.414,
  scaleBoW: 1.14,
  scaleWoB: 1.14,
  loBoWoffset: 0.027,
  loWoBoffset: 0.027,
  deltaYmin: 0.0005,
  loClip: 0.1,

  // Magic Numbers for UNCLAMP and reverseAPCA
  mFactor: 1.9468554433171,
  mOffsetIn: 0.0387393816571401,
  mExpAdj: 0.283343396420869,
  mOffsetOut: 0.312865795870758
};
