export type AsmNode =
  | {
      kind: 'label';
      text: string;
    }
  | {
      kind: 'inst';
      inst: string;
      operands: string[];
    }
  | {
      kind: 'directive';
      directive: string;
      operands: string[];
    };

export type AsmNodeKind = AsmNode['kind'];

export function generateAsm(nodes: AsmNode[]): string {
  return nodes
    .map((it) => {
      switch (it.kind) {
        case 'directive':
          return `  .${it.directive} ${it.operands.join(',')}`;
        case 'inst':
          return `  .${it.inst} ${it.operands.join(',')}`;
        case 'label':
          return `${it.text}:`;
      }
    })
    .join('\n');
}
