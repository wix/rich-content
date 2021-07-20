import { transform, isObject, pickBy } from 'lodash';
import { RichContent, Node } from 'ricos-schema';
import { JSONContent } from '@tiptap/core';
import { initializeMetadata } from '../../nodeUtils';
import { DATA_FIELDS_MAP, isDecoration, isNode, isProseContent, isTextNode } from '../utils';
import toConstantCase from 'to-constant-case';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const fromTiptap = <T extends JSONContent | Record<string, any>>(
  proseContent: T
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): T extends JSONContent ? RichContent | Node : Record<string, any> => {
  let { richContent } = convertFromProse({ richContent: proseContent });
  richContent = removeIdFromData(richContent);
  return richContent;
};

const FIELDS_MAP = {
  content: 'nodes',
  marks: 'decorations',
};

const typeToConstantCase = object => ({ ...object, type: toConstantCase(object.type) });

const removeIdFromData = value => {
  const { id: _, ...newValue } = value;
  return isNode(value) ? value : newValue;
};

const removeDocType = ({ type: _, ...content }: JSONContent) => content;

const addMetadata = ({ attrs, ...content }: JSONContent) => ({
  metadata: attrs?.metadata || initializeMetadata(),
  ...content,
});

const moveTextData = object => {
  const { marks, text, attrs, ...newValue } = object;
  return { ...newValue, attrs: { ...attrs, marks, text } };
};

const convertDataField = object => {
  const dataField = DATA_FIELDS_MAP[object.type];
  const { attrs, ...newValue } = object;
  return { ...newValue, ...(attrs ? { [dataField]: attrs } : {}) };
};

const movefromAttrs = (object: JSONContent) => {
  const { attrs, ...newValue } = object;
  const { style, id, ...rest } = attrs || {};
  const newAttrs = Object.keys(rest).length > 0 ? rest : undefined;
  return pickBy({ ...newValue, attrs: newAttrs, style, id }, x => x !== undefined);
};

const convertValue = value => {
  let newValue = value;
  if (isProseContent(newValue)) {
    newValue = removeDocType(newValue);
    newValue = addMetadata(newValue);
  }
  if (isTextNode(newValue)) {
    newValue = moveTextData(newValue);
  }
  if (isNode(newValue)) {
    newValue = movefromAttrs(newValue);
  }
  if (isNode(newValue) || isDecoration(newValue)) {
    newValue = typeToConstantCase(newValue);
    newValue = convertDataField(newValue);
  }
  return newValue;
};

const convertFromProse = obj => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return transform<any, any>(obj, (result, value, key) => {
    const convertedValue = convertValue(value);
    const convertedKey = FIELDS_MAP[key] || key;
    result[convertedKey] = isObject(convertedValue)
      ? convertFromProse(convertedValue)
      : convertedValue;
  });
};
