import * as T from 'fp-ts/Tree';
import { pipe } from 'fp-ts/function';
import { compact, isArray } from 'lodash';
import { Prism, fromTraversable, Traversal } from 'monocle-ts';
import { RichContent, Node, Node_Type } from 'ricos-schema';

export interface Modifier {
  filter: (pred: (node: Node) => boolean) => Modifier;
  set: (setter: (node: Node) => Node | Node[]) => RichContent;
}

const unfoldTree = (nodes: Node | Node[]) => {
  const root = isArray(nodes) ? { key: 'root', type: Node_Type.UNRECOGNIZED, nodes } : nodes;
  return T.unfoldTree<Node, Node>(root, n => [n, n.nodes]);
};

const toArray = item => (isArray(item) ? item : [item]);

const modifyByKey = (keysToSet: string[], setter: (node: Node) => Node | Node[]) => (node: Node) =>
  keysToSet.includes(node.key) ? setter(node) : node;

const mergeWith = (prefix: Node[]) => (suffix: Node[]) => [...prefix, ...suffix];

const foldTree = (tree: T.Tree<Node>, setter: (node: Node) => Node | Node[], keysToSet: string[]) =>
  T.fold<Node, Node>((root, forest) => ({
    ...root,
    nodes: forest.reduce(
      (modifiedForest, node) =>
        pipe(node, modifyByKey(keysToSet, setter), toArray, mergeWith(modifiedForest)),
      []
    ),
  }))(tree);

class TraversalModifier implements Modifier {
  content: RichContent;

  traversal: Traversal<T.Tree<Node>, Node>;

  tree: T.Tree<Node>;

  constructor(traversal: Traversal<T.Tree<Node>, Node>, tree: T.Tree<Node>, content: RichContent) {
    this.traversal = traversal;
    this.content = content;
    this.tree = tree;
  }

  filter(predicate: (node: Node) => boolean) {
    return new TraversalModifier(
      this.traversal.composePrism(Prism.fromPredicate(predicate)),
      this.tree,
      this.content
    );
  }

  set(setter: (node: Node) => Node | Node[]) {
    const keysToSet = compact(this.traversal.asFold().getAll(this.tree)).map(({ key }) => key);
    const root = foldTree(this.tree, setter, keysToSet);
    return { ...this.content, nodes: root.nodes };
  }
}

export const modify = (content: RichContent): Modifier =>
  new TraversalModifier(fromTraversable(T.tree)<Node>(), unfoldTree(content.nodes), content);
