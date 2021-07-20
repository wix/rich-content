import { ToolbarType } from './toolbarEnums';
import { OnPluginAction } from './pluginsBiCallbacksTypes';
import { getContentSummary } from '../Utils/contentAnalytics';
interface biCallbackParams {
  version?: string;
}

export type PluginAddParams =
  | {
      // Table
      columns: number;
      rows: number;
    }
  | {
      // Embeds
      link: string;
      service: string;
    }
  | {
      // Wix Embed
      id: unknown;
    }
  | {
      // Poll
      type: 'list' | 'grid';
    };

type EntryType = ToolbarType;
export interface onPluginAddStepArgs extends biCallbackParams {
  pluginId: string;
  pluginDetails: unknown;
  entryPoint: ToolbarType;
  entryType: EntryType;
  params?: PluginAddParams;
  step: 'FileUploadDialog' | 'PluginModal';
}

export interface onPluginDeleteArgs extends biCallbackParams {
  pluginId: string;
  pluginDetails: unknown;
}

export interface onViewerLoadedArgs extends biCallbackParams {
  isPreview: boolean;
  pluginsCount: ReturnType<typeof getContentSummary>['pluginsCount'];
  version: string;
  url: string;
}

export interface onPluginModalOpenedArgs extends biCallbackParams {
  pluginId: string;
  pluginDetails: unknown;
  entryPoint: ToolbarType;
  entryType: EntryType;
}

export interface OnInlineToolbarOpen extends biCallbackParams {
  toolbarType: ToolbarType;
  pluginId?: string;
}

export interface onMenuLoadArgs extends biCallbackParams {
  menu: EntryType;
}

export interface onContentEditedArgs extends biCallbackParams {}
export interface onToolbarButtonClickArgs extends biCallbackParams {
  /** The name of the button the user clicked on (`Bold`, `Italic`, `SpoilerButton`, ...) */
  buttonName: string;
  /** Toolbar / Sidebar/ else */
  origin?: string;
  /** toolbar type (`FORMATTING`, `PLUGIN`, ...) */
  type?: ToolbarType;
  /** The new value that was changed (center, right...) */
  value?: string;
  /** Category of change (alignment / size / settings...) */
  category?: string;
  /** Plugin's Type (e.g. values of `LINK_TYPE`, `HASHTAG_TYPE`...) */
  pluginId?: string;
  /** Schema: Node's key. Draft: `blockKey` of plugin. Prose: attr's key */
  pluginUniqueId?: string;
  /** Additional specification of plugin */
  pluginDetails?: string;
}

export interface BICallbacks {
  onPluginAdd?(pluginId: string, entryPoint: string, version: string): void;
  onPluginAddSuccess?(
    pluginId: string,
    entryPoint: string,
    params: PluginAddParams,
    version: string
  ): void;
  onPluginAddStep?(params: onPluginAddStepArgs): void;
  onPluginDelete?(params: onPluginDeleteArgs): void;
  onPublish?(
    postId: string | undefined,
    pluginsCount: Record<string, number> | undefined,
    pluginsDetails:
      | {
          type: string;
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          data: any;
        }[]
      | undefined,
    version: string
  ): void;
  onViewerAction?(pluginId: string, actionName: ActionName, value: string): void;
  onViewerLoaded?(params: onViewerLoadedArgs): void;
  onOpenEditorSuccess?(version: string, toolbarType: ToolbarType): void;
  onContentEdited?(params: onContentEditedArgs): void;
  /** evid: 3 - 'changePlugin' */
  onToolbarButtonClick?(params: onToolbarButtonClickArgs): void;
  onPluginChange?(
    pluginId: string,
    changeObject: { from: string; to: string },
    version: string
  ): void;
  onMediaUploadStart?(
    correlationId: string,
    pluginId: string,
    fileSize: number | undefined,
    mediaType: string | undefined,
    version: string
  ): void;
  onMediaUploadEnd?(
    correlationId: string,
    pluginId: string,
    duration: number,
    fileSize: number | undefined,
    mediaType: string | undefined,
    isSuccess: boolean,
    errorType: string | undefined,
    version: string
  ): void;
  onPluginModalOpened?(params: onPluginModalOpenedArgs): void;
  onMenuLoad?(params: onMenuLoadArgs): void;
  onInlineToolbarOpen?(params: OnInlineToolbarOpen): void;
  onPluginAction?: OnPluginAction;
}

type ActionName = 'expand_gallery' | 'expand_image' | 'Click';
