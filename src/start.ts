import { promises as fs } from 'fs';
import { Session, run } from './vm/index.js';
import { Func, Module } from './vm/module.js';

async function entry() {
	const filePath = './debug.mbc';
	const code = await fs.readFile(filePath);
	const func = new Func([], code);
	const module = new Module([func]);

	// run the vm code
	const session = new Session([], [module]);
	run(session, false);
}

entry()
.catch(err => {
	console.log(err);
});
