import { pickBy, identity } from 'lodash';
/* eslint-disable fp/no-delete */
import { TextStyle, NodeStyle } from 'ricos-schema';
import { RicosEntityMap, RicosContentBlock } from '../../../types';
import { LINK_PREVIEW_TYPE, EMBED_TYPE } from '../../../consts';
import { TO_RICOS_DATA_FIELD, TO_RICOS_PLUGIN_TYPE } from '../consts';
import { convertBlockDataToRicos } from './convertRicosPluginData';

export const getEntity = (key: string | number, entityMap: RicosEntityMap) => {
  const { type, data } = entityMap[key];
  const blockType = type === LINK_PREVIEW_TYPE && data.html ? EMBED_TYPE : type;
  const dataFieldName = TO_RICOS_DATA_FIELD[blockType];
  if (dataFieldName === undefined) {
    console.error(`Unknown entity type "${blockType}"!`);
    return null;
  }

  return {
    type: TO_RICOS_PLUGIN_TYPE[blockType],
    [dataFieldName]: convertBlockDataToRicos(blockType, data),
  };
};

export const getTextStyle = (blockData?: RicosContentBlock['data']): TextStyle => {
  const { textAlignment, dynamicStyles } = blockData || {};
  const { 'line-height': lineHeight } = dynamicStyles || {};
  return { textAlignment: textAlignment?.toUpperCase(), lineHeight };
};

export const getNodeStyle = (blockData?: RicosContentBlock['data']): NodeStyle | undefined => {
  const { dynamicStyles } = blockData || {};
  const { 'padding-top': paddingTop, 'padding-bottom': paddingBottom, backgroundColor } =
    dynamicStyles || {};
  const style = pickBy({ paddingTop, paddingBottom, backgroundColor }, identity);
  const hasStyle = Object.values(style).length > 0;
  return hasStyle ? style : undefined;
};
