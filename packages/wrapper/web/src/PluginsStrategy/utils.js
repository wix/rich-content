import { debounce, pick } from 'lodash';
import local from 'local-storage';
import MobileDetect from 'mobile-detect';
import { convertFromRaw, createWithContent } from 'wix-rich-content-editor';
import { normalizeInitialState, isSSR } from 'wix-rich-content-common';
import * as CONSTS from './consts';

const mobileDetect = !isSSR() // eslint-disable-next-line no-undef
  ? new MobileDetect(window.navigator.userAgent)
  : null;
export const isMobile = () => mobileDetect && mobileDetect.mobile() !== null;

export const generateKey = prefix => `${prefix}-${new Date().getTime()}`;

const getStateKeysToStore = () => {
  const { STATE_KEYS_TO_STORE } = CONSTS;
  return !isMobile()
    ? STATE_KEYS_TO_STORE
    : STATE_KEYS_TO_STORE.filter(key => key.indexOf('Size') === -1);
};

export const getStorageKey = () =>
  !isMobile() ? CONSTS.LOCAL_STORAGE_KEY : CONSTS.LOCAL_STORAGE_MOBILE_KEY;

export const loadStateFromStorage = () => local.get(getStorageKey());

export const saveStateToStorage = debounce(state => {
  const stateToStore = pick(state, getStateKeysToStore());
  local.set(getStorageKey(), stateToStore);
}, 1000);

export const getStateFromObject = obj => {
  const { anchorTarget, relValue } = CONSTS;
  const normalizedState = normalizeInitialState(obj, {
    anchorTarget,
    relValue,
  });
  const editorState = createWithContent(convertFromRaw(normalizedState));
  return { editorState, viewerState: normalizedState };
};

export const getBaseUrl = () => {
  if (isSSR()) {
    return null;
  }

  // eslint-disable-next-line no-undef
  const { hostname, port, protocol } = window.location;
  const baseUrl = `${protocol}//${hostname}`;
  return port ? `${baseUrl}:${port}` : baseUrl;
};

export const getRequestedLocale = () => getUrlParameter('locale') || 'en';

function getUrlParameter(name) {
  if (isSSR()) {
    return '';
  }
  // eslint-disable-next-line no-useless-escape
  const newname = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
  const regex = new RegExp('[\\?&]' + newname + '=([^&#]*)');
  // eslint-disable-next-line no-undef
  const results = regex.exec(window.location.search);
  return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
}
