import { RicosExtensionConfig } from '../src/types';
import { omit } from 'lodash';
import { Extensions, Node, AnyExtension, Mark } from '@tiptap/core';

export class RicosExtensionManager {
  static ricosExtensionsTotiptapExtensions(ricosExtensions): AnyExtension[] {
    return ricosExtensions
      .filter(ricosExtension => {
        return ricosExtension.extensionType === 'node' || ricosExtension.extensionType === 'mark';
      })
      .map(ricosExtension => {
        const tiptapConfig = omit(ricosExtension, 'addNodeViewHOC', 'extensionType');
        if (ricosExtension.extensionType === 'node') {
          return Node.create(tiptapConfig);
        } else if (ricosExtension.extensionType === 'mark') {
          return Mark.create(tiptapConfig);
        }
        return null;
      });
  }

  static extractNodeViewsHOCsFromRicosExtensions(ricosExtensions) {
    console.log('extractNodeViewsHOCsFromRicosExtensions');
    return ricosExtensions
      .sort((extA, extB) => {
        const defaultPriority = 100;
        const extAPriority = extA.priority || defaultPriority;
        const extBPriority = extB.priority || defaultPriority;

        if (extAPriority > extBPriority) {
          return -1;
        }

        if (extAPriority < extBPriority) {
          return 1;
        }
        return 0;
      })
      .filter(ricosExtension => ricosExtension.extensionType === 'extension')
      .map(ricosExtension => {
        const { nodeViewHOC, nodeTypes } = ricosExtension.addNodeViewHOC();
        return {
          types: nodeTypes,
          nodeViewHOC,
        };
      })
      .flat()
      .filter(({ nodeViewHOC }) => !!nodeViewHOC)
      .reduce((acc, { types, nodeViewHOC }) => {
        types.forEach(type => {
          if (!acc[type]) {
            acc[type] = [];
          }
          acc[type].push(nodeViewHOC);
        });
        return acc;
      }, {});
  }
}
