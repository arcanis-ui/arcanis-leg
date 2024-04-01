/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * Copyright (c) DragonSpark 2024
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this repository.
 *
 * May your code be mighty and your dragons ever fierce.
 */

import { types, ASTNode } from '../ast';
import { format, Options as PrettierOptions } from 'prettier';

export type SCSSPrinter = {
  append(string: string): void;
  blockStart(character?: string): void;
  blockEnd(character?: string): void;
  get(): Promise<string>;
  maybeNewline(): void;
  newline(): void;
  print(node: any, parent?: ASTNode): void;
  space(): void;
  token(characters?: string): number;
};

export const PRETTIER_OPTIONS: PrettierOptions = {
  parser: 'scss',
  printWidth: 80,
  singleQuote: true,
  trailingComma: 'es5',
  proseWrap: 'always'
};

export const createPrinter = (definitions: typeof types): SCSSPrinter => {
  const buffer: string[] = [];
  let indentLevel = 0;

  const padLeft = (level: number) => {
    return '  '.repeat(level);
  };

  const printer: SCSSPrinter = {
    append(string: string) {
      buffer.push(string);
    },

    blockStart(character = '{') {
      printer.token(character);
      indentLevel++;
      printer.newline();
    },

    blockEnd(character = '}') {
      indentLevel--;
      printer.newline();
      printer.token(character);
    },

    get() {
      return format(buffer.join(''), PRETTIER_OPTIONS);
    },

    maybeNewline() {
      if (buffer[buffer.length - 1] !== '\n') {
        printer.newline();
      }
    },

    newline() {
      buffer.push('\n');
      buffer.push(padLeft(indentLevel));
    },

    print(node, parent) {
      definitions[node.type as keyof typeof definitions].generate(
        printer,
        node,
        parent
      );
    },

    space() {
      buffer.push(' ');
    },

    token(characters) {
      return buffer.push(characters ?? '');
    }
  };

  return printer;
};
