import { InstructionWriter, Instruction, opTable } from '../vm/instruction.js';
import { parse } from './parser.js';
import { Program } from './node.js';

export type Label = {
	index: number;
};

export class Env {
	labels: Map<string, Label> = new Map();

	declare(name: string): Label {
		let variable = this.get(name);
		// 同名の変数が既にあれば何もせずに終了
		if (variable != null) return variable;
		// インデックスを採番
		const index = this.labels.size;
		variable = { index };
		this.labels.set(name, variable);
		return variable;
	}

	get(name: string): Label | undefined {
		const variable = this.labels.get(name);
		if (variable == null) return;
		return variable;
	}
}

export function assemble(mat: string): Buffer {
	// parse text asm
	const tree = parse(mat);

	// generate vm code
	const w = new InstructionWriter;
	const env = new Env();
	emitCode(w, env, tree);
	const code = w.serialize();

	return code;
}

function emitCode(w: InstructionWriter, env: Env, program: Program) {
	for (const node of program.children) {
		if (node.kind !== 'Statement') {
			throw new Error('statement expected');
		}

		const op = opTable.find(x => x.name.toLowerCase() === node.opcode.toLowerCase());
		if (op == null) {
			throw new Error('unknown instruction');
		}

		const operands: number[] = [];
		for (const child of node.children) {
			switch (child.kind) {
				case 'NumberLiteral': {
					operands.push(child.value);
					break;
				}
				case 'Reference': {
					const label = env.declare(child.idetifier);
					operands.push(label.index);
					break;
				}
				default: {
					throw new Error('unhandled node');
				}
			}
		}

		w.write(new Instruction(op.code, operands));
	}
}
