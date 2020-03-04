import React from 'react';
import PropTypes from 'prop-types';
import Styles from '../../../../statics/styles/side-toolbar-panel.scss';
import { getPluginsForTag } from '../../pluginsSearchTags';

const SideToolbarPluginsSection = ({
  theme,
  getEditorState,
  setEditorState,
  structure,
  searchTag,
  t,
}) => {
  const pluginsForTag = searchTag && getPluginsForTag(searchTag, t);
  const plugins = !searchTag
    ? structure
    : structure.filter(({ name }) => pluginsForTag.includes(name));

  if (plugins.length === 0) {
    return (
      <div className={Styles.pluginsSectionEmptyState}>
        {`No blocks found.\n Try another search term.`}
      </div>
    );
  }

  return [
    <div key="basicSection" className={Styles.pluginsSection}>
      Basic
    </div>,
    <div key="pluginsButtons" className={Styles.buttonsWrapper}>
      {plugins.map(({ component: Component, name }, index) => (
        <div key={index} className={Styles.buttonWrapper}>
          <Component
            getEditorState={getEditorState}
            setEditorState={setEditorState}
            theme={theme}
          />
          <div className={Styles.pluginName}>{name}</div>
        </div>
      ))}
    </div>,
  ];
};

SideToolbarPluginsSection.propTypes = {
  getEditorState: PropTypes.func.isRequired,
  setEditorState: PropTypes.func.isRequired,
  structure: PropTypes.array.isRequired,
  theme: PropTypes.object.isRequired,
  t: PropTypes.func,
  searchTag: PropTypes.string,
};

export default SideToolbarPluginsSection;
