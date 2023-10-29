/*
	[Instructions]
	0x00 Nop
	0x01 PushLocal
	0x02 Push
	0x10 Add
	0x11 Sub
	0x12 Mul
	0x13 Div
	0x14 Rem
	0x15 Neg
	0x20 Store
	0x21 Load
	0x30 Print
*/

export enum OpCode {
	Nop = 0x00,
	PushLocal,
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
	{ code: OpCode.PushLocal, name: 'PushLocal', operands: 1 },
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
 * PushLocal
 * operands:
 * - index: number
 * 
 * Push
 * operands:
 * - value: number
*/

export class Instruction {
	constructor(
		public opcode: OpCode,
		public operands: number[] = [],
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
					bytes.push(inst.operands[i]);
				} else {
					bytes.push(0);
				}
			}
		}
		const buf = Buffer.from(bytes);
		return buf;
	}
}

export class InstructionReader {
	constructor(
		public buf: Buffer,
	) { }

	/**
	 * @param address byte offset
	*/
	read(address: number): { opCode: number, operands: number[] } | undefined {
		// fetch
		let inst;
		try {
			inst = this.buf.readUInt32LE(address);
		} catch (e) {
			return;
		}

		// parse
		// bit[7:0]   opCode    (8 bits)
		// bit[15:8]  operand 0 (8 bits)
		// bit[23:16] operand 1 (8 bits)
		// bit[31:24] operand 2 (8 bits)
		const opCode = inst & 0xFF;
		const operands = [];
		for (let i = 0; i < 3; i++) {
			// 8, 16, 24
			const offset = (i + 1) * 8;
			const operand = (inst >> offset) & 0xFF;
			operands.push(operand);
		}

		return {
			opCode,
			operands,
		};
	}
}
