import React, { FunctionComponent } from 'react';
import { DraftContent, RicosEditor } from 'ricos-editor';
import { pluginLink } from 'wix-rich-content-plugin-Link';

const linkConfig = {
  linkTypes: { anchor: false },
};

const linkPanelSettings = {
  showNewTabCheckbox: true,
  showNoFollowCheckbox: true,
  showSponsoredCheckbox: true,
};

const BasicLinkEditor: FunctionComponent<{ content?: DraftContent }> = ({ content }) => (
  <RicosEditor plugins={[pluginLink(linkConfig)]} content={content} />
);

const BasicLinkEditorWithSettings: FunctionComponent<{ content?: DraftContent }> = ({
  content,
}) => (
  <RicosEditor
    plugins={[pluginLink(linkConfig)]}
    linkPanelSettings={linkPanelSettings}
    content={content}
  />
);

const MultiSelectLinkEditor: FunctionComponent<{ content?: DraftContent }> = ({ content }) => (
  <RicosEditor plugins={[pluginLink()]} linkPanelSettings={linkPanelSettings} content={content} />
);

export { BasicLinkEditor, BasicLinkEditorWithSettings, MultiSelectLinkEditor };
