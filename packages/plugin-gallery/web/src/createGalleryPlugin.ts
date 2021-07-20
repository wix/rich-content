import createToolbar from './toolbar/createToolbar';
import { createBasePlugin, createBaseMediaPlugin } from 'wix-rich-content-plugin-commons';
import { Component, DEFAULTS } from './gallery-component';
import { GALLERY_TYPE, GalleryPluginEditorConfig } from './types';
import { CreatePluginFunction } from 'wix-rich-content-common';

const fileInputAccept = '.jpg,.png,.gif,.jpeg,.jpe,.jfif,.bmp,.heic,.heif,.tfif,.tif,.webp';

const createGalleryPlugin: CreatePluginFunction<GalleryPluginEditorConfig> = config => {
  const type = GALLERY_TYPE;
  const {
    helpers,
    theme,
    t,
    anchorTarget,
    relValue,
    [type]: settings = {},
    spoilerWrapper,
    uiSettings,
    experiments,
    ...rest
  } = config;
  settings.accept = settings.accept || fileInputAccept;

  const defaults = {
    ...DEFAULTS,
    config: {
      ...DEFAULTS.config,
      ...settings?.defaultData?.config,
    },
  };

  const pluginData =
    uiSettings?.disableDownload !== undefined
      ? {
          ...defaults,
          disableDownload: uiSettings?.disableDownload,
        }
      : defaults;

  const defaultPluginData =
    settings?.disableExpand !== undefined
      ? {
          ...pluginData,
          disableExpand: settings.disableExpand,
        }
      : pluginData;
  return createBasePlugin({
    component: createBaseMediaPlugin(Component),
    settings,
    theme,
    t,
    type,
    toolbar: createToolbar({
      settings,
      helpers,
      t,
      anchorTarget,
      relValue,
      experiments,
      isMobile: config.isMobile,
    }),
    helpers,
    anchorTarget,
    relValue,
    disableRightClick: config?.uiSettings?.disableRightClick,
    spoilerWrapper: settings.spoiler && spoilerWrapper,
    defaultPluginData,
    ...rest,
  });
};

createGalleryPlugin.functionName = GALLERY_TYPE;

export { createGalleryPlugin };
