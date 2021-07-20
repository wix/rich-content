import { isNumber, isString, isArray, isObject } from 'lodash';
import { flow, pipe, identity } from 'fp-ts/lib/function';
import * as A from 'fp-ts/lib/Array';
import * as O from 'fp-ts/lib/Option';
import * as E from 'fp-ts/Either';
import { concatAll, first } from 'fp-ts/Semigroup';
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

const resolveFirstRight = <C, T>(
  candidate: C,
  defaultT: T,
  resolvers: [(candidate: C) => boolean, (candidate: unknown) => T][]
): T => {
  const firstRightSemi = E.getSemigroup<T, T>(first<T>());
  const concatFirstRightSemi = concatAll(firstRightSemi)(E.left(defaultT));
  return pipe(
    concatFirstRightSemi(
      pipe(
        resolvers,
        A.map(r =>
          pipe(
            candidate,
            E.fromPredicate(r[0], () => defaultT),
            E.map(r[1])
          )
        )
      )
    ),
    E.fold(identity, identity)
  );
};

const isTextData = (text: TextData) => !!text?.text && !!text?.decorations;

const toTextData = (text: string) => ({ text, decorations: [] } as TextData);

const isListItemData = (item: ListItemData) => isArray(item.text) && isObject(item.data);

const toListItemData = (data: ParagraphData) => (text: TextData[]) => ({ data, text });

const emptyListItemData: ListItemData = { text: [], data: {} };

export const toListDataArray = (
  items: string | TextData | ListItemData | (string | TextData | ListItemData)[],
  data: ParagraphData
): ListItemData[] =>
  resolveFirstRight(
    items,
    [],
    [
      [isString, flow(toTextData, A.of, toListItemData(data), A.of)],
      [isTextData, flow(A.of, toListItemData(data), A.of)],
      [isListItemData, i => [i] as ListItemData[]],
      [
        isArray,
        flow(
          A.map(item =>
            resolveFirstRight(item, emptyListItemData, [
              [isString, flow(toTextData, A.of, toListItemData(data))],
              [isTextData, flow(A.of, toListItemData(data))],
              [isListItemData, i => i as ListItemData],
            ])
          )
        ),
      ],
    ]
  );

export const toTextDataArray = (text?: string | TextData | (string | TextData)[]): TextData[] =>
  resolveFirstRight(
    text,
    [],
    [
      [isString, flow(toTextData, A.of)],
      [isTextData, t => [t] as TextData[]],
      [isArray, flow(A.map(t => resolveFirstRight(t, t, [[isString, toTextData]]) as TextData))],
    ]
  );
