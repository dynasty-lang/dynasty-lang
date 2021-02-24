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
if_stmt: if_expr;
for_stmt:
	FOR LPAR name = ident IN iter = expr RPAR stmts = block;
while_stmt: WHILE LPAR cond = expr RPAR stmts = block;

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

type_decl: TYPE name = fqn EQ desc = type_desc;
type_desc: type_desc_san | array_type_lit;
type_desc_san: fqn | type_lit;

type_lit: super = fqn? LBRA members = member_list RBRA;
member_list: (items += member_item SEMICOLON)*;
member_item: name = ident COLON desc = type_desc;

array_type_lit: type_desc_san dims += array_type_len+;
array_type_len:
	LSQR length = (INT_HEX | INT_DEC | INT_OCT | INT_BIN)? RSQR;

import_decl: import_from | import_stmt;
import_stmt: IMPORT module = fqn (AS alt = ident)?;
import_from: IMPORT list = import_list FROM module = fqn;
import_list: (names += import_name COMMA)* names += import_name (
		COMMA rest = import_rest
	)?
	| rest = import_rest;
import_rest: ASTERISK name = ident;
import_name: name = ident (AS alt = ident);

fn_decl:
	FN name = fqn LPAR params = par_list? RPAR (
		RARROW ret_type = type_desc
	)? stmts = block;

block_expr: block;

if_expr:
	IF LPAR cond = expr RPAR then = expr (ELSE else = expr)?;

var_decl: VAR name = ident EQ value = expr;
const_decl: INV name = ident EQ value = expr;

par_list: par_item | par_item ',' par_list;
par_item: ident COLON type_desc;

return_stmt: RETURN value = expr? SEMICOLON;

call_expr: name = fqn LPAR args = arg_list? RPAR;
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
op0: san_expr op0_right | op = NOT expr;

op6_right: expr | op = POW expr;
op5_right: expr | op = (ASTERISK | DIV | MOD) expr;
op4_right: expr | op = (ADD | SUB) expr;
op3_right: expr | op = (BAND | BOR | BXOR) expr;
op2_right: expr | op = (SHL | SHR) expr;
op1_right: expr | op = (GT | GE | EQL | NE | LE | LT) expr;
op0_right: expr | op = (AND | OR | XOR) expr;

par: LPAR expression = expr RPAR;
