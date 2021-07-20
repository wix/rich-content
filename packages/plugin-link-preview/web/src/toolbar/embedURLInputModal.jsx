import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { UrlInputModal, BUTTON_SIZE } from 'wix-rich-content-ui-components';
import { DEFAULTS } from '../defaults';

export default class EmbedURLInputModal extends Component {
  constructor(props) {
    super(props);
    const { componentData } = this.props;
    this.state = {
      url: componentData?.config?.link?.url || '',
      submittedInvalidUrl: false,
    };
  }

  onConfirm = () => {
    const { url } = this.state;
    if (url) {
      const { componentData, pubsub, onConfirm, helpers, fetchData } = this.props;
      fetchData(url).then(({ html }) => {
        if (!html) {
          this.setState({ submittedInvalidUrl: true });
        } else {
          if (onConfirm) {
            const { config } = DEFAULTS;
            onConfirm({
              ...componentData,
              html,
              config: {
                ...config,
                width: 350,
                link: { ...config.link, url },
              },
            });
          } else {
            pubsub.update('componentData', { url, html });
          }
          helpers.closeModal();
        }
      });
    }
  };

  render() {
    const { url, submittedInvalidUrl } = this.state;
    const { t, languageDir, socialType, helpers } = this.props;

    return (
      <UrlInputModal
        onConfirm={this.onConfirm}
        helpers={helpers}
        input={url}
        t={t}
        languageDir={languageDir}
        title={t(`EmbedURL_Social_${socialType}_Title`)}
        submittedInvalidUrl={submittedInvalidUrl}
        dataHook={'socialEmbedUploadModal'}
        onInputChange={url => this.setState({ url })}
        errorMessage={t('SoundCloudUploadModal_Input_InvalidUrl')}
        placeholder={t(`EmbedURL_Social_${socialType}_Placeholder`)}
        onCloseRequested={helpers.closeModal}
        buttonSize={BUTTON_SIZE.medium}
      />
    );
  }
}

EmbedURLInputModal.propTypes = {
  onConfirm: PropTypes.func,
  pubsub: PropTypes.object,
  helpers: PropTypes.object.isRequired,
  componentData: PropTypes.object.isRequired,
  t: PropTypes.func,
  languageDir: PropTypes.string,
  fetchData: PropTypes.func,
  socialType: PropTypes.string,
};
