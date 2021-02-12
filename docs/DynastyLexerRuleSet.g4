lexer grammar DynastyLexerRuleSet;

IF: 'if';
FOR: 'for';
WHILE: 'while';
FN: 'fn';
IN: 'in';
DOT: '.';
LPAR: '(';
RPAR: ')';
LBRA: '{';
RBRA: '}';

IDENT: ('a' ..'z' | 'A' ..'Z' | '_') (
		'a' ..'z'
		| 'A' ..'Z'
		| '0' ..'9'
		| '_'
	)*;
