import {
  MENTION_TYPE,
  LINK_TYPE,
  IMAGE_TYPE,
  DIVIDER_TYPE,
  FILE_UPLOAD_TYPE,
  GALLERY_TYPE,
  GIPHY_TYPE,
  HTML_TYPE,
  LINK_PREVIEW_TYPE,
  MAP_TYPE,
  POLL_TYPE,
  VIDEO_TYPE,
  APP_EMBED_TYPE,
  LINK_BUTTON_TYPE,
  ACTION_BUTTON_TYPE,
  IMAGE_TYPE_LEGACY,
  SPOILER_TYPE,
  COLLAPSIBLE_LIST_TYPE,
  VIDEO_TYPE_LEGACY,
  TABLE_TYPE,
  ANCHOR_TYPE,
  EMBED_TYPE,
} from '../../consts';
import { Decoration_Type, Node_Type } from 'ricos-schema';
import { fromEntries } from '../../utils';

export enum BlockType {
  Unstyled = 'unstyled',
  HeaderOne = 'header-one',
  HeaderTwo = 'header-two',
  HeaderThree = 'header-three',
  HeaderFour = 'header-four',
  HeaderFive = 'header-five',
  HeaderSix = 'header-six',
  UnorderedListItem = 'unordered-list-item',
  OrderedListItem = 'ordered-list-item',
  Blockquote = 'blockquote',
  CodeBlock = 'code-block',
  Atomic = 'atomic',
}

export enum HeaderLevel {
  'header-one' = 1,
  'header-two' = 2,
  'header-three' = 3,
  'header-four' = 4,
  'header-five' = 5,
  'header-six' = 6,
}

export const FROM_DRAFT_LIST_TYPE = {
  [BlockType.UnorderedListItem]: Node_Type.BULLET_LIST,
  [BlockType.OrderedListItem]: Node_Type.ORDERED_LIST,
};

export const TO_DRAFT_LIST_TYPE = fromEntries(
  Object.entries(FROM_DRAFT_LIST_TYPE).map(([key, value]) => [value, key])
);

export const TO_RICOS_NODE_TYPE = {
  [LINK_BUTTON_TYPE]: Node_Type.BUTTON,
  [ACTION_BUTTON_TYPE]: Node_Type.BUTTON,
  [DIVIDER_TYPE]: Node_Type.DIVIDER,
  [FILE_UPLOAD_TYPE]: Node_Type.FILE,
  [GALLERY_TYPE]: Node_Type.GALLERY,
  [GIPHY_TYPE]: Node_Type.GIPHY,
  [HTML_TYPE]: Node_Type.HTML,
  [IMAGE_TYPE]: Node_Type.IMAGE,
  [IMAGE_TYPE_LEGACY]: Node_Type.IMAGE,
  [COLLAPSIBLE_LIST_TYPE]: Node_Type.COLLAPSIBLE_LIST,
  [LINK_PREVIEW_TYPE]: Node_Type.LINK_PREVIEW,
  [MAP_TYPE]: Node_Type.MAP,
  [APP_EMBED_TYPE]: Node_Type.APP_EMBED,
  [VIDEO_TYPE]: Node_Type.VIDEO,
  [VIDEO_TYPE_LEGACY]: Node_Type.VIDEO,
  [POLL_TYPE]: Node_Type.POLL,
  [TABLE_TYPE]: Node_Type.TABLE,
  [EMBED_TYPE]: Node_Type.EMBED,
};

const DUPLICATE_KEYS = [IMAGE_TYPE_LEGACY, VIDEO_TYPE_LEGACY];

// Node_Type.IMAGE: IMAGE_TYPE
export const FROM_RICOS_ENTITY_TYPE = fromEntries(
  Object.entries(TO_RICOS_NODE_TYPE)
    .filter(([key]) => !DUPLICATE_KEYS.includes(key))
    .map(([key, value]) => [value, key])
);

export const TO_RICOS_DECORATION_TYPE = {
  BOLD: Decoration_Type.BOLD,
  ITALIC: Decoration_Type.ITALIC,
  UNDERLINE: Decoration_Type.UNDERLINE,
  [SPOILER_TYPE]: Decoration_Type.SPOILER,
  [ANCHOR_TYPE]: Decoration_Type.ANCHOR,
  [MENTION_TYPE]: Decoration_Type.MENTION,
  [LINK_TYPE]: Decoration_Type.LINK,
};

export const TO_RICOS_PLUGIN_TYPE = {
  ...TO_RICOS_NODE_TYPE,
  ...TO_RICOS_DECORATION_TYPE,
};

// Decoration_Type.BOLD: BOLD
export const FROM_RICOS_DECORATION_TYPE = fromEntries(
  Object.entries(TO_RICOS_DECORATION_TYPE).map(([key, value]) => [value, key])
);

export const ENTITY_DECORATION_TO_MUTABILITY = {
  [ANCHOR_TYPE]: 'MUTABLE',
  [LINK_TYPE]: 'MUTABLE',
  [MENTION_TYPE]: 'SEGMENTED',
  EMOJI_TYPE: 'IMMUTABLE',
};

export const RICOS_NODE_TYPE_TO_DATA_FIELD = {
  [Node_Type.BUTTON]: 'buttonData',
  [Node_Type.DIVIDER]: 'dividerData',
  [Node_Type.FILE]: 'fileData',
  [Node_Type.GALLERY]: 'galleryData',
  [Node_Type.GIPHY]: 'giphyData',
  [Node_Type.HTML]: 'htmlData',
  [Node_Type.IMAGE]: 'imageData',
  [Node_Type.COLLAPSIBLE_LIST]: 'collapsibleListData',
  [Node_Type.LINK_PREVIEW]: 'linkPreviewData',
  [Node_Type.MAP]: 'mapData',
  [Node_Type.APP_EMBED]: 'appEmbedData',
  [Node_Type.VIDEO]: 'videoData',
  [Node_Type.POLL]: 'pollData',
  [Node_Type.TABLE]: 'tableData',
  [Node_Type.PARAGRAPH]: 'paragraphData',
  [Node_Type.LIST_ITEM]: 'paragraphData',
  [Node_Type.HEADING]: 'headingData',
  [Node_Type.CODE_BLOCK]: 'codeBlockData',
  [Node_Type.BLOCKQUOTE]: 'paragraphData',
  [Node_Type.EMBED]: 'embedData',
} as const;

export const DRAFT_BLOCK_TYPE_TO_DATA_FIELD = {
  [BlockType.Unstyled]: 'paragraphData',
  [BlockType.UnorderedListItem]: 'paragraphData',
  [BlockType.OrderedListItem]: 'paragraphData',
  [BlockType.HeaderOne]: 'headingData',
  [BlockType.HeaderTwo]: 'headingData',
  [BlockType.HeaderThree]: 'headingData',
  [BlockType.HeaderFour]: 'headingData',
  [BlockType.HeaderFive]: 'headingData',
  [BlockType.HeaderSix]: 'headingData',
  [BlockType.CodeBlock]: 'codeBlockData',
  [BlockType.Blockquote]: 'paragraphData',
};

// IMAGE_TYPE: imageData
const DRAFT_PLUGIN_TYPE_TO_DATA_FIELD = fromEntries(
  Object.entries(TO_RICOS_NODE_TYPE).map(([key, value]) => [
    key,
    RICOS_NODE_TYPE_TO_DATA_FIELD[value],
  ])
);

export const ENTITY_DECORATION_TO_DATA_FIELD = {
  [ANCHOR_TYPE]: 'anchorData',
  [LINK_TYPE]: 'linkData',
  [MENTION_TYPE]: 'mentionData',
  EMOJI_TYPE: 'emojiData',
};

export const TO_RICOS_DATA_FIELD = {
  ...ENTITY_DECORATION_TO_DATA_FIELD,
  ...DRAFT_PLUGIN_TYPE_TO_DATA_FIELD,
  ...DRAFT_BLOCK_TYPE_TO_DATA_FIELD,
};
