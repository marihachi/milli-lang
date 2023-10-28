import { promises as fs } from 'fs';
import { run } from './asm/runner.js';
import { compile } from './compile/index.js';

async function start() {
	const filePath = './debug.mil';
	const source = await fs.readFile(filePath, { encoding: 'utf-8' });

	// compile
	const asm = compile(source);

	// run asm
	run(asm);
}

start()
.catch(err => {
	console.log(err);
});
