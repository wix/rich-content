import { DraftContent, RicosContentBlock } from 'ricos-content';
import { countBy } from 'lodash';

export const getBlockTypePlugins = (blocks: RicosContentBlock[]): RicosContentBlock[] =>
  blocks.filter(block => block.type !== 'unstyled' && block.type !== 'atomic');

export const countByType = (obj: { type: string }[]) => countBy(obj, x => x.type);

export function getContentSummary(content: DraftContent) {
  const { blocks, entityMap } = content;
  const blockPlugins = getBlockTypePlugins(blocks);
  const entries = Object.values(entityMap);
  const pluginsDetails = entries
    .filter(entry => entry.type !== 'text')
    .map(entry => ({ type: entry.type, data: entry.data }));
  return {
    pluginsCount: {
      ...countByType(blockPlugins),
      ...countByType(entries),
    },
    pluginsDetails,
  };
}
