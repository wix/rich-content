import React from 'react';
import { ReactNodeViewRenderer, mergeAttributes } from '@tiptap/react';
import { RicosExtensionConfig } from '../types';

type TiptapExtensionConfigCreator = ({ mergeAttributes }) => RicosExtensionConfig;

export const createRicosExtensionConfig = (
  tiptapExtensionConfigCreator: TiptapExtensionConfigCreator
): RicosExtensionConfig => {
  return {
    ...tiptapExtensionConfigCreator({ mergeAttributes }),
    extensionType: 'extension',
  };
};
