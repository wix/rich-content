const verticalEmbedDataNormalizer = componentData => {
  const { selectedProduct, type } = componentData;
  const { html, description } = selectedProduct;
  if (html) {
    const pageUrl = selectedProduct.html.match(/href="[^"]*/g)?.[0]?.slice(6);
    let additionalData = {};
    if (type === 'event') {
      const scheduling = selectedProduct.description.match(/[^|]+/)?.[0];
      const location = selectedProduct.description.match(/[^|]*$/)?.[0];
      additionalData = { scheduling, location };
    } else if (type === 'booking') {
      additionalData = { durations: description };
    }
    return {
      ...componentData,
      selectedProduct: { ...selectedProduct, ...additionalData, pageUrl },
    };
  } else {
    return componentData;
  }
};

export default verticalEmbedDataNormalizer;
