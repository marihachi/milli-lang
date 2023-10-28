export type AsmNode = PushIdent | Push | Add | Sub | Mul | Div | Neg | Store | Load | Print;

export class PushIdent {
	kind = 'PushIdent' as const;
	constructor(
		public identifier: string,
	) { }
}

export class Push {
	kind = 'Push' as const;
	constructor(
		public value: number,
	) { }
}

export class Add {
	kind = 'Add' as const;
}

export class Sub {
	kind = 'Sub' as const;
}

export class Mul {
	kind = 'Mul' as const;
}

export class Div {
	kind = 'Div' as const;
}

// 符号反転
export class Neg {
	kind = 'Neg' as const;
}

export class Store {
	kind = 'Store' as const;
}

export class Load {
	kind = 'Load' as const;
}

export class Print {
	kind = 'Print' as const;
}