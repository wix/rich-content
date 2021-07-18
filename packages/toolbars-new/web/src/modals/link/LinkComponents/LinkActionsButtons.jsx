import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import styles from '../multi-select-link-panel.scss';
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
    return (
      <div
        className={classNames(styles.linkPanel_Footer, {
          [styles.linkPanel_Footer_mobile]: isMobile,
          [styles.multiSelectLinkPanel_Footer]: !basicLinkPanel,
        })}
      >
        <div className={styles.linkPanel_FooterActions}>
          <button
            tabIndex={tabIndex}
            aria-label={cancelButtonText}
            className={cancelButtonClassName}
            data-hook="linkPanelContainerCancel"
            onClick={onCancel}
          >
            {cancelButtonText}
          </button>
          {isActive && !hideUrlInput && (
            <div className={styles.linkPanel_RemoveContainer}>
              <div
                className={classNames(
                  styles.linkPanel_VerticalDivider,
                  styles.linkPanel_VerticalDividerNarrowMargin,
                  {
                    [styles.linkPanel_VerticalDivider_mobile]: isMobile,
                    [styles.multiSelectLinkPanel_VerticalDivider]: !basicLinkPanel,
                  }
                )}
              />
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
        <button
          tabIndex={tabIndex}
          aria-label={doneButtonText}
          className={doneButtonClassName}
          data-hook="linkPanelContainerDone"
          onClick={onDone}
          disabled={!isDoneButtonEnable}
        >
          {doneButtonText}
        </button>
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
};

export default LinkActionsButtons;
