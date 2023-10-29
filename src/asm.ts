import { promises as fs } from 'fs';
import { assemble } from './assemble/index.js';

async function start() {
	const filePath = './debug.asm';
	const asm = await fs.readFile(filePath, { encoding: 'utf-8' });

	// asm text -> bytecode
	const code = assemble(asm);

	// write the bytecode
	const output = './debug.mbc';
	await fs.writeFile(output, code);
}

start()
.catch(err => {
	console.log(err);
});
