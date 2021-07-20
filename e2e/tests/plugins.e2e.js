/* eslint-disable max-len */
/*global cy*/
import {
  PLUGIN_COMPONENT,
  PLUGIN_TOOLBAR_BUTTONS,
  DIVIDER_DROPDOWN_OPTIONS,
  STATIC_TOOLBAR_BUTTONS,
  BUTTON_PLUGIN_MODAL,
  INLINE_TOOLBAR_BUTTONS,
  COLLAPSIBLE_LIST_SETTINGS,
  ACTION_BUTTONS,
} from '../cypress/dataHooks';
import { DEFAULT_DESKTOP_BROWSERS, DEFAULT_MOBILE_BROWSERS } from './settings';
import { usePlugins, plugins, usePluginsConfig } from '../cypress/testAppConfig';

const eyesOpen = ({
  test: {
    parent: { title },
  },
}) =>
  cy.eyesOpen({
    appName: 'Plugins',
    testName: title,
    browser: DEFAULT_DESKTOP_BROWSERS,
  });

describe('plugins', () => {
  afterEach(() => cy.matchContentSnapshot());

  context('html', () => {
    before(function() {
      eyesOpen(this);
    });

    beforeEach('load editor', () => {
      cy.switchToDesktop();
    });

    after(() => cy.eyesClose());

    it('render html plugin with url', function() {
      cy.loadRicosEditorAndViewer('empty')
        .addUrl()
        .waitForHtmlToLoad();
      cy.eyesCheckWindow(this.test.title);
    });

    it('render html plugin toolbar', function() {
      cy.loadRicosEditorAndViewer('empty')
        .addHtml()
        .waitForHtmlToLoad();
      cy.get(`[data-hook*=${PLUGIN_TOOLBAR_BUTTONS.EDIT}]`)
        .click({ multiple: true })
        .click();
      cy.eyesCheckWindow(this.test.title);
    });
  });

  context('spoiler', () => {
    before(function() {
      eyesOpen(this);
    });

    beforeEach('load editor', () => {
      cy.switchToDesktop();
    });

    after(() => cy.eyesClose());
    it(`check text spoilers in editor and reveal it in viewer`, () => {
      cy.loadRicosEditorAndViewer('empty', usePlugins(plugins.spoilerPreset)).enterParagraphs([
        'Leverage agile frameworks to provide a robust synopsis for high level overviews.',
        'Iterative approaches to corporate strategy foster collaborative thinking to further the overall value proposition.',
      ]);

      cy.setTextStyle('textSpoilerButton', [15, 5]);
      cy.blurEditor();
      cy.setTextStyle('textSpoilerButton', [30, 10]);
      cy.eyesCheckWindow('adding some spoilers');
      cy.setLink([5, 5], 'https://www.wix.com/');
      cy.setTextStyle('textSpoilerButton', [0, 13]);
      cy.eyesCheckWindow('adding spoiler around link');
      cy.setTextStyle('textSpoilerButton', [20, 10]);
      cy.eyesCheckWindow('apply spoiler on two existing spoilers');
      cy.setTextStyle('textSpoilerButton', [20, 5]);
      cy.eyesCheckWindow('split spoiler');
      cy.setTextStyle('textSpoilerButton', [70, 35]);
      cy.eyesCheckWindow('spoiler on multiple blocks');
      cy.get('[data-hook="spoiler_0"]:first').click();
      cy.eyesCheckWindow('reveal spoiler');
      cy.get('[data-hook="spoiler_3"]:last').click();
      cy.eyesCheckWindow('reveal spoiler on multiple blocks');
    });

    function editText(dataHook, title) {
      cy.get(`[data-hook="${dataHook}"]`)
        .click()
        .type(' - In Plugin Editing')
        .blur();
      cy.eyesCheckWindow(title);
    }

    function revealSpoilerOnBlock() {
      cy.get('[data-hook="revealSpoilerBtn"]').click({ multiple: true });
      cy.eyesCheckWindow('reveal spoiler in viewer');
    }

    it(`check spoilers on an image in editor and reveal it in viewer`, () => {
      cy.loadRicosEditorAndViewer('images', usePlugins(plugins.spoilerPreset));
      cy.get('[data-hook="imageViewer"]:first')
        .parent()
        .click();

      // check spoiler from inline toolbar
      // cy.get(`[data-hook=${PLUGIN_TOOLBAR_BUTTONS.SPOILER}]:visible`).click();

      //check spoiler from settings modal
      cy.clickToolbarButton(PLUGIN_TOOLBAR_BUTTONS.SETTINGS);
      cy.get(`[data-hook=imageSpoilerToggle]`).click();
      cy.get(`[data-hook=${ACTION_BUTTONS.SAVE}]`).click();

      cy.wait(50); //wait for setRef to get width and adjust correct blur
      cy.eyesCheckWindow('adding spoiler on an image');
      editText('spoilerTextArea', 'change the description');
      editText('revealSpoilerContent', 'change the reveal button content');
      revealSpoilerOnBlock();
    });

    it(`check spoilers on a gallery in editor and reveal it in viewer`, () => {
      cy.loadRicosEditorAndViewer('gallery', usePlugins(plugins.spoilerPreset));
      cy.get('[data-hook="galleryViewer"]:first')
        .parent()
        .click();
      cy.get('[data-hook="baseToolbarButton_layout"]').click();
      cy.get('[data-hook="Slideshow_dropdown_option"]').click();
      cy.wait(100);

      // check spoiler from inline toolbar
      // cy.get(`[data-hook=${PLUGIN_TOOLBAR_BUTTONS.SPOILER}]:visible`).click();

      //check spoiler from settings modal
      cy.clickToolbarButton(PLUGIN_TOOLBAR_BUTTONS.ADV_SETTINGS);
      cy.get(`[data-hook=gallerySpoilerToggle]`).click();
      cy.get(`[data-hook=${ACTION_BUTTONS.SAVE}]`).click();
      cy.eyesCheckWindow('adding spoiler on a gallery');
      editText('spoilerTextArea', 'change the description');
      editText('revealSpoilerContent', 'change the reveal button content');
      revealSpoilerOnBlock();
    });

    // it(`check spoilers on a video in editor and reveal it in viewer`, () => {
    //   cy.loadRicosEditorAndViewer('empty', usePlugins(plugins.spoilerPreset));
    //   cy.openVideoUploadModal().addVideoFromURL();
    //   cy.waitForVideoToLoad();
    //   cy.get('[data-hook="videoPlayer"]:first')
    //     .parent()
    //     .click();
    //   cy.get(`[data-hook=${PLUGIN_TOOLBAR_BUTTONS.SPOILER}]:visible`).click();
    //   cy.eyesCheckWindow('adding spoiler on a video');
    //   editText('spoilerTextArea', 'change the description');
    //   editText('revealSpoilerContent', 'change the reveal button content');
    //   revealSpoilerOnBlock();
    // });
  });

  context('divider', () => {
    before(function() {
      eyesOpen(this);
    });

    beforeEach('load editor', () => {
      cy.switchToDesktop();
    });

    after(() => cy.eyesClose());

    it('render plugin toolbar and change styling', () => {
      cy.loadRicosEditorAndViewer('divider')
        .openPluginToolbar(PLUGIN_COMPONENT.DIVIDER)
        .openDropdownMenu();
      cy.eyesCheckWindow('render divider plugin toolbar');

      cy.clickToolbarButton(PLUGIN_TOOLBAR_BUTTONS.SMALL);
      cy.clickToolbarButton(PLUGIN_TOOLBAR_BUTTONS.ALIGN_LEFT);

      cy.get('#RicosEditorContainer [data-hook=divider-double]')
        .parent()
        .click();
      cy.get('[data-hook*="PluginToolbar"]:first');

      cy.clickToolbarButton(PLUGIN_TOOLBAR_BUTTONS.MEDIUM);
      cy.clickToolbarButton(PLUGIN_TOOLBAR_BUTTONS.ALIGN_RIGHT);

      cy.get('#RicosEditorContainer [data-hook=divider-dashed]')
        .parent()
        .click();
      cy.get('[data-hook*="PluginToolbar"]:first').openDropdownMenu(
        `[data-hook=${DIVIDER_DROPDOWN_OPTIONS.DOUBLE}]`
      );
      cy.eyesCheckWindow('change divider styling');
    });
  });

  context('map', () => {
    before('load editor', function() {
      eyesOpen(this);
      cy.switchToDesktop();
      cy.loadRicosEditorAndViewer('map');
      cy.get('.dismissButton').eq(1);
    });

    after(() => cy.eyesClose());

    it('render map plugin toolbar and settings', () => {
      cy.openPluginToolbar(PLUGIN_COMPONENT.MAP);
      cy.eyesCheckWindow('render map plugin toolbar');
      cy.openMapSettings();
      cy.get('.gm-style-cc');
      cy.eyesCheckWindow('render map settings');
    });
  });

  context('file-upload', () => {
    before('load editor', function() {
      eyesOpen(this);
      cy.switchToDesktop();
      cy.loadRicosEditorAndViewer('file-upload');
    });

    after(() => cy.eyesClose());

    it('render file-upload plugin toolbar', function() {
      cy.openPluginToolbar(PLUGIN_COMPONENT.FILE_UPLOAD);
      cy.eyesCheckWindow(this.test.title);
    });
  });

  context('drag and drop', () => {
    before('load editor', function() {
      eyesOpen(this);
      cy.switchToDesktop();
      cy.loadRicosEditorAndViewer('dragAndDrop');
    });

    after(() => cy.eyesClose());

    // eslint-disable-next-line mocha/no-skipped-tests
    it.skip('drag and drop plugins', function() {
      cy.focusEditor();
      const src = `[data-hook=${PLUGIN_COMPONENT.IMAGE}] + [data-hook=componentOverlay]`;
      const dest = `span[data-offset-key="fjkhf-0-0"]`;
      cy.dragAndDropPlugin(src, dest);
      cy.get('img[style="opacity: 1;"]');
      cy.eyesCheckWindow(this.test.title);
    });
  });

  context('alignment', () => {
    before(function() {
      eyesOpen(this);
    });

    beforeEach('load editor', () => {
      cy.switchToDesktop();
    });

    after(() => cy.eyesClose());

    function testAtomicBlockAlignment(align) {
      it('align atomic block ' + align, function() {
        cy.loadRicosEditorAndViewer('images').alignImage(align);
        cy.eyesCheckWindow(this.test.title);
      });
    }

    testAtomicBlockAlignment('left');
    testAtomicBlockAlignment('center');
    testAtomicBlockAlignment('right');
  });

  context('link preview', () => {
    before(function() {
      eyesOpen(this);
    });
    after(() => cy.eyesClose());

    beforeEach('load editor', () =>
      cy.loadRicosEditorAndViewer('link-preview', usePlugins(plugins.embedsPreset))
    );

    afterEach('take snapshot', function() {
      cy.waitForHtmlToLoad();
      cy.triggerLinkPreviewViewerUpdate();
      cy.eyesCheckWindow(this.test.title);
    });

    it('change link preview settings', () => {
      cy.openPluginToolbar(PLUGIN_COMPONENT.LINK_PREVIEW);
      cy.setLinkSettings();
    });
    //TODO: fix this flaky test
    // eslint-disable-next-line mocha/no-skipped-tests
    it('convert link preview to regular link', () => {
      cy.openPluginToolbar(PLUGIN_COMPONENT.LINK_PREVIEW);
      cy.clickToolbarButton('baseToolbarButton_replaceToLink');
    });
    it('backspace key should convert link preview to regular link', () => {
      cy.focusEditor()
        .type('{downarrow}{downarrow}')
        .type('{backspace}');
    });
    it('delete link preview', () => {
      cy.openPluginToolbar(PLUGIN_COMPONENT.LINK_PREVIEW).wait(100);
      cy.clickToolbarButton('blockButton_delete');
    });
  });

  context('convert link to preview', () => {
    context('with default config', () => {
      before(function() {
        eyesOpen(this);
      });
      const testAppConfig = {
        ...usePlugins(plugins.embedsPreset),
        ...usePluginsConfig({
          linkPreview: {
            enableEmbed: undefined,
            enableLinkPreview: undefined,
          },
        }),
      };
      after(() => cy.eyesClose());
      beforeEach('load editor', () => cy.loadRicosEditorAndViewer('empty', testAppConfig));

      it('should create link preview from link after enter key', function() {
        cy.insertLinkAndEnter('www.wix.com');
        cy.eyesCheckWindow(this.test.title);
      });

      it('should embed link that supports embed', function() {
        cy.insertLinkAndEnter('www.mockUrl.com');
        cy.eyesCheckWindow(this.test.title);
      });
    });
    context('with custom config', () => {
      before(function() {
        eyesOpen(this);
      });
      const testAppConfig = {
        ...usePlugins(plugins.embedsPreset),
        ...usePluginsConfig({
          linkPreview: {
            enableEmbed: false,
            enableLinkPreview: false,
          },
        }),
      };
      after(() => cy.eyesClose());
      beforeEach('load editor', () => cy.loadRicosEditorAndViewer('empty', testAppConfig));

      it('should not create link preview when enableLinkPreview is off', function() {
        cy.insertLinkAndEnter('www.wix.com');
        cy.eyesCheckWindow(this.test.title);
      });

      it('should not embed link when enableEmbed is off', function() {
        cy.insertLinkAndEnter('www.mockUrl.com');
        cy.eyesCheckWindow(this.test.title);
      });
    });
  });

  context('social embed', () => {
    before(function() {
      eyesOpen(this);
    });
    const testAppConfig = {
      plugins: [plugins.linkPreview],
    };
    beforeEach('load editor', () => {
      cy.switchToDesktop();
      cy.loadRicosEditorAndViewer('empty', testAppConfig);
    });

    after(() => cy.eyesClose());
    const embedTypes = ['TWITTER', 'INSTAGRAM'];
    embedTypes.forEach(embedType => {
      it(`render ${embedType.toLowerCase()} upload modals`, function() {
        cy.openEmbedModal(STATIC_TOOLBAR_BUTTONS[embedType]);
        cy.eyesCheckWindow(this.test.title + ' modal');
        cy.addSocialEmbed('www.mockUrl.com').waitForHtmlToLoad();
        cy.get(`#RicosViewerContainer [data-hook=HtmlComponent]`);
        cy.eyesCheckWindow(this.test.title + ' added');
      });
    });
  });

  context('list', () => {
    before(function() {
      eyesOpen(this);
    });

    beforeEach('load editor', () => cy.loadRicosEditorAndViewer());

    after(() => cy.eyesClose());

    // TODO: figure out how to test keyboard combinations of command/ctrl keys in cypress ci
    // eslint-disable-next-line mocha/no-skipped-tests
    it.skip('create nested lists using CMD+M/CMD+SHIFT+M', function() {
      cy.loadRicosEditorAndViewer()
        .enterParagraphs(['1. Hey I am an ordered list in depth 1.'])
        .type('{command+m}')
        .enterParagraphs(['\n Hey I am an ordered list in depth 2.'])
        .type('{command+m}')
        .enterParagraphs(['\n Hey I am an ordered list in depth 1.'])
        .type('{command+shift+m}')
        .enterParagraphs(['\n\n1. Hey I am an ordered list in depth 0.']);

      // .enterParagraphs(['\n\n- Hey I am an unordered list in depth 1.'])
      // .tab()
      // .enterParagraphs(['\n Hey I am an unordered list in depth 2.'])
      // .tab()
      // .enterParagraphs(['\n Hey I am an unordered list in depth 1.'])
      // .tab({ shift: true })
      // .enterParagraphs(['\n\n- Hey I am an unordered list in depth 0.']);
      cy.eyesCheckWindow(this.test.title);
    });
  });

  context('verticals embed', () => {
    before(function() {
      eyesOpen(this);
    });
    after(() => cy.eyesClose());

    context('verticals embed modal', () => {
      beforeEach('load editor', () => {
        cy.switchToDesktop();
        cy.loadRicosEditorAndViewer('empty', usePlugins(plugins.verticalEmbed));
      });
      // const embedTypes = ['EVENT', 'PRODUCT', 'BOOKING'];
      const embedTypes = ['PRODUCT'];
      it('render upload modals', function() {
        embedTypes.forEach(embedType => {
          cy.openEmbedModal(STATIC_TOOLBAR_BUTTONS[embedType]);
          cy.get(`[data-hook=verticalsImage]`).eq(3);
          cy.eyesCheckWindow(this.test.title);
          cy.get(`[data-hook*=${ACTION_BUTTONS.CANCEL}][tabindex!=-1]`).click();
        });
      });
    });

    context('verticals embed widget', () => {
      beforeEach('load editor', () => {
        cy.switchToDesktop();
        cy.loadRicosEditorAndViewer('vertical-embed', usePlugins(plugins.verticalEmbed));
      });
      it('should replace widget', () => {
        cy.openPluginToolbar(PLUGIN_COMPONENT.VERTICAL_EMBED);
        cy.clickToolbarButton('baseToolbarButton_replace');
        cy.get(`[data-hook*=verticalsItemsList]`)
          .children()
          .first()
          .click();
        cy.get(`[data-hook=${ACTION_BUTTONS.SAVE}]`).click();
      });
    });
  });

  context('link button', () => {
    before(function() {
      eyesOpen(this);
    });

    beforeEach('load editor', () => cy.loadRicosEditorAndViewer('link-button'));

    after(() => cy.eyesClose());

    //TODO: fix this flaky test
    // eslint-disable-next-line mocha/no-skipped-tests
    // it.skip('create link button & customize it', function() {
    //   cy.openPluginToolbar(PLUGIN_COMPONENT.BUTTON)
    //     .get(`[data-hook*=${PLUGIN_TOOLBAR_BUTTONS.ADV_SETTINGS}][tabindex!=-1]`)
    //     .click()
    //     .get(`[data-hook*=ButtonInputModal][placeholder="Enter a URL"]`)
    //     .type('www.wix.com')
    //     .get(`[data-hook*=${BUTTON_PLUGIN_MODAL.DESIGN_TAB}]`)
    //     .click()
    //     .get(`[data-hook*=${BUTTON_PLUGIN_MODAL.BUTTON_SAMPLE}]`)
    //     .click()
    //     .get(`[data-hook*=${BUTTON_PLUGIN_MODAL.DONE}]`)
    //     .click();
    //   cy.eyesCheckWindow(this.test.title);
    // });
  });

  context('action button', () => {
    before(function() {
      eyesOpen(this);
    });

    beforeEach('load editor', () =>
      cy.loadRicosEditorAndViewer('action-button', usePlugins(plugins.actionButton))
    );

    after(() => cy.eyesClose());
    // it('create action button & customize it', function() {
    //   cy.focusEditor();
    //   cy.openPluginToolbar(PLUGIN_COMPONENT.BUTTON)
    //     .wait(100)
    //     .get(`[data-hook*=${PLUGIN_TOOLBAR_BUTTONS.ADV_SETTINGS}][tabindex!=-1]`)
    //     .click({ force: true })
    //     .wait(100)
    //     .get(`[data-hook*=${BUTTON_PLUGIN_MODAL.DESIGN_TAB}]`)
    //     .click({ force: true })
    //     .wait(100)
    //     .get(`[data-hook*=${BUTTON_PLUGIN_MODAL.BUTTON_SAMPLE}] button`)
    //     .click({ force: true })
    //     .wait(100)
    //     .get(`[data-hook*=${BUTTON_PLUGIN_MODAL.DONE}]`)
    //     .click({ force: true });
    //   cy.eyesCheckWindow(this.test.title);
    // });

    it('create action button & click it', function() {
      const stub = cy.stub();
      cy.on('window:alert', stub);
      cy.get(`[data-hook*=${PLUGIN_COMPONENT.BUTTON}]`)
        .last()
        .click()
        .then(() => {
          expect(stub.getCall(0)).to.be.calledWith('onClick event..');
        });
      cy.eyesCheckWindow(this.test.title);
    });
  });

  context('headings', () => {
    before(function() {
      eyesOpen(this);
    });

    const testAppConfig = {
      ...usePlugins(plugins.headings),
      ...usePluginsConfig({
        headings: {
          customHeadings: ['P', 'H2', 'H3'],
        },
      }),
    };

    function setHeader(number, selection) {
      cy.setTextStyle('headingsDropdownButton', selection)
        .get(`[data-hook=headingsDropdownPanel] > :nth-child(${number})`)
        .click()
        .wait(500);
    }

    function testHeaders(config) {
      cy.loadRicosEditorAndViewer('empty', config).enterParagraphs([
        'Leverage agile frameworks',
        'to provide a robust synopsis for high level overviews.',
      ]);
      setHeader(3, [0, 24]);
      cy.eyesCheckWindow('change heading type');
      setHeader(2, [28, 40]);
      cy.setTextStyle('headingsDropdownButton', [28, 40]);
      cy.eyesCheckWindow('change heading type');
    }

    after(() => cy.eyesClose());

    it('Change headers - with customHeadings config', () => {
      testHeaders(testAppConfig);
    });

    it('Change headers - without customHeadings config', () => {
      testHeaders(usePlugins(plugins.headings));
    });
  });

  context('Headers markdown', () => {
    before(function() {
      cy.eyesOpen({
        appName: 'Headers markdown',
        testName: this.test.parent.title,
        browser: DEFAULT_DESKTOP_BROWSERS,
      });
    });

    beforeEach(() => cy.switchToDesktop());

    after(() => cy.eyesClose());

    it('Should render header-two', function() {
      cy.loadRicosEditorAndViewer()
        .type('{$h')
        .type('2}Header-two{$h')
        .type('}');
      cy.eyesCheckWindow(this.test.title);
    });
  });

  context('Text/Highlight Color - mobile', () => {
    before(function() {
      cy.eyesOpen({
        appName: 'Text/Highlight Color - mobile',
        testName: this.test.parent.title,
        browser: DEFAULT_MOBILE_BROWSERS,
      });
    });
    beforeEach(() => cy.switchToMobile());

    after(() => cy.eyesClose());

    it('allow to color text', function() {
      cy.loadRicosEditorAndViewer()
        .enterParagraphs(['Color.'])
        .setTextColor([0, 5], 'color4');
      cy.eyesCheckWindow(this.test.title);
    });

    it('allow to highlight text', function() {
      cy.loadRicosEditorAndViewer()
        .enterParagraphs(['Highlight.'])
        .setHighlightColor([0, 9], 'color4');
      cy.eyesCheckWindow(this.test.title);
    });
  });

  context('anchor', () => {
    const testAppConfig = {
      ...usePlugins(plugins.all),
      ...usePluginsConfig({
        link: {
          linkTypes: { anchor: true },
        },
      }),
    };

    function selectAnchorAndSave() {
      cy.get(`[data-hook=test-blockKey`).click({ force: true });
      cy.get(`[data-hook=linkPanelContainerDone]`).click();
    }

    // before(function() {
    //   eyesOpen(this);
    // });
    // after(() => cy.eyesClose());

    context('anchor desktop', () => {
      before(function() {
        cy.eyesOpen({
          appName: 'anchor',
          testName: this.test.parent.title,
          browser: DEFAULT_DESKTOP_BROWSERS,
        });
      });
      beforeEach('load editor', () => {
        cy.switchToDesktop();
        cy.loadRicosEditorAndViewer('plugins-for-anchors', testAppConfig);
      });
      after(() => cy.eyesClose());

      it('should create anchor in text', function() {
        cy.setEditorSelection(0, 6);
        cy.wait(500);
        cy.get(`[data-hook=inlineToolbar] [data-hook=${INLINE_TOOLBAR_BUTTONS.LINK}]`).click({
          force: true,
        });
        cy.get(`[data-hook=linkPanelContainer] [data-hook=anchor-radio]`).click();
        cy.wait(1000);
        cy.eyesCheckWindow(this.test.title);
        selectAnchorAndSave();
      });

      it('should create anchor in image', function() {
        cy.openPluginToolbar(PLUGIN_COMPONENT.IMAGE);
        cy.clickToolbarButton(PLUGIN_TOOLBAR_BUTTONS.LINK);
        cy.get(`[data-hook=linkPanelContainer] [data-hook=anchor-radio]`).click();
        cy.wait(1000);
        cy.eyesCheckWindow(this.test.title);
        selectAnchorAndSave();
      });
    });

    context('anchor mobile', () => {
      before(function() {
        cy.eyesOpen({
          appName: 'anchor',
          testName: this.test.parent.title,
          browser: DEFAULT_MOBILE_BROWSERS,
        });
      });
      beforeEach('load editor', () => {
        cy.switchToMobile();
        cy.loadRicosEditorAndViewer('plugins-for-anchors', testAppConfig);
      });
      after(() => cy.eyesClose());

      it('should create anchor in text', function() {
        cy.setEditorSelection(0, 6);
        cy.get(`[data-hook=mobileToolbar] [data-hook=LinkButton]`).click({ force: true });
        cy.get(`[data-hook=linkPanelContainerAnchorTab]`).click({ force: true });
        cy.wait(1000);
        cy.eyesCheckWindow(this.test.title);
        selectAnchorAndSave();
      });

      it('should create anchor in image', function() {
        cy.openPluginToolbar(PLUGIN_COMPONENT.IMAGE);
        cy.clickToolbarButton(PLUGIN_TOOLBAR_BUTTONS.LINK);
        cy.get(`[data-hook=linkPanelContainerAnchorTab]`).click({ force: true });
        cy.wait(1000);
        cy.eyesCheckWindow(this.test.title);
        selectAnchorAndSave();
      });
    });
  });

  context('collapsible list', () => {
    before(function() {
      eyesOpen(this);
    });

    beforeEach('load editor', () => {
      cy.switchToDesktop();
    });

    after(() => cy.eyesClose());

    const setCollapsibleListSetting = setting => {
      cy.clickToolbarButton(PLUGIN_TOOLBAR_BUTTONS.SETTINGS);
      cy.get(`[data-hook=${setting}]`).click();
      cy.get(`[data-hook=${ACTION_BUTTONS.SAVE}]`).click();
    };

    it('should change collapsible list settings', function() {
      cy.loadRicosEditorAndViewer('collapsible-list-rich-text', {
        plugins: [plugins.collapsibleList, plugins.embedsPreset, plugins.textPlugins],
      });
      cy.getCollapsibleList();
      setCollapsibleListSetting(COLLAPSIBLE_LIST_SETTINGS.RTL_DIRECTION);
      cy.eyesCheckWindow(this.test.title);
      setCollapsibleListSetting(COLLAPSIBLE_LIST_SETTINGS.COLLAPSED);
      cy.eyesCheckWindow(this.test.title);
      setCollapsibleListSetting(COLLAPSIBLE_LIST_SETTINGS.EXPANDED);
      cy.eyesCheckWindow(this.test.title);
    });

    it('should focus & type', function() {
      cy.loadRicosEditorAndViewer('empty-collapsible-list', usePlugins(plugins.collapsibleList))
        .focusCollapsibleList(1)
        .type('Yes\n')
        .focusCollapsibleList(2);
      cy.eyesCheckWindow(this.test.title);
    });

    it('should insert image in collapsible list', function() {
      cy.loadRicosEditorAndViewer('empty-collapsible-list', usePlugins(plugins.all))
        .focusCollapsibleList(2)
        .type('Image in collapsible list');
      cy.insertPluginFromSideToolbar('ImagePlugin_InsertButton');
      cy.wait(1000);
      cy.eyesCheckWindow(this.test.title);
    });

    it('should collapse first pair', function() {
      cy.loadRicosEditorAndViewer('empty-collapsible-list', usePlugins(plugins.collapsibleList))
        .getCollapsibleList()
        .toggleCollapseExpand(0);
      cy.eyesCheckWindow(this.test.title);
    });

    it('should have only one expanded pair', function() {
      cy.loadRicosEditorAndViewer(
        'empty-collapsible-list',
        usePlugins(plugins.collapsibleList)
      ).getCollapsibleList();
      setCollapsibleListSetting(COLLAPSIBLE_LIST_SETTINGS.ONE_PAIR_EXPANDED);
      cy.getCollapsibleList().toggleCollapseExpand(1);
      cy.eyesCheckWindow(this.test.title);
    });

    it('should delete second pair', function() {
      cy.loadRicosEditorAndViewer('empty-collapsible-list', usePlugins(plugins.collapsibleList));
      cy.focusCollapsibleList(3).type('{backspace}');
      cy.eyesCheckWindow(this.test.title);
    });
  });
});
