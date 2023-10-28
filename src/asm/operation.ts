export enum OpCode {
	Nop = 0,
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

/*
 * PushIdent
 * operands:
 * - identifier: string
 * 
 * Push
 * operands:
 * - value: number
*/

export class AsmOperation {
	constructor(
		public opcode: OpCode,
		public operands: (string | number)[] = [],
	) { }
}
