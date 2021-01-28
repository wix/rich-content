import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { IMAGE_TYPE } from './types';
import { get, includes, isEqual, isFunction } from 'lodash';
import {
  mergeStyles,
  validate,
  isSSR,
  getImageSrc,
  WIX_MEDIA_DEFAULT,
  anchorScroll,
  addAnchorTagToUrl,
} from 'wix-rich-content-common';
// eslint-disable-next-line max-len
import pluginImageSchema from 'wix-rich-content-common/dist/statics/schemas/plugin-image.schema.json';
import { DEFAULTS, SEO_IMAGE_WIDTH } from './consts';
import styles from '../statics/styles/image-viewer.rtlignore.scss';
import ExpandIcon from './icons/expand';
import InPluginInput from './InPluginInput';

const isSafari = () => /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

class ImageViewer extends React.Component {
  constructor(props) {
    super(props);
    validate(props.componentData, pluginImageSchema);
    this.state = {};
    this.preloadRef = React.createRef();
    this.imageRef = React.createRef();
  }

  componentDidMount() {
    this.setState({ ssrDone: true });
    if (isSafari()) {
      //In Safari, onload event doesn't always called when reloading the page
      this.forceOnImageLoad();
    }
  }

  componentWillReceiveProps(nextProps) {
    if (!isEqual(nextProps.componentData, this.props.componentData)) {
      validate(nextProps.componentData, pluginImageSchema);
    }
  }

  forceOnImageLoad = () => {
    let executionTimes = 0;
    const interval = setInterval(() => {
      if (this.imageRef?.current?.complete) {
        this.onImageLoad(this.imageRef.current);
        clearInterval(interval);
      }
      if (++executionTimes === 10) {
        clearInterval(interval);
      }
    }, 200);
  };

  calculateHeight(width = 1, src) {
    return src && src.height && src.width
      ? Math.ceil((src.height / src.width) * width)
      : WIX_MEDIA_DEFAULT.SIZE;
  }

  getImageUrl(src) {
    const { helpers, seoMode } = this.props || {};
    if (!src && helpers?.handleFileSelection) {
      return null;
    }

    const imageUrl = {
      preload: '',
      highres: '',
    };

    if (this.props.dataUrl) {
      imageUrl.preload = imageUrl.highres = this.props.dataUrl;
    } else {
      let requiredWidth, requiredHeight;
      imageUrl.preload = getImageSrc(src, helpers);
      if (seoMode) {
        requiredWidth = src?.width && Math.min(src.width, SEO_IMAGE_WIDTH);
        requiredHeight = this.calculateHeight(SEO_IMAGE_WIDTH, src);
      } else if (this.state.container) {
        const { width } = this.state.container.getBoundingClientRect();
        requiredWidth = width || src?.width || 1;
        if (this.props.isMobile) {
          //adjust the image width to viewport scaling and device pixel ratio
          requiredWidth *= (!isSSR() && window.devicePixelRatio) || 1;
          requiredWidth *= (!isSSR() && window.screen.width / document.body.clientWidth) || 1;
        }
        //keep the image's original ratio
        requiredHeight = this.calculateHeight(requiredWidth, src);
        requiredWidth = Math.ceil(requiredWidth);
        requiredHeight = Math.ceil(requiredHeight);
      }
      imageUrl.highres = getImageSrc(src, helpers, {
        requiredWidth,
        requiredHeight,
        requiredQuality: 90,
        imageType: 'highRes',
      });
    }
    if (this.state.ssrDone && !imageUrl.preload) {
      console.error(`image plugin mounted with invalid image source!`, src); //eslint-disable-line no-console
    }

    return imageUrl;
  }

  onImageLoadError = () => {
    const {
      componentData: { src },
    } = this.props;

    if (src && src.fallback) {
      this.setState({
        fallbackImageSrc: {
          preload: src.fallback,
          highres: src.fallback,
        },
      });
    }
  };

  renderImage = (imageClassName, imageSrc, alt, props, isGif, seoMode) => {
    return this.getImage(
      classNames(imageClassName, this.styles.imageHighres, {
        [this.styles.onlyHighRes]: isGif || seoMode,
      }),
      imageSrc.highres,
      alt,
      props,
      !isGif
    );
  };

  renderPreloadImage = (imageClassName, imageSrc, alt, props) => {
    return this.getImage(
      classNames(imageClassName, this.styles.imagePreload),
      imageSrc.preload,
      alt,
      props
    );
  };

  getImage(imageClassNames, src, alt, props, fadeIn = false) {
    return (
      <img
        {...props}
        className={imageClassNames}
        src={src}
        alt={alt}
        onError={this.onImageLoadError}
        onLoad={fadeIn ? e => this.onImageLoad(e.target) : undefined}
        ref={fadeIn ? this.imageRef : this.preloadRef}
      />
    );
  }

  onImageLoad = element => {
    element.style.opacity = 1;
    if (this.preloadRef.current) {
      this.preloadRef.current.style.opacity = 0;
    }
  };

  renderTitle(data, styles) {
    const config = data.config || {};
    return (
      !!config.showTitle && (
        <div className={classNames(styles.imageTitle)}>{(data && data.title) || ''}</div>
      )
    );
  }

  renderDescription(data, styles) {
    const config = data.config || {};
    return (
      !!config.showDescription && (
        <div className={classNames(styles.imageDescription)}>
          {(data && data.description) || ''}
        </div>
      )
    );
  }

  renderCaption(caption) {
    const { onCaptionChange, setFocusToBlock, setInPluginEditingMode } = this.props;
    return onCaptionChange ? (
      <InPluginInput
        setInPluginEditingMode={setInPluginEditingMode}
        className={this.styles.imageCaption}
        value={caption}
        onChange={onCaptionChange}
        setFocusToBlock={setFocusToBlock}
      />
    ) : (
      <span dir="auto" className={this.styles.imageCaption}>
        {caption}
      </span>
    );
  }

  shouldRenderCaption() {
    const { getInPluginEditingMode, settings, componentData, defaultCaption } = this.props;
    const caption = componentData.metadata?.caption;

    if (includes(get(settings, 'toolbar.hidden'), 'settings')) {
      return false;
    }
    if (
      caption === undefined ||
      (caption === '' && !getInPluginEditingMode?.()) ||
      caption === defaultCaption
    ) {
      return false;
    }
    const data = componentData || DEFAULTS;
    if (data.config.size === 'original' && data.src && data.src.width) {
      return data.src.width >= 350;
    }
    return true;
  }

  handleExpand = e => {
    e.preventDefault();
    const {
      settings: { onExpand },
      helpers = {},
    } = this.props;
    helpers.onViewerAction?.('expand_image', IMAGE_TYPE);
    onExpand?.(this.props.blockKey);
  };

  scrollToAnchor = () => {
    const {
      componentData: {
        config: {
          link: { anchor },
        },
      },
    } = this.props;
    const anchorString = `viewer-${anchor}`;
    const element = document.getElementById(anchorString);
    addAnchorTagToUrl(anchorString);
    anchorScroll(element);
  };

  hasLink = () => this.props.componentData?.config?.link?.url;

  hasAnchor = () => this.props.componentData?.config?.link?.anchor;

  onKeyDown = e => {
    // Allow key events only in viewer
    if ((e.key === 'Enter' || e.key === ' ') && !this.props.getInPluginEditingMode) {
      this.handleClick(e);
    }
  };

  handleClick = e => {
    if (this.hasLink()) {
      return null;
    } else if (this.hasAnchor()) {
      e.preventDefault();
      this.scrollToAnchor();
    } else {
      !this.props.componentData.config.disableExpand && this.handleExpand(e);
    }
  };

  handleRef = e => {
    if (!this.state.container) {
      this.setState({ container: e }); //saving the container on the state to trigger a new render
    }
  };

  handleContextMenu = e => this.props.componentData.config.disableRightClick && e.preventDefault();

  renderExpandIcon = () => {
    return (
      <div className={this.styles.expandContainer}>
        <ExpandIcon className={this.styles.expandIcon} onClick={this.handleExpand} />
      </div>
    );
  };

  render() {
    this.styles = this.styles || mergeStyles({ styles, theme: this.props.theme });
    const { componentData, className, settings, setComponentUrl, seoMode } = this.props;
    const { fallbackImageSrc, ssrDone } = this.state;
    const data = componentData || DEFAULTS;
    const { metadata = {}, config } = componentData;
    const disableExpand = settings.disableExpand || config.disableExpand;

    const hasExpand = !disableExpand && settings.onExpand;

    const itemClassName = classNames(this.styles.imageContainer, className, {
      [this.styles.pointer]: hasExpand,
    });
    const imageClassName = this.styles.image;
    const imageSrc = fallbackImageSrc || this.getImageUrl(data.src);
    let imageProps = {};
    if (data.src && settings) {
      imageProps = isFunction(settings.imageProps)
        ? settings.imageProps(data.src)
        : settings.imageProps;
    }
    const isGif = imageSrc?.highres?.endsWith?.('.gif');
    setComponentUrl?.(imageSrc?.highres);
    const shouldRenderPreloadImage = !seoMode && imageSrc && !isGif;
    const shouldRenderImage = (imageSrc && (seoMode || ssrDone)) || isGif;
    const accessibilityProps = !this.hasLink() && { role: 'button', tabIndex: 0 };
    /* eslint-disable jsx-a11y/no-static-element-interactions */
    return (
      <div
        data-hook="imageViewer"
        onClick={this.handleClick}
        className={itemClassName}
        onKeyDown={this.onKeyDown}
        ref={this.handleRef}
        onContextMenu={this.handleContextMenu}
        {...accessibilityProps}
      >
        <div className={this.styles.imageWrapper} role="img" aria-label={metadata.alt}>
          {shouldRenderPreloadImage &&
            this.renderPreloadImage(imageClassName, imageSrc, metadata.alt, imageProps)}
          {shouldRenderImage &&
            this.renderImage(imageClassName, imageSrc, metadata.alt, imageProps, isGif, seoMode)}
          {hasExpand && this.renderExpandIcon()}
        </div>
        {this.renderTitle(data, this.styles)}
        {this.renderDescription(data, this.styles)}
        {this.shouldRenderCaption() && this.renderCaption(metadata.caption)}
      </div>
    );
  }
}

ImageViewer.propTypes = {
  componentData: PropTypes.object.isRequired,
  className: PropTypes.string,
  dataUrl: PropTypes.string,
  settings: PropTypes.object,
  defaultCaption: PropTypes.string,
  entityIndex: PropTypes.number,
  onCaptionChange: PropTypes.func,
  setFocusToBlock: PropTypes.func,
  theme: PropTypes.object.isRequired,
  helpers: PropTypes.object.isRequired,
  disableRightClick: PropTypes.bool,
  getInPluginEditingMode: PropTypes.func,
  setInPluginEditingMode: PropTypes.func,
  isMobile: PropTypes.bool.isRequired,
  setComponentUrl: PropTypes.func,
  seoMode: PropTypes.bool,
  blockKey: PropTypes.string,
};

export default ImageViewer;
