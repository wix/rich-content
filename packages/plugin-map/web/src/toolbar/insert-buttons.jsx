import { TOOLBARS, BUTTON_TYPES } from 'wix-rich-content-editor-common';
import { InsertPluginIcon } from '../icons';
import { DEFAULTS } from '../constants';

export default ({ helpers, t, settings }) => {
  const icon = settings?.toolbar?.icons?.InsertPluginButtonIcon || InsertPluginIcon;
  return [
    {
      type: BUTTON_TYPES.BUTTON,
      name: 'MapPlugin_InsertButton',
      tooltip: t('MapPlugin_InsertButton_Tooltip'),
      toolbars: [TOOLBARS.MOBILE, TOOLBARS.FOOTER, TOOLBARS.SIDE],
      getIcon: () => icon,
      // NOTE: settings contains google maps sdk key, should not be exposed
      componentData: {
        config: {
          size: settings.size || DEFAULTS.size,
          alignment: settings.alignment || DEFAULTS.alignment,
          width: settings.width || DEFAULTS.width,
          height: settings.height || DEFAULTS.height,
        },
        mapSettings: settings.mapSettings,
      },
      helpers,
      t,
    },
  ];
};
