import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  hasLinksInSelection,
  getModalStyles,
  LinkButton,
  EditorModals,
} from 'wix-rich-content-editor-common';
import { LINK_TYPE } from '../types';
import { isEmpty } from 'lodash';

export default class TextLinkButton extends Component {
  showLinkPanel = () => {
    const { getEditorState, setEditorState, getEntityData, insertCustomLink, config } = this.props;
    const settings = config[LINK_TYPE];
    const onLinkAdd = settings?.onLinkAdd;
    const isCustomLinkHandling = onLinkAdd;

    if (isCustomLinkHandling) {
      const customLinkData = getEntityData(getEditorState())?.customData;
      const callback = data => setEditorState(insertCustomLink(getEditorState(), data));
      onLinkAdd(customLinkData, callback);
    } else {
      this.openLinkPanel();
    }
  };

  openLinkPanel = () => {
    const {
      getEditorState,
      setEditorState,
      theme,
      isMobile,
      linkModal,
      helpers,
      keyName,
      anchorTarget,
      relValue,
      t,
      uiSettings,
      insertLinkFn,
      closeInlinePluginToolbar,
      config,
      innerModal,
      toolbarOffsetTop,
      toolbarOffsetLeft,
    } = this.props;
    const settings = config[LINK_TYPE];
    const linkTypes = settings?.linkTypes;

    const OriginalLinkPanel =
      !linkTypes || isEmpty(linkTypes) || !Object.values(linkTypes).find(addon => !!addon);
    const { externalPopups = false } = uiSettings.linkPanel;
    const customStyles =
      !isMobile && !OriginalLinkPanel
        ? {
            content: {
              width: 512,
              maxWidth: 512,
              height: 390,
              border: '1px solid rgb(237, 237, 237)',
              // borderRadius: '6px',
              boxShadow: 'rgba(0, 0, 0, 0.07) 0px 4px 8px 0px',
              padding: '0px 19px',
            },
          }
        : {
            content: {
              position: 'fixed',
            },
          };
    const modalStyles = getModalStyles({
      fullScreen: isMobile,
      isMobile,
      customStyles,
    });
    const commonPanelProps = {
      helpers,
      modalName: EditorModals.TEXT_LINK_MODAL,
      anchorTarget,
      relValue,
      theme,
      t,
      uiSettings,
      getEditorState,
      setEditorState,
      insertLinkFn,
      closeInlinePluginToolbar,
      linkTypes,
    };
    if (externalPopups || isMobile || linkModal) {
      if (helpers && helpers.openModal) {
        const modalProps = {
          modalStyles,
          hidePopup: helpers.closeModal,
          isMobile,
          ...commonPanelProps,
        };
        helpers.openModal(modalProps);
      } else {
        //eslint-disable-next-line no-console
        console.error(
          'Open external helper function is not defined for toolbar button with keyName ' + keyName
        );
      }
    } else {
      const modalProps = {
        hidePopup: innerModal.closeInnerModal,
        top: toolbarOffsetTop,
        left: toolbarOffsetLeft,
        modalStyles: OriginalLinkPanel ? null : { maxWidth: 'none', padding: '0 19px' },
        ...commonPanelProps,
      };
      innerModal.openInnerModal(modalProps);
    }
  };

  get isActive() {
    return hasLinksInSelection(this.props.getEditorState());
  }

  render() {
    const {
      theme,
      helpers,
      isMobile,
      tabIndex,
      config,
      isActive,
      icon,
      tooltipText,
      disabled,
    } = this.props;
    const buttonStyles = {
      button: theme.inlineToolbarButton,
      buttonWrapper: theme.inlineToolbarButton_wrapper,
      icon: theme.inlineToolbarButton_icon,
      active: theme.inlineToolbarButton_active,
    };
    const insertLinkIcon = config?.LINK?.toolbar?.icons?.InsertPluginButtonIcon || icon;
    return (
      <LinkButton
        onClick={this.showLinkPanel}
        isActive={isActive}
        helpers={helpers}
        theme={{ ...theme, ...buttonStyles }}
        isMobile={isMobile}
        tooltipText={tooltipText}
        tabIndex={tabIndex}
        pluginType={LINK_TYPE}
        icon={insertLinkIcon}
        disabled={disabled}
      />
    );
  }
}

TextLinkButton.propTypes = {
  getEditorState: PropTypes.func.isRequired,
  setEditorState: PropTypes.func.isRequired,
  theme: PropTypes.object.isRequired,
  isMobile: PropTypes.bool,
  linkModal: PropTypes.bool,
  helpers: PropTypes.object,
  keyName: PropTypes.string,
  anchorTarget: PropTypes.string,
  relValue: PropTypes.string,
  t: PropTypes.func,
  tabIndex: PropTypes.number,
  uiSettings: PropTypes.object,
  config: PropTypes.object,
  isActive: PropTypes.bool,
  insertLinkFn: PropTypes.func,
  icon: PropTypes.func,
  closeInlinePluginToolbar: PropTypes.func,
  tooltipText: PropTypes.string,
  innerModal: PropTypes.object,
  toolbarOffsetTop: PropTypes.string,
  toolbarOffsetLeft: PropTypes.string,
  getEntityData: PropTypes.func,
  insertCustomLink: PropTypes.func,
  disabled: PropTypes.bool,
};
