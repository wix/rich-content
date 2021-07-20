/** Taken from draft-js https://github.com/facebook/draft-js/blob/master/src/model/keys/generateRandomKey.js */

const seenKeys = {};
const MULTIPLIER = Math.pow(2, 24);

export function generateId(): string {
  let key;
  // eslint-disable-next-line fp/no-loops, no-prototype-builtins
  while (key === undefined || seenKeys.hasOwnProperty(key) || !isNaN(Number(key))) {
    key = Math.floor(Math.random() * MULTIPLIER).toString(32);
  }
  seenKeys[key] = true;
  return key;
}
