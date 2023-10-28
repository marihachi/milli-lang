export enum OpCode {
	Nop = 0x00,
	PushIdent,
	Push,

	Add = 0x10,
	Sub,
	Mul,
	Div,
	Rem,
	Neg,

	Store = 0x20,
	Load,

	Print = 0x30,
}

export const opTable: { code: OpCode, name: string, operands: number }[] = [
	{ code: OpCode.Nop, name: 'Nop', operands: 0 },
	{ code: OpCode.PushIdent, name: 'PushIdent', operands: 1 },
	{ code: OpCode.Push, name: 'Push', operands: 1 },
	{ code: OpCode.Add, name: 'Add', operands: 0 },
	{ code: OpCode.Sub, name: 'Sub', operands: 0 },
	{ code: OpCode.Mul, name: 'Mul', operands: 0 },
	{ code: OpCode.Div, name: 'Div', operands: 0 },
	{ code: OpCode.Rem, name: 'Rem', operands: 0 },
	{ code: OpCode.Neg, name: 'Neg', operands: 0 },
	{ code: OpCode.Store, name: 'Store', operands: 0 },
	{ code: OpCode.Load, name: 'Load', operands: 0 },
	{ code: OpCode.Print, name: 'Print', operands: 0 },
];

/*
 * PushIdent
 * operands:
 * - identifier: string
 * 
 * Push
 * operands:
 * - value: number
*/

export class Instruction {
	constructor(
		public opcode: OpCode,
		public operands: (string | number)[] = [],
	) { }
}

export class InstructionWriter {
	instructions: Instruction[] = [];

	write(op: Instruction) {
		this.instructions.push(op);
	}

	serialize(): Buffer {
		const bytes: number[] = [];
		for (const inst of this.instructions) {
			bytes.push(inst.opcode);
			for (let i = 0; i < 3; i++) {
				if (i < inst.operands.length) {
					// TODO: indexed reference
					//bytes.push(inst.operands[i]);
					bytes.push(0);
				} else {
					bytes.push(0);
				}
			}
		}
		return Buffer.from(bytes);
	}
}

export class InstructionReader {
	constructor(
		public buf: Buffer,
	) { }

	read(offset: number): { opCode: number, operands: number[] } | undefined {
		// fetch
		let inst;
		try {
			inst = this.buf.readUInt32LE(offset);
		} catch (e) {
			return;
		}
		// parse
		const opCode = inst & 0xFF;
		const operands = [];
		for (let i = 0; i < 3; i++) {
			const operand = (inst >> (8 * i)) & 0xFF;
			operands.push(operand);
		}
		return {
			opCode,
			operands,
		};
	}
}
