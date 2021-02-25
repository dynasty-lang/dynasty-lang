import { AstNode } from '../ast/astNode';

export interface AstNodeVisitor<T> {
  visit(node: AstNode): T;
}
