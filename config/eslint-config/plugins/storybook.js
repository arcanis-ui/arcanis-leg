/**
 * Copyright (c) DragonSpark 2024
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this repository.
 *
 * May your code be mighty and your dragons ever fierce.
 */

/**
 * @see https://github.com/storybookjs/eslint-plugin-storybook
 */

'use strict';

module.exports = {
  plugins: ['storybook'],
  overrides: [
    {
      files: ['*.stories.js', '*-story.js'],
      extends: ['plugin:storybook/recommended'],
      rules: {
        'storybook/await-interactions': 'error',
        'storybook/context-in-play-function': 'error',
        'storybook/csf-component': 'error',
        'storybook/default-exports': 'error',
        'storybook/hierarchy-separator': 'error',
        'storybook/no-redundant-story-name': 'error',
        'storybook/no-stories-of': 'error',
        'storybook/no-title-property-in-meta': 'off',
        'storybook/prefer-pascal-case': 'error',
        'storybook/story-exports': 'error',
        'storybook/use-storybook-expect': 'error',
        'storybook/use-storybook-testing-library': 'error'
      }
    }
  ]
};
