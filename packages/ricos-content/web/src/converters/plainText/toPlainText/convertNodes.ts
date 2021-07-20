import { Node, Node_Type } from 'ricos-schema';
import { LINK_TYPE } from '../../../consts';
import { mergeTextNodes, RangedDecoration } from '../../draft/toDraft/decorationParsers';

export const parseTextNodes = (node: Node) => {
  const {
    text,
    decorationMap: { [LINK_TYPE]: linkDecorations },
  } = mergeTextNodes(node.nodes);
  const textWithLinks = addLinksToText(text, linkDecorations);
  return removeTrailingNewLine(textWithLinks);
};

const getListSymbol = (index: number, type: Node_Type) =>
  type === Node_Type.ORDERED_LIST ? index + 1 + '. ' : '• ';

const parseList = (listNode: Node): { type: Node_Type; item: string }[] =>
  listNode.nodes
    .map(({ nodes: [paragraph, childNode] }) => {
      return [
        { type: listNode.type, item: parseTextNodes(paragraph) },
        childNode ? parseList(childNode) : [],
      ];
    })
    .flat(2);

export const parseListNode = (node: Node, delimiter: string) =>
  parseList(node)
    .map(({ type, item }, index) => getListSymbol(index, type) + item)
    .join(delimiter);

export const addLinksToText = (text: string, linkDecorations: RangedDecoration[] = []) =>
  linkDecorations
    .sort((a, b) => a.end - b.end)
    .reduce(
      (newText, link) =>
        insertInText(
          newText,
          link.end + newText.length - text.length + 1,
          `(${link.linkData?.link?.url})`
        ),
      text
    );

const insertInText = (text: string, pos: number, insertedText: string) =>
  text.substring(0, pos) + insertedText + text.substring(pos);

const removeTrailingNewLine = (text: string) =>
  text.endsWith('\n') ? text.substring(0, text.length - 1) : text;

export const parseImage = async (
  { imageData }: Node,
  delimiter: string,
  urlShortener?: (url: string) => Promise<string>
): Promise<string> => {
  const { caption } = imageData || {};
  const { src, width, height } = imageData?.image || {};
  let url = `https://static.wixstatic.com/media/${src?.custom?.replace('media/', '')}`;
  if (urlShortener) {
    url = await urlShortener(url);
  }
  return [caption, url].filter(Boolean).join(delimiter);
};

const getDefaultVideoUrl = async (fileId: string) => `https://video.wixstatic.com/${fileId}`;

export const parseVideo = async (
  { videoData }: Node,
  delimiter: string,
  getVideoUrl: (fileId: string) => Promise<string> = getDefaultVideoUrl
): Promise<string> => {
  const { video, title } = videoData || {};
  const { custom, url } = video?.src || {};
  const videoUrl = (custom ? getVideoUrl(custom) : url) || '';
  return title ? title + delimiter + videoUrl : videoUrl;
};

export const parseGiphy = ({ giphyData }: Node): string => {
  const { originalUrl } = giphyData?.gif || {};
  return originalUrl || '';
};

export const parseMap = ({ mapData }: Node): string => {
  const { address } = mapData?.mapSettings || {};
  return address || '';
};

export const parseAppEmbed = ({ appEmbedData }: Node, delimiter: string): string => {
  const { url, name } = appEmbedData || {};
  return [name, url].filter(Boolean).join(delimiter);
};

export const parseLinkPreview = ({ linkPreviewData }: Node): string => {
  const { url } = linkPreviewData?.link || {};
  return url || '';
};

export const parseEmbed = ({ embedData }: Node, delimiter?: string): string => {
  return [embedData?.oembed?.title, embedData?.src].filter(Boolean).join(delimiter);
};
