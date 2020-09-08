import React, { Component } from 'react';
import PropTypes, { oneOf } from 'prop-types';
import classNames from 'classnames';
import { mergeStyles } from 'wix-rich-content-common';
import styles from '../../statics/styles/accordion-pair.rtlignore.scss';
import { Icons } from '../defaults';

class AccordionPair extends Component {
  constructor(props) {
    super(props);
    const { theme } = props;
    this.styles = mergeStyles({ styles, theme });
    this.state = this.stateFromProps(props);
  }

  componentDidUpdate() {
    if (this.props.shouldForceFocus && this.props.id === this.props.idToFocus) {
      if (this.props.shouldFocusTitle) {
        this.titleEditorRef.focus();
      } else {
        this.contentEditorRef.focus();
      }
    }
  }

  static getDerivedStateFromProps(props, state) {
    const {
      componentData: {
        config: { visualization, direction, expandOneSection },
      },
      isExpanded,
      setInPluginEditingMode,
    } = props;

    let newState = {};

    if (visualization !== state.visualization) {
      newState = { ...state, isExpanded, visualization, expandOneSection };
    }

    if (expandOneSection !== state.expandOneSection) {
      newState = { ...state, ...newState, expandOneSection };
    }

    if (direction !== state.direction) {
      newState = { ...state, ...newState, direction };
    }

    if (!setInPluginEditingMode && expandOneSection && isExpanded !== state.isExpanded) {
      newState = { ...state, ...newState, isExpanded };
    }

    return newState;
  }

  stateFromProps(props) {
    const {
      isExpanded,
      componentData: {
        config: { visualization, direction, expandOneSection },
      },
    } = props;
    return { isExpanded, visualization, direction, expandOneSection };
  }

  handleExpandCollapse = () => {
    const { handleOneSectionExpanded, id } = this.props;
    const { expandOneSection } = this.state;
    if (expandOneSection) {
      handleOneSectionExpanded(id);
    }
    this.setState({ isExpanded: !this.state.isExpanded });
  };

  zIndexStyle = (id, isTitle) => {
    const { calcZindex } = this.props;
    return {
      zIndex: this.props.isPluginFocused ? calcZindex?.(id, isTitle) : 0,
    };
  };

  renderDndHoverIcon = () => {
    const { setInPluginEditingMode, isMobile, isPluginFocused, dragHandleProps } = this.props;

    if (!setInPluginEditingMode) {
      return null;
    }

    const props = isMobile || !isPluginFocused ? { style: { visibility: 'hidden' } } : {};
    const Icon = Icons.dndUnselected;

    return (
      <div className={this.styles.hoverIcon} {...dragHandleProps} {...props}>
        <Icon />
      </div>
    );
  };

  renderIcon = () => {
    const {
      componentData: {
        config: { iconStyle },
      },
    } = this.props;
    const { isExpanded } = this.state;
    const Icon = Icons[iconStyle];

    return (
      <button
        className={classNames(
          this.styles.icon,
          this.styles[`${iconStyle}_${isExpanded ? 'expanded' : 'collapsed'}`]
        )}
        onClick={this.handleExpandCollapse}
        style={this.zIndexStyle()}
      >
        <Icon
          style={{
            transform: `rotate(${isExpanded ? '90' : '0'}deg)`,
            transition: 'transform 0.15s linear',
          }}
        />
      </button>
    );
  };

  setTitleEditorRef = ref => (this.titleEditorRef = ref);
  setContentEditorRef = ref => (this.contentEditorRef = ref);

  renderInnerRCE = (id, isTitle) => {
    const {
      componentData: {
        pairs: { [id]: pair },
      },
      renderInnerRCE,
      innerRCV,
    } = this.props;

    const contentState = isTitle ? pair.title : pair.content;
    return renderInnerRCE
      ? renderInnerRCE(id, isTitle, isTitle ? this.setTitleEditorRef : this.setContentEditorRef)
      : innerRCV(contentState);
  };

  renderTitle = () => {
    const { id } = this.props;

    return (
      <div className={this.styles.title_content} style={this.zIndexStyle(id, true)}>
        {this.renderInnerRCE(id, true)}
      </div>
    );
  };

  renderContent = () => {
    const { id } = this.props;

    return (
      <>
        {this.state.isExpanded && (
          <div className={this.styles.content}>{this.renderInnerRCE(id)}</div>
        )}
      </>
    );
  };

  renderLinePlacer = () => {
    return <div className={this.styles.dndLinePlacer} />;
  };

  render() {
    return (
      <div className={this.styles[this.state.direction]}>
        {this.renderDndHoverIcon()}
        <div className={this.styles.title}>
          {this.renderIcon()}
          {this.renderTitle()}
        </div>
        {this.renderContent()}
      </div>
    );
  }
}

AccordionPair.propTypes = {
  theme: PropTypes.object.isRequired,
  setInPluginEditingMode: oneOf(PropTypes.func, undefined),
  componentData: PropTypes.object.isRequired,
  id: PropTypes.string.isRequired,
  isExpanded: PropTypes.bool.isRequired,
  t: PropTypes.func.isRequired,
  handleOneSectionExpanded: PropTypes.func.isRequired,
  expandOneSection: PropTypes.bool.isRequired,
  renderInnerRCE: PropTypes.func,
  innerRCV: PropTypes.func,
  isPluginFocused: PropTypes.bool,
  isDragging: PropTypes.bool,
  calcZindex: PropTypes.func,
  isMobile: PropTypes.bool,
  dragHandleProps: PropTypes.object,
  shouldForceFocus: PropTypes.bool,
  idToFocus: PropTypes.string,
  shouldFocusTitle: PropTypes.bool,
};

export default AccordionPair;
