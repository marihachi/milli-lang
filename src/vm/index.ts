import { OpCode, readInstruction } from './instruction.js';
import { Module } from './module.js';
import { syscall } from './syscall.js';

// 32bit instruction

export class Session {
	constructor(
		public memory: number[],
		public modules: Module[],
		public frame?: Frame,
	) { }
}

class Frame {
	constructor(
		public moduleIndex: number,
		public funcIndex: number,
		public pc: number,
		public stack: number[],
		public parent?: Frame,
	) { }
}

export function run(sess: Session, debug: boolean) {
	sess.frame = new Frame(0, 0, 0, []);

	while (true) {
		const frame: Frame = sess.frame;
		const stack = frame.stack;
		const memory = sess.memory;

		const inst = readInstruction(
			sess.modules[frame.moduleIndex].funcs[frame.funcIndex].instructions,
			frame.pc
		);

		if (inst == null) {
			if (debug) {
				console.log('stop');
			}
			break;
		}

		if (debug) {
			console.log('pc:', frame.pc);
			console.log('inst:', inst.opCode + ', ' + inst.operands.join(', '));
			console.log('stack:', stack);
			console.log('memory:', memory);
			console.log('----');
		}

		frame.pc += 4;

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
			case OpCode.Call: {
				let length = inst.operands[0];
				const fIndex = inst.operands[1];
				const mIndex = inst.operands[2];
				const subStack: number[] = [];
				for (let i = 0; i < length; i++) {
					if (stack.length == 0) {
						throw new Error('runtime error. (op: Call)');
					}
					const a = stack.pop();
					if (typeof a !== 'number') {
						throw new Error('runtime error. (op: Call)');
					}
					subStack.push(a);
				}
				sess.frame = new Frame(mIndex, fIndex, 0, subStack, frame);
				break;
			}
			case OpCode.Ret: {
				if (sess.frame.parent == null) {
					throw new Error('runtime error. (op: Ret)');
				}
				const parentFrame: Frame = sess.frame.parent;
				if (inst.operands[0] != 0) {
					const a = stack.pop();
					if (typeof a !== 'number') {
						throw new Error('runtime error. (op: Ret)');
					}
					parentFrame.stack.push(a);
				}
				sess.frame = parentFrame;
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
