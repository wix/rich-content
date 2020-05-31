/* eslint-disable react/prop-types */
import React, { Fragment, ComponentType, Children, FunctionComponent } from 'react';
import { EngineProps } from '../RicosEngine';
import FullscreenProvider from './fullscreen/FullscreenProvider';

const RicosModal: FunctionComponent<EngineProps> = props => {
  let ModalProvider: ComponentType = Fragment;
  const {
    children: {
      props: { helpers = {} },
    },
  } = props;
  const { onExpand } = helpers;

  if (!onExpand) {
    ModalProvider = FullscreenProvider;
  }

  const child = Children.only(React.cloneElement(props.children, { ...props }));
  return <ModalProvider {...props}>{child}</ModalProvider>;
};

export default RicosModal;
