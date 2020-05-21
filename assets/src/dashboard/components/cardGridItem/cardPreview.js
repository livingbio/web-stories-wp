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
import { useState, useRef, useEffect, useReducer } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

/**
 * Internal dependencies
 */
import { Button } from '..';
import { BUTTON_TYPES } from '../../constants';
import { StoryPropType } from '../../types';
import { usePagePreviewSize, clamp, useFocusOut } from '../../utils';
import { resolveRoute } from '../../app/router';
import PreviewErrorBoundary from '../previewErrorBoundary';
import PreviewPage from '../previewPage';
import { ActionLabel } from './types';

const PreviewPane = styled.div`
  position: relative;
  border-radius: ${({ theme }) => theme.storyPreview.borderRadius}px;
  height: ${({ cardSize }) => `${cardSize.height}px`};
  box-shadow: ${({ theme }) => theme.storyPreview.shadow};
  border: ${({ theme }) => theme.storyPreview.border};
  width: 100%;
  overflow: hidden;
  z-index: -1;
`;

const EditControls = styled.div`
  height: ${({ cardSize }) => `${cardSize.height}px`};
  width: ${({ cardSize }) => `${cardSize.width}px`};
  position: absolute;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 0;
  transition: opacity ease-in-out 300ms;
  background: ${({ theme }) => theme.cardItem.previewOverlay};
  border-radius: ${({ theme }) => theme.storyPreview.borderRadius}px;
  opacity: ${(props) => (props.isActive ? 1 : 0)};
  &:hover {
    opacity: 1;
  }
  @media ${({ theme }) => theme.breakpoint.smallDisplayPhone} {
    button,
    a {
      min-width: ${({ cardSize }) => cardSize.width};
      & > label {
        font-size: 12px;
      }
    }
  }
`;

const ActionContainer = styled.div`
  padding: 20px;
  width: 100%;
  display: flex;
  justify-content: center;
  text-transform: uppercase;
`;

const EmptyActionContainer = styled(ActionContainer)`
  padding: 40px;
`;

const getActionAttributes = (targetAction) =>
  typeof targetAction === 'string'
    ? { href: resolveRoute(targetAction), isLink: true }
    : { onClick: targetAction };

const cardMachine = {
  idle: {
    activate: 'active',
  },
  active: {
    deactivate: 'idle',
  },
};

const cardReducer = (state, action) => cardMachine?.[state]?.[action] || state;

const CardPreviewContainer = ({
  centerAction,
  bottomAction,
  story,
  children,
}) => {
  const { pageSize } = usePagePreviewSize({ isGrid: true });
  const [cardState, dispatch] = useReducer(cardReducer, 'idle');
  const [pageIndex, setPageIndex] = useState(0);
  const containElem = useRef(null);
  const storyPages = story.pages || [];

  useFocusOut(containElem, () => dispatch('deactivate'), []);

  useEffect(() => {
    if ('idle' === cardState) {
      setPageIndex(0);
    }
  }, [cardState]);

  useEffect(() => {
    let intervalId;
    if ('active' === cardState) {
      /**
       * The interval duration should eventually get pulled off the story schema's
       * auto advance duration and if no duration provided, use a default.
       *
       * Can also incorporate onWAAPIFinish here to make sure the page
       * doesn't switch before the animations finishes.
       */
      intervalId = setInterval(
        () => setPageIndex((v) => clamp(v + 1, [0, storyPages.length - 1])),
        2000
      );
    }

    return () => intervalId && clearInterval(intervalId);
  }, [storyPages.length, cardState]);

  return (
    <>
      <PreviewPane cardSize={pageSize}>
        <PreviewErrorBoundary>
          <PreviewPage
            page={storyPages[pageIndex]}
            animationState={'active' === cardState ? 'animate' : 'idle'}
          />
        </PreviewErrorBoundary>
        {children}
      </PreviewPane>
      <EditControls
        ref={containElem}
        cardSize={pageSize}
        isActive={'active' === cardState}
        onFocus={() => dispatch('activate')}
        onMouseEnter={() => dispatch('activate')}
        onMouseLeave={() => dispatch('deactivate')}
      >
        <EmptyActionContainer />
        {centerAction && (
          <ActionContainer>
            <Button
              type={BUTTON_TYPES.SECONDARY}
              {...getActionAttributes(centerAction.targetAction)}
            >
              {centerAction.label}
            </Button>
          </ActionContainer>
        )}
        <ActionContainer>
          <Button {...getActionAttributes(bottomAction.targetAction)}>
            {bottomAction.label}
          </Button>
        </ActionContainer>
      </EditControls>
    </>
  );
};

const ActionButtonPropType = PropTypes.shape({
  targetAction: PropTypes.oneOfType([PropTypes.func, PropTypes.string])
    .isRequired,
  label: ActionLabel.isRequired,
});

CardPreviewContainer.propTypes = {
  children: PropTypes.node,
  centerAction: ActionButtonPropType,
  bottomAction: ActionButtonPropType.isRequired,
  story: StoryPropType,
};

export default CardPreviewContainer;
