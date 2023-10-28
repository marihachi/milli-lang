export type MatNode = Program | Operation | Operand;

export type Loc = {
	line: number;
	column: number;
};

export class Program {
	kind = 'Program' as const;
	children: MatNode[] = [];
	constructor(
		statements: Operation[],
		public loc: Loc,
	) {
		this.children.push(...statements);
	}
}

export class Operation {
	kind = 'Operation' as const;
	children: MatNode[] = [];
	constructor(
		public opcode: string,
		operands: Operand[],
		public loc: Loc,
	) {
		this.children.push(...operands);
	}
}

export type Operand = NumberLiteral | Reference;

export class NumberLiteral {
	kind = 'NumberLiteral' as const;
	children: MatNode[] = [];
	constructor(
		public value: number,
		public loc: Loc,
	) { }
}

export class Reference {
	kind = 'Reference' as const;
	children: MatNode[] = [];
	constructor(
		public idetifier: string,
		public loc: Loc,
	) { }
}
