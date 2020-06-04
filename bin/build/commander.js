#!/usr/bin/env node
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

/* eslint-disable no-console */

/**
 * External dependencies
 */
import program from 'commander';
import jsdomGlobal from 'jsdom-global';

jsdomGlobal();

async function tryImport(dir) {
  const path = `${dir}/main.cjs`;
  let module;
  try {
    module = await import(path);
  } catch (e) {
    console.error(e);
    console.log(
      `Failed to import "${path}". Did you build it: \`npm run build:bin\`?`
    );
    process.exit(1);
  }

  return module.default;
}

(async function () {
  const { aiconvert, storyconvert } = await tryImport('./aiconvert');

  program
    .command('aiconvert')
    .description(
      "Convert GliaStudio's AI generated story to web-story json and story markup"
    )
    .arguments('<inputJson> <outputJson> [outputHtml]')
    .action(aiconvert);

  program
    .command('storyconvert')
    .description('Convert web-story json to story markup')
    .arguments('<inputJSON> <outputHtml>')
    .action(storyconvert);

  program.parse(process.argv);
})();

/* eslint-enable no-console */
