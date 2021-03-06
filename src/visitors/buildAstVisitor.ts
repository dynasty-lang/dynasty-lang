import { AbstractParseTreeVisitor } from 'antlr4ts/tree/AbstractParseTreeVisitor';
import { ParseTree } from 'antlr4ts/tree/ParseTree';
import { RuleNode } from 'antlr4ts/tree/RuleNode';
import {
  dnkEmpty,
  AstNode,
  Operations,
  unaryOperators,
  biaryOperators,
  BiaryOperators,
  DnkBlock,
  DnkFqn,
  DnkIdent,
  TypeDescriptorNode,
  DnkMemberItem,
  DnkImportList,
  DnkImportName,
  DnkParamList,
  DnkParamItem,
  DnkObjectLitMember,
} from '../ast/astNode';
import { DnkNamedArg, ExpressionNode, UnaryOperators } from '../ast/nodeKind';
import * as lang from '../generated/DynastyLangParser';
import { DynastyLangVisitor } from '../generated/DynastyLangVisitor';

type FormulaElement = AstNode | Operations;

function isOperationsContext(node: ParseTree): node is lang.OperationsContext {
  return '_op' in node;
}

export class BuildAstVisitor
  extends AbstractParseTreeVisitor<AstNode>
  implements DynastyLangVisitor<AstNode> {
  // #region Node Transformations
  visitTop(ctx: lang.TopContext): AstNode {
    ctx.children!.pop();
    return {
      kind: 'dnkTop',
      children: this.aggregateChildren(ctx),
    };
  }
  visitBlock_statements(ctx: lang.Block_statementsContext): AstNode {
    return {
      kind: 'dnkBlock',
      children: this.aggregateChildren(ctx),
    };
  }
  visitStmt(ctx: lang.StmtContext): AstNode {
    return this.visit(ctx.getChild(0));
  }
  visitIdent(ctx: lang.IdentContext): AstNode {
    return {
      kind: 'dnkIdent',
      value: ctx._name.text!,
      children: [],
    };
  }
  visitToplevel_decl(ctx: lang.Toplevel_declContext): AstNode {
    return this.visit(ctx.getChild(0));
  }
  visitDeclaration(ctx: lang.DeclarationContext): AstNode {
    return this.visit(ctx.getChild(0));
  }
  visitBlock(ctx: lang.BlockContext): AstNode {
    return this.visit(ctx.getChild(1));
  }
  visitIf_stmt(ctx: lang.If_stmtContext): AstNode {
    return this.visit(ctx.getChild(0));
  }
  visitFor_stmt(ctx: lang.For_stmtContext): AstNode {
    return {
      kind: 'dnkFor',
      value: [
        this.visit(ctx._name) as DnkIdent,
        this.visit(ctx._iter) as ExpressionNode,
      ],
      children: [this.visit(ctx._stmts)],
    };
  }
  visitWhile_stmt(ctx: lang.While_stmtContext): AstNode {
    return {
      kind: 'dnkWhile',
      value: this.visit(ctx._cond) as ExpressionNode,
      children: [this.visit(ctx._stmts)],
    };
  }
  visitType_decl(ctx: lang.Type_declContext): AstNode {
    return {
      kind: 'dnkTypeDecl',
      value: this.visit(ctx._name) as DnkIdent,
      children: [this.visit(ctx._desc) as TypeDescriptorNode],
    };
  }
  visitType_desc(ctx: lang.Type_descContext): AstNode {
    return this.visit(ctx.getChild(0));
  }
  visitType_desc_san(ctx: lang.Type_desc_sanContext): AstNode {
    return this.visit(ctx.getChild(0));
  }
  visitType_lit(ctx: lang.Type_litContext): AstNode {
    return {
      kind: 'dnkTypeLit',
      value:
        (ctx._super_ && (this.visit(ctx._super_) as DnkFqn | undefined)) ||
        dnkEmpty,
      children: this.aggregateChildren(ctx._members) as DnkMemberItem[],
    };
  }
  visitMember_list(ctx: lang.Member_listContext): AstNode {
    throw new Error('assertion error: this is unreachable code.');
  }
  visitMember_item(ctx: lang.Member_itemContext): AstNode {
    return {
      kind: 'dnkMemberItem',
      children: [
        this.visit(ctx._name) as DnkIdent,
        this.visit(ctx._desc) as TypeDescriptorNode,
      ],
    };
  }
  visitArray_type_lit(ctx: lang.Array_type_litContext): AstNode {
    return {
      kind: 'dnkArrayTypeLit',
      value: ctx._dims.map(
        (it) => (it._length && this.visit(it._length)) || dnkEmpty
      ),
      children: [this.visit(ctx.getChild(0)) as TypeDescriptorNode],
    };
  }
  visitImport_decl(ctx: lang.Import_declContext): AstNode {
    return this.visit(ctx.getChild(0));
  }
  visitImport_stmt(ctx: lang.Import_stmtContext): AstNode {
    return {
      kind: 'dnkImport',
      children: [
        this.visit(ctx._module) as DnkFqn,
        ctx._alt && (this.visit(ctx._alt) as DnkIdent),
      ],
    };
  }
  visitImport_from(ctx: lang.Import_fromContext): AstNode {
    return {
      kind: 'dnkImportFrom',
      value: this.visit(ctx._module) as DnkFqn,
      children: [this.visit(ctx._list) as DnkImportList],
    };
  }
  visitImport_list(ctx: lang.Import_listContext): AstNode {
    return {
      kind: 'dnkImportList',
      value:
        (ctx._rest && (this.visit(ctx._rest._name) as DnkIdent | undefined)) ||
        dnkEmpty,
      children: (ctx._names || []).map((it) =>
        this.visit(it)
      ) as DnkImportName[],
    };
  }
  visitImport_rest(ctx: lang.Import_restContext): AstNode {
    throw new Error('assertion error: this is unreachable code.');
  }
  visitImport_name(ctx: lang.Import_nameContext): AstNode {
    return {
      kind: 'dnkImportName',
      children: [
        this.visit(ctx._name) as DnkIdent,
        ctx._alt && (this.visit(ctx._alt) as DnkIdent),
      ],
    };
  }
  visitFn_decl(ctx: lang.Fn_declContext): AstNode {
    return {
      kind: 'dnkFnDecl',
      value: [
        this.visit(ctx._name) as DnkFqn,
        (ctx._params &&
          (this.visit(ctx._params) as DnkParamList | undefined)) ||
          dnkEmpty,
        (ctx._ret_type &&
          (this.visit(ctx._ret_type) as TypeDescriptorNode | undefined)) ||
          dnkEmpty,
      ],
      children: [this.visit(ctx._stmts)],
    };
  }
  visitBlock_expr(ctx: lang.Block_exprContext): AstNode {
    return {
      kind: 'dnkBlockExpr',
      children: [this.visit(ctx.getChild(0)) as DnkBlock],
    };
  }
  visitIf_expr(ctx: lang.If_exprContext): AstNode {
    return {
      kind: 'dnkIfExpr',
      value: this.visit(ctx._cond) as ExpressionNode,
      children: [
        this.visit(ctx._then),
        (ctx._else_ && [this.visit(ctx._else_)]) || [],
      ].flat() as [ExpressionNode, ExpressionNode | undefined],
    };
  }
  visitVar_decl(ctx: lang.Var_declContext): AstNode {
    return {
      kind: 'dnkVarDecl',
      value:
        (ctx._type_ &&
          (this.visit(ctx._type_) as TypeDescriptorNode | undefined)) ||
        dnkEmpty,
      children: [
        this.visit(ctx._name) as DnkIdent,
        (ctx._value &&
          (this.visit(ctx._value) as ExpressionNode | undefined)) ||
          dnkEmpty,
      ],
    };
  }
  visitConst_decl(ctx: lang.Const_declContext): AstNode {
    return {
      kind: 'dnkConstDecl',
      value:
        (ctx._type_ &&
          (this.visit(ctx._type_) as TypeDescriptorNode | undefined)) ||
        dnkEmpty,
      children: [
        this.visit(ctx._name) as DnkIdent,
        ((ctx._value && this.visit(ctx._value)) as
          | ExpressionNode
          | undefined) || dnkEmpty,
      ],
    };
  }
  visitPar_list(ctx: lang.Par_listContext): AstNode {
    return {
      kind: 'dnkParamList',
      children: (ctx._params || []).map((it) =>
        this.visit(it)
      ) as DnkParamItem[],
    };
  }
  visitPar_item(ctx: lang.Par_itemContext): AstNode {
    return {
      kind: 'dnkParamItem',
      children: [
        this.visit(ctx._name) as DnkIdent,
        this.visit(ctx._type) as TypeDescriptorNode,
      ],
    };
  }
  visitReturn_stmt(ctx: lang.Return_stmtContext): AstNode {
    return {
      kind: 'dnkReturn',
      children: [this.visit(ctx._value)],
    };
  }
  visitYield_stmt(ctx: lang.Yield_stmtContext): AstNode {
    return {
      kind: 'dnkYield',
      children: [this.visit(ctx._value)],
    };
  }
  visitCall_expr(ctx: lang.Call_exprContext): AstNode {
    return {
      kind: 'dnkCallExpr',
      value: this.visit(ctx._name) as DnkIdent,
      children: (ctx._args &&
        (this.collectArgList(ctx._args) as ExpressionNode[])) || [dnkEmpty],
    };
  }
  visitArg_list(ctx: lang.Arg_listContext): AstNode {
    throw new Error('assertion error: this is unreachable code.');
  }
  visitNamed_arg_list(ctx: lang.Named_arg_listContext): AstNode {
    throw new Error('assertion error: this is unreachable code.');
  }
  visitNamed_arg(ctx: lang.Named_argContext): AstNode {
    return {
      kind: 'dnkNamedArg',
      children: [
        this.visit(ctx._name) as DnkIdent,
        this.visit(ctx._value) as ExpressionNode,
      ],
    };
  }
  visitFloat_lit(ctx: lang.Float_litContext): AstNode {
    let { num, suff } =
      (ctx._value.text!.match(/^(?<num>.+)(?<suff>[df])?$/) || {}).groups || {};
    return {
      kind: 'dnkFloatLit',
      value: [suff === 'd' ? '64' : '32', parseFloat(num || 'NaN')],
      children: [],
    };
  }
  visitInt_lit(ctx: lang.Int_litContext): AstNode {
    let { num, suff } =
      (ctx._value.text!.match(/^(?<num>.+)(?:i(?<suff>8|16|32|64))?$/) || {})
        .groups || {};
    return {
      kind: 'dnkIntLit',
      value: [suff as '8', parseInt(num || 'NaN')],
      children: [],
    };
  }
  visitStr_lit(ctx: lang.Str_litContext): AstNode {
    return {
      kind: 'dnkStrLit',
      value: [
        (ctx._value.text || '').startsWith('r') ? 'r' : 's',
        (ctx._value.text || '').replace(/^r?"+/, '').replace(/"+$/, '') || '',
      ],
      children: [],
    };
  }

  visitPar(ctx: lang.ParContext): AstNode {
    return {
      kind: 'dnkPar',
      children: [this.visit(ctx._expression) as ExpressionNode],
    };
  }

  visitFqn(ctx: lang.FqnContext): AstNode {
    return {
      kind: 'dnkFqn',
      value: ctx._names.map((it) => it.text!),
      children: [],
    };
  }

  visitUnary_op(ctx: lang.Unary_opContext): AstNode {
    return {
      kind: 'dnkOperations',
      value: (ctx._op.text as Operations) || dnkEmpty,
      children: [this.visit(ctx._right), undefined] as [
        ExpressionNode,
        undefined
      ],
    };
  }

  visitExpr_if(ctx: lang.Expr_ifContext): AstNode {
    return this.visit(ctx.getChild(0));
  }
  visitExpr_par(ctx: lang.Expr_parContext): AstNode {
    return this.visit(ctx.getChild(0));
  }
  visitDirect_call_expr(ctx: lang.Direct_call_exprContext): AstNode {
    return {
      kind: 'dnkCallExpr',
      value: this.visit(ctx._callee) as ExpressionNode,
      children: ((ctx._args && this.aggregateChildren(ctx._args)) || [
        dnkEmpty,
      ]) as (ExpressionNode | DnkNamedArg)[],
    };
  }
  visitExpr_block(ctx: lang.Expr_blockContext): AstNode {
    return this.visit(ctx.getChild(0));
  }
  visitExpr_float(ctx: lang.Expr_floatContext): AstNode {
    return this.visit(ctx.getChild(0));
  }
  visitExpr_int(ctx: lang.Expr_intContext): AstNode {
    return this.visit(ctx.getChild(0));
  }
  visitExpr_str(ctx: lang.Expr_strContext): AstNode {
    return this.visit(ctx.getChild(0));
  }
  visitMember_access_expr(ctx: lang.Member_access_exprContext): AstNode {
    return {
      kind: 'dnkMemberAccessOp',
      children: [
        this.visit(ctx._ref_from) as ExpressionNode,
        this.visit(ctx._accessor) as DnkIdent,
      ],
    };
  }
  visitArray_access_expr(ctx: lang.Array_access_exprContext): AstNode {
    return {
      kind: 'dnkArrayAccessOp',
      children: [
        this.visit(ctx._ref_from) as ExpressionNode,
        this.visit(ctx._accessor) as ExpressionNode,
      ],
    };
  }
  visitExpr_ident(ctx: lang.Expr_identContext): AstNode {
    return this.visit(ctx.getChild(0));
  }
  visitArray_type_len(ctx: lang.Array_type_lenContext): AstNode {
    throw new Error('assertion error: this is unreachable code.');
  }
  visitExpr_array(ctx: lang.Expr_arrayContext): AstNode {
    return this.visit(ctx.getChild(0));
  }
  visitExpr_object(ctx: lang.Expr_objectContext): AstNode {
    return this.visit(ctx.getChild(0));
  }

  visitContinue_stmt(ctx: lang.Continue_stmtContext): AstNode {
    return {
      kind: 'dnkContinue',
      children: [],
    };
  }

  visitBreak_stmt(ctx: lang.Break_stmtContext): AstNode {
    return {
      kind: 'dnkBreak',
      children: [],
    };
  }

  visitArray_lit(ctx: lang.Array_litContext): AstNode {
    return {
      kind: 'dnkArrayLit',
      children: ctx._items.map((it) => this.visit(it)) as ExpressionNode[],
    };
  }

  visitObj_lit(ctx: lang.Obj_litContext): AstNode {
    return {
      kind: 'dnkObjectLit',
      children: ctx._items.map((it) => this.visit(it)) as DnkObjectLitMember[],
    };
  }

  visitObj_member(ctx: lang.Obj_memberContext): AstNode {
    return {
      kind: 'dnkObjectLitMember',
      value: ctx._key.text!,
      children: [this.visit(ctx._value) as ExpressionNode],
    };
  }
  // #endregion

  visitOperations(ctx: lang.OperationsContext): AstNode {
    let formula = this.collectOperations(ctx);
    let result = this.reshakeOperations(formula);
    return result;
  }

  private collectOperations(ctx: lang.OperationsContext): FormulaElement[] {
    let context = ctx;
    let result: FormulaElement[] = [];
    while (true) {
      if (context._left) {
        if (isOperationsContext(context._left)) {
          result = result.concat(this.collectOperations(context._left));
        } else {
          result.push(this.visit(context._left));
        }
      }

      result.push(context._op.text as Operations);

      let node = context._right;

      if (!isOperationsContext(node)) {
        result.push(this.visit(node));
        break;
      }

      context = node;
    }
    return result;
  }

  private reshakeOperations(formula: FormulaElement[]): AstNode {
    let current = formula;
    while (current.length > 1) {
      let next: FormulaElement[] = [];
      let skipNext: boolean = false;
      let maxPrecedence = this.scanMaximumOperatorPrecedence(current);

      for (let i = 0; i < current.length; i++) {
        if (skipNext) {
          skipNext = false;
          continue;
        }

        let element = current[i];

        if (typeof element === 'object') {
          next.push(element);
          continue;
        }

        if (element in unaryOperators) {
          if (typeof current[i + 1] === 'string') {
            next.push(element);
            continue;
          }

          next.push({
            kind: 'dnkOperations',
            value: element,
            children: [current[i + 1] as ExpressionNode, undefined],
          });
          skipNext = true;
          continue;
        }

        if (element in biaryOperators) {
          if (biaryOperators[element as BiaryOperators] != maxPrecedence) {
            next.push(element);
            continue;
          }

          if (typeof current[i + 1] === 'string') {
            next.push(element);
            continue;
          }

          if (typeof current[i - 1] === 'string') {
            throw new Error(
              `syntax error:corrupted formula: "${formula
                .map((it) =>
                  typeof it === 'string'
                    ? it
                    : ((it as { value: any }).value || '').toString()
                )
                .join(' ')}"`
            );
          }
          next.pop();
          skipNext = true;

          if (element !== '=') {
            next.push({
              kind: 'dnkOperations',
              value: element,
              children: [
                current[i - 1] as ExpressionNode,
                current[i + 1] as ExpressionNode,
              ],
            });
            continue;
          }

          // #region Handle Assignation
          const assignee = current[i - 1] as AstNode;
          if (
            assignee.kind !== 'dnkArrayAccessOp' &&
            assignee.kind !== 'dnkMemberAccessOp' &&
            assignee.kind !== 'dnkIdent'
          ) {
            throw new Error(
              `syntax error:malformed tree:'${assignee.kind}' is not assignable.`
            );
          }
          next.push({
            kind: 'dnkAssignOp',
            value: element,
            children: [assignee, current[i + 1] as ExpressionNode],
          });
          // #endregion
        }
      }
      if (next.length != 1 && current.length == next.length) {
        throw new Error('syntax error:corrupted formula');
      }
      current = next;
    }
    return current[0] as AstNode;
  }

  private scanMaximumOperatorPrecedence(formula: FormulaElement[]): number {
    return Math.max(
      ...formula
        .filter((it) => typeof it === 'string' && !(it in unaryOperators))
        .map((it) => {
          if (!((it as string) in biaryOperators)) {
            throw new Error('syntax error:unknown operator: ' + it);
          }
          return biaryOperators[it as BiaryOperators];
        })
    );
  }

  private collectArgList(ctx: lang.Arg_listContext): AstNode[] {
    return ctx._args
      .map((it) => this.visit(it))
      .concat(
        (ctx._named_args || { _args: [] })._args.map((it) => this.visit(it))
      );
  }

  private aggregateChildren(node: RuleNode): AstNode[] {
    let result: AstNode[] = [];
    for (let i = 0; i < node.childCount; i++) {
      result.push(node.getChild(i).accept(this));
    }
    return result;
  }

  protected defaultResult(): AstNode {
    return dnkEmpty;
  }
}
