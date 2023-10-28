import { AsmOperation } from '../asm/operation.js';
import { AsmWriter } from '../asm/writer.js';
import { emitAsm } from './asm-emitter.js';
import { check } from './checker.js';
import { parse } from './parser.js';

export function assemble(source: string): AsmOperation[] {
	// parse text asm
	const tree = parse(source);

	// check semantics
	check(tree);

	// generate asm code
	const w = new AsmWriter();
	const asm = emitAsm(w, tree);

	return asm;
}
