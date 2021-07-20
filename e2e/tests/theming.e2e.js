/*global cy*/
import { useTheming, getPluginMenuConfig, usePlugins, plugins } from '../cypress/testAppConfig';

import { DEFAULT_DESKTOP_BROWSERS, DEFAULT_MOBILE_BROWSERS } from './settings';

function testFlow(isDesktop, title) {
  if (isDesktop) {
    cy.setEditorSelection(111, 7);
    cy.wait(200);
    cy.eyesCheckWindow(title + ' (formatting selection)');

    cy.setEditorSelection(171, 14);
    cy.wait(200);
    cy.eyesCheckWindow(title + ' (link selection)');
  }
}

function tests({ isDesktop }) {
  it('no palette, no cssOverride', function() {
    cy.loadRicosEditorAndViewer(
      'storybook-example-app',
      useTheming({ skipCssOverride: true }),
      usePlugins(plugins.all),
      getPluginMenuConfig()
    ).focusEditor();
    cy.wait(2000);
    cy.eyesCheckWindow(this.test.title);
    testFlow(isDesktop, this.test.title);
  });

  it('no palette, cssOverride', function() {
    cy.loadRicosEditorAndViewer('storybook-example-app', usePlugins(plugins.all)).focusEditor();
    cy.wait(2000);
    cy.eyesCheckWindow(this.test.title);
    testFlow(isDesktop, this.test.title);
  });

  it('palette, no cssOverride', function() {
    cy.loadRicosEditorAndViewer(
      'storybook-example-app',
      usePlugins(plugins.all),
      useTheming({
        skipCssOverride: true,
        paletteType: 'light',
      })
    ).focusEditor();
    cy.wait(2000);
    cy.eyesCheckWindow(this.test.title);
    testFlow(isDesktop, this.test.title);
  });

  it('palette, cssOverride', function() {
    cy.loadRicosEditorAndViewer(
      'storybook-example-app',
      usePlugins(plugins.all),
      useTheming({ paletteType: 'light' })
    ).focusEditor();
    cy.wait(2000);
    cy.eyesCheckWindow(this.test.title);
    testFlow(isDesktop, this.test.title);
  });

  it('dark palette, no cssOverride', function() {
    cy.loadRicosEditorAndViewer(
      'storybook-example-app',
      usePlugins(plugins.all),
      useTheming({
        skipCssOverride: true,
        paletteType: 'dark',
      })
    ).focusEditor();
    cy.wait(2000);
    cy.eyesCheckWindow(this.test.title);
    testFlow(isDesktop, this.test.title);
  });

  it('dark palette, no cssOverride, no container', function() {
    cy.loadRicosEditorAndViewer(
      'storybook-example-app',
      usePlugins(plugins.all),
      useTheming({
        skipCssOverride: true,
        paletteType: 'dark',
        disableContainer: true,
      })
    ).focusEditor();
    cy.wait(2000);
    cy.eyesCheckWindow(this.test.title);
    testFlow(isDesktop, this.test.title);
  });

  it('dark palette, no cssOverride, no container, contentBgColor', function() {
    cy.loadRicosEditorAndViewer(
      'storybook-example-app',
      usePlugins(plugins.all),
      useTheming({
        skipCssOverride: true,
        paletteType: 'dark',
        disableContainer: true,
        contentBgColor: true,
      })
    ).focusEditor();
    cy.wait(2000);
    cy.eyesCheckWindow(this.test.title);
    testFlow(isDesktop, this.test.title);
  });

  it('dark palette, cssOverride', function() {
    cy.loadRicosEditorAndViewer(
      'storybook-example-app',
      usePlugins(plugins.all),
      useTheming({ paletteType: 'dark' })
    ).focusEditor();
    cy.wait(2000);
    cy.eyesCheckWindow(this.test.title);
    testFlow(isDesktop, this.test.title);
  });

  it('dark palette, no cssOverride, fallbackColor=red', function() {
    cy.loadRicosEditorAndViewer(
      'storybook-example-app',
      usePlugins(plugins.all),
      useTheming({ paletteType: 'dark', skipCssOverride: true, fallbackColor: '%23FF0000' })
    ).focusEditor();
    cy.wait(2000);
    cy.eyesCheckWindow(this.test.title);
    testFlow(isDesktop, this.test.title);
  });

  it('dark palette, no cssOverride, settingsActionColor=blue', function() {
    cy.loadRicosEditorAndViewer(
      'storybook-example-app',
      usePlugins(plugins.all),
      useTheming({
        paletteType: 'dark',
        skipCssOverride: true,
        settingsActionColor: '%233899EC',
        focusActionColor: '%233899EC',
      })
    ).focusEditor();
    cy.wait(2000);
    cy.eyesCheckWindow(this.test.title);
    testFlow(isDesktop, this.test.title);
  });

  it('customStyles', function() {
    cy.loadRicosEditorAndViewer(
      'storybook-example-app',
      usePlugins(plugins.all),
      useTheming({ useCustomStyles: true, skipCssOverride: true })
    ).focusEditor();
    cy.wait(2000);
    cy.eyesCheckWindow(this.test.title);
    testFlow(isDesktop, this.test.title);
  });
}

describe('Theming', () => {
  afterEach(() => cy.matchContentSnapshot());

  context('desktop', () => {
    before(function() {
      cy.eyesOpen({
        appName: 'Theming',
        testName: this.test.parent.title,
        browser: DEFAULT_DESKTOP_BROWSERS,
      });
    });

    beforeEach(() => cy.switchToDesktop());

    after(() => cy.eyesClose());

    tests({ isDesktop: true });
  });

  context('mobile', () => {
    before(function() {
      cy.eyesOpen({
        appName: 'Theming',
        testName: this.test.parent.title,
        browser: DEFAULT_MOBILE_BROWSERS,
      });
    });

    beforeEach(() => cy.switchToMobile());

    after(() => cy.eyesClose());

    tests({});
  });
});
