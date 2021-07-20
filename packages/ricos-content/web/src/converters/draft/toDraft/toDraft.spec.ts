import { toDraft, fromDraft, convertNodeDataToDraft, convertDecorationDataToDraft } from '..';
import { compare } from '../../../comparision/compare';
import complexFixture from '../../../../../../../e2e/tests/fixtures/migration-content.json';
import anchorBlocksFixture from '../../../../../../../e2e/tests/fixtures/all-blocks-with-anchors.json';
import { ANCHOR_TYPE } from '../../../consts';
import {
  Decoration_Type,
  Node_Type,
  PluginContainerData_Alignment,
  PluginContainerData_Width_Type,
} from 'ricos-schema';
import { convertDecorationToDraftData, convertNodeToDraftData } from './convertDraftPluginData';

const fixtures = { complex: complexFixture };

describe('migrate to draft', () => {
  Object.entries(fixtures).forEach(([name, content]) =>
    it(`should migrate ${name} fixture`, () => {
      expect(compareWithConverted(content)).toEqual({});
    })
  );

  it('should migrate anchors', () => {
    const content = convert(anchorBlocksFixture);
    const anchorKeys = Object.values(content.entityMap)
      .filter(({ type }) => type === ANCHOR_TYPE)
      .map(({ data }) => data.anchor);
    const blockKeys = content.blocks.map(({ key }) => key);
    const anchorsWithoutBlock = anchorKeys.filter(anchor => !blockKeys.includes(anchor));
    expect(anchorsWithoutBlock.length).toEqual(0);
  });

  const imageNodeData = {
    nodes: [],
    type: Node_Type.IMAGE,
    key: 'eoba3',
    imageData: {
      containerData: {
        width: { size: PluginContainerData_Width_Type.CONTENT },
        alignment: PluginContainerData_Alignment.CENTER,
      },
      image: {
        src: { custom: '8bb438_131a7e1872bc45ec827bb61e56b840fe.jpg' },
        width: 2898,
        height: 3354,
      },
      disableExpand: false,
      altText: 'feet',
      caption: 'The caption!',
    },
  };

  const expectedImageBlockData = {
    config: {
      alignment: 'center',
      size: 'content',
    },
    disableExpand: false,
    src: {
      id: '8bb438_131a7e1872bc45ec827bb61e56b840fe.jpg',
      file_name: '8bb438_131a7e1872bc45ec827bb61e56b840fe.jpg',
      width: 2898,
      height: 3354,
    },
    metadata: {
      caption: 'The caption!',
      alt: 'feet',
    },
  };

  it('should convert node data', () => {
    const blockData = convertNodeDataToDraft(Node_Type.IMAGE, imageNodeData.imageData);

    expect(blockData).toEqual(expectedImageBlockData);
  });

  it('should convert node', () => {
    const blockData = convertNodeToDraftData(imageNodeData);

    expect(blockData).toEqual(expectedImageBlockData);
  });

  const mentionDecoration = {
    type: Decoration_Type.MENTION,
    mentionData: {
      name: 'Test One',
      slug: 'testone',
    },
  };

  const expectedMentionBlockData = {
    mention: {
      name: 'Test One',
      slug: 'testone',
    },
  };

  it('should convert decoration data', () => {
    const blockData = convertDecorationDataToDraft(
      Decoration_Type.MENTION,
      mentionDecoration.mentionData
    );

    expect(blockData).toEqual(expectedMentionBlockData);
  });

  it('should convert decoration', () => {
    const blockData = convertDecorationToDraftData(mentionDecoration);

    expect(blockData).toEqual(expectedMentionBlockData);
  });
});

const convert = content => toDraft(fromDraft(content));
const compareWithConverted = content => compare(convert(content), content);
