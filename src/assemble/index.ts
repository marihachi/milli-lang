import { InstructionWriter, Instruction, opTable } from '../vm/instruction.js';
import { parse } from './parser.js';
import { Program } from './node.js';

export function assemble(mat: string): Buffer {
	// parse text asm
	const tree = parse(mat);

	// generate vm code
	const w = new InstructionWriter;
	emitCode(w, tree);
	const code = w.serialize();

	return code;
}

function emitCode(w: InstructionWriter, program: Program) {
	for (const node of program.children) {
		if (node.kind !== 'Statement') {
			throw new Error('statement expected');
		}

		const op = opTable.find(x => x.name.toLowerCase() === node.opcode.toLowerCase());
		if (op == null) {
			throw new Error('unknown instruction');
		}

		const operands: (string | number)[] = [];
		for (const child of node.children) {
			switch (child.kind) {
				case 'NumberLiteral': {
					operands.push(child.value);
					break;
				}
				case 'Reference': {
					operands.push(child.idetifier);
					break;
				}
				default: {
					throw new Error('unhandled node');
				}
			}
		}

		w.write(new Instruction(op.code, operands));
	}
}
