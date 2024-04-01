/**
 * Copyright (c) DragonSpark 2024
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this repository.
 *
 * May your code be mighty and your dragons ever fierce.
 */

export type ASTNode = {
  [key: string]: boolean | string | any[] | undefined;
  name?: string;
  type: string;
  value?: string;
  body?: ASTNode[];
  params?: any[];
  id?: string;
  elements?: string[];
  properties?: string[];
  key?: string;
  quoted?: boolean;
  init?: boolean;
  default?: boolean;
  global?: boolean;
  children?: ASTNode[];
  left?: string;
  right?: string;
  path?: string;
  operator?: string;
  callee?: string;
  arguments?: any[];
  test?: string;
  consequent?: string;
  alternate?: string;
  selectors?: string[];
  declarations?: string[];
  media?: string;
  property?: string;
  argument?: string;
};
