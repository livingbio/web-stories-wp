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
import axios from 'axios';

/**
 * Internal dependencies
 */

const TYPES = {
  FETCH_QUEUES: 'fetchQueues',
};

const defaultState = [];

function apiReducer(state, action) {
  switch (action.type) {
    case TYPES.FETCH_QUEUES:
      return action.payload;
    default:
      return state;
  }
}

function useQueueApi() {
  const [state, dispath] = useReducer(apiReducer, defaultState);

  const fetchQueues = useCallback(async () => {
    try {
      const host = 'https://gstudio.gliacloud.com';
      // const host = 'http://172.16.6.233:8001';

      const response = await axios({
        method: 'GET',
        url: `${host}/api/stories/?cb=${Date.now()}`,
      });

      dispath({
        type: TYPES.FETCH_QUEUES,
        payload: response.data.payload,
      });
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log('fetchQueues -> error', error);
    }
  }, []);

  const api = useMemo(
    () => ({
      fetchQueues,
    }),
    [fetchQueues]
  );

  return { queues: state, api };
}

export default useQueueApi;
