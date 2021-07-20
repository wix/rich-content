import {
  DATA_FIELDS_MAP,
  isDataFieldName,
  isRichContent,
  isDecoration,
  isNode,
  isTextNode,
} from '../utils';
import { transform, isObject, pickBy } from 'lodash';
import { Node, Decoration, RichContent } from 'ricos-schema';
import { TO_RICOS_DATA_FIELD } from '../../draft/consts';
import { JSONContent } from '@tiptap/core';
import toCamelCase from 'to-camel-case';
import { fromEntries } from '../../../utils';

declare const a: RichContent;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const toTiptap = <T extends RichContent | Node | Record<string, any>>(
  richContent: T
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): T extends RichContent | Node ? JSONContent : Record<string, any> => {
  const jsonContent = isRichContent(richContent)
    ? RichContent.toJSON(richContent)
    : isNode(richContent)
    ? Node.toJSON(richContent)
    : JSON.parse(JSON.stringify(richContent)); // remove undefined values
  const { proseContent } = convertToProse({ proseContent: jsonContent });
  return proseContent;
};

const PROSE_DATA_FIELDS_MAP = fromEntries(
  Object.values(TO_RICOS_DATA_FIELD)
    .concat('textData')
    .map(value => [value, 'attrs'])
);
const FIELDS_MAP = {
  nodes: 'content',
  decorations: 'marks',
  ...PROSE_DATA_FIELDS_MAP,
};

const fieldMapper = (fieldName: string | number | symbol, value) =>
  isDataFieldName(fieldName, value) ? 'attrs' : FIELDS_MAP[fieldName] || fieldName;

const typeToCamelCase = (object: Node | Decoration) => ({
  ...object,
  type: toCamelCase(object.type),
});

const addDocType = (content: RichContent) => ({ type: 'doc', ...content });

const moveMetadata = ({ metadata, ...content }: RichContent) => ({
  ...content,
  attrs: { metadata },
});

const flattenTextData = (node: Node) => {
  const { textData, ...newNode } = node;
  return { ...newNode, ...textData };
};

const moveToData = (node: Node) => {
  const { style, key, ...rest } = node;
  const dataFieldName = DATA_FIELDS_MAP[node.type];
  const dataField = { ...node[dataFieldName], ...pickBy({ style, key }, x => x !== undefined) };
  return { ...rest, [dataFieldName]: dataField };
};

const convertValue = value => {
  let newValue = value;
  if (isRichContent(newValue)) {
    newValue = addDocType(newValue);
    newValue = moveMetadata(newValue);
  }
  if (isTextNode(newValue)) {
    newValue = flattenTextData(newValue);
  }
  if (isNode(newValue)) {
    newValue = moveToData(newValue);
  }
  if (isNode(newValue) || isDecoration(newValue)) {
    newValue = typeToCamelCase(newValue);
  }
  return newValue;
};

const convertToProse = obj => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return transform<any, any>(obj, (result, value, key) => {
    const convertedValue = convertValue(value);
    const convertedKey = fieldMapper(key, convertedValue);
    result[convertedKey] = isObject(convertedValue)
      ? convertToProse(convertedValue)
      : convertedValue;
  });
};
