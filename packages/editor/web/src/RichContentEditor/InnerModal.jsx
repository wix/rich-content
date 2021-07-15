import React, { Component } from 'react';
import PropTypes from 'prop-types';
import RichContentEditorModal from './RichContentEditorModal';
import ClickOutside from 'react-click-outsider';
import { getLangDir } from 'wix-rich-content-common';

class InnerModal extends Component {
  setInnerModalRef = ref => (this.innerModalRef = ref);

  getVerticalPosition = top => {
    const { editorWrapper } = this.props;
    const editorRect = editorWrapper.getBoundingClientRect();
    const modalHeight = this.innerModalRef.clientHeight;
    const editorHeight = editorRect.height;
    const topAsNumber = parseInt(top, 10);
    if (topAsNumber + modalHeight > editorHeight) {
      return { top: 'auto', bottom: '0' };
    } else {
      return { top, bottom: 'auto' };
    }
  };

  render() {
    const { theme, locale, innerModal, closeInnerModal } = this.props;
    const { top, left } = innerModal?.modalProps || {};
    const { top: topAfterOverflowCheck, bottom: bottomAfterOverflowCheck } =
      (this.innerModalRef && this.getVerticalPosition(top)) || {};
    const dir = getLangDir(locale);
    const modalStyleDefaults = {
      position: 'absolute',
      top: topAfterOverflowCheck || top,
      left: dir === 'ltr' ? left : 'auto',
      right: dir === 'rtl' ? left : 'auto',
      bottom: bottomAfterOverflowCheck || 'auto',
      border: 'solid 1px #ededed',
      background: 'rgb(255, 255, 255)',
      borderRadius: '0',
      maxWidth: '420px',
      zIndex: 6,
      transform: 'none',
      marginLeft: 'auto',
      marginRight: 'auto',
      boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.07)',
    };
    const innerModalStyles = {
      ...modalStyleDefaults,
      ...innerModal?.modalStyles,
    };
    return innerModal ? (
      <ClickOutside onClickOutside={closeInnerModal}>
        <div
          ref={this.setInnerModalRef}
          style={{
            ...innerModalStyles,
          }}
          className={theme.innerModalTheme}
        >
          <RichContentEditorModal
            modalsMap={undefined}
            locale={locale}
            {...innerModal?.modalProps}
          />
        </div>
      </ClickOutside>
    ) : null;
  }
}

InnerModal.propTypes = {
  theme: PropTypes.object,
  locale: PropTypes.string.isRequired,
  innerModal: PropTypes.object,
  closeInnerModal: PropTypes.func,
  editorWrapper: PropTypes.any,
};

export default InnerModal;
