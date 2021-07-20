import {
  ButtonData,
  CodeBlockData,
  DividerData,
  FileData,
  GalleryData,
  HTMLData,
  HeadingData,
  ImageData,
  Node,
  Node_Type,
  ParagraphData,
  RichContent,
  TextData,
  VideoData,
  TextStyle_TextAlignment,
} from 'ricos-schema';
import { addNode as add, toTextDataArray, toListDataArray } from './builder-utils';
import { ContentBuilder, ListItemData } from '../types';
import { dataByNodeType } from '../converters/nodeUtils';

type AddMethodParams<TData> = {
  data: TData;
  index?: number;
  before?: string;
  after?: string;
  content: RichContent;
};

type AddTextMethodParams<T> = AddMethodParams<T> & {
  text?: string | TextData | (string | TextData)[];
};

type AddListMethodParams = {
  items: string | TextData | ListItemData | (string | TextData | ListItemData)[];
  data?: ParagraphData;
  type: Node_Type.ORDERED_LIST | Node_Type.BULLET_LIST;
  index?: number;
  before?: string;
  after?: string;
  content: RichContent;
};

export interface RicosBuilder extends ContentBuilder {
  new (): ContentBuilder;
}

export const setupContentBuilder = (
  generateKey: () => string
): ContentBuilder & { RicosContentBuilder: RicosBuilder } => {
  function createNode(type: Node_Type, data: unknown): Node {
    return { key: generateKey(), type, ...dataByNodeType(type, data), nodes: [] };
  }

  function createListNode(type: Node_Type, items: ListItemData[]) {
    return {
      type,
      key: generateKey(),
      nodes: items.map(({ text, data }) => ({
        type: Node_Type.LIST_ITEM,
        key: generateKey(),
        nodes: [createTextNode(Node_Type.PARAGRAPH, text, data)],
      })),
    };
  }

  function createTextNode(type: Node_Type, text: TextData[], data: unknown): Node {
    return {
      ...createNode(type, data),
      nodes: text.map(textData => ({
        nodes: [],
        key: generateKey(),
        type: Node_Type.TEXT,
        ...dataByNodeType(Node_Type.TEXT, textData),
      })),
    };
  }

  function addNode({
    data,
    type,
    index,
    before,
    after,
    content,
  }: {
    data: unknown;
    type: Node_Type;
    index?: number;
    before?: string;
    after?: string;
    content: RichContent;
  }): RichContent {
    const node = createNode(type, data);
    return add({ node, index, before, after, content });
  }

  function addTextNode({
    text,
    data,
    type,
    index,
    before,
    after,
    content,
  }: {
    text?: string | TextData | (string | TextData)[];
    data: unknown;
    type: Node_Type;
    index?: number;
    before?: string;
    after?: string;
    content: RichContent;
  }): RichContent {
    const textData = toTextDataArray(text);
    const node = createTextNode(type, textData, data);
    return add({ node, index, before, after, content });
  }

  const defaultParagraphData = {
    textStyle: { textAlignment: TextStyle_TextAlignment.AUTO },
    indentation: 0,
  };

  function addListNode({
    items,
    data = defaultParagraphData,
    type,
    index,
    before,
    after,
    content,
  }: AddListMethodParams): RichContent {
    const listItemData = toListDataArray(items, data);
    const node = createListNode(type, listItemData);
    return add({ node, index, before, after, content });
  }

  class RicosContentBuilder {}

  const builderApis = {};

  [
    { name: 'Paragraph', type: Node_Type.PARAGRAPH, dataT: {} as ParagraphData },
    { name: 'Heading', type: Node_Type.HEADING, dataT: {} as HeadingData },
    { name: 'Code', type: Node_Type.CODE_BLOCK, dataT: {} as CodeBlockData },
  ].forEach(({ name, type, dataT }) => {
    builderApis[`add${name}`] = RicosContentBuilder.prototype[`add${name}`] = function({
      data,
      text,
      index,
      before,
      after,
      content,
    }: AddTextMethodParams<typeof dataT>): RichContent {
      return addTextNode({
        text,
        type,
        data,
        content,
        index,
        before,
        after,
      });
    };
  });

  [
    { name: 'BulletList', type: Node_Type.BULLET_LIST },
    { name: 'OrderedList', type: Node_Type.ORDERED_LIST },
  ].forEach(
    ({ name, type }: { name: string; type: Node_Type.ORDERED_LIST | Node_Type.BULLET_LIST }) => {
      builderApis[`add${name}`] = RicosContentBuilder.prototype[`add${name}`] = function({
        items,
        data,
        index,
        before,
        after,
        content,
      }: AddListMethodParams): RichContent {
        return addListNode({ items, data, type, index, before, after, content });
      };
    }
  );

  [
    { name: 'Divider', type: Node_Type.DIVIDER, dataT: {} as DividerData },
    { name: 'File', type: Node_Type.FILE, dataT: {} as FileData },
    { name: 'Gallery', type: Node_Type.GALLERY, dataT: {} as GalleryData },
    { name: 'Html', type: Node_Type.HTML, dataT: {} as HTMLData },
    { name: 'Image', type: Node_Type.IMAGE, dataT: {} as ImageData },
    { name: 'Video', type: Node_Type.VIDEO, dataT: {} as VideoData },
  ].forEach(({ name, type, dataT }) => {
    builderApis[`add${name}`] = RicosContentBuilder.prototype[`add${name}`] = function({
      data,
      index,
      before,
      after,
      content,
    }: AddMethodParams<typeof dataT>): RichContent {
      return addNode({
        type,
        data,
        content,
        index,
        before,
        after,
      });
    };
  });

  [
    { name: 'addActionButton', type: Node_Type.BUTTON, dataT: {} as ButtonData },
    { name: 'addLinkButton', type: Node_Type.BUTTON, dataT: {} as ButtonData },
  ].forEach(({ name, type, dataT }) => {
    builderApis[name] = RicosContentBuilder.prototype[name] = function({
      data,
      index,
      before,
      after,
      content,
    }: AddMethodParams<typeof dataT>): RichContent {
      return addNode({
        type,
        data,
        content,
        index,
        before,
        after,
      });
    };
  });

  return {
    RicosContentBuilder: (RicosContentBuilder as unknown) as RicosBuilder,
    ...(builderApis as ContentBuilder),
  };
};
