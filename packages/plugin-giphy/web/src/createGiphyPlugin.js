import createToolbar from './toolbar';
import { Component, DEFAULTS } from './giphy-component';
import { GIPHY_TYPE } from './constants';
import { createBasePlugin } from 'wix-rich-content-editor-common';

const createGiphyPlugin = (config = {}) => {
  const type = GIPHY_TYPE;
  const { helpers, t, [type]: settings = {}, isMobile, pluginDefaults = {}, ...rest } = config;

  pluginDefaults[type] = DEFAULTS;

  return createBasePlugin({
    component: Component,
    type: GIPHY_TYPE,
    toolbar: createToolbar({
      helpers,
      t,
      settings,
      isMobile,
    }),
    helpers,
    settings,
    t,
    isMobile,
    pluginDefaults,
    ...rest,
  });
};

export { createGiphyPlugin };
