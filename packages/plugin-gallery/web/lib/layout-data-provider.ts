export enum GALLERY_LAYOUTS {
  EMPTY = -1,
  COLLAGE,
  MASONRY,
  GRID,
  THUMBNAIL,
  SLIDER,
  SLIDESHOW,
  PANORAMA,
  COLUMN,
  MAGIC,
  FULLSIZE,
  BRICKS,
  MIX,
  ALTERNATE,
}

export const layoutData = {
  [GALLERY_LAYOUTS.COLLAGE]: {
    isVertical: true,
    oneRow: false,
    galleryType: 'Columns',
    gallerySizePx: '300',
  },
  [GALLERY_LAYOUTS.MASONRY]: {
    numberOfImagesPerRow: 0,
    isVertical: false,
    gallerySizePx: '300',
  },
  [GALLERY_LAYOUTS.GRID]: {
    numberOfImagesPerRow: 3,
    cubeType: 'fill',
    cubeRatio: 1,
    isVertical: true,
    oneRow: false,
  },
  [GALLERY_LAYOUTS.THUMBNAIL]: {
    galleryThumbnailsAlignment: 'bottom',
    thumbnailSpacings: 2.5,
  },
  [GALLERY_LAYOUTS.SLIDER]: {
    cubeType: 'fit',
    cubeRatio: '16/9',
  },
  [GALLERY_LAYOUTS.SLIDESHOW]: {
    cubeType: 'fit',
  },
  [GALLERY_LAYOUTS.PANORAMA]: {
    hasThumbnails: false,
    galleryThumbnailsAlignment: 'none',
  },
  [GALLERY_LAYOUTS.COLUMN]: {
    hasThumbnails: false,
    galleryThumbnailsAlignment: 'none',
  },
  [GALLERY_LAYOUTS.FULLSIZE]: {
    cubeType: 'fill',
  },
};
