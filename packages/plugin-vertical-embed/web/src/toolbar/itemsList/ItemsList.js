import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styles from '../../../statics/styles/items-list.scss';
import generalStyles from '../../../statics/styles/general.scss';
import cx from 'classnames';
import Item from './Item';

class ItemsList extends PureComponent {
  constructor(props) {
    super(props);
    this.state = { selectedItem: {} };
  }

  static propTypes = {
    items: PropTypes.array.isRequired,
    onClick: PropTypes.func.isRequired,
    selectedItem: PropTypes.object,
    contentType: PropTypes.string.isRequired,
    isMobile: PropTypes.boolean,
    t: PropTypes.func.isRequired,
  };

  render() {
    const { items, onClick, selectedItem, contentType, t, isMobile } = this.props;
    const emptyState = (
      <div className={generalStyles.emptyState}>
        <div className={generalStyles.title}>
          {t(`Embed_Vertical_${contentType}_EmptyState_NoItems_Title`)}
        </div>
        <div className={generalStyles.description}>
          {t(`Embed_Vertical_${contentType}_EmptyState_NoItems_Description`)}
        </div>
      </div>
    );
    return (
      <div
        className={cx(styles.container, { [styles.mobile]: isMobile })}
        data-hook="verticalsItemsList"
      >
        {items.length > 0
          ? items.map((item, index) => (
              // eslint-disable-next-line react/jsx-indent
              <Item
                item={item}
                key={index}
                onClick={onClick}
                selected={selectedItem?.id === item.id}
                t={t}
              />
            ))
          : emptyState}
      </div>
    );
  }
}

export default ItemsList;
