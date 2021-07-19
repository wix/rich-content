import { createRicosNodeConfig } from './../../extensions-creators/node';
import { createNodeExtension } from '../../extension';
import Image from './image';
import { ImageData } from 'ricos-schema';
import React from 'react';
// export const createImage = () => {
//   const attrs = ImageData.fromJSON({});
//   return createNodeExtension('image', Image, attrs);
// };

const componentDataDefaults = ImageData.fromJSON({});
const name = 'image';

export const createImageConfig = () =>
  createRicosNodeConfig(Image, ({ mergeAttributes }) => {
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
        return ImageComponent => {
          return props => {
            console.log({ props });
            return (
              <div style={{ border: '1px solid red' }}>
                <ImageComponent {...props} t={key => key} />
              </div>
            );
          };
        };
      },
    };
  });
