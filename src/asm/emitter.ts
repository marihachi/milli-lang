import { SyntaxNode } from '../syntaxes/node.js';
import { Add, Div, Load, Mul, Neg, Print, Push, PushIdent, Store, Sub } from './node.js';
import { AsmWriter } from './writer.js';

export function emit(w: AsmWriter, node: SyntaxNode) {
	if (node.kind === 'Program') {
		node.children.forEach(x => emitStatement(w, x));
		return;
	}
	throw new Error('unhandled node:' + node.kind);
}

function emitStatement(asm: AsmWriter, node: SyntaxNode) {
	switch (node.kind) {
		case 'PrintStatement': {
			emitExpression(asm, node.children[0]);
			asm.write(new Print());
			return;
		}
		case 'AssignStatement': {
			const a = node.children[0];
			const b = node.children[1];
			if (a.kind !== 'Reference') {
				throw new Error('reference expected');
			}
			emitExpression(asm, b);
			asm.write(new PushIdent(a.identifier));
			asm.write(new Store());
			return;
		}
		case 'ExpressionStatement': {
			return;
		}
	}
	throw new Error('unhandled node:' + node.kind);
}

function emitExpression(asm: AsmWriter, node: SyntaxNode) {
	switch (node.kind) {
		case 'Add': {
			emitExpression(asm, node.children[1]);
			emitExpression(asm, node.children[0]);
			asm.write(new Add());
			return;
		}
		case 'Sub': {
			emitExpression(asm, node.children[1]);
			emitExpression(asm, node.children[0]);
			asm.write(new Sub());
			return;
		}
		case 'Mul': {
			emitExpression(asm, node.children[1]);
			emitExpression(asm, node.children[0]);
			asm.write(new Mul());
			return;
		}
		case 'Div': {
			emitExpression(asm, node.children[1]);
			emitExpression(asm, node.children[0]);
			asm.write(new Div());
			return;
		}
		case 'Minus': {
			emitExpression(asm, node.children[0]);
			asm.write(new Neg());
			return;
		}
		case 'NumberLiteral': {
			asm.write(new Push(node.value));
			return;
		}
		case 'Reference': {
			asm.write(new PushIdent(node.identifier));
			asm.write(new Load());
			return;
		}
	}
	throw new Error('unhandled node:' + node.kind);
}
