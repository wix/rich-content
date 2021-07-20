---
id: content_extract
title: Content Extractor
sidebar_label: Content Extractor
---

## extract API

The Content Extractor provides access to content nodes regardless of their nesting level.

The `extract` API accepts RichContent nodes array, and exposes `Extractor<T>` that allows chaining:

```ts
interface Extractor<DT> {
  filter: (predicate: (data: DT) => boolean) => Extractor<DT>;
  map: <MT>(mapper: (data: DT) => MT) => Extractor<MT>;
  chain: <CT>(mapper: (data: DT) => Extractor<CT>) => Extractor<CT>[];
  get: () => DT[];
}
```

## Examples

1. Extract node keys of images with invalid (empty) alt text:
```ts
import { extract } from 'ricos-content/libs/extract';
...
const keys = extract(richContent.nodes)
  .filter(({ imageData }) => !!imageData && !imageData.altText)
  .map(({ key }) => key)
  .get();
```

2. Extract first image URL:
```ts
const url = extract(richContent.nodes)
  .map(({ imageData }) => imageData?.image?.src?.url || imageData?.image?.src?.custom)
  .get()[0];
```

3. Extract total image count:
```ts
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
```

4. Extract list item texts, grouped by lists:
```ts
const listTexts = extract(richContent.nodes)
  .filter(({ type }) => type === Node_Type.BULLETED_LIST || type === Node_Type.ORDERED_LIST)
  .chain(n => extract(n).map(({ textData }) => textData?.text || ''))
  .map(extractor => extractor.get());
```
Note the recursive `extract` and `chain` combination.
