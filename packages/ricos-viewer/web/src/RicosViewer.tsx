import React, { Component, Suspense } from 'react';
import { RicosEngine, shouldRenderChild, getBiCallback as getCallback } from 'ricos-common';
import { RichContentViewer } from 'wix-rich-content-viewer';
import { Version } from 'wix-rich-content-common';
import RicosModal from './modals/RicosModal';
import './styles.css';
import { RicosViewerProps } from './index';
import { getContentSummary } from 'wix-rich-content-common/libs/contentAnalytics';

interface State {
  isPreviewExpanded: boolean;
  localeData: { locale?: string; localeResource?: Record<string, string> };
  remountKey: boolean;
  error?: string;
  TextSelectionToolbar?;
}

export class RicosViewer extends Component<RicosViewerProps, State> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  viewerRef!: HTMLElement;

  getBiCallback: typeof getCallback;

  static getDerivedStateFromError(error: string) {
    return { error };
  }

  componentDidCatch(error, errorInfo) {
    console.error({ error, errorInfo });
  }

  constructor(props: RicosViewerProps) {
    super(props);
    this.getBiCallback = getCallback.bind(this);
    this.state = {
      isPreviewExpanded: false,
      localeData: { locale: props.locale },
      remountKey: false,
    };
  }

  static defaultProps = {
    onError: err => {
      throw err;
    },
    locale: 'en',
  };

  getLocale = () => {
    const { children, locale } = this.props;
    return children?.props.locale || locale;
  };

  componentDidMount() {
    const { children } = this.props;

    const onViewerLoaded = this.getBiCallback('onViewerLoaded');
    const isPreview = children?.props.helpers?.isPreview || this.props._rcProps?.helpers?.isPreview;
    const content =
      this.props.content || children?.props.initialState || this.props._rcProps?.initialState;
    const { pluginsCount } = (content && getContentSummary(content)) || {};
    onViewerLoaded?.({
      isPreview: !!isPreview?.(),
      version: Version.currentVersion,
      pluginsCount,
      url: document.URL,
    });
  }

  onPreviewExpand = () => this.setState({ isPreviewExpanded: true });

  setRef = ref => ref && (this.viewerRef = ref);

  loadTextSelection = () => {
    const { textSelectionToolbar, isMobile } = this.props;
    const needTextSelectionToolbar = textSelectionToolbar && !isMobile;
    if (needTextSelectionToolbar && !this.state.TextSelectionToolbar) {
      const TextSelectionToolbar = React.lazy(() => import('./TextSelectionToolbar'));
      this.setState({ TextSelectionToolbar });
    }
  };

  render() {
    const { children, seoSettings, ...props } = this.props;
    const { isPreviewExpanded, localeData, TextSelectionToolbar } = this.state;
    try {
      if (this.state.error) {
        this.props.onError?.(this.state.error);
        return null;
      }
      const child =
        children && shouldRenderChild('RichContentViewer', children) ? (
          children
        ) : (
          <RichContentViewer />
        );
      return [
        <RicosEngine
          key="viewer"
          RicosModal={RicosModal}
          isPreviewExpanded={isPreviewExpanded}
          onPreviewExpand={this.onPreviewExpand}
          isViewer
          {...props}
        >
          {React.cloneElement(child, {
            seoMode: seoSettings,
            setRef: this.setRef,
            onMouseOver: this.loadTextSelection,
            ...localeData,
          })}
        </RicosEngine>,
        TextSelectionToolbar ? (
          <Suspense fallback={<div />}>
            <TextSelectionToolbar
              onButtonClick={this.getBiCallback('onViewerAction')}
              container={this.viewerRef}
            />
          </Suspense>
        ) : null,
      ];
    } catch (e) {
      this.props.onError?.(e);
      return null;
    }
  }
}
