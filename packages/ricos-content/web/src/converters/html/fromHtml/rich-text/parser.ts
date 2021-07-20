import { flow } from 'fp-ts/function';
import { TextNode } from 'parse5';
import { preprocess } from './preprocess';
import parse from '../core/parser';
import {
  pToParagraph,
  lToList,
  hToHeading,
  strongEmUToDecoration,
  aToLink,
  textToText,
} from '../core/rules';
import { Rule } from '../core/models';

const noEmptyLineText: Rule = [
  node => textToText[0](node) && (node as TextNode).value !== '\n',
  textToText[1],
];

export default flow(
  preprocess,
  parse([noEmptyLineText, pToParagraph, lToList, hToHeading, aToLink, strongEmUToDecoration])
);
