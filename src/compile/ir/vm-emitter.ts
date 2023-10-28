import { VmOperation, OpCode } from '../../vm/operation.js';
import { VmWriter } from '../../vm/index.js';
import { IrNode } from './node.js';

export function emitCode(w: VmWriter, node: IrNode) {
	emitProgram(w, node);
}

function emitProgram(w: VmWriter, node: IrNode) {
	if (node.kind === 'Program') {
		node.children.forEach(x => emitStatement(w, x));
		return;
	}
	throw new Error('unhandled node:' + node.kind);
}

function emitStatement(w: VmWriter, node: IrNode) {
	switch (node.kind) {
		case 'PrintStatement': {
			emitExpression(w, node.children[0]);
			w.write(new VmOperation(OpCode.Print));
			return;
		}
		case 'AssignStatement': {
			const a = node.children[0];
			const b = node.children[1];
			if (a.kind !== 'Reference') {
				throw new Error('reference expected');
			}
			emitExpression(w, b);
			w.write(new VmOperation(OpCode.PushIdent, [a.identifier]));
			w.write(new VmOperation(OpCode.Store));
			return;
		}
		case 'ExpressionStatement': {
			return;
		}
	}
	throw new Error('unhandled node:' + node.kind);
}

function emitExpression(w: VmWriter, node: IrNode) {
	switch (node.kind) {
		case 'Add': {
			emitExpression(w, node.children[1]);
			emitExpression(w, node.children[0]);
			w.write(new VmOperation(OpCode.Add));
			return;
		}
		case 'Sub': {
			emitExpression(w, node.children[1]);
			emitExpression(w, node.children[0]);
			w.write(new VmOperation(OpCode.Sub));
			return;
		}
		case 'Mul': {
			emitExpression(w, node.children[1]);
			emitExpression(w, node.children[0]);
			w.write(new VmOperation(OpCode.Mul));
			return;
		}
		case 'Div': {
			emitExpression(w, node.children[1]);
			emitExpression(w, node.children[0]);
			w.write(new VmOperation(OpCode.Div));
			return;
		}
		case 'Rem': {
			emitExpression(w, node.children[1]);
			emitExpression(w, node.children[0]);
			w.write(new VmOperation(OpCode.Rem));
			return;
		}
		case 'Neg': {
			emitExpression(w, node.children[0]);
			w.write(new VmOperation(OpCode.Neg));
			return;
		}
		case 'NumberLiteral': {
			w.write(new VmOperation(OpCode.Push, [node.value]));
			return;
		}
		case 'Reference': {
			w.write(new VmOperation(OpCode.PushIdent, [node.identifier]));
			w.write(new VmOperation(OpCode.Load));
			return;
		}
	}
	throw new Error('unhandled node:' + node.kind);
}
