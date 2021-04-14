/* eslint-disable fp/no-delete */
import { Node, Node_Type, ButtonData_Type } from 'ricos-schema';
import {
  RICOS_NODE_TYPE_TO_DATA_FIELD,
  ENTITY_DECORATION_TO_MUTABILITY,
  FROM_RICOS_ENTITY_TYPE,
  TO_RICOS_DECORATION_TYPE,
} from '../consts';
import { ACTION_BUTTON_TYPE, LINK_BUTTON_TYPE, RicosEntity, RicosEntityMap } from '../../..';
import { DraftTypedDecoration } from './decorationParsers';
import { convertDecorationToDraftData, convertNodeToDraftData } from './convertDraftPluginData';

const getNodeEntityData = (node: Node) => {
  const { type } = node;
  let draftPluginType = FROM_RICOS_ENTITY_TYPE[type];
  if (type === Node_Type.BUTTON) {
    draftPluginType =
      node.buttonData?.type === ButtonData_Type.ACTION ? ACTION_BUTTON_TYPE : LINK_BUTTON_TYPE;
  }
  const data = convertNodeToDraftData(node);
  if (data === undefined) {
    // eslint-disable-next-line no-console
    console.error(`ERROR! Unknown entity type "${type}"!`);
    process.exit(1);
  }
  return { type: draftPluginType, data };
};

export const createDecorationEntityData = (
  decoration: DraftTypedDecoration,
  entityKey: number
): RicosEntityMap => {
  const { type, emojiData } = decoration;

  const data =
    emojiData ||
    convertDecorationToDraftData({
      ...decoration,
      type: TO_RICOS_DECORATION_TYPE[type],
    });
  if (data === undefined) {
    // eslint-disable-next-line no-console
    console.error(`ERROR! Unknown entity type "${type}"!`);
    process.exit(1);
  }

  const mutability = ENTITY_DECORATION_TO_MUTABILITY[type];

  return createEntity(entityKey, { type, mutability, data });
};

export const createAtomicEntityData = (node: Node, entityKey: number): RicosEntityMap => {
  const { type, data } = getNodeEntityData(node);
  return createEntity(entityKey, { type, mutability: 'IMMUTABLE', data });
};

export const createTextBlockData = (node: Node) => {
  const { textStyle, indentation } = node[RICOS_NODE_TYPE_TO_DATA_FIELD[node.type]] || {};
  const { textAlignment, paddingTop, paddingBottom, lineHeight } = textStyle || {};
  return JSON.parse(
    JSON.stringify({
      textAlignment: textAlignment !== 'AUTO' ? textAlignment?.toLowerCase() : undefined,
      dynamicStyles: (paddingTop || paddingBottom || lineHeight) && {
        'padding-top': paddingTop,
        'padding-bottom': paddingBottom,
        'line-height': lineHeight,
      },
      depth: indentation,
    })
  );
};

const createEntity = (key: number, { type, mutability, data }: RicosEntity): RicosEntityMap => {
  return { [key.toString()]: { type, mutability, data } };
};
