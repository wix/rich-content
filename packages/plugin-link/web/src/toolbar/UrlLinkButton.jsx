import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { getLinkDataInSelection } from 'wix-rich-content-editor-common';
import styles from '../../statics/link-viewer.scss';
import {
  normalizeUrl,
  mergeStyles,
  anchorScroll,
  getRelValue,
  getTargetValue,
} from 'wix-rich-content-common';

export default class UrlLinkButton extends Component {
  constructor(props) {
    super(props);
    const { theme } = this.props;
    this.styles = mergeStyles({ styles, theme });
  }

  handleClick = event => {
    const { getEditorState, customAnchorScroll } = this.props;
    const linkData = getLinkDataInSelection(getEditorState());
    const { anchor = '' } = linkData || {};
    if (customAnchorScroll) {
      customAnchorScroll(event, anchor);
    } else {
      const nodeListOfAllblocks = document.querySelectorAll(`[data-editor]`);
      const arrayOfAllblocks = Array.apply(null, nodeListOfAllblocks);
      const element = arrayOfAllblocks.find(block => block.dataset.offsetKey === `${anchor}-0-0`);
      anchorScroll(element);
    }
  };

  preventDefault = event => event.preventDefault();

  render() {
    const { styles } = this;
    const { getEditorState, t } = this.props;
    const linkData = getLinkDataInSelection(getEditorState());
    const { url = '', anchor, target, rel } = linkData || {};
    const href = url ? normalizeUrl(url) : undefined;
    const anchorProps = {
      href,
      target: getTargetValue(target),
      rel: getRelValue(rel),
      className: classNames(styles.toolbarUrl, { [styles.toolbarUrlAnchor]: anchor }),
      onMouseDown: this.preventDefault,
      onClick: anchor && this.handleClick,
    };
    return (
      <div className={styles.toolbarUrlContainer}>
        <a {...anchorProps}>{href || t('LinkTo_Toolbar_GoTo')}</a>
      </div>
    );
  }
}

UrlLinkButton.propTypes = {
  getEditorState: PropTypes.func.isRequired,
  theme: PropTypes.object.isRequired,
  customAnchorScroll: PropTypes.func,
  settings: PropTypes.object,
  t: PropTypes.func,
};
