import { pipe } from 'fp-ts/function';
import { merge } from 'lodash';
import {
  TextStyle_TextAlignment,
  Node_Type,
  NodeStyle,
  ParagraphData,
  CodeBlockData,
  DividerData,
  FileData,
  GalleryData,
  GiphyData,
  HTMLData,
  ImageData,
  ButtonData,
  LinkPreviewData,
  MapData,
  Node,
  Decoration,
  Metadata,
  Decoration_Type,
  HeadingData,
  PollData,
  TextData,
  VideoData,
  LATEST_VERSION,
  Link,
  Link_Target,
} from 'ricos-schema';
import { genKey } from './generateRandomKey';
import { toUpperCase, replace } from '../fp-utils';
import { fromEntries } from '../utils';

export const createNode = <TData>(
  type: Node_Type,
  {
    nodes,
    data,
    style,
    key,
  }: {
    nodes: Node[];
    data: TData;
    style?: NodeStyle;
    key?: string;
  }
): Node => ({
  type,
  key: key ?? genKey(),
  nodes,
  ...dataByNodeType(type, data),
  style,
});

export const dataByNodeType = (type: Node_Type, data: unknown) =>
  ({
    [Node_Type.CODE_BLOCK]: { codeBlockData: data as CodeBlockData },
    [Node_Type.DIVIDER]: { dividerData: data as DividerData },
    [Node_Type.HEADING]: { headingData: data as HeadingData },
    [Node_Type.FILE]: { fileData: data as FileData },
    [Node_Type.GALLERY]: { galleryData: data as GalleryData },
    [Node_Type.GIPHY]: { giphyData: data as GiphyData },
    [Node_Type.HTML]: { htmlData: data as HTMLData },
    [Node_Type.IMAGE]: { imageData: data as ImageData },
    [Node_Type.BUTTON]: { buttonData: data as ButtonData },
    [Node_Type.LINK_PREVIEW]: { LinkPreviewData: data as LinkPreviewData },
    [Node_Type.MAP]: { mapData: data as MapData },
    [Node_Type.PARAGRAPH]: { paragraphData: data as ParagraphData },
    [Node_Type.POLL]: { pollData: data as PollData },
    [Node_Type.TEXT]: { textData: data as TextData },
    [Node_Type.VIDEO]: { videoData: data as VideoData },
  }[type]);

export const createParagraphNode = (
  nodes: Node[] = [],
  data?: ParagraphData,
  style?: NodeStyle
): Node =>
  createNode(Node_Type.PARAGRAPH, {
    nodes,
    data: {
      textStyle: { textAlignment: TextStyle_TextAlignment.AUTO },
      ...data,
    },
    style,
  });

export const createTextNode = (text: string, decorations: Decoration[] = []): Node =>
  createNode(Node_Type.TEXT, { nodes: [], data: { text, decorations } });

export const createHeadingNode = (nodes: Node[] = [], data: HeadingData): Node =>
  createNode(Node_Type.HEADING, {
    nodes,
    data: {
      textStyle: { textAlignment: TextStyle_TextAlignment.AUTO },
      ...data,
    },
  });

export const createDecoration = (
  type: Decoration_Type,
  data: Omit<Decoration, 'type'> = {}
): Decoration => ({ type, ...data });

export const initializeMetadata = (version?: number): Metadata => ({
  version: version || LATEST_VERSION,
  createdTimestamp: new Date(),
  updatedTimestamp: new Date(),
});

type DecorationMap = Record<Decoration_Type, Decoration>;

export const reduceDecorations = (decorations: Decoration[]): Decoration[] => {
  const reducedDecorationsMap: DecorationMap = decorations.reduce(
    (decorationMap, { type, ...data }) => {
      const currentDecoration: Decoration = decorationMap[type] || { type };
      const nextDecoration: Decoration = { type, ...data };
      return {
        ...decorationMap,
        [type]: merge(currentDecoration, nextDecoration),
      };
    },
    {} as DecorationMap
  );
  const reducedDecorations = Object.values(reducedDecorationsMap);
  return reducedDecorations;
};

export const toLinkTarget = (target = 'SELF') => pipe(target, toUpperCase, replace('_', ''));

export const createLink = ({
  url,
  rel,
  target,
  anchor,
}: {
  url?: string;
  rel?: string;
  target?: string;
  anchor?: string;
}): Link => {
  const relValues: [string, boolean][] =
    rel
      ?.split(' ')
      .filter(key => ['nofollow', 'sponsored', 'ugc'].includes(key))
      .map(key => [key, true]) || [];
  return {
    anchor,
    url,
    rel: relValues.length > 0 ? fromEntries(relValues) : undefined,
    target: toLinkTarget(target) as Link_Target,
  };
};

export const createLinkDecoration = (data: { url?: string; rel?: string; target?: string }) =>
  createDecoration(Decoration_Type.LINK, { linkData: { link: createLink(data) } });

export const last = arr => (arr.length > 0 ? arr[arr.length - 1] : null);

export const partitionBy = <T>(
  isSeparator: (node: T) => boolean,
  isPartition: (node: T) => boolean,
  Separator: (node: T) => T,
  Partition: (node: T) => T,
  addToPartition: (partition: T, node: T) => void
) => (nodes: T[]): T[] =>
  nodes.reduce((partitions: T[], node: T) => {
    if (isSeparator(node)) {
      partitions.push(Separator(node));
    } else {
      let lastPartition = last(partitions);
      if (!lastPartition || !isPartition(lastPartition)) {
        const partition = Partition(node);
        partitions.push(partition);
        lastPartition = last(partitions);
      }
      addToPartition(lastPartition, node);
    }
    return partitions;
  }, []);
