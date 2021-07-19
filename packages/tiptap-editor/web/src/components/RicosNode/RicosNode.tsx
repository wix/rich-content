import React, { useContext } from 'react';
import { RicosTiptapContext } from '../../context';

const pipe = functions => data => {
  return functions.reduce((value, func) => func(value), data);
};

export const RicosNode = ({ component, tiptapNodeProps, children }) => {
  const ricosTiptapContext = useContext(RicosTiptapContext) || {};
  console.log({
    ricosTiptapContext,
    component,
    nodeViewsHOCs: ricosTiptapContext.nodeViewsHOCs,
  });
  const ComponentWithNodeHOCs = pipe(ricosTiptapContext.ricosExtensionsManager.nodeViewsHOCs)(
    component
  );

  console.log({ ComponentWithNodeHOCs, tiptapNodeProps });

  return children({
    ...ricosTiptapContext,
    ...tiptapNodeProps,
    ComponentWithNodeHOCs,
  });
};
