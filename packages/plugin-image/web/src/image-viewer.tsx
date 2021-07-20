import React, { RefObject } from 'react';
import classNames from 'classnames';
import { IMAGE_TYPE, ImagePluginViewerConfig, ImageConfig } from './types';
import { get, includes, isEqual, isFunction } from 'lodash';
import {
  mergeStyles,
  validate,
  isSSR,
  getImageSrc,
  isPNG,
  WIX_MEDIA_DEFAULT,
  anchorScroll,
  addAnchorTagToUrl,
  GlobalContext,
  Helpers,
  RichContentTheme,
  SEOSettings,
  CustomAnchorScroll,
} from 'wix-rich-content-common';
// eslint-disable-next-line max-len
import pluginImageSchema from 'wix-rich-content-common/dist/statics/schemas/plugin-image.schema.json';
import { DEFAULTS, SEO_IMAGE_WIDTH } from './consts';
import styles from '../statics/styles/image-viewer.rtlignore.scss';
import ExpandIcon from './icons/expand';
import InPluginInput from './InPluginInput';

const isSafari = () => /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

const replaceUrlFileExtenstion = (url, extensionTarget) => {
  // replace png or jpg file to extensionTarget
  return url.replace(/(.*)\.(jp(e)?g|png)$/, `$1.${extensionTarget}`);
};

interface ImageViewerProps {
  componentData: {
    config: ImageConfig;
    src: { fallback: string; width: number };
    metadata?: { caption?: unknown; alt?: string | undefined };
    [key: string]: unknown;
    disableDownload?: boolean;
    disableExpand?: boolean;
  };
  className: string;
  dataUrl: string;
  settings: ImagePluginViewerConfig;
  defaultCaption: string;
  entityIndex: number;
  onCaptionChange: () => void;
  setFocusToBlock: () => void;
  theme: RichContentTheme;
  helpers: Helpers;
  disableRightClick: boolean;
  getInPluginEditingMode: () => unknown;
  setInPluginEditingMode: () => unknown;
  isMobile: boolean;
  setComponentUrl: (highres?: string) => unknown;
  seoMode: SEOSettings;
  blockKey: string;
  isLoading: boolean;
  customAnchorScroll?: CustomAnchorScroll;
}

interface ImageSrc {
  preload: string;
  highres: string;
}

interface ImageViewerState {
  container?: HTMLDivElement;
  ssrDone?: boolean;
  fallbackImageSrc?: ImageSrc;
}

class ImageViewer extends React.Component<ImageViewerProps, ImageViewerState> {
  preloadRef: RefObject<HTMLImageElement>;

  imageRef: RefObject<HTMLImageElement>;

  styles!: Record<string, string>;

  constructor(props) {
    super(props);
    validate(props.componentData, pluginImageSchema);
    this.state = {};
    this.preloadRef = React.createRef();
    this.imageRef = React.createRef();
  }

  static contextType = GlobalContext;

  shouldUseSrcSet() {
    const { experiments } = this.context;
    return experiments?.useSrcSet?.enabled;
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

  getImageDataUrl(): ImageSrc | null {
    return this.props.dataUrl
      ? {
          preload: this.props.dataUrl,
          highres: this.props.dataUrl,
        }
      : null;
  }

  getImageUrl(src): ImageSrc | null {
    const { helpers, seoMode } = this.props || {};
    if (!src && helpers?.handleFileSelection) {
      return null;
    }

    const removeUsm = this.context.experiments?.removeUsmFromImageUrls?.enabled;

    const imageUrl: ImageSrc = {
      preload: '',
      highres: '',
    };

    const getImageDimensions = (width, isMobile) => {
      let requiredHeight;
      let requiredWidth = width || 1;
      if (isMobile && !isSSR()) {
        //adjust the image width to viewport scaling and device pixel ratio
        requiredWidth *= window.devicePixelRatio;
        requiredWidth *= window.screen.width / document.body.clientWidth;
      }
      //keep the image's original ratio
      requiredHeight = this.calculateHeight(requiredWidth, src);
      requiredWidth = Math.ceil(requiredWidth);
      requiredHeight = Math.ceil(requiredHeight);
      return [requiredWidth, requiredHeight];
    };

    let requiredWidth, requiredHeight;
    let imageSrcOpts = {};
    /**
        PNG files can't reduce quality via Wix services and we want to avoid downloading a big png image that will affect performance.
      **/
    if (
      !this.props.isMobile &&
      !isPNG(src) &&
      this.context.experiments?.useQualityPreload?.enabled
    ) {
      const {
        componentData: {
          config: { alignment, width },
        },
      } = this.props;
      const usePredefinedWidth = (alignment === 'left' || alignment === 'right') && !width;
      imageSrcOpts = {
        removeUsm,
        imageType: 'quailtyPreload',
        ...(usePredefinedWidth && { requiredWidth: 300 }),
      };
    }

    imageUrl.preload = getImageSrc(src, helpers?.getImageUrl, imageSrcOpts);
    if (seoMode) {
      requiredWidth = src?.width && Math.min(src.width, SEO_IMAGE_WIDTH);
      requiredHeight = this.calculateHeight(SEO_IMAGE_WIDTH, src);
    } else if (this.state.container) {
      const desiredWidth = this.state.container.getBoundingClientRect().width || src?.width;
      [requiredWidth, requiredHeight] = getImageDimensions(desiredWidth, this.props.isMobile);
    }

    imageUrl.highres = getImageSrc(src, helpers?.getImageUrl, {
      removeUsm,
      requiredWidth,
      requiredHeight,
      requiredQuality: 90,
      imageType: 'highRes',
    });

    if (this.state.ssrDone && !imageUrl.preload && !this.props.isLoading) {
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

  renderImage = (imageClassName, imageSrc, alt, props, isGif, onlyHighRes) => {
    return this.getImage(
      classNames(imageClassName, this.styles.imageHighres, {
        [this.styles.onlyHighRes]: onlyHighRes,
      }),
      imageSrc.highres,
      alt,
      props,
      { fadeIn: !isGif, width: imageSrc.highresWidth, height: imageSrc.highresHeight }
    );
  };

  renderPreloadImage = (imageClassName, imageSrc, alt, props) => {
    return this.getImage(
      classNames(imageClassName, this.styles.imagePreload),
      imageSrc.preload,
      alt,
      { 'aria-hidden': true, ...props },
      { useSrcSet: true }
    );
  };

  getImage(
    imageClassNames,
    src,
    alt,
    props,
    opts: {
      fadeIn?: boolean;
      width?: number | string;
      height?: number | string;
      useSrcSet?: boolean;
    } = {}
  ) {
    const { fadeIn = false, width, height, useSrcSet } = opts;
    let srcSet;
    if (this.shouldUseSrcSet() && useSrcSet) {
      srcSet = replaceUrlFileExtenstion(src, 'webp');
    }
    return (
      <img
        {...props}
        className={imageClassNames}
        src={src}
        srcSet={srcSet}
        alt={alt}
        onError={this.onImageLoadError}
        onLoad={fadeIn ? e => this.onImageLoad(e.target) : undefined}
        ref={fadeIn ? this.imageRef : this.preloadRef}
        width={width}
        height={height}
      />
    );
  }

  onImageLoad = element => {
    element.style.opacity = 1;
    if (this.preloadRef.current) {
      this.preloadRef.current.style.opacity = '0';
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
    const { imageCaption, link } = this.styles;
    const classes = classNames(imageCaption, this.hasLink() && link);
    return onCaptionChange ? (
      <InPluginInput
        setInPluginEditingMode={setInPluginEditingMode}
        className={classes}
        value={caption}
        onChange={onCaptionChange}
        setFocusToBlock={setFocusToBlock}
      />
    ) : (
      <span dir="auto" className={classes}>
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
    helpers.onViewerAction?.(IMAGE_TYPE, 'Click', 'expand_image');
    this.hasExpand() && onExpand?.(this.props.blockKey);
  };

  scrollToAnchor = e => {
    const {
      componentData: {
        config: { link: { anchor } = {} },
      },
      customAnchorScroll,
    } = this.props;
    if (customAnchorScroll) {
      customAnchorScroll(e, anchor as string);
    } else {
      const anchorString = `viewer-${anchor}`;
      const element = document.getElementById(anchorString);
      addAnchorTagToUrl(anchorString);
      anchorScroll(element);
    }
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
      e.stopPropagation(); // fix problem with wix platform, where it wouldn't scroll and sometimes jump to different page
      this.scrollToAnchor(e);
    } else {
      this.handleExpand(e);
    }
  };

  handleRef = e => {
    if (!this.state.container) {
      this.setState({ container: e }); //saving the container on the state to trigger a new render
    }
  };

  handleContextMenu = e => {
    const {
      componentData: { disableDownload = false },
    } = this.props;
    return disableDownload && e.preventDefault();
  };

  hasExpand = () => {
    const { componentData, settings } = this.props;
    let disableExpand = false;
    if (componentData.disableExpand !== undefined) {
      disableExpand = componentData.disableExpand;
    } else if (settings.disableExpand !== undefined) {
      disableExpand = settings.disableExpand;
    }
    return !disableExpand && settings.onExpand;
  };

  renderExpandIcon = () => {
    return (
      <div className={this.styles.expandContainer}>
        <ExpandIcon className={this.styles.expandIcon} onClick={this.handleExpand} />
      </div>
    );
  };

  // eslint-disable-next-line complexity
  render() {
    this.styles = this.styles || mergeStyles({ styles, theme: this.props.theme });
    const { componentData, className, settings, setComponentUrl, seoMode } = this.props;
    const { fallbackImageSrc, ssrDone } = this.state;
    const data = componentData || DEFAULTS;
    let { metadata } = componentData;
    if (!metadata) {
      metadata = {};
    }
    const itemClassName = classNames(this.styles.imageWrapper, className, {
      [this.styles.pointer]: this.hasExpand() as boolean,
    });
    const imageClassName = this.styles.image;
    const imageSrc = fallbackImageSrc || this.getImageDataUrl() || this.getImageUrl(data.src);
    let imageProps = {};
    if (data.src && settings && settings.imageProps) {
      imageProps = isFunction(settings.imageProps)
        ? settings.imageProps(data.src)
        : settings.imageProps;
    }
    const isGif = imageSrc?.highres?.endsWith?.('.gif');
    setComponentUrl?.(imageSrc?.highres);

    const shouldRenderPreloadImage = !seoMode && imageSrc && !isGif;
    const shouldRenderImage = (imageSrc && (seoMode || ssrDone)) || isGif;
    const accesibilityProps = !this.hasLink() && { role: 'button', tabIndex: 0 };
    const onlyHiRes = seoMode || isGif;
    /* eslint-disable jsx-a11y/no-static-element-interactions */
    return (
      <div
        data-hook="imageViewer"
        className={this.styles.imageContainer}
        ref={this.handleRef}
        onContextMenu={this.handleContextMenu}
        {...accesibilityProps}
      >
        <div
          className={itemClassName}
          aria-label={metadata.alt}
          onClick={this.handleClick}
          onKeyDown={this.onKeyDown}
        >
          {shouldRenderPreloadImage &&
            this.renderPreloadImage(imageClassName, imageSrc, metadata.alt, imageProps)}
          {shouldRenderImage &&
            this.renderImage(imageClassName, imageSrc, metadata.alt, imageProps, isGif, onlyHiRes)}
          {this.hasExpand() && this.renderExpandIcon()}
        </div>
        {this.renderTitle(data, this.styles)}
        {this.renderDescription(data, this.styles)}
        {this.shouldRenderCaption() && this.renderCaption(metadata.caption)}
      </div>
    );
  }
}

export default ImageViewer;
