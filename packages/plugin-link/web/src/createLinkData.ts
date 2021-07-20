import { convertDecorationDataToDraft } from 'ricos-content/libs/toDraftData';
import { CreatePluginsDataMap, Decoration_Type, RICOS_LINK_TYPE } from 'wix-rich-content-common';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const createLinkData: CreatePluginsDataMap[typeof RICOS_LINK_TYPE] = (
  pluginData = {},
  isRicosSchema = false
) => {
  const linkData = isRicosSchema
    ? convertDecorationDataToDraft(Decoration_Type.LINK, pluginData)
    : pluginData;
  return linkData;
};
