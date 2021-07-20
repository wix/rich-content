import React, { FunctionComponent } from 'react';
import { DraftContent, RicosViewer } from 'ricos-viewer';
import { pluginLink } from 'wix-rich-content-plugin-link';

const linkConfigWithAnchor = {
  linkTypes: { anchor: true },
};

const linkConfig = {
  linkTypes: { anchor: false },
};

const BasicLinkViewer: FunctionComponent<{ content?: DraftContent }> = ({ content }) => (
  <RicosViewer plugins={[pluginLink(linkConfig)]} content={content} />
);
const MultiSelectLinkViewer: FunctionComponent<{ content?: DraftContent }> = ({ content }) => (
  <RicosViewer plugins={[pluginLink(linkConfigWithAnchor)]} content={content} />
);

export { BasicLinkViewer, MultiSelectLinkViewer };
