import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { LoaderIcon } from 'wix-rich-content-plugin-commons';
import {
  UrlInputModal,
  FOOTER_BUTTON_ALIGNMENT,
  MODAL_CONTROLS_POSITION,
  BUTTON_SIZE,
} from 'wix-rich-content-ui-components';
import { contentTypeMap, verticalEmbedProviders } from '../constants';
import ItemsList from './itemsList/ItemsList';
import styles from '../../statics/styles/vertical-embed-modal.scss';
import generalStyles from '../../statics/styles/general.scss';
import { convertDuration } from '../utils';

const LOADING = 'LOADING';
const NO_ITEMS = 'NO_ITEMS';
const READY = 'READY';
const NOT_FOUND = 'NOT_FOUND';

export default class VerticalEmbedInputModal extends Component {
  state = {
    errorMsg: '',
    items: [],
    selectedProduct: this.props.componentData?.selectedProduct || null,
    status: LOADING,
  };

  componentDidMount() {
    const {
      verticalsApi,
      componentData: { type },
      locale,
    } = this.props;
    this.verticalApi = verticalsApi(type, locale);
    try {
      this.verticalApi.search('').then(items => {
        this.setState({ items, status: items.length === 0 ? NO_ITEMS : READY });
      });
    } catch (e) {
      console.error('failed to load products ', e);
      this.setState({ items: [], status: NO_ITEMS });
    }
  }

  onInputChange = (inputString = '') => {
    this.verticalApi.search(inputString).then(items => {
      this.setState({ items, status: items.length === 0 ? NOT_FOUND : READY });
    });
    this.setState({ inputString });
  };

  onConfirm = () => {
    const { onConfirm, componentData, helpers, onReplace } = this.props;
    const { selectedProduct } = this.state;
    if (!selectedProduct) {
      return;
    }
    const addFunc = onConfirm || onReplace;
    addFunc({
      ...componentData,
      selectedProduct,
    });
    helpers.closeModal();
  };

  onItemClick = item => {
    const { selectedProduct } = this.state;
    if (item.id === selectedProduct?.id) {
      this.onConfirm();
    } else {
      this.setState({ selectedProduct: item });
    }
  };

  getItems = () => {
    const {
      componentData: { type },
      t,
    } = this.props;
    const { items } = this.state;
    let getDescriptionFunc;
    if (type === verticalEmbedProviders.booking) {
      getDescriptionFunc = product => convertDuration(product.durations, t);
    } else if (type === verticalEmbedProviders.event) {
      getDescriptionFunc = product => `${product.scheduling} | ${product.location}`;
    }
    return getDescriptionFunc
      ? items.map(product => ({ ...product, description: getDescriptionFunc(product) }))
      : items;
  };

  render() {
    const { inputString, selectedProduct, status } = this.state;
    const {
      t,
      componentData: { type },
      helpers,
      isMobile,
    } = this.props;
    const contentType = contentTypeMap[type];
    const selected = selectedProduct !== null;
    const emptyState = (
      <div className={generalStyles.emptyState}>
        <div className={generalStyles.title}>
          {t(`Embed_Vertical_${contentType}_EmptyState_NoResults_Title`)}
        </div>
        <div className={generalStyles.description}>
          {t(`Embed_Vertical_${contentType}_EmptyState_NoResults_Description`)}
        </div>
      </div>
    );
    const show = status !== NO_ITEMS;
    const textInput = show ? { searchIcon: true } : false;

    return (
      <UrlInputModal
        onConfirm={this.onConfirm}
        helpers={helpers}
        t={t}
        title={t(`Embed_Vertical_${contentType}_Title`)}
        dataHook={'verticalEmbedModal'}
        placeholder={t(`Embed_Vertical_${contentType}_Placeholder`)}
        onCloseRequested={helpers.closeModal}
        onInputChange={this.onInputChange}
        input={inputString}
        isMobile={isMobile}
        buttonAlignment={FOOTER_BUTTON_ALIGNMENT.END}
        controlsPosition={isMobile ? MODAL_CONTROLS_POSITION.TOP : MODAL_CONTROLS_POSITION.BOTTOM}
        selected={selected}
        textInput={textInput}
        buttonSize={BUTTON_SIZE.small}
      >
        <div className={styles.itemsWrapper}>
          {status === LOADING ? (
            <div className={generalStyles.emptyState}>
              <LoaderIcon className={styles.fileLoaderIcon} />
            </div>
          ) : status === NOT_FOUND ? (
            emptyState
          ) : (
            <ItemsList
              isMobile={isMobile}
              selectedItem={selectedProduct}
              items={this.getItems()}
              onClick={this.onItemClick}
              contentType={contentType}
              t={t}
            />
          )}
        </div>
      </UrlInputModal>
    );
  }
}

VerticalEmbedInputModal.propTypes = {
  onConfirm: PropTypes.func,
  onReplace: PropTypes.func,
  helpers: PropTypes.object.isRequired,
  componentData: PropTypes.object.isRequired,
  t: PropTypes.func,
  isMobile: PropTypes.bool,
  verticalsApi: PropTypes.object.isRequired,
  locale: PropTypes.string.isRequired,
};
