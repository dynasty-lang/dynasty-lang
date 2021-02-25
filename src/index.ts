import * as fs from 'fs';
import parseArgs from 'command-line-args';
import { dumpAst } from './ast/astNode';
import { getTokenStream, parse, generateAst } from './parsing';

function entry() {
  const args = parseArgs([
    {
      name: 'input',
      alias: 'i',
      multiple: true,
      type: String,
    },
  ]);
  const inputFiles: string[] = args['input'];
  if (!inputFiles) {
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
