/* eslint-disable new-cap */
/*global cy*/
import {
  TOOLBARS,
  STATIC_TOOLBAR_BUTTONS_WITHOUT_EMBED,
  // STATIC_TOOLBAR_BUTTONS_MEDIA,
  VIDEO_PLUGIN,
  SOUND_CLOUD,
  SOCIAL_EMBED,
  // GIPHY_PLUGIN,
} from '../cypress/dataHooks';
import { DEFAULT_DESKTOP_BROWSERS } from './settings';
import { useUploadConfig } from '../cypress/testAppConfig';

const LINKS = {
  YOUTUBE: 'https://www.youtube.com/watch?v=whbidPR4nVA',
  SOUNDCLOUD: 'https://soundcloud.com/martingarrix/martin-garrix-animals-original',
};

const modalHandler = (INPUT, ADD_BUTTON, LINK) => {
  cy.get(`[data-hook=${INPUT}]`)
    .wait(500)
    .type(LINK);
  cy.get(`[data-hook=${ADD_BUTTON}]`).click();
  cy.waitForVideoToLoad();
};

const additionalCommands = {
  VIDEO: () => {
    cy.wait(500);
    modalHandler(VIDEO_PLUGIN.INPUT, VIDEO_PLUGIN.ADD, LINKS.YOUTUBE);
  },
  SOUND_CLOUD: () => {
    modalHandler(SOUND_CLOUD.INPUT, SOUND_CLOUD.ADD, LINKS.SOUNDCLOUD);
  },
  YOUTUBE: () => {
    modalHandler(SOCIAL_EMBED.INPUT, SOCIAL_EMBED.ADD, LINKS.YOUTUBE);
  },
  CODE_BLOCK: () => {
    cy.moveCursorToEnd(); //DO NOT REMOVE - fix flakiness
  },
  EMOJI: () => {
    cy.get(`[data-hook=emoji-5]:first`)
      .click()
      .enterParagraphs(['.']);
  },
  // GIPHY: () => {
  //   cy.get(`[data-hook=${GIPHY_PLUGIN.UPLOAD_MODAL}]`);
  //   cy.get(`[role=button][tabindex=0]:first`).click();
  // },
  // ADSENSE: () => {},
};

const testInsertPlugin = toolbar => ([plugin, pluginButtonName]) =>
  it(`should insert ${plugin?.toLocaleLowerCase()}`, function() {
    cy.loadRicosEditorAndViewer('empty')
      .wait(500)
      .insertPlugin(toolbar, pluginButtonName);

    additionalCommands[plugin]?.();

    cy.wait(1500);

    cy.eyesCheckWindow(this.test.title);
  });

const testNativeUploadMediaPlugin = toolbar => ([plugin, pluginButtonName]) =>
  it(`should upload native ${plugin?.toLocaleLowerCase()}`, function() {
    const testAppConfig = {
      ...useUploadConfig,
    };
    cy.loadRicosEditorAndViewer('empty', testAppConfig)
      .wait(500)
      .insertPlugin(toolbar, pluginButtonName)
      .then(el => {
        const mockFileList = new DataTransfer();
        const file = new File(['image'], 'native.jpg', { type: 'image/png' });
        mockFileList.items.add(file);
        el[0].files = mockFileList.files;
        el[0].dispatchEvent(
          new Event('change', {
            bubbles: true,
          })
        );
      });

    cy.wait(2000);

    cy.eyesCheckWindow(this.test.title);
  });

const eyesOpen = ({
  test: {
    parent: { title },
  },
}) =>
  cy.eyesOpen({
    appName: 'Insert Plugins',
    testName: title,
    browser: DEFAULT_DESKTOP_BROWSERS,
  });

describe('insert plugins tests', () => {
  before(function() {
    eyesOpen(this);
  });

  beforeEach('load editor', () => {
    cy.switchToDesktop();
  });

  afterEach(() => cy.matchContentSnapshot());

  after(() => cy.eyesClose());

  context('side toolbar', () => {
    Object.entries(STATIC_TOOLBAR_BUTTONS_WITHOUT_EMBED).forEach(testInsertPlugin(TOOLBARS.SIDE));
    // TODO: fix flaky tests
    // Object.entries(STATIC_TOOLBAR_BUTTONS_MEDIA).forEach(
    //   testNativeUploadMediaPlugin(TOOLBARS.SIDE)
    // );
  });

  context('footer toolbar', () => {
    Object.entries(STATIC_TOOLBAR_BUTTONS_WITHOUT_EMBED).forEach(testInsertPlugin(TOOLBARS.FOOTER));
    // TODO: fix flaky tests
    // Object.entries(STATIC_TOOLBAR_BUTTONS_MEDIA).forEach(
    //   testNativeUploadMediaPlugin(TOOLBARS.FOOTER)
    // );
  });
});
