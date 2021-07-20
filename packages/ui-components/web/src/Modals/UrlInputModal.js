import PropTypes from 'prop-types';
import React, { Component } from 'react';
import classNames from 'classnames';
import { mergeStyles } from 'wix-rich-content-common';
import SettingsMobileHeader from './SettingsMobileHeader';
import { CloseIcon } from '../Icons';
import TextInput from '../Components/TextInput';
import SettingsPanelFooter from '../Components/SettingsPanelFooter';
import { FOOTER_BUTTON_ALIGNMENT, MODAL_CONTROLS_POSITION, KEYS_CHARCODE } from '../consts';
import styles from '../../statics/styles/url-input-modal.scss';

export default class UrlInputModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isDropdownOpen: false,
    };
    const { theme = {}, buttonAlignment } = props;
    this.styles = mergeStyles({ styles, theme });
    const endAlignmentStyles =
      buttonAlignment === FOOTER_BUTTON_ALIGNMENT.END && this.styles.endAlignment;
    const getClassNames = st => classNames(st, endAlignmentStyles);
    this.classes = {
      container: getClassNames(styles.urlInput_container),
      headerText: getClassNames(styles.urlInput_header_text),
      closeBtn: getClassNames(styles.urlInput_closeIcon),
      header: getClassNames(styles.urlInput_header),
      input: getClassNames(styles.urlInputModal_textInput),
      topControls: getClassNames(styles.urlInputModal_topControls),
    };
  }

  onUrlChange = url => {
    this.props.onInputChange(url);
  };

  handleKeyPress = event => {
    if (event.charCode === KEYS_CHARCODE.ENTER) {
      this.props.onConfirm();
    }
    if (event.charCode === KEYS_CHARCODE.ESCAPE) {
      this.props.onCloseRequested();
    }
  };

  componentDidMount() {
    this.input.focus();
    this.input.setSelectionRange(0, this.input.value.length);
  }

  render() {
    const {
      t,
      languageDir,
      onConfirm,
      input = '',
      submittedInvalidUrl = false,
      dataHook,
      title,
      errorMessage,
      placeholder,
      onCloseRequested,
      children,
      theme,
      buttonAlignment = FOOTER_BUTTON_ALIGNMENT.CENTER,
      controlsPosition = MODAL_CONTROLS_POSITION.BOTTOM,
      selected = true,
      textInput = true,
      buttonSize,
    } = this.props;
    const topControls = controlsPosition === MODAL_CONTROLS_POSITION.TOP;
    const { styles, classes } = this;
    return (
      <div
        className={classNames(classes.container, { [classes.topControls]: topControls })}
        data-hook={dataHook}
        dir={languageDir}
      >
        {topControls && (
          <SettingsMobileHeader
            theme={theme}
            save={() => onConfirm()}
            cancelLabel="Cancel"
            saveLabel="Save"
            cancel={() => onCloseRequested()}
            dataHookPrefix={'UrlInputModalHeader'}
          />
        )}

        {!topControls && <CloseIcon className={classes.closeBtn} onClick={onCloseRequested} />}
        <div className={classes.header}>
          <div className={classes.headerText}>{title}</div>
        </div>
        <div className={classes.input}>
          {textInput && (
            <TextInput
              onClick={() => this.setState({ isDropdownOpen: true })}
              inputRef={ref => {
                this.input = ref;
              }}
              type="url"
              id="dropdown-text-input"
              onKeyPress={this.handleKeyPress}
              onChange={this.onUrlChange}
              value={input}
              error={submittedInvalidUrl && errorMessage}
              placeholder={placeholder}
              theme={styles}
              data-hook={`${dataHook}Input`}
              autoComplete="off"
              searchIcon={textInput?.searchIcon}
            />
          )}
          {children}
        </div>
        {!topControls && (
          <SettingsPanelFooter
            className={styles.urlInput_modal_footer}
            save={() => onConfirm()}
            cancel={onCloseRequested}
            saveLabel={t('EmbedURL_Common_CTA_Primary')}
            cancelLabel={t('EmbedURL_Common_CTA_Secondary')}
            theme={theme}
            layoutOptions={{ isModal: true, buttonAlignment }}
            t={t}
            selected={selected}
            buttonSize={buttonSize}
          />
        )}
      </div>
    );
  }
}

UrlInputModal.propTypes = {
  onConfirm: PropTypes.func,
  input: PropTypes.string,
  t: PropTypes.func,
  languageDir: PropTypes.string,
  submittedInvalidUrl: PropTypes.bool,
  dataHook: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  errorMessage: PropTypes.string.isRequired,
  placeholder: PropTypes.string.isRequired,
  onInputChange: PropTypes.func.isRequired,
  onCloseRequested: PropTypes.func.isRequired,
  children: PropTypes.any,
  theme: PropTypes.object,
  buttonAlignment: PropTypes.string,
  controlsPosition: PropTypes.string,
  selected: PropTypes.bool,
  textInput: PropTypes.object || PropTypes.bool,
  buttonSize: PropTypes.string,
};
