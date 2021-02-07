import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { mergeStyles, isValidUrl } from 'wix-rich-content-common';
import Tooltip from 'wix-rich-content-common/libs/Tooltip';
import Checkbox from '../Checkbox';
import { ErrorIcon } from '../../Icons';
import styles from '../../../statics/styles/link-panel.scss';
import { LinkPanelDropdown } from './LinkPanelDropdown';

class LinkPanel extends Component {
  state = { showValidation: false };
  static defaultProps = {
    targetBlank: true,
    showTargetBlankCheckbox: true,
    showRelValueCheckbox: true,
    showSponsoredRelValueCheckbox: true,
    isMobile: false,
  };
  styles = mergeStyles({ styles, theme: this.props.theme });
  textInput = React.createRef();

  componentDidMount() {
    this.onChange({ isValid: this.isValidUrl(this.props.linkValues.url) });
    this.textInput?.current?.focus();
    this.textInput?.current?.select(); //select the link in case of edit
  }

  handleUrlChange = url => {
    this.setState({ showValidation: false });
    this.onChange({
      url,
      isValid: this.isValidUrl(url),
    });
  };

  handleTargetChange = event => {
    this.onChange({ targetBlank: event.target.checked });
  };

  handleNofollowChange = event => {
    this.onChange({ nofollow: event.target.checked });
  };

  handleSponsoredChange = event => {
    this.onChange({ sponsored: event.target.checked });
  };

  onChange = changes => {
    this.props.onChange({ ...this.props.linkValues, ...changes });
  };

  handleKeyDown = e => {
    const { onEnter, onEscape } = this.props;
    if (e.key === 'Enter') {
      this.setState({ showValidation: true });
      e.preventDefault();
      onEnter && onEnter(e);
    } else if (e.key === 'Escape') {
      e.preventDefault();
      onEscape && onEscape(e);
    }
  };

  isValidUrl = url => !url || isValidUrl(url);

  hasError() {
    return this.props.linkValues.isValid === false && this.state.showValidation;
  }

  getInput = () => {
    return this.props.dropDown ? this.getDropdown() : this.getTextInput();
  };

  getDropdown() {
    return (
      <LinkPanelDropdown
        theme={this.props.theme}
        value={this.props.linkValues.url}
        onChange={this.handleUrlChange}
        textInputProps={this.getTextInputProps()}
        {...this.props.dropDown}
      />
    );
  }

  getTextInput() {
    return (
      <input
        ref={this.textInput}
        value={this.props.linkValues.url}
        onChange={e => this.handleUrlChange(e.target.value)}
        {...this.getTextInputProps()}
      />
    );
  }

  getTextInputProps() {
    const { styles } = this;
    const textInputClassName = classNames(styles.linkPanel_textInput, {
      [styles.linkPanel_textInput_invalid]: this.hasError(),
    });
    return {
      type: 'url',
      className: textInputClassName,
      placeholder: this.props.placeholder || this.props.t('LinkPanel_InputPlaceholder'),
      'data-hook': 'linkPanelInput',
      onBlur: () => this.setState({ showValidation: true }),
    };
  }

  render() {
    const { styles } = this;
    const {
      theme,
      ariaProps,
      showTargetBlankCheckbox,
      showRelValueCheckbox,
      showSponsoredRelValueCheckbox,
      t,
      linkValues,
      unchangedUrl,
      isMobile,
    } = this.props;

    const { targetBlank, nofollow, sponsored } = linkValues;

    return (
      <div className={styles.linkPanel_Content} {...ariaProps} role="form">
        {!unchangedUrl && (
          /* eslint-disable-next-line jsx-a11y/no-static-element-interactions */
          <div className={styles.linkPanel_Input} onKeyDown={this.handleKeyDown}>
            {this.getInput()}
            {this.hasError() && (
              <Tooltip content={t('LinkPanel_ErrorTooltip')} isError>
                <ErrorIcon data-hook="linkPanelError" className={styles.linkPanel_errorIcon} />
              </Tooltip>
            )}
          </div>
        )}
        <div className={styles.checkboxesContainer}>
          {showTargetBlankCheckbox && (
            <Checkbox
              label={t('LinkPanel_Target_Checkbox')}
              theme={theme}
              checked={targetBlank}
              dataHook="linkPanelBlankCheckbox"
              onChange={this.handleTargetChange}
            />
          )}
          {showRelValueCheckbox && (
            <Checkbox
              label={t('LinkPanel_Nofollow_Checkbox')}
              theme={theme}
              checked={nofollow}
              dataHook="linkPanelRelCheckbox"
              onChange={this.handleNofollowChange}
              tooltipTextKey={'LinkPanel_Nofollow_Checkbox_Tooltip'}
              t={t}
              isMobile={isMobile}
            />
          )}
          {showSponsoredRelValueCheckbox && (
            <Checkbox
              label={'Mark as a sponsored link'}
              theme={theme}
              checked={sponsored}
              dataHook="linkPanelSponsoredCheckbox"
              onChange={this.handleSponsoredChange}
              t={t}
              isMobile={isMobile}
            />
          )}
        </div>
      </div>
    );
  }
}

LinkPanel.propTypes = {
  t: PropTypes.func.isRequired,
  theme: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  linkValues: PropTypes.shape({
    url: PropTypes.string,
    isValid: PropTypes.bool,
    targetBlank: PropTypes.bool,
    nofollow: PropTypes.bool,
    sponsored: PropTypes.bool,
  }).isRequired,
  ariaProps: PropTypes.object,
  showTargetBlankCheckbox: PropTypes.bool,
  showRelValueCheckbox: PropTypes.bool,
  showSponsoredRelValueCheckbox: PropTypes.bool,
  dropDown: PropTypes.object,
  onEnter: PropTypes.func,
  onEscape: PropTypes.func,
  placeholder: PropTypes.string,
  unchangedUrl: PropTypes.bool,
  isMobile: PropTypes.bool,
};
export default LinkPanel;
