import React from 'react';
import PropTypes from 'prop-types';
import { mergeStyles } from 'wix-rich-content-common';
import classNames from 'classnames';
import { generateInsertPluginButtonProps } from '../Utils/generateInsertPluginButtonProps';
import { FileInput } from 'wix-rich-content-ui-components';
import { ToolbarButton, BUTTON_TYPES } from 'wix-rich-content-editor-common';
import styles from '../../statics/styles/toolbar-button.scss';

/**
 * createBaseInsertPluginButton
 */
export default ({
  blockType,
  button,
  helpers,
  pubsub,
  commonPubsub,
  settings,
  t,
  theme,
  isMobile,
  pluginDefaults,
}) => {
  return class InsertPluginButton extends React.PureComponent {
    static propTypes = {
      className: PropTypes.string,
      onButtonVisible: PropTypes.func,
      getEditorState: PropTypes.func.isRequired,
      setEditorState: PropTypes.func.isRequired,
      theme: PropTypes.object,
      showName: PropTypes.bool,
      isMobile: PropTypes.bool,
      t: PropTypes.func,
      tabIndex: PropTypes.number,
      toolbarName: PropTypes.string,
      closePluginMenu: PropTypes.func,
      pluginMenuButtonRef: PropTypes.any,
      forceDisabled: PropTypes.bool,
      sideToolbar: PropTypes.bool,
    };

    constructor(props) {
      super(props);
      const { buttonStyles } = props.theme || {};
      this.state = { isVisible: !button?.isVisiblePromise };
      this.styles = mergeStyles({ styles, theme: buttonStyles });
      this.buttonRef = React.createRef();
      this.toolbarName = props.toolbarName;
    }

    componentDidMount() {
      const { onButtonVisible } = this.props;
      if (button?.isVisiblePromise) {
        button.isVisiblePromise?.then(isVisible => {
          if (isVisible) {
            onButtonVisible?.();
            this.setState({ isVisible });
          }
        });
      } else {
        onButtonVisible?.();
      }
    }

    getButtonProps = () => {
      const { setEditorState, getEditorState, closePluginMenu, pluginMenuButtonRef } = this.props;
      return generateInsertPluginButtonProps({
        blockType,
        button,
        helpers,
        pubsub,
        commonPubsub,
        settings,
        t,
        theme,
        isMobile,
        pluginDefaults,
        getEditorState,
        setEditorState,
        toolbarName: this.toolbarName,
        closePluginMenu,
        pluginMenuButtonRef,
      });
    };

    renderButton = ({ getIcon, getLabel, onClick, dataHook, isDisabled, tooltip }) => {
      const { styles } = this;
      const { className, showName, tabIndex, forceDisabled, sideToolbar } = this.props;
      const Icon = getIcon();
      const label = getLabel();
      return (
        <button
          disabled={isDisabled() || forceDisabled}
          aria-label={tooltip}
          tabIndex={tabIndex}
          className={classNames(
            className,
            styles.button,
            sideToolbar ? styles.sideToolbarButton : styles.footerToolbarButton,
            { [styles.forceDisabled]: isDisabled() || forceDisabled }
          )}
          data-hook={dataHook}
          onClick={onClick}
          ref={this.buttonRef}
        >
          <div className={styles.icon}>
            <Icon key="0" />
          </div>
          {showName && (
            <span key="1" className={styles.label}>
              {label}
            </span>
          )}
        </button>
      );
    };

    renderFileUploadButton = ({
      getIcon,
      getLabel,
      onChange,
      accept,
      multiple,
      dataHook,
      isDisabled,
    }) => {
      const { showName, tabIndex, forceDisabled, sideToolbar, className } = this.props;
      const { styles } = this;
      const Icon = getIcon();
      const label = getLabel();
      return (
        <FileInput
          disabled={isDisabled() || forceDisabled}
          dataHook={`${dataHook}_file_input`}
          className={classNames(
            className,
            styles.button,
            sideToolbar ? styles.sideToolbarButton : styles.footerToolbarButton,
            { [styles.forceDisabled]: isDisabled() || forceDisabled }
          )}
          onChange={onChange}
          accept={accept}
          multiple={multiple}
          theme={this.props.theme}
          tabIndex={tabIndex}
        >
          <div className={styles.icon}>
            <Icon key="0" />
          </div>
          {showName && (
            <span key="1" className={styles.label}>
              {label}
            </span>
          )}
        </FileInput>
      );
    };

    render() {
      const { styles } = this;
      const { isVisible } = this.state;
      if (!isVisible) {
        return null;
      }
      const { theme, isMobile, forceDisabled } = this.props;
      const buttonProps = this.getButtonProps();
      const buttonWrapperClassNames = classNames(styles.buttonWrapper, {
        [styles.mobile]: isMobile,
      });
      const Button = (
        <div className={buttonWrapperClassNames}>
          {buttonProps.type === BUTTON_TYPES.FILE
            ? this.renderFileUploadButton(buttonProps)
            : this.renderButton(buttonProps)}
        </div>
      );
      return (
        <ToolbarButton
          theme={theme}
          tooltipText={!forceDisabled && buttonProps.tooltip}
          button={Button}
          tooltipOffset={{ y: 0 }}
        />
      );
    }
  };
};
