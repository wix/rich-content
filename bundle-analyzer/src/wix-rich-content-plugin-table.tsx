import 'wix-rich-content-plugin-table/dist/styles.min.css';
import { tableTypeMapper } from 'ricos/table/viewer';
import createViewerBundle from './RichContentViewerWrapper';

export default () => createViewerBundle(tableTypeMapper);
