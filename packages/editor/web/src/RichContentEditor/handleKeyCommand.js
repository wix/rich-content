/* eslint-disable no-restricted-globals */

import {
  COMMANDS,
  mergeBlockData,
  RichUtils,
  indentSelectedBlock,
  insertString,
  deleteString,
  TEXT_TYPES,
  CHARACTERS,
} from 'wix-rich-content-editor-common';
import handleBackspaceCommand from './handleBackspaceCommand';
import handleDeleteCommand from './handleDeleteCommand';

const isList = blockType =>
  blockType === 'ordered-list-item' || blockType === 'unordered-list-item';
const isTab = command => command === COMMANDS.TAB || command === COMMANDS.SHIFT_TAB;
const isCodeBlock = blockType => blockType === 'code-block';
const isText = blockType => {
  return TEXT_TYPES.some(type => type === blockType);
};

const handleTabCommand = (editorState, blockType, customHandlers, command) => {
  let newState;
  if (isList(blockType)) {
    const direction = !event.shiftKey ? 1 : -1;
    newState = indentSelectedBlock(editorState, direction);
  } else if (isText(blockType)) {
    if (!event.shiftKey) {
      newState = insertString(editorState, CHARACTERS.TAB);
    } else {
      newState = deleteString(editorState, CHARACTERS.TAB);
    }
  } else if (!isCodeBlock(blockType)) {
    newState = customHandlers[command](editorState);
  }
  return newState;
};

export default (updateEditorState, customHandlers, blockType) => (command, editorState) => {
  let newState;

  if (customHandlers[command]) {
    if (isTab(command)) {
      newState = handleTabCommand(editorState, blockType, customHandlers, command);
    } else {
      newState = customHandlers[command](editorState);
    }
  } else {
    switch (command) {
      case COMMANDS.ALIGN_RIGHT:
      case COMMANDS.ALIGN_LEFT:
      case COMMANDS.ALIGN_CENTER:
      case COMMANDS.JUSTIFY:
        newState = mergeBlockData(editorState, { textAlignment: command });
        break;
      case COMMANDS.TITLE:
      case COMMANDS.SUBTITLE:
      case COMMANDS.NUMBERED_LIST:
      case COMMANDS.BULLET_LIST:
      case COMMANDS.BLOCKQUOTE:
      case COMMANDS.CODE:
        newState = RichUtils.toggleBlockType(editorState, command);
        break;
      case COMMANDS.BACKSPACE:
        newState = handleBackspaceCommand(editorState);
        break;
      case COMMANDS.DELETE:
        newState = handleDeleteCommand(editorState);
        break;
      default:
        newState = RichUtils.handleKeyCommand(editorState, command);
        break;
    }
  }

  if (newState) {
    updateEditorState(newState);
    return 'handled';
  }

  return 'not-handled';
};
