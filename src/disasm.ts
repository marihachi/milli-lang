import { promises as fs } from 'fs';
import { compile } from './compile/index.js';
import { OpCode, VmOperation } from './vm/operation.js';

async function start() {
	const input = './debug.mil';
	const source = await fs.readFile(input, { encoding: 'utf-8' });

	// milli code -> vm code
	const asm = compile(source);

	// vm code -> asm text
	const mat = disasm(asm);

	// write the asm text
	const output = './disasm.mat';
	await fs.writeFile(output, mat, { encoding: 'utf-8' });
}

const opCodeTable = new Map<OpCode, string>([
	[OpCode.Nop, 'Nop'],
	[OpCode.PushIdent, 'pushIdent'],
	[OpCode.Push, 'Push'],
	[OpCode.Add, 'Add'],
	[OpCode.Sub, 'Sub'],
	[OpCode.Mul, 'Mul'],
	[OpCode.Div, 'Div'],
	[OpCode.Rem, 'Rem'],
	[OpCode.Neg, 'Neg'],
	[OpCode.Store, 'Store'],
	[OpCode.Load, 'Load'],
	[OpCode.Print, 'Print'],
]);

function disasm(operations: VmOperation[]): string {
	let mat = '';
	for (const operation of operations) {
		const opcode = opCodeTable.get(operation.opcode);
		if (opcode == null) {
			throw new Error('unknown operation');
		}
		const operands = operation.operands
			.map(x => x.toString())
			.join(', ');
		if (operands.length > 0) {
			mat += opcode + ' ' + operands + '\n';
		} else {
			mat += opcode + '\n';
		}
	}
	return mat;
}

start()
.catch(err => {
	console.log(err);
});
