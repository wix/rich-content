import { RichContent, Node, Decoration_Type, Node_Type, Decoration, TextData } from 'ricos-schema';

export const toHtml = (content: RichContent): string => `${nodeArrayToHtml(content.nodes, '\n')}`;

const nodeArrayToHtml = (nodes: Node[], separator = ''): string =>
  nodes.flatMap(nodeToHtml).join(separator);

const nodeToHtml = (node: Node): string | string[] => {
  if (node.type === Node_Type.TEXT && node.textData) {
    return decorateTextElement(node.textData);
  }
  if (node.type === Node_Type.PARAGRAPH && node.nodes.length === 0) {
    return EMPTY_PARAGRAPH;
  }
  let tag: string = NODE_TO_HTML_TAG[node.type];
  if (node.type === Node_Type.HEADING && node.headingData) {
    const { level } = node.headingData;
    tag = `h${level}`;
  }
  if (tag) {
    const children = nodeArrayToHtml(node.nodes);
    return createHtmlTag(tag, children);
  }
  return [];
};

const createHtmlAttrs = (decoration: Decoration): Record<string, string> => {
  switch (decoration.type) {
    case Decoration_Type.LINK:
      return decoration.linkData?.link?.url ? { href: decoration.linkData.link.url } : {};
    default:
      return {};
  }
};

const createHtmlTag = (tag: string, child: string, attrs: Record<string, string> = {}): string => {
  const prefix = tag === 'li' ? '\n  ' : '';
  const suffix = ['ul', 'ol'].includes(tag) ? '\n' : '';
  return `${prefix}<${tag}${attrsToString(attrs)}>${child}${suffix}</${tag}>`;
};

const attrsToString = (attrs: Record<string, string>): string =>
  Object.entries(attrs)
    .map(([key, value]) => ` ${key}="${value}"`)
    .join('');

const decorateTextElement = ({ text, decorations }: TextData): string =>
  decorations.reduce((child, decoration) => {
    const tag = DECORATION_TO_HTML_TAG[decoration.type];
    return tag ? createHtmlTag(tag, child, createHtmlAttrs(decoration)) : child;
  }, text);

const DECORATION_TO_HTML_TAG = {
  [Decoration_Type.BOLD]: 'strong',
  [Decoration_Type.ITALIC]: 'em',
  [Decoration_Type.UNDERLINE]: 'u',
  [Decoration_Type.LINK]: 'a',
};
const NODE_TO_HTML_TAG = {
  [Node_Type.BULLET_LIST]: 'ul',
  [Node_Type.ORDERED_LIST]: 'ol',
  [Node_Type.LIST_ITEM]: 'li',
  [Node_Type.PARAGRAPH]: 'p',
};

const EMPTY_PARAGRAPH = '<p><br /></p>';
