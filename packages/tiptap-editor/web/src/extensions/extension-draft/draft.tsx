import { createRicosExtensionConfig } from './../../extensions-creators/extension';
import React from 'react';
import { tiptapNodeDataToDraft } from 'ricos-content/libs/tiptap';

const name = 'draft';

export const createDraftConfig = () =>
  createRicosExtensionConfig(() => {
    return {
      name,
      priority: 100000,
      addNodeViewHOC() {
        return {
          nodeTypes: ['*'],
          nodeViewHOC: Component => {
            return props => {
              const { componentData, node } = props;
              const data = tiptapNodeDataToDraft(node.type.name.toUpperCase(), componentData);
              const newProps = {
                ...props,
                componentData: data,
              };
              return <Component {...newProps} />;
            };
          },
        };
      },
    };
  });
