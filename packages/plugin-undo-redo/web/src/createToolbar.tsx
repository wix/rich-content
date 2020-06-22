import createInsertButtons from './insert-buttons';
import UndoButton from './UndoButton';
import RedoButton from './RedoButton';
import React from 'react';

export default function createToolbar({ helpers, t, isMobile, settings }) {
  const TextButtonMapper = (pubsub: Pubsub) =>
    isMobile
      ? {
          Undo: {
            component: props => <UndoButton pubsub={pubsub} t={t} {...props} />,
            isMobile: true,
          },
          Redo: {
            component: props => <RedoButton pubsub={pubsub} t={t} {...props} />,
            isMobile: true,
          },
        }
      : {};
  return {
    TextButtonMapper,
    InsertButtons: createInsertButtons({
      helpers,
      t,
      settings,
      UndoButton,
      RedoButton,
    }),
    name: 'undo-redo',
  };
}
