import { AsmOperation, OpCode } from '../asm/operation.js';
import { MatNode, Program } from './node.js';

const opCodeTable = new Map<string, OpCode>([
	['nop', OpCode.Nop],
	['pushIdent', OpCode.PushIdent],
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

export function emitAsm(program: Program): AsmOperation[] {
	return program.children.map(x => emitOperation(x));
}

function emitOperation(node: MatNode): AsmOperation {
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

	return new AsmOperation(opCode, operands);
}
