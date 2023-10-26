import { parse } from './syntaxes/parser.js';
import { emit } from './emitter.js';

function start() {
	const input = `
		x = 1 + 2;
		print x + 3;
	`;

	const nodes = parse(input);

	emit(nodes);

	// run();
}
start();
