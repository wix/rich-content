import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Styles from '../../../../statics/styles/side-toolbar-panel.scss';
import { getPluginsForTag } from '../../pluginsSearchTags';
import { getSortedSections } from './utils';
import classNames from 'classnames';
import { mergeStyles } from 'wix-rich-content-common';

const PluginMenuPluginsSection = ({
  getEditorState,
  setEditorState,
  plugins,
  searchTag,
  t,
  hidePopup,
  splitToSections,
  horizontalMenu,
  smallPlusIcon,
  pluginMenuButtonRef,
  toolbarName,
  theme = {},
  isMobile,
  searchablePlugins,
}) => {
  const styles = mergeStyles({ styles: Styles, theme });
  const pluginsForTag = searchTag && getPluginsForTag(searchTag.toLowerCase(), t);
  const filteredPluginsBySearchTag = (pluginsArray = []) =>
    pluginsArray.filter(({ name }) => pluginsForTag.includes(name));
  const pluginsToDisplay = !searchTag
    ? plugins
    : filteredPluginsBySearchTag(searchablePlugins || plugins);

  if (pluginsToDisplay.length === 0) {
    return (
      <div className={styles.pluginsSectionEmptyState}>{t('BlockToolbar_Search_EmptyState')}</div>
    );
  }

  function PluginsSection({ section }) {
    const [isSectionVisible, setIsSectionVisible] = useState(false);
    const pluginsToRender = section
      ? pluginsToDisplay.filter(
          ({ section: pluginSection = 'BlockToolbar_Section_Basic' }) => pluginSection === section
        )
      : pluginsToDisplay;
    return (
      <div className={classNames(styles.section, horizontalMenu && styles.horizontalMenu)}>
        {isSectionVisible && section && <div className={styles.pluginsSection}>{t(section)}</div>}
        <div className={classNames(styles.buttonsWrapper, horizontalMenu && styles.horizontalMenu)}>
          {pluginsToRender.map(({ component: Component }, index) => (
            <Component
              key={index}
              className={classNames(
                styles.buttonWrapper,
                horizontalMenu && styles.horizontalMenu,
                smallPlusIcon && styles.smallPlusIcon
              )}
              onButtonVisible={() => !isSectionVisible && setIsSectionVisible(true)}
              pluginMenuButtonRef={pluginMenuButtonRef}
              getEditorState={getEditorState}
              setEditorState={setEditorState}
              showName={!horizontalMenu}
              sideToolbar
              toolbarName={toolbarName}
              hidePopup={hidePopup}
              theme={theme}
              closePluginMenu={hidePopup}
            />
          ))}
        </div>
      </div>
    );
  }

  PluginsSection.propTypes = {
    section: PropTypes.any,
  };

  const sections = [];
  splitToSections &&
    pluginsToDisplay.forEach(
      ({ section = 'BlockToolbar_Section_Basic' }) =>
        !sections.includes(section) && sections.push(section)
    );

  return sections.length > 0 ? (
    getSortedSections(sections).map(section => <PluginsSection section={section} key={section} />)
  ) : (
    <PluginsSection />
  );
};

PluginMenuPluginsSection.propTypes = {
  getEditorState: PropTypes.func.isRequired,
  hidePopup: PropTypes.func,
  horizontalMenu: PropTypes.bool,
  smallPlusIcon: PropTypes.bool,
  isMobile: PropTypes.any,
  pluginMenuButtonRef: PropTypes.any,
  plugins: PropTypes.array.isRequired,
  searchTag: PropTypes.string,
  searchablePlugins: PropTypes.array,
  setEditorState: PropTypes.func.isRequired,
  splitToSections: PropTypes.bool,
  t: PropTypes.func,
  theme: PropTypes.object,
  toolbarName: PropTypes.any,
};

export default PluginMenuPluginsSection;
