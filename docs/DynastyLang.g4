grammar DynastyLang;
import DynastyCommonRuleSet;

top: (stmt | toplevel_decl)* EOF;
block_statements: (stmt | return_stmt)*;
stmt:
	block
	| expr SEMICOLON
	| if_stmt
	| for_stmt
	| while_stmt
	| declaration;

ident: name = IDENT;

toplevel_decl: type_decl | import_decl;

declaration: fn_decl | var_decl | const_decl;

block: LBRA block_statements RBRA;
if_stmt: IF LPAR expr RPAR block;
for_stmt: FOR LPAR ident IN expr RPAR block;
while_stmt: WHILE LPAR expr RPAR block;

expr: san_expr | operations;

san_expr:
	if_expr
	| call_expr
	| block_expr
	| par
	| float_lit
	| int_lit
	| str_lit
	| ident;

type_decl: TYPE fqn EQ type_desc;
type_desc: type_desc_san | array_type_lit;
type_desc_san: fqn | type_lit;

type_lit: fqn? LBRA member_list RBRA;
member_list: (member_item SEMICOLON)*;
member_item: ident COLON type_desc;

array_type_lit: type_desc_san array_type_right;
array_type_right:
	array_type_len array_type_right
	| array_type_len;
array_type_len:
	LSQR (INT_HEX | INT_DEC | INT_OCT | INT_BIN)? RSQR;

import_decl: import_from | import_stmt;
import_stmt: IMPORT fqn (AS ident)?;
import_from: IMPORT import_list FROM fqn;
import_list: (import_name COMMA)* import_name (COMMA import_rest)?
	| import_rest;
import_rest: ASTERISK ident;
import_name: ident (AS ident);

fn_decl: FN fqn LPAR par_list? RPAR (RARROW type_desc)? block;

block_expr: block;

if_expr: IF LPAR expr RPAR expr (ELSE expr)?;

var_decl: VAR ident EQ expr;
const_decl: INV ident EQ expr;

par_list: par_item | par_item ',' par_list;
par_item: ident COLON type_desc;

return_stmt: RETURN expr? SEMICOLON;

call_expr: fqn LPAR arg_list? RPAR;
arg_list: (expr ',')* (expr | named_arg_list);
named_arg_list: (named_arg ',')* named_arg;
named_arg: ident COLON expr;

float_lit: value = (FLOAT | EXPONENTIAL);
int_lit: value = (INT_BIN | INT_OCT | INT_DEC | INT_HEX);
str_lit:
	value = (
		STR_LIT
		| RAW_STR_LIT
		| TRIPLE_STR_LIT
		| TRIPLE_RAW_STR_LIT
	);

operations: op6 | op5 | op4 | op3 | op2 | op1 | op0;

op6: san_expr op6_right;
op5: san_expr op5_right;
op4: san_expr op4_right;
op3: san_expr op3_right;
op2: san_expr op2_right;
op1: san_expr op1_right;
op0: san_expr op0_right | NOT expr;

op6_right: expr | POW expr;
op5_right: expr | (ASTERISK | DIV | MOD) expr;
op4_right: expr | (ADD | SUB) expr;
op3_right: expr | (BAND | BOR | BXOR) expr;
op2_right: expr | (SHL | SHR) expr;
op1_right: expr | (GT | GE | EQL | NE | LE | LT) expr;
op0_right: expr | (AND | OR | XOR) expr;

par: LPAR expr RPAR;
