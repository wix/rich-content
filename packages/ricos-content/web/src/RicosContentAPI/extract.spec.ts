import { extract } from './extract';
import { RichContent, Node_Type } from 'ricos-schema';
import { fromDraft } from '../converters/draft/fromDraft/fromDraft';
import contentWithLists from '../../../../../e2e/tests/fixtures/text-blocks-new.json';
import contentWithImages from '../../../../../e2e/tests/fixtures/images.json';
import contentWithMedia from '../../../../../e2e/tests/fixtures/migration-content.json';

describe('Content extract API', () => {
  it('should extract the list texts', () => {
    const actual = extract(RichContent.fromJSON(contentWithLists).nodes)
      .filter(({ type }) => type === Node_Type.BULLETED_LIST || type === Node_Type.ORDERED_LIST)
      .chain(n => extract(n).map(({ textData }) => textData?.text || ''))
      .map(extractor => extractor.get());

    const expected = [
      [
        'Bring to the table win-win survival strategies to ensure proactive domination.',
        'Check if the list above displays correctly!',
      ],
      [
        // eslint-disable-next-line max-len
        'Nanotechnology immersion along the information highway will close the loop on focusing solely on the bottom line.',
        'Override the digital divide with additional clickthroughs from DevOps.',
      ],
    ];
    expect(actual).toStrictEqual(expected);
  });

  it('should extract first image url', () => {
    const richContent = fromDraft(contentWithImages);
    const actual = extract(richContent.nodes)
      .map(({ imageData }) => imageData?.image?.src?.url || imageData?.image?.src?.custom)
      .get()[0];
    const expected = '8bb438_131a7e1872bc45ec827bb61e56b840fe.jpg';
    expect(actual).toEqual(expected);
  });

  it('should extract total image count', () => {
    const richContent = fromDraft(contentWithMedia);
    const imageCount = extract(richContent.nodes)
      .filter(({ type }) => type === Node_Type.IMAGE)
      .get().length;
    const galleryImageCount = extract(richContent.nodes)
      .map(({ galleryData }) => galleryData?.items || [])
      .map(
        items =>
          items.filter(
            ({ metadata }) => (!!metadata && metadata?.type === 'image') || !metadata?.type
          ).length
      )
      .get()
      .reduce((sum, count) => sum + count, 0);
    expect(imageCount + galleryImageCount).toEqual(5);
  });

  it('should extract all node keys of images with empty alt text', () => {
    const richContent = fromDraft(contentWithImages);
    const actual = extract(richContent.nodes)
      .filter(({ imageData }) => !!imageData && !imageData.altText)
      .map(({ id }) => id)
      .get();
    const expected = ['4n607', '213ea'];
    expect(actual).toEqual(expected);
  });
});
