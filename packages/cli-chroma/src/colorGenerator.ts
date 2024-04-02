/**
 * Copyright (c) DragonSpark 2024
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this repository.
 *
 * May your code be mighty and your dragons ever fierce.
 */

type AnsiCode = number | string;
export type ColorFunction = (
  string?: string | number | Date | boolean
) => string;

/**
 * Replaces all occurences of a closing tag in a string with a replacement string.
 *
 * @param {number} index - The starting index for the search.
 * @param {string} string - The string to search and replace in.
 * @param {string} close - The closing tag to search for.
 * @param {string} replace - The replacement string.
 * @param {string} [head] - The substring of the string before the first occurrence of the closing tag.
 * @param {string} [tail] - The substring of the string after the first occurrence of the closing tag.
 * @param {number} [next] - The index of the next occurrence of the closing tag.
 * @returns {string} The modified string with all occurrences of the closing tag replaced.
 */
const replaceClose = (
  index: number,
  string: string,
  close: string,
  replace: string,
  head: string = string.substring(0, index) + replace,
  tail: string = string.substring(index + close.length),
  next: number = tail.indexOf(close)
): string =>
  head + (next < 0 ? tail : replaceClose(next, tail, close, replace));

/**
 * Clears the bleed from a string by replacing a portion of the string
 * with a specified replacement, surrounded by opening and closing tags.
 *
 * @param {number} index - The index at which to start replacing the string.
 * @param {string} string - The input string to clear the bleed from.
 * @param {string} open - The opening tag to surround the replaced portion.
 * @param {string} close - The closing tag to surround the replaced portion.
 * @param {string} replace - The replacement string to substitute the portion with.
 * @returns {string} The input string with the specified portion replaced and
 *                   surrounded by the opening and closing tags.
 */
const clearBleed = (
  index: number,
  string: string,
  open: string,
  close: string,
  replace: string
): string =>
  index < 0 ?
    open + string + close
  : open + replaceClose(index, string, close, replace) + close;

/**
 * A higher-order function that creates a string filter function for removing empty or null values.
 *
 * @param {string} open - The opening delimiter string.
 * @param {string} close - The closing delimiter string.
 * @param {string} [replace=open] - The replacement string for the removed content.
 * @param {number} [at=open.length + 1] - The starting index for searching for the closing delimiter.
 * @returns - A function that filters out empty or null values from the given string.
 */
const filterEmpty =
  (
    open: string,
    close: string,
    replace: string = open,
    at: number = open.length + 1
  ) =>
  (string?: string | number | Date | boolean): string =>
    string != null && string !== '' && string !== undefined ?
      clearBleed(
        String(string).indexOf(close, at),
        String(string),
        open,
        close,
        replace
      )
    : '';

/**
 * Applies ANSI codes to open and close a string, optionally replacing placeholders with provided values.
 * @param {AnsiCode} open - The ANSI code or escape sequence to open the string.
 * @param {AnsiCode} close - The ANSI code or escape sequence to close the string.
 * @param {string} [replace] - The value to replace any placeholders in the open and close codes.
 * @returns {Function} - A function that takes a string and applies the assembled ANSI codes.
 */
export const assembleColor = (
  open: AnsiCode,
  close: AnsiCode,
  replace?: string
): ColorFunction => {
  const openCode = `\x1b[${open}m`;
  const closeCode = `\x1b[${close}m`;
  return filterEmpty(openCode, closeCode, replace);
};
