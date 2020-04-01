import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Styles from '../../../../statics/styles/side-toolbar-panel.scss';
import { TextSearchInput } from 'wix-rich-content-editor-common';
import SideToolbarPluginsSection from './SideToolbarPluginsSection';
import classNames from 'classnames';

export default class SideToolbarPanelContent extends Component {
  render() {
    const {
      theme,
      getEditorState,
      setEditorState,
      structure,
      hidePopup,
      t,
      options = {},
    } = this.props;
    const setSearchTag = searchTag => this.setState({ searchTag });
    const { showSearch, splitToSections } = options;
    return (
      <div
        className={classNames(Styles.sideToolbarPanelWrapper, {
          [Styles.panelWithSearch]: showSearch,
        })}
      >
        {showSearch && (
          <div className={Styles.searchWrapper}>
            <TextSearchInput
              onClose={hidePopup}
              placeHolder={'Search for a block'}
              theme={theme}
              setSearchTag={setSearchTag}
            />
          </div>
        )}

        <div className={classNames(Styles.pluginsWrapper, { [Styles.withSearch]: showSearch })}>
          <SideToolbarPluginsSection
            theme={theme}
            getEditorState={getEditorState}
            setEditorState={setEditorState}
            structure={structure}
            searchTag={this.state?.searchTag}
            t={t}
            hidePopup={hidePopup}
            splitToSections={splitToSections}
          />
        </div>
      </div>
    );
  }
}

SideToolbarPanelContent.propTypes = {
  getEditorState: PropTypes.func.isRequired,
  setEditorState: PropTypes.func.isRequired,
  structure: PropTypes.array.isRequired,
  theme: PropTypes.object.isRequired,
  t: PropTypes.func,
  hidePopup: PropTypes.func,
  options: PropTypes.object,
};
