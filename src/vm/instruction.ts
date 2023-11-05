export class Instruction {
	constructor(
		public opCode: number,
		public operands: number[] = [],
	) { }
}

/*
	[Instructions]
	0x00 Nop
	0x01 PushLocal
	0x02 Push
	0x08 Store
	0x09 Load
	0x20 Add
	0x21 Sub
	0x22 Mul
	0x23 Div
	0x24 Rem
	0x25 Neg
	0x40 Call
	0x60 Syscall
*/

export enum OpCode {
	Nop = 0x00,
	PushLocal,
	Push,
	Store = 0x08,
	Load,
	Add = 0x20,
	Sub,
	Mul,
	Div,
	Rem,
	Neg,
	Call = 0x40,
	Ret = 0x48,
	Syscall = 0x60,
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
	{ code: OpCode.Syscall, name: 'Syscall', operands: 1 },
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

export class InstructionWriter {
	instructions: Instruction[] = [];

	write(op: Instruction) {
		this.instructions.push(op);
	}

	serialize(): Buffer {
		const bytes: number[] = [];
		for (const inst of this.instructions) {
			bytes.push(inst.opCode);
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

/**
 * @param address byte offset
*/
export function readInstruction(buf: Buffer, address: number): Instruction | undefined {
	// fetch
	let inst;
	try {
		inst = buf.readUInt32LE(address);
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

	return new Instruction(opCode, operands);
}
