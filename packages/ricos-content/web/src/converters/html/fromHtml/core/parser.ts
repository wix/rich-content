import { flow, pipe } from 'fp-ts/function';
import * as A from 'fp-ts/Array';

import { Element, DocumentFragment } from 'parse5';
import { toAst, getChildNodes } from './ast-utils';
import { RichContent, Node, Decoration, Decoration_Type } from 'ricos-schema';
import { ContentNode, Context, Rule, ContainerStyle } from './models';
import { initializeMetadata, createDecoration, reduceDecorations } from '../../../nodeUtils';

const contextOf = (rules: Rule[], decorations: Decoration[], style: ContainerStyle): Context => ({
  visit: visit(rules, decorations, style),
  decorations: reduceDecorations(decorations),
  addDecoration: addDecoration(rules, decorations, style),
  setStyle: setStyle(rules, decorations),
  style,
});

const htmlToNodes = (rules: Rule[], decorations: Decoration[], style: ContainerStyle) => (
  node: ContentNode
): Node[] =>
  pipe(
    rules,
    A.filter(([_if]) => _if(node)),
    A.chain(([, then]) => then(contextOf(rules, decorations, style))(node))
  );

const addDecoration = (rules: Rule[], decorations: Decoration[], style: ContainerStyle) => (
  type: Decoration_Type,
  data: Omit<Decoration, 'type'> = {},
  element: Element
) => {
  const decoration = createDecoration(type, data);
  const innerElement = getChildNodes(element)[0] as ContentNode;
  return htmlToNodes(rules, [decoration, ...decorations], style)(innerElement);
};

const setStyle = (rules: Rule[], decorations: Decoration[]) => (element: Element) => (
  style: ContainerStyle
) => visit(rules, decorations, style)(element);

const visit = (rules: Rule[], decorations: Decoration[], style: ContainerStyle) => (
  element: Element | DocumentFragment
) => pipe(element, getChildNodes, A.chain(htmlToNodes(rules, decorations, style)));

const traverse = (rules: Rule[]) => visit(rules, [], { alignment: '' });

const toRichContent = (nodes: Node[]): RichContent => ({ nodes, metadata: initializeMetadata() });

export default (rules: Rule[]) => flow(toAst, traverse(rules), toRichContent, RichContent.fromJSON);
