import { Instruction, OpCode, InstructionWriter } from '../../vm/instruction.js';
import { IrNode } from './node.js';

export function emitCode(w: InstructionWriter, node: IrNode) {
	emitProgram(w, node);
}

function emitProgram(w: InstructionWriter, node: IrNode) {
	if (node.kind === 'Program') {
		node.children.forEach(x => emitStatement(w, x));
		return;
	}
	throw new Error('unhandled node:' + node.kind);
}

function emitStatement(w: InstructionWriter, node: IrNode) {
	switch (node.kind) {
		case 'PrintStatement': {
			emitExpression(w, node.children[0]);
			w.write(new Instruction(OpCode.Print));
			return;
		}
		case 'AssignStatement': {
			const a = node.children[0];
			const b = node.children[1];
			if (a.kind !== 'Reference') {
				throw new Error('reference expected');
			}
			emitExpression(w, b);
			w.write(new Instruction(OpCode.PushIdent, [a.identifier]));
			w.write(new Instruction(OpCode.Store));
			return;
		}
		case 'ExpressionStatement': {
			return;
		}
	}
	throw new Error('unhandled node:' + node.kind);
}

function emitExpression(w: InstructionWriter, node: IrNode) {
	switch (node.kind) {
		case 'Add': {
			emitExpression(w, node.children[1]);
			emitExpression(w, node.children[0]);
			w.write(new Instruction(OpCode.Add));
			return;
		}
		case 'Sub': {
			emitExpression(w, node.children[1]);
			emitExpression(w, node.children[0]);
			w.write(new Instruction(OpCode.Sub));
			return;
		}
		case 'Mul': {
			emitExpression(w, node.children[1]);
			emitExpression(w, node.children[0]);
			w.write(new Instruction(OpCode.Mul));
			return;
		}
		case 'Div': {
			emitExpression(w, node.children[1]);
			emitExpression(w, node.children[0]);
			w.write(new Instruction(OpCode.Div));
			return;
		}
		case 'Rem': {
			emitExpression(w, node.children[1]);
			emitExpression(w, node.children[0]);
			w.write(new Instruction(OpCode.Rem));
			return;
		}
		case 'Neg': {
			emitExpression(w, node.children[0]);
			w.write(new Instruction(OpCode.Neg));
			return;
		}
		case 'NumberLiteral': {
			w.write(new Instruction(OpCode.Push, [node.value]));
			return;
		}
		case 'Reference': {
			w.write(new Instruction(OpCode.PushIdent, [node.identifier]));
			w.write(new Instruction(OpCode.Load));
			return;
		}
	}
	throw new Error('unhandled node:' + node.kind);
}
