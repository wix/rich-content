import React, { useContext, useEffect } from 'react';
import { EditorPropsContext } from './context';
import { ImageData } from 'ricos-schema';
import {
  ReactNodeViewRenderer,
  useEditor,
  EditorContent,
  NodeConfig,
  ExtensionConfig,
} from '@tiptap/react';
import { omit } from 'lodash';

const pipe = (...fns) => x => fns.reduce((v, f) => f(v), x);

interface RicosNodeHocProps {
  node: unknown; // tiptap node
  ricosStyles: unknown; // styles css
  theme: string;
  getPos: () => unknown;
  children: React.ReactNode;
  isMobile: boolean;
}

const AnchorHOC = Component => {
  return (props: RicosNodeHocProps) => {
    <a href="http://www.walla.co.il">
      <Component {...props} />
    </a>;
  };
};

const StylesHOC = Component => {
  return (props: RicosNodeHocProps) => {
    <div style={{ border: 'solid 5px red' }}>
      <Component {...props} />
    </div>;
  };
};

class RicosExtensionManager {
  constructor(private ricosExtensions) {
    this.ricosExtensions = ricosExtensions;
  }

  get tiptapExtensions() {
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
// export const createRicosNodeComponent = (nodeType, Component) => {
//   const editorContext = useContext(EditorPropsContext);
//   const nodeHocs = editorContext.extensionsManager.getAllNodeHocsbyNodeType(nodeType);
//   const FinalComponent = pipe.apply(this, nodeHocs)(Component);
//   return FinalComponent;
// };

const ImageComponent = () => {
  return <div>I am Image</div>;
};

const RicosNode = ({ render, component }) => {
  const editorContext = useContext(EditorPropsContext) || {};
  const ComponentWithNodeHOCs = pipe(editorContext.nodeViewsHOCs)(component);

  return render({
    ...editorContext,
    ComponentWithNodeHOCs,
  });
};

interface RicosExtensionConfig extends ExtensionConfig {
  addNodeViewHOC: () => React.FC;
}

const createRicosNodeConfig = (Component, tiptapExtensionConfig): NodeConfig => {
  return {
    addNodeView: () => {
      // eslint-disable-next-line new-cap
      return ReactNodeViewRenderer(
        <RicosNode
          component={Component}
          render={(ComponentWithNodeHOCs, ...rest) => {
            return <ComponentWithNodeHOCs {...rest} />;
          }}
        />
      );
    },
    ...tiptapExtensionConfig,
    extensionType: 'node',
  };
};

export const createNodeConfig = () => {
  return ({ ReactNodeViewRenderer, mergeAttributes }) => {
    const RicosImageComponent = ImageComponent;
    const imageAttrs = ImageData.fromJSON({});

    createRicosNodeConfig(RicosImageComponent, {
      name: 'image',

      group: 'block',

      atom: true,
      selectable: true,
      draggable: true,

      addAttributes() {
        return imageAttrs;
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
    });
  };
};

<RicosTiptapEditor
    onLoad={editor => createTiptapAdapter(editor)}
    content={content}
    extensions={ricosExtensions}
    onUpdate={() => null}
  />;

const ricosExtensionsToTiptapExtension = ricosExtension => {
  return ricosExtension.map(ricosExtension => {
    return omit(ricosExtension, 'addNodeViewHOC');
  });
};

const RicosTiptapEditor = ({ extensions, content, onLoad, ...rest }) => {
  const editor = useEditor({
    extensions: ricosExtensionsToTiptapExtension(extensions),
    content,
  });

  const ricosExtensionsManager = useRef(new RicosExtensionManager(extensions));
  useEffect(() => {
    onLoad(editor);
  }, []);
  return (
    <RicosTiptapProvider
      value={{
        ricosExtensionsManager: ricosExtensionsManager.current,
      }}
    >
      <div dir="">
        <EditorContent editor={editor} />
      </div>
    </RicosTiptapProvider>
  );
};

// export const createImageNodeConfig = () => {
//   return ({ReactNodeViewRenderer}) => createRicosNodeConfig(RicosComponent(ImageComponent, 'image'), {
//     name: 'image',
//     group: 'block',
//     atom: true,
//     selectable: true,
//     draggable: true,
//     addAttributes() {
//       return componentDataDefaults;
//     },
//     // parseHTML() {
//     //   return [
//     //     {
//     //       tag: `${name}-component`,
//     //     },
//     //   ];
//     // },
//     // renderHTML({ HTMLAttributes }) {
//     //   return [`${name}-component`, mergeAttributes(HTMLAttributes)];
//     // },
//   });
// };
