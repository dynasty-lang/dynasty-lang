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

declaration:
	fn_decl
	| var_decl SEMICOLON
	| const_decl SEMICOLON;

block: LBRA block_statements RBRA;
if_stmt: if_expr;
for_stmt:
	FOR LPAR name = ident IN iter = expr RPAR stmts = block;
while_stmt: WHILE LPAR cond = expr RPAR stmts = block;

expr:
	left = expr op = (
		POW
		| ASTERISK
		| DIV
		| MOD
		| ADD
		| SUB
		| BAND
		| BOR
		| BXOR
		| SHL
		| SHR
		| GT
		| GE
		| EQL
		| NE
		| LE
		| LT
		| AND
		| OR
		| XOR
	) right = expr								# operations
	| op = NOT right = expr						# unary_op
	| if_expr									# expr_if
	| par										# expr_par
	| name = fqn LPAR args = arg_list? RPAR		# call_expr
	| callee = expr LPAR args = arg_list? RPAR	# direct_call_expr
	| block_expr								# expr_block
	| float_lit									# expr_float
	| int_lit									# expr_int
	| str_lit									# expr_str
	| ref_from = expr DOT accessor = ident		# member_access_expr
	| ref_from = expr LSQR accessor = expr RSQR	# array_access_expr
	| assignee = expr EQ assigner = expr		# assign_expr
	| ident										# expr_ident;

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
	IF LPAR cond = expr RPAR then = expr (ELSE else_ = expr)?;

var_decl:
	VAR name = ident (COLON type_ = type_desc)? EQ value = expr;
const_decl:
	INV name = ident (COLON type_ = type_desc)? EQ value = expr;

par_list: (params += par_item COMMA)* params += par_item;
par_item: name = ident COLON type = type_desc;

return_stmt: RETURN value = expr? SEMICOLON;

arg_list: (expr COMMA)* (expr | named_arg_list);
named_arg_list: (args += named_arg COMMA)* args += named_arg;
named_arg: name = ident COLON value = expr;

float_lit: value = (FLOAT | EXPONENTIAL);
int_lit: value = (INT_BIN | INT_OCT | INT_DEC | INT_HEX);
str_lit:
	value = (
		STR_LIT
		| RAW_STR_LIT
		| TRIPLE_STR_LIT
		| TRIPLE_RAW_STR_LIT
	);

par: LPAR expression = expr RPAR;
