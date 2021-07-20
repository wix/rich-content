import { identity, flow } from 'fp-ts/function';
import * as E from 'fp-ts/Either';
import { VideoData, Node_Type } from 'ricos-schema';
import { Element } from 'parse5';
import { createNode } from '../../../nodeUtils';
import { hasTag, getAttributes } from '../core/ast-utils';
import { Rule } from '../core/models';

const toURL = (str: string) =>
  E.tryCatch(
    () => new URL(str),
    () => 'invalid URL string'
  );

const getVideoId = (url: URL): E.Either<string, string> =>
  url.host.includes('youtube') && url.pathname.includes('/embed/')
    ? E.right(url.pathname.replace('/embed/', ''))
    : E.left('not a youtube source');

const toYoutubeWatchUrl = flow(
  toURL,
  E.chain(getVideoId),
  E.fold(identity, id => `https://www.youtube.com/watch?v=${id}`)
);

const toVideoData = flow(
  getAttributes,
  ({ src }) => ({ video: { src: { url: toYoutubeWatchUrl(src) } } } as VideoData)
);

export const iframeToVideo: Rule = [
  hasTag('iframe'),
  () => (node: Element) => [
    createNode(Node_Type.VIDEO, { nodes: [], data: { ...toVideoData(node) } }),
  ],
];
