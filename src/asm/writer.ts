import { AsmOperation } from './operation.js';

export class AsmWriter {
	code: AsmOperation[] = [];

	write(node: AsmOperation) {
		this.code.push(node);
	}
}
