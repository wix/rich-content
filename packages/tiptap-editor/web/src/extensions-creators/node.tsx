import React from 'react';
import { ReactNodeViewRenderer, mergeAttributes, NodeViewWrapper } from '@tiptap/react';
import { RicosNodeConfig } from '../types';
import { RicosNode } from '../components/RicosNode';

type TiptapExtensionConfigCreator = ({ mergeAttributes }) => RicosNodeConfig;

// RicosNode change it to regular component
const createRicosNodeHOC = Component => {
  return props => (
    <NodeViewWrapper as="div">
      <RicosNode component={Component} tiptapNodeProps={props} />
    </NodeViewWrapper>
  );
};

export const createRicosNodeConfig = (
  Component,
  tiptapExtensionConfigCreator: TiptapExtensionConfigCreator
) => {
  return {
    addNodeView: () => {
      // eslint-disable-next-line new-cap
      return ReactNodeViewRenderer(createRicosNodeHOC(Component));
    },
    ...tiptapExtensionConfigCreator({ mergeAttributes }),
    extensionType: 'node',
  };
};
