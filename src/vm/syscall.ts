import { Instruction } from './instruction.js';

export enum SyscallKind {
	Print = 0x00,
}

export function syscall(inst: Instruction, stack: number[], memory: number[]) {
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
