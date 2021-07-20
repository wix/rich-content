import React, { Component, Fragment, ElementType, FunctionComponent, forwardRef } from 'react';
import {
  RicosEngine,
  shouldRenderChild,
  localeStrategy,
  getBiCallback as getCallback,
} from 'ricos-common';
import { DraftContent } from 'ricos-content';
import { RichContentEditor, RichContentEditorProps } from 'wix-rich-content-editor';
import { createDataConverter, filterDraftEditorSettings } from './utils/editorUtils';
import ReactDOM from 'react-dom';
import { EditorState, ContentState } from 'draft-js';
import RicosModal from './modals/RicosModal';
import './styles.css';
import { RicosEditorProps, EditorDataInstance } from '.';
import { hasActiveUploads } from './utils/hasActiveUploads';
import {
  convertToRaw,
  convertFromRaw,
  createWithContent,
} from 'wix-rich-content-editor/libs/editorStateConversion';
import { isEqual } from 'lodash';
import {
  EditorEventsContext,
  EditorEvents,
} from 'wix-rich-content-editor-common/libs/EditorEventsContext';
import { ToolbarType, Version } from 'wix-rich-content-common';
import { emptyDraftContent, getEditorContentSummary } from 'wix-rich-content-editor-common';
import { TiptapAPI } from 'wix-tiptap-editor';

// eslint-disable-next-line
const PUBLISH_DEPRECATION_WARNING_v9 = `Please provide the postId via RicosEditor biSettings prop and use one of editorRef.publish() or editorEvents.publish() APIs for publishing.
The getContent(postId, isPublishing) API is deprecated and will be removed in ricos v9.0.0`;

interface State {
  StaticToolbar?: ElementType;
  localeData: { locale?: string; localeResource?: Record<string, string> };
  remountKey: boolean;
  editorState?: EditorState;
  initialContentChanged: boolean;
  error?: string;
}

export class RicosEditor extends Component<RicosEditorProps, State> {
  editor!: RichContentEditor;

  tiptapApi!: TiptapAPI;

  useTiptap = false;

  dataInstance: EditorDataInstance;

  isBusy = false;

  getBiCallback: typeof getCallback;

  currentEditorRef!: ElementType;

  static getDerivedStateFromError(error: string) {
    return { error };
  }

  componentDidCatch(error, errorInfo) {
    console.error({ error, errorInfo });
  }

  constructor(props: RicosEditorProps) {
    super(props);
    this.dataInstance = createDataConverter(props.onChange, props.content);
    this.getBiCallback = getCallback.bind(this);
    this.state = {
      localeData: { locale: props.locale },
      remountKey: false,
      initialContentChanged: true,
    };
    this.useTiptap = !!props.experiments?.tiptapEditor?.enabled;
  }

  static defaultProps = {
    onError: err => {
      throw err;
    },
    locale: 'en',
  };

  updateLocale = async () => {
    const { children } = this.props;
    const locale = children?.props.locale || this.props.locale;
    await localeStrategy(locale)
      .then(localeData => this.setState({ localeData, remountKey: !this.state.remountKey }))
      .catch(error => this.setState({ error }));
  };

  componentDidMount() {
    this.updateLocale();
    this.loadEditor();
    const { isMobile, toolbarSettings } = this.props;
    const { useStaticTextToolbar } = toolbarSettings || {};
    this.getBiCallback('onOpenEditorSuccess')?.(
      Version.currentVersion,
      isMobile ? ToolbarType.MOBILE : useStaticTextToolbar ? ToolbarType.STATIC : ToolbarType.INLINE
    );
    this.props.editorEvents?.subscribe(EditorEvents.RICOS_PUBLISH, this.onPublish);
  }

  loadEditor() {
    if (this.useTiptap) {
      import(
        /* webpackChunkName: wix-tiptap-editor */
        'wix-tiptap-editor'
      ).then(tiptapEditorModule => {
        const { initTiptapEditor } = tiptapEditorModule;
        const { content, injectedContent } = this.props;
        this.tiptapApi = initTiptapEditor({
          initialContent: content ?? injectedContent ?? emptyDraftContent,
          onUpdate: this.onUpdate,
        });
        this.forceUpdate();
      });
    }
  }

  onUpdate = ({ content }: { content: DraftContent }) => {
    const editorState = EditorState.createWithContent(convertFromRaw(content));
    this.onChange()(editorState);
  };

  componentWillUnmount() {
    this.props.editorEvents?.unsubscribe(EditorEvents.RICOS_PUBLISH, this.onPublish);
    if (this.useTiptap && this.tiptapApi) {
      this.tiptapApi.destroy();
    }
  }

  // TODO: remove deprecated postId once getContent(postId) is removed (9.0.0)
  sendPublishBi = async (postId?: string) => {
    const onPublish = this.props._rcProps?.helpers?.onPublish;
    if (!onPublish) {
      return;
    }
    const contentState = this.dataInstance.getContentState();
    const { pluginsCount, pluginsDetails } = getEditorContentSummary(contentState) || {};
    onPublish(postId, pluginsCount, pluginsDetails, Version.currentVersion);
  };

  onPublish = async () => {
    // TODO: remove this param after getContent(postId) is deprecated
    this.sendPublishBi((undefined as unknown) as string);
    console.debug('editor publish callback'); // eslint-disable-line
    return {
      type: 'EDITOR_PUBLISH',
      data: await this.getContent(),
    };
  };

  publish = async () => {
    const publishResponse = await this.onPublish();
    return publishResponse.data;
  };

  setStaticToolbar = ref => {
    if (ref && ref !== this.currentEditorRef) {
      this.currentEditorRef = ref;
      const { MobileToolbar, TextToolbar } = ref.getToolbars();
      this.setState({ StaticToolbar: MobileToolbar || TextToolbar });
    }
  };

  componentWillReceiveProps(newProps: RicosEditorProps) {
    if (newProps.locale !== this.props.locale) {
      this.updateLocale();
    }
    if (
      newProps.injectedContent &&
      !isEqual(this.props.injectedContent, newProps.injectedContent)
    ) {
      console.debug('new content provided as editorState'); // eslint-disable-line
      const editorState = createWithContent(convertFromRaw(newProps.injectedContent));
      this.setState({ editorState }, () => {
        this.dataInstance = createDataConverter(this.props.onChange, this.props.injectedContent);
        this.dataInstance.refresh(editorState, this.props.onError);
      });
    }
  }

  onInitialContentChanged = () => {
    const { initialContentChanged } = this.state;
    if (initialContentChanged) {
      this.getBiCallback('onContentEdited')?.({ version: Version.currentVersion });
      this.setState({ initialContentChanged: false });
    }
  };

  onChange = (childOnChange?: RichContentEditorProps['onChange']) => (editorState: EditorState) => {
    try {
      this.dataInstance.refresh(editorState, this.props.onError);
      if (this.getContentTraits().isContentChanged) {
        this.onInitialContentChanged();
      }
      childOnChange?.(editorState);
      this.onBusyChange(editorState.getCurrentContent());
    } catch (err) {
      this.setState({ error: err });
    }
  };

  getToolbarProps = (type: ToolbarType) => this.editor.getToolbarProps(type);

  focus = () => (this.useTiptap ? this.tiptapApi.focus() : this.editor.focus());

  blur = () => (this.useTiptap ? this.tiptapApi.blur() : this.editor.blur());

  getToolbars = () => this.editor.getToolbars();

  getContentTraits = () => this.dataInstance.getContentTraits();

  getContent = async (postId?: string, forPublish?: boolean, shouldRemoveErrorBlocks = true) => {
    if (postId && forPublish) {
      console.warn(PUBLISH_DEPRECATION_WARNING_v9); // eslint-disable-line
      this.sendPublishBi(postId); //async
    }
    return this.dataInstance.getContentState({ shouldRemoveErrorBlocks });
  };

  getContentPromise = async ({
    publishId,
    flush,
  }: { flush?: boolean; publishId?: string } = {}) => {
    const { getContentStatePromise, waitForUpdate } = this.dataInstance;
    if (flush) {
      waitForUpdate();
      this.blur();
    }
    const res = await getContentStatePromise();
    if (publishId) {
      console.warn(PUBLISH_DEPRECATION_WARNING_v9); // eslint-disable-line
      this.sendPublishBi(publishId);
    }
    return res;
  };

  onBusyChange = (contentState: ContentState) => {
    const { onBusyChange, onChange } = this.props;
    const isBusy = hasActiveUploads(contentState);
    if (this.isBusy !== isBusy) {
      this.isBusy = isBusy;
      onBusyChange?.(isBusy);
      onChange?.(convertToRaw(contentState));
    }
  };

  setEditorRef = (ref: RichContentEditor) => {
    this.editor = ref;
    this.setStaticToolbar(ref);
  };

  getEditorCommands = () =>
    this.useTiptap ? this.tiptapApi.getEditorCommands() : this.editor.getEditorCommands();

  renderToolbarPortal(Toolbar) {
    return (
      <StaticToolbarPortal
        StaticToolbar={Toolbar}
        textToolbarContainer={this.props.toolbarSettings?.textToolbarContainer}
      />
    );
  }

  renderRicosEngine(child, childProps) {
    const { toolbarSettings, draftEditorSettings = {}, localeContent, ...props } = this.props;
    const supportedDraftEditorSettings = filterDraftEditorSettings(draftEditorSettings);
    const contentProp = this.getContentProp();
    return (
      <RicosEngine
        RicosModal={RicosModal}
        isViewer={false}
        key={'editor'}
        toolbarSettings={toolbarSettings}
        {...contentProp.content}
        {...props}
      >
        {React.cloneElement(child, {
          editorKey: 'editor',
          setEditorToolbars: this.setStaticToolbar,
          ...childProps,
          ...contentProp.editorState,
          ...supportedDraftEditorSettings,
          ...this.state.localeData,
          localeContent,
        })}
      </RicosEngine>
    );
  }

  renderDraftEditor() {
    const { StaticToolbar, remountKey } = this.state;
    const child =
      this.props.children && shouldRenderChild('RichContentEditor', this.props.children) ? (
        this.props.children
      ) : (
        <RichContentEditor />
      );
    return (
      <Fragment key={`${remountKey}`}>
        {this.renderToolbarPortal(StaticToolbar)}
        {this.renderRicosEngine(child, {
          onChange: this.onChange(child.props.onChange),
          ref: this.setEditorRef,
        })}
      </Fragment>
    );
  }

  renderTiptapEditor() {
    if (!this.tiptapApi) {
      return null;
    }
    const { Editor: TiptapEditor, getToolbars } = this.tiptapApi;
    const Toolbar = getToolbars().TextToolbar;
    const child = <TiptapEditor />;
    return (
      <Fragment>
        {this.renderToolbarPortal(Toolbar)}
        {this.renderRicosEngine(child, {})}
      </Fragment>
    );
  }

  getContentProp() {
    const { editorState } = this.state;
    const { content } = this.props;
    return editorState
      ? { editorState: { editorState }, content: {} }
      : { editorState: {}, content: { content } };
  }

  render() {
    try {
      if (this.state.error) {
        this.props.onError?.(this.state.error);
        return null;
      }

      return this.useTiptap ? this.renderTiptapEditor() : this.renderDraftEditor();
    } catch (e) {
      this.props.onError?.(e);
      return null;
    }
  }
}

export default forwardRef<RicosEditor, RicosEditorProps>((props, ref) => (
  <EditorEventsContext.Consumer>
    {contextValue => <RicosEditor editorEvents={contextValue} {...props} ref={ref} />}
  </EditorEventsContext.Consumer>
));

const StaticToolbarPortal: FunctionComponent<{
  StaticToolbar?: ElementType;
  textToolbarContainer?: HTMLElement;
}> = ({ StaticToolbar, textToolbarContainer }) => {
  if (!StaticToolbar) return null;

  if (textToolbarContainer) {
    return ReactDOM.createPortal(<StaticToolbar />, textToolbarContainer);
  }
  return <StaticToolbar />;
};
