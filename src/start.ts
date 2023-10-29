import { promises as fs } from 'fs';
import { runCode } from './vm/index.js';

async function start() {
	const filePath = './debug.mbc';
	const code = await fs.readFile(filePath);

	// run the vm code
	runCode(code, false);
}

start()
.catch(err => {
	console.log(err);
});
