import React from 'react';
import { createBasePlugin } from 'wix-rich-content-common';
import createEmojiPlugin from 'draft-js-emoji-plugin';
import SelectButton from './SelectButton';
import { EXTERNAL_EMOJI_TYPE } from './types';
import * as Styles from './styles.scss';

const createExternalEmojiPlugin = (config = {}) => {
  const type = EXTERNAL_EMOJI_TYPE;
  const { decorator, helpers, theme, isMobile, t, anchorTarget, relValue } = config;
  const plugin = createEmojiPlugin({
    theme: Styles,
    useNativeArt: false,
    selectButtonContent: <SelectButton t={t} theme={theme} />,
    toneSelectOpenDelay: 250,
  });

  const InsertToolbarButton = plugin.EmojiSelect;
  let toolbar;
  if (InsertToolbarButton && !isMobile) {
    toolbar = {
      InsertButtons: [
        {
          name: 'Emoji',
          ButtonElement: InsertToolbarButton,
          helpers,
          t,
        },
      ],
    };
  }
  const inlineModals = [plugin.EmojiSuggestions];

  return createBasePlugin(
    {
      decorator,
      theme,
      type,
      toolbar,
      inlineModals,
      helpers,
      isMobile,
      anchorTarget,
      relValue,
      t,
    },
    plugin,
  );
};

export { createExternalEmojiPlugin };
