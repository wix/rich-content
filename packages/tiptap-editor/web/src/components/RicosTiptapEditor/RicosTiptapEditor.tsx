import React, { useEffect, useState } from 'react';
import { RicosTiptapContext } from '../../context';
import { EditorContent, Editor } from '@tiptap/react';

import { RicosExtensionManager } from '../../ricos-extensions-manager';
import { tiptapExtensions as coreExtensions } from '../../tiptap-extensions';
import { createImageConfig } from '../../extensions/extension-image';

function useForceUpdate() {
  const [, setValue] = useState(0);

  return () => setValue(value => value + 1);
}
const imageExt = createImageConfig();

export const RicosTiptapEditor = ({ content, extensions = [], onLoad, ...context }) => {
  const [editor, setEditor] = useState<Editor | null>(null);
  const [nodeViewsHOCs, setNodeViewsHOCs] = useState([]);
  const forceUpdate = useForceUpdate();

  useEffect(() => {
    const tiptapExtensions = RicosExtensionManager.ricosExtensionsTotiptapExtensions([
      ...extensions,
      imageExt,
    ]);

    const nodeViewsHOCs = RicosExtensionManager.extractNodeViewsHOCs(extensions);
    setNodeViewsHOCs(nodeViewsHOCs);

    const editorInstance = new Editor({
      extensions: [...coreExtensions, ...tiptapExtensions],
      content,
      injectCSS: true,
    });

    setEditor(editorInstance);

    editorInstance.on('transaction', forceUpdate);

    onLoad(editorInstance);

    return () => {
      editorInstance.destroy();
    };
  }, []);

  return (
    <RicosTiptapContext.Provider
      value={{
        nodeViewsHOCs,
        context,
      }}
    >
      <div dir="">
        <EditorContent editor={editor} />
      </div>
    </RicosTiptapContext.Provider>
  );
};
