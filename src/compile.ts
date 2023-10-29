import { promises as fs } from 'fs';
import { compile } from './compile/index.js';

async function entry() {
	const filePath = './debug.mil';
	const source = await fs.readFile(filePath, { encoding: 'utf-8' });

	// milli code -> bytecode
	const code = compile(source, false);

	// write the bytecode
	const output = './debug.mbc';
	await fs.writeFile(output, code);
}

entry()
.catch(err => {
	console.log(err);
});
