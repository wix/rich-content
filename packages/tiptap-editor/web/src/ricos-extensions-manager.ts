import { RicosExtensionConfig } from './../dist/src/types.d';
import { omit } from 'lodash';
import { Extensions, Node, AnyExtension } from '@tiptap/core';

export class RicosExtensionManager {
  static ricosExtensionsTotiptapExtensions(ricosExtensions): AnyExtension[] {
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
      .map(ricosExtension => omit(ricosExtension, 'addNodeViewHOC', 'extensionType'))
      .map(extensionConfig => {
        console.log({ extensionConfig });
        return Node.create(extensionConfig);
      });
  }

  static extractNodeViewsHOCs(ricosExtensions) {
    return ricosExtensions
      .map(ricosExtension => {
        return ricosExtension.addNodeViewHOC();
      })
      .flat()
      .filter(addNodeViewHOC => !!addNodeViewHOC);
  }
}
