import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { getAnchorableBlocks } from '../AnchorComponents/anchorUtils';
import { RADIO_GROUP_VALUES } from '../AnchorComponents/consts';
import BasicLinkPanel from './BasicLinkPanel';
import MultiSelectLinkPanel from './MultiSelectLinkPanel';
import { isEmpty } from 'lodash';

class LinkModal extends PureComponent {
  constructor(props) {
    super(props);
    const {
      url,
      anchor,
      target,
      rel,
      editorState,
      linkTypes,
      hideUrlInput,
      anchorableBlocksData,
    } = this.props;
    this.renderBasicLinkPanel =
      !linkTypes ||
      isEmpty(linkTypes) ||
      !Object.values(linkTypes).find(addon => !!addon) ||
      hideUrlInput;
    this.anchorableBlocksData = !this.renderBasicLinkPanel
      ? anchorableBlocksData || getAnchorableBlocks(editorState)
      : undefined;
    this.state = {
      linkPanelValues: {
        url,
        target,
        rel,
      },
      anchorPanelValues: this.renderBasicLinkPanel
        ? undefined
        : {
            anchor: !this.isAnchorDeleted(anchor) && anchor,
          },
      radioGroupValue: this.renderBasicLinkPanel ? undefined : this.setInitialRadioGroupValue(),
    };
  }

  setInitialRadioGroupValue = () => {
    const { anchor } = this.props;
    return !anchor ? RADIO_GROUP_VALUES.EXTERNAL_LINK : RADIO_GROUP_VALUES.ANCHOR;
  };

  isAnchorDeleted = anchor => {
    return !this.anchorableBlocksData.anchorableBlocks.some(block => anchor === block.key);
  };

  isDoneButtonEnable = () => {
    const { radioGroupValue } = this.state;
    if (radioGroupValue) {
      switch (radioGroupValue) {
        case RADIO_GROUP_VALUES.EXTERNAL_LINK: {
          const { linkPanelValues } = this.state;
          return (linkPanelValues.isValid && !!linkPanelValues.url) || this.props.hideUrlInput;
        }
        case RADIO_GROUP_VALUES.ANCHOR: {
          const { anchorPanelValues } = this.state;
          return !!anchorPanelValues.anchor;
        }
        default:
          // eslint-disable-next-line no-console
          console.error('Unknown radio');
          break;
      }
    } else {
      const { linkPanelValues } = this.state;
      return (linkPanelValues.isValid && !!linkPanelValues.url) || this.props.hideUrlInput;
    }
  };

  onDone = () => {
    const { radioGroupValue } = this.state;
    if (radioGroupValue) {
      switch (radioGroupValue) {
        case RADIO_GROUP_VALUES.EXTERNAL_LINK:
          this.onDoneLink();
          break;
        case RADIO_GROUP_VALUES.ANCHOR:
          this.onDoneAnchor();
          break;
        default:
          // eslint-disable-next-line no-console
          console.error('Unknown radio');
          break;
      }
    } else {
      this.onDoneLink();
    }
  };

  onDoneAnchor = () => {
    const { anchorPanelValues } = this.state;
    if (anchorPanelValues.anchor) {
      this.props.onDone({
        ...anchorPanelValues,
        anchor: anchorPanelValues.anchor,
      });
    }
  };

  onDoneLink = () => {
    const { linkPanelValues } = this.state;
    if ((linkPanelValues.isValid && linkPanelValues.url) || this.props.hideUrlInput) {
      this.props.onDone(linkPanelValues);
    } else if (linkPanelValues.url === '') {
      this.onDelete();
    }
  };

  onDelete = () => {
    this.props.onDelete();
  };

  onCancel = () => this.props.onCancel();

  changeRadioGroup = value => {
    this.setState({ radioGroupValue: value });
  };

  onChangeLinkPanel = linkPanelValues => {
    this.setState({ linkPanelValues });
  };

  onChangeAnchorPanel = anchorPanelValues => {
    this.setState({ anchorPanelValues });
  };

  render() {
    const { radioGroupValue, linkPanelValues, anchorPanelValues } = this.state;
    const ariaProps = { 'aria-labelledby': 'mob_link_modal_hdr' };
    const {
      theme,
      isMobile,
      t,
      uiSettings,
      isActive,
      hideUrlInput,
      linkTypes,
      anchorTarget,
    } = this.props;
    const { linkPanel } = uiSettings || {};
    const { showNewTabCheckbox, showNoFollowCheckbox, showSponsoredCheckbox } = linkPanel || {};
    const hasCheckboxes = showNewTabCheckbox || showNoFollowCheckbox || showSponsoredCheckbox;
    const linkPanelAriaProps = { 'aria-label': 'Link management' };
    const sharedPanelsProps = {
      theme,
      onEnter: this.onDone,
      onEscape: this.onCancel,
      t,
      ariaProps: linkPanelAriaProps,
      hideUrlInput,
      ...uiSettings?.linkPanel,
      anchorTarget,
    };
    const buttonsProps = {
      onDone: this.onDone,
      onCancel: this.onCancel,
      onDelete: this.onDelete,
      isActive,
      theme,
      t,
      isDoneButtonEnable: this.isDoneButtonEnable(),
      hideUrlInput,
      isMobile,
    };
    const propsToPass = {
      theme,
      t,
      ariaProps,
      showNewTabCheckbox,
      showNoFollowCheckbox,
      showSponsoredCheckbox,
      sharedPanelsProps,
      buttonsProps,
      radioGroupValue,
      changeRadioGroup: this.changeRadioGroup,
      linkPanelValues,
      onChangeLinkPanel: this.onChangeLinkPanel,
      onChangeAnchorPanel: this.onChangeAnchorPanel,
      anchorableBlocksData: this.anchorableBlocksData,
      anchorPanelValues,
      isMobile,
      blockPreview: linkTypes?.anchor?.blockPreview,
      hasCheckboxes,
    };
    return this.renderBasicLinkPanel ? (
      <BasicLinkPanel {...propsToPass} />
    ) : (
      <MultiSelectLinkPanel {...propsToPass} />
    );
  }
}

LinkModal.propTypes = {
  editorState: PropTypes.object.isRequired, // will be removed when all usages of this class will pass anchorableBlocksData
  anchorableBlocksData: PropTypes.object,
  url: PropTypes.string,
  anchor: PropTypes.string,
  target: PropTypes.bool,
  rel: PropTypes.string,
  theme: PropTypes.object.isRequired,
  isActive: PropTypes.bool,
  isMobile: PropTypes.bool,
  anchorTarget: PropTypes.string,
  onDone: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  uiSettings: PropTypes.object,
  t: PropTypes.func,
  linkTypes: PropTypes.object,
  hideUrlInput: PropTypes.bool,
};

export default LinkModal;
