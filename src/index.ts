import { promises as fs } from 'fs';
import { parse } from './syntax/parser.js';
import { emit } from './asm/emitter.js';
import { AsmWriter } from './asm/writer.js';
import { run } from './vm/runner.js';

async function start() {
	const filePath = './debug.mil';
	const source = await fs.readFile(filePath, { encoding: 'utf-8' });

	// parse source
	const tree = parse(source);

	// emit asm
	const asm = new AsmWriter();
	emit(asm, tree);

	// run asm
	run(asm.code);
}

start()
.catch(err => {
	console.log(err);
});
