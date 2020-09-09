import React from 'react';
import PropTypes from 'prop-types';
import AccordionViewer from './accordion-viewer';
import { DEFAULTS, FIRST_PAIR, Icons, ACCORDION_TYPE } from './defaults';
import { mergeStyles } from 'wix-rich-content-common';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import { toInteger } from 'lodash';
import styles from '../statics/styles/accordion-component.rtlignore.scss';
import { Accordion } from './components/domain/accordion';

class AccordionComponent extends React.Component {
  constructor(props) {
    super(props);
    const { theme, t } = props;
    this.state = {};
    this.styles = mergeStyles({ styles, theme });
    this.titlePlaceholder = t('Accordion_ShownText_Add_Placeholder');
    this.contentPlaceholder = t('Accordion_CollapsedText_Add_Placeholder');
  }

  insertNewPair = () => {
    this.dataManager.insertNewPair();
    this.setState({
      shouldForceFocus: true,
      idToFocus: (Object.entries(this.dataManager.getPairs()).length + 1).toString(),
      shouldFocusTitle: true,
    });
  };

  deletePair = pairIndex => {
    const pairs = this.dataManager.getPairs();
    if (Object.keys(pairs).length < 2) {
      return;
    }

    this.dataManager.deletePair(pairIndex);
    this.setState({
      shouldForceFocus: true,
      idToFocus: pairIndex.toString(),
      shouldFocusTitle: false,
    });
  };

  handleIconStyleChange = iconStyle => {
    const componentData = this.dataManager.getData();
    const { config } = componentData;
    const updatedComponentData = { ...componentData, config: { ...config, iconStyle } };
    this.dataManager.setData(updatedComponentData);
  };

  renderNewPairButton = () => {
    const direction = this.dataManager.getDirection();
    const Icon = Icons.plus;

    return (
      <div className={this.styles[direction]}>
        <button
          className={this.styles.new_pair_container}
          onClick={this.insertNewPair}
          data-hook={'AccordionNewPair_button'}
        >
          <div className={this.styles.new_pair_button}>
            <Icon />
            <label className={this.styles.new_pair_label}>{this.titlePlaceholder}</label>
          </div>
        </button>
      </div>
    );
  };

  idToIndex = id => toInteger(id) - 1;

  calcZindex = (id, isTitle) =>
    this.state.lastFocusedPair?.id === id && this.state.lastFocusedPair?.isTitle === isTitle
      ? 5
      : 1;

  onBackspace = (id, isTitle) => editorState => {
    const selection = editorState.getSelection();
    if (selection.isCollapsed() && selection.getAnchorOffset() === 0) {
      const startKey = selection.getStartKey();
      const contentState = editorState.getCurrentContent();

      if (contentState.getBlocksAsArray()[0].getKey() === startKey) {
        if (isTitle) {
          this.deletePair(this.idToIndex(id));
        } else {
          this.setState({ shouldForceFocus: true, idToFocus: id, shouldFocusTitle: true });
        }
      }
    }
  };

  renderTitle = (id, setEditorRef) => {
    return (
      <this.renderInput
        id={id}
        value={this.dataManager.getTitle(id)}
        setEditorRef={setEditorRef}
        onChange={val => this.dataManager.setTitle(id, val)}
        placeholder={this.titlePlaceholder}
        isTitle
      />
    );
  };

  renderContent = (id, setEditorRef) => {
    return (
      <this.renderInput
        id={id}
        value={this.dataManager.getContent(id)}
        setEditorRef={setEditorRef}
        onChange={val => this.dataManager.setContent(id, val)}
        placeholder={this.contentPlaceholder}
      />
    );
  };

  onFocus = (id, isTitle) => () => {
    this.setState({
      shouldForceFocus: undefined,
      idToFocus: undefined,
      shouldFocusTitle: undefined,
      lastFocusedPair: { id, isTitle },
    });
  };

  renderInput = ({ id, value, isTitle, setEditorRef, onChange, placeholder }) => {
    const { renderInnerRCE } = this.props;

    const additionalProps = {
      direction: this.dataManager.getDirection(),
      style: { cursor: 'auto' },
      placeholder: id === FIRST_PAIR ? placeholder : '',
      onBackspace: this.onBackspace(id, isTitle),
    };

    return renderInnerRCE({
      contentState: value,
      callback: newContentState => onChange(newContentState),
      renderedIn: ACCORDION_TYPE,
      additionalProps,
      onFocus: this.onFocus(id, isTitle),
      setEditorRef,
    });
  };

  isPluginFocused() {
    const blockKey = this.props.block.getKey();
    const selectedBlockKey = this.props.selection.getAnchorKey();

    return blockKey === selectedBlockKey;
  }

  onDragEnd = result => {
    // dropped outside the list or no change
    if (!result.destination || result.source.index === result.destination.index) {
      return;
    }

    this.dataManager.reorderPairs(result.source.index, result.destination.index);
  };

  getDataManager = () => {
    const { store, block, componentData } = this.props;
    return new Accordion(store, block, componentData);
  };

  render() {
    const { componentData, setInPluginEditingMode, theme, t, isMobile } = this.props;
    const isPluginFocused = this.isPluginFocused();
    this.dataManager = this.getDataManager();

    return (
      <div data-hook="accordionComponent">
        <DragDropContext onDragEnd={this.onDragEnd}>
          <Droppable droppableId="droppable">
            {provided => (
              <div {...provided.droppableProps} ref={provided.innerRef}>
                <AccordionViewer
                  componentData={componentData}
                  setInPluginEditingMode={setInPluginEditingMode}
                  theme={theme}
                  renderTitle={this.renderTitle}
                  renderContent={this.renderContent}
                  t={t}
                  isPluginFocused={isPluginFocused}
                  idToIndex={this.idToIndex}
                  calcZindex={this.calcZindex}
                  isMobile={isMobile}
                  shouldForceFocus={this.state.shouldForceFocus}
                  idToFocus={this.state.idToFocus}
                  shouldFocusTitle={this.state.shouldFocusTitle}
                />
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
        {isPluginFocused && this.renderNewPairButton()}
      </div>
    );
  }
}

AccordionComponent.propTypes = {
  componentData: PropTypes.object.isRequired,
  setInPluginEditingMode: PropTypes.func.isRequired,
  block: PropTypes.object.isRequired,
  store: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
  selection: PropTypes.object.isRequired,
  t: PropTypes.func.isRequired,
  renderInnerRCE: PropTypes.func.isRequired,
  isMobile: PropTypes.bool.isRequired,
};

export { AccordionComponent as Component, DEFAULTS };
