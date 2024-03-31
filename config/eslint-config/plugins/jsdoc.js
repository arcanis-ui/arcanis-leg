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
  plugins: ['jsdoc'],
  settings: {
    jsdoc: {
      tagNamePreference: {
        augments: 'extends'
      }
    }
  },
  rules: {
    'jsdoc/check-param-names': 2,
    'jsdoc/check-tag-names': [
      'error',
      {
        definedTags: ['jest-environment']
      }
    ],
    'jsdoc/check-types': 2
  }
};
