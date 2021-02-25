import {
  CharStreams,
  CommonTokenStream,
  TokenStream,
  ParserRuleContext,
} from 'antlr4ts';
import { AstNode } from './ast/astNode';
import { DynastyLangLexer } from './generated/DynastyLangLexer';
import { DynastyLangParser } from './generated/DynastyLangParser';
import { BuildAstVisitor } from './visitors/buildAstVisitor';

export function getTokenStream(content: string): TokenStream {
  const lexer = new DynastyLangLexer(CharStreams.fromString(content));
  return new CommonTokenStream(lexer);
}

export function parse(tokenStream: TokenStream): ParserRuleContext {
  const parser = new DynastyLangParser(tokenStream);
  return parser.top();
}

export function generateAst(tree: ParserRuleContext): AstNode {
  let visitor = new BuildAstVisitor();
  return visitor.visit(tree);
}
