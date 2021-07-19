import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Button, ActionButtons, BUTTON_SIZE } from 'wix-rich-content-ui-components';
import styles from '../../../statics/styles/link-action-buttons.scss';
import { mergeStyles } from 'wix-rich-content-common';

class LinkActionsButtons extends PureComponent {
  constructor(props) {
    super(props);
    this.styles = mergeStyles({ styles, theme: props.theme });
  }

  renderMobileTitle = () => {
    const { t } = this.props;
    return (
      <div id="mob_link_modal_hdr" className={styles.actionButtons_mobile_title}>
        {t('MobileLinkModal_Title')}
      </div>
    );
  };

  render() {
    const { styles } = this;
    const {
      isActive,
      t,
      tabIndex,
      isDoneButtonEnable,
      onCancel,
      onDelete,
      onDone,
      basicLinkPanel,
      hideUrlInput,
      isMobile,
      saveBtnOnly,
    } = this.props;
    const doneButtonText = t('LinkPanelContainer_DoneButton');
    const cancelButtonText = t('LinkPanelContainer_CancelButton');
    const removeButtonText = t('LinkPanelContainer_RemoveButton');
    const showRemoveButton = isActive && !hideUrlInput && !isMobile;
    const removeButtonClassName = classNames(styles.actionButtons_FooterButton, {
      [styles.actionButtons_FooterButton_mobile]: isMobile,
    });
    return saveBtnOnly && !isMobile ? (
      <Button
        className={styles.actionButtons_saveOnlyBtn}
        type="primary"
        text={doneButtonText}
        onClick={onDone}
      >
        {doneButtonText}
      </Button>
    ) : (
      <div
        className={classNames(styles.actionButtons_Footer, {
          [styles.actionButtons_Footer_mobile]: isMobile,
          [styles.multiSelectLinkPanel_Footer]: !basicLinkPanel,
        })}
      >
        <div className={styles.actionButtons_FooterActions}>
          {showRemoveButton && (
            <div className={styles.actionButtons_RemoveContainer}>
              <button
                tabIndex={tabIndex}
                aria-label={removeButtonText}
                className={removeButtonClassName}
                data-hook="linkPanelContainerRemove"
                onClick={onDelete}
              >
                {removeButtonText}
              </button>
            </div>
          )}
        </div>
        <div className={isMobile && styles.actionButtons_mobile_title_buttons_wrapper}>
          {isMobile && this.renderMobileTitle()}
          <div
            className={classNames(styles.actionButtons_wrapper, {
              [styles.actionButtons_wrapper_mobile]: isMobile,
            })}
          >
            <ActionButtons
              size={BUTTON_SIZE.tiny}
              isMobile={isMobile}
              onCancel={onCancel}
              onSave={onDone}
              theme={this.theme}
              cancelText={cancelButtonText}
              saveText={doneButtonText}
              disableSave={!isDoneButtonEnable}
            />
          </div>
        </div>
      </div>
    );
  }
}

LinkActionsButtons.propTypes = {
  onDone: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  isActive: PropTypes.bool,
  theme: PropTypes.object.isRequired,
  t: PropTypes.func,
  tabIndex: PropTypes.number,
  isDoneButtonEnable: PropTypes.bool,
  basicLinkPanel: PropTypes.bool,
  hideUrlInput: PropTypes.bool,
  isMobile: PropTypes.bool,
  saveBtnOnly: PropTypes.bool,
};

export default LinkActionsButtons;
