import React, { useContext, useState, useEffect } from 'react';
import { EditorPropsContext } from '../../context';
import { NodeViewWrapper } from '@tiptap/react';
import {
  getAlignmentClassName,
  getFocusClassName,
  getPluginContainerClassName,
  getSizeClassName,
  getTextWrapClassName,
} from './styles';
import generalStyles from 'wix-rich-content-editor-common/dist/statics/styles/general.scss';
import generalRTLIgnoredStyles from 'wix-rich-content-common/dist/statics/styles/general.rtlignore.scss';
import { tiptapNodeDataToDraft, toTiptap } from 'ricos-content/libs/tiptap';

const stylesWithRTL = { ...generalStyles, ...generalRTLIgnoredStyles };
const EditorContextConsumer = ({ children }) => {
  const editorContext = useContext(EditorPropsContext);
  return children(editorContext);
};

const getComponentStyles = ({ componentData, theme, isFocused, isMobile }) => {
  const alignment = componentData?.config?.alignment;
  const size = componentData?.config?.size;
  const textWrap = componentData?.config?.textWrap;

  return {
    alignmentClassName: getAlignmentClassName(stylesWithRTL, alignment, theme),
    sizeClassName: getSizeClassName(stylesWithRTL, size, theme),
    focusClassName: getFocusClassName(stylesWithRTL, theme, isFocused),
    textWrapClassName: getTextWrapClassName(stylesWithRTL, theme, textWrap),
    pluginContainerClassName: getPluginContainerClassName(stylesWithRTL, theme, isMobile),
  };
};

const useIsSelected = (editor, getPos) => {
  const [isSelected, setSelected] = useState(false);

  useEffect(() => {
    const onSelectionUpdate = ({ editor }) => {
      const position = getPos();
      if (
        position >= editor.state.selection.$from.pos &&
        position <= editor.state.selection.$to.pos
      ) {
        setSelected(true);
      } else {
        setSelected(false);
      }
    };
    editor.on('selectionUpdate', onSelectionUpdate);

    return () => {
      editor.off('selectionUpdate', onSelectionUpdate);
    };
  }, []);

  return isSelected;
};

const BaseExtensionComponentHOC = Component => {
  return props => {
    return (
      <EditorContextConsumer>
        {context => {
          const componentData = tiptapNodeDataToDraft(
            props.node.type.name.toUpperCase(),
            props.node.attrs
          );
          const { editor, getPos } = props;
          const selected = props.selected;
          const { theme, isMobile } = context;
          const isSelected = useIsSelected(editor, getPos);

          const componentStyles = getComponentStyles({
            componentData: toTiptap(componentData),
            theme,
            isFocused: isSelected || selected,
            isMobile,
          });

          return (
            <NodeViewWrapper as="div">
              <div data-drag-handle className={Object.values(componentStyles).join(' ')}>
                <Component
                  {...props}
                  context={{
                    context,
                    t: key => `Translation is not supported: ${key}`,
                  }}
                  componentData={componentData}
                  updateAttributes={props.updateAttributes}
                />
              </div>
            </NodeViewWrapper>
          );
        }}
      </EditorContextConsumer>
    );
  };
};

export default BaseExtensionComponentHOC;
