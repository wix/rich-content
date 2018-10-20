import { DEFAULTS, MobileFullScreenCustomStyle, DesktopFlyOutModalStyles } from '../constants';
import { getModalStyles, TOOLBARS, WixUtils, DECORATION_MODE } from 'wix-rich-content-common';
import GiphyApiInputModal from './giphyApiInputModal';
import { InsertPluginIcon, InsertPluginMobileIcon } from '../icons';
import Arrow from './arrow';

export default ({ helpers, t }) => {
  return [
    {
      type: 'modal',
      name: 'GIF',
      tooltipText: t('GiphyPlugin_InsertButton_Tooltip'),
      Icon: WixUtils.isMobile() ? InsertPluginMobileIcon : InsertPluginIcon,
      componentData: DEFAULTS,
      toolbars: [TOOLBARS.FOOTER],
      modalElement: GiphyApiInputModal,
      modalStyles: WixUtils.isMobile() ?
        getModalStyles({ customStyles: MobileFullScreenCustomStyle, fullScreen: true }) : null,
      modalStylesFn: ({ buttonRef }) => {
        const modalStyles = getModalStyles({ customStyles: DesktopFlyOutModalStyles, fullScreen: true });
        const { top, left } = buttonRef.getBoundingClientRect();
        const modalLeft = left - 15;
        const modalTop = top - 365;
        return { ...modalStyles, content: { ...modalStyles.content, top: modalTop, left: modalLeft, margin: 0, position: 'absolute' } };
      },
      modalDecorations: [{
        decorationMode: DECORATION_MODE.APPEND,
        decorator: Arrow
      }],
      helpers
    }
  ];
};
