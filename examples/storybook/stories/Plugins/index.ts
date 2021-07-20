import { storiesOf } from '@storybook/react';
import LinkPreviewStory from './LinkPreview';
import GalleryPluginStory from './Gallery';
import DividerPluginStory from './Divider';
import CollapsibleListPluginStory from './CollapsibleList';
import HeadingsPluginStory from './Headings';
import SpoilerPluginStory from './Spoiler';
import AnchorPluginStory from './Anchor';
import ButtonsPluginStory from './Buttons';
import Image from './Image';
import Video from './Video';
import VerticalEmbedStory from './VerticalEmbed';
import HtmlPluginStory from './HtmlPlugin';
import FileUploadStory from './FileUpload';
import MapPluginStory from './Map';
import TablePluginStory from './Table';
import LinkPluginStory from './Link';

storiesOf('Plugins', module)
  .add('Divider', DividerPluginStory)
  .add('Collapsible List', CollapsibleListPluginStory)
  .add('Spoiler', SpoilerPluginStory)
  .add('Headings', HeadingsPluginStory)
  .add('Anchor', AnchorPluginStory)
  .add('Image', Image)
  .add('Video', Video)
  .add('Gallery', GalleryPluginStory)
  .add('Link Preview', LinkPreviewStory)
  .add('Buttons', ButtonsPluginStory)
  .add('Vertical Embed', VerticalEmbedStory)
  .add('HTML Plugin', HtmlPluginStory)
  .add('File Upload', FileUploadStory)
  .add('Map', MapPluginStory)
  .add('Table', TablePluginStory)
  .add('Link', LinkPluginStory);
