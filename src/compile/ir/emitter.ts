import { SyntaxNode } from '../syntax/node.js';
import { IrNode } from './node.js';

export function emitIr(node: SyntaxNode): IrNode {
	return node;
	// throw new Error('unhandled node:' + node.kind);
}
