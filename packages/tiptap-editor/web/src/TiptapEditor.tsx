import React from 'react';
import { EditorPropsContext } from './context';
import Toolbar from './components/Toolbar';
import { JSONContent } from '@tiptap/core';
import { Editor, EditorContent } from '@tiptap/react';
import { draftToTiptap, tiptapToDraft, draftBlockDataToTiptap } from 'ricos-content/libs/tiptap';
import { tiptapExtensions } from './tiptap-extensions';
import { capitalize } from 'lodash';
import { TiptapAPI, TiptapConfig } from './types';
import { RICOS_DIVIDER_TYPE, DIVIDER_TYPE } from 'wix-rich-content-common';

const getEditorCreator = ({ onUpdate }) => (content: JSONContent) => {
  return new Editor({
    content,
    extensions: tiptapExtensions,
    injectCSS: true,
    onUpdate: ({ editor }) => {
      const newContent = editor.getJSON();
      const convertedContent = tiptapToDraft(newContent as JSONContent);
      onUpdate?.({ content: convertedContent });
    },
  });
};

// missing forceUpdate
//github.com/ueberdosis/tiptap/blob/main/packages/react/src/useEditor.ts#L20
const toTiptapAPI = (editor: Editor): TiptapAPI => ({
  Editor: props => (
    <EditorPropsContext.Provider value={props}>
      <div dir="">
        <EditorContent editor={editor} />
      </div>
    </EditorPropsContext.Provider>
  ),
  blur: () => editor.commands.blur(),
  focus: () => editor.commands.focus(true),
  getEditorCommands: () => {
    return {
      ...editor.commands,
      toggleInlineStyle: inlineStyle => {
        const editorCommand = editor.chain().focus();
        const styleName = `toggle${capitalize(inlineStyle)}`;
        editorCommand[styleName]().run();
      },
      insertBlock: (pluginType, data) => {
        if (pluginType === RICOS_DIVIDER_TYPE || pluginType === DIVIDER_TYPE) {
          const attrs = draftBlockDataToTiptap(DIVIDER_TYPE, data);
          editor.commands.insertContent({
            type: DIVIDER_TYPE.toLowerCase(),
            attrs,
            content: [],
          });
        }
      },
      // setBlock: (blockKey, pluginType, data) => {
      //   editor.commands.updateAttributes('heading', { level: 1 })
      // },
    };
  },
  getToolbars: () => ({
    MobileToolbar: () => <Toolbar editor={editor} />,
    TextToolbar: () => <Toolbar editor={editor} />,
  }),
  getToolbarProps: () => ({}),
  destroy: editor.destroy.bind(editor),
});

export const initTiptapEditor = ({ initialContent, onUpdate }: TiptapConfig): TiptapAPI => {
  const tiptapData = draftToTiptap(initialContent);
  const editorCreator = getEditorCreator({ onUpdate });
  const editor = editorCreator(tiptapData);

  return toTiptapAPI(editor);
};
