import { setupContentBuilder } from './RicosContentBuilder';
import {
  ImageData,
  PluginContainerData_Width_Type,
  PluginContainerData_Alignment,
  RichContent,
  Node_Type,
  ParagraphData,
  TextStyle_TextAlignment,
  Decoration_Type,
} from 'ricos-schema';

describe('Ricos Content Builder', () => {
  it('should add image node to content', () => {
    const generateKey = () => 'foo';
    const api = setupContentBuilder(generateKey);
    const imageData: ImageData = {
      containerData: {
        width: { size: PluginContainerData_Width_Type.SMALL },
        alignment: PluginContainerData_Alignment.CENTER,
      },
    };
    const expected: RichContent = {
      nodes: [
        {
          type: Node_Type.IMAGE,
          imageData,
          nodes: [],
          id: 'foo',
        },
      ],
    };
    const actual = api.addImage({ data: imageData, content: { nodes: [] } });
    expect(actual).toEqual(expected);
  });

  it('should add a paragraph with text to content', () => {
    const generateKey = () => 'foo';
    const api = setupContentBuilder(generateKey);
    const paragraphData: ParagraphData = {
      textStyle: {
        textAlignment: TextStyle_TextAlignment.RIGHT,
      },
    };
    const expected: RichContent = {
      nodes: [
        {
          type: Node_Type.PARAGRAPH,
          id: 'foo',
          paragraphData,
          nodes: [
            {
              id: 'foo',
              type: Node_Type.TEXT,
              textData: {
                text: 'test paragraph',
                decorations: [],
              },
              nodes: [],
            },
          ],
        },
      ],
    };
    const actual = api.addParagraph({
      text: 'test paragraph',
      data: paragraphData,
      content: { nodes: [] },
    });
    expect(actual).toEqual(expected);
  });

  it('should add bullet list with string items to content', () => {
    const generateKey = () => 'foo';
    const api = setupContentBuilder(generateKey);
    const paragraphData: ParagraphData = {
      textStyle: {
        textAlignment: TextStyle_TextAlignment.RIGHT,
      },
    };
    const expected: RichContent = {
      nodes: [
        {
          type: Node_Type.BULLETED_LIST,
          id: 'foo',
          nodes: [
            {
              type: Node_Type.LIST_ITEM,
              id: 'foo',
              nodes: [
                {
                  type: Node_Type.PARAGRAPH,
                  id: 'foo',
                  paragraphData,
                  nodes: [
                    {
                      id: 'foo',
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
              id: 'foo',
              nodes: [
                {
                  type: Node_Type.PARAGRAPH,
                  id: 'foo',
                  paragraphData,
                  nodes: [
                    {
                      id: 'foo',
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
    };
    const actual = api.addBulletList({
      items: ['item1', 'item2'],
      data: paragraphData,
      content: { nodes: [] },
    });
    expect(actual).toEqual(expected);
  });

  it('should add ordered list with mixed items to content', () => {
    const generateKey = () => 'foo';
    const api = setupContentBuilder(generateKey);
    const paragraphData: ParagraphData = {
      textStyle: {
        textAlignment: TextStyle_TextAlignment.RIGHT,
      },
    };
    const textDataItem1 = {
      text: 'item1',
      decorations: [{ type: Decoration_Type.BOLD }],
    };
    const listItem2 = {
      text: [{ text: 'item2', decorations: [{ type: Decoration_Type.ITALIC }] }],
      data: { textStyle: { textAlignment: TextStyle_TextAlignment.AUTO }, indentation: 2 },
    };
    const expected: RichContent = {
      nodes: [
        {
          type: Node_Type.ORDERED_LIST,
          id: 'foo',
          nodes: [
            {
              type: Node_Type.LIST_ITEM,
              id: 'foo',
              nodes: [
                {
                  type: Node_Type.PARAGRAPH,
                  id: 'foo',
                  paragraphData,
                  nodes: [
                    {
                      id: 'foo',
                      type: Node_Type.TEXT,
                      textData: {
                        text: 'item1',
                        decorations: [{ type: Decoration_Type.BOLD }],
                      },
                      nodes: [],
                    },
                  ],
                },
              ],
            },
            {
              type: Node_Type.LIST_ITEM,
              id: 'foo',
              nodes: [
                {
                  type: Node_Type.PARAGRAPH,
                  id: 'foo',
                  paragraphData: {
                    textStyle: { textAlignment: TextStyle_TextAlignment.AUTO },
                    indentation: 2,
                  },
                  nodes: [
                    {
                      id: 'foo',
                      type: Node_Type.TEXT,
                      textData: {
                        text: 'item2',
                        decorations: [{ type: Decoration_Type.ITALIC }],
                      },
                      nodes: [],
                    },
                  ],
                },
              ],
            },
            {
              type: Node_Type.LIST_ITEM,
              id: 'foo',
              nodes: [
                {
                  type: Node_Type.PARAGRAPH,
                  id: 'foo',
                  paragraphData,
                  nodes: [
                    {
                      id: 'foo',
                      type: Node_Type.TEXT,
                      textData: {
                        text: 'item3',
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
    };
    const actual = api.addOrderedList({
      items: [textDataItem1, listItem2, 'item3'],
      data: paragraphData,
      content: { nodes: [] },
    });
    expect(actual).toEqual(expected);
  });
});
