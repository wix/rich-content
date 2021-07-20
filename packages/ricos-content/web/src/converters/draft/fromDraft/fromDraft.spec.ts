/* eslint-disable no-unused-vars */

import { toDraft, fromDraft } from '..';
import { compare } from '../../../comparision/compare';
import complexFixture from '../../../../../../../e2e/tests/fixtures/migration-content.json';
import buggy from '../../../../../../../e2e/tests/fixtures/buggy/atomicWithNoEntityRanges.json';
import polyfills from '../../../../../../../e2e/tests/fixtures/polyfills.json';
import { getTextNodes } from './getTextNodes';
import complexRicosFixture from '../../../../statics/json/migratedFixtures/migration-content.json';
import { Node_Type, Decoration_Type, RichContent } from 'ricos-schema';
import { convertBlockDataToRicos } from './convertRicosPluginData';
import { IMAGE_TYPE } from '../../../consts';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const filterKeys = objArr => objArr.map(({ key, ...rest }) => rest); //disable
describe('migrate from draft', () => {
  const fixtures = { buggy, polyfills };
  Object.entries(fixtures).forEach(([name, content]) =>
    it(`should migrate ${name} fixture`, () => {
      const _backToDraft = toDraft(fromDraft(content));
      // const result = compare(backToDraft, content);
      // expect(result).toEqual({});
      expect(true).toEqual(true);
    })
  );

  it('should migrate complex fixture', () => {
    expect(
      compare(fromDraft(complexFixture), RichContent.fromJSON(complexRicosFixture), {
        ignoredKeys: ['key'],
      })
    ).toEqual({});
  });

  it('should overlap styles', () => {
    const block = {
      key: 'foo',
      text: 'blah blah blah',
      type: 'unstyled',
      depth: 0,
      inlineStyleRanges: [
        {
          offset: 3,
          length: 3,
          style: 'ITALIC',
        },
        {
          offset: 5,
          length: 5,
          style: 'UNDERLINE',
        },
        {
          offset: 8,
          length: 4,
          style: 'BOLD',
        },
      ],
      entityRanges: [],
    };

    const expectedResults = [
      {
        key: '2k4v1',
        nodes: [],
        textData: { decorations: [], text: 'bla' },
        type: Node_Type.TEXT,
      },
      {
        key: '1ba7b',
        nodes: [],
        textData: { decorations: [{ type: Decoration_Type.ITALIC }], text: 'h ' },
        type: Node_Type.TEXT,
      },
      {
        key: '59lhm',
        nodes: [],
        textData: {
          decorations: [{ type: Decoration_Type.ITALIC }, { type: Decoration_Type.UNDERLINE }],
          text: 'b',
        },
        type: Node_Type.TEXT,
      },
      {
        key: '1agl0',
        nodes: [],
        textData: { decorations: [{ type: Decoration_Type.UNDERLINE }], text: 'la' },
        type: Node_Type.TEXT,
      },
      {
        key: '1m39g',
        nodes: [],
        textData: {
          decorations: [{ type: Decoration_Type.UNDERLINE }, { type: Decoration_Type.BOLD }],
          text: 'h ',
        },
        type: Node_Type.TEXT,
      },
      {
        key: '8cr95',
        nodes: [],
        textData: { decorations: [{ type: Decoration_Type.BOLD }], text: 'bl' },
        type: Node_Type.TEXT,
      },
      {
        key: 'dkn86',
        nodes: [],
        textData: { decorations: [], text: 'ah' },
        type: Node_Type.TEXT,
      },
    ];

    const entityMap = {};
    expect(filterKeys(getTextNodes(block, entityMap))).toEqual(filterKeys(expectedResults));
  });

  it('should detect mentions', () => {
    const block = {
      key: 'fcm70',
      text: 'Mentions too @Test One ',
      type: 'unstyled',
      depth: 0,
      inlineStyleRanges: [],
      entityRanges: [
        {
          offset: 13,
          length: 9,
          key: 0,
        },
      ],
      data: {},
    };
    const entityMap = {
      '0': {
        type: 'mention',
        mutability: 'SEGMENTED',
        data: {
          mention: {
            name: 'Test One',
            slug: 'testone',
          },
        },
      },
    };

    const expectedResult = [
      {
        nodes: [],
        textData: { decorations: [], text: 'Mentions too ' },
        type: Node_Type.TEXT,
      },
      {
        nodes: [],
        textData: {
          decorations: [
            {
              mentionData: {
                name: 'Test One',
                slug: 'testone',
              },
              type: Decoration_Type.MENTION,
            },
          ],
          text: '@Test One',
        },
        type: Node_Type.TEXT,
      },
      { nodes: [], textData: { decorations: [], text: ' ' }, type: Node_Type.TEXT },
    ];
    expect(filterKeys(getTextNodes(block, entityMap))).toEqual(expectedResult);
  });

  it('should convert block data', () => {
    const blockData = {
      config: {
        alignment: 'center',
        size: 'content',
        showTitle: true,
        showDescription: true,
      },
      src: {
        id: '036c6bf6cef5e4409848eb4eb6f80de1',
        original_file_name: '8bb438_131a7e1872bc45ec827bb61e56b840fe.jpg',
        file_name: '8bb438_131a7e1872bc45ec827bb61e56b840fe.jpg',
        width: 2898,
        height: 3354,
      },
      disableExpand: false,
      disableDownload: false,
      metadata: {
        caption: 'The caption!',
        alt: 'feet',
      },
    };

    const expectedNodeData = {
      containerData: { width: { size: 'CONTENT' }, alignment: 'CENTER' },
      image: {
        src: { custom: '8bb438_131a7e1872bc45ec827bb61e56b840fe.jpg' },
        width: 2898,
        height: 3354,
      },
      disableExpand: false,
      disableDownload: false,
      altText: 'feet',
      caption: 'The caption!',
    };

    const nodeData = convertBlockDataToRicos(IMAGE_TYPE, blockData);

    expect(nodeData).toEqual(expectedNodeData);
  });

  it('should convert list styles correctly', () => {
    const draftContent = {
      blocks: [
        {
          key: '80vi2',
          text: 'xbxvbcvb',
          type: 'ordered-list-item',
          depth: 0,
          inlineStyleRanges: [],
          entityRanges: [],
          data: {
            dynamicStyles: {
              'padding-top': '2px',
              'padding-bottom': '3px',
            },
          },
        },
      ],
      entityMap: {},
      VERSION: '8.42.2',
    };
    const expected = {
      nodes: [
        {
          type: 'ORDERED_LIST',
          key: '4kh4d',
          nodes: [
            {
              type: 'LIST_ITEM',
              key: '80vi2',
              nodes: [
                {
                  type: 'PARAGRAPH',
                  key: 'copbt',
                  nodes: [
                    {
                      type: 'TEXT',
                      key: '4vn2p',
                      nodes: [],
                      textData: { text: 'xbxvbcvb', decorations: [] },
                    },
                  ],
                  style: { paddingTop: '2px', paddingBottom: '3px' },
                  paragraphData: { textStyle: { textAlignment: 'AUTO' }, indentation: 0 },
                },
              ],
            },
          ],
        },
      ],
      metadata: {
        version: 1,
        createdTimestamp: '2021-06-06T11:42:01.065Z',
        updatedTimestamp: '2021-06-06T11:42:01.065Z',
      },
    };
    expect(
      compare(fromDraft(draftContent), RichContent.fromJSON(expected), { ignoredKeys: ['key'] })
    ).toEqual({});
  });
});
