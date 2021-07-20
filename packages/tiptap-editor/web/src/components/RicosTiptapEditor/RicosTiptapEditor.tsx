import React, { useRef, useEffect } from 'react';
import { RicosTiptapContext } from '../../context';
import { EditorContent, useEditor } from '@tiptap/react';
import { RicosExtensionManager } from '../../ricos-extensions-manager';

export const RicosTiptapEditor = ({ extensions, content, onLoad, ...context }) => {
  const ricosExtensionsManager = useRef(new RicosExtensionManager(extensions));

  const tiptapExtensions = ricosExtensionsManager?.current.tiptapExtensions;
  const editor = useEditor({
    extensions: tiptapExtensions || [],
    content,
  });

  useEffect(() => {
    onLoad(editor);
  }, []);

  return (
    <RicosTiptapContext.Provider
      value={{
        ricosExtensionsManager: ricosExtensionsManager.current.tiptapExtensions,
        context,
      }}
    >
      <div dir="">
        <EditorContent editor={editor} />
      </div>
    </RicosTiptapContext.Provider>
  );
};
