import { AsmNode } from './node.js';

export class AsmWriter {
	code: AsmNode[] = [];

	write(node: AsmNode) {
		this.code.push(node);
	}
}
