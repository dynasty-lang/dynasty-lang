import { ParseTree } from 'antlr4ts/tree/ParseTree';
import { AbstractParseTreeVisitor } from 'antlr4ts/tree/AbstractParseTreeVisitor';
import { DynastyLangVisitor } from '../generated/DynastyLangVisitor';
import {
  TopContext,
  IdentContext,
  BlockContext,
  For_stmtContext,
  While_stmtContext,
  Type_declContext,
  Type_descContext,
  Type_litContext,
  Member_listContext,
  Member_itemContext,
  Array_type_litContext,
  Array_type_lenContext,
  Import_stmtContext,
  Import_fromContext,
  Import_listContext,
  Import_restContext,
  Import_nameContext,
  Fn_declContext,
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
  StmtContext,
} from '../generated/DynastyLangParser';
import { ParserRuleContext } from 'antlr4ts';

export class ASTWriteOutVisitor
  extends AbstractParseTreeVisitor<void>
  implements DynastyLangVisitor<void> {
  visitTop(ctx: TopContext): void {
    console.log(`${' '.repeat(this.getDepth(ctx))}top`);
    this.visitChildren(ctx);
  }
  visitStmt(ctx: StmtContext) {
    console.log(`${' '.repeat(this.getDepth(ctx))}stmt`);
    this.visitChildren(ctx);
  }
  visitIdent(ctx: IdentContext): void {
    console.log(`${' '.repeat(this.getDepth(ctx))}ident ${ctx._name.text}`);
    this.visitChildren(ctx);
  }
  visitBlock(ctx: BlockContext): void {
    console.log(`${' '.repeat(this.getDepth(ctx))}block`);
    this.visitChildren(ctx);
  }
  visitFor_stmt(ctx: For_stmtContext): void {
    console.log(`${' '.repeat(this.getDepth(ctx))}for`);
    this.visitChildren(ctx);
  }
  visitWhile_stmt(ctx: While_stmtContext): void {
    console.log(`${' '.repeat(this.getDepth(ctx))}while`);
    this.visitChildren(ctx);
  }
  visitType_decl(ctx: Type_declContext): void {
    console.log(`${' '.repeat(this.getDepth(ctx))}type`);
    this.visitChildren(ctx);
  }
  visitType_desc(ctx: Type_descContext): void {
    console.log(`${' '.repeat(this.getDepth(ctx))}type_desc`);
    this.visitChildren(ctx);
  }
  visitType_lit(ctx: Type_litContext): void {
    console.log(`${' '.repeat(this.getDepth(ctx))}type_lit`);
    this.visitChildren(ctx);
  }
  visitMember_list(ctx: Member_listContext): void {
    console.log(`${' '.repeat(this.getDepth(ctx))}member_list`);
    this.visitChildren(ctx);
  }
  visitMember_item(ctx: Member_itemContext): void {
    console.log(`${' '.repeat(this.getDepth(ctx))}member_item`);
    this.visitChildren(ctx);
  }
  visitArray_type_lit(ctx: Array_type_litContext): void {
    console.log(`${' '.repeat(this.getDepth(ctx))}array_type_lit`);
    this.visitChildren(ctx);
  }
  visitArray_type_len(ctx: Array_type_lenContext): void {
    console.log(`${' '.repeat(this.getDepth(ctx))}array_type_len`);
    this.visitChildren(ctx);
  }
  visitImport_stmt(ctx: Import_stmtContext): void {
    console.log(`${' '.repeat(this.getDepth(ctx))}import_stmt`);
    this.visitChildren(ctx);
  }
  visitImport_from(ctx: Import_fromContext): void {
    console.log(`${' '.repeat(this.getDepth(ctx))}import_from`);
    this.visitChildren(ctx);
  }
  visitImport_list(ctx: Import_listContext): void {
    console.log(`${' '.repeat(this.getDepth(ctx))}import_list`);
    this.visitChildren(ctx);
  }
  visitImport_rest(ctx: Import_restContext): void {
    console.log(`${' '.repeat(this.getDepth(ctx))}import_rest`);
    this.visitChildren(ctx);
  }
  visitImport_name(ctx: Import_nameContext): void {
    console.log(`${' '.repeat(this.getDepth(ctx))}import_name`);
    this.visitChildren(ctx);
  }
  visitFn_decl(ctx: Fn_declContext): void {
    console.log(`${' '.repeat(this.getDepth(ctx))}fn_decl`);
    this.visitChildren(ctx);
  }
  visitIf_expr(ctx: If_exprContext): void {
    console.log(`${' '.repeat(this.getDepth(ctx))}if`);
    this.visitChildren(ctx);
  }
  visitVar_decl(ctx: Var_declContext): void {
    console.log(`${' '.repeat(this.getDepth(ctx))}var`);
    this.visitChildren(ctx);
  }
  visitConst_decl(ctx: Const_declContext): void {
    console.log(`${' '.repeat(this.getDepth(ctx))}inv`);
    this.visitChildren(ctx);
  }
  visitPar_list(ctx: Par_listContext): void {
    console.log(`${' '.repeat(this.getDepth(ctx))}par_list`);
    this.visitChildren(ctx);
  }
  visitPar_item(ctx: Par_itemContext): void {
    console.log(`${' '.repeat(this.getDepth(ctx))}par_item`);
    this.visitChildren(ctx);
  }
  visitReturn_stmt(ctx: Return_stmtContext): void {
    console.log(`${' '.repeat(this.getDepth(ctx))}return`);
    this.visitChildren(ctx);
  }
  visitCall_expr(ctx: Call_exprContext): void {
    console.log(`${' '.repeat(this.getDepth(ctx))}call`);
    this.visitChildren(ctx);
  }
  visitArg_list(ctx: Arg_listContext): void {
    console.log(`${' '.repeat(this.getDepth(ctx))}arg_list`);
    this.visitChildren(ctx);
  }
  visitNamed_arg_list(ctx: Named_arg_listContext): void {
    console.log(`${' '.repeat(this.getDepth(ctx))}named_arg_list`);
    this.visitChildren(ctx);
  }
  visitNamed_arg(ctx: Named_argContext): void {
    console.log(`${' '.repeat(this.getDepth(ctx))}named_arg`);
    this.visitChildren(ctx);
  }
  visitFloat_lit(ctx: Float_litContext): void {
    console.log(`${' '.repeat(this.getDepth(ctx))}float ${ctx._value.text}`);
    this.visitChildren(ctx);
  }
  visitInt_lit(ctx: Int_litContext): void {
    console.log(`${' '.repeat(this.getDepth(ctx))}int ${ctx._value.text}`);
    this.visitChildren(ctx);
  }
  visitStr_lit(ctx: Str_litContext): void {
    console.log(`${' '.repeat(this.getDepth(ctx))}str ${ctx._value.text}`);
    this.visitChildren(ctx);
  }
  visitOperations(ctx: OperationsContext): void {
    console.log(`${' '.repeat(this.getDepth(ctx))}operations`);
    this.visitChildren(ctx);
  }
  visitPar(ctx: ParContext): void {
    console.log(`${' '.repeat(this.getDepth(ctx))}par`);
    this.visitChildren(ctx);
  }
  visitFqn(ctx: FqnContext): void {
    console.log(
      `${' '.repeat(this.getDepth(ctx))}FQN ${ctx._names
        .map((it) => it.text)
        .join('.')}`
    );
    this.visitChildren(ctx);
  }

  getDepth(tree: ParseTree): number {
    let count = 0;
    while (tree.parent) {
      count++;
      tree = tree.parent;
    }
    return count;
  }

  protected defaultResult(): void { }
  visitChildren(node: ParserRuleContext) {
    for (let i = 0; i < node.childCount; i++) {
      let child = node.getChild(i);
      child.accept(this);
    }
  }
}
