import { IMAGE_TYPE, IMAGE_TYPE_LEGACY } from './types';
import { sizeClassName, alignmentClassName } from './classNameStrategies';
import { PluginTypeMapper } from 'wix-rich-content-common';
import loadable from '@loadable/component';

const imageRenderDescriptor = {
  component: loadable(() => import('./image-viewer')),
  classNameStrategies: {
    size: sizeClassName,
    alignment: alignmentClassName,
  },
};

export const typeMapper: PluginTypeMapper = () => ({
  [IMAGE_TYPE_LEGACY]: imageRenderDescriptor,
  [IMAGE_TYPE]: imageRenderDescriptor,
});
