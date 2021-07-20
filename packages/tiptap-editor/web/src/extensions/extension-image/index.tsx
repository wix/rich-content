import { createRicosNodeConfig } from './../../extensions-creators/node';
import Image from './image';
import { ImageData } from 'ricos-schema';
import React from 'react';

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
    };
  });
// addNodeViewHOC() {
//   return ImageComponent => {
//     return props => {
//       return (
//         <div style={{ border: '10px solid blue' }}>
//           <ImageComponent {...props} />
//         </div>
//       );
//     };
//   };
// },
