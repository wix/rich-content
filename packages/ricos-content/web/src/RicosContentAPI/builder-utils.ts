import { has, isNumber, isString, isArray } from 'lodash';
import { flow } from 'fp-ts/function';
import * as A from 'fp-ts/Array';
import * as O from 'fp-ts/Option';
import { ParagraphData, RichContent, TextData, Node } from 'ricos-schema';
import { task, either, firstResolved } from '../fp-utils';
import { ListItemData } from '../types';

// predicates
const isIndexFound = either(i => i !== -1);

const findIndex = predicate =>
  flow(
    A.findIndex(predicate),
    O.getOrElse(() => -1)
  );

const isIndexInRange = either(
  ({ content, index }: { content: RichContent; index?: number }) =>
    isNumber(index) && index >= 0 && index < content.nodes.length
);

// content transformers
const appendNode = (node: Node, content: RichContent) =>
  task.of({
    ...content,
    nodes: [...content.nodes, node],
  });

const insertNode = (content: RichContent, node: Node) => (index: number) =>
  isIndexInRange({ content, index }).map(() => ({
    ...content,
    nodes: [...content.nodes.slice(0, index), node, ...content.nodes.slice(index)],
  }));

const insertNodeByKey = (content: RichContent, node: Node, nodeKey: string, isAfter?: boolean) =>
  isIndexFound(findIndex(({ key }) => key === nodeKey)(content.nodes))
    .map((index: number) => (isAfter ? index + 1 : index))
    .chain(insertNode(content, node));

export const removeNode = (nodeKey: string, content: RichContent) => ({
  ...content,
  nodes: content.nodes.filter(({ key }) => key !== nodeKey),
});

export function addNode({
  node,
  index,
  before,
  after,
  content,
}: {
  node: Node;
  index?: number;
  before?: string;
  after?: string;
  content: RichContent;
}): RichContent {
  return firstResolved([
    insertNode(content, node)(<number>index),
    insertNodeByKey(content, node, <string>before),
    insertNodeByKey(content, node, <string>after, true),
    appendNode(node, content),
  ]);
}

const isTextData = text => has(text, 'text') && has(text, 'decorations');

const toArray = t => [t];

const toTextData = text => ({ text, decorations: [] });

const toListItemData = (data: ParagraphData) => (text: TextData[]) => ({ data, text });

export function toListDataArray(
  items: string | TextData | ListItemData | (string | TextData | ListItemData)[],
  data: ParagraphData
): ListItemData[] {
  return firstResolved([
    either(isString)(items).map(flow(toTextData, toArray, toListItemData(data), toArray)),
    either(isTextData)(items).map(flow(toArray, toListItemData(data), toArray)),
    either(isArray)(items).map(
      A.map(item =>
        firstResolved([
          either(isString)(item).map(flow(toTextData, toArray, toListItemData(data))),
          either(isTextData)(item).map(flow(toArray, toListItemData(data))),
          task.of(item),
        ])
      )
    ),
    task.of([]),
  ]);
}
export function toTextDataArray(text?: string | TextData | (string | TextData)[]): TextData[] {
  return firstResolved([
    either(isString)(text).map(flow(toTextData, toArray)),
    either(isTextData)(text).map(toArray),
    either(isArray)(text).map(A.map(t => (isString(t) ? toTextData(t) : t))),
    task.of([]),
  ]);
}
