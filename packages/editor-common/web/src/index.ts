/* eslint-disable no-duplicate-imports */
export * from './Icons';

// Components
export { default as ClickOutside } from './Components/ClickOutside/ClickOutside';
export { default as useClickOutside } from './Components/ClickOutside/useClickOutside';

export { default as LinkPanelWrapper } from './Components/LinkComponents/LinkPanelWrapper';
export { default as LinkButton } from './Components/LinkComponents/LinkButton';
export { default as LinkModal } from './Components/LinkComponents/LinkModal';
export { default as ToolbarButton } from './Components/ToolbarButton';
export { default as InlineToolbarButton } from './Components/InlineToolbarButton';

//Modals
export { default as EditorModals } from './Modals/EditorModals';

//Utils
export { default as decorateComponentWithProps } from './Utils/decorateComponentWithProps';
export { getToolbarTheme } from './Utils/getToolbarTheme';
export { getModalStyles, getBottomToolbarModalStyles } from './Utils/getModalStyles';
export { undo, redo, pluginsUndo } from './Utils/handleUndoRedoCommands';
export { getAnchorableBlocks } from './Components/AnchorComponents/anchorUtils';

export {
  updateLinkAtCurrentSelection,
  insertLinkAtCurrentSelection,
  insertLinkInPosition,
  getEntityData,
  insertCustomLink,
  hasLinksInBlock,
  getLinkRangesInBlock,
  fixPastedLinks,
  hasLinksInSelection,
  getLinkDataInSelection,
  removeLinksInSelection,
  getTextAlignment,
  setTextAlignment,
  getAnchorBlockData,
  mergeBlockData,
  isAtomicBlockFocused,
  blockKeyToEntityKey,
  setEntityData,
  setBlockNewEntityData,
  replaceWithEmptyBlock,
  deleteBlock,
  getBlockAtStartOfSelection,
  getSelectedBlocks,
  createEntity,
  createBlockAndFocus,
  createBlock,
  getBlockInfo,
  getBlockEntityType,
  getFocusedBlockKey,
  createCalcContentDiff,
  getEditorContentSummary,
  createSelection,
  getBlockType,
  hasInlineStyle,
  getDraftInlineStyle,
  indentSelectedBlocks,
  isTypeText,
  setForceSelection,
  deleteBlockText,
  insertString,
  deleteCharacterBeforeCursor,
  createLinkEntityData,
  getCharacterBeforeSelection,
  isPluginFocused,
  getSelectionRange,
  isInSelectionRange,
  cloneDeepWithoutEditorState,
  isCursorAtStartOfContent,
  isCursorAtFirstLine,
  selectAllContent,
  isAtomicBlockInSelection,
  setSelectionToBlock,
  hasBlockType,
} from './Utils/draftUtils';
export { getColor, setTextColor, setHighlightColor } from './Utils/colorUtils';
export { triggerMention, insertMention } from './Utils/mentionUtils';
export { isiOS } from './Utils/isiOS';
export { mergeToolbarSettings } from './Utils/mergeToolbarSettings';
export {
  COMMANDS,
  TEXT_TYPES,
  MODIFIERS,
  TOOLBARS,
  DISPLAY_MODE,
  CHARACTERS,
  FORMATTING_BUTTONS,
  INSERT_PLUGIN_BUTTONS,
  BUTTON_TYPES,
  KEYS_CHARCODE,
} from './consts';

import './draftTypes';
export * from './tiptapTypes';

import {
  convertFromRaw as convertFromRawDraft,
  RawDraftContentState,
  ContentState,
} from '@wix/draft-js';
import { DraftContent } from 'wix-rich-content-common';

// makes draft-js's convertFromRaw match our own DraftContent type
export const convertFromRaw = (rawState: DraftContent): ContentState =>
  convertFromRawDraft(rawState as RawDraftContentState);

export {
  convertToRaw,
  getVisibleSelectionRect,
  EditorState,
  SelectionState,
  DefaultDraftBlockRenderMap,
  Modifier,
  RichUtils,
  KeyBindingUtil,
  genKey,
  ContentBlock,
  BlockMapBuilder,
  AtomicBlockUtils,
  ContentState,
  RawDraftContentState,
  EditorChangeType,
  convertFromHTML,
  CharacterMetadata,
  BlockMap,
  getDefaultKeyBinding,
} from '@wix/draft-js';

import DraftOffsetKey from '@wix/draft-js/lib/DraftOffsetKey';
export { DraftOffsetKey };

export { isElementOutOfWindow } from './Utils/overflowUtils';

export const emptyDraftContent = {
  entityMap: {},
  blocks: [
    {
      text: '',
      key: 'foo',
      type: 'unstyled',
      depth: 0,
      inlineStyleRanges: [],
      entityRanges: [],
      data: {},
    },
  ],
};

export { getSelectionStyles } from './Utils/inlineStyleUtils';
export { createNodeExtension } from './Utils/tiptapUtils';
