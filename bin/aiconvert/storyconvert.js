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
import _getStoryMarkup from '../../assets/src/edit-story/output/utils/getStoryMarkup';

export function getStoryMarkup({ story, pages, metadata }) {
  return _getStoryMarkup(story, pages, metadata);
}

export function storyconvert(input, html) {
  const content = fs.readFileSync(input, 'utf-8');
  const storyJson = JSON.parse(content);

  const htmlContent = getStoryMarkup(storyJson);
  fs.writeFileSync(html, htmlContent);
}
