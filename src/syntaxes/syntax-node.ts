export type SyntaxNode = Program | Statement | Expression;

export type Loc = {
	line: number;
	column: number;
};

export function applyChildren(parent: SyntaxNode, f: (x: SyntaxNode) => void) {
	for (const child of parent.children) {
		f(child);
	}
}

export class Program {
	kind = 'Program' as const;
	children: Statement[] = [];
	constructor(
		statements: Statement[],
		public loc: Loc,
	) {
		this.children.push(...statements);
	}
}

export type Statement = PrintStatement | AssignStatement | ExpressionStatement;

export class PrintStatement {
	kind = 'PrintStatement' as const;
	children: Expression[] = [];
	constructor(
		expr: Expression,
		public loc: Loc,
	) {
		this.children.push(expr);
	}
}

export class AssignStatement {
	kind = 'AssignStatement' as const;
	children: Expression[] = [];
	constructor(
		target: Expression,
		expr: Expression,
		public loc: Loc,
	) {
		this.children.push(target);
		this.children.push(expr);
	}
}

export class ExpressionStatement {
	kind = 'ExpressionStatement' as const;
	children: Expression[] = [];
	constructor(
		expr: Expression,
		public loc: Loc,
	) {
		this.children.push(expr);
	}
}

export type Expression = NumberLiteral | Reference | Add | Sub | Mul | Div | Minus;

export class NumberLiteral {
	kind = 'NumberLiteral' as const;
	children: Expression[] = [];
	constructor(
		public value: number,
		public loc: Loc,
	) {}
}

export class Reference {
	kind = 'Reference' as const;
	children: Expression[] = [];
	constructor(
		public identifier: string,
		public loc: Loc,
	) {}
}

export class Add {
	kind = 'Add' as const;
	children: Expression[] = [];
	constructor(
		left: Expression,
		right: Expression,
		public loc: Loc,
	) {
		this.children.push(left);
		this.children.push(right);
	}
}

export class Sub {
	kind = 'Sub' as const;
	children: Expression[] = [];
	constructor(
		left: Expression,
		right: Expression,
		public loc: Loc,
	) {
		this.children.push(left);
		this.children.push(right);
	}
}

export class Mul {
	kind = 'Mul' as const;
	children: Expression[] = [];
	constructor(
		left: Expression,
		right: Expression,
		public loc: Loc,
	) {
		this.children.push(left);
		this.children.push(right);
	}
}

export class Div {
	kind = 'Div' as const;
	children: Expression[] = [];
	constructor(
		left: Expression,
		right: Expression,
		public loc: Loc,
	) {
		this.children.push(left);
		this.children.push(right);
	}
}

export class Minus {
	kind = 'Minus' as const;
	children: Expression[] = [];
	constructor(
		expr: Expression,
		public loc: Loc,
	) {
		this.children.push(expr);
	}
}
