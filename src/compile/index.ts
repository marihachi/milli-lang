import { InstructionWriter } from '../vm/instruction.js';
import { Env } from './ir/index.js';
import { emitCode } from './ir/vm-emitter.js';
import { emitIr } from './syntax/ir-emitter.js';
import { parse } from './syntax/parser.js';

export function compile(source: string, debug: boolean): Buffer {
	// generate syntax tree
	const syntax = parse(source);

	// generate IR tree
	const ir = emitIr(syntax);

	// generate vm code
	const writer = new InstructionWriter();
	const env = new Env();
	emitCode(writer, env, ir);
	const code = writer.serialize();

	return code;
}
