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
import { useReducer, useCallback, useMemo } from 'react';
/**
 * WordPress dependencies
 */
// import apiFetch from '@wordpress/api-fetch';

const TYPES = {
  CREATE_STORY: 'createStory',
};

const defaultState = {
  story: '',
};

function apiReducer(state, action) {
  switch (action.type) {
    case TYPES.CREATE_STORY:
      return {
        ...state,
        story: action.payload,
      };
    default:
      return state;
  }
}

function useCreateApi() {
  const [state, dispath] = useReducer(apiReducer, defaultState);

  // eslint-disable-next-line require-await
  const createStory = useCallback(async ({ articleURL, templateId }) => {
    // eslint-disable-next-line no-console
    console.log('createStory -> articleURL', articleURL, templateId);
    try {
      // const response = await apiFetch({
      //   url: 'https://reqres.in/api/users',
      //   method: 'POST',
      //   data: {
      //     name: 'morpheus',
      //     job: 'leader',
      //   },
      // });
      // console.log('createStory -> response', response);

      dispath({
        type: TYPES.CREATE_STORY,
        payload: 'OK',
      });
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log('useCreateApi -> error', error);
    }
  }, []);

  const api = useMemo(
    () => ({
      createStory,
    }),
    [createStory]
  );

  return { state, api };
}

export default useCreateApi;
