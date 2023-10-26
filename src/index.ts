import { parse } from './syntaxes/parser.js';
import { emit } from './asm/emitter.js';
import { AsmWriter } from './asm/writer.js';
import { run } from './vm/runner.js';

function start() {
	const source = `
		x = 1 + 3;
		print x + 6;
	`;

	// parse source
	const tree = parse(source);

	// emit asm
	const asm = new AsmWriter();
	emit(asm, tree);

	// run asm
	run(asm.code);
}
start();
