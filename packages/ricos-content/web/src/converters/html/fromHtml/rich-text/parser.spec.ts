import { readFileSync } from 'fs';
import { RichContent } from 'ricos-schema';

import parse from './parser';
import richTextContent from '../__tests__/richTextContent.json';
import { compare } from '../../../../comparision/compare';

const getHTML = filename => readFileSync(`${__dirname}/../__tests__/${filename}.html`, 'utf8');

describe('rich text converter', () => {
  it('should convert html to RichContent', () => {
    const content = parse(getHTML('richTextHtml'));
    expect(
      compare(content, RichContent.fromJSON(richTextContent), {
        ignoredKeys: ['key'],
      })
    ).toEqual({});
  });
});
