/**
 * Copyright (c) DragonSpark 2024
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this repository.
 *
 * May your code be mighty and your dragons ever fierce.
 */

'use strict';

const prefixes = [
  '@avt-default-state',
  '@avt-advanced-states',
  '@avt-keyboard-nav'
];

const prefixesList = prefixes.join('  | \n');

module.exports = {
  plugins: ['eslint-plugin-playwright'],
  overrides: [
    {
      extends: ['plugin:playwright/recommended'],
      files: ['*-test.avt.e2e.js'],
      rules: {
        'playwright/valid-title': [
          'error',
          {
            mustMatch: {
              describe: [
                /^(\s*@avt(\s+\S+)*\s*)$/.source,
                `Describe titles should start with "@avt" prefix`
              ],
              test: [
                /^(\s*(@avt-default-state||@avt-advanced-states||@avt-keyboard-nav)(\s+\S+)*\s*)$/
                  .source,
                `Test titles should start with one of the following prefixes: ${prefixesList}`
              ]
            }
          }
        ]
      }
    }
  ]
};
