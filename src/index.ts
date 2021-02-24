import * as fs from 'fs'
import { CharStreams, CommonTokenStream, TokenStream, ParserRuleContext } from 'antlr4ts';
import parseArgs from 'command-line-args';
import { DynastyLangLexer } from './generated/DynastyLangLexer';
import { DynastyLangParser } from './generated/DynastyLangParser';
import { ASTWriteOutVisitor } from './lib/writeoutVisitor';

function getTokenStream(content: string): TokenStream {
  const lexer = new DynastyLangLexer(CharStreams.fromString(content));
  return new CommonTokenStream(lexer);
}


function parse(tokenStream: TokenStream): ParserRuleContext {
  const parser = new DynastyLangParser(tokenStream);
  return parser.top();
}


function writeout(tree: ParserRuleContext) {
  let visitor = new ASTWriteOutVisitor();
  visitor.visit(tree);
}

function entry() {
  const args = parseArgs([{
    name: 'input',
    alias: 'i',
    multiple: true,
    type: String
  }]);
  const inputFiles: string[] = args['input'];
  if (!inputFiles) {
    return;
  }
  inputFiles.forEach((it) => {
    const content = fs.readFileSync(it, { encoding: 'utf-8' });
    const tokenStream = getTokenStream(content);
    const tree = parse(tokenStream);
    writeout(tree);
  });
}

entry();
