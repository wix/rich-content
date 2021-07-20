import React from 'react';
import { isSSR } from '../index';
import { DraftDecorator } from 'draft-js';

function isInEditor(contentBlock) {
  return contentBlock.toJS; //check if immutable to determine if editor or viewer
}

function getTextAlignment(contentBlock) {
  return isInEditor(contentBlock)
    ? contentBlock.getData().get('textAlignment')
    : contentBlock?.data?.textAlignment;
}

function getEntityAt(i, block) {
  return isInEditor(block)
    ? block.getEntityAt(i)
    : block.entityRanges.find(({ offset, length }) => i > offset && i < offset + length)?.key;
}

function getEntityType(block, contentState, entityKey) {
  return isInEditor(block)
    ? entityKey !== null && contentState.getEntity(entityKey).getType()
    : contentState.entityMap[entityKey]?.type;
}

function isLinkType(type) {
  return type === 'LINK' || type === 'ricos-plugin-custom-link';
}

function isInLink(i, block, contentState) {
  const entityKey = getEntityAt(i, block);
  const type = getEntityType(block, contentState, entityKey);
  return isLinkType(type);
}

function isChrome() {
  return !isSSR() && !!window.chrome;
}

export default function createJustificationFixDecorator(): DraftDecorator {
  const isTextJustified = contentBlock => getTextAlignment(contentBlock) === 'justify';
  const strategy = (contentBlock, callback, contentState) => {
    if (!isSSR() && !isChrome() && isTextJustified(contentBlock)) {
      const regex = /\s[^\s]/g;
      const str = contentBlock.getText();
      let match;
      // eslint-disable-next-line fp/no-loops
      while ((match = regex.exec(str)) !== null) {
        if (!isInLink(match.index, contentBlock, contentState)) {
          callback(match.index, match.index + 1);
        }
      }
    }
  };

  const component = props => <span style={{ whiteSpace: 'normal' }}>{props.children}</span>;
  return { strategy, component };
}

declare global {
  interface Window {
    chrome: unknown;
  }
}
