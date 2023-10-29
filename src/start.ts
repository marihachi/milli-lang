import { promises as fs } from 'fs';
import { runCode } from './vm/index.js';
import { compile } from './compile/index.js';

async function start() {
	const filePath = './debug.mil';
	const source = await fs.readFile(filePath, { encoding: 'utf-8' });

	// milli code -> vm code
	const code = compile(source, false);

	// run the vm code
	runCode(code, false);
}

start()
.catch(err => {
	console.log(err);
});
