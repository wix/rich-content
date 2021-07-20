/* eslint-disable @typescript-eslint/no-explicit-any */
import { ComponentType } from 'react';
import {
  ClassNameStrategy,
  ContainerClassNameStrategy,
  Pubsub,
  GetToolbarSettings,
  EditorContextType,
  PluginButton,
  ToolbarButtonProps,
  TextButtonMapper,
  GetEditorState,
  SetEditorState,
  ThemeGeneratorFunction,
  RichContentTheme,
  ThemeData,
} from '.';
import {
  ContentBlock,
  EditorProps,
  DraftDecorator,
  CompositeDecorator,
  DraftEditorCommand,
} from 'draft-js';
import {
  DraftContent,
  PREVIEW,
  LINK_BUTTON_TYPE,
  ACTION_BUTTON_TYPE,
  CODE_BLOCK_TYPE,
  RICOS_DIVIDER_TYPE,
  DIVIDER_TYPE,
  EMOJI_TYPE,
  RICOS_FILE_TYPE,
  FILE_UPLOAD_TYPE,
  RICOS_GALLERY_TYPE,
  GALLERY_TYPE,
  RICOS_GIPHY_TYPE,
  GIPHY_TYPE,
  HASHTAG_TYPE,
  HEADERS_MARKDOWN_TYPE,
  RICOS_HTML_TYPE,
  HTML_TYPE,
  RICOS_IMAGE_TYPE,
  IMAGE_TYPE,
  IMAGE_TYPE_LEGACY,
  INDENT_TYPE,
  LINE_SPACING_TYPE,
  HEADINGS_DROPDOWN_TYPE,
  SPOILER_TYPE,
  EXTERNAL_LINK_TYPE,
  LINK_TYPE,
  LINK_PREVIEW_TYPE,
  MAP_TYPE,
  EXTERNAL_MENTIONS_TYPE,
  MENTION_TYPE,
  SOUND_CLOUD_TYPE,
  TEXT_COLOR_TYPE,
  TEXT_HIGHLIGHT_TYPE,
  UNDO_REDO_TYPE,
  VERTICAL_EMBED_TYPE,
  RICOS_VIDEO_TYPE,
  VIDEO_TYPE,
  VIDEO_TYPE_LEGACY,
  RICOS_POLL_TYPE,
  POLL_TYPE,
  COLLAPSIBLE_LIST_TYPE,
  TABLE_TYPE,
  UNSUPPORTED_BLOCKS_TYPE,
  RICOS_LINK_TYPE,
  RICOS_MENTION_TYPE,
} from 'ricos-content';
import {
  DividerData,
  GiphyData,
  HTMLData,
  GalleryData,
  PollData,
  VideoData,
  FileData,
  LinkData,
  ImageData,
  MentionData as MentionPluginData,
  Node_Type,
  Decoration_Type,
} from 'ricos-schema';
import { NodeConfig, ExtensionConfig, MarkConfig } from '@tiptap/core';
export { Node_Type, Decoration_Type, LinkData };

export type CreatePluginData<PluginData> = (
  pluginData?: PluginData,
  isRicosSchema?: boolean
) => // eslint-disable-next-line @typescript-eslint/no-explicit-any
Record<string, any>;

export type MentionData = { mention: MentionPluginData; trigger: string };

export interface CreatePluginsDataMap {
  [RICOS_DIVIDER_TYPE]?: CreatePluginData<DividerData>;
  [DIVIDER_TYPE]?: CreatePluginData<DividerData>;
  [RICOS_GIPHY_TYPE]?: CreatePluginData<GiphyData>;
  [GIPHY_TYPE]?: CreatePluginData<GiphyData>;
  [RICOS_HTML_TYPE]?: CreatePluginData<HTMLData>;
  [HTML_TYPE]?: CreatePluginData<HTMLData>;
  [RICOS_GALLERY_TYPE]?: CreatePluginData<GalleryData>;
  [GALLERY_TYPE]?: CreatePluginData<GalleryData>;
  [RICOS_POLL_TYPE]?: CreatePluginData<PollData>;
  [POLL_TYPE]?: CreatePluginData<PollData>;
  [RICOS_VIDEO_TYPE]?: CreatePluginData<VideoData>;
  [VIDEO_TYPE]?: CreatePluginData<VideoData>;
  [RICOS_FILE_TYPE]?: CreatePluginData<FileData>;
  [FILE_UPLOAD_TYPE]?: CreatePluginData<FileData>;
  [RICOS_IMAGE_TYPE]?: CreatePluginData<ImageData>;
  [IMAGE_TYPE]?: CreatePluginData<ImageData>;
  [RICOS_LINK_TYPE]?: CreatePluginData<LinkData>;
  [LINK_TYPE]?: CreatePluginData<LinkData>;
  [RICOS_MENTION_TYPE]?: CreatePluginData<MentionData>;
  [MENTION_TYPE]?: CreatePluginData<MentionData>;
}

import { EditorPlugin as DraftEditorPlugin, PluginFunctions } from 'draft-js-plugins-editor';

export type PluginMapping = Partial<{
  [type: string]: {
    component: ComponentType;
    classNameStrategies?: {
      size?: ClassNameStrategy;
      alignment?: ClassNameStrategy;
      textWrap?: ClassNameStrategy;
      container?: ContainerClassNameStrategy;
    };
    elementType?: 'inline' | 'block';
  };
}>;

export type PluginTypeMapper = (...args) => PluginMapping;

export type PluginType =
  | typeof LINK_BUTTON_TYPE
  | typeof ACTION_BUTTON_TYPE
  | typeof CODE_BLOCK_TYPE
  | typeof DIVIDER_TYPE
  | typeof EMOJI_TYPE
  | typeof FILE_UPLOAD_TYPE
  | typeof GALLERY_TYPE
  | typeof GIPHY_TYPE
  | typeof HASHTAG_TYPE
  | typeof HEADERS_MARKDOWN_TYPE
  | typeof HTML_TYPE
  | typeof IMAGE_TYPE
  | typeof IMAGE_TYPE_LEGACY
  | typeof INDENT_TYPE
  | typeof LINE_SPACING_TYPE
  | typeof HEADINGS_DROPDOWN_TYPE
  | typeof SPOILER_TYPE
  | typeof EXTERNAL_LINK_TYPE
  | typeof LINK_TYPE
  | typeof LINK_PREVIEW_TYPE
  | typeof MAP_TYPE
  | typeof EXTERNAL_MENTIONS_TYPE
  | typeof MENTION_TYPE
  | typeof SOUND_CLOUD_TYPE
  | typeof TEXT_COLOR_TYPE
  | typeof TEXT_HIGHLIGHT_TYPE
  | typeof UNDO_REDO_TYPE
  | typeof VERTICAL_EMBED_TYPE
  | typeof VIDEO_TYPE
  | typeof VIDEO_TYPE_LEGACY
  | typeof POLL_TYPE
  | typeof COLLAPSIBLE_LIST_TYPE
  | typeof TABLE_TYPE
  | typeof UNSUPPORTED_BLOCKS_TYPE;

export type BlockRendererFn = (
  contentBlock: ContentBlock,
  {
    getEditorState,
    setEditorState,
  }: { getEditorState: GetEditorState; setEditorState: SetEditorState }
) => {
  component?: ComponentType;
  editable: boolean;
  props: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    getData: () => any;
    setData: (newData) => void;
    deleteBlock: () => void;
  };
} | null;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type CreatePluginFunction<PluginConfig extends EditorPluginConfig = Record<string, any>> = {
  (config: CreatePluginConfig<PluginConfig>): {
    InlinePluginToolbar?: ComponentType;
    Toolbar?: ComponentType;
    InsertPluginButtons: Pick<PluginButton, 'buttonSettings' | 'component'>[];
    externalizedButtonProps?: ToolbarButtonProps[];
    blockType: string;
    InlineModals?: ComponentType[];
    TextButtonMapper?: TextButtonMapper;
    pubsub: Pubsub;
    customStyleFn?: EditorProps['customStyleFn'];
    decoratorTrigger?: string;
    blockRendererFn: BlockRendererFn;
    underlyingPlugin?: {
      handleKeyCommand: EditorProps['handleKeyCommand'];
      keyBindingFn: EditorProps['keyBindingFn'];
    };
  };
  functionName?: string;
};

export type ModalsMap = Record<string, ComponentType>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type RicosDecorator = (theme: RichContentTheme, config: Record<string, unknown>) => any;

interface BasePluginConfig {
  type: string;
  theme?: ThemeGeneratorFunction;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface EditorPlugin<PluginConfig extends EditorPluginConfig = Record<string, any>>
  extends BasePluginConfig {
  config: PluginConfig;
  createPlugin?: CreatePluginFunction<PluginConfig>;
  ModalsMap?: ModalsMap;
  createPluginData?: CreatePluginData<PluginConfig>;
  tiptapExtension?: () => CreateTiptapExtension<NodeConfig | MarkConfig | ExtensionConfig>;
}

export type CreateTiptapExtension<T> = (obj: {
  mergeAttributes;
  ReactNodeViewRenderer;
  BaseExtensionComponentHOC;
}) => T;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface ViewerPlugin<PluginConfig = Record<string, any>> extends BasePluginConfig {
  config: PluginConfig;
  typeMapper?: PluginTypeMapper;
  inlineStyleMapper?: InlineStyleMapperFunction;
  decorator?: RicosDecorator;
}

export type EditorPluginCreator<PluginConfig> = (
  config?: PluginConfig
) => EditorPlugin<PluginConfig>;

export type ViewerPluginCreator<PluginConfig> = (
  config?: PluginConfig
) => ViewerPlugin<PluginConfig>;

export interface EditorPluginConfig {
  toolbar?: {
    hidden?: string[];
    icons?: {
      [key: string]: (props) => JSX.Element;
    };
  };
  getIsVisiblePromise?: (...args) => Promise<boolean>;
  innerRCEPlugins?: CreatePluginFunction[];
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ViewerPluginConfig {}

export type LegacyEditorPluginConfig<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  PluginConfig extends EditorPluginConfig = Record<string, any>
> = Partial<
  {
    [key in PluginType]: PluginConfig;
  }
> & {
  uiSettings?: UISettings;
  getToolbarSettings?: GetToolbarSettings;
  themeData?: ThemeData;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type LegacyViewerPluginConfig<PluginConfig = Record<string, any>> = Partial<
  {
    [key in PluginType]: PluginConfig;
  }
> & {
  uiSettings?: UISettings;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [PREVIEW]?: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
};

export type PluginsDecorator = (component: ComponentType) => ComponentType;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface CreatePluginConfig<PluginConfig extends EditorPluginConfig = Record<string, any>>
  extends EditorContextType,
    LegacyEditorPluginConfig<PluginConfig> {
  decorator: PluginsDecorator;
  commonPubsub: Pubsub;
  pluginDefaults: Record<string, unknown>;
  spoilerWrapper?: (component: ComponentType) => ComponentType;
  supportedBlockTypes: string[];
}

export interface LinkPanelSettings {
  blankTargetToggleVisibilityFn?: () => boolean;
  nofollowRelToggleVisibilityFn?: () => boolean;
  showNewTabCheckbox?: boolean;
  showNoFollowCheckbox?: boolean;
  showSponsoredCheckbox?: boolean;
  placeholder?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dropDown?: any;
  externalPopups?: boolean;
}

export type UISettings = {
  linkPanel?: LinkPanelSettings;
  disableRightClick?: boolean;
  disableDownload?: boolean;
};

export interface UnderlyingPlugin
  extends Pick<
    DraftEditorPlugin,
    'handleKeyCommand' | 'onChange' | 'handleReturn' | 'handleBeforeInput'
  > {
  decorators?: Decorator[];
  keyBindingFn?(
    e: KeyboardEvent,
    pluginFunctions: PluginFunctions
  ): DraftEditorCommand | 'remove-link-preview' | null;
}

export type Decorator = DraftDecorator | CompositeDecorator;

export type InlineStyleMapper = Record<string, (children, { key }) => JSX.Element>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type InlineStyleMapperFunction<PluginConfig = Record<string, any>> = (
  config: LegacyViewerPluginConfig<PluginConfig>,
  raw: DraftContent
) => () => InlineStyleMapper;
