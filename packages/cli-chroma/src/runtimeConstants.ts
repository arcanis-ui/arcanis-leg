/**
 * Copyright (c) DragonSpark 2024
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this repository.
 *
 * May your code be mighty and your dragons ever fierce.
 */

import * as tty from 'node:tty';

interface ProcessEnv {
  [key: string]: string | undefined;
}

interface Process {
  env: ProcessEnv;
  argv: string[];
  platform: string;
}

// This scenario is particularly difficult to test reliable, since replicating
// a null process can prove complex.
/* v8 ignore next 5 */
export const {
  env = {},
  argv = [],
  platform = ''
} = typeof process === 'undefined' ? ({} as Process) : process;

const isDisabled = env.NO_COLOR !== undefined || argv.includes('--no-color');
const isForced = env.FORCE_COLOR !== undefined || argv.includes('--color');
const isWindows = platform === 'win32';
const isDumbTerminal = env.TERM === 'dumb';

const isCompatibleTerminal =
  tty &&
  typeof tty.isatty === 'function' &&
  tty.isatty(1) &&
  env.TERM !== undefined &&
  !isDumbTerminal;

// This scenario is also particularly difficult to test reliable, due to the
// diversity of CI providers.
/* v8 ignore next 5 */
const isCI =
  env.CI !== undefined &&
  (env.GITHUB_ACTIONS !== undefined ||
    env.GITLAB_CI !== undefined ||
    env.CIRCLECI !== undefined);

// Same thing, not all scenarios are testable in a single environment emulation.
/* v8 ignore next 3 */
export const isColorSupported =
  !isDisabled &&
  (isForced || (isWindows && !isDumbTerminal) || isCompatibleTerminal || isCI);
