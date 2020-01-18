import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { mergeStyles, validate, Context, pluginDividerSchema } from 'wix-rich-content-common';
import { isEqual } from 'lodash';
import { getConfig, getType } from '../domain';
import DividerLine from './divider-line';
import { customClassName } from '../classNameStrategies';
import styles from '../../statics/styles/divider-viewer.rtlignore.scss';

class DividerComponent extends PureComponent {
  static customClassName = (componentData, theme, styles, isMobile) =>
    customClassName(componentData, theme, styles, isMobile);

  constructor(props) {
    super(props);
    validate(props.componentData, pluginDividerSchema);
    this.state = this.stateFromProps(props);
  }

  componentWillReceiveProps(nextProps) {
    if (!isEqual(nextProps.componentData, this.props.componentData)) {
      validate(nextProps.componentData, pluginDividerSchema);
    }
    this.setState(this.stateFromProps(nextProps));
  }

  stateFromProps = ({ componentData }) => {
    const config = getConfig(componentData);
    return {
      type: getType(componentData),
      size: config.size,
      alignment: config.alignment,
    };
  };

  render() {
    this.styles = this.styles || mergeStyles({ styles, theme: this.context.theme });
    // NOTE: editor-only logic in viewer component
    const editorBounds = this.context.getEditorBounds && this.context.getEditorBounds();
    const editorWidth = editorBounds && editorBounds.width ? editorBounds.width : '100%';
    const { type, size, alignment } = this.state;
    const className = classNames(
      this.styles['divider-container'],
      this.styles[`divider-container--${type}`],
      this.context.isMobile && this.styles['divider-container--mobile'],
      this.props.className
    );
    return (
      <div className={className} data-hook={`divider-${type}`}>
        <DividerLine
          type={type}
          width={editorWidth}
          size={size}
          alignment={alignment}
          styles={this.styles}
          contextType={DividerComponent.contextType || Context.type}
        />
      </div>
    );
  }
}

DividerComponent.propTypes = {
  componentData: PropTypes.object.isRequired,
  componentState: PropTypes.object,
  store: PropTypes.object,
  blockProps: PropTypes.object,
  className: PropTypes.string,
};

DividerComponent.contextType = Context.type;

export default DividerComponent;
