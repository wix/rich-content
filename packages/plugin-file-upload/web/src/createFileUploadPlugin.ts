import createToolbar from './toolbar/createToolbar';
import { DEFAULTS } from './defaults';
import { Component } from './file-upload-component';
import { FILE_UPLOAD_TYPE, FilePluginEditorConfig } from './types';
import {
  createBasePlugin,
  createMediaUploadWrapper,
  createBaseMediaPlugin,
} from 'wix-rich-content-plugin-commons';
import { CreatePluginFunction } from 'wix-rich-content-common';

const createFileUploadPlugin: CreatePluginFunction<FilePluginEditorConfig> = config => {
  const type = FILE_UPLOAD_TYPE;
  const { helpers, t, [type]: settings = {}, ...rest } = config;
  const component = createMediaUploadWrapper(createBaseMediaPlugin(Component));
  return createBasePlugin({
    component,
    type: FILE_UPLOAD_TYPE,
    toolbar: createToolbar({
      helpers,
      t,
      settings,
    }),
    helpers,
    settings,
    t,
    defaultPluginData: DEFAULTS,
    ...rest,
  });
};

createFileUploadPlugin.functionName = FILE_UPLOAD_TYPE;

export { createFileUploadPlugin };
