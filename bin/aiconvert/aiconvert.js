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

/**
 * Internal dependencies
 */
import { writeFileAsync } from '../utils/writeFileAsync';
import { getStoryMarkup } from './storyconvert';

export function getStoryJson(aiStory) {
  // TODO
  return {
    story: {},
    pages: aiStory.pages,
    metadata: {},
  };
}

export function getAiStoryMarkup(aiStory) {
  const story = getStoryJson(aiStory);
  return getStoryMarkup(story);
}

export function aiconvert(input, json, html) {
  const content = fs.readFileSync(input, 'utf-8');
  const aiStory = JSON.parse(content);
  const storyJson = getStoryJson(aiStory);

  const writeJson = writeFileAsync(json, JSON.stringify(storyJson));

  if (html) {
    const htmlContent = getStoryMarkup(storyJson);
    const writeHtml = writeFileAsync(html, htmlContent);
    return Promise.all([writeJson, writeHtml]);
  }

  return writeJson;
}
