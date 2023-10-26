import { SyntaxNode, applyChildren } from './syntaxes/syntax-node.js';

export function emit(node: SyntaxNode) {
	if (node.kind === 'Program') {
		applyChildren(node, emitStatement);
		return;
	}
	throw new Error('unhandled node:' + node.kind);
}

function emitStatement(node: SyntaxNode) {
	switch (node.kind) {
		case 'PrintStatement': {
			applyChildren(node, emitExpression);
			console.log('print');
			return;
		}
		case 'AssignStatement': {
			const a = node.children[0];
			const b = node.children[1];
			if (a.kind !== 'Reference') {
				throw new Error('reference expected');
			}
			console.log(`push ${a.identifier}`);
			emitExpression(b);
			console.log('store');
			return;
		}
		case 'ExpressionStatement': {
			return;
		}
	}
	throw new Error('unhandled node:' + node.kind);
}

function emitExpression(node: SyntaxNode) {
	switch (node.kind) {
		case 'Add':
		case 'Sub':
		case 'Mul':
		case 'Div':
		case 'Minus': {
			applyChildren(node, emitExpression);
			console.log(node.kind.toLowerCase());
			return;
		}
		case 'NumberLiteral': {
			console.log('push', node.value);
			return;
		}
		case 'Reference': {
			console.log(`push ${node.identifier}`);
			console.log('load');
			return;
		}
	}
	throw new Error('unhandled node:' + node.kind);
}
