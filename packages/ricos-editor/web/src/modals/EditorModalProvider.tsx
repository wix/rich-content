import React, {
  Children,
  Component,
  ReactElement,
  Suspense,
  Fragment,
  FunctionComponent,
} from 'react';
import mergeModalStyles from './mergeModalStyles';
import { ModalStyles, ModalsMap } from 'wix-rich-content-common';
import { ModalSettings } from 'ricos-common';
import { merge } from 'lodash';
import ReactDOM from 'react-dom';

interface Props {
  children: ReactElement;
  ModalsMap: ModalsMap;
  theme: Record<string, unknown>;
  locale: string;
  ariaHiddenId?: ModalSettings['ariaHiddenId'];
  container?: HTMLElement;
  onModalOpen: (modalProps: Record<string, unknown>) => void;
  onModalClose: () => void;
  editorCommands?;
}

type ModalProps = {
  onRequestClose: ReactModal.Props['onRequestClose'];
  modalStyles?: ModalStyles;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [propName: string]: any;
};

interface State {
  showModal: boolean;
  modalProps?: ModalProps;
  modalStyles?: ModalStyles;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  EditorModal?: any;
  editorModalId: string;
}

export default class EditorModalProvider extends Component<Props, State> {
  modalHandlers: { helpers: ModalSettings };

  constructor(props: Props) {
    super(props);
    this.state = {
      showModal: false,
      editorModalId: `EditorModal-${new Date().getTime()}`,
    };
    this.modalHandlers = {
      helpers: {
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

  openModal = (data: ModalProps) => {
    const { modalStyles, ...modalProps } = data;
    this.props.onModalOpen?.(modalProps);
    this.setState({
      showModal: true,
      modalProps,
      modalStyles: merge(modalStyles, { overlay: { position: 'fixed' } }),
    });
  };

  closeModal = () => {
    this.props.onModalClose?.();
    this.setState({
      showModal: false,
      modalProps: undefined,
      modalStyles: undefined,
    });
  };

  render() {
    const { EditorModal, showModal, modalProps, modalStyles, editorModalId } = this.state;
    const {
      children,
      ModalsMap,
      locale,
      theme,
      ariaHiddenId,
      container,
      editorCommands,
    } = this.props;
    const childProps = merge(children.props, this.modalHandlers);
    return (
      <Fragment>
        {Children.only(React.cloneElement(children, childProps))}
        <MaybePortal container={container}>
          <div className="ricos-editor-modal">
            <div id={editorModalId} />
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
                  target={editorModalId}
                  editorCommands={editorCommands}
                  {...modalProps}
                />
              </Suspense>
            )}
          </div>
        </MaybePortal>
      </Fragment>
    );
  }
}

const MaybePortal: FunctionComponent<{
  children: ReactElement;
  container?: HTMLElement;
}> = ({ children, container }) => {
  if (container) {
    return ReactDOM.createPortal(children, container);
  }
  return children;
};
