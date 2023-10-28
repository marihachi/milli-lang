import { InstructionWriter } from '../vm/instruction.js';
import { emitCode } from './ir/vm-emitter.js';
import { emitIr } from './syntax/ir-emitter.js';
import { parse } from './syntax/parser.js';

export function compile(source: string): Buffer {
	// generate syntax tree
	const syntax = parse(source);

	// generate IR tree
	const ir = emitIr(syntax);

	// generate vm code
	const writer = new InstructionWriter();
	emitCode(writer, ir);
	const code = writer.serialize();

	return code;
}
