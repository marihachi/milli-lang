import { error } from '../util/error.js';
import { NumberLiteral, Operand, Statement, Program, Reference } from './node.js';
import { Scanner } from './scanner.js';
import { TokenKind } from './token.js';

export function parse(input: string): Program {
	const s = new Scanner(input);
	const node = parseProgram(s);
	return node;
}

function parseProgram(s: Scanner): Program {
	const loc = s.token.loc;
	const nodes: Statement[] = [];
	while (s.getKind() !== TokenKind.EOF) {
		if (s.getKind() === TokenKind.NewLine) {
			s.next();
		} else {
			const n = parseStatement(s);
			nodes.push(n);
			s.nextWith(TokenKind.NewLine);
		}
	}
	return new Program(nodes, loc);
}

function parseStatement(s: Scanner): Statement {
	const loc = s.token.loc;
	s.expect(TokenKind.Identifier);
	const opcode = s.token.value!;
	s.next();

	const operands: Operand[] = [];
	while (s.getKind() !== TokenKind.EOF && s.getKind() !== TokenKind.NewLine) {
		if (operands.length > 0) {
			s.nextWith(TokenKind.Comma);
		}
		const operand = parseOperand(s);
		operands.push(operand);
	}

	return new Statement(opcode, operands, loc);
}

function parseOperand(s: Scanner): Operand {
	const loc = s.token.loc;
	switch (s.getKind()) {
		case TokenKind.Number: {
			const value = Number(s.token.value!);
			s.next();
			return new NumberLiteral(value, loc);
		}
		case TokenKind.Identifier: {
			const name = s.token.value!;
			s.next();
			return new Reference(name, loc);
		}
		default: {
			throw error('unexpected token', loc);
		}
	}
}
