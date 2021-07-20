/* eslint-disable @typescript-eslint/no-explicit-any */
import createBaseComponent from './createBaseComponent';
import createAtomicPluginToolbar from './toolbars/createAtomicPluginToolbar';
import createInlinePluginToolbar from './toolbars/createInlinePluginToolbar';
import createInsertPluginButton from './createBaseInsertPluginButton';
import { generateInsertPluginButtonProps } from '../Utils/generateInsertPluginButtonProps';
import {
  deleteBlock,
  setBlockNewEntityData,
  setEntityData,
  getToolbarTheme,
  TOOLBARS,
} from 'wix-rich-content-editor-common';
import { ContentBlock, EditorProps } from 'draft-js';
import {
  CreatePluginConfig,
  EditorPluginConfig,
  UISettings,
  Pubsub,
  CreatePluginToolbar,
  PluginButton,
  simplePubsub,
  ToolbarButtonProps,
  CreatePluginFunction,
  BlockRendererFn,
  ComponentData,
  GetEditorState,
  SetEditorState,
  UnderlyingPlugin,
} from 'wix-rich-content-common';
import { CSSProperties, ComponentType } from 'react';
import { UNSUPPORTED_BLOCKS_TYPE } from '../consts';

type EditorStateFuncs = { getEditorState: GetEditorState; setEditorState: SetEditorState };

const getData = (
  contentBlock: ContentBlock,
  { getEditorState }: Pick<EditorStateFuncs, 'getEditorState'>,
  removeConfigFromData: boolean
) => () => {
  const { config, ...rest } = getEditorState?.()
    .getCurrentContent()
    .getEntity(contentBlock.getEntityAt(0))
    .getData();
  return removeConfigFromData ? { ...rest } : { config, ...rest };
};

const setData = (
  contentBlock: ContentBlock,
  { getEditorState, setEditorState }: EditorStateFuncs,
  type: string,
  commonPubsub
) => newData => {
  const editorState = commonPubsub.get('undoExperiment')?.()
    ? setBlockNewEntityData(getEditorState(), contentBlock.getKey(), newData, type)
    : setEntityData(getEditorState(), contentBlock.getEntityAt(0), newData);
  setEditorState(editorState);
};

const deleteEntity = (
  contentBlock: ContentBlock,
  { getEditorState, setEditorState }: EditorStateFuncs
) => () => setEditorState(deleteBlock(getEditorState(), contentBlock.getKey()));

const DEFAULT_SETTINGS = {
  showInsertButtons: true,
};

interface CreateBasePluginConfig extends CreatePluginConfig {
  settings: Record<string, any> & EditorPluginConfig;
  customStyleFn?: EditorProps['customStyleFn'];
  onOverlayClick?: ({ e, pubsub }: { e: Event; pubsub: Pubsub }) => void;
  onComponentMount?: ({ e, pubsub }: { e: Event; pubsub: Pubsub }) => void;
  disableRightClick?: UISettings['disableRightClick'];
  supportedBlockTypes: string[];
  type: string;
  defaultPluginData: Record<string, unknown>;
  decoratorTrigger?: string;
  toolbar?: ReturnType<CreatePluginToolbar>;
  component?: ComponentType;
  pluginDecorationProps?: (
    props: any,
    componentData: ComponentData
  ) => {
    onMouseDown: MouseEvent;
    onMouseMove: MouseEvent;
    onMouseLeave: MouseEvent;
    style: CSSProperties;
    width: number;
    containerClassName: string;
  };
  componentWillReceiveDecorationProps?: (
    props: any,
    nextProps: any,
    onPropsChange: (props: any) => void
  ) => void;
  inlineModals?: ComponentType[];
  legacyType?: string;
  noPluginBorder?: boolean;
  noPointerEventsOnFocus?: boolean;
  withHorizontalScroll?: boolean;
  innerRCERenderedIn?: string;
}

const createBasePlugin = (
  config: CreateBasePluginConfig,
  underlyingPlugin?: UnderlyingPlugin
): ReturnType<CreatePluginFunction> => {
  const pubsub = simplePubsub();
  const settings = { ...DEFAULT_SETTINGS, ...config.settings };
  const helpers = config.helpers || {};
  const isMobile = config.isMobile || false;
  const {
    t,
    anchorTarget,
    relValue,
    customStyleFn,
    getEditorBounds,
    onOverlayClick,
    disableRightClick,
    commonPubsub,
    defaultPluginData,
    pluginDefaults,
    onComponentMount,
    languageDir,
    locale,
    theme,
    shouldRenderOptimizedImages,
    iframeSandboxDomain,
    setInPluginEditingMode,
    getInPluginEditingMode,
    getEditorState,
    renderInnerRCE,
    decoratorTrigger,
    noPluginBorder,
    noPointerEventsOnFocus,
    withHorizontalScroll,
    innerRCERenderedIn,
    disableKeyboardEvents,
  } = config;
  defaultPluginData && (pluginDefaults[config.type] = defaultPluginData);
  const toolbarTheme = { ...getToolbarTheme(config.theme, 'plugin'), ...config.theme };
  const InlinePluginToolbar =
    config.toolbar?.InlinePluginToolbarButtons &&
    createInlinePluginToolbar({
      buttons: {
        all: config.toolbar.InlinePluginToolbarButtons,
        hidden: settings?.toolbar?.hidden || [],
      },
      theme: { ...toolbarTheme, ...config.theme },
      commonPubsub,
      isMobile,
      t,
      name: config.toolbar.name,
      getToolbarSettings: config.getToolbarSettings,
      languageDir,
    });
  const Toolbar =
    config?.toolbar?.InlineButtons &&
    createAtomicPluginToolbar({
      buttons: {
        all: config.toolbar.InlineButtons,
        hidden: settings?.toolbar?.hidden || [],
      },
      theme: { ...toolbarTheme, ...config.theme },
      pubsub,
      helpers,
      innerModal: config.innerModal,
      settings,
      isMobile,
      anchorTarget,
      relValue,
      t,
      name: config?.toolbar?.name,
      uiSettings: config.uiSettings,
      getToolbarSettings: config.getToolbarSettings,
      getEditorBounds,
      languageDir,
      getEditorState,
      linkTypes: config.LINK?.linkTypes,
      innerRCERenderedIn,
    });

  const externalizedButtonProps:
    | ToolbarButtonProps[]
    | undefined = config?.toolbar?.InsertButtons?.map(button =>
    generateInsertPluginButtonProps({
      blockType: config.type,
      button,
      helpers,
      pubsub,
      commonPubsub,
      settings,
      t,
      isMobile,
      pluginDefaults,
      getEditorState,
      setEditorState: editorState => {
        commonPubsub.get('setEditorState')?.(editorState);
      },
      toolbarName: TOOLBARS.INSERT_PLUGIN,
    })
  );
  const InsertPluginButtons: Omit<PluginButton, 'blockType'>[] =
    (settings.showInsertButtons &&
      config?.toolbar?.InsertButtons?.map(button => ({
        buttonSettings: button,
        component: createInsertPluginButton({
          blockType: config.type,
          button,
          helpers,
          pubsub,
          commonPubsub,
          settings,
          t,
          theme,
          isMobile,
          pluginDefaults,
        }),
      }))) ||
    [];
  const spoilerWrapper = config?.spoilerWrapper;
  const PluginComponent =
    spoilerWrapper && config.component ? spoilerWrapper(config.component) : config.component;

  const BaseComponent: ComponentType | undefined =
    PluginComponent &&
    createBaseComponent({
      PluginComponent,
      theme: config.theme,
      pluginDecorationProps: config.pluginDecorationProps,
      componentWillReceiveDecorationProps: config.componentWillReceiveDecorationProps,
      onOverlayClick,
      pubsub,
      commonPubsub,
      settings,
      helpers,
      t,
      anchorTarget,
      relValue,
      isMobile,
      getEditorBounds,
      disableRightClick,
      onComponentMount,
      locale,
      shouldRenderOptimizedImages,
      iframeSandboxDomain,
      setInPluginEditingMode,
      getInPluginEditingMode,
      renderInnerRCE,
      noPluginBorder,
      noPointerEventsOnFocus,
      withHorizontalScroll,
      disableKeyboardEvents,
      type: config.type,
    });

  const DecoratedCompWithBase: ComponentType | undefined =
    BaseComponent && config.decorator ? config.decorator(BaseComponent) : BaseComponent;

  const InlineModals = config.inlineModals;

  const TextButtonMapper = config.toolbar && config.toolbar.TextButtonMapper;

  const blockRendererFn: BlockRendererFn = (
    contentBlock: ContentBlock,
    { getEditorState, setEditorState }: EditorStateFuncs
  ) => {
    if (contentBlock.getType() === 'atomic') {
      // TODO subject to change for draft-js next release
      const contentState = getEditorState().getCurrentContent();
      const key = contentBlock.getEntityAt(0);
      if (key) {
        const entity = contentState.getEntity(key);
        const entityType = entity.getType();
        let type;
        if (config.type === entityType || config.legacyType === entityType) {
          type = entityType;
        } else if (
          config.type === UNSUPPORTED_BLOCKS_TYPE &&
          !config.supportedBlockTypes?.includes(entityType)
        ) {
          type = UNSUPPORTED_BLOCKS_TYPE;
        }

        const blockRenderObject = type
          ? {
              component: DecoratedCompWithBase,
              editable: false,
              props: {
                getData: getData(
                  contentBlock,
                  { getEditorState },
                  type === UNSUPPORTED_BLOCKS_TYPE
                ),
                setData: setData(
                  contentBlock,
                  { getEditorState, setEditorState },
                  config.type,
                  commonPubsub
                ),
                deleteBlock: deleteEntity(contentBlock, { getEditorState, setEditorState }),
                type,
              },
            }
          : null;
        return blockRenderObject;
      }
    }
    return null;
  };

  const commonProps = {
    InlinePluginToolbar,
    Toolbar,
    InsertPluginButtons,
    externalizedButtonProps,
    blockType: config.type,
    InlineModals,
    TextButtonMapper,
    pubsub,
    customStyleFn,
    ...(decoratorTrigger ? { decoratorTrigger } : {}),
  };

  return {
    ...commonProps,
    blockRendererFn,
    ...(underlyingPlugin || {}),
  };
};

export default createBasePlugin;
