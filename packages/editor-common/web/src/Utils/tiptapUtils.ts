import { NodeConfig } from '@tiptap/core';
import { CreateTiptapExtension } from 'wix-rich-content-common';

type CreateNodeExtension = (
  name: string,
  Component: React.ComponentType,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  componentDataDefaults: Record<string, any>
) => CreateTiptapExtension<NodeConfig>;

export const createNodeExtension: CreateNodeExtension = (
  name,
  Component,
  componentDataDefaults
) => ({ mergeAttributes, ReactNodeViewRenderer, BaseExtensionComponentHOC }) => ({
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
