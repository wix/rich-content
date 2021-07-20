import { RichContent } from 'ricos-schema';
import { compare } from '../../../comparision/compare';
import preprocess from './preprocess';

describe('toDraft preprocess', () => {
  it('<li><p><p></li> => <li><p></li>', () => {
    const content: RichContent = RichContent.fromJSON({
      nodes: [
        {
          type: 'BULLET_LIST',
          key: 'cjdfa',
          nodes: [
            {
              type: 'LIST_ITEM',
              key: '6s1ga',
              nodes: [
                {
                  type: 'PARAGRAPH',
                  key: 'para1',
                  nodes: [
                    {
                      type: 'TEXT',
                      key: '',
                      nodes: [],
                      textData: {
                        text: 'paragraph1 ',
                        decorations: [],
                      },
                    },
                  ],
                  paragraphData: {
                    textStyle: {
                      textAlignment: 'AUTO',
                    },
                  },
                },
                {
                  type: 'PARAGRAPH',
                  key: 'para2',
                  nodes: [
                    {
                      type: 'TEXT',
                      key: '',
                      nodes: [],
                      textData: {
                        text: ' paragraph2',
                        decorations: [],
                      },
                    },
                  ],
                  paragraphData: {
                    textStyle: {
                      textAlignment: 'RIGHT',
                    },
                  },
                },
              ],
            },
          ],
        },
      ],
    });
    const expected: RichContent = RichContent.fromJSON({
      nodes: [
        {
          type: 'BULLET_LIST',
          key: 'cjdfa',
          nodes: [
            {
              type: 'LIST_ITEM',
              key: '6s1ga',
              nodes: [
                {
                  type: 'PARAGRAPH',
                  key: 'para1',
                  nodes: [
                    {
                      type: 'TEXT',
                      key: '',
                      nodes: [],
                      textData: {
                        text: 'paragraph1 ',
                        decorations: [],
                      },
                    },
                    { type: 'TEXT', key: '', textData: { text: '\n', decorations: [] }, nodes: [] },
                    {
                      type: 'TEXT',
                      key: '',
                      nodes: [],
                      textData: {
                        text: ' paragraph2',
                        decorations: [],
                      },
                    },
                  ],
                  paragraphData: {
                    textStyle: {
                      textAlignment: 'AUTO',
                    },
                  },
                },
              ],
            },
          ],
        },
      ],
    });
    const actual = preprocess(content);

    expect(RichContent.fromJSON(actual)).toStrictEqual(expected);
  });

  it('should split lists and list items containing list-unsupported nodes in draft', () => {
    const content = RichContent.fromJSON({
      nodes: [
        {
          type: 'ORDERED_LIST',
          key: 'cjdfa',
          nodes: [
            {
              type: 'LIST_ITEM',
              key: '6s1ga',
              nodes: [
                {
                  type: 'PARAGRAPH',
                  key: '3um32',
                  nodes: [
                    {
                      type: 'TEXT',
                      key: '',
                      nodes: [],
                      textData: {
                        text: 'para1',
                        decorations: [],
                      },
                    },
                  ],
                  paragraphData: {
                    textStyle: {
                      textAlignment: 'AUTO',
                    },
                  },
                },
              ],
            },
            {
              type: 'LIST_ITEM',
              key: 'c4gcn',
              nodes: [
                {
                  type: 'PARAGRAPH',
                  key: '3um32',
                  nodes: [
                    {
                      type: 'TEXT',
                      key: '',
                      nodes: [],
                      textData: {
                        text: 'para2',
                        decorations: [],
                      },
                    },
                  ],
                  paragraphData: {
                    textStyle: {
                      textAlignment: 'AUTO',
                    },
                  },
                },
                {
                  type: 'IMAGE',
                  key: '5u2v2',
                  nodes: [],
                  imageData: {
                    image: {
                      src: { url: 'https://host.com/image.png' },
                    },
                  },
                },
                {
                  type: 'PARAGRAPH',
                  key: '3um32',
                  nodes: [
                    {
                      type: 'TEXT',
                      key: '',
                      nodes: [],
                      textData: {
                        text: 'para3',
                        decorations: [],
                      },
                    },
                  ],
                  paragraphData: {
                    textStyle: {
                      textAlignment: 'AUTO',
                    },
                  },
                },
              ],
            },
            {
              type: 'LIST_ITEM',
              key: 'f62ja',
              nodes: [
                {
                  type: 'PARAGRAPH',
                  key: '2u96f',
                  nodes: [
                    {
                      type: 'TEXT',
                      key: '',
                      nodes: [],
                      textData: {
                        text: 'para4',
                        decorations: [],
                      },
                    },
                  ],
                  paragraphData: {
                    textStyle: {
                      textAlignment: 'AUTO',
                    },
                  },
                },
              ],
            },
          ],
        },
      ],
    });
    const expected = RichContent.fromJSON({
      nodes: [
        {
          type: 'BULLET_LIST',
          key: 'cjdfa',
          nodes: [
            {
              type: 'LIST_ITEM',
              key: '6s1ga',
              nodes: [
                {
                  type: 'PARAGRAPH',
                  key: '3um32',
                  nodes: [
                    {
                      type: 'TEXT',
                      key: '',
                      nodes: [],
                      textData: {
                        text: 'para1',
                        decorations: [],
                      },
                    },
                  ],
                  paragraphData: {
                    textStyle: {
                      textAlignment: 'AUTO',
                    },
                  },
                },
              ],
            },
          ],
        },
        {
          type: 'BULLET_LIST',
          key: 'cjdfa',
          nodes: [
            {
              type: 'LIST_ITEM',
              key: '6s1ga',
              nodes: [
                {
                  type: 'PARAGRAPH',
                  key: '3um32',
                  nodes: [
                    {
                      type: 'TEXT',
                      key: '',
                      nodes: [],
                      textData: {
                        text: 'para2',
                        decorations: [],
                      },
                    },
                  ],
                  paragraphData: {
                    textStyle: {
                      textAlignment: 'AUTO',
                    },
                  },
                },
              ],
            },
          ],
        },
        {
          type: 'IMAGE',
          key: '5u2v2',
          nodes: [],
          imageData: {
            image: {
              src: { url: 'https://host.com/image.png' },
            },
          },
        },
        {
          type: 'BULLET_LIST',
          key: 'cjdfa',
          nodes: [
            {
              type: 'LIST_ITEM',
              key: '6s1ga',
              nodes: [
                {
                  type: 'PARAGRAPH',
                  key: '3um32',
                  nodes: [
                    {
                      type: 'TEXT',
                      key: '',
                      nodes: [],
                      textData: {
                        text: 'para3',
                        decorations: [],
                      },
                    },
                  ],
                  paragraphData: {
                    textStyle: {
                      textAlignment: 'AUTO',
                    },
                  },
                },
              ],
            },
          ],
        },
        {
          type: 'BULLET_LIST',
          key: 'cjdfa',
          nodes: [
            {
              type: 'LIST_ITEM',
              key: 'f62ja',
              nodes: [
                {
                  type: 'PARAGRAPH',
                  key: '2u96f',
                  nodes: [
                    {
                      type: 'TEXT',
                      key: '',
                      nodes: [],
                      textData: {
                        text: 'para4',
                        decorations: [],
                      },
                    },
                  ],
                  paragraphData: {
                    textStyle: {
                      textAlignment: 'AUTO',
                    },
                  },
                },
              ],
            },
          ],
        },
      ],
    });
    const actual = preprocess(content);
    expect(compare(RichContent.fromJSON(actual), expected, { ignoredKeys: ['key'] })).toEqual({});
  });
});
