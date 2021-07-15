import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Button, ActionButtons, BUTTON_SIZE } from 'wix-rich-content-ui-components';
import styles from '../../../statics/styles/multi-select-link-panel.scss';
import { mergeStyles } from 'wix-rich-content-common';

class LinkActionsButtons extends PureComponent {
  constructor(props) {
    super(props);
    this.styles = mergeStyles({ styles, theme: props.theme });
  }

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
    const doneButtonClassName = classNames(
      styles.linkPanel_FooterButton,
      isDoneButtonEnable ? styles.linkPanel_enabled : styles.linkPanel_disabled,
      {
        [styles.linkPanel_FooterButton_mobile]: isMobile,
        [styles.multiSelectLinkPanel_Button]: !basicLinkPanel,
      }
    );
    const cancelButtonClassName = classNames(styles.linkPanel_FooterButton, {
      [styles.linkPanel_FooterButton_mobile]: isMobile,
      [styles.multiSelectLinkPanel_Button]: !basicLinkPanel,
    });
    const removeButtonClassName = classNames(styles.linkPanel_FooterButton, {
      [styles.linkPanel_FooterButton_mobile]: isMobile,
      [styles.multiSelectLinkPanel_Button]: !basicLinkPanel,
    });
    return saveBtnOnly ? (
      <Button
        className={styles.linkPanel_saveOnlyBtn}
        type="primary"
        text={doneButtonText}
        onClick={onDone}
      >
        {doneButtonText}
      </Button>
    ) : (
      <div
        className={classNames(styles.linkPanel_Footer, {
          [styles.linkPanel_Footer_mobile]: isMobile,
          [styles.multiSelectLinkPanel_Footer]: !basicLinkPanel,
        })}
      >
        <div className={styles.linkPanel_FooterActions}>
          {isActive && !hideUrlInput && (
            <div className={styles.linkPanel_RemoveContainer}>
              {/* <div
                className={classNames(
                  styles.linkPanel_VerticalDivider,
                  styles.linkPanel_VerticalDividerNarrowMargin,
                  {
                    [styles.linkPanel_VerticalDivider_mobile]: isMobile,
                    [styles.multiSelectLinkPanel_VerticalDivider]: !basicLinkPanel,
                  }
                )}
              /> */}
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
        <div className={styles.actionButtons_wrapper}>
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
