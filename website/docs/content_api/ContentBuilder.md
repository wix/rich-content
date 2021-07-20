---
id: ContentBuilder
title: Content Builder
sidebar_label: Content Builder
---

This doc focuses on various API types, and not the exhaustive list of APIs. Examples based on Image demonstrate the “block” plugin related APIs like Image, Divider, etc -- all the plugins that require a separate block (unlike “inline” plugins).
Examples based on Paragraph demonstrate text related APIs.

The Content Builder is stateless and immutable. This means, each API accepts RichContent to process, and returns a new copy of RichContent.

All the building blocks (e.g. ImageData objects) are defined in `ricos-schema` package.

## Instantiation

The ContentBuilder depends on key generation utility `() => string` which provides unique node keys. The `wix-rich-content-common` package exports such utility.

```ts
import { setupContentBuilder } from 'ricos-content/libs/Content';
import { generateKey } from 'wix-rich-content-common';

const api = setupContentBuilder(generateKey);
```

## Append / insert new content

The _add_ methods add new content nodes. The node position is defined either by index (i.e. sequential number inside nodes collection), or by before/after key (adds the content relatively to a given existing node addressed by key). If no index/before/after keys provided, the new content appended to the end.

```ts
addImage({
  data: ImageData,
  index?: number,
  before?: string,
  after?: string,
  content: RichContent
}): RichContent;

addParagraph({
  text?: string | TextData | (string | TextData)[],
  data?: ParagraphData,
  index?: number,
  before?: string,
  after?: string
}): RichContent;

```

### Adding bullet/ordered list

The list addition API is a bit different. It accepts _items_ parameter which contains textual data, and an optional _data_ parameter.

This parameter determines the default data for paragraph that contains text. At the moment, lists support only paragraphs as list item containers.

```ts
addBulletList({
  items: string | TextData | ListItemData | (string | TextData | ListItemData)[],
  data?: ParagraphData,
  index?: number,
  before?: string,
  after?: string
}): RichContent;

```

### Examples

#### Image

```ts
const api = setupContentBuilder(generateKey);
const imageData: ImageData = {
  containerData: {
    width: { size: PluginContainerData_Width_Type.SMALL },
    alignment: PluginContainerData_Alignment.CENTER,
  },
  image: {...},
};
const content = api.addImage({ data: imageData, content: { nodes: [] } });
```

returns the following content:

```ts
{
  nodes: [
    {
      type: Node_Type.IMAGE,
      imageData,
      nodes: [],
      key: 'foo',
    },
  ],
}
```

#### List

```ts
const paragraphData: ParagraphData = {
  textStyle: {
    textAlignment: TextStyle_TextAlignment.RIGHT,
  },
};

const content = api.addBulletList({
  items: ['item1', 'item2'],
  data: paragraphData,
  content: { nodes: [] },
});
```

results in:

```ts
{
  nodes: [
    {
      type: Node_Type.BULLETED_LIST,
      key: 'foo',
      nodes: [
        {
          type: Node_Type.LIST_ITEM,
          key: 'foo',
          nodes: [
            {
              type: Node_Type.PARAGRAPH,
              key: 'foo',
              paragraphData: {
                textStyle: {
                  textAlignment: TextStyle_TextAlignment.RIGHT,
                },
              },
              nodes: [
                {
                  key: 'foo',
                  type: Node_Type.TEXT,
                  textData: {
                    text: 'item1',
                    decorations: [],
                  },
                  nodes: [],
                },
              ],
            },
          ],
        },
        {
          type: Node_Type.LIST_ITEM,
          key: 'foo',
          nodes: [
            {
              type: Node_Type.PARAGRAPH,
              key: 'foo',
              paragraphData: {
                textStyle: {
                  textAlignment: TextStyle_TextAlignment.RIGHT,
                },
              },
              nodes: [
                {
                  key: 'foo',
                  type: Node_Type.TEXT,
                  textData: {
                    text: 'item2',
                    decorations: [],
                  },
                  nodes: [],
                },
              ],
            },
          ],
        },
      ],
    },
  ],
}
```
