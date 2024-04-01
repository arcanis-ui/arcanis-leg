// noinspection ExceptionCaughtLocallyJS

/**
 * Copyright (c) DragonSpark 2024
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this repository.
 *
 * May your code be mighty and your dragons ever fierce.
 */

import { suite, it, expect } from 'vitest';
import {
  arrayOf,
  assertAny,
  assertDefined,
  assertOneOf,
  assertType,
  assertValueType
} from '../src/ast/assert';
import { spy, fake } from 'sinon';
import type { ASTNode } from '../src/ast/node';
import type { TypeDefinition } from '../src/ast/defineType';

const dummyNode: ASTNode = {
  type: 'Identifier',
  name: 'TestNode'
};

suite('assertAny', () => {
  it('should do nothing', ({ expect }) => {
    const consoleLogSpy = spy(console, 'log');
    assertAny();
    expect(consoleLogSpy.called).toBe(false);
  });
});

suite('assertDefined', () => {
  it('should throw an error when node is undefined', () => {
    expect(() => assertDefined()).toThrow(Error('Expected node to be defined'));
  });

  it('should not throw an error when node is defined', () => {
    expect(() => assertDefined(dummyNode)).not.toThrow();
  });
});

suite('assertValueType', () => {
  it('should verify that a given value is of a specific type', async () => {
    const assertString = assertValueType('string');
    assertString('This is a string'); // This should pass

    try {
      assertString(123); // This should fail
      throw new Error(
        'assertValueType failed to throw an error on type mismatch'
      );
    } catch (e) {
      if (e.message !== 'Expected value of type string, but got number') {
        throw e; // Re-throw an unexpected error
      }
    }

    const assertNumber = assertValueType('number');
    assertNumber(123); // This should pass

    try {
      assertNumber('This is not a number'); // This should fail
      throw new Error(
        'assertValueType failed to throw an error on type mismatch'
      );
    } catch (e) {
      if (e.message !== 'Expected value of type number, but got string') {
        throw e; // Re-throw an unexpected error
      }
    }
  });
});

suite('assertType', () => {
  it('should throw if the ASTNode type does not match the provided TypeDefinition', async () => {
    const mockASTNode = { type: 'MismatchType' } as ASTNode;
    const typeDefinition: TypeDefinition = {
      builder: fake(),
      generate: fake(),
      type: 'ExpectedType'
    };
    expect(() => assertType(typeDefinition)(mockASTNode)).toThrow();
  });

  it('should not throw if the ASTNode type matches the provided TypeDefinition', async () => {
    const mockASTNode = { type: 'ExpectedType' } as ASTNode;
    const typeDefinition: TypeDefinition = {
      builder: fake(),
      generate: fake(),
      type: 'ExpectedType'
    };
    expect(() => assertType(typeDefinition)(mockASTNode)).not.toThrow();
  });
});

suite('assertOneOf', () => {
  it('should pass if the value matches one of the expected types', () => {
    const assertFunc = assertOneOf([assertValueType('boolean')]);

    const node: ASTNode = { type: 'ExpectedType', value: 'true' };
    expect(() => assertFunc(true, node)).not.toThrow();
  });

  it('should throw if the value does not match any of the expected types', () => {
    const assertFunc = assertOneOf([assertValueType('boolean')]);

    const node: ASTNode = { type: 'ExpectedType', value: 'notABoolean' };
    expect(() => assertFunc('notAValue', node)).toThrow();
  });
});

suite('arrayOf', () => {
  it('should pass if the node array matches the expected type', () => {
    const testFunc = arrayOf(assertOneOf([assertValueType('boolean')]));

    const nodes: ASTNode[] = [].fill({
      type: 'boolean',
      value: 'true'
    } as ASTNode);

    expect(() => testFunc(nodes, { type: 'boolean' })).not.toThrow();
  });

  it('should throw a TypeError if any value does not match the expected types', () => {
    const testFunc = arrayOf(assertOneOf([assertValueType('boolean')]));

    const nodes: ASTNode[] = [].fill({
      type: 'boolean',
      value: 'true'
    } as ASTNode);

    nodes.push({
      type: 'notABoolean',
      value: 'definitelyNotABoolean'
    });

    expect(() => testFunc(nodes, { type: 'boolean' })).toThrow();
  });

  it('should throw if any value causes an unexpected error', () => {
    const testFunc = arrayOf(
      assertOneOf([
        () => {
          throw Error();
        }
      ])
    );

    const nodes: ASTNode[] = [].fill({
      type: 'boolean',
      value: 'true'
    } as ASTNode);

    nodes.push({
      type: 'notABoolean',
      value: 'definitelyNotABoolean'
    });

    expect(() => testFunc(nodes, { type: 'boolean' })).toThrow();
  });
});
