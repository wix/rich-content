import React from 'react';
import PropTypes from 'prop-types';

import { MODALS, RichContentModal } from 'wix-rich-content-common';
import MobileAddPluginModal from './Toolbars/AddPluginModal';
import MobileBlockLinkModal from './Toolbars/MobileBlockLinkModal';
import MobileTextLinkModal from './Toolbars/MobileTextLinkModal';

const Modals = {
  [MODALS.MOBILE_ADD_PLUGIN]: MobileAddPluginModal,
  [MODALS.MOBILE_BLOCK_LINK_MODAL]: MobileBlockLinkModal,
  [MODALS.MOBILE_TEXT_LINK_MODAL]: MobileTextLinkModal,
};

const RichContentEditorModal = ({ modalName, modalElement, modalsMap, ...modalProps }) => {
  const ModalsMap = Object.assign({}, Modals, modalsMap);
  const element = ModalsMap[modalName] || modalElement;
  if (!element) {
    console.error(`Attempted to open unknown external modal '${modalName}'`); //eslint-disable-line no-console
    return null;
  }
  return <RichContentModal modalElement={element} {...modalProps}/>;
};

RichContentEditorModal.propTypes = {
  modalName: PropTypes.string,
  modalElement: PropTypes.func,
  modalsMap: PropTypes.object,
  modalProps: PropTypes.object,
};

export default RichContentEditorModal;
