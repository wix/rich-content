import { Node_Type, RichContent } from 'ricos-schema';
import { getParagraphNode } from '../../draft/toDraft/decorationParsers';
import {
  parseGiphy,
  parseImage,
  parseLinkPreview,
  parseListNode,
  parseMap,
  parseTextNodes,
  parseAppEmbed,
  parseVideo,
  parseEmbed,
} from './convertNodes';

interface PlainTextOptions {
  urlShortener?: (url: string) => Promise<string>;
  getVideoUrl?: (fileId: string) => Promise<string>;
  delimiter?: string;
}

export const toPlainText = async (
  content: RichContent,
  options: PlainTextOptions = {}
): Promise<string> => {
  const ricosContent = RichContent.fromJSON(content);
  const { nodes } = ricosContent;
  const { urlShortener, getVideoUrl, delimiter = '\n' } = options;
  let plainText = '';

  const parseNodes = async (index = 0) => {
    const node = nodes[index];
    if (node) {
      if (index > 0) {
        plainText += delimiter;
      }
      switch (node.type) {
        case Node_Type.CODE_BLOCK:
        case Node_Type.PARAGRAPH:
        case Node_Type.HEADING:
          plainText += parseTextNodes(node);
          break;
        case Node_Type.BLOCKQUOTE:
          plainText += parseTextNodes(getParagraphNode(node));
          break;
        case Node_Type.ORDERED_LIST:
        case Node_Type.BULLET_LIST:
          plainText += parseListNode(node, delimiter);
          break;
        case Node_Type.IMAGE:
          plainText += await parseImage(node, delimiter, urlShortener);
          break;
        case Node_Type.VIDEO:
          plainText += await parseVideo(node, delimiter, getVideoUrl);
          break;
        case Node_Type.GIPHY:
          plainText += parseGiphy(node);
          break;
        case Node_Type.MAP:
          plainText += parseMap(node);
          break;
        case Node_Type.APP_EMBED:
          plainText += parseAppEmbed(node, delimiter);
          break;
        case Node_Type.LINK_PREVIEW:
          plainText += parseLinkPreview(node);
          break;
        case Node_Type.EMBED:
          plainText += parseEmbed(node);
          break;
        default:
      }
      await parseNodes(index + 1);
    }
  };

  await parseNodes();

  return plainText;
};
