const imageType = 'wix-draft-plugin-image';
const imageTypeLegacy = 'IMAGE';
const galleryType = 'wix-draft-plugin-gallery';
const collapsibleListType = 'wix-rich-content-plugin-collapsible-list';
const tableType = 'wix-rich-content-plugin-table';

function imageEntityToGallery(data, index) {
  const src = data.src;
  const url = src.file_name;
  const metadata = data.metadata;
  return {
    metadata: {
      height: src.height,
      width: src.width,
      title: (metadata && metadata.caption) || '',
      altText: (metadata && metadata.alt) || '',
    },
    url,
    disableDownload: data.disableDownload,
  };
}

const blockToImagesKeys = {
  [imageType]: (entity, blockKey) => {
    if (!entity.data?.disableExpand) return { [blockKey]: 1 };
  },
  [imageTypeLegacy]: (entity, blockKey) => {
    if (!entity.data?.disableExpand) return { [blockKey]: 1 };
  },
  [tableType]: entity => {
    let tableImagesKeys = {};
    getTableCellContents(entity).forEach(content => {
      const blockKeys = contentTraverser(content);
      const imageKeys = blockKeys.length ? Object.assign(...blockKeys) : {};
      tableImagesKeys = {
        ...tableImagesKeys,
        ...imageKeys,
      };
    });
    return tableImagesKeys;
  },
  [collapsibleListType]: entity => {
    let collapsibleListType = {};
    entity.data?.pairs.forEach(pair => {
      const blockKeys = contentTraverser(pair.content);
      const imageKeys = blockKeys.length ? Object.assign(...blockKeys) : {};
      collapsibleListType = {
        ...collapsibleListType,
        ...imageKeys,
      };
    });
    return collapsibleListType;
  },
  [galleryType]: (entity, blockKey) => {
    if (!entity.data?.disableExpand) return { [blockKey]: entity.data.items.length };
  },
};

function contentTraverser({ blocks, entityMap }) {
  return blocks
    .map(block => {
      const entityKey = block.entityRanges[0]?.key;
      const blockKey = block.key;
      const entity = entityMap[entityKey];
      const entityType = entity?.type;
      return blockToImagesKeys[entityType]?.(entity, blockKey);
    })
    .filter(x => x);
}

function innerRceImagesMapper(entityMap, index) {
  const images = [];
  Object.entries(entityMap).forEach(([, block]) => {
    if (block.type === imageType || block.type === imageTypeLegacy) {
      block.data?.src &&
        !block.data?.disableExpand &&
        images.push(imageEntityToGallery(block.data, index));
    }
  });
  return images;
}

function getTableCellContents(tableEntity) {
  const contents = [];
  const { rows } = tableEntity.data.config;
  Object.entries(rows).forEach(([, row]) => {
    Object.entries(row.columns).forEach(([, cell]) => {
      contents.push(cell.content);
    });
  });
  return contents;
}

function getTableImages(entity, index) {
  return getTableCellContents(entity)
    .map(content => innerRceImagesMapper(content.entityMap, index))
    .flat();
}

function getCollapsibleListImages(entity, index) {
  let collapsibleListType = [];
  entity.data.pairs.forEach(pair => {
    collapsibleListType = [
      ...collapsibleListType,
      ...innerRceImagesMapper(pair.content.entityMap, index),
    ];
  });
  return collapsibleListType;
}

function convertEntityToGalleryItems(entity, index) {
  switch (entity.type) {
    case imageType:
    case imageTypeLegacy:
      return entity.data.src && !entity.data?.disableExpand
        ? [imageEntityToGallery(entity.data, index)]
        : [];
    case galleryType: {
      return entity.data?.disableExpand
        ? []
        : entity.data.items.map(item => {
            return { ...item, disableDownload: entity.data.disableDownload };
          });
    }
    case tableType: {
      return getTableImages(entity, index);
    }
    case collapsibleListType: {
      return getCollapsibleListImages(entity, index);
    }
    default:
      return [];
  }
}
function createImageMap(content) {
  const blockKeys = contentTraverser(content); // [{ key1: 1, key2: 1 }, { key3: 5 }];
  let imageIndex = 0;
  return blockKeys.reduce((imageMap, blockKeyAndImagesCountObjects) => {
    Object.entries(blockKeyAndImagesCountObjects).forEach(([key, size]) => {
      imageMap[key] = imageIndex;
      imageIndex += size;
    });
    return imageMap;
  }, {});
}

function getImages(entityMap) {
  return Object.values(entityMap)
    .map(convertEntityToGalleryItems) // [[imageData1, imageData2, imageData3], [imageData4, imageData5]]
    .reduce((imagesData, imageData) => {
      return imagesData.concat(imageData);
    }, []);
}

export default function getImagesData(content) {
  const images = getImages(content.entityMap);
  return { images, imageMap: createImageMap(content) };
}
