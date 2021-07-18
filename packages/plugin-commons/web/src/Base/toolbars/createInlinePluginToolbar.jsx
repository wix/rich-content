/* eslint-disable react/no-find-dom-node */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { debounce } from 'lodash';
import classNames from 'classnames';
import { KEYS_CHARCODE } from 'wix-rich-content-editor-common';
import { Separator } from 'wix-rich-content-ui-components';
import { BUTTONS } from '../buttons';
import toolbarStyles from '../../../statics/styles/plugin-toolbar.scss';
import ToolbarContent from './ToolbarContent';
import { setVariables, getRelativePositionStyle, getToolbarPosition } from './toolbarUtils';

export default function createInlinePluginToolbar({
  buttons,
  theme,
  commonPubsub,
  isMobile,
  t,
  name,
  getToolbarSettings,
  languageDir,
}) {
  return class BaseToolbar extends Component {
    static propTypes = {
      hide: PropTypes.bool,
      removeToolbarFocus: PropTypes.func,
    };

    constructor(props) {
      super(props);

      const {
        structure,
        offset,
        shouldCreate,
        visibilityFn,
        displayOptions,
        ToolbarDecoration,
      } = setVariables({ buttons, getToolbarSettings, isMobile });
      this.structure = structure;
      this.offset = offset;
      this.shouldCreate = shouldCreate;
      this.visibilityFn = visibilityFn;
      this.displayOptions = displayOptions;
      this.ToolbarDecoration = ToolbarDecoration;
      this.state = {
        position: { transform: 'scale(0)' },
        overrideContent: undefined,
        tabIndex: -1,
      };
    }

    componentDidMount() {
      commonPubsub.subscribe('cursorOnInlinePlugin', this.cursorIsOnInlinePlugin);
      if (window?.ResizeObserver && this.ref) {
        this.resizeObserver = new ResizeObserver(debounce(this.cursorIsOnInlinePlugin, 40));
        this.resizeObserver?.observe(this.ref);
      }
    }

    componentWillUnmount() {
      commonPubsub.unsubscribe('cursorOnInlinePlugin', this.cursorIsOnInlinePlugin);
      this.resizeObserver?.unobserve(this.ref);
    }

    isToolbarOnFocus = () => this.ref?.contains(document.activeElement);

    cursorIsOnInlinePlugin = debounce(() => {
      const toolbarOnFocus = this.isToolbarOnFocus();
      const { boundingRect, type } = commonPubsub.get('cursorOnInlinePlugin') || {};
      if (toolbarOnFocus) {
        return;
      }
      this.hideToolbar();
      if (boundingRect && name.toUpperCase() === type) {
        this.pluginBoundingRect = boundingRect;
        this.showToolbar();
      }
    }, 40);

    shouldComponentUpdate(_nextProps, nextState) {
      return !!this.state.isVisible || !!nextState.isVisible;
    }

    onOverrideContent = overrideContent => {
      this.setState({ overrideContent });
    };

    hideToolbar = () => {
      this.setState({
        position: { transform: 'scale(0)' },
        overrideContent: undefined,
        tabIndex: -1,
        isVisible: false,
      });
    };

    getRelativePositionStyle = boundingRect => {
      const { position, updatedOffsetHeight } = getRelativePositionStyle({
        boundingRect,
        offset: this.offset,
        offsetHeight: this.offsetHeight,
        toolbarNode: this.ref,
        languageDir,
        isMobile,
      });
      this.offsetHeight = updatedOffsetHeight;
      return position;
    };

    showToolbar = () => {
      if (this.visibilityFn()) {
        if (this.state.isVisible) {
          this.setToolbarPosition();
        } else {
          this.setState({ isVisible: true });
        }
      }
    };

    setRef = ref => {
      this.ref = ref;
      if (ref) {
        this.setToolbarPosition();
      }
    };

    setToolbarPosition = () => {
      const position = getToolbarPosition({
        boundingRect: this.pluginBoundingRect,
        displayOptions: this.displayOptions,
        getRelativePositionStyle: this.getRelativePositionStyle,
        offset: this.offset,
      });
      this.setState({ tabIndex: 0, position }, this.forceUpdate);
    };

    scrollToolbar(event, leftDirection) {
      event.preventDefault();
      const { clientWidth, scrollWidth } = this.scrollContainer;
      this.scrollContainer.scrollLeft = leftDirection
        ? 0
        : Math.min(this.scrollContainer.scrollLeft + clientWidth, scrollWidth);
    }

    /*eslint-disable complexity*/
    PluginToolbarButton = ({ button, index, themedStyle, separatorClassNames }) => {
      if (button.component) {
        const Button = button.component;
        return (
          <Button
            t={t}
            theme={themedStyle}
            toolbarOffsetTop={this.state.position && this.state.position['--offset-top']}
            toolbarOffsetLeft={this.state.position && this.state.position['--offset-left']}
          />
        );
      }
      switch (button.type) {
        case BUTTONS.SEPARATOR:
          return <Separator className={separatorClassNames} key={index} />;
        default:
          return null;
      }
    };

    onKeyDown = e => {
      if (e.keyCode === KEYS_CHARCODE.ESCAPE) {
        this.props.removeToolbarFocus && this.props.removeToolbarFocus();
      }
    };

    render() {
      const { overrideContent, tabIndex, isVisible } = this.state;
      const { hide } = this.props;
      const toolbarContentProps = {
        overrideContent,
        tabIndex,
        theme,
        PluginToolbarButton: this.PluginToolbarButton,
        structure: this.structure,
      };

      if (!this.shouldCreate) {
        return null;
      }

      const { toolbarStyles: toolbarTheme } = theme || {};

      if (this.visibilityFn() && isVisible) {
        const props = {
          style: { ...this.state.position, visibility: hide ? 'hidden' : 'visible' },
          className: classNames(
            toolbarStyles.pluginToolbar,
            toolbarTheme && toolbarTheme.pluginToolbar
          ),
          'data-hook': name ? `${name}PluginToolbar` : null,
          ref: this.setRef,
          onKeyDown: this.onKeyDown,
          tabIndex: '0',
        };

        const ToolbarWrapper = this.ToolbarDecoration || 'div';

        return (
          <ToolbarWrapper {...props}>
            <ToolbarContent {...toolbarContentProps} />
          </ToolbarWrapper>
        );
      } else {
        return null;
      }
    }
  };
}
