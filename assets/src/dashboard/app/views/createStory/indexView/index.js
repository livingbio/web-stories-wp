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
import { useCallback } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

/**
 * Internal dependencies
 */

import { Layout, StandardViewContentGutter } from '../../../../components';
import { TextInput } from '../../../../components/input';
import Header from '../header';

const ArticleURLInput = styled(TextInput)`
  width: 100%;
  flex-grow: 1;
  border: none;
  border-radius: 4px;
  padding: 8px 16px 8px 16px;
  margin-top: 16px;
`;

const CreateFromURL = styled.div`
  color: #fff;
  background-color: #15c4d5;
  padding: 20px;
  margin-top: 20px;
`;

// const CreateFromContext = styled.div`
//   color: #15c4d5;
//   background-color: #eee;
//   padding: 20px;
//   margin-top: 20px;
// `;

// const CreateFromTemplate = styled.div`
//   color: #ff9800;
//   background-color: #eee;
//   padding: 20px;
//   margin-top: 20px;
// `;

function IndexView({ articleURL, onArticleURLChange }) {
  const onArticleURLKeyUp = useCallback(
    ({ keyCode, target }) => {
      if (keyCode && keyCode === 13 && target.value) {
        onArticleURLChange(target.value);
      }
    },
    [onArticleURLChange]
  );

  const onArticleURLPaste = useCallback(
    (e) => {
      const value = e.clipboardData.getData('Text');
      value && onArticleURLChange(value);
    },
    [onArticleURLChange]
  );

  return (
    <Layout.Provider>
      <Header />
      <Layout.Scrollable>
        <StandardViewContentGutter>
          <div>
            <CreateFromURL>
              <h3>{'Create Story from ArticleURL URL'}</h3>
              <ArticleURLInput
                defaultValue={articleURL}
                onKeyUp={onArticleURLKeyUp}
                onPaste={onArticleURLPaste}
              />
            </CreateFromURL>
            {/* <CreateFromContext>
              <h3>{'Copy and Paste from Context'}</h3>
            </CreateFromContext>
            <CreateFromTemplate onClick={() => setView(VIEW_TEMPLATE)}>
              <h3>{'Start from Scratch'}</h3>
            </CreateFromTemplate> */}
          </div>
        </StandardViewContentGutter>
      </Layout.Scrollable>
    </Layout.Provider>
  );
}

IndexView.propTypes = {
  articleURL: PropTypes.string,
  onArticleURLChange: PropTypes.func.isRequired,
};

export default IndexView;
