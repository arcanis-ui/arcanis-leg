/*
 * Copyright (c) 2024 DragonSpark.
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this repository.
 */

import { suite, it, expect } from 'vitest';
import { fake } from 'sinon';
import { defineType } from '../src/ast/defineType';

suite('defineType', () => {
  it('defineType should create a type definition successfully', () => {
    const fields = {
      field1: {
        validate: fake(),
        optional: false
      }
    };
    const generateFn = fake();

    const defType = defineType('testType', { fields, generate: generateFn });

    expect(defType.type).toBe('testType');
    expect(defType.builder).toBeTypeOf('function');
    expect(defType.generate).toBe(generateFn);

    const node = defType.builder(['value1', 'value2']);
    expect(node.type).toBe('testType');
    expect(node.field1).toStrictEqual(['value1', 'value2']);
  });

  it('defineType should throw error when generate is not a function', () => {
    const fields = {
      field1: {
        validate: fake(),
        optional: false
      }
    };
    const generateFn = 'notAFunction';

    const t = () => {
      // @ts-ignore
      defineType('testType', { fields, generate: generateFn });
    };

    expect(t).toThrow(Error);
    expect(t).toThrow(`Expected a \`generate\` method for type \`testType\``);
  });

  it('defineType should throw error when required field is not defined', () => {
    const fields = {
      field1: {
        validate: fake(),
        optional: false
      }
    };
    const generateFn = fake();

    const defType = defineType('testType', { fields, generate: generateFn });
    const t = () => {
      defType.builder({});
    };

    expect(t).toThrow(Error);
    expect(t).toThrow(
      `Expected field 'field1' to be defined for type testType`
    );
  });
});
