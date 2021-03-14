export const unaryOperators = { not: 1 };

export const assignOperators = {
  '=': 0,
};

export const biaryOperators = {
  '**': 7,
  '*': 6,
  '/': 6,
  mod: 6,
  '+': 5,
  '-': 5,
  '&': 4,
  '|': 4,
  '^': 4,
  '<<': 3,
  '>>': 3,
  '>': 2,
  '>=': 2,
  '==': 2,
  '!=': 2,
  '<=': 2,
  '<': 2,
  and: 1,
  or: 1,
  xor: 1,
};

export type UnaryOperators = keyof typeof unaryOperators;

export type BiaryOperators = keyof typeof biaryOperators;

export type AssignOperators = keyof typeof assignOperators;

export type Operations = BiaryOperators | UnaryOperators | AssignOperators;

export type DnkIdent = { kind: 'dnkIdent'; value: string; children: [] };

export type DnkFqn = { kind: 'dnkFqn'; value: string[]; children: [] };

export type DnkMemberItem = {
  kind: 'dnkMemberItem';
  children: [DnkIdent, TypeDescriptorNode];
};

export type DnkEmpty = { kind: 'dnkEmpty'; children: [] };

export type DnkImportList = {
  kind: 'dnkImportList';
  value: DnkIdent | DnkEmpty;
  children: DnkImportName[];
};

export type DnkImportName = {
  kind: 'dnkImportName';
  children: [DnkIdent, DnkIdent | undefined];
};

export type DnkParamList = {
  kind: 'dnkParamList';
  children: DnkParamItem[];
};

export type DnkParamItem = {
  kind: 'dnkParamItem';
  children: [DnkIdent, AstNode];
};

export type DnkArgList = {
  kind: 'dnkArgList';
  children: (ExpressionNode | DnkNamedArg)[];
};

export type DnkNamedArg = {
  kind: 'dnkNamedArg';
  children: [DnkIdent, ExpressionNode];
};

export type DnkObjectLitMember = {
  kind: 'dnkObjectLitMember';
  value: string;
  children: [ExpressionNode];
};

export type DnkCallExpr = {
  kind: 'dnkCallExpr';
  value: ExpressionNode | DnkFqn;
  children: (ExpressionNode | DnkNamedArg)[];
};
export type DnkBlockExpr = { kind: 'dnkBlockExpr'; children: [AstNode] };

export type DnkIfExpr = {
  kind: 'dnkIfExpr';
  value: ExpressionNode;
  children: [ExpressionNode, ExpressionNode | undefined];
};

export type DnkFloatLit = { kind: 'dnkFloatLit'; value: number; children: [] };

export type DnkIntLit = { kind: 'dnkIntLit'; value: number; children: [] };

export type DnkStrLit = {
  kind: 'dnkStrLit';
  value: ['r' | 's', string];
  children: [];
};

export type DnkObjectLit = {
  kind: 'dnkObjectLit';
  children: DnkObjectLitMember[];
};

export type DnkArrayLit = { kind: 'dnkArrayLit'; children: ExpressionNode[] };

export type DnkArrayTypeLit = {
  kind: 'dnkArrayTypeLit';
  value: AstNode[];
  children: [TypeDescriptorNode];
};

export type DnkTypeLit = {
  kind: 'dnkTypeLit';
  value: DnkFqn | DnkEmpty;
  children: DnkMemberItem[];
};

export type DnkOperations = {
  kind: 'dnkOperations';
  value: Operations | DnkEmpty;
  children: [ExpressionNode, ExpressionNode | undefined];
};

export type DnkMemberAccessOp = {
  kind: 'dnkMemberAccessOp';
  children: [ExpressionNode, DnkIdent];
};

export type DnkArrayAccessOp = {
  kind: 'dnkArrayAccessOp';
  children: [ExpressionNode, ExpressionNode];
};

export type DnkPar = { kind: 'dnkPar'; children: [ExpressionNode] };

export type ExpressionNode =
  | DnkIdent
  | DnkFloatLit
  | DnkIntLit
  | DnkStrLit
  | DnkObjectLit
  | DnkArrayLit
  | DnkIdent
  | DnkBlockExpr
  | DnkIfExpr
  | DnkCallExpr
  | DnkOperations
  | DnkMemberAccessOp
  | DnkArrayAccessOp
  | DnkPar
  | DnkEmpty;

export type TypeDescriptorNode = DnkFqn | DnkTypeLit | DnkArrayTypeLit;

export type AstNode =
  | TypeDescriptorNode
  | ExpressionNode
  | { kind: 'dnkTop'; children: AstNode[] }
  | { kind: 'dnkBlock'; children: AstNode[] }
  | { kind: 'dnkFor'; value: [DnkIdent, ExpressionNode]; children: [AstNode] }
  | { kind: 'dnkWhile'; value: ExpressionNode; children: [AstNode] }
  | { kind: 'dnkTypeDecl'; value: DnkIdent; children: [TypeDescriptorNode] }
  | DnkMemberItem
  | { kind: 'dnkImport'; children: [DnkFqn, DnkIdent | undefined] }
  | { kind: 'dnkImportFrom'; value: DnkFqn; children: [DnkImportList] }
  | DnkImportList
  | DnkImportName
  | {
      kind: 'dnkFnDecl';
      value: [DnkFqn, DnkParamList | DnkEmpty, AstNode];
      children: AstNode[];
    }
  | DnkParamList
  | DnkParamItem
  | {
      kind: 'dnkVarDecl';
      value: AstNode | DnkEmpty;
      children: [DnkIdent, AstNode | DnkEmpty];
    }
  | {
      kind: 'dnkConstDecl';
      value: AstNode | DnkEmpty;
      children: [DnkIdent, AstNode | DnkEmpty];
    }
  | { kind: 'dnkReturn'; children: [AstNode] }
  | { kind: 'dnkYield'; children: [AstNode] }
  | { kind: 'dnkBreak'; children: [] }
  | { kind: 'dnkContinue'; children: [] }
  | DnkArgList
  | DnkNamedArg
  | DnkObjectLitMember
  | {
      kind: 'dnkAssignOp';
      value: AssignOperators;
      children: [AstNode, AstNode];
    };
