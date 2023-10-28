import { IrNode } from './node.js';
import { AsmWriter } from '../../asm/writer.js';
import { AsmOperation, OpCode } from '../../asm/operation.js';

export function emitAsm(w: AsmWriter, node: IrNode) {
	emitProgram(w, node);
}

function emitProgram(w: AsmWriter, node: IrNode) {
	if (node.kind === 'Program') {
		node.children.forEach(x => emitStatement(w, x));
		return;
	}
	throw new Error('unhandled node:' + node.kind);
}

function emitStatement(asm: AsmWriter, node: IrNode) {
	switch (node.kind) {
		case 'PrintStatement': {
			emitExpression(asm, node.children[0]);
			asm.write(new AsmOperation(OpCode.Print));
			return;
		}
		case 'AssignStatement': {
			const a = node.children[0];
			const b = node.children[1];
			if (a.kind !== 'Reference') {
				throw new Error('reference expected');
			}
			emitExpression(asm, b);
			asm.write(new AsmOperation(OpCode.PushIdent, [a.identifier]));
			asm.write(new AsmOperation(OpCode.Store));
			return;
		}
		case 'ExpressionStatement': {
			return;
		}
	}
	throw new Error('unhandled node:' + node.kind);
}

function emitExpression(asm: AsmWriter, node: IrNode) {
	switch (node.kind) {
		case 'Add': {
			emitExpression(asm, node.children[1]);
			emitExpression(asm, node.children[0]);
			asm.write(new AsmOperation(OpCode.Add));
			return;
		}
		case 'Sub': {
			emitExpression(asm, node.children[1]);
			emitExpression(asm, node.children[0]);
			asm.write(new AsmOperation(OpCode.Sub));
			return;
		}
		case 'Mul': {
			emitExpression(asm, node.children[1]);
			emitExpression(asm, node.children[0]);
			asm.write(new AsmOperation(OpCode.Mul));
			return;
		}
		case 'Div': {
			emitExpression(asm, node.children[1]);
			emitExpression(asm, node.children[0]);
			asm.write(new AsmOperation(OpCode.Div));
			return;
		}
		case 'Rem': {
			emitExpression(asm, node.children[1]);
			emitExpression(asm, node.children[0]);
			asm.write(new AsmOperation(OpCode.Rem));
			return;
		}
		case 'Neg': {
			emitExpression(asm, node.children[0]);
			asm.write(new AsmOperation(OpCode.Neg));
			return;
		}
		case 'NumberLiteral': {
			asm.write(new AsmOperation(OpCode.Push, [node.value]));
			return;
		}
		case 'Reference': {
			asm.write(new AsmOperation(OpCode.PushIdent, [node.identifier]));
			asm.write(new AsmOperation(OpCode.Load));
			return;
		}
	}
	throw new Error('unhandled node:' + node.kind);
}
