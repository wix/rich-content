/** Based on https://gist.github.com/Yimiprod/7ee176597fef230d1451 */
/* eslint-disable no-console, @typescript-eslint/no-explicit-any, fp/no-delete */
import { RawDraftEntityRange } from '@wix/draft-js';
import { transform, isEqualWith, isEqual, isObject, omit, pick, cloneDeep } from 'lodash';
import omitDeep from 'omit-deep';
import { DraftContent } from '..';
import { fromEntries } from '../utils';

const IGNORED_KEYS = [
  'updatedTimestamp',
  'createdTimestamp',
  'tempData',
  'isCustomVideo',
  'VERSION',
];
const IGNORED_POLL_CONFIG_KEYS = ['alignment', 'size', 'width'];
const IGNORED_SRC_KEYS = ['id', 'original_file_name'];
const IGNORED_BUTTON_DESIGN_KEYS = ['activeButton', 'padding'];
const OEMBED_KEYS = ['thumbnail_url', 'width', 'height'];

/**
 * Deep diff between two object, using lodash
 * @param object Object compared
 * @param base   Object to compare with
 * @return       Return a new object who represent the diff
 */
export function compare(object, base, options: { verbose?: boolean; ignoredKeys?: string[] } = {}) {
  const { verbose, ignoredKeys } = options;
  const allIgnoredKeys = [...IGNORED_KEYS, ...(ignoredKeys || [])];

  const objectWithoutIgnored = omitDeep(cloneDeep(object), allIgnoredKeys);
  const basetWithoutIgnored = omitDeep(cloneDeep(base), allIgnoredKeys);

  objectWithoutIgnored.blocks && removeEmoji(objectWithoutIgnored);
  basetWithoutIgnored.blocks && removeEmoji(basetWithoutIgnored);

  function changes(object, base) {
    return transform<any, any>(object, (result, value, key) => {
      const baseValue = base[key];
      if (!isEqualWith(value, baseValue, comparator)) {
        const areObjects = isObject(value) && isObject(baseValue);
        const currentValue = areObjects ? changes(value, baseValue) : value;
        result[key] = currentValue;
        if (verbose && (!isObject(currentValue) || Object.keys(currentValue).length === 0)) {
          console.dir(
            {
              [key]: {
                from: baseValue,
                to: value,
              },
            },
            { depth: null }
          );
        }
      }
    });
  }

  return changes(objectWithoutIgnored, basetWithoutIgnored);
}

const comparator = (
  left: Record<string, any> | undefined, // defined for type safety, could have any value
  right: Record<string, any> | undefined,
  key: string
) => {
  if (left?.enableVoteRole !== undefined || right?.enableVoteRole !== undefined) {
    return isEqual(omit(left, IGNORED_POLL_CONFIG_KEYS), omit(right, IGNORED_POLL_CONFIG_KEYS));
  }
  if (left?.thumbnail_url || right?.thumbnail_url) {
    return isEqual(pick(left, OEMBED_KEYS), pick(right, OEMBED_KEYS));
  }
  if (key === 'src') {
    return isEqual(omit(left, IGNORED_SRC_KEYS), omit(right, IGNORED_SRC_KEYS));
  }
  if (key === 'design') {
    return isEqual(omit(left, IGNORED_BUTTON_DESIGN_KEYS), omit(right, IGNORED_BUTTON_DESIGN_KEYS));
  }
  if (key === 'link' && (right?.rel === 'noopener' || left?.rel === 'noopener')) {
    return isEqual(omit(left, ['rel']), omit(right, ['rel']));
  }
  return undefined;
};

const removeEmoji = (object: DraftContent) => {
  const emojiEntityKeys: number[] = [];
  Object.entries<any>(object.entityMap).forEach(
    ([key, value]) => value.type === 'EMOJI_TYPE' && emojiEntityKeys.push(parseInt(key, 10))
  );
  object.entityMap = fromEntries(
    Object.entries(object.entityMap).filter(([, value]) => value.type !== 'EMOJI_TYPE')
  );
  object.blocks = object.blocks.map(block => ({
    ...block,
    entityRanges: block.entityRanges.filter(
      (range: RawDraftEntityRange) => !emojiEntityKeys.includes(range.key)
    ),
  }));
};
