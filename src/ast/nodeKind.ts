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

export type DnkTop = { kind: 'dnkTop'; children: AstNode[] };
export type DnkBlock = { kind: 'dnkBlock'; children: AstNode[] };

export type DnkConstDecl = {
  kind: 'dnkConstDecl';
  value: TypeDescriptorNode | DnkEmpty;
  children: [DnkIdent, ExpressionNode | DnkEmpty];
};
export type DnkFnDecl = {
  kind: 'dnkFnDecl';
  value: [DnkFqn, DnkParamList | DnkEmpty, TypeDescriptorNode | DnkEmpty];
  children: AstNode[];
};
export type DnkParamList = { kind: 'dnkParamList'; children: DnkParamItem[] };
export type DnkParamItem = {
  kind: 'dnkParamItem';
  children: [DnkIdent, TypeDescriptorNode];
};
export type DnkImport = {
  kind: 'dnkImport';
  children: [DnkFqn, DnkIdent | undefined];
};
export type DnkImportFrom = {
  kind: 'dnkImportFrom';
  value: DnkFqn;
  children: [DnkImportList];
};
export type DnkImportList = {
  kind: 'dnkImportList';
  value: DnkIdent | DnkEmpty;
  children: DnkImportName[];
};
export type DnkImportName = {
  kind: 'dnkImportName';
  children: [DnkIdent, DnkIdent | undefined];
};
export type DnkTypeDecl = {
  kind: 'dnkTypeDecl';
  value: DnkIdent;
  children: [TypeDescriptorNode];
};
export type DnkVarDecl = {
  kind: 'dnkVarDecl';
  value: TypeDescriptorNode | DnkEmpty;
  children: [DnkIdent, ExpressionNode | DnkEmpty];
};

export type DnkTypeLit = {
  kind: 'dnkTypeLit';
  value: DnkFqn | DnkEmpty;
  children: DnkMemberItem[];
};
export type DnkMemberItem = {
  kind: 'dnkMemberItem';
  children: [DnkIdent, TypeDescriptorNode];
};
export type DnkArrayTypeLit = {
  kind: 'dnkArrayTypeLit';
  value: AstNode[];
  children: [TypeDescriptorNode];
};

export type DnkFqn = { kind: 'dnkFqn'; value: string[]; children: [] };
export type DnkIdent = { kind: 'dnkIdent'; value: string; children: [] };

export type DnkArrayAccessOp = {
  kind: 'dnkArrayAccessOp';
  children: [ExpressionNode, ExpressionNode];
};
export type DnkAssignOp = {
  kind: 'dnkAssignOp';
  value: AssignOperators;
  children: [AstNode, AstNode];
};
export type DnkBlockExpr = { kind: 'dnkBlockExpr'; children: [DnkBlock] };
export type DnkCallExpr = {
  kind: 'dnkCallExpr';
  value: ExpressionNode | DnkFqn;
  children: (ExpressionNode | DnkNamedArg)[];
};
export type DnkArgList = {
  kind: 'dnkArgList';
  children: (ExpressionNode | DnkNamedArg)[];
};
export type DnkNamedArg = {
  kind: 'dnkNamedArg';
  children: [DnkIdent, ExpressionNode];
};
export type DnkMemberAccessOp = {
  kind: 'dnkMemberAccessOp';
  children: [ExpressionNode, DnkIdent];
};
export type DnkOperations = {
  kind: 'dnkOperations';
  value: Operations | DnkEmpty;
  children: [ExpressionNode, ExpressionNode | undefined];
};
export type DnkPar = { kind: 'dnkPar'; children: [ExpressionNode] };

export type DnkArrayLit = { kind: 'dnkArrayLit'; children: ExpressionNode[] };
export type DnkFloatLit = {
  kind: 'dnkFloatLit';
  value: ['32' | '64' | '', number];
  children: [];
};
export type DnkIntLit = {
  kind: 'dnkIntLit';
  value: ['8' | '16' | '32' | '64' | '', number];
  children: [];
};
export type DnkObjectLit = {
  kind: 'dnkObjectLit';
  children: DnkObjectLitMember[];
};
export type DnkObjectLitMember = {
  kind: 'dnkObjectLitMember';
  value: string;
  children: [ExpressionNode];
};
export type DnkStrLit = {
  kind: 'dnkStrLit';
  value: ['r' | 's', string];
  children: [];
};

export type DnkFor = {
  kind: 'dnkFor';
  value: [DnkIdent, ExpressionNode];
  children: [AstNode];
};
export type DnkIfExpr = {
  kind: 'dnkIfExpr';
  value: ExpressionNode;
  children: [ExpressionNode, ExpressionNode | undefined];
};
export type DnkWhile = {
  kind: 'dnkWhile';
  value: ExpressionNode;
  children: [AstNode];
};

export type DnkBreak = { kind: 'dnkBreak'; children: [] };
export type DnkContinue = { kind: 'dnkContinue'; children: [] };
export type DnkReturn = { kind: 'dnkReturn'; children: [AstNode] };
export type DnkYield = { kind: 'dnkYield'; children: [AstNode] };

export type DnkEmpty = { kind: 'dnkEmpty'; children: [] };

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
  | DnkTop
  | DnkBlock
  | DnkFor
  | DnkWhile
  | DnkTypeDecl
  | DnkMemberItem
  | DnkImport
  | DnkImportFrom
  | DnkImportList
  | DnkImportName
  | DnkFnDecl
  | DnkParamList
  | DnkParamItem
  | DnkVarDecl
  | DnkConstDecl
  | DnkReturn
  | DnkYield
  | DnkBreak
  | DnkContinue
  | DnkArgList
  | DnkNamedArg
  | DnkObjectLitMember
  | DnkAssignOp;
