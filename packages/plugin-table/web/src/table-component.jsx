/* eslint-disable jsx-a11y/no-noninteractive-tabindex */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { createRef } from 'react';
import PropTypes from 'prop-types';
import TableViewer from './table-viewer';
import styles from '../statics/styles/table-component.scss';
import Table from './domain/table';
import { getRange, getRowsRange, getColsRange } from './domain/tableDataUtil';
import { createEmptyCellEditor, isCellsNumberInvalid } from './tableUtil';
import { AddNewSection, Rows } from './components';
import TableToolbar from './TableToolbar/TableToolbar';
import { isPluginFocused, TOOLBARS, KEYS_CHARCODE } from 'wix-rich-content-editor-common';
import { isEmpty, isNumber, cloneDeep, isEqual } from 'lodash';
import classNames from 'classnames';
import './styles.css';
import { TABLE_TYPE } from './types';
import { SOURCE, LOCATION, CATEGORY, ACTION, ACTION_NAME } from './consts';

class TableComponent extends React.Component {
  constructor(props) {
    super(props);
    this.rowsRefs = [];
    this.state = {
      isEditingActive: false,
      isAllCellsSelected: false,
      selected: {},
      prevSelection: {},
    };
    this.innerRceAdditionalProps = { placeholder: '', handleReturn: this.handleReturn };
    this.innerEditorsRefs = {};
    this.table = new Table(props.componentData, this.updateTable, this.onPluginChange);
    this.tableRef = createRef();
    this.tableContainer = createRef();
    this.dragPreview = createRef();
    this.rowDragProps = {
      onDragClick: selected => this.selectRows(selected, true),
      onDragEnd: this.onRowDragEnd,
      onDrag: this.onRowDrag,
    };
    this.colDragProps = {
      onDragClick: selected => this.selectCols(selected, true),
      onDragEnd: this.onColDragEnd,
      onDrag: this.onColDrag,
    };
  }

  componentDidMount() {
    this.setState({ updateAllRows: true });
  }

  componentWillReceiveProps(nextProps) {
    if (
      !isPluginFocused(nextProps.block, nextProps.selection) &&
      isPluginFocused(this.props.block, this.props.selection)
    ) {
      this.setSelected();
    }
  }

  onPluginChange = biParams =>
    this.props.helpers?.onPluginChange?.(TABLE_TYPE, {
      ...biParams,
      type: CATEGORY.CELL_FORMATTING,
    });

  triggerBi = (eventName, biParams) =>
    this.props.helpers?.onPluginAction?.(eventName, { plugin_id: TABLE_TYPE, ...biParams });

  handleReturn = () => e => !(e.ctrlKey || e.metaKey || e.shiftKey || e.altKey) && 'handled';

  getCellState = (i, j) => this.table.getCellContent(i, j) || createEmptyCellEditor();

  selectCellContent = (i, j) => {
    this.table.getCell(i, j).content = this.innerEditorsRefs[`${i}-${j}`].selectAllContent(true);
    this.updateComponentData(this.table.componentData);
  };

  updateTable = data => {
    this.updateComponentData(data);
    this.setState({ updateAllRows: true });
  };

  updateComponentData = data => {
    this.props.store.update('componentData', { ...data });
  };

  renderInnerRCE = (i, j) => {
    const editorState = this.getCellState(i, j);
    return this.props.renderInnerRCE({
      editorState,
      onChange: editorState => this.table.updateCellContent(i, j, editorState),
      renderedIn: TABLE_TYPE,
      additionalProps: this.innerRceAdditionalProps,
      toolbarsToIgnore: ['InlineTextToolbar'],
      tablePluginMenu: true,
    });
  };

  selectRows = (rowsIndexes, disableSelectedStyle) => {
    const selected = rowsIndexes ? this.table.getRowsSelection(rowsIndexes) : {};
    this.setSelected(selected, disableSelectedStyle);
  };

  selectCols = (colsIndexes, disableSelectedStyle) => {
    const selected = colsIndexes ? this.table.getColsSelection(colsIndexes) : {};
    this.setSelected(selected, disableSelectedStyle);
  };

  setEditingActive = isEditingActive => {
    this.props.disableKeyboardEvents(isEditingActive);
    this.setState({ isEditingActive });
  };

  getCellEditorRef = (i, j) => this.innerEditorsRefs[`${i}-${j}`];

  getCellToolbarProps = (i, j) => this.getCellEditorRef(i, j)?.getToolbarProps(TOOLBARS.FORMATTING);

  distributeRows = selected => {
    this.table.distributeRows(this.innerEditorsRefs, getRowsRange(selected));
    this.setSelected();
  };

  distributeColumns = selected => {
    this.table.distributeColumns(getColsRange(selected));
    this.setSelected();
  };

  isCellEmpty = (i, j) =>
    this.table
      .getCellContent(i, j)
      .getCurrentContent()
      .getBlocksAsArray()[0]
      .getText() === '';

  handleFirstCellEmpty = toolbarPropsBeforeOrganize => {
    toolbarPropsBeforeOrganize.forEach((element, index) => {
      const firstElement = toolbarPropsBeforeOrganize[0];
      if (
        this.isCellEmpty(firstElement.indexes.i, firstElement.indexes.j) &&
        !this.isCellEmpty(element.indexes.i, element.indexes.j)
      ) {
        const temp = toolbarPropsBeforeOrganize[0];
        toolbarPropsBeforeOrganize[0] = element;
        toolbarPropsBeforeOrganize[index] = temp;
      }
    });
    return toolbarPropsBeforeOrganize.map(element => element.toolbarProps);
  };

  setToolbarProps = selected => {
    if (selected) {
      const range = getRange(selected);
      const toolbarPropsBeforeOrganize = [];
      range.forEach(({ i, j }) => {
        this.getCellEditorRef(i, j) &&
          toolbarPropsBeforeOrganize.push({
            toolbarProps: this.getCellToolbarProps(i, j),
            indexes: { i, j },
          });
      });
      const toolbarProps = this.handleFirstCellEmpty(toolbarPropsBeforeOrganize);
      this.toolbarRef?.setToolbarProps(toolbarProps);
    } else {
      this.toolbarRef?.setToolbarProps();
    }
  };

  setSelected = (selected, disableSelectedStyle) => {
    const isAllCellsSelected = this.isAllCellsSelected(selected);
    this.setState(
      {
        updateAllRows: !selected,
        prevSelection: this.state.selected,
        selected,
        isAllCellsSelected,
        highlightColResizer: false,
        highlightRowResizer: false,
        disableSelectedStyle,
      },
      () => this.setToolbarProps(selected)
    );
  };

  isAllCellsSelected = selected =>
    selected && this.table.isAllCellsSelected(selected.start, selected.end);

  onSelect = selected => {
    !isEqual(selected, this.state.selected) &&
      this.setSelected(this.table.fixSelectedWithMergeCells(selected));
  };

  getFirstCellRef = () => {
    const { selected } = this.state;
    let firstSelectedCellRef;
    if (!isEmpty(selected)) {
      const firstSelectedCell = getRange(selected)[0];
      const firstSelectedRowRef = this.rowsRefs[firstSelectedCell.i];
      Array.from(firstSelectedRowRef?.children || []).forEach((col, i) => {
        if (i === firstSelectedCell.j) {
          firstSelectedCellRef = col;
        }
      });
    }
    return firstSelectedCellRef;
  };

  setCellContent = (content, row, col) => {
    const rows = this.table.getRows();
    this.table.setCellContent(rows, content, row, col);
    this.table.setNewRows(rows);
  };

  // eslint-disable-next-line complexity
  onKeyDown = e => {
    const { selected } = this.state;
    if (this.shouldHandleKeyDown(e)) {
      if (e.key === 'a' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        this.setAllCellsSelected();
      } else if (
        this.isAllCellsSelected(selected) &&
        (e.key === 'Backspace' || e.key === 'Delete')
      ) {
        this.deleteTable();
      } else if (e.keyCode === KEYS_CHARCODE.SPACE) {
        e.ctrlKey && this.handleShortcutSelection(e, getColsRange(selected), this.selectCols, true);
        e.shiftKey && this.handleShortcutSelection(e, getRowsRange(selected), this.selectRows);
      } else if (e.altKey && e.ctrlKey) {
        if (e.key === '+' || e.key === '=') {
          const selectedCols = this.table.getSelectedCols(getRange(selected));
          selectedCols
            ? this.addCol(Math.max(...selectedCols) + 1, {
                source: SOURCE.KEYBOARD_SHORTCUT,
                location: LOCATION.RIGHT,
              })
            : this.addLastCol({ source: SOURCE.KEYBOARD_SHORTCUT });
        } else if (e.key === '-') {
          const selectedCols = this.table.getSelectedCols(getRange(selected));
          this.isAllCellsSelected(selected)
            ? this.deleteTable()
            : selectedCols && this.deleteColumn(selectedCols);
        }
      } else if (e.key === 't' && e.ctrlKey) {
        this.lastFocused = document.activeElement;
        this.toolbarRef.focus();
      } else if (e.keyCode === KEYS_CHARCODE.ESCAPE) {
        this.lastFocused && this.lastFocused.focus();
        this.lastFocused = undefined;
      }
    }
  };

  handleShortcutSelection = (e, indexes, selectFunc, isCol = false) => {
    const { selected } = this.state;
    const isAllSectionSelected = isCol
      ? this.table.getSelectedCols(getRange(selected))
      : this.table.getSelectedRows(getRange(selected));
    if (!isAllSectionSelected) {
      this.prevSelection = cloneDeep(this.state.selected);
      this.lastFocusedCell = document.activeElement;
      selectFunc({ start: Math.min(...indexes), end: Math.max(...indexes) });
    } else {
      this.lastFocusedCell?.focus();
      this.setSelected(this.prevSelection);
      this.prevSelection = null;
    }
    e.stopPropagation();
  };

  shouldHandleKeyDown = e => {
    const { selected, isEditingActive } = this.state;
    const isColorPickerModalOpen = e.target.closest('[data-id=color-picker-modal]');
    return (
      isPluginFocused(this.props.block, this.props.selection) &&
      selected &&
      !isEditingActive &&
      !isColorPickerModalOpen
    );
  };

  onPaste = (copiedCells, start) => {
    this.table.pasteCells(copiedCells, start.i, start.j);
    this.setSelectionOnPastedCells(copiedCells);
  };

  setSelectionOnPastedCells = copiedCells => {
    const { selected } = this.state;
    const { i: startI, j: startJ } = copiedCells[0];
    const { i: endI, j: endJ } = copiedCells[copiedCells.length - 1];
    const copiedRowsNum = endI - startI + 1;
    const copiedColsNum = endJ - startJ + 1;
    this.setSelected({
      ...selected,
      end: { i: selected.start.i + copiedRowsNum - 1, j: selected.start.j + copiedColsNum - 1 },
    });
  };

  setAllCellsSelected = () =>
    this.setSelected(this.table.getAllCellsSelection(this.props.componentData));

  toggleAllCellsSelection = () => {
    const { isAllCellsSelected } = this.state;
    if (isAllCellsSelected) {
      this.setSelected();
      this.setState({ isAllCellsSelected: false });
    } else {
      this.setAllCellsSelected();
    }
    this.setState({ isAllCellsSelected: !isAllCellsSelected });
  };

  handleClickOutsideSelectAll = () => {
    !this.isAllCellsSelected(this.state.selected) && this.setState({ isAllCellsSelected: false });
  };

  onResizeCol = columnsRefs => {
    this.table.setColWidthAfterResize(columnsRefs, this.tableRef.current.offsetWidth);
    this.triggerBi(ACTION_NAME.COLUMN_ROW_ACTION, {
      action: ACTION.RESIZE,
      category: CATEGORY.COLUMN,
    });
  };

  onResizeRow = (i, height) => {
    this.table.setRowHeight(
      getRowsRange(this.table.getRowsSelection({ start: i, end: i })),
      height
    );
    this.triggerBi(ACTION_NAME.COLUMN_ROW_ACTION, {
      action: ACTION.RESIZE,
      category: CATEGORY.ROW,
    });
  };

  setToolbarRef = ref => (this.toolbarRef = ref);

  highlightResizer = (i, isCol) => {
    if (isCol && this.state.highlightColResizer !== i) {
      this.setState({ highlightColResizer: i });
    } else if (!isCol && this.state.highlightRowResizer !== i) {
      this.setState({ highlightRowResizer: i });
    }
  };

  isPositionInBoundaries = (boundary, pos) => boundary - 10 < pos && pos < boundary + 10;

  onColDragEnd = (e, dragsIndex) => {
    dragsIndex && this.colDropIndex && this.table.reorderColumns(dragsIndex, this.colDropIndex);
    this.setState({ highlightColResizer: false });
    this.resetDrag();
    this.colDropIndex = null;
    this.position = null;
    this.triggerBi(ACTION_NAME.COLUMN_ROW_ACTION, {
      action: ACTION.REORDER,
      category: CATEGORY.COLUMN,
    });
  };

  onRowDragEnd = (e, dragsIndex) => {
    dragsIndex && this.rowDropIndex && this.table.reorderRows(dragsIndex, this.rowDropIndex);
    this.setState({ highlightRowResizer: false });
    this.resetDrag();
    this.dropTop = null;
    this.dragPadding = null;
    this.rowDropIndex = null;
    this.triggerBi(ACTION_NAME.COLUMN_ROW_ACTION, {
      action: ACTION.REORDER,
      category: CATEGORY.ROW,
    });
  };

  resetDrag = () => {
    this.dragPreview.current && (this.dragPreview.current.style.visibility = 'hidden');
    this.setSelected();
  };

  addRow = (i, biParams) => {
    if (!isCellsNumberInvalid(this.table.getRowNum() + 1, this.table.getColNum())) {
      this.table.addRow(i);
      this.selectRows({ start: i, end: i });
      this.triggerBi(ACTION_NAME.ADD_COLUMN_ROW, { category: CATEGORY.ROW, ...biParams });
    }
  };

  merge = () => {
    const { selected } = this.state;
    this.table.mergeCells(getRange(selected));
    const newI = selected.start.i < selected.end.i ? selected.start.i : selected.end.i;
    const newJ = selected.start.j < selected.end.j ? selected.start.j : selected.end.j;
    this.setSelected({ start: { i: newI, j: newJ }, end: { i: newI, j: newJ } });
  };

  getCellsFixedWidth = () => {
    let fixedWidth = 0;
    this.table.getColsWidth().forEach(width => isNumber(width) && (fixedWidth += width));
    return fixedWidth;
  };

  addCol = (i, biParams) => {
    if (!isCellsNumberInvalid(this.table.getRowNum(), this.table.getColNum() + 1)) {
      this.table.addColumn(i);
      this.selectCols({ start: i, end: i });
      this.triggerBi(ACTION_NAME.ADD_COLUMN_ROW, { category: CATEGORY.COLUMN, ...biParams });
    }
  };

  deleteRow = deleteIndexes => {
    this.table.deleteRow(deleteIndexes);
    this.setSelected();
    this.triggerBi(ACTION_NAME.DELETE_COLUMN_ROW, { category: CATEGORY.ROW });
  };

  deleteColumn = deleteIndexes => {
    this.table.deleteColumn(deleteIndexes);
    this.setSelected();
    this.triggerBi(ACTION_NAME.DELETE_COLUMN_ROW, { category: CATEGORY.COLUMN });
  };

  deleteTable = () => {
    this.props.blockProps.deleteBlock();
    this.triggerBi(ACTION_NAME.DELETE_COLUMN_ROW, { category: CATEGORY.ENTIRE_TABLE });
  };

  addLastRow = biParams => {
    this.addRow(this.table.getRowNum(), { ...biParams, location: LOCATION.BELOW });
  };

  addLastCol = biParams => {
    this.addCol(this.table.getColNum(), { ...biParams, location: LOCATION.RIGHT });
  };

  onColDrag = (e, dragsIndex) => {
    !this.position && (this.position = e.pageX);
    const movementX = e.movementX > 0 ? 'right' : e.movementX < 0 && 'left';
    const colsRefs = Array.from(this.rowsRefs[0]?.children || []);
    const colsPositions = colsRefs.map(col => col.offsetLeft);

    const dragPreviewWidth = this.colsWidth
      .slice(dragsIndex.start, dragsIndex.end + 1)
      .reduce((acc, curr) => acc + curr);
    const lastCol = colsRefs[colsRefs.length - 1];
    const maxLeft = lastCol.offsetLeft + lastCol.offsetWidth + 20 - dragPreviewWidth;
    const diff = e.pageX - this.position;
    const startPosition = colsPositions[dragsIndex.start];
    const dropLeft = Math.min(startPosition + diff + this.getTableScrollLeft(), maxLeft);
    colsPositions.forEach((pos, index) => {
      if (
        (movementX === 'right' && dropLeft > pos - 15) ||
        (movementX === 'left' && dropLeft > pos)
      ) {
        this.colDropIndex = index + 1;
      }
    });
    this.highlightResizer(this.colDropIndex - 1, true);

    this.dragPreview.current.style.left = `${dropLeft}px`;
    this.dragPreview.current.style.top = '0';
    this.dragPreview.current.style.visibility = 'visible';
    this.dragPreview.current.style.height = `${this.tableRef.current.offsetHeight}px`;
    this.dragPreview.current.style.width = `${dragPreviewWidth}px`;
  };

  onRowDrag = (e, dragsIndex) => {
    e.movementY > 0 ? (this.movementY = 'down') : e.movementY < 0 && (this.movementY = 'up');
    const rowsPositions = Object.entries(this.rowsRefs).map(([, row]) =>
      this.movementY === 'down' ? row.offsetTop + row.offsetHeight : row.offsetTop
    );
    const dragPreviewHeight = this.rowsHeights
      .slice(dragsIndex.start, dragsIndex.end + 1)
      .reduce((acc, curr) => acc + curr);
    if (this.dragPadding) {
      this.dropTop += e.pageY - this.dragPadding;
      this.dragPadding = e.pageY;
    } else {
      this.dropTop = 0;
      if (dragsIndex.start > 0) {
        this.rowsHeights.slice(0, dragsIndex.start).forEach(height => (this.dropTop += height));
      }
      this.dragPadding = e.pageY;
    }

    rowsPositions.forEach((pos, index) => {
      if (
        (this.movementY === 'down' && this.dropTop + dragPreviewHeight > pos - 20) ||
        (this.movementY === 'up' && this.dropTop > pos + 20)
      ) {
        this.rowDropIndex = index + 1;
      } else if (this.dropTop <= 15) {
        this.rowDropIndex = 0;
      }
    });
    this.highlightResizer(this.rowDropIndex - 1);

    this.dragPreview.current.style.top = `${this.dropTop}px`;
    this.dragPreview.current.style.visibility = 'visible';
    this.dragPreview.current.style.left = '0';
    this.dragPreview.current.style.height = `${dragPreviewHeight}px`;
    this.dragPreview.current.style.width = `${this.tableRef.current.offsetWidth}px`;
  };

  setRowRef = (ref, i) => (this.rowsRefs[i] = ref);

  setEditorRef = (ref, i, j) => (this.innerEditorsRefs[`${i}-${j}`] = ref);

  onFocus = e => e.stopPropagation();

  getRowsToUpdate = () => {
    const { selected = {}, prevSelection = {}, updateAllRows } = this.state;
    return updateAllRows
      ? [...Array(this.table.getRowNum()).fill(0)].map((row, i) => i)
      : [...getRowsRange(selected), ...getRowsRange(prevSelection)];
  };

  getTableScrollLeft = () => {
    const horizontalScrollbarElement = this.tableContainer?.current?.closest(
      '[data-id=horizontal-scrollbar-element]'
    );
    return horizontalScrollbarElement.scrollLeft;
  };

  render() {
    const { componentData, theme, t, isMobile, settings } = this.props;
    const {
      selected,
      isEditingActive,
      disableSelectedStyle,
      highlightColResizer,
      isAllCellsSelected,
    } = this.state;
    this.rowsHeights = Object.entries(this.rowsRefs).map(([, ref]) => ref?.offsetHeight);
    this.colsWidth = Array.from(this.rowsRefs[0]?.children || []).map(ref => ref?.offsetWidth);
    const isTableOnFocus = isPluginFocused(this.props.block, this.props.selection);
    const range = selected && getRange(selected);
    const isEditMode = !isMobile && isTableOnFocus;
    const rowNum = this.table.getRowNum();
    const colNum = this.table.getColNum();
    this.table.updateComponentData(componentData);
    return (
      <div
        className={classNames(styles.tableEditorContainer, 'has-custom-focus', {
          [styles.editMode]: isEditMode,
          [styles.viewMode]: !isEditMode,
        })}
        data-hook="TableComponent"
        onFocus={this.onFocus}
        tabIndex="0"
        ref={this.tableContainer}
        onKeyDown={this.onKeyDown}
      >
        {!isMobile && (
          <TableToolbar
            ref={this.setToolbarRef}
            selected={selected}
            table={this.table}
            innerEditorsRefs={this.innerEditorsRefs}
            addCol={this.addCol}
            addRow={this.addRow}
            deleteColumn={this.deleteColumn}
            deleteRow={this.deleteRow}
            isEditingActive={isEditingActive}
            tableWidth={this.tableRef.current?.parentElement?.offsetWidth}
            getFirstCellRef={this.getFirstCellRef}
            t={t}
            theme={theme}
            isMobile={isMobile}
            settings={settings}
            selectRows={this.selectRows}
            selectCols={this.selectCols}
            deleteBlock={this.deleteTable}
            isAllCellsSelected={this.isAllCellsSelected(selected)}
            merge={this.merge}
            distributeRows={this.distributeRows}
            distributeColumns={this.distributeColumns}
            getTableScrollLeft={this.getTableScrollLeft}
            triggerBi={this.triggerBi}
          />
        )}
        {!isMobile && (
          <Rows
            rowDragProps={this.rowDragProps}
            activeDrag={
              this.state.isEditingActive
                ? []
                : this.table.getSelectedRows(range)?.map(i => parseInt(i))
            }
            isAllCellsSelected={isAllCellsSelected}
            size={this.tableRef.current?.offsetWidth}
            onResize={this.onResizeRow}
            highlightResizer={this.state.highlightRowResizer}
            onResizeStart={this.setSelected}
            isSelectAllActive={this.isAllCellsSelected(selected)}
            onSelectAllClick={this.toggleAllCellsSelection}
            rowNum={rowNum}
            isEditMode={isEditMode}
            rowsHeights={this.rowsHeights}
            rowsRefs={this.rowsRefs}
            rowsMaxContentHeight={
              this.innerEditorsRefs && this.table.getRowsMaxContentHeight(this.innerEditorsRefs)
            }
          />
        )}
        <div
          ref={this.tableRef}
          className={styles.tableWrapper}
          style={isTableOnFocus ? { zIndex: 2 } : {}}
        >
          <TableViewer
            table={this.table}
            renderInnerRCE={this.renderInnerRCE}
            onSelect={this.onSelect}
            theme={theme}
            setRowRef={this.setRowRef}
            setEditorRef={this.setEditorRef}
            toolbarRef={this.toolbarRef}
            setEditingActive={this.setEditingActive}
            selected={selected}
            tableWidth={this.tableRef.current?.offsetWidth}
            isMobile={isMobile}
            isEditMode={isEditMode}
            disableSelectedStyle={
              disableSelectedStyle ||
              this.table.getSelectedCols(range) ||
              this.table.getSelectedRows(range)
            }
            t={t}
            colDragProps={this.colDragProps}
            onResize={this.onResizeCol}
            onResizeStart={this.setSelected}
            highlightResizer={highlightColResizer}
            selectAll={isAllCellsSelected}
            tableHeight={this.tableRef.current?.offsetHeight}
            isEditingActive={this.state.isEditingActive}
            onClear={this.table.clearCells}
            setCellContent={this.setCellContent}
            onPaste={this.onPaste}
            tableOverflowWidth={
              this.tableRef.current?.offsetWidth - this.tableContainer.current?.offsetWidth
            }
            rowsToUpdate={this.getRowsToUpdate()}
            selectCellContent={this.selectCellContent}
          />
          <div className={styles.dragPreview} ref={this.dragPreview} />
        </div>
        {!isMobile && (
          <div className={styles.addCol}>
            <AddNewSection
              dataHook={'addCol'}
              onClick={this.addLastCol}
              shouldDisable={isCellsNumberInvalid(rowNum, colNum + 1)}
              t={t}
            />
          </div>
        )}
        {!isMobile && (
          <div className={styles.addRow}>
            <AddNewSection
              dataHook={'addRow'}
              onClick={this.addLastRow}
              shouldDisable={isCellsNumberInvalid(rowNum + 1, colNum)}
              t={t}
            />
          </div>
        )}
      </div>
    );
  }
}

TableComponent.propTypes = {
  blockProps: PropTypes.object.isRequired,
  block: PropTypes.object.isRequired,
  store: PropTypes.object.isRequired,
  componentData: PropTypes.object.isRequired,
  renderInnerRCE: PropTypes.func,
  theme: PropTypes.object,
  selection: PropTypes.object.isRequired,
  t: PropTypes.func,
  isMobile: PropTypes.bool,
  settings: PropTypes.object,
  disableKeyboardEvents: PropTypes.func,
  helpers: PropTypes.object,
};

export { TableComponent as Component };
