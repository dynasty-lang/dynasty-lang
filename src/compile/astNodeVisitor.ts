import { AstNode } from '../ast/astNode';

export abstract class AstNodeVisitor<T> {
  abstract visit(node: AstNode): T;
  protected abstract canVisitThis(node: AstNode): boolean;

  protected visitChildren(nodes: AstNode[]): T[] {
    return nodes
      .filter((it) => this.canVisitThis(it))
      .map((it) => this.visit(it));
  }
}
