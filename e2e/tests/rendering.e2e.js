/*global cy Cypress*/
import { fixtures, fixturesToTestOnSsr } from './constants';
import { DEFAULT_DESKTOP_BROWSERS, DEFAULT_MOBILE_BROWSERS } from '../tests/constants';

const testFixture = fixture =>
  it(`render ${fixture}`, function() {
    cy.loadEditorAndViewer(fixture);
    if (fixture.includes('video')) {
      cy.waitForVideoToLoad();
    }
    cy.eyesCheckWindow(this.test.title);
  });

const testFixtureOnSsr = fixture =>
  it(`render ${fixture} in ssr`, function() {
    cy.loadEditorAndViewerOnSsr(fixture);
    cy.eyesCheckWindow(this.test.title);
  });

describe('editor rendering', () => {
  before(function() {
    if (Cypress.env('MATCH_CONTENT_STATE') && !Cypress.env('debug')) this.skip();
  });

  context('desktop', () => {
    before(function() {
      cy.eyesOpen({
        appName: 'Rendering',
        testName: this.test.parent.title,
        browser: DEFAULT_DESKTOP_BROWSERS,
      });
    });

    beforeEach(() => cy.switchToDesktop());

    after(() => cy.eyesClose());

    fixtures.forEach(testFixture);
  });

  context('mobile', () => {
    before(function() {
      cy.eyesOpen({
        appName: 'Rendering',
        testName: this.test.parent.title,
        browser: DEFAULT_MOBILE_BROWSERS,
      });
    });

    beforeEach(() => cy.switchToMobile());

    after(() => cy.eyesClose());

    fixtures.forEach(testFixture);
  });

  context('ssr', () => {
    before(function() {
      cy.eyesOpen({
        appName: 'Rendering',
        testName: this.test.parent.title,
        browser: DEFAULT_MOBILE_BROWSERS,
      });
    });

    beforeEach(() => cy.switchToDesktop());

    after(() => cy.eyesClose());

    fixturesToTestOnSsr.forEach(testFixtureOnSsr);
  });
});
