import React, { Component } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { mergeStyles } from 'wix-rich-content-common';
import styles from '../../statics/styles/slider.scss';

class Slider extends Component {
  static propTypes = {
    value: PropTypes.number.isRequired,
    min: PropTypes.number,
    max: PropTypes.number,
    theme: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
    dataHook: PropTypes.string,
    ariaProps: PropTypes.object,
  };

  constructor(props) {
    super(props);
    this.state = { value: props.value };
    this.styles = mergeStyles({ styles, theme: props.theme });
  }

  static getDerivedStateFromProps(props, state) {
    return props.value !== state.value ? { value: props.value } : {};
  }

  onChange(value) {
    this.setState({ value });
    this.props.onChange(value);
  }

  onKeyUp(event) {
    switch (event.key) {
      case 'ArrowUp':
      case 'ArrowDown':
      case 'ArrowRight':
      case 'ArrowLeft':
      case 'Home':
      case 'End':
      case 'PageUp':
      case 'PageDown':
        this.props.onChange(event.target.valueAsNumber);
        break;
      default:
        return;
    }
  }

  render() {
    const { min, max, onChange, dataHook, ariaProps } = this.props;
    return (
      <input
        {...ariaProps}
        tabIndex={0}
        type={'range'}
        className={classNames(this.styles.slider, this.styles.wrapperSlider)}
        data-hook={dataHook}
        onChange={e => this.onChange(e.target.valueAsNumber)}
        value={this.state.value}
        min={min}
        max={max}
        onMouseUp={e => onChange(e.target.valueAsNumber)}
        onKeyUp={e => this.onKeyUp(e)}
      />
    );
  }
}

export default Slider;
