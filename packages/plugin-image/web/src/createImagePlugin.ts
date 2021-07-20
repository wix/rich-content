import createToolbar from './toolbar/createToolbar';
import {
  createBasePlugin,
  PLUGIN_DECORATION_PROPS,
  PLUGIN_DECORATIONS,
  createBaseMediaPlugin,
} from 'wix-rich-content-plugin-commons';
import { Component, DEFAULTS } from './image-component';
import { IMAGE_TYPE, IMAGE_TYPE_LEGACY, ImagePluginEditorConfig } from './types';
import { CreatePluginFunction } from 'wix-rich-content-common';
import { isNumber } from 'lodash';

const createImagePlugin: CreatePluginFunction<ImagePluginEditorConfig> = config => {
  const type = IMAGE_TYPE;
  const defaultPluginData =
    config?.uiSettings?.disableDownload !== undefined
      ? { ...DEFAULTS, disableDownload: config.uiSettings.disableDownload }
      : DEFAULTS;

  const PluginData =
    config?.settings?.disableExpand !== undefined
      ? { ...defaultPluginData, disableExpand: config.settings.disableExpand }
      : defaultPluginData;

  const {
    helpers,
    t,
    anchorTarget,
    relValue,
    [type]: settings,
    uiSettings,
    isMobile,
    innerModal,
    spoilerWrapper,
    experiments,
    ...rest
  } = config;
  return createBasePlugin({
    component: createBaseMediaPlugin(Component),
    type: IMAGE_TYPE,
    legacyType: IMAGE_TYPE_LEGACY,
    pluginDecorationProps: (props, componentData) => {
      const size = componentData.config?.size;
      const width = componentData.config?.width;
      let calulatedProps = props;
      if (
        componentData.src?.width &&
        (size === 'original' || (isMobile && size === 'inline' && isNumber(width) && width > 150))
      ) {
        calulatedProps = {
          ...props,
          width: componentData.src.width,
          style: {
            ...(componentData.src.style || {}),
            width: componentData.src.width,
          },
        };
      }
      const resizeableProps = PLUGIN_DECORATION_PROPS[PLUGIN_DECORATIONS.RESIZEABLE](
        calulatedProps
      );

      if (size === 'inline') {
        return resizeableProps;
      } else if (size === 'original') {
        return { ...resizeableProps, style: { ...resizeableProps.style, maxWidth: '100%' } };
      } else {
        const { width, ...allButWidth } = resizeableProps.style; // eslint-disable-line no-unused-vars, @typescript-eslint/no-unused-vars
        return { ...resizeableProps, style: { ...allButWidth } };
      }
    },
    componentWillReceiveDecorationProps: (props, nextProps, onPropsChange) => {
      const { width } = PLUGIN_DECORATION_PROPS[PLUGIN_DECORATIONS.RESIZEABLE](props);
      const { width: nextWidth } = PLUGIN_DECORATION_PROPS[PLUGIN_DECORATIONS.RESIZEABLE](
        nextProps
      );
      if (width !== nextWidth) {
        onPropsChange({ size: 'inline', width: nextWidth });
      }
    },
    toolbar: createToolbar({
      helpers,
      anchorTarget,
      relValue,
      t,
      uiSettings,
      isMobile,
      settings,
      experiments,
    }),
    helpers,
    innerModal,
    anchorTarget,
    relValue,
    settings: settings || {},
    uiSettings,
    t,
    isMobile,
    disableRightClick: config?.uiSettings?.disableRightClick,
    defaultPluginData: PluginData,
    spoilerWrapper: settings?.spoiler && spoilerWrapper,
    ...rest,
  });
};

createImagePlugin.functionName = IMAGE_TYPE;

export { createImagePlugin };
