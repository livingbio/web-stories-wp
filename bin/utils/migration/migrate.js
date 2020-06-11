/*
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * Internal dependencies
 */
import backgroundConditionClause from './migrations/v0001_backgroundConditionClause';

const MIGRATIONS = {
  1: [backgroundConditionClause],
};

export const DATA_VERSION = Math.max.apply(
  null,
  Object.keys(MIGRATIONS).map(Number)
);

export function migrate(slottedTemplate) {
  const version = slottedTemplate.templateVersion || 0;
  let result = slottedTemplate;
  for (let v = version; v < DATA_VERSION; v++) {
    const migrations = MIGRATIONS[v + 1];
    if (!migrations) {
      continue;
    }
    for (let i = 0; i < migrations.length; i++) {
      result = migrations[i](result);
    }
  }
  return result;
}

export default migrate;
