import theme from '../theme/theme';
import { videoTypeMapper, VIDEO_TYPE, pluginVideo } from 'wix-rich-content-plugin-video/viewer';
import { dividerTypeMapper, pluginDivider } from 'wix-rich-content-plugin-divider/viewer';
import { htmlTypeMapper, pluginHtml } from 'wix-rich-content-plugin-html/viewer';
import { soundCloudTypeMapper, pluginSoundCloud } from 'wix-rich-content-plugin-sound-cloud/viewer';
import { linkTypeMapper, LINK_TYPE, pluginLink } from 'wix-rich-content-plugin-link/viewer';
import {
  linkPreviewTypeMapper,
  LINK_PREVIEW_TYPE,
  pluginLinkPreview,
} from 'wix-rich-content-plugin-link-preview/viewer';
import { imageTypeMapper, pluginImage } from 'wix-rich-content-plugin-image/viewer';
import { tableTypeMapper, pluginTable } from 'wix-rich-content-plugin-table/viewer';

import {
  galleryTypeMapper,
  pluginGallery,
  GALLERY_TYPE,
} from 'wix-rich-content-plugin-gallery/viewer';
import { mapTypeMapper, pluginMap } from 'wix-rich-content-plugin-map/viewer';
import { giphyTypeMapper, pluginGiphy, GIPHY_TYPE } from 'wix-rich-content-plugin-giphy/viewer';
import {
  buttonTypeMapper,
  pluginActionButton,
  ACTION_BUTTON_TYPE,
} from 'wix-rich-content-plugin-button/viewer';
import { HashtagDecorator, pluginHashtag } from 'wix-rich-content-plugin-hashtag/viewer';
import {
  verticalEmbedTypeMapper,
  pluginVerticalEmbed,
} from 'wix-rich-content-plugin-vertical-embed/viewer';
import {
  createHeadersMarkdownDecorator,
  HEADERS_MARKDOWN_TYPE,
  pluginHeadersMarkdown,
} from 'wix-rich-content-plugin-headers-markdown';
import { CodeBlockDecorator, pluginCodeBlock } from 'wix-rich-content-plugin-code-block/viewer';
import {
  mentionsTypeMapper,
  MENTION_TYPE,
  pluginMentions,
} from 'wix-rich-content-plugin-mentions/viewer';
import {
  fileUploadTypeMapper,
  pluginFileUpload,
  FILE_UPLOAD_TYPE,
} from 'wix-rich-content-plugin-file-upload/viewer';
import {
  textColorInlineStyleMapper,
  TEXT_COLOR_TYPE,
  TEXT_HIGHLIGHT_TYPE,
  textHighlightInlineStyleMapper,
  pluginTextColor,
  pluginTextHighlight,
} from 'wix-rich-content-plugin-text-color/viewer';
import {
  spoilerInlineStyleMapper,
  initSpoilersContentState,
  SpoilerViewerWrapper,
  SPOILER_TYPE,
  pluginSpoiler,
} from 'wix-rich-content-plugin-spoiler/viewer';
import {
  collapsibleListTypeMapper,
  pluginCollapsibleList,
} from 'wix-rich-content-plugin-collapsible-list/viewer';

import {
  viewerCustomForegroundStyleFn,
  styleSelectionPredicate,
  viewerCustomBackgroundStyleFn,
} from '../../src/text-color-style-fn';

import { pollTypeMapper, pluginPoll, POLL_TYPE } from 'wix-rich-content-plugin-social-polls/viewer';

import 'wix-rich-content-editor-common/dist/styles.min.css';
import 'wix-rich-content-common/dist/styles.min.css';
import 'wix-rich-content-viewer/dist/styles.min.css';
// import 'wix-rich-content-plugin-code-block/dist/styles.min.css';
import 'wix-rich-content-plugin-button/dist/styles.min.css';
import 'wix-rich-content-plugin-divider/dist/styles.min.css';
import 'wix-rich-content-plugin-hashtag/dist/styles.min.css';
import 'wix-rich-content-plugin-html/dist/styles.min.css';
import 'wix-rich-content-plugin-image/dist/styles.min.css';
import 'wix-rich-content-plugin-gallery/dist/styles.min.css';
import 'wix-rich-content-plugin-link/dist/styles.min.css';
import 'wix-rich-content-plugin-link-preview/dist/styles.min.css';
import 'wix-rich-content-plugin-spoiler/dist/styles.min.css';
import 'wix-rich-content-plugin-mentions/dist/styles.min.css';
import 'wix-rich-content-plugin-video/dist/styles.min.css';
import 'wix-rich-content-plugin-sound-cloud/dist/styles.min.css';
import 'wix-rich-content-plugin-map/dist/styles.min.css';
import 'wix-rich-content-plugin-file-upload/dist/styles.min.css';
import 'wix-rich-content-plugin-giphy/dist/styles.min.css';
import 'wix-rich-content-text-selection-toolbar/dist/styles.min.css';
import 'wix-rich-content-plugin-social-polls/dist/styles.min.css';
import 'wix-rich-content-plugin-collapsible-list/dist/styles.min.css';
import 'wix-rich-content-plugin-table/dist/styles.min.css';
import 'wix-rich-content-plugin-vertical-embed/dist/styles.min.css';

import { RichContentViewerProps } from 'wix-rich-content-viewer';
import {
  Decorator,
  HASHTAG_TYPE,
  PluginTypeMapper,
  DraftContent,
  UISettings,
  ViewerPlugin,
} from 'wix-rich-content-common';

const linkPluginSettings = {
  onClick: (event, url) => console.log('link clicked!', url),
  siteUrl: 'http://localhost:3000/', //siteUrl is for anchor SEO
};
const mentionsPluginSettings = {
  onMentionClick: mention => console.log('mention clicked!', mention),
  getMentionLink: () => '/link/to/mention',
};

export const typeMappers: PluginTypeMapper[] = [
  videoTypeMapper,
  buttonTypeMapper,
  dividerTypeMapper,
  htmlTypeMapper,
  linkTypeMapper,
  linkPreviewTypeMapper,
  soundCloudTypeMapper,
  mentionsTypeMapper,
  imageTypeMapper,
  tableTypeMapper,
  galleryTypeMapper,
  mapTypeMapper,
  fileUploadTypeMapper,
  giphyTypeMapper,
  pollTypeMapper,
  verticalEmbedTypeMapper,
  collapsibleListTypeMapper,
];

export const uiSettings: UISettings = {
  // disableRightClick: true, deprecated
};

const config: RichContentViewerProps['config'] = {
  [POLL_TYPE]: {
    siteToken: process.env.POLLS_API_KEY,
    isWebView: false,
  },
  [GALLERY_TYPE]: {},
  [SPOILER_TYPE]: { initSpoilersContentState, SpoilerViewerWrapper },
  [HEADERS_MARKDOWN_TYPE]: {
    hideMarkdown: true,
  },
  [GIPHY_TYPE]: {
    giphySdkApiKey: process.env.GIPHY_API_KEY,
    sizes: { desktop: 'original', mobile: 'original' }, // original or downsizedSmall are supported
  },
  // [HTML_TYPE]: {
  // siteDomain="https://www.wix.com"
  // },
  [LINK_TYPE]: linkPluginSettings,
  [LINK_PREVIEW_TYPE]: {
    enableEmbed: true,
  },
  [MENTION_TYPE]: mentionsPluginSettings,
  [TEXT_HIGHLIGHT_TYPE]: {
    styleSelectionPredicate,
    customStyleFn: viewerCustomBackgroundStyleFn,
  },
  [TEXT_COLOR_TYPE]: {
    styleSelectionPredicate,
    customStyleFn: viewerCustomForegroundStyleFn,
  },
  [FILE_UPLOAD_TYPE]: {
    resolveFileUrl: () =>
      new Promise(resolve =>
        setTimeout(
          () => resolve('https://www.w3.org/wai/er/tests/xhtml/testfiles/resources/pdf/dummy.pdf'),
          1000
        )
      ),
    downloadTarget: '_blank',
  },
  [VIDEO_TYPE]: {
    getVideoUrl: src => `https://video.wixstatic.com/${src.pathname}`,
  },
  uiSettings,
  [ACTION_BUTTON_TYPE]: {
    onClick: () => {
      window.alert('onClick event..');
    },
  },
  [HASHTAG_TYPE]: {
    onClick: (event, text) => {
      event.preventDefault();
      console.log(`'${text}' hashtag clicked!`);
    },
    createHref: decoratedText => `/search/posts?query=${encodeURIComponent('#')}${decoratedText}`,
  },
};

export const viewerPlugins: ViewerPlugin[] = [
  pluginVideo(config[VIDEO_TYPE]),
  pluginActionButton(config[ACTION_BUTTON_TYPE]),
  pluginDivider(),
  pluginHtml(),
  pluginLink(config[LINK_TYPE]),
  pluginLinkPreview(config[LINK_PREVIEW_TYPE]),
  pluginSoundCloud(),
  pluginMentions(),
  pluginImage(),
  pluginTable(),
  pluginGallery(config[GALLERY_TYPE]),
  pluginMap(),
  pluginFileUpload(config[FILE_UPLOAD_TYPE]),
  pluginGiphy(config[GIPHY_TYPE]),
  pluginPoll(config[POLL_TYPE]),
  pluginVerticalEmbed(),
  pluginCollapsibleList(),
  pluginHashtag(config[HASHTAG_TYPE]),
  pluginHeadersMarkdown(),
  pluginCodeBlock(),
  pluginTextColor(config[TEXT_COLOR_TYPE]),
  pluginTextHighlight(config[TEXT_HIGHLIGHT_TYPE]),
  pluginSpoiler(),
];

export const getConfig = (additionalConfig = {}): RichContentViewerProps['config'] => {
  let _config = { ...config };
  Object.keys(additionalConfig).forEach(key => {
    if (additionalConfig[key]) {
      const orgConfig = config[key] || {};
      _config[key] = { ...orgConfig, ...additionalConfig[key] };
    }
  });

  return _config;
};

export const getInlineStyleMappers = (raw: DraftContent) => [
  textColorInlineStyleMapper(config, raw),
  textHighlightInlineStyleMapper(config, raw),
  spoilerInlineStyleMapper(config, raw),
];

export const decorators: Decorator[] = [
  new HashtagDecorator({
    theme,
    ...config[HASHTAG_TYPE],
  }),
  new CodeBlockDecorator({ theme }),
  createHeadersMarkdownDecorator(config),
];
