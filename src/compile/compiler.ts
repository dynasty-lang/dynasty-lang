import { AstNode } from '../ast/astNode';
import { NameCollectVisitor } from './nameCollectVisitor';
import { Namespace } from './codegen/codeElement';
import { AsmNode, generateAsm } from './codegen/assembly';

export class DynastyCompiler {
  private rootNS: Namespace;
  private rootNode: AstNode;

  constructor(node: AstNode) {
    this.rootNS = { callables: {}, types: {}, variables: {}, children: [] };
    this.rootNode = node;
  }

  collectNames() {
    const nameCollector = new NameCollectVisitor();
    const ns = nameCollector.visit(this.rootNode);
    this.rootNS = {
      callables: Object.assign(this.rootNS.callables, ns.callables),
      types: Object.assign(this.rootNS.types, ns.types),
      variables: Object.assign(this.rootNS.variables, ns.variables),
      children: [...(this.rootNS.children || []), ...(ns.children || [])],
    };
  }

  resolveImports() {}
  resolveTypeReferences() {}
  resolveUnknownTypes() {}
  resolveFuncCalls() {}

  generateFuncCode() {}

  generateMetaCode(): AsmNode[] {
    return [];
  }

  generateTopLevelCode(): AsmNode[] {
    return [];
  }

  generateCode(): AsmNode[] {
    return this.generateMetaCode()
      .concat(this.generateTopLevelCode())
      .concat([]);
  }

  compile(node: AstNode): string {
    this.resolveImports();
    this.collectNames();
    this.resolveTypeReferences();
    this.resolveUnknownTypes();
    this.resolveFuncCalls();
    this.generateFuncCode();

    return generateAsm(this.generateCode());
  }
}
