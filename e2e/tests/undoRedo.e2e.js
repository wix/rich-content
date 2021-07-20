/* eslint-disable max-len */
/*global cy*/
import { IMAGE_SETTINGS, PLUGIN_COMPONENT, STATIC_TOOLBAR_BUTTONS } from '../cypress/dataHooks';
import { DEFAULT_DESKTOP_BROWSERS } from './settings';
import { usePlugins, plugins, useExperiments } from '../cypress/testAppConfig';

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
  context('undo redo', () => {
    before(function() {
      eyesOpen(this);
    });

    beforeEach('load editor', () => {
      cy.switchToDesktop();
    });

    after(() => cy.eyesClose());

    it('should undo and redo image plugin customizations', function() {
      cy.loadRicosEditorAndViewer(
        'empty',
        useExperiments({ UseUndoForPlugins: { enabled: true } })
      );
      cy.clickOnStaticButton(STATIC_TOOLBAR_BUTTONS.IMAGE, { force: true });
      cy.wait(500);
      cy.enterText('testing undo redo for plugins');
      cy.openPluginToolbar(PLUGIN_COMPONENT.IMAGE);
      cy.openSettings();
      cy.get(`[data-hook=${IMAGE_SETTINGS.PREVIEW}]:first`);
      cy.addImageTitle();
      cy.undo();
      cy.get('div').should('not.have.text', 'Title');
      cy.undo();
      cy.get('span').should('not.have.text', 'testing undo redo for plugins');
      cy.undo();
      cy.get(`[data-hook=${PLUGIN_COMPONENT.IMAGE}]:first`).should('not.exist');
      cy.redo();
      cy.get(`[data-hook=${PLUGIN_COMPONENT.IMAGE}]:first`).should('exist');
      cy.redo();
      cy.get('.public-DraftStyleDefault-block > span').should(
        'have.text',
        'testing undo redo for plugins'
      );
      cy.redo();
      cy.get('textarea').should('have.value', 'Title');
      cy.eyesCheckWindow(this.test.title);
    });

    it('should undo and redo collapsible list plugin customizations', function() {
      cy.loadRicosEditorAndViewer('empty', {
        ...useExperiments({ UseUndoForPlugins: { enabled: true } }),
        ...usePlugins(plugins.all),
      });
      cy.clickOnStaticButton(STATIC_TOOLBAR_BUTTONS.COLLAPSIBLE_LIST, { force: true });
      cy.focusCollapsibleList(0).type('Yes ');
      cy.addCollapsibleListPair();
      cy.focusCollapsibleList(1).insertPluginFromSideToolbar('ImagePlugin_InsertButton');
      cy.wait(1000);
      cy.undo();
      cy.get(`[data-hook=${PLUGIN_COMPONENT.IMAGE}]:first`).should('not.exist');
      cy.undo();
      cy.get(`[data-rbd-draggable-context-id=${0}]`)
        .eq(1)
        .should('not.exist');
      cy.wait(100);
      cy.undo().undo();
      cy.get('.public-DraftStyleDefault-block > span').should('have.text', 'Ye');
      cy.undo();
      cy.get('.public-DraftStyleDefault-block > span').should('have.text', 'Y');
      cy.undo();
      cy.get('.public-DraftStyleDefault-block > span').should('not.have.text', 'Yes');
      cy.undo();
      cy.get(`[data-hook=${PLUGIN_COMPONENT.COLLAPSIBLE_LIST}]:first`).should('not.exist');
      cy.redo();
      cy.get(`[data-hook=${PLUGIN_COMPONENT.COLLAPSIBLE_LIST}]:first`).should('exist');
      cy.redo();
      cy.get('.public-DraftStyleDefault-block > span').should('have.text', 'Y');
      cy.redo();
      cy.get('.public-DraftStyleDefault-block > span').should('have.text', 'Ye');
      cy.redo();
      cy.get('.public-DraftStyleDefault-block > span').should('have.text', 'Yes');
      cy.redo().redo();
      cy.get(`[data-rbd-draggable-context-id=${1}]`)
        .eq(1)
        .should('exist');
      cy.redo();
      cy.get(`[data-hook=${PLUGIN_COMPONENT.IMAGE}]:first`).should('exist');
      cy.eyesCheckWindow(this.test.title);
    });

    it('should undo and redo table plugin customizations', function() {
      cy.loadRicosEditorAndViewer('empty', {
        ...useExperiments({ UseUndoForPlugins: { enabled: true } }),
        ...usePlugins(plugins.all),
      });
      cy.openTableModal();
      cy.addTableFromModal(2, 2);
      cy.focusTable();
      cy.editCell(0, 'wow');
      cy.clickOnAddRow();
      cy.clickOnAddCol();
      cy.focusTable();
      cy.clickOnRowDrag(0);
      cy.paintBG();
      cy.goToTextStyle();
      cy.paintTableTextColor();
      cy.paintTableHighlightColor();
      cy.undo();
      cy.undo();
      cy.undo();
      cy.undo();
      cy.get(`[data-hook*=colDrag-${2}]`).should('not.exist');
      cy.undo();
      cy.undo();
      cy.get(`[data-hook*=rowDrag-${2}]`).should('not.exist');
      cy.undo();
      cy.undo();
      cy.get('.public-DraftStyleDefault-block > span').should('not.have.text');
      cy.undo();
      cy.get(`[data-hook=${PLUGIN_COMPONENT.TABLE}]:first`).should('not.exist');
      cy.redo();
      cy.get(`[data-hook=${PLUGIN_COMPONENT.TABLE}]:first`).should('exist');
      cy.redo();
      cy.redo();
      cy.redo();
      cy.redo();
      cy.redo();
      cy.get(`[data-hook*=rowDrag-${2}]`).should('exist');
      cy.get(`[data-hook*=colDrag-${2}]`).should('exist');
      cy.redo();
      cy.redo();
      cy.redo();
      cy.eyesCheckWindow(this.test.title);
    });
  });
});
