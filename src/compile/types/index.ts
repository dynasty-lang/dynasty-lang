import { ExpressionNode } from '../../ast/astNode';

export type BuiltinTypes =
  | 'int'
  | 'int8'
  | 'int16'
  | 'int32'
  | 'int64'
  | 'uint'
  | 'uint8'
  | 'uint16'
  | 'uint32'
  | 'uint64'
  | 'float'
  | 'float32'
  | 'float64'
  | 'void';

export type TypeDesc =
  | BuiltinType
  | ObjectType
  | UnionType
  | ArrayType
  | EnumType
  | CallableType
  | Alias
  | UnknownType
  | TypeReference;

export interface BuiltinType {
  kind: 'builtin';
  type: BuiltinTypes;
  length: number;
}

export interface TypeReference {
  kind: 'reference';
  name: string;
}

export interface ObjectType {
  kind: 'object';
  supertype?: ObjectType | TypeReference;
  members: ObjectMember[];
}

interface ObjectMember {
  name: string;
  typedesc: TypeDesc;
}

export interface UnionType {
  kind: 'union';
  types: TypeDesc[];
}

export interface ArrayType {
  kind: 'array';
  base_type: TypeDesc;
  dimensions: number[];
}

export interface Alias {
  kind: 'alias';
  original_type: TypeDesc;
}

export interface EnumType {
  kind: 'enum';
  members: EnumMember[];
}

interface EnumMember {
  name: string;
  ord: number;
  value: TypeDesc;
}

export interface CallableType {
  kind: 'callable';
  params: Parameter[];
  return_type: TypeDesc;
}

export interface UnknownType {
  kind: 'unknown';
  from: ExpressionNode;
  where: 'return' | 'variable' | 'expression';
}

interface Parameter {
  name: string;
  type: TypeDesc;
}

export function isBuiltinType(type: TypeDesc): type is BuiltinType {
  return type.kind === 'builtin';
}

export function isObjectType(type: TypeDesc): type is ObjectType {
  return type.kind === 'object';
}

export function isUnionType(type: TypeDesc): type is UnionType {
  return type.kind === 'union';
}

export function isArrayType(type: TypeDesc): type is ArrayType {
  return type.kind === 'array';
}

export function isEnumType(type: TypeDesc): type is EnumType {
  return type.kind === 'enum';
}

export function isCallableType(type: TypeDesc): type is CallableType {
  return type.kind === 'callable';
}

export function isAlias(type: TypeDesc): type is Alias {
  return type.kind === 'alias';
}

export function isUnknown(type: TypeDesc): type is UnknownType {
  return type.kind === 'unknown';
}

export {
  float,
  float32,
  float64,
  int,
  int8,
  int16,
  int32,
  int64,
  uint,
  uint8,
  uint16,
  uint32,
  uint64,
  void_,
} from './builtinTypes';
