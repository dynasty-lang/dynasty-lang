export type NodeKind =
  "dnkTop" |
  "dnkIdent" |
  "dnkBlock" |
  "dnkBlockExpr" |
  "dnkFor" |
  "dnkWhile" |
  "dnkTypeDecl" |
  "dnkTypeDesc" |
  "dnkTypeLit" |
  "dnkMemberItem" |
  "dnkArrayTypeLit" |
  "dnkImport" |
  "dnkImportFrom" |
  "dnkImportList" |
  "dnkImportName" |
  "dnkFnDecl" |
  "dnkIfExpr" |
  "dnkVarDecl" |
  "dnkConstDecl" |
  "dnkParamList" |
  "dnkParamItem" |
  "dnkReturn" |
  "dnkCallExpr" |
  "dnkArgList" |
  "dnkNamedArg" |
  "dnkNamedArgList" |
  "dnkFloatLit" |
  "dnkIntLit" |
  "dnkStrLit" |
  "dnkOperations" |
  "dnkPar" |
  "dnkFqn" |
  "dnkStmt" |
  "dnkEmpty";

type NodeValue = Node | string | number | undefined;

export interface Node {
  kind: NodeKind;
  value?: NodeValue | NodeValue[];
  children: Node[];
}

export const dnkEmpty: Node = { kind: 'dnkEmpty', children: [] }
