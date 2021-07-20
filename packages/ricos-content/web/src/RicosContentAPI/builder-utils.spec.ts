import { Node_Type, TextData } from 'ricos-schema';
import { addNode, toTextDataArray } from './builder-utils';

describe('addNode util', () => {
  it('should append node, if no index/id provided', () => {
    const content = Object.freeze({
      nodes: [
        { id: 'foo', nodes: [], type: Node_Type.PARAGRAPH },
        { id: 'bar', nodes: [], type: Node_Type.POLL },
      ],
    });
    const node = Object.freeze({ id: 'foo', nodes: [], type: Node_Type.PARAGRAPH });
    const expected = { nodes: [...content.nodes, node] };
    const actual = addNode({ node, content });
    expect(actual).toEqual(expected);
  });
  it('should insert node at index, if index provided', () => {
    const content = Object.freeze({
      nodes: [
        { id: 'foo', nodes: [], type: Node_Type.PARAGRAPH },
        { id: 'bar', nodes: [], type: Node_Type.POLL },
      ],
    });
    const node = Object.freeze({ id: 'new', nodes: [], type: Node_Type.DIVIDER });
    const expected = {
      nodes: [
        { id: 'foo', nodes: [], type: Node_Type.PARAGRAPH },
        { id: 'new', nodes: [], type: Node_Type.DIVIDER },
        { id: 'bar', nodes: [], type: Node_Type.POLL },
      ],
    };
    const actual = addNode({ node, content, index: 1 });
    expect(actual).toEqual(expected);
  });
  it('should insert node after a node by id, if after id provided', () => {
    const content = Object.freeze({
      nodes: [
        { id: 'foo', nodes: [], type: Node_Type.PARAGRAPH },
        { id: 'bar', nodes: [], type: Node_Type.POLL },
      ],
    });
    const node = Object.freeze({ id: 'new', nodes: [], type: Node_Type.DIVIDER });
    const expected = {
      nodes: [
        { id: 'foo', nodes: [], type: Node_Type.PARAGRAPH },
        { id: 'new', nodes: [], type: Node_Type.DIVIDER },
        { id: 'bar', nodes: [], type: Node_Type.POLL },
      ],
    };
    const actual = addNode({ node, content, after: 'foo' });
    expect(actual).toEqual(expected);
  });
  it('should insert node before a node by id, if before id provided', () => {
    const content = Object.freeze({
      nodes: [
        { id: 'foo', nodes: [], type: Node_Type.PARAGRAPH },
        { id: 'bar', nodes: [], type: Node_Type.POLL },
      ],
    });
    const node = Object.freeze({ id: 'new', nodes: [], type: Node_Type.DIVIDER });
    const expected = {
      nodes: [
        { id: 'new', nodes: [], type: Node_Type.DIVIDER },
        { id: 'foo', nodes: [], type: Node_Type.PARAGRAPH },
        { id: 'bar', nodes: [], type: Node_Type.POLL },
      ],
    };
    const actual = addNode({ node, content, before: 'foo' });
    expect(actual).toEqual(expected);
  });
});

describe('toTextDataArray util', () => {
  it('should return [] for invalid input', () => {
    const expected = [];
    const actual = toTextDataArray((123 as unknown) as TextData);
    expect(actual).toEqual(expected);
  });

  it('should convert string to TextData[]', () => {
    const expected = [{ text: 'test', decorations: [] }];
    const actual = toTextDataArray('test');
    expect(actual).toEqual(expected);
  });
  it('should convert TextData to TextData[]', () => {
    const expected = [{ text: 'test', decorations: [] }];
    const actual = toTextDataArray({ text: 'test', decorations: [] });
    expect(actual).toEqual(expected);
  });
  it('should convert mixed array to TextData[]', () => {
    const expected = [
      { text: 'test', decorations: [] },
      { text: 'foo', decorations: [] },
      { text: 'bar', decorations: [] },
    ];
    const actual = toTextDataArray(['test', { text: 'foo', decorations: [] }, 'bar']);
    expect(actual).toEqual(expected);
  });
});
