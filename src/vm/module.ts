import { Buffer } from 'buffer';

export class Module {
	constructor(
		public funcs: Func[],
	) { }
}

export class Func {
	constructor(
		public params: { type: ValueType }[],
		public instructions: Buffer,
	) { }
}

export class ValueType {
	constructor(
		public kind: ValueTypeKind,
		public size: number,
	) { }
}

export enum ValueTypeKind {
	Int = 0x00,
}
