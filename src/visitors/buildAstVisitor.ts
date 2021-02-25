import { AbstractParseTreeVisitor } from 'antlr4ts/tree/AbstractParseTreeVisitor';
import { ParseTree } from 'antlr4ts/tree/ParseTree';
import { RuleNode } from 'antlr4ts/tree/RuleNode';
import {
  dnkEmpty,
  Node,
  Operations,
  unaryOperators,
  biaryOperators,
  UnaryOperators,
  BiaryOperators,
} from '../ast/node';
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
  ExprContext,
  San_exprContext,
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
} from '../generated/DynastyLangParser';
import { DynastyLangVisitor } from '../generated/DynastyLangVisitor';

type FormulaElement = Node | Operations;

function isOperationsContext(node: ParseTree): node is OperationsContext {
  return '_op' in node;
}

export class BuildAstVisitor
  extends AbstractParseTreeVisitor<Node>
  implements DynastyLangVisitor<Node> {
  // #region Node Transformations
  visitTop(ctx: TopContext): Node {
    return {
      kind: 'dnkTop',
      children: this.aggregateChildren(ctx),
    };
  }
  visitBlock_statements(ctx: Block_statementsContext): Node {
    return {
      kind: 'dnkBlock',
      children: this.aggregateChildren(ctx),
    };
  }
  visitStmt(ctx: StmtContext): Node {
    return this.visit(ctx.getChild(0));
  }
  visitIdent(ctx: IdentContext): Node {
    return {
      kind: 'dnkIdent',
      value: ctx._name.text,
      children: [],
    };
  }
  visitToplevel_decl(ctx: Toplevel_declContext): Node {
    return this.visit(ctx.getChild(0));
  }
  visitDeclaration(ctx: DeclarationContext): Node {
    return this.visit(ctx.getChild(0));
  }
  visitBlock(ctx: BlockContext): Node {
    return this.visit(ctx.getChild(1));
  }
  visitIf_stmt(ctx: If_stmtContext): Node {
    return this.visit(ctx.getChild(0));
  }
  visitFor_stmt(ctx: For_stmtContext): Node {
    return {
      kind: 'dnkFor',
      value: [this.visit(ctx._name), this.visit(ctx._iter)],
      children: [this.visit(ctx._stmts)],
    };
  }
  visitWhile_stmt(ctx: While_stmtContext): Node {
    return {
      kind: 'dnkWhile',
      value: this.visit(ctx._cond),
      children: [this.visit(ctx._stmts)],
    };
  }
  visitExpr(ctx: ExprContext): Node {
    return this.visit(ctx.getChild(0));
  }
  visitSan_expr(ctx: San_exprContext): Node {
    return this.visit(ctx.getChild(0));
  }
  visitType_decl(ctx: Type_declContext): Node {
    return {
      kind: 'dnkTypeDecl',
      value: this.visit(ctx._name),
      children: [this.visit(ctx._desc)],
    };
  }
  visitType_desc(ctx: Type_descContext): Node {
    return this.visit(ctx.getChild(0));
  }
  visitType_desc_san(ctx: Type_desc_sanContext): Node {
    return this.visit(ctx.getChild(0));
  }
  visitType_lit(ctx: Type_litContext): Node {
    return {
      kind: 'dnkTypeLit',
      value: ctx._super_ && this.visit(ctx._super_),
      children: this.aggregateChildren(ctx._members),
    };
  }
  visitMember_list(ctx: Member_listContext): Node {
    throw new Error('assertion error: this is unreachable code.');
  }
  visitMember_item(ctx: Member_itemContext): Node {
    return {
      kind: 'dnkTypeLit',
      children: [this.visit(ctx._name), this.visit(ctx._name)],
    };
  }
  visitArray_type_lit(ctx: Array_type_litContext): Node {
    return {
      kind: 'dnkArrayTypeLit',
      value: ctx._dims.map((it) =>
        parseInt((it._length || { text: '-1' }).text || '-1')
      ),
      children: [this.visit(ctx.getChild(0))],
    };
  }
  visitImport_decl(ctx: Import_declContext): Node {
    return this.visit(ctx.getChild(0));
  }
  visitImport_stmt(ctx: Import_stmtContext): Node {
    return {
      kind: 'dnkImport',
      children: [this.visit(ctx._module), ctx._alt && this.visit(ctx._alt)],
    };
  }
  visitImport_from(ctx: Import_fromContext): Node {
    return {
      kind: 'dnkImportFrom',
      value: this.visit(ctx._module),
      children: this.aggregateChildren(ctx._list),
    };
  }
  visitImport_list(ctx: Import_listContext): Node {
    return {
      kind: 'dnkImportList',
      value: ctx._rest && this.visit(ctx._rest._name),
      children: (ctx._names || []).map((it) => this.visit(it)),
    };
  }
  visitImport_rest(ctx: Import_restContext): Node {
    throw new Error('assertion error: this is unreachable code.');
  }
  visitImport_name(ctx: Import_nameContext): Node {
    return {
      kind: 'dnkImportName',
      children: [this.visit(ctx._name), ctx._alt && this.visit(ctx._alt)],
    };
  }
  visitFn_decl(ctx: Fn_declContext): Node {
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
  visitBlock_expr(ctx: Block_exprContext): Node {
    return {
      kind: 'dnkBlockExpr',
      children: [this.visit(ctx.getChild(0))],
    };
  }
  visitIf_expr(ctx: If_exprContext): Node {
    return {
      kind: 'dnkIfExpr',
      value: this.visit(ctx._cond),
      children: [
        this.visit(ctx._then),
        (ctx._else_ && [this.visit(ctx._else_)]) || [],
      ].flat(),
    };
  }
  visitVar_decl(ctx: Var_declContext): Node {
    return {
      kind: 'dnkVarDecl',
      children: [this.visit(ctx._name), this.visit(ctx._value)],
    };
  }
  visitConst_decl(ctx: Const_declContext): Node {
    return {
      kind: 'dnkConstDecl',
      children: [this.visit(ctx._name), this.visit(ctx._value)],
    };
  }
  visitPar_list(ctx: Par_listContext): Node {
    return {
      kind: 'dnkParamList',
      children: (ctx._params || []).map((it) => this.visit(it)),
    };
  }
  visitPar_item(ctx: Par_itemContext): Node {
    return {
      kind: 'dnkParamItem',
      children: [this.visit(ctx._name), this.visit(ctx._type)],
    };
  }
  visitReturn_stmt(ctx: Return_stmtContext): Node {
    return {
      kind: 'dnkReturn',
      children: [this.visit(ctx._value)],
    };
  }
  visitCall_expr(ctx: Call_exprContext): Node {
    return {
      kind: 'dnkCallExpr',
      value: this.visit(ctx._name),
      children: (ctx._args && this.aggregateChildren(ctx._args)) || dnkEmpty,
    };
  }
  visitArg_list(ctx: Arg_listContext): Node {
    throw new Error('assertion error: this is unreachable code.');
  }
  visitNamed_arg_list(ctx: Named_arg_listContext): Node {
    return {
      kind: 'dnkNamedArgList',
      children: ctx._args.map((it) => this.visit(it)),
    };
  }
  visitNamed_arg(ctx: Named_argContext): Node {
    return {
      kind: 'dnkNamedArg',
      children: [this.visit(ctx._name), this.visit(ctx._value)],
    };
  }
  visitFloat_lit(ctx: Float_litContext): Node {
    return {
      kind: 'dnkFloatLit',
      value: parseFloat(ctx._value.text || 'NaN'),
      children: [],
    };
  }
  visitInt_lit(ctx: Int_litContext): Node {
    return {
      kind: 'dnkIntLit',
      value: parseInt(ctx._value.text || 'NaN'),
      children: [],
    };
  }
  visitStr_lit(ctx: Str_litContext): Node {
    return {
      kind: 'dnkStrLit',
      value: [
        (ctx._value.text || '').startsWith('r') ? 'r' : 's',
        (ctx._value.text || '').replace(/^r?"+/, '').replace(/"+$/, '') || '',
      ],
      children: [],
    };
  }

  visitPar(ctx: ParContext): Node {
    return {
      kind: 'dnkPar',
      children: [this.visit(ctx._expression)],
    };
  }

  visitFqn(ctx: FqnContext): Node {
    return {
      kind: 'dnkFqn',
      value: ctx._names.map((it) => it.text),
      children: [],
    };
  }
  // #endregion

  visitOperations(ctx: OperationsContext): Node {
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

  private reshakeOperations(formula: FormulaElement[]): Node {
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
            children: [current[i + 1] as Node],
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
            children: [current[i - 1] as Node, current[i + 1] as Node],
          });
          skipNext = true;
        }
      }
      if (next.length != 1 && current.length == next.length) {
        throw new Error('syntax error:corrupted formula');
      }
      current = next;
    }
    return current[0] as Node;
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

  aggregateChildren(node: RuleNode): Node[] {
    let result: Node[] = [];
    for (let i = 0; i < node.childCount; i++) {
      result.push(node.getChild(i).accept(this));
    }
    return result;
  }

  protected defaultResult(): Node {
    return dnkEmpty;
  }
}
