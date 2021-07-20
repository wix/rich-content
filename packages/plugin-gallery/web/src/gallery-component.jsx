import React from 'react';
import PropTypes from 'prop-types';
import { Loader, MediaItemErrorMsg } from 'wix-rich-content-ui-components';
import GalleryViewer from './gallery-viewer';
import { DEFAULTS } from './defaults';
import styles from '../statics/styles/gallery-component.scss';

const renderMobileNativeLoader = ({ url }) =>
  url ? null : (
    <div className={styles.mobileNativeLoaderContainer}>
      <Loader type={'mini'} disableProgress />
    </div>
  );

function GalleryComponent(props) {
  const { error, t, isLoading } = props;
  return (
    <>
      <GalleryViewer
        componentData={props.componentData}
        onClick={props.onClick}
        className={props.className}
        settings={props.settings}
        theme={props.theme}
        helpers={props.helpers}
        disableRightClick={props.disableRightClick}
        isMobile={props.isMobile}
        anchorTarget={props.anchorTarget}
        relValue={props.relValue}
        blockKey={props.block.getKey()}
        itemOverlayElement={renderMobileNativeLoader}
      />
      {!error && isLoading && <Loader type={'medium'} />}
      {error && <MediaItemErrorMsg error={error} t={t} />}
    </>
  );
}

GalleryComponent.propTypes = {
  componentData: PropTypes.object.isRequired,
  block: PropTypes.object.isRequired,
  onClick: PropTypes.func.isRequired,
  className: PropTypes.string.isRequired,
  settings: PropTypes.object,
  helpers: PropTypes.object.isRequired,
  disableRightClick: PropTypes.bool,
  theme: PropTypes.object.isRequired,
  isMobile: PropTypes.bool.isRequired,
  anchorTarget: PropTypes.string.isRequired,
  relValue: PropTypes.string.isRequired,
  error: PropTypes.object,
  t: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
};

export { GalleryComponent as Component, DEFAULTS };
