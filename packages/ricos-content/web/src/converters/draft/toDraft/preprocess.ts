import { identity, flow } from 'fp-ts/function';
import * as E from 'fp-ts/Either';
import { RichContent, Node_Type, Node } from 'ricos-schema';
import { modify } from '../../../RicosContentAPI/modify';
import { extract } from '../../../RicosContentAPI/extract';
import { createNode, partitionBy } from '../../nodeUtils';

// scapegoat
const decomposeListItem = (node: Node): Node[] =>
  partitionBy<Node>(
    ({ type }) =>
      ![Node_Type.PARAGRAPH, Node_Type.ORDERED_LIST, Node_Type.BULLET_LIST].includes(type), // anything but paragraph or list is a separator
    ({ type }) => type === Node_Type.BULLET_LIST, // partition is a bullet list
    identity, // separator added as is
    () =>
      createNode(Node_Type.BULLET_LIST, {
        nodes: [createNode(Node_Type.LIST_ITEM, { nodes: [], data: {} })],
        data: {},
      }), // partition initialization
    (list, paragraphOrList) => list.nodes[0].nodes.push(paragraphOrList)
  )(node.nodes[0]?.nodes || []);

// decompose list items resulted by splitUnsupportedLists
const decomposeUnsupportedListItems = (content: RichContent) =>
  modify(content)
    .filter(({ type }) => type === Node_Type.ORDERED_LIST)
    .filter(
      ({ nodes }) =>
        nodes.length === 1 &&
        nodes[0].nodes.filter(
          ({ type }) =>
            ![Node_Type.PARAGRAPH, Node_Type.ORDERED_LIST, Node_Type.BULLET_LIST].includes(type)
        ).length > 0
    )
    .set(decomposeListItem);

// segregat oves ab haedis
const splitList = (list: Node): Node[] =>
  partitionBy<Node>(
    li =>
      li.nodes.filter(
        ({ type }) =>
          ![Node_Type.PARAGRAPH, Node_Type.ORDERED_LIST, Node_Type.BULLET_LIST].includes(type)
      ).length > 0, // separator is a list item with unsupported nodes
    n => n.type === Node_Type.BULLET_LIST, // partition is an empty bullet list
    n => createNode(Node_Type.ORDERED_LIST, { nodes: [n], data: {} }), // separator list item wrapped with ordered list
    () => createNode(Node_Type.BULLET_LIST, { nodes: [], data: {} }), // new partition
    (list, item) => list.nodes.push(item) // add valid list item to partition
  )(list.nodes);

// find lists whose items contain some non-paragraphs or non-lists
const getListToSplitKeys = content =>
  extract(content.nodes)
    .filter(({ type }) => type === Node_Type.BULLET_LIST || type === Node_Type.ORDERED_LIST)
    .map(({ key, nodes }) => ({ key, nodes: nodes.flatMap(n => n.nodes) }))
    .filter(
      ({ nodes }) =>
        nodes.filter(
          ({ type }) =>
            ![Node_Type.PARAGRAPH, Node_Type.ORDERED_LIST, Node_Type.BULLET_LIST].includes(type)
        ).length > 0
    )
    .map(({ key }) => key)
    .get();

// separate legit draft list items from unsupported ones (containing anything except paragraphs and nested lists)
const splitUnsupportedLists = (content: RichContent): E.Either<RichContent, RichContent> => {
  const listToSplitKeys = getListToSplitKeys(content);
  // Either used for short-circuiting of decomposeUnsupportedListItems, if nothing was splitted
  return listToSplitKeys.length > 0
    ? E.right(
        modify(content)
          .filter(({ key }) => listToSplitKeys.includes(key))
          .set(splitList)
      )
    : E.left(content);
};

const newLine: Node = {
  type: Node_Type.TEXT,
  key: '',
  nodes: [],
  textData: { text: '\n', decorations: [] },
};

const mergeAdjasentParagraphs = (node: Node): Node => {
  return {
    ...node,
    nodes: partitionBy<Node>(
      ({ type }) => type !== Node_Type.PARAGRAPH, // any non-paragraph is separator
      ({ type }) => type === Node_Type.PARAGRAPH, // paragraph is partition
      identity, // seprator added as is to result partition array
      node => ({ ...node, nodes: [] }), // empty paragraph is a new partition
      // paragraph nodes appended to partition nodes, separated by \n
      (pred, curr) =>
        (pred.nodes = pred.nodes.concat(pred.nodes.length > 0 ? [newLine] : []).concat(curr.nodes))
    )(node.nodes),
  };
};

// merge any adjasent paragraphs into a single paragraph
const mergeListParagraphNodes = (content: RichContent) =>
  modify(content)
    .filter(({ type }) => type === Node_Type.LIST_ITEM)
    .filter(({ nodes }) => nodes.filter(({ type }) => type === Node_Type.PARAGRAPH).length > 1)
    .set(mergeAdjasentParagraphs);

export default flow(
  mergeListParagraphNodes,
  splitUnsupportedLists,
  E.map(decomposeUnsupportedListItems),
  E.fold(identity, identity)
);
