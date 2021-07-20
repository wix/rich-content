import { createRicosExtensionConfig } from './../../extensions-creators/extension';
import React from 'react';
import { BlockSpoilerComponent } from 'wix-rich-content-plugin-spoiler';

const name = 'spoiler';

export const createSpoilerConfig = () =>
  createRicosExtensionConfig(() => {
    return {
      name,
      priority: 10,

      addNodeViewHOC() {
        // nodeTypes
        // {types: ['image'],

        return {
          nodeTypes: ['image'],
          nodeViewHOC: Component => {
            // should use the new api containerData
            return props => {
              const { context, componentData } = props;
              const { isMobile, theme, t } = context;
              if (componentData?.config?.spoiler) {
                return (
                  <BlockSpoilerComponent
                    theme={theme}
                    isMobile={isMobile}
                    isEditableText
                    t={t}
                    pluginType="Image"
                    handleDescriptionChange={() => {}}
                    setInPluginEditingMode={() => {}}
                    handleButtonContentChange={() => {}}
                  >
                    <Component {...props} />
                  </BlockSpoilerComponent>
                );
              } else {
                return <Component {...props} />;
              }
            };
          },
        };
      },
    };
  });
