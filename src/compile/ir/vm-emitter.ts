import { Instruction, OpCode, InstructionWriter } from '../../vm/instruction.js';
import { Env } from './index.js';
import { IrNode } from './node.js';

export function emitCode(w: InstructionWriter, env: Env, node: IrNode) {
	emitProgram(w, env, node);
}

function emitProgram(w: InstructionWriter, env: Env, node: IrNode) {
	if (node.kind === 'Program') {
		node.children.forEach(x => emitStatement(w, env, x));
		return;
	}
	throw new Error('unhandled node:' + node.kind);
}

function emitStatement(w: InstructionWriter, env: Env, node: IrNode) {
	switch (node.kind) {
		case 'PrintStatement': {
			emitExpression(w, env, node.children[0]);
			w.write(new Instruction(OpCode.Print));
			return;
		}
		case 'AssignStatement': {
			const a = node.children[0];
			const b = node.children[1];
			if (a.kind !== 'Reference') {
				throw new Error('reference expected');
			}
			emitExpression(w, env, b);
			const local = env.declare(a.identifier);
			w.write(new Instruction(OpCode.PushLocal, [local.index]));
			w.write(new Instruction(OpCode.Store));
			return;
		}
		case 'ExpressionStatement': {
			return;
		}
	}
	throw new Error('unhandled node:' + node.kind);
}

function emitExpression(w: InstructionWriter, env: Env, node: IrNode) {
	switch (node.kind) {
		case 'Add': {
			emitExpression(w, env, node.children[1]);
			emitExpression(w, env, node.children[0]);
			w.write(new Instruction(OpCode.Add));
			return;
		}
		case 'Sub': {
			emitExpression(w, env, node.children[1]);
			emitExpression(w, env, node.children[0]);
			w.write(new Instruction(OpCode.Sub));
			return;
		}
		case 'Mul': {
			emitExpression(w, env, node.children[1]);
			emitExpression(w, env, node.children[0]);
			w.write(new Instruction(OpCode.Mul));
			return;
		}
		case 'Div': {
			emitExpression(w, env, node.children[1]);
			emitExpression(w, env, node.children[0]);
			w.write(new Instruction(OpCode.Div));
			return;
		}
		case 'Rem': {
			emitExpression(w, env, node.children[1]);
			emitExpression(w, env, node.children[0]);
			w.write(new Instruction(OpCode.Rem));
			return;
		}
		case 'Neg': {
			emitExpression(w, env, node.children[0]);
			w.write(new Instruction(OpCode.Neg));
			return;
		}
		case 'NumberLiteral': {
			w.write(new Instruction(OpCode.Push, [node.value]));
			return;
		}
		case 'Reference': {
			const local = env.get(node.identifier);
			if (local == null) {
				throw new Error('variable not found');
			}
			w.write(new Instruction(OpCode.PushLocal, [local.index]));
			w.write(new Instruction(OpCode.Load));
			return;
		}
	}
	throw new Error('unhandled node:' + node.kind);
}
