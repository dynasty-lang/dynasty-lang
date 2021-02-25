lexer grammar DynastyLexerRuleSet;

fragment INT_DEC_NUM: '0' | ('1' ..'9') (DEC_CHR | '_')*;
fragment INT_SUF: ('i' | 'u') ('8' | '16' | '32' | '64');
fragment DEC_CHR: '0' .. '9';
fragment HEX_CHR: (DEC_CHR | 'a' ..'f' | 'A' ..'F');

INT_DEC: INT_DEC_NUM INT_SUF?;

INT_HEX: '0x' HEX_CHR (HEX_CHR | '_')* INT_SUF?;

INT_OCT: '0' ('0' ..'7') ('0' ..'7' | '_')* INT_SUF?;

INT_BIN: '0b' [01] [01_]* INT_SUF?;

FLOAT: (
		(
			((DEC_CHR) (DEC_CHR | '_'))? '.' (
				(DEC_CHR) (DEC_CHR | '_')
			)
		)
		| (((DEC_CHR) (DEC_CHR | '_')) '.')
	) ('f' | 'd')?;

EXPONENTIAL: FLOAT [eE] [+-]? INT_DEC_NUM;

STR_LIT:
	'"' (
		~[\\\n\r"]
		| '\\' (
			[abefnrtv'"\\]
			| [uU] (
				HEX_CHR HEX_CHR (
					HEX_CHR HEX_CHR (
						HEX_CHR HEX_CHR HEX_CHR HEX_CHR
					)?
				)?
				| '{' HEX_CHR+ '}'
			)
			| 'x' HEX_CHR HEX_CHR
			| '0' '0' ..'7' '0' ..'7'
		)
	)* '"';

TRIPLE_STR_LIT:
	'"""' (
		~[\\]
		| '\\' (
			[abefnrtv'"\\]
			| [uU] (
				HEX_CHR HEX_CHR (
					HEX_CHR HEX_CHR (
						HEX_CHR HEX_CHR HEX_CHR HEX_CHR
					)?
				)?
				| '{' HEX_CHR+ '}'
			)
			| 'x' HEX_CHR HEX_CHR
			| '0' '0' ..'7' '0' ..'7'
		)
	)* '"""';

RAW_STR_LIT: 'r"' (~[\\\n\r"] | '""')* '"';
TRIPLE_RAW_STR_LIT: 'r"""' (~["] | '""')* '"""';

IF: 'if';
FOR: 'for';
WHILE: 'while';
FN: 'fn';
IN: 'in';
TYPE: 'type';
FROM: 'from';
IMPORT: 'import';
RETURN: 'return';
CONTINUE: 'continue';
BREAK: 'break';
ELSE: 'else';
VAR: 'var';
INV: 'inv';
AS: 'as';
AND: 'and';
OR: 'or';
XOR: 'xor';
NOT: 'not';
MOD: 'mod';
DOT: '.';
ASTERISK: '*';
COMMA: ',';
EQ: '=';
SEMICOLON: ';';
COLON: ':';
RARROW: '->';
LPAR: '(';
RPAR: ')';
LBRA: '{';
RBRA: '}';
LSQR: '[';
RSQR: ']';
POW: '**';
DIV: '/';
ADD: '+';
SUB: '-';
BAND: '&';
BOR: '|';
BXOR: '^';
SHR: '>>';
SHL: '<<';
GT: '>';
GE: '>=';
EQL: '==';
NE: '!=';
LE: '<=';
LT: '<';

IDENT: ('a' ..'z' | 'A' ..'Z' | '_') (
		'a' ..'z'
		| 'A' ..'Z'
		| DEC_CHR
		| '_'
	)*;

COMMENT: '#' ~[\n\r]* -> channel(HIDDEN);
BLOCK_COMMENT: '#-' .*? '-#' -> channel(HIDDEN);
WS: [ \t\r\n\f]+ -> channel(HIDDEN);
