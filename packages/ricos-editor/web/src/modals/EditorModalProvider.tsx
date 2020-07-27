import React, { Children, Component, Fragment, ReactElement, Suspense } from 'react';
import mergeModalStyles from './mergeModalStyles';
import { ModalStyles } from 'wix-rich-content-common';
import { ModalsMap, ModalSettings, RichContentProps } from '../index';

interface Props {
  children: ReactElement;
  ModalsMap: ModalsMap;
  theme: Record<string, unknown>;
  locale: string;
  parentClass?: string;
  ariaHiddenId?: ModalSettings['ariaHiddenId'];
}

interface State {
  showModal: boolean;
  modalProps?: {
    onRequestClose: ReactModal.Props['onRequestClose'];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [propName: string]: any;
  };
  modalStyles?: ModalStyles;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  EditorModal?: any;
}

export default class EditorModalProvider extends Component<Props, State> {
  childProps: RichContentProps;

  constructor(props: Props) {
    super(props);
    this.state = {
      showModal: false,
    };
    this.childProps = {
      ...props.children.props,
      helpers: {
        ...props.children.props.helpers,
        openModal: this.openModal,
        closeModal: this.closeModal,
      },
    };
  }

  componentDidMount() {
    this.loadEditorModalAfterLocaleResourceIsLoadedToPreventRemountHackFromBreakingModal();
  }

  loadEditorModalAfterLocaleResourceIsLoadedToPreventRemountHackFromBreakingModal() {
    const { locale, localeResource } = this.props.children.props;
    if (locale === 'en' || localeResource) {
      const EditorModal = React.lazy(() =>
        import(/* webpackChunkName: "RicosEditorModal"  */ './EditorModal')
      );
      this.setState({ EditorModal });
    }
  }

  openModal = data => {
    const { modalStyles, ...modalProps } = data;
    modalStyles.overlay.position = 'fixed';
    this.setState({
      showModal: true,
      modalProps,
      modalStyles,
    });
  };

  closeModal = () => {
    this.setState({
      showModal: false,
      modalProps: undefined,
      modalStyles: undefined,
    });
  };

  render() {
    const { EditorModal, showModal, modalProps, modalStyles } = this.state;
    const { children, ModalsMap, locale, theme, ariaHiddenId, parentClass } = this.props;
    const modalContainerId = `EditorModal-${parentClass || 'container'}`;
    return (
      <Fragment>
        {Children.only(React.cloneElement(children, { ...this.childProps }))}
        {modalContainerId && <div id={modalContainerId} />}
        {EditorModal && (
          <Suspense fallback={<div />}>
            <EditorModal
              ariaHiddenId={ariaHiddenId}
              dataHook={'RicosEditorModal'}
              contentLabel={'RicosModal'}
              isOpen={showModal}
              style={mergeModalStyles(modalStyles, theme)}
              role="dialog"
              onRequestClose={modalProps?.onRequestClose || this.closeModal}
              modalsMap={ModalsMap}
              locale={locale}
              target={modalContainerId}
              {...modalProps}
            />
          </Suspense>
        )}
      </Fragment>
    );
  }
}
