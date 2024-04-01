/**
 * Copyright (c) DragonSpark 2024
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this repository.
 *
 * May your code be mighty and your dragons ever fierce.
 */

import { types } from '../ast';
import { createPrinter } from './printer';
import type { ASTNode } from '../ast/node.ts';

export const generate = (ast: ASTNode) => {
  const printer = createPrinter(types);
  printer.print(ast);

  return printer.get();
};
