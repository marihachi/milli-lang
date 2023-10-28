import { VmOperation } from '../vm/operation.js';
import { VmWriter } from '../vm/index.js';
import { emitCode } from './ir/vm-emitter.js';
import { emitIr } from './syntax/ir-emitter.js';
import { parse } from './syntax/parser.js';

export function compile(source: string): VmOperation[] {
	// generate syntax tree
	const syntax = parse(source);

	// generate IR tree
	const ir = emitIr(syntax);

	// generate vm code
	const writer = new VmWriter();
	emitCode(writer, ir);

	return writer.code;
}
