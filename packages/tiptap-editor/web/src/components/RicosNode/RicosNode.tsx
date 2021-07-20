import React, { useContext } from 'react';
import { RicosTiptapContext } from '../../context';
import { tiptapNodeDataToDraft } from 'ricos-content/libs/tiptap';

const pipe = functions => data => {
  return functions.reduce((value, func) => func(value), data);
};

export const RicosNode = ({ component, tiptapNodeProps }) => {
  const ricosTiptapContext = useContext(RicosTiptapContext) || {};
  const { nodeViewsHOCs } = ricosTiptapContext;
  const nodeViewsHOCsByType = nodeViewsHOCs[tiptapNodeProps.node.type.name] || [];
  const nodeViewsHOCsForAll = nodeViewsHOCs['*'] || [];
  const nodeViewsHOCsAllAndByType = [...nodeViewsHOCsForAll, ...nodeViewsHOCsByType].sort(
    (extA, extB) => {
      const defaultPriority = 100;
      const extAPriority = extA.priority || defaultPriority;
      const extBPriority = extB.priority || defaultPriority;

      if (extAPriority > extBPriority) {
        return -1;
      }

      if (extAPriority < extBPriority) {
        return 1;
      }
      return 0;
    }
  );

  const ComponentWithNodeHOCs = pipe(nodeViewsHOCsAllAndByType.reverse())(component);

  const componentProps = {
    ...ricosTiptapContext, // helpes , editor Props
    componentData: tiptapNodeProps.node.attrs,
    ...tiptapNodeProps,
  };
  return <ComponentWithNodeHOCs {...componentProps} />;
};
