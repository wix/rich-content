/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { ReactElement, Suspense } from 'react';
import { getTooltipStyles } from './tooltipStyles';
import { GlobalContext } from '../src/Utils/contexts';

declare global {
  interface Window {
    richContentHideTooltips: boolean;
  }
}

interface Props {
  content: string;
  tooltipOffset?: { x: number; y: number };
  children: ReactElement;
  isError?: boolean;
  place?: 'top' | 'bottom' | 'left' | 'right';
  followMouse?: boolean;
  hideArrow?: boolean;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const lazyWithPreload = (factory: () => Promise<any>) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const Component: any = React.lazy(factory);
  Component.preload = factory;
  return Component;
};

const ToolTipComponent = lazyWithPreload(() => import('react-portal-tooltip'));

class Tooltip extends React.Component<Props> {
  static defaultProps = {
    isError: false,
    place: 'top',
    tooltipOffset: { x: 0, y: 0 },
  };

  disabled = false;

  mousePosition: { x: number; y: number } = { x: 0, y: 0 };

  timeoutId!: NodeJS.Timeout;

  state = {
    tooltipVisible: false,
  };

  static contextType = GlobalContext;

  componentDidUpdate() {
    this.disabled = window.richContentHideTooltips; //used to hide tooltips in tests
  }

  componentWillUnmount() {
    clearTimeout(this.timeoutId);
  }

  showTooltip = (e: MouseEvent) => {
    ToolTipComponent.preload();
    if (!(e.target as HTMLButtonElement).disabled) {
      this.mousePosition = { x: e.clientX, y: e.clientY };

      this.timeoutId = setTimeout(() => {
        this.setState({ tooltipVisible: true }, () => {
          this.forceUpdate();
          setTimeout(() => this.props.followMouse && this.updateTooltipPosition());
        });
      }, 300);
    }
  };

  onMouseMove = (e: MouseEvent) => {
    if (this.props.followMouse) {
      this.mousePosition = { x: e.clientX, y: e.clientY };
      this.updateTooltipPosition();
    }
  };

  updateTooltipPosition = () => {
    const { x, y } = this.mousePosition;
    const element = document.querySelector<HTMLElement>('.ToolTipPortal > div');
    if (element) {
      const { offsetWidth: width, offsetHeight: height } = element;
      element.style.left = `${x - width / 2}px`;
      element.style.top = `${y - height - 25}px`;
    }
  };

  hideTooltip = () => {
    clearTimeout(this.timeoutId);
    this.setState({ tooltipVisible: false });
  };

  wrappChildrenProp = (propName: string, func: (e?: MouseEvent) => void) => {
    return {
      [propName]: e => {
        func(e);
        this.props.children.props[propName]?.(e);
      },
    };
  };

  wrapperProps = {
    ...this.wrappChildrenProp('onMouseEnter', this.showTooltip),
    ...this.wrappChildrenProp('onMouseLeave', this.hideTooltip),
    ...this.wrappChildrenProp('onClick', this.hideTooltip),
    ...this.wrappChildrenProp('onMouseMove', this.onMouseMove),
  };

  render() {
    const { children, content, isError, place, tooltipOffset, followMouse, hideArrow } = this.props;
    const { tooltipVisible } = this.state;
    const { isMobile } = this.context;
    const style = getTooltipStyles(isError, followMouse, tooltipOffset, place);

    const elementProps = tooltipVisible
      ? { ...this.wrapperProps, 'data-tooltipid': true }
      : this.wrapperProps;

    const tooltipArrow = hideArrow ? null : 'center';
    return isMobile || this.disabled || !content ? (
      children
    ) : (
      <>
        {React.cloneElement(React.Children.only(children), elementProps)}
        {tooltipVisible ? (
          <Suspense fallback={null}>
            <ToolTipComponent
              active={tooltipVisible}
              parent={'[data-tooltipid=true]'}
              position={place}
              arrow={tooltipArrow}
              style={style}
              tooltipTimeout={10}
              group={'ricos'}
            >
              {content}
            </ToolTipComponent>
          </Suspense>
        ) : null}
      </>
    );
  }
}

export default Tooltip;
