import { DATA_FIELDS_MAP } from './../utils';
import { transform, isObject, merge } from 'lodash';
import { Node, Decoration, RichContent } from 'ricos-schema';
import { TO_RICOS_DATA_FIELD } from '../../draft/consts';
import { JSONContent } from '@tiptap/core';
import { isDecoration, isNode } from '../utils';

export const toProseMirror = (richContent: RichContent): JSONContent => {
  const content: JSONContent = {
    type: 'doc',
    ...convertToProse(RichContent.toJSON(richContent)),
  };
  return content;
};

const PROSE_DATA_FIELDS_MAP = Object.fromEntries(
  Object.values(TO_RICOS_DATA_FIELD)
    .concat('textData')
    .map(value => [value, 'attrs'])
);
const FIELDS_MAP = {
  nodes: 'content',
  decorations: 'marks',
  ...PROSE_DATA_FIELDS_MAP,
};

const typeToLower = (object: Node | Decoration) => ({ ...object, type: object.type.toLowerCase() });

const flattenTextData = (node: Node) => {
  const { textData, ...newNode } = node;
  return { ...newNode, ...textData };
};

const styleAsData = value => {
  const { style, ...rest } = value;
  const dataField = DATA_FIELDS_MAP[value.type];
  return merge({ [dataField]: { style } }, rest);
};

const convertValue = value => {
  let newValue = value;
  if (isNode(newValue) && newValue.style) {
    newValue = styleAsData(newValue);
  }
  if (isNode(newValue) || isDecoration(newValue)) {
    newValue = typeToLower(newValue);
  }
  if (newValue?.textData) {
    newValue = flattenTextData(newValue);
  }
  return newValue;
};

const convertToProse = obj => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return transform<any, any>(obj, (result, value, key) => {
    const convertedValue = convertValue(value);
    const convertedKey = FIELDS_MAP[key] || key;
    result[convertedKey] = isObject(convertedValue)
      ? convertToProse(convertedValue)
      : convertedValue;
  });
};
