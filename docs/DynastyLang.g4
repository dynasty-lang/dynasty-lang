grammar DynastyLang;
import DynastyCommonRuleSet;

top: (stmt | toplevel_decl)* EOF;
block_statements: (stmt | return_stmt)*;
stmt:
	block
	| expr[0] SEMICOLON
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
	FOR LPAR name = ident IN iter = expr[0] RPAR stmts = block;
while_stmt: WHILE LPAR cond = expr[0] RPAR stmts = block;

expr[int priority]: san_expr | operations[$priority];

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

type_lit: super_ = fqn? LBRA members = member_list RBRA;
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
	IF LPAR cond = expr[0] RPAR then = expr[0] (
		ELSE else_ = expr[0]
	)?;

var_decl: VAR name = ident EQ value = expr[0];
const_decl: INV name = ident EQ value = expr[0];

par_list: (params += par_item COMMA)* params += par_item;
par_item: name = ident COLON type = type_desc;

return_stmt: RETURN value = expr[0]? SEMICOLON;

call_expr: name = fqn LPAR args = arg_list? RPAR;
arg_list: (expr[0] COMMA)* (expr[0] | named_arg_list);
named_arg_list: (args += named_arg COMMA)* args += named_arg;
named_arg: name = ident COLON value = expr[0];

float_lit: value = (FLOAT | EXPONENTIAL);
int_lit: value = (INT_BIN | INT_OCT | INT_DEC | INT_HEX);
str_lit:
	value = (
		STR_LIT
		| RAW_STR_LIT
		| TRIPLE_STR_LIT
		| TRIPLE_RAW_STR_LIT
	);

operations[int priority]:
	<assoc = right>san_expr op6 expr[6]
	| <assoc = right>{6 > $priority}? san_expr op5 expr[5]
	| <assoc = right> {5 > $priority}? san_expr op4 expr[4]
	| <assoc = right>{4 > $priority}? san_expr op3 expr[3]
	| <assoc = right> {3 > $priority}? san_expr op2 expr[2]
	| <assoc = right> {2 > $priority}? san_expr op1 expr[1]
	| <assoc = right>{1 > $priority}? san_expr op0 expr[0];

op6: op = POW;
op5: op = (ASTERISK | DIV | MOD);
op4: op = (ADD | SUB);
op3: op = (BAND | BOR | BXOR);
op2: op = (SHL | SHR);
op1: op = (GT | GE | EQL | NE | LE | LT);
op0: op = (AND | OR | XOR);

par: LPAR expression = expr[0] RPAR;
