import React from 'react';
import { ReactNodeViewRenderer, mergeAttributes, NodeViewWrapper } from '@tiptap/react';
import { RicosExtensionConfig } from '../types';
import { RicosNode } from '../components/RicosNode';

const createRicosNodeHOC = Component => {
  return props => (
    <NodeViewWrapper as="div">
      <RicosNode component={Component} tiptapNodeProps={props}>
        {({ ComponentWithNodeHOCs, ...rest }) => {
          return <ComponentWithNodeHOCs {...rest} />;
        }}
      </RicosNode>
    </NodeViewWrapper>
  );
};

export const createRicosNodeConfig = (
  Component,
  tiptapExtensionConfigCreator
): RicosExtensionConfig => {
  return {
    addNodeView: () => {
      // eslint-disable-next-line new-cap
      return ReactNodeViewRenderer(createRicosNodeHOC(Component));
    },
    ...tiptapExtensionConfigCreator({ mergeAttributes }),
    extensionType: 'node',
  };
};
