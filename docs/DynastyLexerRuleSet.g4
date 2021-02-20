lexer grammar DynastyLexerRuleSet;

INT_SUF: ('i' | 'u') ('8' | '16' | '32' | '64');
DEC_CHR: '0' .. '9';
HEX_CHR: (DEC_CHR | 'a' ..'f' | 'A' ..'F');

INT_DEC: ('1' ..'9') (DEC_CHR | '_')* INT_SUF?;

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

EXPONENTIAL: FLOAT [eE] [+-]? ('1' ..'9') (DEC_CHR | '_')*;

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
DOT: '.';
LPAR: '(';
RPAR: ')';
LBRA: '{';
RBRA: '}';

IDENT: ('a' ..'z' | 'A' ..'Z' | '_') (
		'a' ..'z'
		| 'A' ..'Z'
		| DEC_CHR
		| '_'
	)*;

WS: [ \t\r\n\f]+ -> channel(HIDDEN);
