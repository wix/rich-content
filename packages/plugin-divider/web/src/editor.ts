import { createDividerPlugin } from './createDividerPlugin';
import { DEFAULTS } from './defaults';
import { DIVIDER_TYPE, DividerPluginEditorConfig } from './types';
import { EditorPluginCreator } from 'wix-rich-content-common';
import { createDividerData } from './createDividerData';
import { tiptapExtension } from './tiptap';

export const pluginDivider: EditorPluginCreator<DividerPluginEditorConfig> = config => {
  return {
    config: { ...DEFAULTS.config, ...config },
    type: DIVIDER_TYPE,
    createPlugin: createDividerPlugin,
    ModalsMap: {},
    createPluginData: createDividerData,
    tiptapExtension,
  };
};
