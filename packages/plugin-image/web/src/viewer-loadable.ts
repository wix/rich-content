import { typeMapper } from './typeMapper-loadable';
import { IMAGE_TYPE, ImagePluginViewerConfig } from './types';
import { DEFAULTS } from './consts';
import { ViewerPluginCreator } from 'wix-rich-content-common';
export { typeMapper as imageTypeMapper, IMAGE_TYPE };

export const pluginImage: ViewerPluginCreator<ImagePluginViewerConfig> = config => {
  return {
    config: { ...DEFAULTS.config, ...config },
    type: IMAGE_TYPE,
    typeMapper,
  };
};
