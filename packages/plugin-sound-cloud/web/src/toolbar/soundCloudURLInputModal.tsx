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

export default class SoundCloudURLInputModal extends Component<Props, State> {
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

  render() {
    const { url, submittedInvalidUrl } = this.state;
    const { t, isMobile, languageDir, helpers } = this.props;

    return (
      <UrlInputModal
        onConfirm={this.onConfirm}
        helpers={helpers}
        input={url}
        t={t}
        languageDir={languageDir}
        title={
          !isMobile ? t('SoundCloudUploadModal_Header') : t('SoundCloudUploadModal_Header_Mobile')
        }
        submittedInvalidUrl={submittedInvalidUrl}
        dataHook={'soundCloudUploadModal'}
        onInputChange={url => this.setState({ url })}
        errorMessage={t('SoundCloudUploadModal_Input_InvalidUrl')}
        placeholder={t('SoundCloudUploadModal_Input_Placeholder')}
        onCloseRequested={helpers.closeModal}
        buttonSize={BUTTON_SIZE.medium}
      />
    );
  }
}
