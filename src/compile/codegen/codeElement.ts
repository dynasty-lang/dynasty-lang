import { AsmNode } from './assembly';
import { TypeDesc, CallableType } from '../types';

export interface Variable {
  name: string;
  type: TypeDesc;
  defaultValue?: Uint8Array;
  mutable?: boolean;
}

export interface Callable {
  name: string;
  type: CallableType;
  nodes: AsmNode[];
  locals: Namespace;
}

export interface Namespace {
  scope?: 'function' | 'local' | 'global';

  children?: Namespace[];

  types: { [key: string]: TypeDesc };
  callables: { [key: string]: Callable };
  variables: { [key: string]: Variable };
}
