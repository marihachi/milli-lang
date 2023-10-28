import { promises as fs } from 'fs';
import { compile } from './compile/index.js';
import { InstructionReader, opTable } from './vm/instruction.js';

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

function disasm(instructions: Buffer): string {
	let mat = '';
	const reader = new InstructionReader(instructions);
	let offset = 0;
	while (true) {
		const inst = reader.read(offset);
		if (inst == null) {
			break;
		}
		const op = opTable.find(x => x.code === inst.opCode);
		if (op == null) {
			throw new Error('unknown instruction');
		}
		let operandsPart = '';
		for (let i = 0; i < op.operands; i++) {
			if (operandsPart.length == 0) {
				operandsPart += ' ';
			} else {
				operandsPart += ', ';
			}
			operandsPart += inst.operands[i].toString();
		}
		mat += op.name + operandsPart + '\n';
	}

	return mat;
}

start()
.catch(err => {
	console.log(err);
});
