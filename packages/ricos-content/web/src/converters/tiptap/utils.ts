import { JSONContent } from '@tiptap/core';
import { capitalize } from 'lodash';
import { Decoration, Node, Node_Type, RichContent } from 'ricos-schema';
import { DraftContent } from '../../types';
import { IMAGE_TYPE } from '../../consts';
import { RICOS_NODE_TYPE_TO_DATA_FIELD } from '../draft/consts';
import { DECORATION_TYPES, NODE_MAP, NODE_TYPES } from './consts';
import toCamelCase from 'to-camel-case';
import toConstantCase from 'to-constant-case';

const TYPES = [...NODE_TYPES, ...DECORATION_TYPES];

export const isTextNode = (object): boolean =>
  object?.type?.toUpperCase() === Node_Type.TEXT && ('text' in object || 'textData' in object);

const isParagraphNode = (object): boolean => object?.type?.toUpperCase() === Node_Type.PARAGRAPH;

const hasData = (object): boolean =>
  RICOS_NODE_TYPE_TO_DATA_FIELD[object?.type] in object || 'attrs' in object;

const hasChildren = (object): boolean => 'nodes' in object || 'content' in object;

const hasChildrenOrData = (object): boolean =>
  NODE_MAP[toConstantCase(object?.type || '')] && (hasChildren(object) || hasData(object));

export const isNode = (object): object is Node =>
  isTextNode(object) || isParagraphNode(object) || hasChildrenOrData(object);

export const isDecoration = (object): object is Decoration =>
  DECORATION_TYPES.includes(object?.type?.toUpperCase());

export const isRichContent = (object): object is RichContent => !!object?.nodes && !isNode(object);

export const isProseContent = (object): object is JSONContent =>
  !!object?.content && !isNode(object);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getImageNode = <T extends { content?: any; nodes?: any }>({
  content,
  nodes,
}: T): T extends RichContent ? Node : T extends JSONContent ? JSONContent : undefined =>
  (nodes || content).find(({ type }) => type.toUpperCase() === Node_Type.IMAGE) || {};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getImageBlockData = (content: DraftContent): any =>
  Object.values(content.entityMap).find(({ type }) => type === IMAGE_TYPE)?.data;

export const isDataFieldName = (fieldName: string | number | symbol, value) =>
  value?.key && fieldName.toString().includes('Data');

export const toDataFieldName = (type: string) =>
  toCamelCase(type)
    .split('_')
    .map((str, index) => (index === 0 ? str : capitalize(str)))
    .join('')
    .concat('Data');

export const DATA_FIELDS_MAP = TYPES.reduce(
  (map, type) => ({ ...map, [type]: toDataFieldName(type) }),
  {}
);
