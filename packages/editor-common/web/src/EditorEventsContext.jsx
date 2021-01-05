import React from 'react';
import PropTypes from 'prop-types';
import { remove } from 'lodash';

export const EditorEvents = {
  PUBLISH: 'rce:publish',
};

export const EditorEventsContext = React.createContext({
  subscribe() {},
  unsubscribe() {},
  dispatch() {},
  publish() {},
});

export const WithEditorEventsProps = {
  editorEvents: PropTypes.shape({
    subscribe: PropTypes.func,
    unsubscribe: PropTypes.func,
    dispatch: PropTypes.func,
    publish: PropTypes.func,
  }),
};

export const withEditorEvents = WrappedComponent => props => (
  <EditorEventsContext.Consumer>
    {contextValue => <WrappedComponent editorEvents={contextValue} {...props} />}
  </EditorEventsContext.Consumer>
);

export class EditorEventsProvider extends React.Component {
  static propTypes = {
    children: PropTypes.node,
  };

  state = {
    subscribe: this.subscribe.bind(this),
    unsubscribe: this.unsubscribe.bind(this),
    dispatch: this.dispatch.bind(this),
    publish: this.publish.bind(this),
  };

  events = {};

  async dispatch(event, data) {
    const callbacks = this.events[event] || [];
    return Promise.all(callbacks.map(cb => cb(data)));
  }

  async publish() {
    const publishResponse = await this.dispatch(EditorEvents.PUBLISH);
    const editorResponse = publishResponse.filter(({ type } = {}) => type === 'EDITOR_PUBLISH')[0];
    return editorResponse?.data;
  }

  subscribe(event, cb) {
    this.events[event] = this.events[event] || [];
    this.events[event].push(cb);

    return () => this.unsubscribe(event, cb);
  }

  unsubscribe(event, cb) {
    remove(this.events[event], callback => callback === cb);
  }

  render() {
    const { children } = this.props;

    return (
      <EditorEventsContext.Provider value={this.state}>{children}</EditorEventsContext.Provider>
    );
  }
}
