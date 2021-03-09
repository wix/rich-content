import React, { Component, Suspense, lazy } from 'react';
import PropTypes from 'prop-types';
import { mergeStyles } from 'wix-rich-content-common';
import styles from '../../../statics/styles/custom-color-picker-dialog.scss';
import ActionButtons from './ActionButtons';

const CustomColorPicker = lazy(() => import('./CustomColorPicker'));

class CustomColorPickerDialog extends Component {
  constructor(props) {
    super(props);
    this.styles = mergeStyles({ styles, theme: props.theme });
    this.initialColor = props.color;
    this.state = {
      color: props.color[0] === '#' ? props.color : '#ffffff',
    };
    this.onCancel = this.onCancel.bind(this);
    this.onUpdate = this.onUpdate.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  onChange(color) {
    this.setState({ color });
    this.props.onChange(color);
  }

  onCancel() {
    this.props.onCancel(this.initialColor);
  }

  onUpdate() {
    this.props.onUpdate(this.state.color);
  }

  render() {
    const { styles } = this;
    const { t, isMobile, theme } = this.props;
    return (
      <div className={styles.colorPickerDialog}>
        {isMobile && <ActionButtons onCancel={this.onCancel} onUpdate={this.onUpdate} t={t} />}
        <Suspense fallback={<div>Loading...</div>}>
          <CustomColorPicker
            color={this.state.color}
            onChange={this.onChange}
            t={t}
            isMobile={isMobile}
            theme={theme}
          />
        </Suspense>
        {!isMobile && (
          <>
            <hr className={styles.colorPickerDialog_separator} />
            <ActionButtons onCancel={this.onCancel} onUpdate={this.onUpdate} t={t} />{' '}
          </>
        )}
      </div>
    );
  }
}

CustomColorPickerDialog.propTypes = {
  t: PropTypes.func,
  color: PropTypes.string,
  isMobile: PropTypes.bool,
  theme: PropTypes.object,
  onCancel: PropTypes.func,
  onChange: PropTypes.func,
  onUpdate: PropTypes.func,
};

export default CustomColorPickerDialog;
