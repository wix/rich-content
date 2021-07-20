import { DraftContent } from '../types/contentTypes';
import extractEntityData from '../preview/ContentStateAnalyzer/extractEntityData';

const toSeoImage = entityData => {
  const { url, width, height, alt = '', caption = '' } = entityData;
  const imageUrl = `https://static.wixstatic.com/media/${url.replace('media/', '')}`;
  return { imageUrl, imageWidth: width, imageHeight: height, imageAlt: alt, imageCaption: caption };
};

const toSeoVideo = entityData => {
  const { url, thumbnail, caption = '' } = entityData;
  const videoThumbnailUrl = thumbnail.startsWith('media/')
    ? `https://static.wixstatic.com/${thumbnail}`
    : thumbnail;
  const videoContentUrl = url.startsWith('video/') ? `https://video.wixstatic.com/${url}` : url;
  return { videoThumbnailUrl, videoContentUrl, videoName: caption };
};

const gifToSeoVideo = entityData => {
  const { mp4: videoContentUrl, thumbnail: videoThumbnailUrl } = entityData;
  return { videoThumbnailUrl, videoContentUrl, videoName: '' };
};

export const extractMedia = ({ entityMap }: DraftContent) =>
  Object.values(entityMap)
    .filter(entity =>
      [
        'wix-draft-plugin-image',
        'wix-draft-plugin-giphy',
        'wix-draft-plugin-gallery',
        'wix-draft-plugin-video',
      ].includes(entity.type)
    )
    .reduce((media, entity) => [...media, ...extractEntityData(entity)], [])
    .map(entityData =>
      ({ image: toSeoImage, video: toSeoVideo, giphy: gifToSeoVideo }[entityData.type](entityData))
    );
