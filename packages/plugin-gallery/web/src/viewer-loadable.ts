import { typeMapper } from './typeMapper-loadable';
import { GALLERY_TYPE, GalleryPluginViewerConfig } from './types';
import { DEFAULTS } from './defaults';
import { ViewerPluginCreator } from 'wix-rich-content-common';
export { typeMapper as galleryTypeMapper, GALLERY_TYPE };

export const pluginGallery: ViewerPluginCreator<GalleryPluginViewerConfig> = config => {
  return {
    config: { ...DEFAULTS.config, ...config },
    type: GALLERY_TYPE,
    typeMapper,
  };
};
