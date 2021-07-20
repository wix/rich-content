import React, { PureComponent } from 'react';
import {
  dataBuilder,
  tempDataBuilder,
  uploadFunctionGetter,
  GALLERY_FILE_TYPES,
} from '../Utils/mediaPluginsDataBuilders';
import PropTypes from 'prop-types';
import {
  GALLERY_TYPE,
  alignmentClassName,
  sizeClassName,
  textWrapClassName,
} from 'wix-rich-content-common';

const fileReader = file => {
  return new Promise(resolve => {
    resolve(URL.createObjectURL(file));
  });
};

const handleUploadFinished = (
  type,
  getComponentData,
  data,
  error,
  onUploadFinished,
  itemIndex,
  fileType
) => {
  return onUploadFinished({
    data: data && dataBuilder[type]?.({ data, error }, getComponentData(), fileType, itemIndex),
    error,
  });
};

const handleUploadStart = (
  props,
  getComponentData,
  file,
  onLocalLoad,
  onUploadFinished,
  itemPos
) => {
  if (file) {
    fileReader(file).then(url => {
      const { type, commonPubsub } = props;
      const tempData = tempDataBuilder[type]?.({
        url,
        file,
      });
      onLocalLoad?.(tempData);
      const handleFileUpload = uploadFunctionGetter[type](props);
      const {
        helpers: { onMediaUploadStart, onMediaUploadEnd },
      } = props;
      const uploadBIData = onMediaUploadStart(type, file.size, file.type);
      const fileType = getGalleryFileType(file.type);
      handleFileUpload(file, ({ data, error }) => {
        onMediaUploadEnd(uploadBIData, error);
        error && commonPubsub.set('onMediaUploadError', error);
        handleUploadFinished(
          type,
          getComponentData,
          data,
          error,
          onUploadFinished,
          itemPos,
          fileType
        );
      });
    });
  }
};

const createBaseMediaPlugin = PluginComponent => {
  return class BaseMediaPlugin extends PureComponent {
    static propTypes = {
      componentData: PropTypes.object.isRequired,
      componentState: PropTypes.object.isRequired,
      store: PropTypes.object.isRequired,
      block: PropTypes.object.isRequired,
      t: PropTypes.func.isRequired,
      commonPubsub: PropTypes.object,
      type: PropTypes.string,
    };

    static alignmentClassName = (...args) => {
      const alignment = PluginComponent.alignmentClassName?.(...args);
      return typeof alignment === 'string' ? alignment : alignmentClassName(...args);
    };

    static sizeClassName = (...args) => {
      const size = PluginComponent.sizeClassName?.(...args);
      return typeof size === 'string' ? size : sizeClassName(...args);
    };

    static textWrapClassName = (...args) => {
      const textWrap = PluginComponent.textWrapClassName?.(...args);
      return typeof textWrap === 'string' ? textWrap : textWrapClassName(...args);
    };

    constructor(props) {
      super(props);
      this.state = { isLoading: false, tempData: null };
    }

    componentDidMount() {
      const { block, store, commonPubsub, type } = this.props;
      const blockKey = block.getKey();
      store?.setBlockHandler('handleFilesSelected', blockKey, this.handleFilesSelected.bind(this));
      store?.setBlockHandler('handleFilesAdded', blockKey, this.handleFilesAdded.bind(this));
      type === GALLERY_TYPE &&
        commonPubsub?.setBlockHandler(
          'galleryHandleFilesAdded',
          blockKey,
          this.handleFilesAdded.bind(this)
        );
      this.updateComponent();
    }

    componentDidUpdate() {
      this.updateComponent();
    }

    updateComponent() {
      const componentState = this.props.componentState || {};
      const { isLoading, userSelectedFiles } = this.getLoadingParams(componentState);
      if (!isLoading && userSelectedFiles) {
        //lets continue the uploading process
        if (userSelectedFiles.files && userSelectedFiles.files.length > 0) {
          this.setState(
            { itemsLeftToUpload: userSelectedFiles.files.length, isLoading: true },
            () => this.handleFilesSelected(userSelectedFiles.files)
          );
        }
        setTimeout(() => {
          //needs to be async since this function is called during constructor and we do not want the update to call set state on other components
          this.props.store.update('componentState', { isLoading: true, userSelectedFiles: null });
        }, 0);
      }
    }

    getLoadingParams = componentState => {
      //check if the file upload is coming on the regular state
      const { isLoading, userSelectedFiles } = componentState;
      return { isLoading: this.state?.isLoading || isLoading, userSelectedFiles };
    };

    onUploadFinished = ({ data, error }) => {
      const { store, block } = this.props;
      data && store.update('componentData', data, block.getKey());
      let { tempData } = this.state;
      if (!error) {
        tempData = null;
      }
      this.setState(state => {
        const itemsLeftToUpload = state.itemsLeftToUpload - 1;
        const isLoading = itemsLeftToUpload > 0;
        !isLoading && store.update('componentState', { isLoading: false, userSelectedFiles: null });
        return { itemsLeftToUpload, isLoading, tempData };
      });
    };

    onLocalLoad = tempData => this.setState({ tempData });

    handleFilesSelected = files => {
      Array(...files).forEach(file => {
        handleUploadStart(
          this.props,
          this.getComponentData,
          file,
          this.onLocalLoad,
          this.onUploadFinished
        );
      });
    };

    handleFilesAdded = ({ data, error }) => {
      const { type } = this.props;
      if (data instanceof Array) {
        data.forEach((item, index) => {
          handleUploadFinished(
            type,
            this.getComponentData,
            item,
            (error instanceof Array && error[index]) || error,
            this.onUploadFinished
          );
        });
      } else {
        handleUploadFinished(type, this.getComponentData, data, error, this.onUploadFinished);
      }
    };

    getComponentData = () => this.props.componentData;

    render() {
      const { isLoading, tempData } = this.state;
      return <PluginComponent {...this.props} isLoading={isLoading} tempData={tempData} />;
    }
  };
};

const getGalleryFileType = type => {
  return type.match('image/*')
    ? GALLERY_FILE_TYPES.IMAGE
    : type.match('video/*')
    ? GALLERY_FILE_TYPES.VIDEO
    : '';
};

export { handleUploadStart, handleUploadFinished, createBaseMediaPlugin };
