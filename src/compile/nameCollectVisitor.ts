import {
  AstNode,
  DnkBlock,
  DnkBlockExpr,
  DnkConstDecl,
  dnkEmpty,
  DnkFnDecl,
  DnkFor,
  DnkTypeDecl,
  DnkVarDecl,
  DnkWhile,
  DynastyNodeKind,
  TypeDescriptorNode,
} from '../ast/astNode';
import { AstNodeVisitor } from './astNodeVisitor';
import { Namespace } from './codegen/codeElement';
import {
  float32,
  float64,
  int16,
  int32,
  int64,
  int8,
  TypeDesc,
  void_,
} from './types';

class NameCollectVisitor extends AstNodeVisitor<Namespace> {
  visit(node: AstNode): Namespace {
    switch (node.kind) {
      case 'dnkBlock':
        return this.visitDnkBlock(node);
      case 'dnkBlockExpr':
        return this.visitDnkBlockExpr(node);
      case 'dnkFor':
        return this.visitDnkFor(node);
      case 'dnkWhile':
        return this.visitDnkWhile(node);
      case 'dnkTypeDecl':
        return this.visitDnkTypeDecl(node);
      case 'dnkFnDecl':
        return this.visitDnkFnDecl(node);
      case 'dnkVarDecl':
        return this.visitDnkVarDecl(node);
      case 'dnkConstDecl':
        return this.visitDnkConstDecl(node);
      default:
        return this.visitDefault(node);
    }
  }

  protected canVisitThis(node: AstNode): boolean {
    return ([
      'dnkTop',
      'dnkBlock',
      'dnkBlockExpr',
      'dnkFor',
      'dnkWhile',
      'dnkTypeDecl',
      'dnkFnDecl',
      'dnkIfExpr',
      'dnkVarDecl',
      'dnkConstDecl',
      'dnkOperations',
      'dnkArrayAccessOp',
      'dnkAssignOp',
      'dnkPar',
    ] as DynastyNodeKind[]).includes(node.kind);
  }

  visitDnkBlock(node: DnkBlock): Namespace {
    const scope = this.visitChildren(node.children).reduce(
      (prev, next) => {
        return {
          callables: { ...prev.callables, ...next.callables },
          variables: { ...prev.variables, ...next.variables },
          types: { ...prev.types, ...next.types },
          children: [...(prev.children || []), ...(next.children || [])],
        };
      },
      { callables: {}, types: {}, variables: {} }
    );

    return { callables: {}, types: {}, variables: {}, children: [scope] };
  }

  visitDnkBlockExpr(node: DnkBlockExpr): Namespace {
    if (node.kind !== 'dnkBlockExpr') {
      throw new Error('assertion error: node is not a dnkBlockExpr.');
    }
    return this.visitDnkBlock(node.children[0]);
  }

  visitDnkFor(node: DnkFor): Namespace {
    if (node.kind !== 'dnkFor') {
      throw new Error('assertion error: node is not a dnkFor.');
    }
    const scope = this.visit(node.children[0]);

    scope.variables[node.value[0].value] = {
      name: node.value[0].value,
      type: {
        kind: 'unknown',
        from: node.value[1],
        where:
          node.value[1].kind === 'dnkCallExpr'
            ? 'return'
            : node.value[1].kind === 'dnkIdent'
            ? 'variable'
            : 'expression',
      },
    };

    return { callables: {}, types: {}, variables: {}, children: [scope] };
  }

  visitDnkWhile(node: DnkWhile): Namespace {
    if (node.kind !== 'dnkWhile') {
      throw new Error('assertion error: node is not a dnkWhile.');
    }
    return this.visit(node.children[0]);
  }

  visitDnkTypeDecl(node: DnkTypeDecl): Namespace {
    return {
      callables: {},
      types: {
        [node.value.value]: this.getTypeFromTypeDesc(node.children[0]),
      },
      variables: {},
    };
  }

  visitDnkFnDecl(node: DnkFnDecl): Namespace {
    return {
      callables: {
        [node.value[0].value.join('.')]: {
          locals: this.visitChildren(node.children).reduce(
            (prev, next) => {
              return {
                callables: { ...prev.callables, ...next.callables },
                variables: { ...prev.variables, ...next.variables },
                types: { ...prev.types, ...next.types },
                children: [...(prev.children || []), ...(next.children || [])],
              };
            },
            { callables: {}, types: {}, variables: {} }
          ),
          name: node.value[0].value[node.value[0].value.length - 1],
          nodes: [],
          type: {
            kind: 'callable',
            params:
              node.value[1].kind === 'dnkParamList'
                ? node.value[1].children.map((it) => ({
                    name: it.children[0].value,
                    type: this.getTypeFromTypeDesc(it.children[1]),
                  }))
                : [],
            return_type:
              node.value[2].kind === 'dnkEmpty'
                ? void_
                : this.getTypeFromTypeDesc(node.value[2]),
          },
        },
      },
      types: {},
      variables: {},
    };
  }

  visitDnkVarDecl(node: DnkVarDecl): Namespace {
    let varType: TypeDesc;

    if (node.value.kind === 'dnkEmpty') {
      const child1 = node.children[1];
      switch (child1.kind) {
        case 'dnkEmpty':
          throw new Error('Could not inference the type.');
        case 'dnkCallExpr':
          varType = { kind: 'unknown', from: child1, where: 'return' };
          break;
        case 'dnkStrLit':
          varType = { kind: 'reference', name: 'system.string' };
          break;
        case 'dnkIntLit':
          switch (child1.value[0]) {
            case '8':
              varType = int8;
              break;
            case '16':
              varType = int16;
              break;
            case '32':
              varType = int32;
              break;
            case '64':
              varType = int64;
              break;
            default:
              varType = int32;
              break;
          }
          break;
        case 'dnkFloatLit':
          varType = child1.value[0] === '64' ? float64 : float32;
          break;
        case 'dnkIdent':
          varType = { kind: 'unknown', from: child1, where: 'variable' };
          break;
        default:
          varType = { kind: 'unknown', from: child1, where: 'expression' };
          break;
      }
    } else {
      varType = this.getTypeFromTypeDesc(node.value);
    }

    return {
      callables: {},
      types: {},
      variables: {
        [node.children[0].value]: {
          name: node.children[0].value,
          type: varType,
        },
      },
    };
  }

  visitDnkConstDecl(node: DnkConstDecl): Namespace {
    return { callables: {}, types: {}, variables: {} };
  }

  visitDefault(node: AstNode): Namespace {
    return this.visitChildren(
      (node.children as AstNode[]).map((it) => it || dnkEmpty)
    ).reduce(
      (prev, next) => {
        return {
          callables: { ...prev.callables, ...next.callables },
          variables: { ...prev.variables, ...next.variables },
          types: { ...prev.types, ...next.types },
          children: [...(prev.children || []), ...(next.children || [])],
        };
      },
      { callables: {}, types: {}, variables: {} }
    );
  }

  private getTypeFromTypeDesc(desc: TypeDescriptorNode): TypeDesc {
    switch (desc.kind) {
      case 'dnkFqn':
        return {
          kind: 'reference',
          name: desc.value.join('.'),
        };
      case 'dnkTypeLit':
        return {
          kind: 'object',
          supertype:
            desc.value.kind === 'dnkFqn'
              ? { kind: 'reference', name: desc.value.value.join('.') }
              : undefined,
          members: desc.children.map((it) => ({
            name: it.children[0].value,
            typedesc: this.getTypeFromTypeDesc(it.children[1]),
          })),
        };
      case 'dnkArrayTypeLit':
        return {
          kind: 'array',
          base_type: this.getTypeFromTypeDesc(desc.children[0]),
          dimensions: desc.value.map((it) =>
            it.kind === 'dnkIntLit' ? it.value[1] : -1
          ),
        };
    }
  }
}
