import { PROGRAM_NAME, VERSION } from '../../constants';
import { AsmNode } from './assembly';
import { Callable, Namespace } from './codeElement';

const functionPrologue: AsmNode[] = [
  { kind: 'inst', inst: 'push', operands: ['rbp'] },
  { kind: 'directive', directive: 'seh_pushreg', operands: ['rbp'] },
  { kind: 'inst', inst: 'mov', operands: ['rbp', 'rsp'] },
  { kind: 'directive', directive: 'seh_setframe', operands: ['rbp', '0'] },
];

export class AssemblyGenerator {
  private globalConstants: number;
  private heading: AsmNode[];
  private code: AsmNode[];

  constructor(private filename: string) {
    this.globalConstants = 0;
    this.heading = [
      {
        kind: 'directive',
        directive: 'file',
        operands: [`"${this.filename}"`],
      },
      { kind: 'directive', directive: 'intel_syntax', operands: ['noprefix'] },
      { kind: 'directive', directive: 'text', operands: [] },
      { kind: 'directive', directive: 'section', operands: ['.rdata', '"dr"'] },
    ];
    this.code = [{ kind: 'directive', directive: 'text', operands: [] }];
  }

  declareFunction(func: Callable) {
    this.code = this.code.concat(
      this.createFuncFrame(
        func.name,
        func.nodes,
        this.calcFrameSize(func.locals)
      )
    );
  }

  declareGlobalConstant(value: Uint8Array): string {
    const text = `.GLC${this.globalConstants++}`;
    this.heading = this.heading.concat([
      { kind: 'label', text },
      {
        kind: 'directive',
        directive: 'byte',
        operands: [...value].map((it) => it.toString()),
      },
    ]);
    return text;
  }

  appendHeadingMeta(code: AsmNode[]) {
    this.heading = this.heading.concat(code);
  }

  private calcFrameSize(ns: Namespace): number {
    return Object.values(ns.variables)
      .map((it) => {
        const typ = it.type;
        switch (typ.kind) {
          case 'builtin':
            return typ.length;
          case 'object':
            return 64;
          default:
            return 0;
        }
      })
      .concat(
        (ns.children || [])
          .filter((it) => it.scope !== 'function')
          .map((it) => this.calcFrameSize(it))
      )
      .reduce((a, b) => a + b, 0);
  }

  private createFuncFrame(
    name: string,
    code: AsmNode[],
    stack: number
  ): AsmNode[] {
    return ([
      { kind: 'directive', directive: 'globl', operands: [name] },
      { kind: 'directive', directive: 'def', operands: [name] },
      { kind: 'directive', directive: 'scl', operands: ['2'] },
      { kind: 'directive', directive: 'type', operands: ['32'] },
      { kind: 'directive', directive: 'endef', operands: [] },
      { kind: 'label', text: name },
    ] as AsmNode[])
      .concat(functionPrologue)
      .concat([
        { kind: 'inst', inst: 'sub', operands: ['rsp', `${stack}`] },
        {
          kind: 'directive',
          directive: 'seh_stackalloc',
          operands: [`${stack}`],
        },
        { kind: 'directive', directive: 'seh_endprologue', operands: [] },
      ])
      .concat(code)
      .concat([
        { kind: 'inst', inst: 'add', operands: ['rsp', `${stack}`] },
        { kind: 'inst', inst: 'pop', operands: ['rbp'] },
        { kind: 'inst', inst: 'ret', operands: [] },
        { kind: 'directive', directive: 'seh_endproc', operands: [] },
      ]);
  }

  create(): AsmNode[] {
    return this.heading.concat(this.code).concat([
      {
        kind: 'directive',
        directive: 'ident',
        operands: [`"${PROGRAM_NAME} ${VERSION}"`],
      },
    ]);
  }
}
