import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { mergeStyles } from 'wix-rich-content-common';
import { BUTTON_SIZE } from '..';
import styles from '../../statics/styles/button.scss';

class Button extends Component {
  static propTypes = {
    type: PropTypes.oneOf(['primary', 'secondary']),
    theme: PropTypes.object.isRequired,
    className: PropTypes.string,
    onClick: PropTypes.func.isRequired,
    children: PropTypes.node,
    dataHook: PropTypes.string,
    ariaProps: PropTypes.object,
    size: PropTypes.string,
    text: PropTypes.string,
  };

  static defaultProps = {
    type: 'primary',
  };

  constructor(props) {
    super(props);
    this.styles = mergeStyles({ styles, theme: props.theme });
  }

  render() {
    const {
      onClick,
      className,
      type,
      dataHook,
      ariaProps,
      size = BUTTON_SIZE.small,
      text,
    } = this.props;
    return (
      <button
        {...ariaProps}
        data-hook={dataHook}
        onClick={onClick}
        tabIndex="0"
        className={classNames(this.styles[`button_${type}`], this.styles[size], className)}
      >
        {text}
      </button>
    );
  }
}

export default Button;
