import * as T from 'fp-ts/Tree';
import { compact, isArray } from 'lodash';
import { Prism, fromTraversable, Traversal, Lens } from 'monocle-ts';
import { Node, Node_Type } from 'ricos-schema';

export interface Extractor<DT> {
  filter: (predicate: (data: DT) => boolean) => Extractor<DT>;
  map: <MT>(mapper: (data: DT) => MT) => Extractor<MT>;
  chain: <CT>(mapper: (data: DT) => Extractor<CT>) => Extractor<CT>[];
  get: () => DT[];
}

const unfoldTree = (nodes: Node | Node[]) => {
  const root = isArray(nodes) ? { key: 'root', type: Node_Type.UNRECOGNIZED, nodes } : nodes;
  return T.unfoldTree<Node, Node>(root, n => [n, n.nodes]);
};

class TraversalExtractor<DT> implements Extractor<DT> {
  traversal: Traversal<T.Tree<Node>, DT>;

  tree: T.Tree<Node>;

  constructor(traversal: Traversal<T.Tree<Node>, DT>, tree: T.Tree<Node>) {
    this.traversal = traversal;
    this.tree = tree;
  }

  filter(predicate: (data: DT) => boolean) {
    return new TraversalExtractor<DT>(
      this.traversal.composePrism(Prism.fromPredicate(predicate)),
      this.tree
    );
  }

  map<MT>(mapper: (data: DT) => MT) {
    return new TraversalExtractor<MT>(
      this.traversal.composeLens(
        new Lens<DT, MT>(mapper, () => (dt: DT) => dt)
      ),
      this.tree
    );
  }

  chain<CT>(mapper: (data: DT) => TraversalExtractor<CT>): Extractor<CT>[] {
    return this.get().map(dt => mapper(dt));
  }

  get() {
    return compact(this.traversal.asFold().getAll(this.tree));
  }
}

export const extract = (nodes: Node | Node[]): Extractor<Node> =>
  new TraversalExtractor<Node>(fromTraversable(T.tree)<Node>(), unfoldTree(nodes));
