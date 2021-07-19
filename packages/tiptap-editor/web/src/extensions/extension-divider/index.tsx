import React from 'react';
import { createNodeExtension } from '../../extension';
import Divider from './divider';
import { DividerData } from 'ricos-schema';
import { createRicosNodeConfig } from '../../extensions-creators/node';

const componentDataDefaults = DividerData.fromJSON({});
const name = 'divider';

export const createDividerConfig = () =>
  createRicosNodeConfig(Divider, ({ mergeAttributes }) => {
    return {
      name,

      group: 'block',

      atom: true,
      selectable: true,
      draggable: true,

      addAttributes() {
        return componentDataDefaults;
      },

      parseHTML() {
        return [
          {
            tag: `${name}-component`,
          },
        ];
      },

      renderHTML({ HTMLAttributes }) {
        return [`${name}-component`, mergeAttributes(HTMLAttributes)];
      },
      addNodeViewHOC() {
        return Component => {
          return props => {
            return (
              <div style={{ border: '1px solid red' }}>
                <Component {...props} t={key => key} />
              </div>
            );
          };
        };
      },
    };
  });
