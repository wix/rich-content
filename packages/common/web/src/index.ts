export * from './types';

// Components
export { default as AccessibilityListener } from './Components/AccessibilityListener';
export { default as ViewportRenderer } from './Components/ViewportRenderer';

// Utils
export { default as withI18n, translate, Trans, RicosTranslate } from './Utils/withI18n';
export { default as createHocName } from './Utils/createHocName';
export {
  sizeClassName,
  alignmentClassName,
  textWrapClassName,
  depthClassName,
} from './Utils/classNameStrategies';
export { mergeStyles } from './Utils/mergeStyles';
export {
  convertRelObjectToString,
  convertRelStringToObject,
  convertTargetStringToBoolean,
  convertTargetBooleanToString,
  getRelValue,
  getTargetValue,
} from './Utils/linkConverters';

export { anchorScroll, addAnchorTagToUrl, isNewTab } from './Utils/anchor';

export * from 'ricos-content';

export { default as getDisplayName } from './Utils/getDisplayName';

export { hasLinksInBlock, getLinkRangesInBlock } from './Utils/draftUtils';
export { validate, getContentStateSchema } from './Utils/data-schema-validator';
export { isSSR } from './Utils/ssrUtils';
export { getTextDirection, getDirectionFromAlignmentAndTextDirection } from './Utils/textDirection';
export { GlobalContext } from './Utils/contexts';

export { isHexColor } from './Utils/colorUtils';
export { isRtl, getLangDir } from './Utils/rtlUtils';

export { simplePubsub, Pubsub, Store } from './Utils/simplePubsub';
export { generateKey } from './Utils/generateKey';
export { getBlocksFromContentState } from './Utils/innerRCEBlocksUtils';
export * from './consts';

export { default as createJustificationFixDecorator } from './draftDecorators/createJustificationFixDecorator';
