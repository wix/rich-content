import React, { useContext } from 'react';
import { RicosTiptapContext } from '../../context';
import { tiptapNodeDataToDraft } from 'ricos-content/libs/tiptap';

const pipe = functions => data => {
  return functions.reduce((value, func) => func(value), data);
};

export const RicosNode = ({ component, tiptapNodeProps, children }) => {
  const ricosTiptapContext = useContext(RicosTiptapContext) || {};
  const { nodeViewsHOCs } = ricosTiptapContext;
  console.log({
    ricosTiptapContext,
    component,
    nodeViewsHOCs,
  });
  const ComponentWithNodeHOCs = pipe(nodeViewsHOCs)(component);

  console.log({ ricosTiptapContext, ComponentWithNodeHOCs, tiptapNodeProps });
  const componentData = tiptapNodeDataToDraft(
    tiptapNodeProps.node.type.name.toUpperCase(),
    tiptapNodeProps.node.attrs
  );
  return children({
    ...ricosTiptapContext,
    componentData,
    ...tiptapNodeProps,
    ComponentWithNodeHOCs,
  });
};
