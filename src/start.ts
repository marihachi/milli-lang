import { promises as fs } from 'fs';
import { runCode } from './vm/index.js';

async function entry() {
	const filePath = './debug.mbc';
	const code = await fs.readFile(filePath);

	// run the vm code
	runCode(code, false);
}

entry()
.catch(err => {
	console.log(err);
});
