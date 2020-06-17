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
import { useContext, useMemo, useEffect } from 'react';
import PropTypes from 'prop-types';

/**
 * Internal dependencies
 */
import { Layout, ScrollToTop } from '../../../../components';
import { useTemplateView } from '../../../../utils';
import { ApiContext } from '../../../api/apiProvider';

import Content from '../../exploreTemplates/content';
import Header from './header';

function TemplateView({ onSelect, onCancel }) {
  const {
    state: {
      templates: {
        allPagesFetched,
        isLoading,
        templates,
        templatesOrderById,
        totalPages,
        totalTemplates,
      },
    },
    actions: {
      templateApi: { fetchExternalTemplates },
    },
  } = useContext(ApiContext);

  const { page, search, view } = useTemplateView({
    totalPages,
  });

  useEffect(() => {
    fetchExternalTemplates();
  }, [fetchExternalTemplates]);

  const orderedTemplates = useMemo(() => {
    return templatesOrderById.map((templateId) => {
      return templates[templateId];
    });
  }, [templatesOrderById, templates]);

  return (
    <Layout.Provider>
      <Header onCancel={onCancel} />
      <Content
        isLoading={isLoading}
        allPagesFetched={allPagesFetched}
        page={page}
        templates={orderedTemplates}
        totalTemplates={totalTemplates}
        search={search}
        view={view}
        templateActions={{
          createStoryFromTemplate: onSelect,
        }}
      />
      <Layout.Fixed>
        <ScrollToTop />
      </Layout.Fixed>
    </Layout.Provider>
  );
}

TemplateView.propTypes = {
  onSelect: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default TemplateView;
