import { opTable, readInstruction } from '../vm/instruction.js';

export function disasm(instructions: Buffer): string {
	let mat = '';
	let address = 0;
	while (true) {
		const inst = readInstruction(instructions, address);
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
