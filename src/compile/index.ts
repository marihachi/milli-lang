import { AsmOperation } from '../asm/operation.js';
import { AsmWriter } from '../asm/writer.js';
import { emitAsm } from './ir/asm-emitter.js';
import { emitIr } from './ir/emitter.js';
import { parse } from './syntax/parser.js';

export function compile(source: string): AsmOperation[] {
	// generate syntax tree
	const syntax = parse(source);

	// generate IR tree
	const ir = emitIr(syntax);

	// generate asm code
	const asm = new AsmWriter();
	emitAsm(asm, ir);

	return asm.code;
}
