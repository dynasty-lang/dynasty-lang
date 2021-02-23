grammar DynastyLang;

import DynastyCommonRuleSet;

top: (stmt | toplevel_decl)*;
statements: stmt*;
block_statements: (stmt | return_stmt)*;
stmt:
	block
	| expr
	| if_stmt
	| for_stmt
	| while_stmt
	| declaration;

toplevel_decl: type_decl | import_decl;

declaration: fn_decl | var_decl | const_decl;

block: LBRA block_statements RBRA;
if_stmt: IF LPAR expr RPAR block;
for_stmt: FOR LPAR IDENT IN expr RPAR block;
while_stmt: WHILE LPAR expr RPAR block;
expr: if_expr | block_expr | biary_op | unary_op | literals;

type_decl: TYPE fqn EQ type_desc;
type_desc: fqn | type_lit;

type_lit: fqn? LBRA member_list RBRA;
member_list: (member_item SEMICOLON)*;
member_item: IDENT COLON type_desc;

import_decl: import_from | import_stmt;
import_stmt: IMPORT fqn (AS IDENT)?;
import_from: IMPORT import_list FROM fqn;
import_list: (import_name COMMA)* import_name (COMMA import_rest)?
	| import_rest;
import_rest: ASTERISK IDENT;
import_name: IDENT (AS IDENT);

fn_decl: FN fqn LPAR arg_list RPAR (RARROW type_desc)? block;

arg_list: (arg_item ',')* arg_item;
arg_item: IDENT COLON type_desc;

return_stmt: RETURN expr?;

literals:
	FLOAT
	| EXPONENTIAL
	| INT_BIN
	| INT_DEC
	| INT_HEX
	| INT_OCT
	| STR_LIT
	| RAW_STR_LIT
	| TRIPLE_STR_LIT
	| TRIPLE_RAW_STR_LIT;
