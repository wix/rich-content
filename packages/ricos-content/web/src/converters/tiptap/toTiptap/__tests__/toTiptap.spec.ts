import { RichContent, ImageData } from 'ricos-schema';
import { compare } from '../../../../comparision/compare';
import migrationContent from '../../../../../statics/json/migratedFixtures/migration-content.json';
import draftMigrationContent from '../../../../../../../../e2e/tests/fixtures/migration-content.json';
import migrationContentTiptap from './migrationContentTiptap.json';
import { draftBlockDataToTiptap, draftToTiptap, toTiptap } from '../..';
import { getImageBlockData, getImageNode } from '../../utils';
import { IMAGE_TYPE } from '../../../../consts';

describe('convert to Tiptap', () => {
  describe('from RichContent', () => {
    const content = RichContent.fromJSON(migrationContent);
    const imageNode = getImageNode(content);

    it('should convert content', () => {
      const proseDocument = toTiptap(content);
      expect(compare(proseDocument, migrationContentTiptap, { ignoredKeys: ['key'] })).toEqual({});
    });
    it('should convert node', () => {
      const proseNode = toTiptap(imageNode);
      expect(
        compare(proseNode, getImageNode(migrationContentTiptap), { ignoredKeys: ['key'] })
      ).toEqual({});
    });
    it('should convert node data', () => {
      const nodeData = toTiptap(imageNode.imageData as ImageData);
      expect(
        compare(nodeData, getImageNode(migrationContentTiptap).attrs, {
          ignoredKeys: ['key'],
        })
      ).toEqual({});
    });
  });
  describe('from Draft', () => {
    it('should convert content', () => {
      const proseDocument = draftToTiptap(draftMigrationContent);
      expect(compare(proseDocument, migrationContentTiptap, { ignoredKeys: ['key'] })).toEqual({});
    });
    it('should convert node data', () => {
      const imageData = getImageBlockData(draftMigrationContent);
      const proseData = draftBlockDataToTiptap(IMAGE_TYPE, imageData);
      expect(
        compare(proseData, getImageNode(migrationContentTiptap).attrs, { ignoredKeys: ['key'] })
      ).toEqual({});
    });
  });
});
