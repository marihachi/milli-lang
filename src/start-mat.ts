import { promises as fs } from 'fs';
import { runCode } from './vm/index.js';
import { assemble } from './assemble/index.js';

async function start() {
	const filePath = './debug.mat';
	const source = await fs.readFile(filePath, { encoding: 'utf-8' });

	// asm text -> vm code
	const code = assemble(source);

	// run the vm code
	runCode(code, false);
}

start()
.catch(err => {
	console.log(err);
});
