import { identity, pipe, flow } from 'fp-ts/function';
import * as E from 'fp-ts/Either';
import { Link, Decoration_Type } from 'ricos-schema';
import { Element } from 'parse5';
import { createLink } from '../../../nodeUtils';
import { getMatches, replace } from '../../../../fp-utils';
import { getAttributes } from '../core/ast-utils';
import { Rule } from '../core/models';
import { aToLink } from '../core/rules';

const parseNavigationData = flow(
  replace(/~#~/g, '"'),
  d =>
    E.tryCatch(
      () => JSON.parse(d),
      () => ({ type: 'pageLink', id: d })
    ),
  E.fold(identity, identity)
);

const toCustomData = flow(
  getMatches(/Wix\.(.+)\('(.+)'\)/),
  E.fromOption(() => 'failed to parse custom link onclick'),
  E.map(([, , data]: string[]) => parseNavigationData(data)),
  E.map(JSON.stringify),
  E.fold(identity, identity)
);

const getData = (onclick?: string): Record<string, string> =>
  onclick?.startsWith('Wix.') ? { customData: toCustomData(onclick) } : {};

const mergeData = (onclick?: string) => (link: Link): Link => ({ ...link, ...getData(onclick) });

const createCustomLink = ({ url, onclick, ...rest }: Record<string, string>): Link =>
  pipe({ url, ...rest }, createLink, mergeData(onclick));

export const aToCustomLink: Rule = [
  aToLink[0],
  context => (node: Element) => {
    const attrs = getAttributes(node);
    return context.addDecoration(
      Decoration_Type.LINK,
      { linkData: { link: createCustomLink({ ...attrs, url: attrs.href }) } },
      node
    );
  },
];
