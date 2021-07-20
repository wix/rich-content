import { Command, Node, mergeAttributes } from '@tiptap/core';
import { ParagraphData } from 'ricos-schema';

export interface ParagraphOptions {
  HTMLAttributes: Record<string, unknown>;
}

interface Commands {
  paragraph: {
    /**
     * Toggle a paragraph
     */
    setParagraph: () => Command;
  };
}

export const Paragraph = Node.create<ParagraphOptions>({
  name: 'paragraph',

  priority: 1000, //default paragraph is 1000

  defaultOptions: {
    HTMLAttributes: {},
  },

  group: 'block',

  content: 'inline*',

  addAttributes() {
    const attrs: ParagraphData = ParagraphData.fromJSON({});
    return attrs;
  },

  parseHTML() {
    return [{ tag: 'div' }];
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes), 0];
  },
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //@ts-ignore-next-line
  addCommands() {
    return {
      setParagraph: () => ({ commands }) => {
        return commands.toggleNode('paragraph', 'paragraph');
      },
    };
  },

  addKeyboardShortcuts() {
    return {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore-next-line
      'Mod-Alt-0': () => this.editor.commands.setParagraph(),
    };
  },
});
