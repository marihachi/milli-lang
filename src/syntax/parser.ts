import { error } from '../util.js';
import { Scanner } from './scanner.js';
import { ITokenStream } from './token-stream.js';
import { TokenKind } from './token.js';
import {
	Add,
	AssignStatement,
	Div,
	Expression,
	ExpressionStatement,
	Minus,
	Mul,
	NumberLiteral,
	PrintStatement,
	Program,
	Reference,
	Statement,
	Sub
} from './node.js';

export function parse(input: string): Program {
	const s = new Scanner(input);
	const node = parseProgram(s);
	return node;
}

function parseProgram(s: ITokenStream): Program {
	const loc = s.token.loc;
	const nodes: Statement[] = [];
	while (s.getKind() !== TokenKind.EOF) {
		if (s.getKind() === TokenKind.SemiColon || s.getKind() === TokenKind.NewLine) {
			s.next();
		} else {
			const n = parseStatement(s);
			nodes.push(n);
			s.nextWith(TokenKind.SemiColon);
		}
	}
	return new Program(nodes, loc);
}

function parseStatement(s: ITokenStream): Statement {
	const loc = s.token.loc;
	switch (s.getKind()) {
		case TokenKind.PrintKeyword: {
			s.next();
			const expr = parseExpr(s);
			return new PrintStatement(expr, loc);
		}
	}
	const right = parseExpr(s);
	switch (s.getKind()) {
		case TokenKind.Eq: {
			s.next();
			const left = parseExpr(s);
			return new AssignStatement(right, left, loc);
		}
	}
	return new ExpressionStatement(right, loc);
}

function parseExpr(s: ITokenStream): Expression {
	return parsePratt(s, 0);
}

// NOTE: infix(中置演算子)ではlbpを大きくすると右結合、rbpを大きくすると左結合の演算子になります。
// この値は演算子が左と右に対してどのくらい結合力があるかを表わしています。詳細はpratt parsingの説明ページを参照してください。

const operators: OpInfo[] = [
	{ opKind: 'postfix', kind: TokenKind.OpenParen, bp: 8 },

	{ opKind: 'prefix', kind: TokenKind.Plus, bp: 6 },
	{ opKind: 'prefix', kind: TokenKind.Minus, bp: 6 },

	{ opKind: 'infix', kind: TokenKind.Asterisk, lbp: 4, rbp: 5 },
	{ opKind: 'infix', kind: TokenKind.Slash, lbp: 4, rbp: 5 },

	{ opKind: 'infix', kind: TokenKind.Plus, lbp: 2, rbp: 3 },
	{ opKind: 'infix', kind: TokenKind.Minus, lbp: 2, rbp: 3 },
];

function parsePrefix(s: ITokenStream, minBp: number): Expression {
	const loc = s.token.loc;
	const op = s.getKind();
	s.next();

	const expr = parsePratt(s, minBp);

	switch (op) {
		case TokenKind.Plus: {
			return expr;
		}
		case TokenKind.Minus: {
			return new Minus(expr, loc);
		}
		default: {
			throw error('unexpected token', loc);
		}
	}
}

function parseInfix(s: ITokenStream, left: Expression, minBp: number): Expression {
	const loc = s.token.loc;
	const op = s.getKind();
	s.next();

	const right = parsePratt(s, minBp);

	switch (op) {
		case TokenKind.Asterisk: {
			return new Mul(left, right, loc);
		}
		case TokenKind.Plus: {
			return new Add(left, right, loc);
		}
		case TokenKind.Minus: {
			return new Sub(left, right, loc);
		}
		case TokenKind.Slash: {
			return new Div(left, right, loc);
		}
		default: {
			throw error('unexpected token', loc);
		}
	}
}

function parsePostfix(s: ITokenStream, expr: Expression): Expression {
	const loc = s.token.loc;
	const op = s.getKind();

	switch (op) {
		default: {
			throw error('unexpected token', loc);
		}
	}
}

function parseAtom(s: ITokenStream): Expression {
	const loc = s.token.loc;
	switch (s.getKind()) {
		case TokenKind.NumberLiteral: {
			const value = Number(s.token.value!);
			s.next();
			return new NumberLiteral(value, loc);
		}
		case TokenKind.Identifier: {
			const name = s.token.value!;
			s.next();
			return new Reference(name, loc);
		}
		case TokenKind.OpenParen: {
			s.next();
			const expr = parseExpr(s);
			s.nextWith(TokenKind.CloseParen);
			return expr;
		}
		default: {
			throw error('unexpected token', loc);
		}
	}
}

//#region Pratt parsing

type PrefixInfo = { opKind: 'prefix', kind: TokenKind, bp: number };
type InfixInfo = { opKind: 'infix', kind: TokenKind, lbp: number, rbp: number };
type PostfixInfo = { opKind: 'postfix', kind: TokenKind, bp: number };
type OpInfo = PrefixInfo | InfixInfo | PostfixInfo;

function parsePratt(s: ITokenStream, minBp: number): Expression {
	// pratt parsing
	// https://matklad.github.io/2020/04/13/simple-but-powerful-pratt-parsing.html

	let left: Expression;

	const tokenKind = s.getKind();
	const prefix = operators.find((x): x is PrefixInfo => x.opKind === 'prefix' && x.kind === tokenKind);
	if (prefix != null) {
		left = parsePrefix(s, prefix.bp);
	} else {
		left = parseAtom(s);
	}

	while (true) {
		const tokenKind = s.getKind();

		const postfix = operators.find((x): x is PostfixInfo => x.opKind === 'postfix' && x.kind === tokenKind);
		if (postfix != null) {
			if (postfix.bp < minBp) {
				break;
			}

			left = parsePostfix(s, left);
			continue;
		}

		const infix = operators.find((x): x is InfixInfo => x.opKind === 'infix' && x.kind === tokenKind);
		if (infix != null) {
			if (infix.lbp < minBp) {
				break;
			}

			left = parseInfix(s, left, infix.rbp);
			continue;
		}

		break;
	}

	return left;
}

//#endregion Pratt parsing
