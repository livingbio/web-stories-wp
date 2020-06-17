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
import { isUri as isValidUrl } from 'valid-url';
import { useState, useCallback } from 'react';
/**
 * Internal dependencies
 */
import { VIEW_INDEX, VIEW_TEMPLATE } from './constants';
import useCreateApi from './useCreateApi';
import IndexView from './indexView';
import TemplateView from './templateView';

function CreateStory() {
  const [view, setView] = useState(VIEW_INDEX);
  const [articleURL, setArticleURL] = useState('');
  const { api } = useCreateApi();

  const createStory = useCallback(
    // eslint-disable-next-line no-shadow
    async ({ articleURL, templateId }) => {
      if (articleURL && templateId) {
        await api.createStory({
          articleURL,
          templateId,
        });
        location.hash = '#/ai-story-queue';
      }
    },
    [api]
  );

  const onArticleURLUpdate = useCallback((value) => {
    setArticleURL(value);

    if (isValidUrl(value)) {
      setView(VIEW_TEMPLATE);
    }
  }, []);

  const onTemplateSelect = useCallback(
    (payload) => {
      setView(VIEW_INDEX);
      createStory({
        articleURL,
        templateId: payload.id,
      });
    },
    [createStory, articleURL]
  );

  const onTemplateCancel = () => {
    setView(VIEW_INDEX);
  };

  return (
    <>
      {view === VIEW_INDEX && (
        <IndexView
          articleURL={articleURL}
          onArticleURLUpdate={onArticleURLUpdate}
        />
      )}
      {view === VIEW_TEMPLATE && (
        <TemplateView onSelect={onTemplateSelect} onCancel={onTemplateCancel} />
      )}
    </>
  );
}

export default CreateStory;
