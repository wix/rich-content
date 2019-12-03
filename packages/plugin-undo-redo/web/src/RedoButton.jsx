import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { EditorState } from 'draft-js';
import clsx from 'clsx';
import { get } from 'lodash';
import redoIcon from './icons/RedoIcon';

class RedoButton extends Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
    theme: PropTypes.any,
    setEditorState: PropTypes.func,
    isMobile: PropTypes.bool,
    className: PropTypes.string,
    pubsub: PropTypes.object,
    config: PropTypes.object,
  };

  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    this.props.pubsub.subscribe('editorState', this.onEditorStateChange);
  }

  componentWillUnMount() {
    this.props.pubsub.unsubscribe('editorState', this.onEditorStateChange);
  }

  onEditorStateChange = editorState => {
    this.setState({ editorState });
  };

  onClick = event => {
    event.stopPropagation();
    this.props.setEditorState(EditorState.redo(this.state.editorState));
  };

  render() {
    const { editorState } = this.state;
    const { isMobile, theme = {}, children, className, config } = this.props;
    const combinedClassName = clsx(theme.redo, className);
    const icon = get(config, 'toolbar.icons.Redo', redoIcon());

    return (
      <button
        disabled={editorState?.getRedoStack().isEmpty()}
        type="button"
        onClick={this.onClick}
        className={combinedClassName}
      >
        {isMobile && icon}
        {children}
      </button>
    );
  }
}
export default RedoButton;
