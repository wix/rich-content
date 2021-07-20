import { extract } from './extract';
import { RichContent, Node_Type, Decoration_Type } from 'ricos-schema';
import { fold, struct } from 'fp-ts/Monoid';
import * as A from 'fp-ts/Array';
import * as S from 'fp-ts/string';
import { fromDraft } from '../converters/draft/fromDraft/fromDraft';
import contentWithLists from '../../../../../e2e/tests/fixtures/text-blocks-new.json';
import contentWithImages from '../../../../../e2e/tests/fixtures/images.json';
import contentWithMedia from '../../../../../e2e/tests/fixtures/migration-content.json';

describe('Content extract API', () => {
  it('should extract all the node and decoration types used in content', () => {
    const richContent = fromDraft(contentWithMedia);
    type TaD = { types: Node_Type[]; decorations: Decoration_Type[] };
    const typesAndDecorations = extract(richContent.nodes)
      .map(({ type, textData }) => ({
        types: [type],
        decorations: textData?.decorations || [],
      }))
      .map(({ types, decorations }) => ({
        types,
        decorations: decorations.map(({ type }) => type),
      }))
      .get();
    const pluginTypesM = struct<TaD>({
      types: A.getMonoid<Node_Type>(),
      decorations: A.getMonoid<Decoration_Type>(),
    });
    const merged = fold(pluginTypesM)(typesAndDecorations);
    const actual = {
      types: A.uniq(S.Eq)(merged.types),
      decorations: A.uniq(S.Eq)(merged.decorations),
    };
    const expected = {
      types: [
        'UNRECOGNIZED',
        'PARAGRAPH',
        'TEXT',
        'IMAGE',
        'VIDEO',
        'GALLERY',
        'HTML',
        'EMBED',
        'BUTTON',
        'DIVIDER',
        'CODE_BLOCK',
        'GIPHY',
        'MAP',
        'FILE',
        'APP_EMBED',
        'LINK_PREVIEW',
        'POLL',
        'BLOCKQUOTE',
        'ORDERED_LIST',
        'LIST_ITEM',
        'BULLET_LIST',
        'HEADING',
      ],
      decorations: ['BOLD', 'UNDERLINE', 'ITALIC', 'LINK', 'SPOILER', 'MENTION', 'COLOR', 'ANCHOR'],
    };
    expect(actual).toStrictEqual(expected);
  });
  it('should extract the list texts', () => {
    const actual = extract(RichContent.fromJSON(contentWithLists).nodes)
      .filter(({ type }) => type === Node_Type.BULLET_LIST || type === Node_Type.ORDERED_LIST)
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
      .map(({ key }) => key)
      .get();
    const expected = ['4n607', '213ea'];
    expect(actual).toEqual(expected);
  });
});
