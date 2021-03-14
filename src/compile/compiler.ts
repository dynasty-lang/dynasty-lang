import { AstNode } from '../ast/astNode';
import { NameCollectVisitor } from './nameCollectVisitor';
import { Namespace } from './codegen/codeElement';
import { AsmNode, generateAsm } from './codegen/assembly';
import { AssemblyGenerator } from './codegen/templates';
import { TypeDesc, uint8 } from './types';

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

  /**
   * TODO: これを実装
   */
  resolveImports() {}

  resolveTypeReferences() {
    this.resolveTypes(this.rootNS, []);
    console.log(JSON.stringify(this.rootNS, undefined, 2));
  }

  private resolveTypes(ns: Namespace, parents: Namespace[]) {
    Object.entries(ns.types)
      .filter(([_, it]) => it.kind === 'reference')
      .forEach(([key, it]) => {
        if (it.kind !== 'reference') {
          return;
        }

        let knownRefs: string[] = [key];
        let ref: TypeDesc = it;

        while (true) {
          if (ref.kind === 'reference') {
            if (knownRefs.includes(ref.name)) {
              throw new Error(
                `TypeError: cannot resolve circular type alias: ${knownRefs.join(
                  ', '
                )}`
              );
            }
            try {
              ref = this.scanTypes(ref.name, [...parents, ns]);
            } catch {
              break;
            }
            continue;
          }
          knownRefs.forEach((ref_) => {
            ns.types[ref_] = ref;
          });
        }

        throw new Error(
          `TypeError: cannot resolve type alias: ${knownRefs.join(', ')}`
        );
      });
    const callables = Object.values(ns.callables);
    callables.forEach(({ locals: it }) =>
      this.resolveTypes(it, [...parents, it])
    );
    callables.forEach(({ type: it }) => {
      it.return_type;
    });
  }

  private scanTypes(name: string, ns: Namespace[]) {
    for (let i = 0; i < ns.length; i++) {
      const ref = ns[i].types[name];

      if (typeof ref !== 'undefined') {
        return ref;
      }
    }

    throw new Error(`TypeError: cannot find type '${name}'`);
  }

  /**
   * TODO: これを実装
   */
  resolveUnknownTypes() {}

  /**
   * TODO: これを実装
   */
  resolveFuncCalls() {}

  generateFuncCode() {
    this.generator.declareFunction({
      name: 'main',
      nodes: this.generateTopLevelCode(),
      type: {
        kind: 'callable',
        params: [],
        return_type: uint8,
      },
      locals: this.rootNS,
    });
  }

  /**
   * TODO: これを実装
   */
  generateMetaCode(): AsmNode[] {
    return [];
  }

  /**
   * TODO: これを実装
   */
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
