grammar DynastyLang;

import DynastyCommonRuleSet;

top: (stmt | toplevel_decl)*;
statements: stmt*;
stmt:
	block
	| expr
	| if_stmt
	| for_stmt
	| while_stmt
	| declaration;

block: LBRA statements RBRA;
if_stmt: IF LPAR expr RPAR block;
for_stmt: FOR LPAR IDENT IN expr RPAR block;
while_stmt: WHILE LPAR expr RPAR block;
expr: if_expr | block_expr | biary_op | unary_op | literals;
