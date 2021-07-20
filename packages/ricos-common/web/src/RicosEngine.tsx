import React, { Component, Children, FunctionComponent, ReactElement } from 'react';

import pluginsStrategy from './pluginsStrategy/pluginsStrategy';
import themeStrategy from './themeStrategy/themeStrategy';
import { merge } from 'lodash';

import previewStrategy from './previewStrategy/previewStrategy';
import { PreviewConfig } from 'wix-rich-content-preview';
import { RicosEditorProps, RicosViewerProps, RichContentProps, BasePlugin } from './types';
import {
  convertRelStringToObject,
  convertRelObjectToString,
} from 'wix-rich-content-common/libs/linkConverters';
import { EditorCommands } from 'wix-rich-content-common';

interface EngineProps extends RicosEditorProps, RicosViewerProps {
  children: ReactElement;
  plugins?: BasePlugin[];
  RicosModal: FunctionComponent;
  isViewer: boolean;
  isPreviewExpanded?: boolean;
  onPreviewExpand?: PreviewConfig['onPreviewExpand'];
  editorCommands?: EditorCommands;
}

export class RicosEngine extends Component<EngineProps> {
  static defaultProps = { locale: 'en', isMobile: false };

  runStrategies() {
    const {
      cssOverride,
      plugins = [],
      isViewer = false,
      content,
      preview,
      theme: ricosTheme,
      isPreviewExpanded = false,
      onPreviewExpand,
      children,
      experiments,
    } = this.props;

    const { theme, html, themeData } = themeStrategy({
      plugins,
      cssOverride,
      ricosTheme,
      experiments,
    });
    const htmls: ReactElement[] = [];
    if (html) {
      htmls.push(html);
    }

    const strategiesProps = merge(
      { theme },
      pluginsStrategy({
        themeData,
        isViewer,
        plugins,
        childProps: children.props,
        cssOverride: theme,
        content,
        experiments,
      })
    );

    const { initialState: previewContent, ...previewStrategyResult } = previewStrategy({
      isViewer,
      isPreviewExpanded,
      onPreviewExpand,
      previewConfig: preview,
      content,
    });

    return {
      strategyProps: merge(strategiesProps, previewStrategyResult),
      previewContent,
      htmls,
    };
  }

  render() {
    const {
      _rcProps,
      children,
      isMobile,
      addAnchors,
      toolbarSettings,
      modalSettings = {},
      isPreviewExpanded,
      placeholder,
      content,
      RicosModal,
      onError,
      mediaSettings = {},
      linkSettings = {},
      linkPanelSettings = {},
      maxTextLength,
      textAlignment,
      onAtomicBlockFocus,
      experiments,
      editorCommands,
    } = this.props;

    const { strategyProps, previewContent, htmls } = this.runStrategies();

    const { useStaticTextToolbar, textToolbarContainer, getToolbarSettings } =
      toolbarSettings || {};

    const {
      openModal,
      closeModal,
      ariaHiddenId,
      container,
      onModalOpen,
      onModalClose,
    } = modalSettings;
    const { pauseMedia, disableRightClick, fullscreenProps } = mediaSettings;
    const { anchorTarget, customAnchorScroll } = linkSettings;
    let { relValue, rel } = linkSettings;
    const {
      blankTargetToggleVisibilityFn,
      nofollowRelToggleVisibilityFn,
      showNewTabCheckbox,
      showNoFollowCheckbox,
    } = linkPanelSettings;
    if (blankTargetToggleVisibilityFn) {
      // eslint-disable-next-line no-console
      console.warn(
        // eslint-disable-next-line max-len
        `blankTargetToggleVisibilityFn is deprecated, Please use showNewTabCheckbox prop instead.`
      );
      linkPanelSettings.showNewTabCheckbox =
        linkPanelSettings.blankTargetToggleVisibilityFn?.() || showNewTabCheckbox;
    }
    if (nofollowRelToggleVisibilityFn) {
      // eslint-disable-next-line no-console
      console.warn(
        // eslint-disable-next-line max-len
        `nofollowRelToggleVisibilityFn is deprecated, Please use showNoFollowCheckbox prop instead.`
      );
      linkPanelSettings.showNoFollowCheckbox =
        linkPanelSettings.nofollowRelToggleVisibilityFn?.() || showNoFollowCheckbox;
    }
    if (relValue) {
      // eslint-disable-next-line no-console
      console.warn(
        // eslint-disable-next-line max-len
        `relValue is deprecated, Please use rel prop instead.`
      );
      rel = convertRelStringToObject(relValue) || rel;
    }
    relValue = convertRelObjectToString(rel);
    const disableDownload = mediaSettings?.disableDownload || disableRightClick;
    // any of ricos props that should be merged into child
    const isPreview = () => !!(previewContent && !isPreviewExpanded);
    const ricosPropsToMerge: RichContentProps = {
      addAnchors,
      isMobile,
      maxTextLength,
      textToolbarType:
        !isMobile && (textToolbarContainer || useStaticTextToolbar) ? 'static' : 'inline',
      config: {
        getToolbarSettings,
        uiSettings: { disableDownload, linkPanel: linkPanelSettings },
      },
      initialState: previewContent || content,
      placeholder,
      onError,
      helpers: {
        openModal,
        closeModal,
        isPreview,
      },
      disabled: pauseMedia,
      anchorTarget,
      relValue,
      customAnchorScroll,
      textAlignment,
      onAtomicBlockFocus,
      experiments,
    };

    const mergedRCProps = merge(strategyProps, _rcProps, ricosPropsToMerge, children.props);

    return [
      ...htmls,
      <RicosModal
        ariaHiddenId={ariaHiddenId}
        isModalSuspended={isPreview()}
        container={container}
        fullscreenProps={fullscreenProps}
        {...mergedRCProps}
        key={'ricosElement'}
        onModalOpen={onModalOpen}
        onModalClose={onModalClose}
        editorCommands={editorCommands}
      >
        {Children.only(React.cloneElement(children, { ...mergedRCProps }))}
      </RicosModal>,
    ];
  }
}
