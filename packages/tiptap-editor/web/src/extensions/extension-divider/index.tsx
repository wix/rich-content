import React from 'react';
import Divider from './divider';
import { DividerData } from 'ricos-schema';
import { createRicosNodeConfig } from '../../extensions-creators/node';
import { RicosNodeConfig } from '../../types';

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
    };
  });

// createRicosNodeConfigGeneric(('spolier') => {
//   return {
//     addNodeViewHOC(){
//       return {
//         types: ['image'],
//         HOC:  Component => {
//           return props => {
//             if(props.componentData.containerData.hasSpolier){
//               return (
//                 <div style={{ border: '1px solid red' }}>
//                   <Component {...props} t={key => key} />
//                 </div>
//             }else{
//               return <Component {...props} />
//             }

//             );
//           };
//         };
//       }
//     }

//   }
// })
