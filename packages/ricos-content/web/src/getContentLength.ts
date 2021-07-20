import {
  DraftContent,
  RicosContentBlock,
  isDraftContent,
  isRichContent,
} from '../src/types/contentTypes';
import { extract } from './RicosContentAPI/extract';
import { RichContent } from 'ricos-schema';
import { fromTraversable, Lens } from 'monocle-ts';
import * as A from 'fp-ts/Array';

export function getContentLength(content: DraftContent): number;
export function getContentLength(content: RichContent): number;

export function getContentLength(content: RichContent | DraftContent): number {
  if (isDraftContent(content)) {
    return getDraftTextLength(content);
  } else if (isRichContent(content)) {
    return getRichContentTextLength(content);
  }
  return NaN;
}

function getRichContentTextLength(content: RichContent): number {
  return extract(content.nodes)
    .map(({ textData }) => textData?.text || '')
    .get()
    .reduce((count, line) => count + line.length, 0);
}

function getDraftTextLength(content: DraftContent): number {
  const blocksLens = Lens.fromProp<DraftContent>()('blocks');
  const blockTraversal = fromTraversable(A.array)<RicosContentBlock>();
  const textLens = Lens.fromProp<RicosContentBlock>()('text');
  return blocksLens
    .composeTraversal(blockTraversal)
    .composeLens(textLens)
    .asFold()
    .getAll(content)
    .reduce((count, line) => count + line.length, 0);
}
