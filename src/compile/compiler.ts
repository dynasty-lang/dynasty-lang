import { AstNode } from '../ast/astNode';
import { Namespace } from './codegen/codeElement';

export class DynastyCompiler {
  private rootNS: Namespace;

  constructor() {
    this.rootNS = { callables: {}, types: {}, variables: {} };
  }

  collectNames() {}

  compile(node: AstNode) {}
}
