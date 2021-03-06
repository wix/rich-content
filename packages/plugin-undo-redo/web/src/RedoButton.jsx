import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import redoIcon from './icons/RedoIcon';
import { InlineToolbarButton, redo } from 'wix-rich-content-editor-common';
import { UNDO_REDO_TYPE } from './types';

const RedoButton = props => {
  const {
    isMobile,
    theme = {},
    helpers,
    children,
    className,
    config,
    tabIndex,
    t,
    getEditorState,
    setEditorState,
  } = props;
  const editorState = getEditorState();
  const combinedClassName = classNames(theme.redo, className);
  const icon = config?.toolbar?.icons?.Redo || redoIcon();
  const disabled = editorState?.getRedoStack()?.isEmpty?.() || !editorState;

  const onClick = event => {
    event.stopPropagation();
    setEditorState(redo(getEditorState()));
  };

  if (isMobile) {
    return (
      <InlineToolbarButton
        disabled={disabled}
        onClick={onClick}
        isActive={false}
        theme={theme}
        helpers={helpers}
        isMobile={isMobile}
        tooltipText={t('RedoButton_Tooltip')}
        dataHook={'redoButton'}
        tabindex={tabIndex}
        pluginType={UNDO_REDO_TYPE}
        icon={redoIcon}
      >
        {children}
      </InlineToolbarButton>
    );
  } else
    return (
      <button
        tabIndex={tabIndex}
        disabled={disabled}
        onClick={onClick}
        className={combinedClassName}
      >
        {isMobile && icon}
        {children}
      </button>
    );
};

RedoButton.propTypes = {
  children: PropTypes.node,
  theme: PropTypes.any,
  helpers: PropTypes.object,
  setEditorState: PropTypes.func,
  isMobile: PropTypes.bool,
  className: PropTypes.string,
  config: PropTypes.object,
  tabIndex: PropTypes.number,
  t: PropTypes.func,
  getEditorState: PropTypes.func,
};

export default RedoButton;
