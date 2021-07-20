import { getColors } from '../defaults';
import { CELL_MANUAL_MIN_WIDTH, CELL_AUTO_MIN_WIDTH } from '../consts';

//RESIZERS
const getStyleVal = (elm, css) => {
  return window.getComputedStyle(elm, null).getPropertyValue(css);
};

export const paddingDiff = col => {
  if (getStyleVal(col, 'box-sizing') === 'border-box') {
    return 0;
  }
  const padLeft = getStyleVal(col, 'padding-left');
  const padRight = getStyleVal(col, 'padding-right');
  return parseInt(padLeft) + parseInt(padRight);
};

export const getRefWidthAsNumber = ref => getSizeStringAsNumber(ref.style.width);

export const getSizeStringAsNumber = str => parseInt(str.substring(0, str.length - 2));

//SELECTION
export const range = (start, end) =>
  end >= start
    ? Array(end - start + 1)
        .fill(start)
        .map((val, i) => val + i)
    : range(end, start);

export const getRange = ({ start, end }) => {
  const ranges = [];
  start &&
    end &&
    range(start.i, end.i).map(i => range(start.j, end.j).map(j => ranges.push({ i, j })));
  return ranges;
};

export const getColsRange = ({ start, end }) => getSectionRange(start, end, 'j');

export const getRowsRange = ({ start, end }) => getSectionRange(start, end, 'i');

const getSectionRange = (start = {}, end = {}, key) => {
  const ranges = [];
  range(start[key], end[key]).map(index => ranges.push(index));
  return ranges;
};

export class TableDataUtil {
  constructor(componentData) {
    this.updateComponentData(componentData);
  }

  updateComponentData = componentData => {
    this.componentData = componentData;
  };

  //TABLE DATA GETTERS
  getRowColumns = i => this.getRow(i)?.columns;

  getRows = () => this.componentData?.config?.rows;

  getRow = i => this.getRows()?.[i];

  getRowNum = () => Object.entries(this.getRows()).length;

  getColNum = () => Object.entries(this.getRowColumns(0)).length;

  getCell = (i, j) => this.getRow(i) && this.getRowColumns(i)[j];

  getCellContent = (i, j) => this.getCell(i, j)?.content;

  getCellStyle = (i, j) => this.getCell(i, j)?.style;

  getColsWidth = () => this.componentData.config.colsWidth;

  getRowsHeight = () => this.componentData.config.rowsHeight;

  getColWidth = j => this.getColsWidth()[j];

  getRowHeight = i => this.getRowsHeight()[i];

  getColsMinWidth = () => this.componentData.config.colsMinWidth;

  // get min width of column (in case we want min width for column with specific atomic plugins)
  getColMinWidth = j => {
    let colMinWidth = CELL_MANUAL_MIN_WIDTH;
    const numberOfRows = this.getRowNum();
    // eslint-disable-next-line fp/no-loops
    for (let i = 0; i < numberOfRows; i++) {
      const content = this.getCellContent(i, j);
      const contentState = content.getCurrentContent();
      // eslint-disable-next-line no-loop-func
      contentState.getBlockMap().forEach(block => {
        if (block.type === 'atomic') {
          const entityKey = block.getEntityAt(0);
          const entity = entityKey ? contentState.getEntity(entityKey) : undefined;
          const type = entity?.getType();
          if (type === 'wix-draft-plugin-image' || type === 'wix-draft-plugin-video') {
            colMinWidth = 300;
          }
        }
      });
    }
    return colMinWidth;
  };

  getCellWidthAsPixel = (tableWidth, i, colsMinWidth = []) => {
    const colsWidthSum = this.getColsWidth().reduce((acc, val) => acc + val, 0);
    let smallestCellIndex, smallestCellWidth, currCellWidth;
    this.getColsWidth().forEach((width, index) => {
      const cellWidth = tableWidth * (width / colsWidthSum);
      if (index === i) {
        currCellWidth = cellWidth;
      } else if (
        cellWidth < CELL_AUTO_MIN_WIDTH &&
        (!smallestCellWidth || smallestCellWidth > cellWidth)
      ) {
        smallestCellWidth = Math.max(colsMinWidth[index], cellWidth);
        smallestCellIndex = index;
      }
    });
    if (smallestCellWidth) {
      currCellWidth =
        Math.min(CELL_AUTO_MIN_WIDTH, smallestCellWidth) *
        (this.getColWidth(i) / this.getColWidth(smallestCellIndex));
    }
    return Math.max(currCellWidth, colsMinWidth[i]);
  };

  getCellWidthAsRatio = (tableWidth, totalColsWidth, cellWidth) =>
    (totalColsWidth * cellWidth) / tableWidth;

  //MERGE
  getCellMergeData = (i, j) => this.getCell(i, j)?.merge;

  getParentCell = key => {
    let parentCell;
    Object.entries(this.getRows()).forEach(([i, row]) => {
      !parentCell &&
        Object.entries(row.columns).forEach(([j]) => {
          const merge = this.getCellMergeData(i, j);
          if (merge?.key === key) {
            parentCell = { ...merge, row: i, col: j };
          }
        });
    });
    return parentCell;
  };

  fixSelectedWithMergeCells = selected => {
    const selectedCells = getRange(selected);
    selectedCells.length > 1 &&
      selectedCells.forEach(({ i, j }) => {
        const { parentCellKey, rowSpan, colSpan } = this.getCellMergeData(i, j) || {};
        const parentCell = parentCellKey && this.getParentCell(parentCellKey);
        const extendSelectionBySpan = (i, j, rowSpan, colSpan) => {
          if (rowSpan > 1 || colSpan > 1) {
            [...Array(rowSpan).fill(0)].forEach((row, rowIndex) => {
              [...Array(colSpan).fill(0)].forEach((col, colIndex) => {
                const fixPos = (key, newPos) => {
                  const start =
                    selected.start[key] <= selected.end[key] ? selected.start : selected.end;
                  const end =
                    selected.start[key] <= selected.end[key] ? selected.end : selected.start;
                  start[key] > newPos && (start[key] = newPos);
                  end[key] < newPos && (end[key] = newPos);
                };
                fixPos('i', i + rowIndex);
                fixPos('j', j + colIndex);
              });
            });
          }
        };
        if (parentCell) {
          const { row, col, rowSpan, colSpan } = parentCell;
          extendSelectionBySpan(parseInt(row), parseInt(col), rowSpan, colSpan);
        } else {
          extendSelectionBySpan(i, j, rowSpan, colSpan);
        }
      });
    return selected;
  };

  getCellParentPosition = (i, j) => {
    const { parentCellKey, rowSpan, colSpan } = this.getCellMergeData(i, j) || {};
    if (parentCellKey) {
      const { row, col } = this.getParentCell(parentCellKey);
      return { i: row, j: col };
    } else if (rowSpan > 1 || colSpan > 1) {
      return { i, j };
    }
  };

  getRowCellsParentPosition = i => {
    let parentPos;
    Object.entries(this.getRowColumns(i)).forEach(([j]) => {
      !parentPos && (parentPos = this.getCellParentPosition(i, j));
    });
    return parentPos;
  };

  getColCellsParentPosition = j => {
    let parentPos;
    Object.entries(this.getRows()).forEach(([i]) => {
      !parentPos && (parentPos = this.getCellParentPosition(i, j));
    });
    return parentPos;
  };

  //SELECTION
  getRowsSelection = rowsIndexes => ({
    start: { i: rowsIndexes.start, j: 0 },
    end: { i: rowsIndexes.end, j: this.getColNum() - 1 },
  });

  getColsSelection = colsIndexes => ({
    start: { i: 0, j: colsIndexes.start },
    end: { i: this.getRowNum() - 1, j: colsIndexes.end },
  });

  getAllCellsSelection = () => ({
    start: { i: 0, j: 0 },
    end: {
      i: this.getRowNum() - 1,
      j: this.getColNum() - 1,
    },
  });

  isAllCellsSelected = (start, end) =>
    start &&
    end &&
    Math.min(start.i, end.i) === 0 &&
    Math.min(start.j, end.j) === 0 &&
    Math.max(start.i, end.i) === this.getRowNum() - 1 &&
    Math.max(start.j, end.j) === this.getColNum() - 1;

  getSelectionStyle = (selection, defaultBG, defaultBorder) => {
    const range = getRange(selection);
    let selectionBGColor = this.getCellStyle(range[0].i, range[0].j)?.backgroundColor || defaultBG;
    let selectionBorderColor = this.getConsistentCellBorderColor(
      selection,
      range[0].i,
      range[0].j,
      defaultBorder
    );
    let selectionVerticalAlign = this.getCellStyle(range[0].i, range[0].j)?.verticalAlign || 'top';
    let selectionBorderIsActive = false;
    range.forEach(({ i, j }) => {
      const currentCellBGColor = this.getCellStyle(i, j)?.backgroundColor || defaultBG;
      if (selectionBGColor !== currentCellBGColor) {
        selectionBGColor = false;
      }
      const currentCellBorderColor = this.getConsistentCellBorderColor(
        selection,
        i,
        j,
        selectionBorderColor
      );
      if (selectionBorderColor !== currentCellBorderColor) {
        selectionBorderColor = false;
      }
      if (this.isCellBorderActive(selection, i, j)) {
        selectionBorderIsActive = true;
      }
      const currentVerticalAlign = this.getCellStyle(i, j)?.verticalAlign || 'top';
      if (selectionVerticalAlign !== currentVerticalAlign) {
        selectionVerticalAlign = false;
      }
    });
    return {
      selectionBGColor,
      selectionBorderColor,
      selectionVerticalAlign,
      selectionBorderIsActive,
    };
  };

  getSelectedRows = (range = []) => {
    const colNum = this.getColNum();
    return this.getSelectedSection(range, ({ i, j }) => ({ key: i, value: j }), colNum);
  };

  getSelectedCols = (range = []) => {
    const rowNum = this.getRowNum();
    return this.getSelectedSection(range, ({ i, j }) => ({ key: j, value: i }), rowNum);
  };

  getSelectedSection = (range, keyValueMapper, cellsNum) => {
    const selectedCells = {};
    range?.forEach(range => {
      const { key, value } = keyValueMapper(range);
      if (selectedCells[key]) {
        selectedCells[key].push(value);
      } else {
        selectedCells[key] = [value];
      }
    });
    const selected = [];
    Object.entries(selectedCells).forEach(
      ([j, col]) => col.length === cellsNum && selected.push(j)
    );
    return selected[0] && selected;
  };

  getCellBorderColor = (selection, row, col) => {
    const style = {};
    const range = getRange(selection);
    if (!range.find(({ i, j }) => i === row && j === col - 1)) {
      style.borderLeft = this.getCell(row, col)?.border?.left;
    }
    if (!range.find(({ i, j }) => i === row && j === col + 1)) {
      style.borderRight = this.getCell(row, col)?.border?.right;
    }
    if (!range.find(({ i, j }) => i === row - 1 && j === col)) {
      style.borderTop = this.getCell(row, col)?.border?.top;
    }
    if (!range.find(({ i, j }) => i === row + 1 && j === col)) {
      style.borderBottom = this.getCell(row, col)?.border?.bottom;
    }
    return Object.values(style);
  };

  getConsistentCellBorderColor = (selection, row, col, defaultBorder) => {
    const borderStyles = this.getCellBorderColor(selection, row, col);
    const isBorderConsistent = borderStyles.every(borderStyle => borderStyle === borderStyles[0]);
    if (isBorderConsistent) {
      const borderColor = borderStyles[0]
        ? this.getColorFromBorderStyle(borderStyles[0])
        : defaultBorder;
      return borderColor;
    } else {
      return false;
    }
  };

  isCellBorderActive = (selection, row, col) => {
    const borderStyles = this.getCellBorderColor(selection, row, col);
    return borderStyles.some(borderStyle => borderStyle !== undefined);
  };

  getColorFromBorderStyle = borderStyle => {
    return borderStyle.includes('transparent') ? 'transparent' : `#${borderStyle.split('#')[1]}`;
  };

  getCellBorders = (selection, row, col, color) => {
    const range = getRange(selection);
    const { rowSpan = 1, colSpan = 1 } = this.getCellMergeData(row, col) || {};
    const borderColor = color || getColors().color8;
    const borders = {};

    if (!range.find(({ i, j }) => i === row && j === col - 1)) {
      borders.left = borderColor;
    }
    if (!range.find(({ i, j }) => i === row && j === col + colSpan)) {
      borders.right = borderColor;
    }
    if (!range.find(({ i, j }) => i === row - 1 && j === col)) {
      borders.top = borderColor;
    }
    if (!range.find(({ i, j }) => i === row + rowSpan && j === col)) {
      borders.bottom = borderColor;
    }
    return borders;
  };

  getRowHeader = () => this.componentData.config.rowHeader;

  getColHeader = () => this.componentData.config.colHeader;

  isCellContainedInHeader = (i, j) =>
    (i === 0 && this.getRowHeader()) || (j === 0 && this.getColHeader());
}
