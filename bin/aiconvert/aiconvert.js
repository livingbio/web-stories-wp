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
import ST from 'stjs';
import { v4 as uuidv4 } from 'uuid';

/**
 * Internal dependencies
 */
import { writeFileAsync } from '../utils/writeFileAsync';
import { getStoryMarkup } from './storyconvert';

export function getStoryJson(data, template) {
  const { pages, ...dataOptions } = data;
  const { pages: templatePages, layouts = {}, ...options } = template;

  for (const [key, value] of Object.entries(dataOptions)) {
    options[key] = options[key] ?? value;
  }

  const {
    featuredMediaUrl,
    link,
    title,
    autoAdvance,
    defaultPageDuratio,
    publisherName = '',
    logoPlaceholder,
  } = options;

  return {
    story: {
      featuredMediaUrl,
      link,
      title,
      autoAdvance,
      defaultPageDuratio,

      // default values to prevent OutputStory complaining
      status: '',
      author: -1,
      slug: '',
      date: '',
      modified: '',
      excerpt: '',
      featuredMedia: -1,
      password: '',
    },
    metadata: {
      publisher: {
        name: publisherName,
      },
      logoPlaceholder,

      // default value to prevent OutputStory complaining
      fallbackPoster: '',
    },
    pages: pages.map((page, pageIndex) => {
      const layoutPageIndex = layouts[page.layout];
      if (layoutPageIndex == null) {
        const error = new Error(
          `Layout "${
            page.layout
          }" not found in \`template.layout\`: ${JSON.stringify(layouts)}`
        );
        error.info = { data, page, pageIndex, template };
        error.name = 'LayoutNotExistsError';
        throw error;
      }
      const templatePage = templatePages[layoutPageIndex];

      page = ST.select(templatePage).transform(page).root();
      page.id = uuidv4();
      for (const element of page.elements) {
        element.id = uuidv4();
      }

      return page;
    }),
  };
}

export function getAiStoryMarkup(aiStory, template) {
  const story = getStoryJson(aiStory, template);
  return getStoryMarkup(story);
}

export function aiconvert(input, template, json, html) {
  const content = fs.readFileSync(input, 'utf-8');
  const inputJson = JSON.parse(content);

  const templateContent = fs.readFileSync(template, 'utf-8');
  const templateJson = JSON.parse(templateContent);
  const storyJson = getStoryJson(inputJson, templateJson);

  const writeJson = writeFileAsync(json, JSON.stringify(storyJson, null, 2));

  if (html) {
    const htmlContent = getStoryMarkup(storyJson);
    const writeHtml = writeFileAsync(html, htmlContent);
    return Promise.all([writeJson, writeHtml]);
  }

  return writeJson;
}
