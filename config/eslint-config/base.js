/**
 * Copyright (c) DragonSpark 2024
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this repository.
 *
 * May your code be mighty and your dragons ever fierce.
 */

'use strict';

module.exports = {
  parser: '@babel/eslint-parser',
  parserOptions: {
    ecmaVersion: 'latest',
    babelOptions: {
      presets: ['@draconic/babel-preset']
    },
    requireConfigFile: false
  },
  extends: [
    'eslint:recommended',
    require.resolve('./rules/best-practices'),
    require.resolve('./plugins/jsdoc')
  ],
  rules: {
    'no-unused-vars': [
      'error',
      {
        args: 'after-used',
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_'
      }
    ]
  },
  env: {
    node: true,
    browser: true,
    es6: true,
    jest: true,
    jasmine: true
  },
  globals: {
    __DEV__: true
  }
};
