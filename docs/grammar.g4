grammar DynastyLang;

statements: stmt*;
stmt: block | expr | if_stmt | for_stmt | while_stmt | declaration;
block: '{' statements '}';
if_stmt: 'if' '(' expr ')' block;
for_stmt: 'for' '(' ident 'in' expr ')' block;
while_stmt: 'while' '(' expr ')' block;
expr: if_expr | block_expr | biary_op | unary_op | literals;
