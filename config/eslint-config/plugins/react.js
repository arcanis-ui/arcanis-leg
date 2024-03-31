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
  extends: [
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:jsx-a11y/recommended'
  ],
  plugins: ['react', 'react-hooks'],
  settings: {
    react: {
      version: 'detect'
    }
  },
  parserOptions: {
    ecmaFeatures: {
      jsx: true
    }
  },
  rules: {
    // react
    'react/button-has-type': 'error',
    'react/jsx-uses-vars': 1,
    'react/jsx-uses-react': 1,
    'react/no-find-dom-node': 1,
    'react/jsx-no-useless-fragment': 2,
    'react/no-typos': 2,
    'react/sort-prop-types': 2,
    'react/forbid-component-props': [
      2,
      { forbid: [{ propName: 'style', message: 'Avoid using style prop' }] }
    ],
    'react/forbid-dom-props': [
      2,
      { forbid: [{ propName: 'style', message: 'Avoid using style prop' }] }
    ],

    // react-hooks
    'react-hooks/rules-of-hooks': 2,
    'react-hooks/exhaustive-deps': [
      2,
      {
        additionalHooks: 'useIsomorphicEffect'
      }
    ]
  },
  overrides: [
    {
      files: ['*.ts', '*.tsx'],
      plugins: ['@typescript-eslint'],
      extends: ['plugin:@typescript-eslint/recommended'],
      parser: '@typescript-eslint/parser',
      rules: {
        'no-unused-vars': 'off', // Disabled in favor of @typescript-eslint/no-unused-vars
        '@typescript-eslint/no-unused-vars': [
          'error',
          {
            args: 'after-used',
            argsIgnorePattern: '^_',
            varsIgnorePattern: '^_'
          }
        ],
        '@typescript-eslint/no-empty-function': 'off',
        '@typescript-eslint/no-explicit-any': 'warn',
        '@typescript-eslint/ban-ts-comment': 'off'
      }
    },
    {
      files: ['*-story.js', '*.stories.js'],
      rules: {
        'react/display-name': 0,
        'react/prop-types': 0,
        'react/forbid-component-props': 0,
        'react/forbid-dom-props': 0
      }
    },
    {
      files: ['*.e2e.js'],
      rules: {
        'react/forbid-component-props': 0,
        'react/forbid-dom-props': 0
      }
    },
    {
      files: ['**/fixtures/**/*.js'],
      rules: {
        'react/react-in-jsx-scope': 0
      }
    },

    {
      files: ['*-test.js'],
      rules: {
        'react/display-name': 0,
        'react/prop-types': 0
      }
    }
  ]
};
