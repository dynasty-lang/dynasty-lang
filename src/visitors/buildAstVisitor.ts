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
} from '../ast/astNode';
import {
  TopContext,
  Block_statementsContext,
  StmtContext,
  IdentContext,
  Toplevel_declContext,
  DeclarationContext,
  BlockContext,
  If_stmtContext,
  For_stmtContext,
  While_stmtContext,
  Type_declContext,
  Type_descContext,
  Type_desc_sanContext,
  Type_litContext,
  Member_listContext,
  Member_itemContext,
  Array_type_litContext,
  Import_declContext,
  Import_stmtContext,
  Import_fromContext,
  Import_listContext,
  Import_restContext,
  Import_nameContext,
  Fn_declContext,
  Block_exprContext,
  If_exprContext,
  Var_declContext,
  Const_declContext,
  Par_listContext,
  Par_itemContext,
  Return_stmtContext,
  Call_exprContext,
  Arg_listContext,
  Named_arg_listContext,
  Named_argContext,
  Float_litContext,
  Int_litContext,
  Str_litContext,
  OperationsContext,
  ParContext,
  FqnContext,
  Array_access_exprContext,
  Array_type_lenContext,
  Assign_exprContext,
  Direct_call_exprContext,
  Expr_blockContext,
  Expr_floatContext,
  Expr_identContext,
  Expr_ifContext,
  Expr_intContext,
  Expr_parContext,
  Expr_strContext,
  Member_access_exprContext,
  Unary_opContext,
} from '../generated/DynastyLangParser';
import { DynastyLangVisitor } from '../generated/DynastyLangVisitor';

type FormulaElement = AstNode | Operations;

function isOperationsContext(node: ParseTree): node is OperationsContext {
  return '_op' in node;
}

export class BuildAstVisitor
  extends AbstractParseTreeVisitor<AstNode>
  implements DynastyLangVisitor<AstNode> {
  // #region Node Transformations
  visitTop(ctx: TopContext): AstNode {
    return {
      kind: 'dnkTop',
      children: this.aggregateChildren(ctx),
    };
  }
  visitBlock_statements(ctx: Block_statementsContext): AstNode {
    return {
      kind: 'dnkBlock',
      children: this.aggregateChildren(ctx),
    };
  }
  visitStmt(ctx: StmtContext): AstNode {
    return this.visit(ctx.getChild(0));
  }
  visitIdent(ctx: IdentContext): AstNode {
    return {
      kind: 'dnkIdent',
      value: ctx._name.text,
      children: [],
    };
  }
  visitToplevel_decl(ctx: Toplevel_declContext): AstNode {
    return this.visit(ctx.getChild(0));
  }
  visitDeclaration(ctx: DeclarationContext): AstNode {
    return this.visit(ctx.getChild(0));
  }
  visitBlock(ctx: BlockContext): AstNode {
    return this.visit(ctx.getChild(1));
  }
  visitIf_stmt(ctx: If_stmtContext): AstNode {
    return this.visit(ctx.getChild(0));
  }
  visitFor_stmt(ctx: For_stmtContext): AstNode {
    return {
      kind: 'dnkFor',
      value: [this.visit(ctx._name), this.visit(ctx._iter)],
      children: [this.visit(ctx._stmts)],
    };
  }
  visitWhile_stmt(ctx: While_stmtContext): AstNode {
    return {
      kind: 'dnkWhile',
      value: this.visit(ctx._cond),
      children: [this.visit(ctx._stmts)],
    };
  }
  visitType_decl(ctx: Type_declContext): AstNode {
    return {
      kind: 'dnkTypeDecl',
      value: this.visit(ctx._name),
      children: [this.visit(ctx._desc)],
    };
  }
  visitType_desc(ctx: Type_descContext): AstNode {
    return this.visit(ctx.getChild(0));
  }
  visitType_desc_san(ctx: Type_desc_sanContext): AstNode {
    return this.visit(ctx.getChild(0));
  }
  visitType_lit(ctx: Type_litContext): AstNode {
    return {
      kind: 'dnkTypeLit',
      value: ctx._super_ && this.visit(ctx._super_),
      children: this.aggregateChildren(ctx._members),
    };
  }
  visitMember_list(ctx: Member_listContext): AstNode {
    throw new Error('assertion error: this is unreachable code.');
  }
  visitMember_item(ctx: Member_itemContext): AstNode {
    return {
      kind: 'dnkTypeLit',
      children: [this.visit(ctx._name), this.visit(ctx._name)],
    };
  }
  visitArray_type_lit(ctx: Array_type_litContext): AstNode {
    return {
      kind: 'dnkArrayTypeLit',
      value: ctx._dims.map((it) =>
        parseInt((it._length || { text: '-1' }).text || '-1')
      ),
      children: [this.visit(ctx.getChild(0))],
    };
  }
  visitImport_decl(ctx: Import_declContext): AstNode {
    return this.visit(ctx.getChild(0));
  }
  visitImport_stmt(ctx: Import_stmtContext): AstNode {
    return {
      kind: 'dnkImport',
      children: [this.visit(ctx._module), ctx._alt && this.visit(ctx._alt)],
    };
  }
  visitImport_from(ctx: Import_fromContext): AstNode {
    return {
      kind: 'dnkImportFrom',
      value: this.visit(ctx._module),
      children: this.aggregateChildren(ctx._list),
    };
  }
  visitImport_list(ctx: Import_listContext): AstNode {
    return {
      kind: 'dnkImportList',
      value: ctx._rest && this.visit(ctx._rest._name),
      children: (ctx._names || []).map((it) => this.visit(it)),
    };
  }
  visitImport_rest(ctx: Import_restContext): AstNode {
    throw new Error('assertion error: this is unreachable code.');
  }
  visitImport_name(ctx: Import_nameContext): AstNode {
    return {
      kind: 'dnkImportName',
      children: [this.visit(ctx._name), ctx._alt && this.visit(ctx._alt)],
    };
  }
  visitFn_decl(ctx: Fn_declContext): AstNode {
    return {
      kind: 'dnkFnDecl',
      value: [
        this.visit(ctx._name),
        (ctx._params && this.visit(ctx._params)) || dnkEmpty,
        (ctx._ret_type && this.visit(ctx._ret_type)) || dnkEmpty,
      ],
      children: [this.visit(ctx._stmts)],
    };
  }
  visitBlock_expr(ctx: Block_exprContext): AstNode {
    return {
      kind: 'dnkBlockExpr',
      children: [this.visit(ctx.getChild(0))],
    };
  }
  visitIf_expr(ctx: If_exprContext): AstNode {
    return {
      kind: 'dnkIfExpr',
      value: this.visit(ctx._cond),
      children: [
        this.visit(ctx._then),
        (ctx._else_ && [this.visit(ctx._else_)]) || [],
      ].flat(),
    };
  }
  visitVar_decl(ctx: Var_declContext): AstNode {
    return {
      kind: 'dnkVarDecl',
      value: (ctx._type_ && this.visit(ctx._type_)) || dnkEmpty,
      children: [this.visit(ctx._name), this.visit(ctx._value)],
    };
  }
  visitConst_decl(ctx: Const_declContext): AstNode {
    return {
      kind: 'dnkConstDecl',
      value: (ctx._type_ && this.visit(ctx._type_)) || dnkEmpty,
      children: [this.visit(ctx._name), this.visit(ctx._value)],
    };
  }
  visitPar_list(ctx: Par_listContext): AstNode {
    return {
      kind: 'dnkParamList',
      children: (ctx._params || []).map((it) => this.visit(it)),
    };
  }
  visitPar_item(ctx: Par_itemContext): AstNode {
    return {
      kind: 'dnkParamItem',
      children: [this.visit(ctx._name), this.visit(ctx._type)],
    };
  }
  visitReturn_stmt(ctx: Return_stmtContext): AstNode {
    return {
      kind: 'dnkReturn',
      children: [this.visit(ctx._value)],
    };
  }
  visitCall_expr(ctx: Call_exprContext): AstNode {
    return {
      kind: 'dnkCallExpr',
      value: this.visit(ctx._name),
      children: (ctx._args && this.aggregateChildren(ctx._args)) || dnkEmpty,
    };
  }
  visitArg_list(ctx: Arg_listContext): AstNode {
    throw new Error('assertion error: this is unreachable code.');
  }
  visitNamed_arg_list(ctx: Named_arg_listContext): AstNode {
    return {
      kind: 'dnkNamedArgList',
      children: ctx._args.map((it) => this.visit(it)),
    };
  }
  visitNamed_arg(ctx: Named_argContext): AstNode {
    return {
      kind: 'dnkNamedArg',
      children: [this.visit(ctx._name), this.visit(ctx._value)],
    };
  }
  visitFloat_lit(ctx: Float_litContext): AstNode {
    return {
      kind: 'dnkFloatLit',
      value: parseFloat(ctx._value.text || 'NaN'),
      children: [],
    };
  }
  visitInt_lit(ctx: Int_litContext): AstNode {
    return {
      kind: 'dnkIntLit',
      value: parseInt(ctx._value.text || 'NaN'),
      children: [],
    };
  }
  visitStr_lit(ctx: Str_litContext): AstNode {
    return {
      kind: 'dnkStrLit',
      value: [
        (ctx._value.text || '').startsWith('r') ? 'r' : 's',
        (ctx._value.text || '').replace(/^r?"+/, '').replace(/"+$/, '') || '',
      ],
      children: [],
    };
  }

  visitPar(ctx: ParContext): AstNode {
    return {
      kind: 'dnkPar',
      children: [this.visit(ctx._expression)],
    };
  }

  visitFqn(ctx: FqnContext): AstNode {
    return {
      kind: 'dnkFqn',
      value: ctx._names.map((it) => it.text),
      children: [],
    };
  }

  visitUnary_op(ctx: Unary_opContext): AstNode {
    return {
      kind: 'dnkOperations',
      value: ctx._op.text || dnkEmpty,
      children: [this.visit(ctx._right)],
    };
  }

  visitExpr_if(ctx: Expr_ifContext): AstNode {
    return this.visit(ctx.getChild(0));
  }
  visitExpr_par(ctx: Expr_parContext): AstNode {
    return this.visit(ctx.getChild(0));
  }
  visitDirect_call_expr(ctx: Direct_call_exprContext): AstNode {
    return {
      kind: 'dnkCallExpr',
      value: this.visit(ctx._callee),
      children: (ctx._args && this.aggregateChildren(ctx._args)) || dnkEmpty,
    };
  }
  visitExpr_block(ctx: Expr_blockContext): AstNode {
    return this.visit(ctx.getChild(0));
  }
  visitExpr_float(ctx: Expr_floatContext): AstNode {
    return this.visit(ctx.getChild(0));
  }
  visitExpr_int(ctx: Expr_intContext): AstNode {
    return this.visit(ctx.getChild(0));
  }
  visitExpr_str(ctx: Expr_strContext): AstNode {
    return this.visit(ctx.getChild(0));
  }
  visitMember_access_expr(ctx: Member_access_exprContext): AstNode {
    return {
      kind: 'dnkMemberAccessOp',
      children: [this.visit(ctx._ref_from), this.visit(ctx._accessor)],
    };
  }
  visitArray_access_expr(ctx: Array_access_exprContext): AstNode {
    return {
      kind: 'dnkArrayAccessOp',
      children: [this.visit(ctx._ref_from), this.visit(ctx._accessor)],
    };
  }
  visitAssign_expr(ctx: Assign_exprContext): AstNode {
    const assignee = this.visit(ctx._assignee);
    if (
      assignee.kind !== 'dnkArrayAccessOp' &&
      assignee.kind !== 'dnkMemberAccessOp'
    ) {
      throw new Error(
        `syntax error:malformed tree:'${assignee.kind}' is not assignable.`
      );
    }
    return {
      kind: 'dnkAssignOp',
      children: [assignee, this.visit(ctx._assigner)],
    };
  }
  visitExpr_ident(ctx: Expr_identContext): AstNode {
    return this.visit(ctx.getChild(0));
  }
  visitArray_type_len(ctx: Array_type_lenContext): AstNode {
    throw new Error('assertion error: this is unreachable code.');
  }
  // #endregion

  visitOperations(ctx: OperationsContext): AstNode {
    let formula = this.collectOperations(ctx);
    let result = this.reshakeOperations(formula);
    return result;
  }

  private collectOperations(ctx: OperationsContext): FormulaElement[] {
    let context = ctx;
    let result: FormulaElement[] = [];
    while (true) {
      if (context._left) {
        result.push(this.visit(context._left));
      }

      result.push(context._op.text as Operations);

      let node = context._right.getChild(0);

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
            children: [current[i + 1] as AstNode],
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
                  typeof it === 'string' ? it : (it.value || '').toString()
                )
                .join(' ')}"`
            );
          }

          next.pop();
          next.push({
            kind: 'dnkOperations',
            value: element,
            children: [current[i - 1] as AstNode, current[i + 1] as AstNode],
          });
          skipNext = true;
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

  aggregateChildren(node: RuleNode): AstNode[] {
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
