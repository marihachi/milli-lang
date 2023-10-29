import { promises as fs } from 'fs';
import { InstructionReader, opTable } from './vm/instruction.js';

async function start() {
	const input = './debug.mbc';
	const code = await fs.readFile(input);

	// bytecode -> asm text
	const asm = disasm(code);

	// write the asm text
	const output = './debug.asm';
	await fs.writeFile(output, asm, { encoding: 'utf-8' });
}

function disasm(instructions: Buffer): string {
	let mat = '';
	const reader = new InstructionReader(instructions);
	let address = 0;
	while (true) {
		const inst = reader.read(address);
		address += 4;
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
