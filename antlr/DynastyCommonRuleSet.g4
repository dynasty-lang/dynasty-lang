grammar DynastyCommonRuleSet;

import DynastyLexerRuleSet;

fqn: (names += IDENT DOT)* names += IDENT;
