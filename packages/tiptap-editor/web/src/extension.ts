import { ReactNodeViewRenderer, Node, mergeAttributes } from '@tiptap/react';
import { BaseExtensionComponentHOC } from './components/BaseComponent';

export const createNodeExtension = (name, Component, componentDataDefaults) => {
  return Node.create({
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

    addNodeView() {
      // eslint-disable-next-line new-cap
      return ReactNodeViewRenderer(BaseExtensionComponentHOC(Component));
    },
  });
};
