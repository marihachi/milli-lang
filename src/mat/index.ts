import { AsmOperation } from '../asm/operation.js';
import { emitAsm } from './asm-emitter.js';
import { parse } from './parser.js';

export function assemble(source: string): AsmOperation[] {
	// parse text asm
	const tree = parse(source);

	// generate asm code
	const asm = emitAsm(tree);

	return asm;
}
