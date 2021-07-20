import {
  PluginTypeMapper,
  CreatePluginFunction,
  ModalsMap,
  ViewerPlugin,
  EditorPlugin,
  InlineStyleMapper,
  CreatePluginsDataMap,
} from 'wix-rich-content-common';

export type BasePlugin = EditorPlugin & ViewerPlugin;

export interface RCEPluginProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  config: Record<string, any>;
  plugins: CreatePluginFunction[];
  ModalsMap: ModalsMap;
  createPluginsDataMap: CreatePluginsDataMap;
}

export interface RCVPluginProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  config: Record<string, any>;
  typeMappers: PluginTypeMapper[];
  inlineStyleMappers: (() => InlineStyleMapper)[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  decorators: any[];
}
