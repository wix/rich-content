export const INLINE_TOOLBAR_BUTTONS = {
  BOLD: 'textInlineStyleButton_Bold',
  ITALIC: 'textInlineStyleButton_Italic',
  UNDERLINE: 'textInlineStyleButton_Underline',
  COLOR: 'TextColorButton',
  HIGHTLIGHT: 'TextHighlightButton',
  TITLE: 'textBlockStyleButton_Title',
  QUOTE: 'textBlockStyleButton_Quote',
  DECREASE_INDENT: 'decreaseIndentButton',
  INCREASE_INDENT: 'increaseIndentButton',
  ORDERED_LIST: 'textBlockStyleButton_Numberedlist',
  UNORDERED_LIST: 'textBlockStyleButton_Bulletedlist',
  ALIGNMENT: 'textDropDownButton_Alignment',
  TEXT_ALIGN_CENTER: 'textAlignmentButton_center',
  TEXT_ALIGN_LEFT: 'textAlignmentButton_left',
  TEXT_ALIGN_RIGHT: 'textAlignmentButton_right',
  TEXT_ALIGN_JUSTIFY: 'textAlignmentButton_justify',
  LINE_SPACING: 'LineSpacingButton',
  LINK: 'LinkButton',
  CODE_BLOCK: 'TextCodeBlockButton',
};

export const ACTION_BUTTONS = {
  SAVE: 'actionButtonSave',
  CANCEL: 'actionButtonCancel',
};

export const COLOR_PICKER = {
  ADD_COLOR: 'addColor',
  COLOR_INPUT: 'colorInput',
  UPDATE_BUTTON: ACTION_BUTTONS.SAVE,
  RESET_COLOR: 'resetColor',
};

export const STATIC_TOOLBAR_BUTTONS_BASIC = {
  DIVIDER: 'DividerPlugin_InsertButton',
  CODE_BLOCK: 'CodeblockPlugin_InsertButton',
  MAP: 'MapPlugin_InsertButton',
  BUTTON: 'ButtonPlugin_InsertButton',
  HTML: 'HTMLCodePlugin_InsertButton',
};

export const STATIC_TOOLBAR_BUTTONS_WITH_MODAL = {
  VIDEO: 'VideoPlugin_InsertButton',
  // SOUND_CLOUD: 'SoundcloudPlugin_InsertButton', //TODO: fix this flaky test
  // GIPHY: 'GIFPlugin_InsertButton', //Flaky test, TODO: think of a way to get same gif
  // ADSENSE: 'AdSensePlugin_InsertButton',
  EMOJI: 'EmojiPlugin_InsertButton',
};

// export const STATIC_TOOLBAR_BUTTONS_MEDIA = {
// FILE_UPLOAD: 'UploadFilePlugin_InsertButton', //TODO: fix this flaky test
// IMAGE: 'ImagePlugin_InsertButton',  //TODO: fix this flaky test
// GALLERY: 'GalleryPlugin_InsertButton', //TODO: fix this flaky test
// };

export const STATIC_TOOLBAR_BUTTONS_EMBED = {
  TWITTER: 'Twitter_InsertButton',
  FACEBOOK: 'Facebook_InsertButton',
  TIKTOK: 'TikTok_InsertButton',
  PINTEREST: 'Pinterest_InsertButton',
  YOUTUBE: 'YouTube_InsertButton',
  INSTAGRAM: 'Instagram_InsertButton',
  EVENT: 'Events_InsertButton',
  PRODUCT: 'Stores_InsertButton',
  BOOKING: 'Bookings_InsertButton',
};

export const STATIC_TOOLBAR_BUTTONS_WITHOUT_EMBED = {
  ...STATIC_TOOLBAR_BUTTONS_BASIC,
  ...STATIC_TOOLBAR_BUTTONS_WITH_MODAL,
  // ...STATIC_TOOLBAR_BUTTONS_MEDIA,
};

export const STATIC_TOOLBAR_BUTTONS_EXPENDED = {
  IMAGE: 'ImagePlugin_InsertButton',
  GALLERY: 'GalleryPlugin_InsertButton',
  FILE_UPLOAD: 'UploadFilePlugin_InsertButton',
  COLLAPSIBLE_LIST: 'CollapsibleList_InsertButton',
  TABLE: 'TablePlugin_InsertButton',
};

export const STATIC_TOOLBAR_BUTTONS = {
  ...STATIC_TOOLBAR_BUTTONS_WITHOUT_EMBED,
  ...STATIC_TOOLBAR_BUTTONS_EMBED,
  ...STATIC_TOOLBAR_BUTTONS_EXPENDED,
};

export const PLUGIN_TOOLBAR_BUTTONS = {
  SMALL: 'blockSizeButton_sizeSmall',
  MEDIUM: 'blockSizeButton_sizeMedium',
  LARGE: 'blockSizeButton_sizeLarge',
  ORIGINAL: 'blockAlignmentAndSizeButton_sizeOriginal',
  SMALL_CENTER: 'blockAlignmentAndSizeButton_sizeSmallCenter',
  SMALL_LEFT: 'blockAlignmentAndSizeButton_alignLeft',
  CONTENT_CENTER: 'blockAlignmentAndSizeButton_alignCenter',
  SMALL_RIGHT: 'blockAlignmentAndSizeButton_alignRight',
  BEST_FIT: 'blockAlignmentAndSizeButton_sizeContent',
  FULL_WIDTH: 'blockAlignmentAndSizeButton_sizeFullWidth',
  ALIGN_LEFT: 'blockAlignmentButton_alignLeft',
  ALIGN_CENTER: 'blockAlignmentButton_alignCenter',
  ALIGN_RIGHT: 'blockAlignmentButton_alignRight',
  LINK: 'LinkButton',
  SPOILER: 'spoilerButton',
  SETTINGS: 'baseToolbarButton_settings',
  REPLACE: 'baseToolbarButton_replace',
  ADV_SETTINGS: 'baseToolbarButton_advanced_settings',
  DELETE: 'blockButton_delete',
  EDIT: 'baseToolbarButton_edit',
};

export const IMAGE_SETTINGS = {
  CAPTION: 'imageSettingsCaptionInput',
  LINK: 'linkPanelInput',
  PREVIEW: 'imagePreview',
  IMAGE_EXPAND_TOGGLE: 'imageExpandToggle',
  IMAGE_DOWNLOAD_TOGGLE: 'imageDownloadToggle',
};

export const VIDEO_SETTINGS = {
  DOWNLOAD_TOGGLE: 'videoDownloadToggle',
};

export const GALLERY_SETTINGS = {
  IMAGE: 'galleryItemPreview',
  EDIT_IMAGE: 'galleryItemsSortableItemSettings',
  TITLE: 'galleryImageTitleInput',
  VIEWER_IMAGE: 'image-item',
  SELECT_ALL: 'galleryItemsSortableSelectAll',
  DESELECT: 'galleryItemsSortableDeselectAll',
  DELETE: 'galleryItemsSortableDelete',
  UPLOAD: 'galleryItemsSortableFileInputTop',
  GALLERY_EXPAND_TOGGLE: 'galleryExpandToggle',
};

export const GALLERY_IMAGE_SETTINGS = {
  PREVIEW: 'galleryImageSettingsPreview',
  DELETE: 'galleryImageSettingsDeleteImage',
  TITLE: 'galleryImageTitleInput',
  LINK: 'linkPanelInput',
  LINK_TARGET: 'linkPanelBlankCheckbox',
  LINK_NOFOLLOW: 'linkPanelRelCheckbox',
  DONE: ACTION_BUTTONS.SAVE,
};

export const VIDEO_PLUGIN = {
  INPUT: 'videoUploadModalInput',
  ADD: 'videoUploadModalAddButton',
  CUSTOM: 'videoUploadModalCustomVideo',
};

export const TABLE_PLUGIN = {
  STATIC_TOOLBAR_BUTTON: 'TablePlugin_InsertButton',
  ROW_COUNT_INPUT: 'rowCount',
  COL_COUNT_INPUT: 'columnCount',
  SUBMIT: 'createTableButton',
  CELL: 'table-plugin-cell',
  TEXT_STYLE_BUTTON: 'text-style',
  BG_COLOR: 'back-ground-color',
  BORDER_COLOR_BUTTONS: 'border-color-buttons',
  BORDER_COLOR_AROUND: 'border-color-around',
  BORDER_COLOR_ALL: 'border-color-all',
  TEXT_COLOR: 'wix-rich-content-text-color-button',
  HIGHLIGHT_COLOR: 'wix-rich-content-text-highlight-button',
  CONTEXT_MENU: 'context-menu',
  CLEAR: 'clear',
  DELETE_COLUMN: 'delete-column',
  DELETE_ROW: 'delete-row',
  INSERT_RIGHT: 'insert-right',
  INSERT_LEFT: 'insert-left',
  INSERT_ABOVE: 'insert-above',
  INSERT_BELOW: 'insert-below',
  MERGE: 'merge-cells',
  SPLIT: 'split-cells',
  ROW_HEADER: 'row-header',
  COL_HEADER: 'col-header',
  ALIGNMENT: 'VerticalAlignment',
  ALIGN_TOP: 'vertical-alignment-align-top',
  ALIGN_MIDDLE: 'vertical-alignment-align-middle',
  ALIGN_BOTTOM: 'vertical-alignment-align-bottom',
};

export const SOUND_CLOUD = {
  INPUT: 'soundCloudUploadModalInput',
  ADD: ACTION_BUTTONS.SAVE,
};

export const HTML_PLUGIN = {
  STATIC_TOOLBAR_BUTTON: 'HTMLCodePlugin_InsertButton',
  INPUT: 'htmlEditPanel_htmlInput',
  UPDATE: 'htmlEditPanel_Update',
  RADIO_URL: 'htmlEditPanel_radioUrl',
};

export const GIPHY_PLUGIN = {
  UPLOAD_MODAL: 'giphyUploadModal',
  UPLOAD_MODAL_INPUT: 'giphyUploadModalInput',
};

export const PLUGIN_COMPONENT = {
  COLLAPSIBLE_LIST: 'collapsibleListComponent',
  IMAGE: 'imageViewer',
  VIDEO: 'videoPlayer',
  GALLERY: 'galleryViewer',
  HTML: 'HtmlComponent',
  DIVIDER: 'divider',
  GIPHY: 'giphyPlayer',
  SOUND_CLOUD: 'soundCloudPlayer',
  MAP: 'mapViewer',
  FILE_UPLOAD: 'fileUploadViewer',
  EMOJI: 'EmojiPlugin_InsertButton',
  LINK_PREVIEW: 'linkPreviewViewer',
  BUTTON: 'buttonViewer',
  VERTICAL_EMBED: 'vertical-embed',
  TABLE: 'TableComponent',
};

export const DIVIDER_DROPDOWN_OPTIONS = {
  SINGLE: 'single_dropdown_option',
  DOUBLE: 'double_dropdown_option',
  DASHED: 'dashed_dropdown_option',
  DOTTED: 'dotted_dropdown_option',
};

export const BUTTON_PLUGIN_MODAL = {
  DESIGN_TAB: 'design_Tab',
  BUTTON_SAMPLE: 'buttonSample_3',
  DONE: ACTION_BUTTONS.SAVE,
};

export const SOCIAL_EMBED = {
  INPUT: 'socialEmbedUploadModalInput',
  ADD: ACTION_BUTTONS.SAVE,
};

export const COLLAPSIBLE_LIST_SETTINGS = {
  RTL_DIRECTION: 'rtlDirection',
  LTR_DIRECTION: 'ltrDirection',
  COLLAPSED: 'Collapsed',
  EXPANDED: 'Expanded',
  FIRST_EXPANDED: 'FirstExpanded',
  NEW_PAIR: 'CollapsibleListNewPair_button',
  ONE_PAIR_EXPANDED: 'onePairExpanded',
};

export const TOOLBARS = { FOOTER: 'footerToolbar', SIDE: 'addPluginFloatingToolbar' };
