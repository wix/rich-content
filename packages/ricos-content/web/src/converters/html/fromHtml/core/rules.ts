import { flow } from 'fp-ts/function';

import { TextNode, Element } from 'parse5';
import { Node_Type, Decoration_Type, ImageData, Decoration } from 'ricos-schema';
import { getAttributes, isText, toName, hasTag, oneOf } from './ast-utils';
import { Rule } from './models';
import {
  createTextNode,
  createParagraphNode,
  createHeadingNode,
  createNode,
  createLink,
} from '../../../nodeUtils';

export const identityRule: Rule = [() => true, ({ visit }) => (node: Element) => visit(node)];

export const textToText: Rule = [
  isText,
  context => (node: TextNode) => [createTextNode(node.value, context.decorations)],
];

export const pToParagraph: Rule = [
  hasTag('p'),
  context => (node: Element) => [createParagraphNode(context.visit(node))],
];

export const hToHeading: Rule = [
  flow(toName, /h[1-6]/.test.bind(/h[1-6]/)),
  context => (node: Element) => [
    createHeadingNode(context.visit(node), {
      level: Number(node.nodeName.replace('h', '')),
    }),
  ],
];

export const aToLink: Rule = [
  hasTag('a'),
  context => (node: Element) => {
    const attrs = getAttributes(node);
    return context.addDecoration(
      Decoration_Type.LINK,
      { linkData: { link: createLink({ ...attrs, url: attrs.href }) } },
      node
    );
  },
];

export const lToList: Rule = [
  oneOf(['ul', 'ol', 'li']),
  context => (node: Element) => [
    createNode(
      {
        ul: Node_Type.BULLET_LIST,
        ol: Node_Type.ORDERED_LIST,
        li: Node_Type.LIST_ITEM,
      }[node.nodeName],
      {
        nodes: context.visit(node),
        data: {},
      }
    ),
  ],
];

export const strongEmUToDecoration: Rule = [
  oneOf(['strong', 'em', 'u']),
  context => (node: Element) =>
    context.addDecoration(
      { strong: Decoration_Type.BOLD, em: Decoration_Type.ITALIC, u: Decoration_Type.UNDERLINE }[
        node.nodeName
      ],
      {},
      node
    ),
];

const toImageData = (decorations: Decoration[], node: Element): ImageData => {
  const attrs = getAttributes(node);
  return {
    image: {
      src: { url: attrs.src },
    },
    altText: attrs.alt,
    link: decorations
      .filter(({ type }) => type === Decoration_Type.LINK)
      .map(({ linkData }) => linkData?.link)[0],
  };
};

export const imgToImage: Rule = [
  hasTag('img'),
  context => (node: Element) => [
    createNode(Node_Type.IMAGE, { nodes: [], data: toImageData(context.decorations, node) }),
  ],
];
