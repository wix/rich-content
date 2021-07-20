import { omit } from 'lodash';
import { Extension } from '@tiptap/core';

export class RicosExtensionManager {
  constructor(private ricosExtensions) {
    this.ricosExtensions = ricosExtensions;
  }

  get tiptapExtensions(): Extension[] {
    return this.ricosExtensions.map(ricosExtension => {
      return omit(ricosExtension, 'addNodeViewHOC');
    });
  }

  get nodeViewHOCs() {
    return this.ricosExtensions
      .map(ricosExtension => {
        return ricosExtension.addNodeViewHOC;
      })
      .filter(addNodeViewHOC => !!addNodeViewHOC);
  }
}
