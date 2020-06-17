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
 * WordPress dependencies
 */

/**
 * External dependencies
 */
import { useEffect } from 'react';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import {
  Layout,
  StandardViewContentGutter,
  ScrollToTop,
} from '../../../components';
import { PageHeading } from '../shared';

import ListView from './listView';
import EmptyView from './emptyView';

// import { queues } from './mock';
import useQueueApi from './useQueueApi';

function AIStroyQueue() {
  const { queues, api } = useQueueApi();

  const filteredQueues = queues.filter(
    (queue) => ['processing', 'error'].indexOf(queue.status) !== -1
  );

  useEffect(() => {
    const timer = setInterval(() => {
      api.fetchQueues();
    }, 1000);
    return () => {
      clearInterval(timer);
    };
  }, [api]);

  return (
    <Layout.Provider>
      <Layout.Squishable>
        <PageHeading
          stories={[]}
          showTypeahead={false}
          defaultTitle={__('AI Story Queue', 'web-stories')}
        />
      </Layout.Squishable>
      <Layout.Scrollable>
        <StandardViewContentGutter>
          {filteredQueues && filteredQueues.length > 0 ? (
            <ListView queues={filteredQueues} />
          ) : (
            <EmptyView />
          )}
        </StandardViewContentGutter>
      </Layout.Scrollable>
      <Layout.Fixed>
        <ScrollToTop />
      </Layout.Fixed>
    </Layout.Provider>
  );
}

export default AIStroyQueue;
