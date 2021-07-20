/* eslint-disable no-console */
import path from 'path';
import chalk from 'chalk';
import { writeFileSync, readFileSync } from 'fs';
import { fromDraft } from '../packages/ricos-content/web/src/converters/draft';
import { fromPlainText, toPlainText } from '../packages/ricos-content/web/src/converters/plainText';
import { fromHtml, toHtml } from '../packages/ricos-content/web/src/converters/html';
import { toTiptap } from '../packages/ricos-content/web/src/converters/tiptap';
import migrationContent from '../e2e/tests/fixtures/migration-content.json';
import { RichContent } from 'ricos-schema';

const stringifyBaseLine = obj => {
  let i = 0;
  const normalizeKeys = (key, val) => {
    switch (key) {
      case 'key':
        return val === '' ? '' : `${i++}`;
      case 'createdTimestamp':
      case 'updatedTimestamp':
        return '2021-07-15T07:42:30.023Z';
      default:
        return val;
    }
  };
  return JSON.stringify(obj, normalizeKeys, 2);
};

const writeBaseLine = (path, obj) => writeFileSync(path, stringifyBaseLine(obj));

const getAbsPath = (relPath: string) => path.resolve(__dirname, relPath);

const HTML_CONTENT = readFileSync(
  getAbsPath(
    '../packages/ricos-content/web/src/converters/html/fromHtml/__tests__/richTextHtml.html'
  ),
  'utf8'
);

const RICH_CONTENT_BASELINE = getAbsPath(
  '../packages/ricos-content/web/statics/json/migratedFixtures/migration-content.json'
);
const TO_PLAIN_TEXT_BASELINE = getAbsPath(
  '../packages/ricos-content/web/src/converters/plainText/toPlainText/complexPlainText.ts'
);
const FROM_PLAIN_TEXT_BASELINE = getAbsPath(
  '../packages/ricos-content/web/src/converters/plainText/fromPlainText/plainTextContent.json'
);
const TO_HTML_BASELINE = getAbsPath(
  '../packages/ricos-content/web/src/converters/html/toHtml/__tests__/complexContentHtml.html'
);
const FROM_HTML_BASELINE = getAbsPath(
  '../packages/ricos-content/web/src/converters/html/fromHtml/__tests__/richTextContent.json'
);
const TIPTAP_BASELINE = getAbsPath(
  '../packages/ricos-content/web/src/converters/tiptap/toTiptap/__tests__/migrationContentTiptap.json'
);

enum Target {
  RICOS = 'ricos',
  TEXT = 'text',
  HTML = 'html',
  TIPTAP = 'tiptap',
}

const convertToRichContent = async () => {
  console.log('Converting to ' + chalk.green('rich content') + '...');
  const richContentJSON = RichContent.toJSON(richContent);
  writeBaseLine(RICH_CONTENT_BASELINE, richContentJSON);
  console.log('Saved rich content baseline 💰\n');
};

const convertHtml = async () => {
  console.log('Converting to/from ' + chalk.green('HTML') + '...');
  convertToHtml();
  convertFromHtml();
  console.log('Saved HTML baseline 🌎\n');
};

const convertToHtml = () => {
  const html = toHtml(richContent);
  writeFileSync(TO_HTML_BASELINE, html);
};

const convertFromHtml = () => {
  const content = fromHtml(HTML_CONTENT);
  const contentJSON = RichContent.toJSON(content);
  writeBaseLine(FROM_HTML_BASELINE, contentJSON);
};

const convertPlainText = async () => {
  console.log('Converting to/from ' + chalk.green('plain text') + '...');
  await convertToPlainText();
  convertFromPlainText();
  console.log('Saved to/from plain text baselines 📃\n');
};

const convertToPlainText = async () => {
  const plainTextBaseline = (text: string) =>
    '/* eslint-disable max-len */\nexport const PLAIN_TEXT = `' + text + '`;\n';

  const plainText = await toPlainText(richContent);
  writeFileSync(TO_PLAIN_TEXT_BASELINE, plainTextBaseline(plainText));
};

const convertFromPlainText = () => {
  const { PLAIN_TEXT } = require(TO_PLAIN_TEXT_BASELINE);
  const content = fromPlainText(PLAIN_TEXT);
  const contentJSON = RichContent.toJSON(content);
  writeBaseLine(FROM_PLAIN_TEXT_BASELINE, contentJSON);
};

const convertToTiptap = async () => {
  console.log('Converting to ' + chalk.green('tiptap') + '...');
  const tiptap = toTiptap(richContent);
  writeBaseLine(TIPTAP_BASELINE, tiptap);
  console.log('Saved tiptap baseline ⚪️\n');
};

const target = process.argv[2]?.toLowerCase();
const richContent = fromDraft(migrationContent);

const conversions: Promise<void>[] = [];
switch (target) {
  case Target.RICOS:
    conversions.push(convertToRichContent());
    break;
  case Target.HTML:
    conversions.push(convertHtml());
    break;
  case Target.TIPTAP:
    conversions.push(convertToTiptap());
    break;
  case Target.TEXT:
    conversions.push(convertPlainText());
    break;
  case undefined:
    conversions.push(convertToRichContent(), convertHtml(), convertToTiptap(), convertPlainText());
    break;
  default:
    console.error(chalk.red(`Target "${target}" should be one of ${Object.values(Target)}`));
}

if (conversions.length > 0) {
  Promise.all(conversions).then(() => {
    console.warn(
      chalk.yellow('Please make sure all changes to baselines are required before comitting\n')
    );
  });
}
