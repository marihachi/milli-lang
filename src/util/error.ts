import type { Loc } from '../compile/syntax/node.js';

export function error(message: string, loc: Loc) {
	return new Error(`${message} (${loc.line}:${loc.column})`);
}
