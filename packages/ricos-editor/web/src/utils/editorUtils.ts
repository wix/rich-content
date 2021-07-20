import {
  createWithContent,
  createEmpty,
  convertToRaw,
  convertFromRaw,
} from 'wix-rich-content-editor/libs/editorStateConversion';
import { EditorProps } from 'draft-js';
import { pick } from 'lodash';
import { DRAFT_EDITOR_PROPS } from 'ricos-common';
import { isContentStateEmpty } from 'ricos-content';
import { isContentEqual } from 'ricos-content/libs/comapareDraftContent';
import { DraftContent, isSSR } from 'wix-rich-content-common';
import { emptyDraftContent } from 'wix-rich-content-editor-common';
import { EditorDataInstance, OnContentChangeFunction, ContentStateGetter } from '../index';
import errorBlocksRemover from './errorBlocksRemover';

/* eslint-disable no-console */
export const assert = (predicate, message) => console.assert(predicate, message);

export const ONCHANGE_DEBOUNCE_TIME = 200;

const wait = ms => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

export function createDataConverter(
  onContentChange?: OnContentChangeFunction,
  initialContent?: DraftContent
): EditorDataInstance {
  const initialOrEmptyContent = initialContent || emptyDraftContent;
  let currContent = initialOrEmptyContent;
  let lastContent = currContent;
  let currEditorState = initialContent
    ? createWithContent(convertFromRaw(initialContent))
    : createEmpty();
  let currTraits = {
    isEmpty: isContentStateEmpty(currContent),
    isContentChanged: false,
    isLastChangeEdit: false,
  };
  let isUpdated = false;
  let waitingForUpdatePromise = Promise.resolve(),
    waitingForUpdateResolve;

  const getContentStatePromise = async () => {
    await Promise.race([wait(2000), waitingForUpdatePromise]);
    return getContentState();
  };

  const waitForUpdate = () => {
    waitingForUpdatePromise = new Promise(res => {
      waitingForUpdateResolve = res;
    });
  };

  const getEditorState = () => currEditorState;

  const updateTraits = (
    currContent: DraftContent,
    lastContent: DraftContent,
    initialContent: DraftContent
  ) => {
    const initialContentEqual = isContentEqual(currContent, initialContent);
    const lastContentEqual = isContentEqual(currContent, lastContent);
    currTraits = {
      isEmpty: isContentStateEmpty(currContent),
      isContentChanged: !initialContentEqual,
      isLastChangeEdit: !lastContentEqual,
    };
  };

  const getContentTraits = () => {
    if (!isUpdated) {
      const currState = currEditorState.getCurrentContent();
      lastContent = currContent;
      currContent = convertToRaw(currState);
      updateTraits(currContent, lastContent, initialOrEmptyContent);
      isUpdated = true;
    }
    return currTraits;
  };

  const getContentState: ContentStateGetter = ({ shouldRemoveErrorBlocks = true } = {}) => {
    if (!isUpdated) {
      const currState = currEditorState.getCurrentContent();
      lastContent = currContent;
      currContent = convertToRaw(currState);
      updateTraits(currContent, lastContent, initialOrEmptyContent);
      isUpdated = true;
    }

    onContentChange?.(currContent);

    if (waitingForUpdateResolve) {
      waitingForUpdateResolve();
      waitingForUpdateResolve = false;
      waitingForUpdatePromise = Promise.resolve();
    }
    return shouldRemoveErrorBlocks ? errorBlocksRemover(currContent) : currContent;
  };

  function debounce<A, R>(f: (args?: A) => R, interval: number): (args?: A) => Promise<R> {
    let timer;

    return (...args) => {
      clearTimeout(timer);
      return new Promise((resolve, reject) => {
        timer = setTimeout(() => {
          try {
            resolve(f(...args));
          } catch (err) {
            reject(err);
          }
        }, interval);
      });
    };
  }

  const debounceUpdate = debounce(getContentState, ONCHANGE_DEBOUNCE_TIME);

  return {
    getContentState,
    getContentTraits,
    getEditorState,
    waitForUpdate,
    getContentStatePromise,
    refresh: (editorState, onError) => {
      if (!isSSR()) {
        isUpdated = false;
        currEditorState = editorState;
        debounceUpdate().catch(err => onError?.(err));
      }
    },
  };
}

export const filterDraftEditorSettings = (draftEditorSettings: Partial<EditorProps>) =>
  pick(draftEditorSettings, DRAFT_EDITOR_PROPS);
