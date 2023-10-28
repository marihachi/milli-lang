import { VmOperation, OpCode } from './operation.js';

export class VmWriter {
	code: VmOperation[] = [];

	write(node: VmOperation) {
		this.code.push(node);
	}
}

export function runCode(code: VmOperation[]) {
	const memory: Map<string, { value: number }> = new Map();
	const stack: (string | number)[] = [];
	for (const op of code) {
		switch (op.opcode) {
			case OpCode.Nop: {
				break;
			}
			case OpCode.Push: {
				if (op.operands.length == 0) {
					throw new Error('runtime error. (op: Push)');
				}
				stack.push(op.operands[0]);
				break;
			}
			case OpCode.PushIdent: {
				if (op.operands.length == 0) {
					throw new Error('runtime error. (op: PushIdent)');
				}
				stack.push(op.operands[0]);
				break;
			}
			case OpCode.Add: {
				const a = stack.pop();
				const b = stack.pop();
				if (typeof a !== 'number' || typeof b !== 'number') {
					throw new Error('runtime error. (op: Add)');
				}
				const x = a + b;
				stack.push(x);
				break;
			}
			case OpCode.Sub: {
				const a = stack.pop();
				const b = stack.pop();
				if (typeof a !== 'number' || typeof b !== 'number') {
					throw new Error('runtime error. (op: Sub)');
				}
				const x = a - b;
				stack.push(x);
				break;
			}
			case OpCode.Mul: {
				const a = stack.pop();
				const b = stack.pop();
				if (typeof a !== 'number' || typeof b !== 'number') {
					throw new Error('runtime error. (op: Mul)');
				}
				const x = a * b;
				stack.push(x);
				break;
			}
			case OpCode.Div: {
				const a = stack.pop();
				const b = stack.pop();
				if (typeof a !== 'number' || typeof b !== 'number') {
					throw new Error('runtime error. (op: Div)');
				}
				const x = a / b;
				stack.push(x);
				break;
			}
			case OpCode.Rem: {
				const a = stack.pop();
				const b = stack.pop();
				if (typeof a !== 'number' || typeof b !== 'number') {
					throw new Error('runtime error. (op: Rem)');
				}
				const x = a % b;
				stack.push(x);
				break;
			}
			case OpCode.Neg: {
				const a = stack.pop();
				if (typeof a !== 'number') {
					throw new Error('runtime error. (op: Neg)');
				}
				const x = -a;
				stack.push(x);
				break;
			}
			case OpCode.Store: {
				const a = stack.pop();
				if (typeof a !== 'string') {
					throw new Error('runtime error. (op: Store)');
				}
				const b = stack.pop();
				if (typeof b !== 'number') {
					throw new Error('runtime error. (op: Store)');
				}
				memory.set(a, { value: b });
				break;
			}
			case OpCode.Load: {
				const a = stack.pop();
				if (typeof a !== 'string') {
					throw new Error('runtime error. (op: Load)');
				}
				const x = memory.get(a);
				if (x == null) {
					throw new Error('runtime error. (op: Load)');
				}
				stack.push(x.value);
				break;
			}
			case OpCode.Print: {
				const a = stack.pop();
				if (typeof a !== 'number') {
					throw new Error('runtime error. (op: Print)');
				}
				console.log(a);
				break;
			}
		}
	}
}
