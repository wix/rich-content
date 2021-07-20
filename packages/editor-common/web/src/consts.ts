export const COMMANDS = Object.freeze({
  TITLE: 'header-two',
  SUBTITLE: 'header-three',
  ALIGN_LEFT: 'left',
  ALIGN_RIGHT: 'right',
  ALIGN_CENTER: 'center',
  JUSTIFY: 'justify',
  NUMBERED_LIST: 'ordered-list-item',
  BULLETED_LIST: 'unordered-list-item',
  CODE: 'code-block',
  BLOCKQUOTE: 'blockquote',
  BACKSPACE: 'backspace',
  DELETE: 'delete',
  TAB: 'tab',
  SHIFT_TAB: 'shiftTab',
  ESC: 'esc',
  UNDO: 'ricosUndo',
  REDO: 'ricosRedo',
  FOCUS_TOOLBAR: 'focusToolbar',
  INCREASE_INDENT: 'increase-indent',
  DECREASE_INDENT: 'decrease-indent',
});

export const TEXT_TYPES = Object.freeze([
  'unstyled',
  'blockquote',
  'header-one',
  'header-two',
  'header-three',
  'header-four',
  'header-five',
  'header-six',
  'ordered-list-item',
  'unordered-list-item',
]);

export const CHARACTERS = Object.freeze({
  TAB: '\t',
});

export {
  ModifierKey as MODIFIERS,
  ToolbarType as TOOLBARS,
  DisplayMode as DISPLAY_MODE,
} from 'wix-rich-content-common';

export const KEYS_CHARCODE = {
  ENTER: 13,
  ESCAPE: 27,
  SPACE: 32,
};

const ALIGN_LEFT = 'AlignLeft';
const ALIGN_RIGHT = 'AlignRight';
const ALIGN_CENTER = 'AlignCenter';
const ALIGN_JUSTIFY = 'Justify';

export const FORMATTING_BUTTONS = Object.freeze({
  BOLD: 'Bold',
  ITALIC: 'Italic',
  UNDERLINE: 'Underline',
  TITLE: 'Title',
  BLOCKQUOTE: 'Blockquote',
  ALIGN_LEFT,
  ALIGN_RIGHT,
  ALIGN_CENTER,
  ALIGN_JUSTIFY,
  ALIGN_GROUP: {
    tooltipKey: 'AlignTextDropdownButton_Tooltip',
    name: 'Alignment',
    dataHook: 'Alignment',
    buttons: [ALIGN_LEFT, ALIGN_CENTER, ALIGN_RIGHT, ALIGN_JUSTIFY],
  },
  ORDERED_LIST: 'OrderedList',
  UNORDERED_LIST: 'UnorderedList',
  // plugins
  SPOILER: 'SPOILER',
  LINK: 'LINK',
  HEADINGS: 'HEADINGS',
  TEXT_COLOR: 'TEXT_COLOR',
  TEXT_HIGHLIGHT: 'TEXT_HIGHLIGHT',
  CODE_BLOCK: 'CODE_BLOCK',
  UNDO: 'UNDO',
  REDO: 'REDO',
  LINE_SPACING: 'LINE_SPACING',
  INCREASE_INDENT: 'INCREASE_INDENT',
  DECREASE_INDENT: 'DECREASE_INDENT',
});

export const INSERT_PLUGIN_BUTTONS = Object.freeze({
  IMAGE: 'ImagePlugin_InsertButton',
  GALLERY: 'GalleryPlugin_InsertButton',
  POLLS: 'Poll',
  DIVIDER: 'DividerPlugin_InsertButton',
  HTML: 'HTMLCodePlugin_InsertButton',
  VIDEO: 'VideoPlugin_InsertButton',
  INSTAGRAM: 'Instagram_InsertButton',
  YOUTUBE: 'YouTube_InsertButton',
  TIKTOK: 'TikTok_InsertButton',
  TWITTER: 'Twitter_InsertButton',
  STORES: 'Stores_InsertButton',
  EVENTS: 'Events_InsertButton',
  BOOKINGS: 'Bookings_InsertButton',
  BUTTON: 'ButtonPlugin_InsertButton',
  CODE_BLOCK: 'CodeblockPlugin_InsertButton',
  SOUND_CLOUD: 'SoundcloudPlugin_InsertButton',
  GIF: 'GIFPlugin_InsertButton',
  MAP: 'MapPlugin_InsertButton',
  FILE: 'UploadFilePlugin_InsertButton',
  EMOJI: 'EmojiPlugin_InsertButton',
  UNDO: 'UndoPlugin_InsertButton',
  REDO: 'RedoPlugin_InsertButton',
  TABLE: 'TablePlugin_InsertButton',
});

export const BUTTON_TYPES = Object.freeze({
  BUTTON: 'button',
  FILE: 'file',
  MODAL: 'modal',
  CUSTOM_BLOCK: 'custom-block',
  SEPARATOR: 'SEPARATOR',
  DROPDOWN: 'DROPDOWN',
  GROUP: 'GROUP',
});
