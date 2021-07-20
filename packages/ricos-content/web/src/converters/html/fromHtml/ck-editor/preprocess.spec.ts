import { readFileSync } from 'fs';
import { preprocess } from './preprocess';

describe('CKEditor preprocess', () => {
  it('<p><img>text</p> => <div><img><p>text</p></div>', async () => {
    const expected =
      '<p>text</p><div><a><img></a></div>' +
      '<ol><li><p>item</p></li><li><div><img><p>This should be <strong>wrapped</strong> with P!</p></div></li></ol>';
    const actual = preprocess(
      '<p>text</p><p><a><img></a></p>' +
        '<ol><li><p>item</p></li><li><p><img>This should be <strong>wrapped</strong> with P!</p></li></ol>'
    );
    expect(actual).toEqual(expected);
  });

  it('<li>text</li> => <li><p>text</p></li>', async () => {
    const expected =
      '<ol><li><p>item</p></li><li><div><img><p>This should be <strong>wrapped</strong> with P!</p></div></li></ol>';
    const actual = preprocess(
      '<ol><li>item</li><li><p><img>This should be <strong>wrapped</strong> with P!</p></li></ol>'
    );
    expect(actual).toEqual(expected);
  });

  it('<p/> => <div/>', async () => {
    const expected =
      '<p>text</p><div></div><div></div><ol><li><p>item</p></li><li><div></div></li></ol>';
    const actual = preprocess(
      '<p>text</p><div></div><div></div><ol><li><p>item</p></li><li><p/></li></ol>'
    );
    expect(actual).toEqual(expected);
  });

  it('<ul>text<li>...</li></ul> => <ul><li>...</li></ul>', async () => {
    const expected = '<p>text</p><ol><li><p>assa</p><p>item inside</p></li></ol>';
    const actual = preprocess('<p>text</p><ol>remove me!<li>assa<p>item</p> inside</li></ol>');
    expect(actual).toEqual(expected);
  });
});
