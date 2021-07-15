/* eslint-disable fp/no-delete */
import { has, cloneDeep } from 'lodash';
import {
  ACTION_BUTTON_TYPE,
  DIVIDER_TYPE,
  FILE_UPLOAD_TYPE,
  HTML_TYPE,
  IMAGE_TYPE,
  LINK_BUTTON_TYPE,
  LINK_PREVIEW_TYPE,
  MENTION_TYPE,
  POLL_TYPE,
  APP_EMBED_TYPE,
  VIDEO_TYPE,
  MAP_TYPE,
  EMBED_TYPE,
  LINK_TYPE,
} from '../../../consts';
import {
  PluginContainerData_Spoiler,
  FileSource,
  PluginContainerData_Width_Type,
  ButtonData_Type,
  Link,
} from 'ricos-schema';
import { TO_RICOS_DATA } from './consts';
import {
  ComponentData,
  FileComponentData,
  ImageComponentData,
  VideoComponentData,
} from '../../../types';
import { createLink } from '../../nodeUtils';

export const convertBlockDataToRicos = (type: string, data) => {
  const newData = cloneDeep(data);
  const converters = {
    [VIDEO_TYPE]: convertVideoData,
    [DIVIDER_TYPE]: convertDividerData,
    [FILE_UPLOAD_TYPE]: convertFileData,
    [IMAGE_TYPE]: convertImageData,
    [POLL_TYPE]: convertPollData,
    [APP_EMBED_TYPE]: convertAppEmbedData,
    [LINK_PREVIEW_TYPE]: convertLinkPreviewData,
    [MENTION_TYPE]: convertMentionData,
    [LINK_BUTTON_TYPE]: convertButtonData,
    [ACTION_BUTTON_TYPE]: convertButtonData,
    [HTML_TYPE]: convertHTMLData,
    [MAP_TYPE]: convertMapData,
    [EMBED_TYPE]: convertEmbedData,
    [LINK_TYPE]: convertLinkData,
  };
  let blockType = type;
  if (type === LINK_PREVIEW_TYPE && data.html) {
    blockType = EMBED_TYPE;
  }
  if (newData.config && blockType !== DIVIDER_TYPE) {
    convertContainerData(newData);
  }
  if (blockType in converters) {
    const convert = converters[blockType];
    convert(newData, blockType);
  }
  const fromJSON = data => {
    const pluginDataMethods = TO_RICOS_DATA[blockType];
    return pluginDataMethods?.fromJSON(data) || data;
  };
  return fromJSON(newData);
};

const convertContainerData = (data: { config?: ComponentData['config']; containerData }) => {
  const { size, alignment, width, spoiler, height } = data.config || {};
  const { enabled, description, buttonContent } = spoiler || {};
  const newSpoiler: PluginContainerData_Spoiler | undefined = spoiler && {
    enabled: enabled || false,
    description,
    buttonText: buttonContent,
  };
  data.containerData = {
    alignment: alignment && kebabToConstantCase(alignment),
    spoiler: newSpoiler,
  };
  typeof height === 'number' && (data.containerData.height = { custom: height });
  typeof width === 'number'
    ? (data.containerData.width = { custom: width })
    : size && (data.containerData.width = { size: kebabToConstantCase(size) });
};

const convertVideoData = (data: {
  src?: string | VideoComponentData;
  metadata?: { thumbnail_url?: string; width?: number; height?: number; title?: string };
  video;
  thumbnail;
  title?;
}) => {
  if (typeof data.src === 'string') {
    data.video = { src: { url: data.src } };
    const { thumbnail_url, width, height, title } = data.metadata || {};
    title && (data.title = title);
    data.thumbnail = {
      src: { url: thumbnail_url },
      width,
      height,
    };
  } else if (typeof data.src === 'object') {
    data.video = { src: { custom: data.src.pathname } };
    data.thumbnail = {
      src: { custom: data.src.thumbnail.pathname },
      width: data.src.thumbnail.width,
      height: data.src.thumbnail.height,
    };
  }
};

const convertDividerData = (data: {
  type?: string;
  config?: ComponentData['config'];
  lineStyle?: string;
  width;
  alignment;
  containerData;
}) => {
  has(data, 'type') && (data.lineStyle = data.type?.toUpperCase());
  has(data, 'config.size') && (data.width = data.config?.size?.toUpperCase());
  has(data, 'config.alignment') && (data.alignment = data.config?.alignment?.toUpperCase());
  data.containerData = { width: { size: PluginContainerData_Width_Type.CONTENT } };
};

const convertImageData = (data: {
  src?: ImageComponentData;
  config?: ComponentData['config'];
  metadata?: { alt?: string; caption?: string };
  image;
  link;
  altText;
  caption;
}) => {
  const { file_name, width, height } = data.src || {};
  const { link, anchor } = data.config || {};
  data.image = { src: { custom: file_name }, width, height };
  data.link = (link || anchor) && createLink({ ...link, anchor });
  data.altText = data.metadata?.alt;
  data.caption = data.metadata?.caption;
};

const convertPollData = (data: { layout; design }) => {
  has(data, 'layout.poll.type') && (data.layout.poll.type = data.layout.poll.type.toUpperCase());
  has(data, 'layout.poll.direction') &&
    (data.layout.poll.direction = data.layout.poll.direction.toUpperCase());
  has(data, 'design.poll.backgroundType') &&
    (data.design.poll.backgroundType = data.design.poll.backgroundType.toUpperCase());
};

const convertAppEmbedData = (data: {
  type: string;
  selectedProduct: Record<string, string>;
  url;
  imageSrc;
  id;
  name;
  bookingData;
  eventData;
}) => {
  const {
    id,
    name,
    imageSrc,
    description,
    pageUrl,
    scheduling,
    location,
    html,
    durations,
  } = data.selectedProduct;
  data.url = pageUrl || (html && (data.url = html.match(/href="[^"]*/g)?.[0]?.slice(6)));
  data.id = id;
  data.name = name;
  data.imageSrc = imageSrc;
  if (data.type === 'booking') {
    data.bookingData = { durations: durations || description };
  } else if (data.type === 'event') {
    data.eventData = {
      location: location || (description && description.match(/[^|]*$/)?.[0]),
      scheduling: scheduling || (description && description.match(/[^|]+/)?.[0]),
    };
  }
  data.type = data.type?.toUpperCase();
};

const convertLinkPreviewData = (data: {
  thumbnail_url?: string;
  config?: { link };
  thumbnailUrl;
  link;
}) => {
  has(data, 'thumbnail_url') && (data.thumbnailUrl = data.thumbnail_url);
  data.config?.link && (data.link = createLink(data.config?.link));
};

const convertMentionData = (data: {
  mention?: { name?: string; slug?: string };
  name?: string;
  slug?: string;
}) => {
  data.name = data.mention?.name;
  data.slug = data.mention?.slug;
  delete data.mention;
};

const convertFileData = (data: FileComponentData & { src }) => {
  const src: FileSource = { url: data.url, custom: data.id };
  data.src = src;
};

const convertButtonData = (
  data: { button?: { settings; design }; styles; type; text; link },
  blockType: string
) => {
  const { settings, design } = data.button || {};
  const { borderRadius, borderWidth, background, color, borderColor } = design || {};
  const { buttonText, url, rel, target } = settings || {};
  data.styles = {
    borderRadius,
    borderWidth,
    backgroundColor: background,
    textColor: color,
    borderColor,
  };
  data.type = blockType === ACTION_BUTTON_TYPE ? ButtonData_Type.ACTION : ButtonData_Type.LINK;
  data.text = buttonText;
  if (url) {
    data.link = createLink({
      url,
      rel,
      target,
    });
  }
};

const convertHTMLData = data => {
  const { src, srcType } = data;
  data[srcType] = src;
};

const convertMapData = data => {
  const {
    isDraggingAllowed,
    isMarkerShown,
    isStreetViewControlShown,
    isZoomControlShown,
    locationDisplayName,
    isViewControlShown,
    zoom,
    mode,
  } = data.mapSettings;
  data.mapSettings.draggable = isDraggingAllowed;
  data.mapSettings.marker = isMarkerShown;
  data.mapSettings.streetViewControl = isStreetViewControlShown;
  data.mapSettings.zoomControl = isZoomControlShown;
  data.mapSettings.locationName = locationDisplayName;
  data.mapSettings.initialZoom = zoom;
  data.mapSettings.mapType = mode;

  if (has(data.mapSettings, 'isViewControlShown')) {
    data.mapSettings.viewModeControl = isViewControlShown;
  }
};

const convertEmbedData = (data: {
  html;
  description?;
  title?;
  thumbnail_url?;
  src;
  config;
  oembed;
}) => {
  const url = data.config?.link?.url;
  url && (data.src = url);
  data.oembed = {
    type: 'rich',
    thumbnailUrl: data.thumbnail_url,
    title: data.title,
    description: data.description,
    html: data.html,
  };
};

const convertLinkData = (data: { url: string; target?: string; rel?: string } & { link: Link }) => {
  data.link = createLink(data);
};

const kebabToConstantCase = (str: string) => str.toUpperCase().replace('-', '_');
