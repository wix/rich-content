/* eslint-disable no-console */
import { flow } from 'fp-ts/function';
import { RichContent, Node, Node_Type } from 'ricos-schema';
import { DraftContent, RicosContentBlock } from '../../../types';
import { Version } from '../../../version';
import { genKey } from '../../generateRandomKey';
import {
  BlockType,
  HeaderLevel,
  RICOS_NODE_TYPE_TO_DATA_FIELD,
  TO_DRAFT_LIST_TYPE,
} from '../consts';
import { DraftBlockType } from 'draft-js';
import { merge } from 'lodash';
import { createTextBlockData, createAtomicEntityData } from './getDraftEntityData';
import {
  getParagraphNode,
  mergeTextNodes,
  parseDecorations,
  parseInlineStyleDecorations,
  parseEntityDecorations,
} from './decorationParsers';
import preprocess from './preprocess';

const convert = (ricosContent: RichContent): DraftContent => {
  const { nodes } = RichContent.toJSON(RichContent.fromJSON(ricosContent)) as RichContent; // using toJSON to remove undefined fields
  const draftContent: DraftContent = {
    blocks: [],
    entityMap: {},
  };
  let latestEntityKey = -1;

  const parseNodes = (index = 0) => {
    const node = nodes[index];
    if (node) {
      switch (node.type) {
        case Node_Type.BLOCKQUOTE:
          parseTextNodes(getParagraphNode(node), { type: BlockType.Blockquote, key: node.key });
          break;
        case Node_Type.CODE_BLOCK:
          parseTextNodes(node, { type: BlockType.CodeBlock, key: node.key });
          break;
        case Node_Type.HEADING:
          if (!node.headingData) {
            throw Error(`ERROR! Heading node with no data!`);
          }
          parseTextNodes(node, { type: HeaderLevel[node.headingData.level], key: node.key });
          break;
        case Node_Type.ORDERED_LIST:
        case Node_Type.BULLET_LIST:
          parseListNode(node);
          break;
        case Node_Type.PARAGRAPH:
          parseTextNodes(node, { type: BlockType.Unstyled, key: node.key });
          break;
        default:
          if (RICOS_NODE_TYPE_TO_DATA_FIELD[node.type]) {
            parseAtomicNode(node);
          } else {
            throw Error(`ERROR! Unknown node type "${node.type}"!`);
          }
      }
      parseNodes(index + 1);
    }
  };

  const parseAtomicNode = (node: Node) => {
    latestEntityKey += 1;
    const entityMap = createAtomicEntityData(node, latestEntityKey);
    addBlock({
      key: node.key,
      type: BlockType.Atomic,
      text: ' ',
      entityRanges: [{ offset: 0, length: 1, key: latestEntityKey }],
    });
    draftContent.entityMap = { ...draftContent.entityMap, ...entityMap };
  };

  const parseListNode = (node: Node, indentation = 0) => {
    node.nodes.forEach(listItem => {
      const [paragraph, childNode] = listItem.nodes;
      parseTextNodes(paragraph, {
        type: TO_DRAFT_LIST_TYPE[node.type],
        key: listItem.key,
        indentation,
      });
      if (childNode) {
        parseListNode(childNode, indentation + 1);
      }
    });
  };

  const parseTextNodes = (
    node: Node,
    { type, key, indentation }: { type: DraftBlockType; key: string; indentation?: number }
  ) => {
    const { text, decorationMap } = mergeTextNodes(node.nodes);
    const { inlineStyleDecorations, entityDecorations } = parseDecorations(decorationMap, text);
    const inlineStyleRanges = parseInlineStyleDecorations(inlineStyleDecorations);
    const { entityRanges, entityMap, latestEntityKey: newLatestEntityKey } = parseEntityDecorations(
      entityDecorations,
      latestEntityKey
    );
    latestEntityKey = newLatestEntityKey;
    const { depth, ...data } = createTextBlockData(node);
    addBlock({
      key,
      type,
      text,
      depth: indentation || depth,
      inlineStyleRanges,
      entityRanges,
      data,
    });
    draftContent.entityMap = { ...draftContent.entityMap, ...entityMap };
  };

  const addBlock = (blockProps?: Partial<RicosContentBlock>) => {
    const newBlock: RicosContentBlock = merge(
      {
        key: genKey(),
        type: BlockType.Unstyled,
        text: '',
        depth: 0,
        inlineStyleRanges: [],
        entityRanges: [],
        data: {},
      },
      blockProps
    );
    draftContent.blocks = [...draftContent.blocks, newBlock];
  };

  parseNodes();

  draftContent.VERSION = Version.currentVersion;
  return draftContent;
};

export const toDraft = flow(preprocess, convert);

export const ensureDraftContent = (content: RichContent | DraftContent): DraftContent =>
  'nodes' in content ? toDraft(content) : content;
