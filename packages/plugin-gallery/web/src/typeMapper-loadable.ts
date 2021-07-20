import { GALLERY_TYPE } from './types';
import { PluginTypeMapper } from 'wix-rich-content-common';
import loadable from '@loadable/component';

export const typeMapper: PluginTypeMapper = () => ({
  [GALLERY_TYPE]: { component: loadable(() => import('./gallery-viewer')) },
});
