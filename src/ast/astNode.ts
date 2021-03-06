import { AstNode, DnkEmpty, unaryOperators } from './nodeKind';

export { assignOperators, biaryOperators, unaryOperators } from './nodeKind';
export type {
  AssignOperators,
  AstNode,
  BiaryOperators,
  DnkArgList,
  DnkArrayAccessOp,
  DnkArrayLit,
  DnkArrayTypeLit,
  DnkBlockExpr,
  DnkCallExpr,
  DnkEmpty,
  DnkFloatLit,
  DnkFqn,
  DnkIdent,
  DnkIfExpr,
  DnkImportList,
  DnkImportName,
  DnkIntLit,
  DnkMemberAccessOp,
  DnkMemberItem,
  DnkNamedArg,
  DnkObjectLit,
  DnkObjectLitMember,
  DnkOperations,
  DnkPar,
  DnkParamItem,
  DnkParamList,
  DnkStrLit,
  DnkTypeLit,
  ExpressionNode,
  Operations,
  TypeDescriptorNode,
  UnaryOperators,
} from './nodeKind';

export type DynastyNodeKind = AstNode['kind'];

export type NodeValue = AstNode | string | number | undefined;

export const dnkEmpty: DnkEmpty = { kind: 'dnkEmpty', children: [] };

export function dumpNodeValue(
  value: NodeValue | NodeValue[],
  literal?: 'str' | 'number'
): string {
  if (literal === 'str') {
    if (!(value instanceof Array)) {
      throw new Error('assertion error');
    }
    return `${value[1] == 'r' ? 'r' : ''}"${value[1]}"`;
  } else if (literal === 'number') {
    return (value || 'NaN').toString();
  }
  if (value instanceof Array) {
    return value.map((it) => dumpNodeValue(it)).join(', ');
  }
  if (typeof value === 'object') {
    let node = value as AstNode;
    switch (node.kind) {
      case 'dnkOperations':
      case 'dnkAssignOp':
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
        return `${node.value[1] == 'r' ? 'r' : ''}"${node.value[1]}"`;
      case 'dnkArrayAccessOp':
        return `${dumpNodeValue(node.children[0])}[${dumpNodeValue(
          node.children[1]
        )}]`;
      case 'dnkArrayTypeLit':
        return `${dumpNodeValue(node.children[0])}${(node.value instanceof Array
          ? node.value
          : []
        ).map((it: any) => `[${dumpNodeValue(it)}]`)}`;
      case 'dnkParamList':
        return `(${node.children.map((it) => dumpNodeValue(it)).join()})`;
      case 'dnkParamItem':
        return `${dumpNodeValue(node.children[0])}: ${dumpNodeValue(
          node.children[1]
        )}`;
      case 'dnkEmpty':
        return '';
      case 'dnkCallExpr':
        return `${dumpNodeValue(node.value)}(${node.children
          .map((it) => dumpNodeValue(it))
          .join(', ')})`;
      case 'dnkNamedArg':
        return `${dumpNodeValue(node.children[0])}: ${dumpNodeValue(
          node.children[1]
        )}`;
      default:
        return `<Node: ${node.kind}>`;
    }
  }

  return (value || '').toString();
}

export function dumpAst(node: AstNode, depth = 0): void {
  let details = '';
  if ('value' in node) {
    details = dumpNodeValue(
      node.value,
      node.kind === 'dnkStrLit' ? 'str' : undefined
    );
  }
  console.log(`${'  '.repeat(depth)}${node.kind} ${details || ''}`);
  node.children.forEach((it: any) => {
    dumpAst(it, depth + 1);
  });
}
