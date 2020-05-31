import { DEFAULTS, MobileFullScreenCustomStyle, DesktopFlyOutModalStyles } from '../constants';
import {
  getModalStyles,
  TOOLBARS,
  BUTTON_TYPES,
  DECORATION_MODE,
  decorateComponentWithProps,
  getBottomToolbarModalStyles,
} from 'wix-rich-content-editor-common';
import GiphyApiInputModal from './giphyApiInputModal';
import { InsertPluginIcon, InsertPluginMobileIcon } from '../icons';
import Arrow from './arrow';

export default ({ helpers, t, settings, isMobile }) => {
  const icon =
    settings?.toolbar?.icons?.InsertPluginButtonIcon ||
    (isMobile ? InsertPluginMobileIcon : InsertPluginIcon);
  const modalStyles = isMobile
    ? getModalStyles({ customStyles: MobileFullScreenCustomStyle, fullScreen: true, isMobile })
    : null;
  return [
    {
      type: BUTTON_TYPES.MODAL,
      name: 'GIFPlugin_InsertButton',
      tooltip: t('GiphyPlugin_InsertButton_Tooltip'),
      getIcon: () => icon,
      componentData: settings.componentDataDefaults || DEFAULTS,
      toolbars: settings.insertToolbars || [TOOLBARS.FOOTER],
      modalElement: decorateComponentWithProps(GiphyApiInputModal, settings),
      modalStyles,
      modalStylesFn: ({ buttonRef }) => {
        return getBottomToolbarModalStyles(buttonRef, {
          customStyles: DesktopFlyOutModalStyles,
          isMobile,
        });
      },
      modalDecorations: [
        {
          decorationMode: DECORATION_MODE.APPEND,
          decorator: Arrow,
        },
      ],
      helpers,
    },
  ];
};
