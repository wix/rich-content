/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { validate, getLangDir } from 'wix-rich-content-common';
// eslint-disable-next-line max-len
import verticalEmbedSchema from 'wix-rich-content-common/dist/statics/schemas/vertical-embed.schema.json';
import classnames from 'classnames';
import styles from '../../statics/styles/widget.scss';
import { VERTICAL_EMBED_TYPE } from '../types';
import { dataTypeMapper } from '../utils';
import Card from './Card';
class VerticalEmbedComponent extends PureComponent {
  constructor(props) {
    super(props);
    validate(props.componentData, verticalEmbedSchema);
  }

  onClick = () =>
    this.props.helpers.onViewerAction?.(
      VERTICAL_EMBED_TYPE,
      'Click',
      this.props.componentData.type
    );

  render() {
    const {
      componentData,
      className,
      settings: { slimLayout = false },
      t,
      locale,
    } = this.props;

    const { selectedProduct, type } = componentData;
    const props = dataTypeMapper[type](selectedProduct, t);
    const direction = getLangDir(locale);
    return (
      // eslint-disable-next-line jsx-a11y/click-events-have-key-events
      <div
        className={classnames(className, styles.card, { [styles.slimLayout]: slimLayout })}
        data-hook="vertical-embed"
        onClick={this.onClick}
      >
        <Card {...props} t={t} direction={direction} />
      </div>
    );
  }
}

VerticalEmbedComponent.propTypes = {
  componentData: PropTypes.object.isRequired,
  className: PropTypes.string,
  settings: PropTypes.object,
  helpers: PropTypes.object,
  locale: PropTypes.string,
  t: PropTypes.func,
};

export default VerticalEmbedComponent;
