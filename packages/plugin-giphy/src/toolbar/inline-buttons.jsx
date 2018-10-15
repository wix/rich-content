import { BUTTONS, getModalStyles, WixUtils } from 'wix-rich-content-common';
import { Modals } from '../modals';
import { MediaReplaceIcon } from '../icons';

const mobileFullScreenCustomStyle = {
  overlay: {
    backgroundColor: 'transparent'
  },
  content: {
    top: 0,
    left: 0,
    overflow: 'hidden',
    paddingRight: '6px'
  }
};

export default ({ t }) => {
  return [
    { keyName: 'sizeOriginal', type: BUTTONS.SIZE_ORIGINAL, mobile: false },
    { keyName: 'sizeSmallCenter', type: BUTTONS.SIZE_SMALL_CENTER, mobile: false },
    { keyName: 'sizeContent', type: BUTTONS.SIZE_CONTENT, mobile: false },
    { keyName: 'sizeFullWidth', type: BUTTONS.SIZE_FULL_WIDTH, mobile: false },
    { keyName: 'separator1', type: BUTTONS.SEPARATOR, mobile: false },
    { keyName: 'sizeSmallLeft', type: BUTTONS.SIZE_SMALL_LEFT, mobile: false },
    { keyName: 'sizeSimallRight', type: BUTTONS.SIZE_SMALL_RIGHT, mobile: false },
    { keyName: 'separator2', type: BUTTONS.SEPARATOR, mobile: false },
    {
      keyName: 'replace',
      type: BUTTONS.EXTERNAL_MODAL,
      icon: MediaReplaceIcon,
      modalName: Modals.GIPHY_API_INPUT,
      modalStyles: WixUtils.isMobile() ?
        getModalStyles({ customStyles: mobileFullScreenCustomStyle, fullScreen: true }) : getModalStyles({ isFlyOutModal: true }),
      style: WixUtils.isMobile() ?
        getModalStyles({ customStyles: mobileFullScreenCustomStyle, fullScreen: true }) : getModalStyles({ isFlyOutModal: true }),
      mobile: true,
      tooltipTextKey: 'ReplaceGiphyButton_Tooltip',
      isFlyOutModal: true,
      t,
    },
    { keyName: 'delete', type: BUTTONS.DELETE, mobile: true },
  ];
};
