import { flow, identity } from 'fp-ts/function';
import { MonoidAll, MonoidAny } from 'fp-ts/boolean';

import { Element, TextNode, serialize } from 'parse5';
import { ContentNode } from '../core/models';
import {
  isText,
  isLeaf,
  hasDescendant,
  appendChild,
  hasTag,
  oneOf,
  AstRule,
  toAst,
  hasChild,
} from '../core/ast-utils';
import { partitionBy } from '../../../nodeUtils';
import traverse from '../core/ast-traversal';
import { concatApply, not } from '../../../../fp-utils';

const addParagraph = (parentNode: Element) => (): ContentNode => ({
  nodeName: 'p',
  tagName: 'p',
  childNodes: [],
  parentNode,
  attrs: parentNode.attrs,
  namespaceURI: parentNode.namespaceURI,
});

const containerPToDiv: AstRule = [
  concatApply(MonoidAll)([hasTag('p'), hasDescendant(oneOf(['img', 'iframe', 'ol', 'ul']))]),
  (node: Element) => ({
    ...node,
    tagName: 'div',
    nodeName: 'div',
    childNodes: partitionBy<ContentNode>(
      hasDescendant(oneOf(['img', 'iframe', 'ol', 'ul'])),
      hasTag('p'),
      identity,
      addParagraph(node),
      appendChild
    )(node.childNodes),
  }),
];

const leafParagraphToDiv: AstRule = [
  concatApply(MonoidAll)([isLeaf, hasTag('p')]),
  (node: Element) => ({
    ...node,
    tagName: 'div',
    nodeName: 'div',
  }),
];

const cleanListItemPadding: AstRule = [
  hasTag('li'),
  (node: Element) => ({
    ...node,
    childNodes: (node.childNodes as Element[]).filter(
      n => !isText(n) || (<TextNode>n).value.trim() !== ''
    ),
  }),
];

const cleanListPadding: AstRule = [
  oneOf(['ol', 'ul']),
  (node: Element) => ({
    ...node,
    childNodes: (node.childNodes as Element[]).filter(not(isText)),
  }),
];

const wrapTextUnderLi: AstRule = [
  concatApply(MonoidAll)([hasTag('li'), hasChild(isText)]),
  (node: Element) => ({
    ...node,
    childNodes: partitionBy<ContentNode>(
      concatApply(MonoidAny)([hasTag('p'), hasDescendant(oneOf(['img', 'iframe', 'ol', 'ul']))]),
      hasTag('p'),
      identity,
      addParagraph(node),
      appendChild
    )(node.childNodes),
  }),
];

export const preprocess = flow(
  toAst,
  traverse(leafParagraphToDiv),
  traverse(cleanListItemPadding),
  traverse(cleanListPadding),
  traverse(containerPToDiv),
  traverse(wrapTextUnderLi),
  serialize
);
