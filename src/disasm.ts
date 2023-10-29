import { promises as fs } from 'fs';
import { disasm } from './assemble/disasm';

async function start() {
	const input = './debug.mbc';
	const code = await fs.readFile(input);

	// bytecode -> asm text
	const asm = disasm(code);

	// write the asm text
	const output = './debug.asm';
	await fs.writeFile(output, asm, { encoding: 'utf-8' });
}

start()
.catch(err => {
	console.log(err);
});
