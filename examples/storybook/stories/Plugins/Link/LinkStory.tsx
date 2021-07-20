import React from 'react';
import { MultiSelectLinkViewer, BasicLinkViewer } from './LinkViewer';
import { BasicLinkEditor, BasicLinkEditorWithSettings, MultiSelectLinkEditor } from './LinkEditor';
import viewerSourcecode from '!!raw-loader!./LinkViewer.tsx';
import editorSourcecode from '!!raw-loader!./LinkEditor.tsx';
import {
  RichContentEditorBox,
  RichContentViewerBox,
  ContentState,
  Section,
  Page,
} from '../../Components/StoryParts';
import fixtrue from '../../../../../e2e/tests/fixtures/link.json';

export default () => {
  return (
    <Page title="Link Panel">
      <Section title="Basic Link Panel without checkboxes">
        <Section type={Section.Types.COMPARISON}>
          <RichContentEditorBox sourcecode={editorSourcecode}>
            <BasicLinkEditor content={fixtrue} />
          </RichContentEditorBox>
          <RichContentViewerBox sourcecode={viewerSourcecode}>
            <BasicLinkViewer content={fixtrue} />
          </RichContentViewerBox>
        </Section>
      </Section>
      <Section title="Basic Link Panel">
        <Section type={Section.Types.COMPARISON}>
          <RichContentEditorBox sourcecode={editorSourcecode}>
            <BasicLinkEditorWithSettings content={fixtrue} />
          </RichContentEditorBox>
          <RichContentViewerBox sourcecode={viewerSourcecode}>
            <BasicLinkViewer content={fixtrue} />
          </RichContentViewerBox>
        </Section>
      </Section>
      <Section title="Multi Select Link Panel">
        <Section type={Section.Types.COMPARISON}>
          <RichContentEditorBox sourcecode={editorSourcecode}>
            <MultiSelectLinkEditor content={fixtrue} />
          </RichContentEditorBox>
          <RichContentViewerBox sourcecode={viewerSourcecode}>
            <MultiSelectLinkViewer content={fixtrue} />
          </RichContentViewerBox>
        </Section>
        <Section title="Content State">
          <ContentState json={fixtrue} />
        </Section>
      </Section>
    </Page>
  );
};
