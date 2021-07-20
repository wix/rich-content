/* eslint-disable no-console */
import { Decoration, Node, Node_Type } from 'ricos-schema';
import { RicosInlineStyleRange, RicosEntityRange, RicosEntityMap } from '../../../types';
import { FROM_RICOS_DECORATION_TYPE, ENTITY_DECORATION_TO_DATA_FIELD } from '../consts';
import { emojiRegex } from '../emojiRegex';
import { createDecorationEntityData } from './getDraftEntityData';

export interface DraftTypedDecoration extends Omit<Decoration, 'type'> {
  type: string;
  emojiData?: { emojiUnicode: string };
}

export interface RangedDecoration extends DraftTypedDecoration {
  start: number;
  end: number;
}

interface RangedDecorationMap {
  [type: string]: RangedDecoration[];
}

const isInlineStyleDecoration = (decorationType: string) =>
  ENTITY_DECORATION_TO_DATA_FIELD[decorationType] === undefined;

const pipe = (arg, ...fns: ((arg) => unknown)[]) => {
  return fns.reduce((v, fn) => fn(v), arg);
};

export const mergeTextNodes = (
  nodes: Node[]
): { text: string; decorationMap: RangedDecorationMap } => {
  let length = 0;
  return nodes.reduce<{
    text: string;
    decorationMap: RangedDecorationMap;
  }>(
    ({ text, decorationMap }, currNode) => {
      let accText = text;
      if (currNode.textData) {
        const { text: currText, decorations: currDecorations } = currNode.textData;
        const textLength = Array.from(currText).length; // required for properly reading emojis
        accText += currText;
        if (currDecorations) {
          convertDecorationTypes(currDecorations).forEach(decoration => {
            if (!decorationMap[decoration.type]) {
              decorationMap[decoration.type] = [];
            }
            decorationMap[decoration.type] = [
              ...decorationMap[decoration.type],
              {
                ...decoration,
                start: length,
                end: length + textLength,
              },
            ];
          });
        }
        length += textLength;
      }
      return { text: accText, decorationMap };
    },
    { text: '', decorationMap: {} }
  );
};

export const parseDecorations = (
  decorationMap: RangedDecorationMap,
  text: string
): { inlineStyleDecorations: RangedDecoration[]; entityDecorations: RangedDecoration[] } => {
  const decorations = Object.values(decorationMap)
    .sort(decorationComparator)
    .reduce((decorations: RangedDecoration[], currentDecorations) => {
      if (currentDecorations.length > 0) {
        const firstDecoration = currentDecorations.shift() as RangedDecoration;
        const mergedDecorations: RangedDecoration[] = [firstDecoration];
        currentDecorations.forEach(decoration => {
          const lastDecoration = mergedDecorations.pop() as RangedDecoration;
          if (decoration.start === lastDecoration.end) {
            mergedDecorations.push({ ...lastDecoration, end: decoration.end });
          } else {
            mergedDecorations.push(lastDecoration, decoration);
          }
        });
        return [...decorations, ...mergedDecorations.sort(decorationComparator)];
      }
      return decorations;
    }, []);
  const allDecorations = [...decorations, ...createEmojiDecorations(text)];
  const entityDecorations = allDecorations
    .filter(({ type }) => !isInlineStyleDecoration(type))
    .sort(decorationComparator);
  const inlineStyleDecorations = allDecorations.filter(({ type }) => isInlineStyleDecoration(type));
  return { inlineStyleDecorations, entityDecorations };
};

export const parseInlineStyleDecorations = (
  decorations: RangedDecoration[]
): RicosInlineStyleRange[] => {
  const inlineStyleRanges = decorations.reduce<RicosInlineStyleRange[]>(
    (inlineStyleRanges, decoration) => [
      ...inlineStyleRanges,
      {
        style: decoration.type,
        offset: decoration.start,
        length: decoration.end - decoration.start,
      },
    ],
    []
  );
  return inlineStyleRanges;
};

export const parseEntityDecorations = (
  decorations: RangedDecoration[],
  latestEntityKey: number
): {
  entityRanges: RicosEntityRange[];
  entityMap: RicosEntityMap;
  latestEntityKey: number;
} => {
  const { entityRanges, entityMap, latestEntityKey: newLatestEntityKey } = decorations.reduce<{
    entityRanges: RicosEntityRange[];
    entityMap: RicosEntityMap;
    latestEntityKey: number;
  }>(
    ({ entityRanges, entityMap, latestEntityKey }, decoration) => {
      const newEntityKey = latestEntityKey + 1;
      const newEntityMap = createDecorationEntityData(decoration, newEntityKey);
      return {
        entityRanges: [
          ...entityRanges,
          {
            key: newEntityKey,
            offset: decoration.start,
            length: decoration.end - decoration.start,
          },
        ],
        entityMap: { ...entityMap, ...newEntityMap },
        latestEntityKey: newEntityKey,
      };
    },
    { entityRanges: [], entityMap: {}, latestEntityKey }
  );
  return {
    entityRanges,
    entityMap,
    latestEntityKey: newLatestEntityKey,
  };
};

export const getParagraphNode = (node: Node) => {
  if (node.nodes[0].type === Node_Type.PARAGRAPH) {
    return node.nodes[0];
  } else {
    throw Error(`Expected a paragraph node but found ${node.nodes[0].type}`);
  }
};

const convertDecorationTypes = (decorations: Decoration[]): DraftTypedDecoration[] =>
  decorations.flatMap(decoration => pipe(decoration, toDraftDecorationType, splitColorDecoration));

const createEmojiDecorations = (text: string) =>
  Array.from(text.matchAll(emojiRegex)).flatMap(({ 0: emojiUnicode, index: start }) => {
    if (start) {
      const decoration: RangedDecoration = {
        type: 'EMOJI_TYPE',
        emojiData: { emojiUnicode },
        start,
        end: start + Array.from(emojiUnicode).length,
      };
      return decoration;
    }
    return [];
  });

const toDraftDecorationType = (decoration: Decoration): DraftTypedDecoration => ({
  ...decoration,
  type: FROM_RICOS_DECORATION_TYPE[decoration.type],
});

const splitColorDecoration = ({
  colorData,
  ...decoration
}: DraftTypedDecoration): DraftTypedDecoration | DraftTypedDecoration[] => {
  if (!colorData) {
    return decoration;
  }
  const { foreground, background } = colorData;
  return [foreground && { FG: foreground }, background && { BG: background }]
    .filter(x => x)
    .map(type => ({ ...decoration, type: JSON.stringify(type) }));
};

const decorationComparator = (
  a: RangedDecoration | RangedDecoration[],
  b: RangedDecoration | RangedDecoration[]
) => ('start' in a && 'start' in b ? a.start - b.start : a[0].start - b[0].start);
