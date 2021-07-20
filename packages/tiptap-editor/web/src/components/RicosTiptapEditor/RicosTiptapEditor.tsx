import React, { useEffect, useState } from 'react';
import { RicosTiptapContext } from '../../context';
import { EditorContent, Editor } from '@tiptap/react';

import { RicosExtensionManager } from '../../ricos-extensions-manager';
import { tiptapExtensions as coreExtensions } from '../../tiptap-extensions';
import { createImageConfig } from '../../extensions/extension-image';
import { createDividerConfig } from '../../extensions/extension-divider';
import { createSpoilerConfig } from '../../extensions/extension-spoiler';
import { createDraftConfig } from '../../extensions/extension-draft';

function useForceUpdate() {
  const [, setValue] = useState(0);

  return () => setValue(value => value + 1);
}
const imageExt = createImageConfig();
const dividerExt = createDividerConfig();
const spoiler = createSpoilerConfig();
const draft = createDraftConfig();

export const RicosTiptapEditor = ({ content, extensions = [], onLoad, ...context }) => {
  const [editor, setEditor] = useState<Editor | null>(null);
  const [nodeViewsHOCs, setNodeViewsHOCs] = useState([]);
  const forceUpdate = useForceUpdate();

  useEffect(() => {
    const tiptapExtensions = RicosExtensionManager.ricosExtensionsTotiptapExtensions([
      ...extensions,
      imageExt,
      dividerExt,
      spoiler,
      draft,
    ]);

    const nodeViewsHOCs = RicosExtensionManager.extractNodeViewsHOCsFromRicosExtensions([
      ...extensions,
      imageExt,
      dividerExt,
      spoiler,
      draft,
    ]);
    console.log({ tiptapExtensions, nodeViewsHOCs });
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
        context: {
          ...context,
          t: key => key,
        },
      }}
    >
      <div dir="">
        <EditorContent editor={editor} />
      </div>
    </RicosTiptapContext.Provider>
  );
};
