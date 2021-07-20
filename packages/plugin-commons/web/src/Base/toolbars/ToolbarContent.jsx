/* eslint-disable react/no-find-dom-node */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Measure from 'react-measure';
import toolbarStyles from '../../../statics/styles/plugin-toolbar.scss';
import buttonStyles from '../../../statics/styles/plugin-toolbar-button.scss';

export default class ToolbarContent extends PureComponent {
  static propTypes = {
    overrideContent: PropTypes.any,
    tabIndex: PropTypes.number,
    theme: PropTypes.object,
    PluginToolbarButton: PropTypes.elementType,
    structure: PropTypes.object,
    onOverrideContent: PropTypes.func,
    componentData: PropTypes.object,
    triggerOnLoadBi: PropTypes.func,
  };

  constructor(props) {
    super(props);
    this.state = { showLeftArrow: false, showRightArrow: false };
  }

  scrollToolbar(event, leftDirection) {
    event.preventDefault();
    const { clientWidth, scrollWidth } = this.scrollContainer;
    this.scrollContainer.scrollLeft = leftDirection
      ? 0
      : Math.min(this.scrollContainer.scrollLeft + clientWidth, scrollWidth);
  }

  setToolbarScrollButton = (scrollLeft, scrollWidth, clientWidth) => {
    const currentScrollButtonWidth = this.state.showLeftArrow || this.state.showRightArrow ? 20 : 0;
    const isScroll = scrollWidth - clientWidth - currentScrollButtonWidth > 8;

    this.setState({
      showLeftArrow: isScroll && scrollLeft === scrollWidth - clientWidth,
      showRightArrow: isScroll && scrollLeft < scrollWidth - clientWidth,
    });
  };

  componentDidMount() {
    this.props.triggerOnLoadBi?.();
  }

  render() {
    const { showLeftArrow, showRightArrow } = this.state;
    const {
      overrideContent: OverrideContent,
      tabIndex,
      theme,
      PluginToolbarButton,
      structure,
      onOverrideContent,
      componentData,
    } = this.props;
    const hasArrow = showLeftArrow || showRightArrow;
    const { toolbarStyles: toolbarTheme } = theme || {};
    const { buttonStyles: buttonTheme, separatorStyles: separatorTheme } = theme || {};
    const scrollableContainerClasses = classNames(
      toolbarStyles.pluginToolbar_scrollableContainer,
      toolbarTheme && toolbarTheme.pluginToolbar_scrollableContainer
    );
    const buttonContainerClassnames = classNames(
      toolbarStyles.pluginToolbar_buttons,
      toolbarTheme && toolbarTheme.pluginToolbar_buttons,
      {
        [toolbarStyles.pluginToolbar_overrideContent]: !!OverrideContent,
        [toolbarTheme.pluginToolbar_overrideContent]: !!OverrideContent,
      }
    );
    const themedButtonStyle = {
      buttonWrapper: classNames(
        buttonStyles.pluginToolbarButton_wrapper,
        buttonTheme && buttonTheme.pluginToolbarButton_wrapper
      ),
      button: classNames(
        buttonStyles.pluginToolbarButton,
        buttonTheme && buttonTheme.pluginToolbarButton
      ),
      icon: classNames(
        buttonStyles.pluginToolbarButton_icon,
        buttonTheme && buttonTheme.pluginToolbarButton_icon
      ),
      active: classNames(
        buttonStyles.pluginToolbarButton_active,
        buttonTheme && buttonTheme.pluginToolbarButton_active
      ),
      disabled: classNames(
        buttonStyles.pluginToolbarButton_disabled,
        buttonTheme && buttonTheme.pluginToolbarButton_disabled
      ),
      ...theme,
    };

    const arrowClassNames = classNames(
      toolbarStyles.pluginToolbar_responsiveArrow,
      toolbarTheme && toolbarTheme.pluginToolbar_responsiveArrow
    );
    const leftArrowIconClassNames = classNames(
      toolbarStyles.pluginToolbar_responsiveArrowStart_icon,
      toolbarTheme && toolbarTheme.responsiveArrowStart_icon
    );
    const rightArrowIconClassNames = classNames(
      toolbarStyles.pluginToolbar_responsiveArrowEnd_icon,
      toolbarTheme && toolbarTheme.responsiveArrowEnd_icon
    );
    const separatorClassNames = classNames(
      toolbarStyles.pluginToolbarSeparator,
      separatorTheme && separatorTheme.pluginToolbarSeparator
    );
    const overrideProps = { onOverrideContent };

    return (
      <div className={buttonContainerClassnames}>
        <Measure
          client
          scroll
          innerRef={ref => (this.scrollContainer = ref)}
          onResize={({ scroll, client }) =>
            this.setToolbarScrollButton(scroll.left, scroll.width, client.width)
          }
        >
          {({ measure, measureRef }) => (
            <div className={scrollableContainerClasses} ref={measureRef} onScroll={() => measure()}>
              {OverrideContent ? (
                <OverrideContent {...overrideProps} />
              ) : (
                structure.map((button, index) => (
                  <PluginToolbarButton
                    button={button}
                    key={index}
                    themedStyle={themedButtonStyle}
                    separatorClassNames={separatorClassNames}
                    tabIndex={tabIndex}
                    index={index}
                    componentData={componentData}
                  />
                ))
              )}
            </div>
          )}
        </Measure>
        {hasArrow && (
          <button
            tabIndex={tabIndex}
            className={arrowClassNames}
            data-hook="pluginToolbarRightArrow"
            onMouseDown={e => this.scrollToolbar(e, showLeftArrow)}
          >
            <i className={showLeftArrow ? leftArrowIconClassNames : rightArrowIconClassNames} />
          </button>
        )}
      </div>
    );
  }
}
