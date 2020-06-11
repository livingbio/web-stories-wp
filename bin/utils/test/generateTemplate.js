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
import generateTemplate from '../generateTemplate';

describe('generateTemplate', () => {
  it('returns a template with required properties', async () => {
    const template = await generateTemplate({
      pages: [],
    });

    expect(template).toHaveProperty(
      'version',
      'templateVersion',
      'layouts',
      'pages'
    );
  });

  it('returns background template with condition clause', async () => {
    const template = await generateTemplate({
      pages: [
        {
          elements: [
            {
              isBackground: true,
            },
          ],
        },
      ],
    });

    expect(template.pages[0].elements[0]).toStrictEqual([
      {
        '{{#if background}}': expect.any(Object),
      },
    ]);
  });
});
