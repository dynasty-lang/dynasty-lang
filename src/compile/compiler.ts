import { AstNode } from '../ast/astNode';
import { NameCollectVisitor } from './nameCollectVisitor';
import { Namespace } from './codegen/codeElement';
import { AsmNode, generateAsm } from './codegen/assembly';
import { AssemblyGenerator } from './codegen/templates';
import { uint8 } from './types';

export class DynastyCompiler {
  private rootNS: Namespace;
  private rootNode: AstNode;
  private generator: AssemblyGenerator;

  constructor(node: AstNode, file: string) {
    this.rootNS = {
      callables: {},
      types: {},
      variables: {},
      children: [],
      scope: 'global',
    };
    this.rootNode = node;
    this.generator = new AssemblyGenerator(file);
  }

  collectNames() {
    const nameCollector = new NameCollectVisitor();
    const ns = nameCollector.visit(this.rootNode);
    this.rootNS = {
      callables: Object.assign(this.rootNS.callables, ns.callables),
      types: Object.assign(this.rootNS.types, ns.types),
      variables: Object.assign(this.rootNS.variables, ns.variables),
      children: [...(this.rootNS.children || []), ...(ns.children || [])],
      scope: 'global',
    };
  }

  resolveImports() {}
  resolveTypeReferences() {}
  resolveUnknownTypes() {}
  resolveFuncCalls() {}

  generateFuncCode() {
    this.generator.declareFunction({
      name: '_toplevel_main',
      nodes: this.generateTopLevelCode(),
      type: {
        kind: 'callable',
        params: [],
        return_type: uint8,
      },
      locals: this.rootNS,
    });
  }

  generateMetaCode(): AsmNode[] {
    return [];
  }

  generateTopLevelCode(): AsmNode[] {
    return [];
  }

  generateCode(): AsmNode[] {
    this.generator.appendHeadingMeta(this.generateMetaCode());
    return this.generator.create();
  }

  compile(): string {
    this.resolveImports();
    this.collectNames();
    this.resolveTypeReferences();
    this.resolveUnknownTypes();
    this.resolveFuncCalls();
    this.generateFuncCode();

    return generateAsm(this.generateCode());
  }
}
