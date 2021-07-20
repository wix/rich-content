import { cloneDeep, mapValues } from 'lodash';
import { processContentState } from './processContentState';
import {
  IMAGE_TYPE,
  VIDEO_TYPE,
  LINK_TYPE,
  GALLERY_TYPE,
  VIDEO_TYPE_LEGACY,
  IMAGE_TYPE_LEGACY,
  VERTICAL_EMBED_TYPE,
} from '../consts';
import {
  linkDataNormalizer,
  imageDataNormalizer,
  galleryDataNormalizer,
  videoDataNormalizer,
  verticalEmbedDataNormalizer,
} from './dataNormalizers';
import { ComponentData, DraftContent, NormalizeConfig, RicosEntity } from '../types';

const dataNormalizers: {
  [entityType: string]: (
    componentData: Record<string, unknown>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    config?: { [key: string]: any },
    version?: string
  ) => Record<string, unknown>;
} = {
  [LINK_TYPE]: linkDataNormalizer,
  [IMAGE_TYPE]: imageDataNormalizer,
  [GALLERY_TYPE]: galleryDataNormalizer,
  [VIDEO_TYPE]: videoDataNormalizer,
  [VERTICAL_EMBED_TYPE]: verticalEmbedDataNormalizer,
};

const normalizeComponentData = (
  type: RicosEntity['type'],
  componentData: ComponentData,
  config: NormalizeConfig,
  version: string
) => dataNormalizers[type](componentData, config, version);

/* eslint-disable */

// TODO: create configNormalizers map and separate the IMAGE and VIDEO normalizers
const normalizeComponentConfig = (componentData: ComponentData) => {
  if (componentData.config) {
    return componentData;
  }

  const config: ComponentData['config'] = {};
  const { alignment, size, src, oembed } = componentData;
  if (alignment) {
    delete componentData.alignment;
    config.alignment = alignment;
    config.size = 'small';
  } else {
    if (size) {
      delete componentData.size;
      if (size === 'smallCenter') {
        config.size = 'small';
        config.alignment = 'center';
      } else if (size === 'fullWidth') {
        config.size = 'fullWidth';
        config.alignment = 'center';
      }
    } else {
      config.size = src && src.width && src.width <= 740 ? 'original' : 'content';
      config.alignment = 'center';
    }
  }
  const patch: ComponentData = { config };

  if (oembed) {
    delete componentData.url;
    delete componentData.oembed;
    patch.src = oembed.video_url;
    patch.metadata = { oembed };
  }

  return { ...componentData, ...patch };
};
/* eslint-enable */

const entityTypeMap = {
  configNormalization: {
    [IMAGE_TYPE_LEGACY]: IMAGE_TYPE,
    [VIDEO_TYPE_LEGACY]: VIDEO_TYPE,
  },
  dataNormalization: {
    [LINK_TYPE]: LINK_TYPE,
    [IMAGE_TYPE]: IMAGE_TYPE,
    [GALLERY_TYPE]: GALLERY_TYPE,
    [VIDEO_TYPE]: VIDEO_TYPE,
    [VERTICAL_EMBED_TYPE]: VERTICAL_EMBED_TYPE,
  },
};

const shouldNormalizeEntity = (
  entity: RicosEntity,
  normalizationMap: { [legacyType: string]: string }
) => Object.keys(normalizationMap).includes(entity.type) && entity.data;

const shouldNormalizeEntityConfig = (entity: RicosEntity) =>
  shouldNormalizeEntity(entity, entityTypeMap.configNormalization);

const shouldNormalizeEntityData = (entity: RicosEntity) =>
  shouldNormalizeEntity(entity, entityTypeMap.dataNormalization);

const normalizeEntityMap = (
  entityMap: DraftContent['entityMap'],
  config: NormalizeConfig,
  stateVersion: string
) => {
  const normalizeType = (key: string, obj: { [legacyType: string]: string }) => obj[key] || key;

  return mapValues(entityMap, entity => {
    let newEntity = entity;
    if (shouldNormalizeEntityConfig(entity)) {
      newEntity = {
        ...entity,
        type: normalizeType(entity.type, entityTypeMap.configNormalization),
        data: normalizeComponentConfig(entity.data),
      };
    } else if (shouldNormalizeEntityData(entity)) {
      newEntity = {
        ...entity,
        type: normalizeType(entity.type, entityTypeMap.dataNormalization),
        data: normalizeComponentData(entity.type, entity.data, config, stateVersion),
      };
    }
    convertAnchorToLinkToUndoOneAppFix(newEntity);
    return newEntity;
  });
};

const isTextAnchor = (entity: RicosEntity) => entity.type === 'ANCHOR';
const isImageAnchor = (entity: RicosEntity) =>
  entity.type === 'wix-draft-plugin-image' &&
  !!entity.data?.config?.anchor &&
  !entity.data?.config?.link;

const convertAnchorToLinkToUndoOneAppFix = (newEntity: RicosEntity) => {
  if (isTextAnchor(newEntity)) {
    newEntity.type = 'LINK';
  } else if (isImageAnchor(newEntity)) {
    const { anchor, ...rest } = newEntity.data.config;
    newEntity.data = {
      ...newEntity.data,
      config: {
        ...rest,
        link: { anchor },
      },
    };
  }
};

export default (content: DraftContent, config: NormalizeConfig = {}): DraftContent => {
  const { blocks, entityMap, VERSION } = processContentState(cloneDeep(content), config);
  return {
    blocks,
    entityMap: normalizeEntityMap(entityMap, config, content.VERSION || '0.0.0'),
    VERSION,
  };
};
