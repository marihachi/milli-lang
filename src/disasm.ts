import { promises as fs } from 'fs';
import { disasm } from './assemble/disasm';

async function entry() {
	const input = './debug.mbc';
	const code = await fs.readFile(input);

	// bytecode -> asm text
	const asm = disasm(code);

	// write the asm text
	const output = './debug.asm';
	await fs.writeFile(output, asm, { encoding: 'utf-8' });
}

entry()
.catch(err => {
	console.log(err);
});
