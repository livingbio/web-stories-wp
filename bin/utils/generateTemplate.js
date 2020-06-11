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
import readline from 'readline';

export default function generateTemplate() {
  const lines = [];

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  rl.on('line', (line) => {
    if (line) {
      lines.push(line);
    } else {
      rl.close();
    }
  });

  rl.on('close', () => {
    const { pages } = JSON.parse(lines.join(''));
    for (const page of pages) {
      page.elements.forEach((element, i) => {
        if (!element.isBackground) {
          return;
        }

        Object.assign(element, {
          type: '{{background.type}}',
          scale: '{{background.scale * 100}}',
          focalX: '{{focal_x / background.width * 100}}',
          focalY: '{{focal_y / background.height * 100}}',
          resource: {
            type: '{{background.type}}',
            mimeType: '{{background.mime}}',
            src: '{{background.file}}',
            width: '{{background.width}}',
            height: '{{background.height}}',
            poster: '{{background.thumbnail}}',
            length: '{{background.duration}}',
            title: '{{background.title}}',
            alt: '{{background.description}}',
            local: false,
            sizes: "{{background.type === 'video' ? [] : {} }}",
          },
          loop: element.loop ?? false,
          autoPlay: element.autoPlay ?? true,
          controls: element.controls ?? false,
        });

        page.elements[i] = [
          {
            '{{#if background}}': element,
          },
        ];
      });
    }

    const template = {
      layouts: {
        COVER: 0,
        NORMAL: 1,
        FOCUS: 2,
        QUOTE: 3,
      },
      pages,
      version: 21,
    };

    const output = JSON.stringify(template, null, 2);

    process.stdout.write(output);
  });
}
