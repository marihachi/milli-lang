import { AsmNode } from '../asm/node.js';

export function run(code: AsmNode[]) {
	for (const op of code) {
		switch (op.kind) {
			case 'Push': {
				console.log('push', op.value);
				break;
			}
			case 'PushIdent': {
				console.log('push-ident', op.identifier);
				break;
			}
			case 'Add':
			case 'Sub':
			case 'Mul':
			case 'Div': {
				console.log(op.kind.toLowerCase());
				break;
			}
			case 'Neg': {
				console.log('neg');
				break;
			}
			case 'Store': {
				console.log('store');
				break;
			}
			case 'Load': {
				console.log('load');
				break;
			}
			case 'Print': {
				console.log('print');
				break;
			}
		}
	}
}
