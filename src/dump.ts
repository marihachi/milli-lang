import { promises as fs } from 'fs';
import { compile } from './compile/index.js';
import { disasm } from './assemble/disasm.js';

async function entry() {
	const filePath = './debug.mil';
	const source = await fs.readFile(filePath, { encoding: 'utf-8' });

	// milli code -> bytecode
	const code = compile(source, false);

	// write the bytecode
	await fs.writeFile('./debug.mbc', code);

	// bytecode -> asm text
	const asm = disasm(code);

	// write the asm text
	await fs.writeFile('./debug.asm', asm, { encoding: 'utf-8' });
}

entry()
.catch(err => {
	console.log(err);
});
