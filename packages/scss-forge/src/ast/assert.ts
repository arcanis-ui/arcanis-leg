/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * Copyright (c) DragonSpark 2024
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this repository.
 *
 * May your code be mighty and your dragons ever fierce.
 */

import type { ASTNode } from './node.ts';
import type { TypeDefinition } from './defineType';

/**
 * A no operation (noop) function.
 */
const noop = () => {
  /** noop! **/
};

/**
 * The assertAny function is a utility function that calls a no-op.
 * It can be used as a placeholder for assertions or as a default assertion function.
 */
export const assertAny = () => noop();

/**
 * Checks if a given node is defined.
 * Throws an error if the node is not defined.
 *
 * @param {ASTNode} [node] - The node to check for defined-ness.
 * @throws {Error} If the node is not defined.
 */
export const assertDefined = (node?: ASTNode) => {
  if (!node) {
    throw new Error(`Expected node to be defined`);
  }
};

/**
 * Asserts that a given value is of a specific type.
 *
 * @param {any} expected - The expected type of the value.
 * @returns A function that takes a value and throws an error if its type doesn't match the expected type.
 */
export const assertValueType = (expected: string) => (value: unknown) => {
  if (typeof value !== expected) {
    throw new TypeError(
      `Expected value of type ${expected}, but got ${typeof value}`
    );
  }
};

/**
 * Asserts that a given ASTNode is of a specific type.
 *
 * @param {TypeDefinition} type - The expected type of the ASTNode.
 * @returns A function that takes an ASTNode and throws an error if the type does not match.
 *
 * @throws {Error} - If the type of the ASTNode does not match the expected type.
 */
export const assertType =
  ({ type }: TypeDefinition) =>
  (node: ASTNode) => {
    assertDefined(node);

    if (node.type !== type) {
      throw new Error(
        `Expected node to be of type ${type}, but got ${node.type}`
      );
    }
  };

/**
 * Asserts that a value matches one of the expected types.
 *
 * @param {any[]} types - An array of functions representing the expected types.
 * @returns A function that takes a value and a node and performs the assertion.
 * @throws {TypeError} - If the value does not match any of the expected types.
 */
export const assertOneOf = (types: any[]) => (value: any, node: ASTNode) => {
  const errors = [];
  for (const item of types) {
    try {
      item(value);
      return;
    } catch (error) {
      if (!(error instanceof TypeError)) {
        throw error;
      }

      errors.push(error);
    }
  }

  throw new TypeError(
    `Expected node to match one of the expected types for ${node.type}.\n\n` +
      errors.map((error) => error.message).join('\n') +
      '\n'
  );
};

/**
 * This function takes a checkType function and returns a new function that accepts an array of ASTNode objects and a single ASTNode object.
 * The checkType function is called for each element in the array, passing the element and the single ASTNode object as arguments.
 *
 * @param {Function} checkType - A function that accepts two arguments, an ASTNode object and another ASTNode object.
 * @returns A new function that accepts an array of ASTNode objects and a single ASTNode object.
 */
export const arrayOf =
  (checkType: (value: any, node: ASTNode) => void) =>
  (nodes: ASTNode[], node: ASTNode) => {
    for (const item of nodes) {
      checkType(item, node);
    }
  };
