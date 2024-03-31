/**
 * Copyright (c) DragonSpark 2024
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this repository.
 *
 * May your code be mighty and your dragons ever fierce.
 */

'use strict';

module.exports = () => {
  return {
    presets: [
      [
        '@babel/preset-env',
        {
          modules: false,
          targets: {
            browsers: ['extends @draconic/browserslist-config']
          }
        }
      ],
      '@babel/preset-react'
    ],
    plugins: [
      'dev-expression',
      '@babel/plugin-proposal-class-properties',
      '@babel/plugin-proposal-export-namespace-from',
      '@babel/plugin-proposal-export-default-from',
      '@babel/plugin-transform-react-constant-elements'
    ]
  };
};
