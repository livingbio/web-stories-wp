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
 * External dependencies
 */
import fs from 'fs';
import { JSDOM } from 'jsdom';

/**
 * Internal dependencies
 */
import { getAiStoryMarkup, getStoryJson } from '../aiconvert';
import defaultAiStory from './_utils/aiStory';
import defaultTemplate from './_utils/template';

describe('getAiStoryMarkup', () => {
  it('returns string of AMP HTML', () => {
    const markup = getAiStoryMarkup(defaultAiStory, defaultTemplate);
    expect(markup).toBeString();

    const dom = new JSDOM(markup);
    const ampStory = dom.window.document.querySelector('amp-story');
    expect(ampStory).toBeVisible();

    fs.writeFileSync('output.html', markup);
  });
});

describe('getStoryJson', () => {
  let template, data;

  beforeAll(() => {
    template = {
      layouts: {
        NORMAL: 0,
      },
      pages: [
        {
          elements: [
            {
              text: '{{ headline }}',
            },
            {
              text: '{{ title }}',
            },
          ],
        },
      ],
    };

    data = {
      pages: [
        {
          headline: 'My Headline',
          title: 'My Title',
          layout: 'NORMAL',
        },
        {
          headline: 'My Headline',
          title: 'My Title',
          layout: 'NORMAL',
        },
      ],
    };
  });

  it('renders template layouts correctly', () => {
    const { story, metadata, pages } = getStoryJson(data, template);
    expect(story).toBeObject();
    expect(metadata.publisher).toBeObject();

    expect(pages[0].id).not.toStrictEqual(pages[1].id);

    const { elements } = pages[0];
    expect(elements[0].text).toBe('My Headline');
    expect(elements[1].text).toBe('My Title');
  });
});
