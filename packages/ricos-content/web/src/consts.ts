export const HEADER_BLOCK = Object.freeze({
  ONE: 'header-one',
  TWO: 'header-two',
  THREE: 'header-three',
  FOUR: 'header-four',
  FIVE: 'header-five',
  SIX: 'header-six',
});

export const DEFAULT_TITLE_HEADINGS = ['h2', 'h3'];

export const DEFAULT_HEADINGS = ['h2', 'h3', 'h4', 'h5', 'h6'];

export const BLOCK_TYPES = Object.freeze([
  'header-one',
  'header-two',
  'header-three',
  'header-four',
  'header-five',
  'header-six',
  'unordered-list-item',
  'ordered-list-item',
  'blockquote',
  'atomic',
  'code-block',
  'unstyled',
]);

export const UNSTYLED = 'unstyled';
export const BLOCKQUOTE = 'blockquote';
export const NUMBERED_LIST_TYPE = 'ordered-list-item';
export const BULLET_LIST_TYPE = 'unordered-list-item';

export const isListType = (type: string): boolean =>
  type === 'ordered-list-item' || type === 'unordered-list-item';

/* eslint-disable camelcase */
export const LINK_BUTTON_TYPE = 'wix-draft-plugin-link-button';
export const ACTION_BUTTON_TYPE = 'wix-draft-plugin-action-button';
export const CODE_BLOCK_TYPE = 'code-block';
export const DIVIDER_TYPE = 'wix-draft-plugin-divider';
export const EMOJI_TYPE = 'wix-draft-plugin-emoji';
export const FILE_UPLOAD_TYPE = 'wix-draft-plugin-file-upload';
export const GALLERY_TYPE = 'wix-draft-plugin-gallery';
export const GIPHY_TYPE = 'wix-draft-plugin-giphy';
export const HASHTAG_TYPE = 'wix-draft-plugin-hashtag';
export const HEADERS_MARKDOWN_TYPE = 'wix-draft-plugin-headers-markdown';
export const HTML_TYPE = 'wix-draft-plugin-html';
export const IMAGE_TYPE = 'wix-draft-plugin-image';
export const IMAGE_TYPE_LEGACY = 'IMAGE';
export const INDENT_TYPE = 'wix-rich-content-plugin-indent';
export const LINE_SPACING_TYPE = 'line-spacing';
export const HEADINGS_DROPDOWN_TYPE = 'wix-rich-content-plugin-headings';
export const SPOILER_TYPE = 'wix-rich-content-plugin-spoiler';
export const COLLAPSIBLE_LIST_TYPE = 'wix-rich-content-plugin-collapsible-list';
export const EXTERNAL_LINK_TYPE = 'wix-draft-plugin-external-link';
export const LINK_TYPE = 'LINK';
export const CUSTOM_LINK_TYPE = 'ricos-plugin-custom-link';
export const LINK_PREVIEW_TYPE = 'wix-draft-plugin-link-preview';
export const MAP_TYPE = 'wix-draft-plugin-map';
export const EXTERNAL_MENTIONS_TYPE = 'wix-draft-plugin-external-mentions';
export const MENTION_TYPE = 'mention';
export const SOUND_CLOUD_TYPE = 'wix-draft-plugin-sound-cloud';
export const TEXT_COLOR_TYPE = 'wix-rich-content-text-color';
export const TEXT_HIGHLIGHT_TYPE = 'wix-rich-content-text-highlight';
export const UNDO_REDO_TYPE = 'wix-rich-content-undo-redo';
export const APP_EMBED_TYPE = 'wix-draft-plugin-vertical-embed';
export const VERTICAL_EMBED_TYPE = 'wix-draft-plugin-vertical-embed';
export const VIDEO_TYPE = 'wix-draft-plugin-video';
export const VIDEO_TYPE_LEGACY = 'VIDEO-EMBED';
export const POLL_TYPE = 'wix-draft-plugin-poll';
export const TABLE_TYPE = 'wix-rich-content-plugin-table';
export const ANCHOR_TYPE = 'ANCHOR';
export const PREVIEW = 'PREVIEW';
export const UNSUPPORTED_BLOCKS_TYPE = 'unsupported-blocks';
export const EMBED_TYPE = 'EMBED';

// ricos plugin types
export const RICOS_COLLAPSIBLE_LIST_TYPE = 'ricos-collapsible-list';
export const RICOS_ACTION_BUTTON_TYPE = 'ricos-action-button';
export const RICOS_CODE_BLOCK_TYPE = 'ricos-code-block';
export const RICOS_DIVIDER_TYPE = 'ricos-divider';
export const RICOS_EMOJI_TYPE = 'ricos-emoji';
export const RICOS_FILE_TYPE = 'ricos-file';
export const RICOS_GALLERY_TYPE = 'ricos-gallery';
export const RICOS_GIPHY_TYPE = 'ricos-giphy';
export const RICOS_HASHTAG_TYPE = 'ricos-hashtag';
export const RICOS_HEADERS_MARKDOWN_TYPE = 'ricos-headers-markdown';
export const RICOS_HEADINGS_DROPDOWN_TYPE = 'ricos-heading-dropdown';
export const RICOS_HEADING = 'ricos-heading';
export const RICOS_HTML_TYPE = 'ricos-html';
export const RICOS_IMAGE_TYPE = 'ricos-image';
export const RICOS_INDENT_TYPE = 'ricos-indent';
export const RICOS_LINE_SPACING_TYPE = 'ricos-line-spacing';
export const RICOS_LINK_BUTTON_TYPE = 'ricos-link-button';
export const RICOS_LINK_PREVIEW_TYPE = 'ricos-link-preview';
export const RICOS_MAP_TYPE = 'ricos-map';
export const RICOS_POLL_TYPE = 'ricos-poll';
export const RICOS_SOUND_CLOUD_TYPE = 'ricos-sound-cloud';
export const RICOS_SPOILER_TYPE = 'ricos-spoiler';
export const RICOS_TABLE_TYPE = 'ricos-table';
export const RICOS_TEXT_COLOR_TYPE = 'ricos-text-color';
export const RICOS_TEXT_HIGHLIGHT_TYPE = 'ricos-text-highlight';
export const RICOS_UNDO_REDO_TYPE = 'ricos-undo-redo';
export const RICOS_VERTICAL_EMBED_TYPE = 'ricos-vertical-embed';
export const RICOS_VIDEO_TYPE = 'ricos-video';
export const RICOS_ANCHOR_TYPE = 'ricos-anchor';
export const RICOS_COLOR_TYPE = 'ricos-color';
export const RICOS_LINK_TYPE = 'ricos-link';
export const RICOS_MENTION_TYPE = 'ricos-mention';

export const RICOS_EXTERNAL_LINK_TYPE = 'ricos-external-link'; // TODO: is this type needed?
export const RICOS_EXTERNAL_MENTION_TYPE = 'ricos-external-mention'; // TODO: is this type needed?
