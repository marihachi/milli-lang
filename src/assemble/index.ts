import { VmOperation, OpCode } from '../vm/operation.js';
import { parse } from './parser.js';
import { Program } from './node.js';

const opCodeTable = new Map<string, OpCode>([
	['nop', OpCode.Nop],
	['pushident', OpCode.PushIdent],
	['push', OpCode.Push],
	['add', OpCode.Add],
	['sub', OpCode.Sub],
	['mul', OpCode.Mul],
	['div', OpCode.Div],
	['rem', OpCode.Rem],
	['neg', OpCode.Neg],
	['store', OpCode.Store],
	['load', OpCode.Load],
	['print', OpCode.Print],
]);

export function assemble(mat: string): VmOperation[] {
	// parse text asm
	const tree = parse(mat);

	// generate vm code
	const code = emitCode(tree);

	return code;
}

function emitCode(program: Program): VmOperation[] {
	const asm: VmOperation[] = [];

	for (const node of program.children) {
		if (node.kind !== 'Operation') {
			throw new Error('operation expected');
		}

		const opCode = opCodeTable.get(node.opcode.toLowerCase());
		if (opCode == null) {
			throw new Error('unknown operation');
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

		asm.push(new VmOperation(opCode, operands));
	}

	return asm;
}
