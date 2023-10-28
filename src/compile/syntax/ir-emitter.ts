import { SyntaxNode } from './node.js';
import { IrNode } from '../ir/node.js';

export function emitIr(node: SyntaxNode): IrNode {
	return node;
	// throw new Error('unhandled node:' + node.kind);
}
