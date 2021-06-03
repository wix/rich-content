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
}

export interface onPluginModalOpenedArgs extends biCallbackParams {
  pluginId: string;
  pluginDetails: unknown;
  entryPoint: ToolbarType;
  entryType: EntryType;
}

export interface onMenuLoadArgs extends biCallbackParams {
  menu: EntryType;
}

export interface onContentEditedArgs extends biCallbackParams {}
export interface onToolbarButtonClickArgs extends biCallbackParams {
  buttonName: string;
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
  onOpenEditorSuccess?(version: string): void;
  onContentEdited?(params: onContentEditedArgs): void;
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
  onPluginAction?: OnPluginAction;
}

type ActionName = 'expand_gallery' | 'expand_image' | 'Click';
