import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { isEqual } from 'lodash';
import { Scrollbars } from 'react-custom-scrollbars';
import {
  SettingsPanelFooter,
  Tabs,
  Tab,
  FocusManager,
  BUTTON_SIZE,
} from 'wix-rich-content-ui-components';
import { KEYS_CHARCODE } from 'wix-rich-content-editor-common';
import {
  mergeStyles,
  isNewTab,
  ADD_PLUGIN_LINK_BI,
  WEB_ADDRESS_CATEGORY,
} from 'wix-rich-content-common';
import DesignComponent from '../components/design-component';
import SettingsComponent from '../components/settings-component';
import Navbar from '../components/navbar';
import PreviewComponent from '../components/preview-component';
import { settingsTabValue, designTabValue } from '../constants';
import styles from '../../statics/styles/button-input-modal.scss';
import { LINK_BUTTON_TYPE } from '../types';
export default class ButtonInputModal extends Component {
  constructor(props) {
    super(props);
    this.styles = mergeStyles({ styles, theme: props.theme });
    const {
      componentData: { button },
    } = this.props;

    this.state = {
      settings: { ...button.settings },
      design: { ...button.design },
      initialComponentData: { ...button },
      isHover: false,
      activeTab: settingsTabValue,
      showLinkPanel: !this.props.settings.isActionButton,
    };

    this.setScrollbarRef = element => {
      this.scrollbarRef = element;
    };
  }

  onSettingsChanged = settings => {
    const { design } = this.state;
    if (!isEqual(settings, this.state.settings)) {
      const {
        pubsub,
        componentData: { button },
      } = this.props;
      pubsub.update('componentData', { button: { ...button, settings, design } });
      this.setState({ settings });
    }
  };

  onDesignChanged = design => {
    const { settings } = this.state;
    if (this.state.activeTab !== designTabValue) {
      this.setState({ activeTab: designTabValue });
    }
    if (!isEqual(design, this.state.design)) {
      const {
        pubsub,
        componentData: { button },
      } = this.props;
      pubsub.update('componentData', { button: { ...button, design, settings } });
      this.setState({ design });
    }
  };

  triggerLinkBi = () => {
    const {
      settings: { rel, target, url },
    } = this.state;
    this.props.helpers?.onPluginAction?.(ADD_PLUGIN_LINK_BI, {
      plugin_id: LINK_BUTTON_TYPE,
      params: {
        link: url,
        newTab: isNewTab(target),
        category: WEB_ADDRESS_CATEGORY,
        rel,
      },
    });
  };

  onConfirm = () => {
    const {
      helpers: { closeModal },
    } = this.props;
    const { initialComponentData, design } = this.state;
    if (!initialComponentData.design.color && this.currentColorEqualToConfig()) {
      this.removeColorsFromComponentData(design);
    }
    this.setState({ submitted: true, isOpen: false });
    this.triggerLinkBi();
    closeModal();
  };

  currentColorEqualToConfig = () => {
    const { design } = this.state;
    const {
      settings: { colors },
    } = this.props;
    return (
      (design.color === colors?.color1 || design.color === '#FEFDFD') &&
      (design.borderColor === colors?.color8 || design.borderColor === '#0261FF') &&
      (design.background === colors?.color8 || design.background === '#0261FF')
    );
  };

  handleKeyPress = e => {
    if (e.charCode === KEYS_CHARCODE.ENTER) {
      this.onConfirm();
    }
    if (e.charCode === KEYS_CHARCODE.ESCAPE) {
      this.onCloseRequested();
    }
  };

  onCloseRequested = () => {
    const {
      componentData,
      pubsub,
      onCloseRequested,
      helpers: { closeModal },
    } = this.props;
    const { initialComponentData } = this.state;
    if (!initialComponentData.design.color) {
      this.removeColorsFromComponentData(initialComponentData.design);
    }
    if (onCloseRequested) {
      onCloseRequested({ ...componentData, button: initialComponentData });
    } else {
      pubsub.update('componentData', { button: initialComponentData });
    }

    this.setState({ isOpen: false });
    closeModal();
  };

  removeColorsFromComponentData = design => {
    const { pubsub } = this.props;
    const designToSave = {
      borderWidth: design.borderWidth,
      padding: design.padding,
      borderRadius: design.borderRadius,
      activeButton: design.activeButton,
    };
    const componentDataToSave = pubsub.get('componentData');
    componentDataToSave.button.design = designToSave;
    pubsub.set('componentData', componentDataToSave);
  };

  handleOnMouseEnterDesign = () => {
    this.setState({ isHover: true, activeTab: designTabValue });
  };

  handleOnMouseLeaveDesign = () => {
    this.setState({ isHover: false });
  };

  handleOnMouseEnterSettings = () => {
    this.setState({ activeTab: settingsTabValue });
  };

  render() {
    const { theme, t, uiSettings, doneLabel, cancelLabel, isMobile } = this.props;
    const { showLinkPanel } = this.state;
    const { styles } = this;
    const settingTabLabel = (
      <div className={styles.button_inputModal_settingTab}>
        <div className={styles.button_inputModal_tabTitle}>
          <p className={styles.button_inputModal_tabLabel}>{t('ButtonModal_Settings_Tab')}</p>
        </div>
      </div>
    );
    const designTabLabel = (
      <p className={styles.button_inputModal_tabLabel}>{t('ButtonModal_Design_Tab')}</p>
    );
    const settingsComponent = (
      <SettingsComponent
        t={t}
        theme={theme}
        uiSettings={uiSettings}
        {...this.props}
        onSettingsChange={this.onSettingsChanged.bind(this)}
        settingsObj={this.state.settings}
        onKeyPress={this.handleKeyPress}
        showLinkPanel={showLinkPanel}
      />
    );
    const designComponent = (
      <DesignComponent
        {...this.props}
        theme={theme}
        t={t}
        styles={styles}
        onDesignChange={this.onDesignChanged.bind(this)}
        designObj={this.state.design}
        onKeyPress={this.handleKeyPress}
      />
    );
    let mobileView = null;
    if (isMobile) {
      mobileView = (
        <div>
          <Navbar onConfirm={this.onConfirm} onCancel={this.onCloseRequested} {...this.props} />
          <PreviewComponent buttonObj={this.state} {...this.props} />
          <div className={styles.button_inputModal_scroll} ref={this.setScrollbarRef}>
            <div className={styles.button_inputModal_container} data-hook="ButtonInputModal">
              <div className={styles.button_inputModal_header_text}>
                {t('ButtonModal_Settings_Tab')}
              </div>
              {settingsComponent}
            </div>
            <div className={styles.button_inputModal_separator} />
            <div
              className={styles.button_inputModal_design_component_container}
              data-hook="ButtonInputModal"
            >
              <div className={styles.button_inputModal_design_header_text}>
                {t('ButtonModal_Design_Tab')}
              </div>
              {designComponent}
            </div>
          </div>
        </div>
      );
    }
    return (
      <div>
        {isMobile ? (
          mobileView
        ) : (
          <div className={styles.button_inputModal_container} data-hook="ButtonInputModal">
            <div>
              <div
                role="heading"
                aria-level={2}
                aria-labelledby="button_modal_hdr"
                className={styles.button_inputModal_header}
              >
                <div className={styles.button_inputModal_header_text}>
                  {t('ButtonModal_Header')}
                </div>
              </div>
              <FocusManager>
                <div className={styles.button_inputModal_focus_manager}>
                  <Tabs value={this.state.activeTab} theme={this.styles}>
                    <Tab label={settingTabLabel} value={settingsTabValue} theme={this.styles}>
                      <div
                        role="button"
                        tabIndex="0"
                        onMouseEnter={this.handleOnMouseEnterSettings}
                      >
                        {settingsComponent}
                      </div>
                    </Tab>
                    <Tab label={designTabLabel} value={designTabValue} theme={this.styles}>
                      <Scrollbars
                        ref={this.setScrollbarRef}
                        renderThumbVertical={() =>
                          this.state.isHover ? (
                            <div className={styles.button_inputModal_scrollbar_thumb} />
                          ) : (
                            <div />
                          )
                        }
                        className={styles.button_inputModal_customize_scrollbar_container}
                        onMouseEnter={this.handleOnMouseEnterDesign}
                        onMouseLeave={this.handleOnMouseLeaveDesign}
                      >
                        {designComponent}
                      </Scrollbars>
                    </Tab>
                  </Tabs>
                </div>
              </FocusManager>
            </div>
            <SettingsPanelFooter
              className={styles.button_inputModal_modal_footer}
              save={() => this.onConfirm()}
              cancel={() => this.onCloseRequested()}
              saveLabel={doneLabel}
              cancelLabel={cancelLabel}
              theme={styles}
              t={t}
              buttonSize={BUTTON_SIZE.small}
            />
          </div>
        )}
      </div>
    );
  }
}

ButtonInputModal.propTypes = {
  componentData: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
  t: PropTypes.func,
  style: PropTypes.object,
  buttonObj: PropTypes.object,
  anchorTarget: PropTypes.string.isRequired,
  relValue: PropTypes.string.isRequired,
  settings: PropTypes.object.isRequired,
  blockProps: PropTypes.object,
  pubsub: PropTypes.object,
  onConfirm: PropTypes.func,
  onCloseRequested: PropTypes.func,
  doneLabel: PropTypes.string,
  cancelLabel: PropTypes.string,
  uiSettings: PropTypes.object,
  helpers: PropTypes.object,
  isMobile: PropTypes.bool,
};

ButtonInputModal.defaultProps = {
  doneLabel: 'Save',
  cancelLabel: 'Cancel',
};
