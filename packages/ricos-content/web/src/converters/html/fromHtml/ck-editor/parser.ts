import { identity, pipe, flow } from 'fp-ts/function';
import * as A from 'fp-ts/Array';
import * as R from 'fp-ts/Record';
import * as O from 'fp-ts/Option';

import {
  Node,
  TextStyle_TextAlignment,
  TextStyle,
  PluginContainerData,
  PluginContainerData_Alignment,
  PluginContainerData_Width_Type,
} from 'ricos-schema';
import { TextNode, Element } from 'parse5';
import { toUpperCase, replace, split } from '../../../../fp-utils';
import { hasTag, getAttributes } from '../core/ast-utils';
import { preprocess } from './preprocess';
import parse from '../core/parser';
import {
  pToParagraph,
  lToList,
  hToHeading,
  strongEmUToDecoration,
  textToText,
  imgToImage,
  identityRule,
} from '../core/rules';
import { iframeToVideo } from './iframeToVideo';
import { aToCustomLink } from './aToCustomLink';
import { Rule } from '../core/models';

const noEmptyLineText: Rule = [
  node => textToText[0](node) && (node as TextNode).value !== '\n',
  textToText[1],
];

const traverseDiv: Rule = [hasTag('div'), identityRule[1]];

type Alignment = 'LEFT' | 'RIGHT' | 'CENTER' | '';

const toTextStyle = (alignment: Alignment): TextStyle => ({
  textAlignment: alignment as TextStyle_TextAlignment,
});

const toPluginContainerData = (defaultData: Partial<PluginContainerData> = {}) => (
  align: Alignment
) => ({
  alignment: align as PluginContainerData_Alignment,
  ...defaultData,
});

const getAlignment = flow(
  R.lookup('class'),
  O.map(split(' ')),
  O.map(A.filter(c => ['align-left', 'align-right', 'align-center'].includes(c))),
  O.chain(A.head),
  O.map(replace('align-', '')),
  O.map(toUpperCase),
  O.fold(
    () => <Alignment>'',
    a => <Alignment>a
  )
);

const getAlignmentByClass = flow(getAttributes, getAlignment);
const hasAlignmentClass = flow(getAlignmentByClass, Boolean);

const mergeWithTextStyle = (dataProp: string, textStyle: TextStyle) => (node: Node) => ({
  ...node,
  [dataProp]: { ...node[dataProp], textStyle },
});

const mergeWithContainerData = (dataProp: string, containerData: PluginContainerData) => (
  node: Node
) => ({ ...node, [dataProp]: { ...node[dataProp], containerData } });

const pToAlignedParagraph: Rule = [
  pToParagraph[0],
  context => (element: Element) =>
    pipe(
      element,
      pToParagraph[1](context),
      A.map(
        hasAlignmentClass(element)
          ? mergeWithTextStyle('paragraphData', pipe(element, getAlignmentByClass, toTextStyle))
          : identity
      )
    ),
];

const hToAlignedHeading: Rule = [
  hToHeading[0],
  context => (element: Element) =>
    pipe(
      element,
      hToHeading[1](context),
      A.map(
        hasAlignmentClass(element)
          ? mergeWithTextStyle('headingData', pipe(element, getAlignmentByClass, toTextStyle))
          : identity
      )
    ),
];

const iframeToAlignedVideo: Rule = [
  iframeToVideo[0],
  context => (element: Element) => {
    return pipe(
      element,
      iframeToVideo[1](context),
      A.map(
        hasAlignmentClass(element)
          ? mergeWithContainerData(
              'videoData',
              pipe(element, getAlignmentByClass, toPluginContainerData())
            )
          : identity
      )
    );
  },
];

const imgToAlignedImage: Rule = [
  imgToImage[0],
  context => (element: Element) => {
    return pipe(
      element,
      imgToImage[1](context),
      A.map(
        hasAlignmentClass(element)
          ? mergeWithContainerData(
              'imageData',
              pipe(
                element,
                getAlignmentByClass,
                toPluginContainerData({ width: { size: PluginContainerData_Width_Type.SMALL } })
              )
            )
          : mergeWithContainerData('imageData', {
              width: { size: PluginContainerData_Width_Type.SMALL },
              alignment: PluginContainerData_Alignment.CENTER,
            })
      )
    );
  },
];

export default flow(
  preprocess,
  parse([
    noEmptyLineText,
    pToAlignedParagraph,
    lToList,
    hToAlignedHeading,
    aToCustomLink,
    strongEmUToDecoration,
    iframeToAlignedVideo,
    imgToAlignedImage,
    traverseDiv,
  ])
);
