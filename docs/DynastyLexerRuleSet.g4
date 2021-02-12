lexer grammar DynastyLexerRuleSet;

IDENT: ('a' ..'z' | 'A' ..'Z' | '_') (
		'a' ..'z'
		| 'A' ..'Z'
		| '0' ..'9'
		| '_'
	)*;

IF: 'if';
FOR: 'for';
WHILE: 'while';
FN: 'fn';
LPAR: '(';
RPAR: ')';
LBRA: '{';
RBRA: '}';
