import {
  BUTTON_TYPES,
  createBlock,
  EditorState,
  SelectionState,
} from 'wix-rich-content-editor-common';
import {
  GALLERY_TYPE,
  Helpers,
  ToolbarType,
  TranslationFunction,
  RichContentTheme,
  CloseModalFunction,
  InsertButton,
  ToolbarButtonProps,
  Pubsub,
  EditorPluginConfig,
  RicosHooks,
  Version,
} from 'wix-rich-content-common';
import { GetEditorState, onPluginAddStepArgs, SetEditorState } from 'wix-rich-content-common/src';

export function generateInsertPluginButtonProps({
  blockType,
  button,
  helpers,
  hooks,
  pubsub,
  commonPubsub,
  settings,
  t,
  theme,
  isMobile,
  pluginDefaults,
  getEditorState,
  setEditorState,
  toolbarName,
  pluginMenuButtonRef,
  closePluginMenu,
}: {
  blockType: string;
  button: InsertButton;
  helpers: Helpers;
  hooks: RicosHooks;
  pubsub: Pubsub;
  commonPubsub: Pubsub;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  settings: Record<string, any> & EditorPluginConfig;
  t: TranslationFunction;
  theme?: RichContentTheme;
  isMobile: boolean;
  pluginDefaults: Record<string, unknown>;
  getEditorState: GetEditorState;
  setEditorState: SetEditorState;
  toolbarName: ToolbarType;
  pluginMenuButtonRef?: HTMLElement;
  closePluginMenu?: CloseModalFunction;
}): ToolbarButtonProps {
  const onPluginAdd = () => hooks.onPluginAdd?.(blockType, toolbarName, Version.currentVersion);
  const onPluginAddStep = (step: onPluginAddStepArgs['step']) => {
    hooks.onPluginAddStep?.({
      version: Version.currentVersion,
      entryType: toolbarName, //plusButton = SIDE, moreButton = SHORTCUT, footer = FOOTER
      entryPoint: toolbarName,
      pluginId: blockType,
      pluginDetails: '',
      step,
    });
  };
  const onPluginAddSuccess = () =>
    hooks.onPluginAddSuccess?.(blockType, toolbarName, Version.currentVersion);

  function addBlock(data) {
    const { newBlock, newSelection, newEditorState } = createBlock(
      getEditorState(),
      data,
      blockType
    );
    setEditorState(EditorState.forceSelection(newEditorState, newSelection));
    onPluginAddSuccess();
    return { newBlock, newSelection, newEditorState };
  }

  function addCustomBlock(buttonData: InsertButton) {
    buttonData.addBlockHandler?.(getEditorState());
    onPluginAddSuccess();
  }

  function createBlocksFromFiles(
    files: File[] | File[][],
    data,
    type: string,
    updateEntity: (blockKey: string, file: File | File[]) => void
  ) {
    let editorState = getEditorState();
    let selection: SelectionState | undefined;
    files.forEach((file: File | File[]) => {
      const { newBlock, newSelection, newEditorState } = createBlock(editorState, data, type);
      editorState = newEditorState;
      selection = selection || newSelection;
      updateEntity(newBlock.getKey(), file);
      onPluginAddSuccess();
    });

    return { newEditorState: editorState, newSelection: selection as SelectionState };
  }

  function onClick(event: MouseEvent) {
    event.preventDefault();
    onPluginAdd();
    switch (button.type) {
      case 'file':
        toggleFileSelection();
        onPluginAddStep('FileUploadDialog');
        break;
      case 'modal':
        toggleButtonModal(event);
        onPluginAddStep('PluginModal');
        break;
      case 'custom-block':
        addCustomBlock(button);
        break;
      case BUTTON_TYPES.BUTTON:
        if (button.onClick) {
          button.onClick(event);
        } else {
          addBlock(button.componentData || {});
        }
        break;
      default:
        addBlock(button.componentData || {});
        break;
    }
    closePluginMenu?.();
  }

  function shouldCreateGallery(files) {
    return (
      blockType === GALLERY_TYPE ||
      (pluginDefaults[GALLERY_TYPE] && settings.createGalleryForMultipleImages && files.length > 1)
    );
  }

  function handleFileChange(files: File[], updateEntity: (blockKey: string, file: File) => void) {
    if (files.length > 0) {
      const galleryData = pluginDefaults[GALLERY_TYPE];
      const { newEditorState, newSelection } = shouldCreateGallery(files)
        ? createBlocksFromFiles([files], galleryData, GALLERY_TYPE, updateEntity)
        : createBlocksFromFiles(files, button.componentData, blockType, updateEntity);
      setEditorState(EditorState.forceSelection(newEditorState, newSelection));
    }
  }

  function onChange(files: File[]) {
    return handleFileChange(files, (blockKey: string, file: File) => {
      const state = { userSelectedFiles: { files: Array.isArray(file) ? file : [file] } };
      commonPubsub.set('initialState_' + blockKey, state);
    });
  }

  function handleExternalFileChanged({ data, error }) {
    if (data) {
      const handleFilesAdded = shouldCreateGallery(data)
        ? (blockKey: string) => commonPubsub.getBlockHandler('galleryHandleFilesAdded', blockKey)
        : (blockKey: string) => pubsub.getBlockHandler('handleFilesAdded', blockKey);
      handleFileChange(data, (blockKey, file) =>
        setTimeout(() => handleFilesAdded(blockKey)({ data: file, error }))
      );
    }
  }

  function toggleButtonModal(event) {
    if (helpers && helpers.openModal) {
      let modalStyles = {};
      if (button.modalStyles) {
        modalStyles = button.modalStyles;
        // relies on button ref
      } else if (button.modalStylesFn) {
        modalStyles = button.modalStylesFn({
          buttonRef: pluginMenuButtonRef || event.target,
          pubsub,
          toolbarName,
        });
      }

      let addedBlockKey;

      helpers.openModal({
        modalName: button.modalName,
        modalElement: button.modalElement,
        modalDecorations: button.modalDecorations,
        buttonRef: event.target,
        modalStyles,
        theme,
        componentData: button.componentData,
        onConfirm: obj => {
          const data = addBlock(obj);
          addedBlockKey = data.newBlock;
          return data;
        },
        pubsub,
        helpers,
        t,
        isMobile,
        blockKey: addedBlockKey,
      });
    }
  }

  function toggleFileSelection() {
    if (settings?.handleFileSelection) {
      settings.handleFileSelection(handleExternalFileChanged);
    } else if (helpers?.handleFileSelection) {
      const multiple = !!button.multi;
      helpers.handleFileSelection(
        undefined,
        multiple,
        handleExternalFileChanged,
        undefined,
        button.componentData
      );
    }
  }

  function isFileInput() {
    return (
      button.type === BUTTON_TYPES.FILE &&
      !settings.handleFileSelection &&
      !helpers.handleFileSelection
    );
  }

  function getButtonType() {
    return isFileInput() ? BUTTON_TYPES.FILE : BUTTON_TYPES.BUTTON;
  }

  function getPropsByButtonType(type) {
    return {
      [BUTTON_TYPES.FILE]: { onChange, accept: settings.accept, multiple: button.multi },
      [BUTTON_TYPES.BUTTON]: { onClick },
    }[type];
  }

  return {
    name: button.name,
    getIcon: button.getIcon,
    tooltip: button.tooltip,
    dataHook: `${button.name}`,
    getLabel: () => t(button.name),
    isDisabled: button.isDisabled || (() => false),
    isActive: button.isActive || (() => false),
    type: getButtonType(),
    toolbars: button.toolbars,
    ...getPropsByButtonType(getButtonType()),
  };
}
