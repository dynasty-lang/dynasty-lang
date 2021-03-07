import * as fs from 'fs';
import parseArgs from 'command-line-args';
import { dumpAst } from './ast/astNode';
import { getTokenStream, parse, generateAst, compile } from './parsing';

function entry() {
  const args = parseArgs([
    {
      name: 'input',
      alias: 'i',
      multiple: true,
      type: String,
    },
    {
      name: 'compile',
      alias: 'c',
      type: Boolean,
    },
  ] as parseArgs.OptionDefinition[]);
  const inputFiles: string[] = args['input'];
  if (!inputFiles) {
    return;
  }

  if (args.compile) {
    inputFiles.forEach((it) => {
      const content = fs.readFileSync(it, { encoding: 'utf-8' });
      const tokenStream = getTokenStream(content);
      const tree = parse(tokenStream);
      const ast = generateAst(tree);
      const path = it.replace(/\\\\/g, '/').split(/\//g);
      const code = compile(ast, path[path.length - 1]);
      console.log(code);
    });
    return;
  }

  inputFiles.forEach((it) => {
    const content = fs.readFileSync(it, { encoding: 'utf-8' });
    const tokenStream = getTokenStream(content);
    const tree = parse(tokenStream);
    const ast = generateAst(tree);
    dumpAst(ast);
  });
}

entry();
