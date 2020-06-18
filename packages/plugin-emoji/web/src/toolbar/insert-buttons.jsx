import { DesktopFlyOutModalStyles } from '../constants';
import {
  TOOLBARS,
  decorateComponentWithProps,
  getBottomToolbarModalStyles,
} from 'wix-rich-content-editor-common';
import EmojiPreviewModal from './emojiPreviewModal';
import EmojiPluginIcon from '../icons/EmojiPluginIcon.svg';

export default ({ helpers, t, settings, getEditorState, setEditorState }) => {
  const icon = settings?.toolbar?.icons?.InsertPluginButtonIcon || EmojiPluginIcon;
  return [
    {
      type: 'modal',
      name: 'EmojiPlugin_InsertButton',
      tooltipText: t('EmojiPlugin_InsertButton_Tooltip'),
      Icon: icon,
      componentData: settings.componentDataDefaults || {},
      toolbars: settings.insertToolbars || [TOOLBARS.FOOTER, TOOLBARS.SIDE],
      modalElement: decorateComponentWithProps(EmojiPreviewModal, {
        getEditorState,
        setEditorState,
        ...settings,
      }),
      modalStylesFn: ({ buttonRef }) => {
        return getBottomToolbarModalStyles(buttonRef, {
          customStyles: DesktopFlyOutModalStyles,
        });
      },
      helpers,
    },
  ];
};
