import React from 'react';
import PropTypes from 'prop-types';
import VideoSelectionInputModal from './videoSelectionInputModal';
import MediaURLInputModal from './mediaURLInputModal';
import { mediaTypes } from '../types';
import { createMediaUploadWrapper } from 'wix-rich-content-plugin-commons';
import { VIDEO_TYPE } from 'wix-rich-content-common';

const VideoModal = props => {
  const {
    componentData: { type },
  } = props;
  const Comp = mediaTypes.includes(type)
    ? MediaURLInputModal
    : createMediaUploadWrapper(VideoSelectionInputModal);
  return <Comp {...props} />;
};

export default VideoModal;

VideoModal.propTypes = {
  componentData: PropTypes.object,
};
