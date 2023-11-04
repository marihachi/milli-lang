import { Buffer } from 'buffer';
import { OpCode, InstructionReader, SyscallKind } from './instruction.js';

// 32bit instruction

type Inst = { opCode: number, operands: number[] };

export function runCode(buf: Buffer, debug: boolean) {
	const memory: number[] = [];
	const stack: number[] = [];
	let pc = 0;
	const reader = new InstructionReader(buf);
	while (true) {
		const inst = reader.read(pc);
		if (inst == null) {
			if (debug) {
				console.log('stop');
			}
			break;
		}

		if (debug) {
			console.log('pc:', pc);
			console.log('inst:', inst.opCode + ', ' + inst.operands.join(', '));
			console.log('stack:', stack);
			console.log('memory:', memory);
			console.log('----');
		}

		pc += 4;

		switch (inst.opCode) {
			case OpCode.Nop: {
				break;
			}
			case OpCode.Push: {
				stack.push(inst.operands[0]);
				break;
			}
			case OpCode.PushLocal: {
				stack.push(inst.operands[0]);
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
				if (typeof a !== 'number') {
					throw new Error('runtime error. (op: Store)');
				}
				const b = stack.pop();
				if (typeof b !== 'number') {
					throw new Error('runtime error. (op: Store)');
				}
				memory[a] = b;
				break;
			}
			case OpCode.Load: {
				const a = stack.pop();
				if (typeof a !== 'number') {
					throw new Error('runtime error. (op: Load)');
				}
				const x = memory[a];
				if (typeof x !== 'number') {
					throw new Error('runtime error. (op: Load)');
				}
				stack.push(x);
				break;
			}
			case OpCode.Syscall: {
				syscall(inst, stack, memory);
				break;
			}
			default: {
				throw new Error('runtime error. invalid op code');
			}
		}
	}
}

function syscall(inst: Inst, stack: number[], memory: number[]) {
	const kind = inst.operands[0];
	switch (kind) {
		case SyscallKind.Print: {
			const a = stack.pop();
			if (typeof a !== 'number') {
				throw new Error('runtime error. (op: Syscall)');
			}
			console.log(a);
			break;
		}
		default: {
			throw new Error('runtime error. (op: Syscall)');
		}
	}
}
