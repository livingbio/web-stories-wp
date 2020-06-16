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
import IndexView from './indexView';
import TemplateView from './templateView';

function CreateStory() {
  const [view, setView] = useState(VIEW_INDEX);
  const [articleURL, setArticleURL] = useState('');

  const onArticleURLChange = useCallback(
    (value) => {
      setArticleURL(value);

      if (isValidUrl(articleURL)) {
        setView(VIEW_TEMPLATE);
      }
    },
    [articleURL]
  );

  const onTemplateSelect = (/*payload*/) => {
    setView(VIEW_INDEX);
  };

  const onTemplateCancel = () => {
    setView(VIEW_INDEX);
  };

  return (
    <>
      {view === VIEW_INDEX && (
        <IndexView
          articleURL={articleURL}
          onArticleURLChange={onArticleURLChange}
        />
      )}
      {view === VIEW_TEMPLATE && (
        <TemplateView onSelect={onTemplateSelect} onCancel={onTemplateCancel} />
      )}
    </>
  );
}

export default CreateStory;
