import { EditorState, ContentBlock } from '../index';
import {
  shiftRedoStack,
  pushToRedoStack,
  removeCompositionModeFromEditorState,
  preserveSelection,
  replaceComponentData,
  removeFocus,
  setLastChangeType,
  getBlocksEntityTypeAndData,
  didBlocksChange,
  doesEntityExistInBoth,
} from './undoRedoDraftUtils';
import {
  IMAGE_TYPE,
  VIDEO_TYPE,
  FILE_UPLOAD_TYPE,
  GALLERY_TYPE,
  COLLAPSIBLE_LIST_TYPE,
  TABLE_TYPE,
  POLL_TYPE,
} from 'wix-rich-content-common';
import { isEqual } from 'lodash';

/* Type declarations */

const IGNORE_TYPE = 'ignore';
const INNER_RICOS_TYPES = [COLLAPSIBLE_LIST_TYPE, TABLE_TYPE];

// new plugins should be added while they are not supported
const PLUGINS_TO_IGNORE: string[] = [POLL_TYPE];

type EntityToReplace = {
  fixedData?: Record<string, unknown>;
  blockKey?: string;
  shouldUndoAgain: boolean;
};

type UndoOperationResult = {
  fixedEditorState: EditorState;
  shouldUndoAgain: boolean;
};

function getType(type: string) {
  if (PLUGINS_TO_IGNORE.includes(type)) {
    return IGNORE_TYPE;
  }
  return type;
}

function getFixedEntityFromInnerRicos(currentBlock, contentState, newContentState) {
  const { key: blockKey } = currentBlock;
  const { type, data: currentData } = getBlocksEntityTypeAndData(blockKey, contentState);
  const { data: newData } = getBlocksEntityTypeAndData(blockKey, newContentState);
  const entityToReplace = innerRicosDataFixers[type]?.(currentData, newData);
  const { shouldUndoAgain, fixedData } = entityToReplace;
  const didInnerRicosChange = (shouldUndoAgain && !!fixedData) || !shouldUndoAgain;
  return didInnerRicosChange && entityToReplace;
}

function getFixedEntity(currentBlock, contentState, newContentState) {
  const { key: blockKey } = currentBlock;
  const { type, data: currentData } = getBlocksEntityTypeAndData(blockKey, contentState);
  const { data: newData } = getBlocksEntityTypeAndData(blockKey, newContentState);
  const didChange = !isEqual(currentData, newData);
  let entityToReplace: EntityToReplace = { shouldUndoAgain: !didChange };
  const fixedData = didChange && entityDataFixers[getType(type)]?.(currentData, newData);
  if (fixedData) {
    entityToReplace = {
      fixedData,
      shouldUndoAgain: true,
    };
  }
  return didChange && entityToReplace;
}

function getEntityToReplace(newContentState, contentState): EntityToReplace {
  let entityToReplace;
  const didChange = contentState
    .getBlockMap()
    .filter((block: ContentBlock) => doesEntityExistInBoth(block, newContentState))
    .some(currentBlock => {
      const { key: blockKey } = currentBlock;
      const { type } = getBlocksEntityTypeAndData(blockKey, contentState);
      const fixedEntityGetter = INNER_RICOS_TYPES.includes(type)
        ? getFixedEntityFromInnerRicos
        : getFixedEntity;
      const entity = fixedEntityGetter(currentBlock, contentState, newContentState);
      entityToReplace = {
        blockKey,
        ...entity,
      };
      return !!entity;
    });
  return (didChange && entityToReplace) || { shouldUndoAgain: true };
}

// fixes entities in EditorStates
function fixBrokenRicosStates(
  nextEditorState: EditorState,
  editorState: EditorState
): UndoOperationResult {
  const newContentState = nextEditorState.getCurrentContent();
  const contentState = editorState.getCurrentContent();
  const result: UndoOperationResult = {
    fixedEditorState: preserveSelection(editorState, nextEditorState),
    shouldUndoAgain: false,
  };
  if (!didBlocksChange(contentState, newContentState)) {
    const { blockKey, fixedData, shouldUndoAgain } = getEntityToReplace(
      newContentState,
      contentState
    );
    blockKey && fixedData && replaceComponentData(result.fixedEditorState, blockKey, fixedData);
    result.shouldUndoAgain = shouldUndoAgain;
  }
  return result;
}

/* Collapsible List Entity Handling */

function didCollapsibleListConfigChange(currentData, newData): boolean {
  const { pairs: currentPairs } = currentData;
  const { pairs: newPairs } = newData;
  return newPairs.length !== currentPairs.length || !isEqual(currentData.config, newData.config);
}

function checkCollapsibleListPair(currentPair, newPair): string | boolean {
  const { key: newKey, title: newTitle, content: newContent } = newPair;
  const { key: currentKey, title: currentTitle, content: currentContent } = currentPair;
  return (
    (currentKey !== newKey && 'key') ||
    (currentTitle.getCurrentContent() !== newTitle.getCurrentContent() && 'title') ||
    (currentContent.getCurrentContent() !== newContent.getCurrentContent() && 'content')
  );
}

// checks if an collapsible list pair changed and if so returns the changed pair index and an indictor (title or content)
function getChangedCollapsibleListPairIndex(currentPairs, newPairs) {
  let item;
  const changedPairIndex = newPairs.findIndex((newPair, index) => {
    const currentPair = currentPairs[index];
    item = checkCollapsibleListPair(currentPair, newPair);
    return !!item;
  });
  return { didChange: changedPairIndex > -1, changedPairIndex, item };
}

function getNewPairs(currentPairs, newPairs) {
  return newPairs.map((newPair, index) => {
    return {
      key: newPair.key || currentPairs[index].key,
      title: newPair.title || currentPairs[index].title,
      content: newPair.content || currentPairs[index].content,
    };
  });
}

function getFixedCollapsibleListEditorStates(currentData, newData) {
  const { pairs: currentPairs } = currentData;
  const newPairs = getNewPairs(currentPairs, newData.pairs);
  const { didChange, changedPairIndex, item } = getChangedCollapsibleListPairIndex(
    currentPairs,
    newPairs
  );
  let entityToReplace: EntityToReplace = { shouldUndoAgain: !didChange };
  if (item && item !== 'key') {
    const { fixedEditorState, shouldUndoAgain } = fixBrokenRicosStates(
      newPairs[changedPairIndex][item],
      currentPairs[changedPairIndex][item]
    );
    newPairs[changedPairIndex][item] = setLastChangeType(removeFocus(fixedEditorState), 'undo');
    entityToReplace = {
      fixedData: {
        ...newData,
        pairs: newPairs,
      },
      shouldUndoAgain,
    };
  }
  return entityToReplace;
}

function setChangeTypeForCollapsibleListPairs(newPairs, lastChangeType) {
  return newPairs.map(pair => {
    return {
      key: pair.key,
      title: setLastChangeType(
        pair.title
          ? EditorState.createWithContent(pair.title.getCurrentContent())
          : EditorState.createEmpty(),
        lastChangeType
      ),
      content: setLastChangeType(
        pair.content
          ? EditorState.createWithContent(pair.content?.getCurrentContent())
          : EditorState.createEmpty(),
        lastChangeType
      ),
    };
  });
}

function handleCollapsibleListEntity(currentData, newData): EntityToReplace {
  return didCollapsibleListConfigChange(currentData, newData)
    ? { shouldUndoAgain: false }
    : getFixedCollapsibleListEditorStates(currentData, newData);
}

/* Table Entity Handling */

function setCellChangeType(rows, rowKey, columnKey, lastChangeType) {
  rows[rowKey].columns[columnKey].content = setLastChangeType(
    rows[rowKey].columns[columnKey].content,
    lastChangeType
  );
}

function setChangeTypeForTableCells(newRows, lastChangeType) {
  Object.keys(newRows).forEach(rowKey =>
    Object.keys(newRows[rowKey].columns).forEach(columnKey => {
      setCellChangeType(newRows, rowKey, columnKey, lastChangeType);
    })
  );
  return newRows;
}

// check table row's columns for a changed column.
function checkColumnEditorStates(newRow, currentRow) {
  return Object.keys(newRow).find(columnKey => {
    const { content: newContent } = newRow[columnKey];
    const { content: currentContent } = currentRow[columnKey];
    return newContent.getCurrentContent() !== currentContent.getCurrentContent();
  });
}

// looks for a changed cell in the new content, if there is returns it's indices.
function getChangedTableCellIndex(newRows, currentRows) {
  const changedCell: { row?: string; column?: string } = {};
  changedCell.row = Object.keys(newRows).find(rowKey => {
    const currentRow = currentRows[rowKey].columns;
    const newRow = newRows[rowKey].columns;
    changedCell.column = checkColumnEditorStates(newRow, currentRow);
    return !!changedCell.column;
  });
  return changedCell;
}

function getFixedTableData(currentData, newData): EntityToReplace {
  const { rows: newRows, ...newConfig } = newData.config;
  const { rows: currentRows } = currentData.config;
  const { row, column } = getChangedTableCellIndex(newRows, currentRows);
  const entityToReplace: EntityToReplace = { shouldUndoAgain: !(row && column) };
  if (row && column) {
    const { fixedEditorState, shouldUndoAgain } = fixBrokenRicosStates(
      newRows[row].columns[column].content,
      currentRows[row].columns[column].content
    );
    newRows[row].columns[column].content = setLastChangeType(removeFocus(fixedEditorState), 'undo');
    entityToReplace.fixedData = {
      ...newData,
      config: {
        rows: newRows,
        ...newConfig,
      },
    };
    entityToReplace.shouldUndoAgain = shouldUndoAgain;
  }
  return entityToReplace;
}

function didTableConfigChange(currentData, newData) {
  const { rows: newRows, ...newConfig } = newData.config;
  const { rows: currentRows, ...currentConfig } = currentData.config;
  return (
    !isEqual(newConfig, currentConfig) ||
    Object.keys(newRows).length !== Object.keys(currentRows).length
  );
}

function didCellStyleChange(newRow, currentRow) {
  return Object.keys(newRow).some(columnKey => {
    /* eslint-disable no-unused-vars */
    /* eslint-disable @typescript-eslint/no-unused-vars */
    const { content: newContent, ...newStyles } = newRow[columnKey];
    const { content: currentContent, ...currentStyles } = currentRow[columnKey];
    /* eslint-enable no-unused-vars */
    /* eslint-enable @typescript-eslint/no-unused-vars */
    return JSON.stringify(newStyles) !== JSON.stringify(currentStyles);
  });
}

function didTableRowStyleChange(currentData, newData) {
  const { rows: newRows } = newData.config;
  const { rows: currentRows } = currentData.config;
  return (
    Object.keys(newRows).length !== Object.keys(currentRows).length ||
    Object.keys(newRows).some(rowKey => {
      const currentRow = currentRows[rowKey].columns;
      const newRow = newRows[rowKey].columns;
      return (
        !currentRow ||
        Object.keys(newRow).length !== Object.keys(currentRow).length ||
        didCellStyleChange(newRow, currentRow)
      );
    })
  );
}

function handleTableEntity(currentData, newData): EntityToReplace {
  return didTableConfigChange(currentData, newData) || didTableRowStyleChange(currentData, newData)
    ? { shouldUndoAgain: false }
    : getFixedTableData(currentData, newData);
}

/* Data Fixers for breakable plugins */

// applies undo action on gallery items by fixing the changed item if it's source was broken
function applyActionForGalleryItems(currentItems, newItems) {
  let didChange = false;
  const fixedItems = newItems.map((newItem, index) => {
    const currentItem = currentItems[index];
    if (currentItem && !currentItem.tempData && newItem.tempData) {
      didChange = true;
      const {
        url,
        metadata: { type, height, width },
      } = currentItem;
      const metadata = { ...newItem.metadata, type, height, width };
      return { ...newItem, url, metadata, tempData: undefined };
    }
    return newItem;
  });
  return { fixedItems, didChange };
}

function shouldReplaceVideoData(currentData, newData): boolean {
  return (
    (!currentData.tempData && newData.tempData) ||
    (currentData.metadata && !newData.metadata) ||
    (currentData.src && !newData.src)
  );
}

const entityDataFixers = {
  [IMAGE_TYPE]: (currentData, newData) => {
    const { src, error } = currentData;
    if (src && !newData.src) {
      return { ...newData, src, error };
    }
  },
  [VIDEO_TYPE]: (currentData, newData) => {
    if (shouldReplaceVideoData(currentData, newData)) {
      const { config } = newData;
      return { ...currentData, config };
    }
  },
  [FILE_UPLOAD_TYPE]: (currentData, newData) => {
    const { config } = newData;
    return { ...currentData, config };
  },
  [GALLERY_TYPE]: (currentData, newData) => {
    const { fixedItems, didChange } = applyActionForGalleryItems(currentData.items, newData.items);
    if (didChange) {
      return { ...newData, items: fixedItems };
    }
  },
  [IGNORE_TYPE]: currentData => {
    return { ...currentData };
  },
};

const innerRicosDataFixers = {
  [COLLAPSIBLE_LIST_TYPE]: (currentData, newData) =>
    handleCollapsibleListEntity(currentData, newData),
  [TABLE_TYPE]: (currentData, newData) => handleTableEntity(currentData, newData),
};

const innerRicosChangeTypeSetters = {
  [COLLAPSIBLE_LIST_TYPE]: prevData => {
    return {
      ...prevData,
      pairs: setChangeTypeForCollapsibleListPairs(prevData.pairs, 'redo'),
    };
  },
  [TABLE_TYPE]: prevData => {
    return {
      ...prevData,
      config: {
        ...prevData.config,
        rows: setChangeTypeForTableCells(prevData.config.rows, 'redo'),
      },
    };
  },
};

/* Handle undo-redo calls */

function getContentStateForRedoStack(prevEditorState: EditorState) {
  const prevContentState = prevEditorState.getCurrentContent();
  prevContentState
    .getBlockMap()
    .filter((block: ContentBlock) => !!block.getEntityAt(0))
    .forEach((block: ContentBlock) => {
      const blockKey = block.getKey();
      const { type, data: prevData } = getBlocksEntityTypeAndData(blockKey, prevContentState);
      const fixedData = innerRicosChangeTypeSetters[type]?.(prevData);
      fixedData && replaceComponentData(prevEditorState, blockKey, fixedData);
    });
  return prevEditorState.getCurrentContent();
}

function updateUndoEditorState(editorState: EditorState, newEditorState: EditorState): EditorState {
  const { fixedEditorState, shouldUndoAgain } = fixBrokenRicosStates(newEditorState, editorState);
  return shouldUndoAgain
    ? pluginsUndo(fixedEditorState)
    : pushToRedoStack(
        removeCompositionModeFromEditorState(fixedEditorState),
        getContentStateForRedoStack(editorState)
      );
}

export const pluginsUndo = (editorState: EditorState): EditorState => {
  if (editorState.getUndoStack().isEmpty()) {
    return editorState;
  }
  const newEditorState = shiftRedoStack(EditorState.undo(editorState));
  return updateUndoEditorState(editorState, newEditorState);
};

export const undo = (editorState: EditorState): EditorState => {
  if (editorState.getUndoStack().isEmpty()) {
    return editorState;
  }
  return removeCompositionModeFromEditorState(EditorState.undo(editorState));
};

export const redo = (editorState: EditorState): EditorState => {
  if (editorState.getRedoStack().isEmpty()) {
    return editorState;
  }
  return removeCompositionModeFromEditorState(EditorState.redo(editorState));
};
