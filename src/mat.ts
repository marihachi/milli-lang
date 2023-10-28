import { promises as fs } from 'fs';
import { run } from './asm/runner.js';
import { assemble } from './mat/index.js';

async function start() {
	const filePath = './debug.mat';
	const source = await fs.readFile(filePath, { encoding: 'utf-8' });

	// assemble
	const asm = assemble(source);

	// run asm
	run(asm);
}

start()
.catch(err => {
	console.log(err);
});
