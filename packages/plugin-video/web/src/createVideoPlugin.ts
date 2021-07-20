import createToolbar from './toolbar/createToolbar';
import { Component, DEFAULTS } from './video-component';
import { VIDEO_TYPE, VIDEO_TYPE_LEGACY, VideoPluginEditorConfig } from './types';
import { createBasePlugin } from 'wix-rich-content-plugin-commons';
import { CreatePluginFunction } from 'wix-rich-content-common';

const createVideoPlugin: CreatePluginFunction<VideoPluginEditorConfig> = config => {
  const {
    helpers,
    t,
    [VIDEO_TYPE]: settings = {},
    isMobile,
    spoilerWrapper,
    commonPubsub,
    experiments,
    ...rest
  } = config;
  const disableDownload = config?.uiSettings?.disableDownload;
  const defaultPluginData =
    disableDownload !== undefined ? { ...DEFAULTS, disableDownload } : DEFAULTS;
  const type = VIDEO_TYPE;
  return createBasePlugin({
    component: Component,
    type,
    legacyType: VIDEO_TYPE_LEGACY,
    toolbar: createToolbar({
      t,
      settings: { ...settings, commonPubsub, type },
      isMobile,
      disableDownload,
      experiments,
    }),
    helpers,
    settings,
    t,
    isMobile,
    disableRightClick: config?.uiSettings?.disableRightClick,
    defaultPluginData,
    spoilerWrapper: settings.spoiler && spoilerWrapper,
    commonPubsub,
    ...rest,
  });
};

createVideoPlugin.functionName = VIDEO_TYPE;

export { createVideoPlugin };
