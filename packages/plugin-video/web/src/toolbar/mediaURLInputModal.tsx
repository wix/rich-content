import React, { Component } from 'react';
import ReactPlayer from 'react-player';
import { UrlInputModal, BUTTON_SIZE } from 'wix-rich-content-ui-components';
import {
  OnConfirmFunction,
  Pubsub,
  Helpers,
  ComponentData,
  TranslationFunction,
  TextDirection,
} from 'wix-rich-content-common';
import { videoButtonsTypes } from '../types';

interface Props {
  onConfirm?: OnConfirmFunction;
  pubsub: Pubsub;
  helpers: Helpers;
  componentData: ComponentData;
  t: TranslationFunction;
  isMobile?: boolean;
  languageDir?: TextDirection;
}

interface State {
  url: string;
  submittedInvalidUrl: boolean;
}

export default class MediaURLInputModal extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    const { componentData } = this.props;
    this.state = {
      url: componentData.src || '',
      submittedInvalidUrl: false,
    };
  }

  onConfirm = () => {
    const { url } = this.state;
    if (url && ReactPlayer.canPlay(url)) {
      const { componentData, helpers, pubsub, onConfirm } = this.props;
      if (onConfirm) {
        onConfirm({ ...componentData, src: url });
      } else {
        pubsub.update('componentData', { src: url });
      }

      if (helpers && helpers.onVideoSelected) {
        helpers.onVideoSelected(url, data =>
          pubsub.update('componentData', { metadata: { ...data } })
        );
      }

      helpers.closeModal?.();
    } else {
      this.setState({ submittedInvalidUrl: true });
    }
  };

  getRenderData = () => {
    const {
      t,
      isMobile,
      componentData: { type },
    } = this.props;
    const isYouTube = type === videoButtonsTypes.youTube;
    const isSoundCloud = type === videoButtonsTypes.soundCloud;
    const title = isYouTube
      ? 'EmbedURL_Social_YouTube_Title'
      : isSoundCloud &&
        (isMobile ? 'SoundCloudUploadModal_Header_Mobile' : 'SoundCloudUploadModal_Header');
    const placeholder = isYouTube
      ? t('EmbedURL_Social_YouTube_Placeholder')
      : isSoundCloud && t('SoundCloudUploadModal_Input_Placeholder');
    const dataHook = isYouTube ? 'socialEmbedUploadModal' : isSoundCloud && 'soundCloudUploadModal';
    return { title, placeholder, dataHook };
  };

  render() {
    const { url, submittedInvalidUrl } = this.state;
    const { t, languageDir, helpers } = this.props;
    const { title, placeholder, dataHook } = this.getRenderData();
    return (
      <UrlInputModal
        onConfirm={this.onConfirm}
        helpers={helpers}
        input={url}
        t={t}
        languageDir={languageDir}
        title={t(`${title}`)}
        submittedInvalidUrl={submittedInvalidUrl}
        dataHook={dataHook}
        onInputChange={url => this.setState({ url })}
        errorMessage={t('SoundCloudUploadModal_Input_InvalidUrl')}
        placeholder={placeholder}
        onCloseRequested={helpers.closeModal}
        buttonSize={BUTTON_SIZE.medium}
      />
    );
  }
}
