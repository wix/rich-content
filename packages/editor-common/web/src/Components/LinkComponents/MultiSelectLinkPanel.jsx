/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { PureComponent } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import LinkPanelWrapper from './LinkPanelWrapper';
import AnchorPanel from '../AnchorComponents/AnchorPanel';
import { mergeStyles } from 'wix-rich-content-common';
import { RadioGroup, FocusManager } from 'wix-rich-content-ui-components';
import styles from '../../../statics/styles/multi-select-link-panel.scss';
import LinkActionsButtons from './LinkActionsButtons';
// import { LinkIcon } from '../../Icons';
import { RADIO_GROUP_VALUES } from '../AnchorComponents/consts';

const Separator = ({ isMobile }) => (
  <div
    className={classNames(styles.multiSelectLinkPanel_actionsDivider, {
      [styles.multiSelectLinkPanel_actionsDivider_mobile]: isMobile,
    })}
    role="separator"
  />
);

class MultiSelectLinkPanel extends PureComponent {
  constructor(props) {
    super(props);
    this.styles = mergeStyles({ styles, theme: props.theme });
  }

  renderRadioGroup = () => {
    const { radioGroupValue, changeRadioGroup, t } = this.props;
    return (
      <RadioGroup
        className={styles.multiSelectLinkPanel_radioButtons}
        dataSource={[
          {
            value: RADIO_GROUP_VALUES.EXTERNAL_LINK,
            labelText: t('LinkTo_Modal_Sidebar_Website'),
            dataHook: 'link-radio',
          },
          {
            value: RADIO_GROUP_VALUES.ANCHOR,
            labelText: t('LinkTo_Modal_Sidebar_Section'),
            dataHook: 'anchor-radio',
          },
        ]}
        value={radioGroupValue}
        onChange={changeRadioGroup}
        {...this.props}
      />
    );
  };

  renderDesktopHeader = () => {
    const { t } = this.props;
    return (
      <>
        <div className={styles.multiSelectLinkPanel_header}>
          <div>{t('LinkTo_Modal_Header')}</div>
        </div>
        <Separator isMobile={false} />
      </>
    );
  };

  // renderDesktopLinkActionsButtons = () => {
  //   const { buttonsProps } = this.props;
  //   return (
  //     <>
  //       <div className={styles.multiSelectLinkPanel_actionsDivider} role="separator" />
  //       <LinkActionsButtons {...buttonsProps} />
  //     </>
  //   );
  // };

  renderActionsButtons = () => {
    const { buttonsProps } = this.props;
    return (
      <>
        {/* <LinkActionsButtons {...buttonsProps} />
        <div className={styles.multiSelectLinkPanel_header_mobile}>
          <LinkIcon className={styles.multiSelectLinkPanel_mobileHeaderIcon} />
          <div>{t('LinkTo_Modal_Header')}</div>
        </div> */}
        {/* <div className={isMobile && styles.linkPanel_mobile_title_buttons_wrapper}> */}
        {/* {isMobile && this.renderMobileTitle()} */}
        <LinkActionsButtons basicLinkPanel {...buttonsProps} />
        {/* </div> */}
        {this.renderMobileTabs()}
      </>
    );
  };

  renderMobileTabs = () => {
    const { t, radioGroupValue, changeRadioGroup } = this.props;
    return (
      <div className={styles.multiSelectLinkPanel_tabsWrapper}>
        <div
          className={classNames(styles.multiSelectLinkPanel_tab, {
            [styles.multiSelectLinkPanel_tabSelected]:
              radioGroupValue === RADIO_GROUP_VALUES.EXTERNAL_LINK,
          })}
          onClick={() => changeRadioGroup(RADIO_GROUP_VALUES.EXTERNAL_LINK)}
          data-hook="linkPanelContainerLinkTab"
        >
          {t('LinkTo_Modal_Sidebar_Website')}
        </div>
        <div
          className={classNames(styles.multiSelectLinkPanel_tab, {
            [styles.multiSelectLinkPanel_tabSelected]:
              radioGroupValue === RADIO_GROUP_VALUES.ANCHOR,
          })}
          onClick={() => changeRadioGroup(RADIO_GROUP_VALUES.ANCHOR)}
          data-hook="linkPanelContainerAnchorTab"
        >
          {t('LinkTo_Modal_Sidebar_Section')}
        </div>
      </div>
    );
  };

  render() {
    const { styles } = this;
    const {
      isMobile,
      ariaProps,
      showNewTabCheckbox,
      showNoFollowCheckbox,
      showSponsoredCheckbox,
      sharedPanelsProps,
      radioGroupValue,
      linkPanelValues,
      onChangeLinkPanel,
      onChangeAnchorPanel,
      anchorableBlocksData,
      anchorPanelValues,
      blockPreview,
      hasCheckboxes,
    } = this.props;

    const containerClassName = !isMobile
      ? styles.multiSelectLinkPanel_container
      : styles.multiSelectLinkPanel_container_mobile;

    const contentClassName = !isMobile
      ? styles.multiSelectLinkPanel_content
      : styles.multiSelectLinkPanel_content_mobile;

    const linkPanelContainerClassName = !isMobile
      ? styles.multiSelectLinkPanel_LinkPanelContainer
      : styles.multiSelectLinkPanel_LinkPanelContainer_mobile;

    return (
      <FocusManager
        className={containerClassName}
        data-hook="linkPanelContainer"
        role="form"
        {...ariaProps}
      >
        {!isMobile && this.renderDesktopHeader()}

        <div className={contentClassName}>
          {!isMobile && (
            <>
              {this.renderRadioGroup()}
              <div className={styles.linkPanel_VerticalDivider} />
            </>
          )}
          {radioGroupValue === RADIO_GROUP_VALUES.EXTERNAL_LINK && (
            <div className={linkPanelContainerClassName}>
              <LinkPanelWrapper
                linkValues={linkPanelValues}
                onChange={onChangeLinkPanel}
                showNewTabCheckbox={showNewTabCheckbox}
                showNoFollowCheckbox={showNoFollowCheckbox}
                showSponsoredCheckbox={showSponsoredCheckbox}
                hasCheckboxes={hasCheckboxes}
                {...sharedPanelsProps}
              />
            </div>
          )}
          {radioGroupValue === RADIO_GROUP_VALUES.ANCHOR && (
            <AnchorPanel
              anchorableBlocksData={anchorableBlocksData}
              anchorValues={anchorPanelValues}
              onChange={onChangeAnchorPanel}
              blockPreview={blockPreview}
              {...sharedPanelsProps}
            />
          )}
        </div>
        {!isMobile && <Separator isMobile={isMobile} />}
        <div>
          <LinkActionsButtons {...this.props.buttonsProps} />
          {isMobile && (
            <>
              <Separator isMobile={isMobile} />
              {this.renderMobileTabs()}
            </>
          )}
        </div>
      </FocusManager>
    );
  }
}

Separator.propTypes = {
  isMobile: PropTypes.bool,
};

MultiSelectLinkPanel.propTypes = {
  theme: PropTypes.object.isRequired,
  t: PropTypes.func,
  ariaProps: PropTypes.object,
  showNewTabCheckbox: PropTypes.bool,
  showNoFollowCheckbox: PropTypes.bool,
  showSponsoredCheckbox: PropTypes.bool,
  sharedPanelsProps: PropTypes.object,
  buttonsProps: PropTypes.object,
  radioGroupValue: PropTypes.string,
  changeRadioGroup: PropTypes.func,
  linkPanelValues: PropTypes.object,
  onChangeLinkPanel: PropTypes.func,
  onChangeAnchorPanel: PropTypes.func,
  anchorableBlocksData: PropTypes.object,
  anchorPanelValues: PropTypes.object,
  isMobile: PropTypes.bool,
  hasCheckboxes: PropTypes.bool,
  blockPreview: PropTypes.func,
};

export default MultiSelectLinkPanel;
