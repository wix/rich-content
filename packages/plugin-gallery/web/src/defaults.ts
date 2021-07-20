/* eslint-disable camelcase */
import { GALLERY_LAYOUTS } from '../lib/layout-data-provider';

export const GALLERY_ITEMS_TYPES = Object.freeze({
  IMAGE: 'image',
  VIDEO: 'video',
});

const HORIZONTAL_LAYOUTS = Object.freeze([
  GALLERY_LAYOUTS.THUMBNAIL,
  GALLERY_LAYOUTS.SLIDER,
  GALLERY_LAYOUTS.SLIDESHOW,
  GALLERY_LAYOUTS.COLUMN,
  GALLERY_LAYOUTS.FULLSIZE,
]);

export const sampleItems = [1, 2, 3].map(i => {
  return {
    metadata: {
      height: 10,
      width: 10,
    },
    orderIndex: i,
    itemId: 'sampleItem-' + i,
    url:
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAABGdBTUEAALGPC/xhBQAAAAlwSFlzAAALEwAACxMBAJqcGAAAAVlpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IlhNUCBDb3JlIDUuNC4wIj4KICAgPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4KICAgICAgPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIKICAgICAgICAgICAgeG1sbnM6dGlmZj0iaHR0cDovL25zLmFkb2JlLmNvbS90aWZmLzEuMC8iPgogICAgICAgICA8dGlmZjpPcmllbnRhdGlvbj4xPC90aWZmOk9yaWVudGF0aW9uPgogICAgICA8L3JkZjpEZXNjcmlwdGlvbj4KICAgPC9yZGY6UkRGPgo8L3g6eG1wbWV0YT4KTMInWQAAAA1JREFUCB1jePv27X8ACVkDxyMHIvwAAAAASUVORK5CYII=', //eslint-disable-line
  };
});

export const DEFAULTS = Object.freeze({
  items: [],
  styles: {
    galleryLayout: 2,
    gallerySizeType: 'px',
    gallerySizePx: 300,
    galleryMargin: 0,
    oneRow: false,
    cubeRatio: 1,
    galleryThumbnailsAlignment: 'bottom',
    isVertical: false,
    imageMargin: 5,
    thumbnailSpacings: 0,
    cubeType: 'fill',
    enableInfiniteScroll: true,
    titlePlacement: 'SHOW_ON_HOVER',
    allowHover: true,
    itemClick: 'link',
    fullscreen: false,
    showArrows: false,
    gridStyle: 1,
    loveButton: false,
    allowSocial: false,
    allowDownload: false,
    mobileSwipeAnimation: 'NO_EFFECT',
    thumbnailSize: 120,
    gotStyleParams: true,
    showVideoPlayButton: true,
    videoPlay: 'onClick',
  },
  config: {
    alignment: 'center',
    size: 'content',
    layout: 'small',
    spacing: 0,
  },
});

export const isHorizontalLayout = ({ galleryLayout, oneRow }) =>
  HORIZONTAL_LAYOUTS.indexOf(galleryLayout) > -1 || oneRow;
