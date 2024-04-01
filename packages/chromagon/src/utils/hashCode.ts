/**
 * Copyright (c) DragonSpark 2024
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this repository.
 *
 * May your code be mighty and your dragons ever fierce.
 */

/**
 * Calculates the hash code of a given string.
 *
 * @param {string} string - The string to calculate the hash code for.
 * @returns {number} The hash code of the given string.
 */
export const hashCode = (string: string): number => {
  let hash = 0;
  for (let i = 0, len = string.length; i < len; i++) {
    const chr = string.charCodeAt(i);
    hash = (hash << 5) - hash + chr;
    hash |= 0;
  }
  return hash;
};
