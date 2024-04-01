/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * Copyright (c) DragonSpark 2024
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this repository.
 *
 * May your code be mighty and your dragons ever fierce.
 */

import type { SCSSPrinter } from '../generator/printer';
import type { ASTNode } from './node.ts';

type GeneratorFn = (
  printer: SCSSPrinter,
  node: ASTNode,
  parent?: ASTNode
) => void;
type TypeSignature = {
  fields?: any;
  generate: GeneratorFn;
};

export type TypeDefinition = {
  builder: (...args: any[]) => ASTNode;
  generate: GeneratorFn;
  type: string;
};

export type InvocableTypeDefinition = {
  (...args: any[]): ASTNode;
  generate: GeneratorFn;
  type: string;
};

export const makeInvocableDefinition = (
  def: TypeDefinition
): InvocableTypeDefinition => {
  const func = (...args: any[]) => def.builder(...args); // Your function
  func.generate = def.generate; // Additional properties
  func.type = def.type;

  // Cast to InvocableTypeDefinition
  return func as InvocableTypeDefinition;
};

export const defineType = (
  type: string,
  { fields = {}, generate }: TypeSignature
): TypeDefinition => {
  const keys = Object.keys(fields);

  if (typeof generate !== 'function') {
    throw new Error(`Expected a \`generate\` method for type \`${type}\``);
  }

  const builder = (...args: any[]) => {
    let input = args;

    if (
      args.length === 1 &&
      typeof args[0] === 'object' &&
      !Array.isArray(args[0]) &&
      args[0].type === undefined
    ) {
      input = args[0];
    }

    const node: ASTNode = {
      type
    };

    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      const field = fields[key];
      const value = Array.isArray(input) ? input[i] : input[key];

      if (value !== undefined) {
        field.validate(value, node);
        node[key] = value;
        continue;
      }

      if (!field.optional) {
        throw new Error(
          `Expected field '${key}' to be defined for type ${type}.`
        );
      }
    }

    return node;
  };

  return {
    builder,
    generate,
    type
  };
};
