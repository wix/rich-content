/* eslint-disable @typescript-eslint/no-explicit-any */
import { toTiptap } from './toTiptap/toTiptap';
import { fromTiptap } from './fromTiptap/fromTiptap';
import { DraftContent } from '../..';
import { convertBlockDataToRicos, convertNodeDataToDraft, fromDraft, toDraft } from '../draft';
import { JSONContent } from '@tiptap/core';
import { Node_Type } from 'ricos-schema';

export const draftToTiptap = (draftContent: DraftContent): JSONContent =>
  toTiptap(fromDraft(draftContent));

export const draftBlockDataToTiptap = (
  blockType: string,
  draftBlockData: Record<string, any>
): Record<string, any> => toTiptap(convertBlockDataToRicos(blockType, draftBlockData));

export const tiptapToDraft = (proseContent: JSONContent): DraftContent =>
  toDraft(fromTiptap(proseContent));

export const tiptapNodeDataToDraft = (
  nodeType: Node_Type,
  nodeData: Record<string, any>
): Record<string, any> => convertNodeDataToDraft(nodeType, fromTiptap(nodeData));

export { toTiptap, fromTiptap };
