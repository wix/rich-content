import React, { Component } from 'react';

import { pluginGallery as pluginGalleryViewer } from 'wix-rich-content-plugin-gallery/dist/module.viewer';
import { pluginGallery as pluginGalleryEditor } from 'wix-rich-content-plugin-gallery';
import { RicosEditor } from 'wix-rich-content-wrapper';
import { RicosViewer } from 'wix-rich-content-wrapper/dist/cjs/viewer';

import fixtrue from '../../../../e2e/tests/fixtures/gallery-with-title-and-link.json';

import {
  RichContentEditorBox,
  RichContentViewerBox,
  ContentState,
  Section,
  Page,
} from '../Components/StoryParts';

const fixtrueV5 = { ...fixtrue, VERSION: '5.9.9' };
const fixtrueV6 = { ...fixtrue, VERSION: '6.0.1' };

const editorPlugins = [pluginGalleryEditor()];
const viewerPlugins = [pluginGalleryViewer()];

export default () => {
  class GalleryPlugin extends Component {
    constructor(props) {
      super(props);
      this.state = {};
    }

    render() {
      return (
        <Page title="Gallery Plugin">
          <h3>With v6 contentState</h3>

          <Section type={Section.Types.COMPARISON}>
            <RichContentEditorBox preset="blog-preset">
              <RicosEditor plugins={editorPlugins} contentState={fixtrueV6} />
            </RichContentEditorBox>
            <RichContentViewerBox preset="blog-preset">
              <RicosViewer plugins={viewerPlugins} contentState={fixtrueV6} />
            </RichContentViewerBox>
          </Section>

          <Section title="Content State">
            <ContentState json={fixtrueV6} />
          </Section>

          <h3>With v5 contentState:</h3>
          <Section type={Section.Types.COMPARISON}>
            <RichContentEditorBox preset="blog-preset">
              <RicosEditor plugins={editorPlugins} contentState={fixtrueV5} />
            </RichContentEditorBox>
            <RichContentViewerBox preset="blog-preset">
              <RicosViewer plugins={viewerPlugins} contentState={fixtrueV5} />
            </RichContentViewerBox>
          </Section>
          <Section title="Content State">
            <ContentState json={fixtrueV5} />
          </Section>
        </Page>
      );
    }
  }
  return <GalleryPlugin />;
};
