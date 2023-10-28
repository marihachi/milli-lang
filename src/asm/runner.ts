import { AsmOperation } from './operation.js';

export function run(code: AsmOperation[]) {
	const memory: Map<string, { value: number }> = new Map();
	const stack: (string | number)[] = [];
	for (const op of code) {
		switch (op.kind) {
			case 'Nop': {
				break;
			}
			case 'Push': {
				stack.push(op.value);
				break;
			}
			case 'PushIdent': {
				stack.push(op.identifier);
				break;
			}
			case 'Add': {
				const a = stack.pop();
				const b = stack.pop();
				if (typeof a !== 'number' || typeof b !== 'number') {
					throw new Error('runtime error. (op: Add)');
				}
				const x = a + b;
				stack.push(x);
				break;
			}
			case 'Sub': {
				const a = stack.pop();
				const b = stack.pop();
				if (typeof a !== 'number' || typeof b !== 'number') {
					throw new Error('runtime error. (op: Sub)');
				}
				const x = a - b;
				stack.push(x);
				break;
			}
			case 'Mul': {
				const a = stack.pop();
				const b = stack.pop();
				if (typeof a !== 'number' || typeof b !== 'number') {
					throw new Error('runtime error. (op: Mul)');
				}
				const x = a * b;
				stack.push(x);
				break;
			}
			case 'Div': {
				const a = stack.pop();
				const b = stack.pop();
				if (typeof a !== 'number' || typeof b !== 'number') {
					throw new Error('runtime error. (op: Div)');
				}
				const x = a / b;
				stack.push(x);
				break;
			}
			case 'Rem': {
				const a = stack.pop();
				const b = stack.pop();
				if (typeof a !== 'number' || typeof b !== 'number') {
					throw new Error('runtime error. (op: Rem)');
				}
				const x = a % b;
				stack.push(x);
				break;
			}
			case 'Neg': {
				const a = stack.pop();
				if (typeof a !== 'number') {
					throw new Error('runtime error. (op: Neg)');
				}
				const x = -a;
				stack.push(x);
				break;
			}
			case 'Store': {
				const a = stack.pop();
				if (typeof a !== 'string') {
					throw new Error('runtime error. (op: Store)');
				}
				const b = stack.pop();
				if (typeof b !== 'number') {
					throw new Error('runtime error. (op: Store)');
				}
				memory.set(a, { value: b });
				break;
			}
			case 'Load': {
				const a = stack.pop();
				if (typeof a !== 'string') {
					throw new Error('runtime error. (op: Load)');
				}
				const x = memory.get(a);
				if (x == null) {
					throw new Error('runtime error. (op: Load)');
				}
				stack.push(x.value);
				break;
			}
			case 'Print': {
				const a = stack.pop();
				if (typeof a !== 'number') {
					throw new Error('runtime error. (op: Print)');
				}
				console.log(a);
				break;
			}
		}
	}
}
