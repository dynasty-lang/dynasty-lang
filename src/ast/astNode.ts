export type NodeKind =
  | 'dnkTop'
  | 'dnkIdent'
  | 'dnkBlock'
  | 'dnkBlockExpr'
  | 'dnkFor'
  | 'dnkWhile'
  | 'dnkTypeDecl'
  | 'dnkTypeDesc'
  | 'dnkTypeLit'
  | 'dnkMemberItem'
  | 'dnkArrayTypeLit'
  | 'dnkImport'
  | 'dnkImportFrom'
  | 'dnkImportList'
  | 'dnkImportName'
  | 'dnkFnDecl'
  | 'dnkIfExpr'
  | 'dnkVarDecl'
  | 'dnkConstDecl'
  | 'dnkParamList'
  | 'dnkParamItem'
  | 'dnkReturn'
  | 'dnkCallExpr'
  | 'dnkArgList'
  | 'dnkNamedArg'
  | 'dnkNamedArgList'
  | 'dnkFloatLit'
  | 'dnkIntLit'
  | 'dnkStrLit'
  | 'dnkOperations'
  | 'dnkMemberAccessOp'
  | 'dnkArrayAccessOp'
  | 'dnkAssignOp'
  | 'dnkPar'
  | 'dnkFqn'
  | 'dnkStmt'
  | 'dnkEmpty';

export const unaryOperators = { not: 1 };
export const biaryOperators = {
  '**': 6,
  '*': 5,
  '/': 5,
  mod: 5,
  '+': 4,
  '-': 4,
  '&': 3,
  '|': 3,
  '^': 3,
  '<<': 2,
  '>>': 2,
  '>': 1,
  '>=': 1,
  '==': 1,
  '!=': 1,
  '<=': 1,
  '<': 1,
  and: 0,
  or: 0,
  xor: 0,
};

export type UnaryOperators = keyof typeof unaryOperators;
export type BiaryOperators = keyof typeof biaryOperators;
export type Operations = BiaryOperators | UnaryOperators;
export type NodeValue = AstNode | string | number | undefined;

export interface AstNode {
  kind: NodeKind;
  value?: NodeValue | NodeValue[];
  children: AstNode[];
}

export const dnkEmpty: AstNode = { kind: 'dnkEmpty', children: [] };

export function dumpNodeValue(value: NodeValue | NodeValue[]): string {
  if (value instanceof Array) {
    return value.map((it) => dumpNodeValue(it)).join(', ');
  }
  if (typeof value === 'object') {
    let node = value as AstNode;
    switch (node.kind) {
      case 'dnkOperations':
        if (node.kind in unaryOperators) {
          return `${node.value} ${dumpNodeValue(node.children[0])}`;
        }
        return `(${dumpNodeValue(node.children[0])} ${
          node.value
        } ${dumpNodeValue(node.children[1])})`;
      case 'dnkFqn':
        return ((node.value as string[]) || []).join('.');
      case 'dnkIdent':
        return node.value as string;
      case 'dnkIntLit':
        return (node.value as number).toString();
      case 'dnkFloatLit':
        return (node.value as number).toString();
      case 'dnkStrLit':
        return JSON.stringify(node.value as string);
      default:
        return `<Node: ${node.kind}>`;
    }
  }

  return (value || '').toString();
}

export function dumpAst(node: AstNode, depth = 0): void {
  let details = '';
  if (node.value) {
    details = dumpNodeValue(node.value);
  }
  console.log(`${'  '.repeat(depth)}${node.kind} ${details || ''}`);
  node.children.forEach((it) => {
    dumpAst(it, depth + 1);
  });
}
