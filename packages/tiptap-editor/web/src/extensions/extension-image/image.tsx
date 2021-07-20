import React from 'react';
import { ImageComponent } from 'wix-rich-content-plugin-image';
import { ImagePluginEditorConfig } from 'wix-rich-content-plugin-image/src/types';
import { BlockSpoilerComponent } from 'wix-rich-content-plugin-spoiler';
import { PluginProps } from '../../types';

const Image: React.FC<PluginProps> = ({ context, componentData, updateAttributes }) => {
  const { isMobile, theme, t } = context;

  const store = {
    update: (propery, data) => {
      // update caption
      updateAttributes({ caption: data.config.caption });
    },
    setBlockHandler: () => null,
  };
  const helpers = {};
  const componentState = {};
  const settings: ImagePluginEditorConfig = {};
  const disableRightClick = settings?.uiSettings?.disableRightClick;
  const blockProps = {
    setFocusToBlock: () => null,
  };
  const setComponentUrl = () => null;
  const block = {
    getKey: () => {
      return '';
    },
  };

  const imageComponent = (
    <ImageComponent
      componentData={componentData}
      isMobile={isMobile}
      theme={theme}
      store={store}
      helpers={helpers}
      componentState={componentState}
      t={t}
      settings={settings}
      disableRightClick={disableRightClick}
      blockProps={blockProps}
      setComponentUrl={setComponentUrl}
      block={block}
    />
  );

  return imageComponent;
};

export default Image;
