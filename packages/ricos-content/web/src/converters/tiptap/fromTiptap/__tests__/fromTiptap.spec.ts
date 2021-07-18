import { Node_Type, RichContent } from 'ricos-schema';
import migrationContent from '../../../../../statics/json/migratedFixtures/migration-content.json';
import migrationContentTiptap from '../../toTiptap/__tests__/migrationContentTiptap.json';
import draftMigrationContent from '../../../../../../../../e2e/tests/fixtures/migration-content.json';
import { toTiptap, fromTiptap, tiptapToDraft, tiptapNodeDataToDraft } from '../..';
import { getImageBlockData, getImageNode } from '../../utils';
import { compare } from '../../../..';
import { JSONContent } from '@tiptap/core';

describe('convert from Tiptap', () => {
  describe('to RichContent', () => {
    const content = RichContent.fromJSON(migrationContent);
    it('should convert content', () => {
      const richContent = fromTiptap(toTiptap(content));
      expect(richContent).toEqual(migrationContent);
    });
    it('should convert node', () => {
      const imageNode = getImageNode(content);
      const richContent = fromTiptap(toTiptap(imageNode));
      expect(richContent).toEqual(imageNode);
    });
    it('should convert node data', () => {
      const imageNode = getImageNode(content);
      const richContent = fromTiptap(toTiptap(imageNode).attrs as Record<string, unknown>);
      expect(richContent).toEqual(imageNode.imageData);
    });
  });
  describe('to Draft', () => {
    it('should convert content', () => {
      const draftContent = tiptapToDraft(migrationContentTiptap);
      expect(compare(draftContent, draftMigrationContent, { ignoredKeys: ['key'] })).toEqual({});
    });
    it('should convert node data', () => {
      const imageNode = getImageNode(migrationContentTiptap);
      const imageData = tiptapNodeDataToDraft(Node_Type.IMAGE, imageNode.attrs as JSONContent);
      expect(
        compare(imageData, getImageBlockData(draftMigrationContent), {
          ignoredKeys: ['key', 'src'],
        })
      ).toEqual({});
    });
  });
});
