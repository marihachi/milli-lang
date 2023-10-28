export enum TokenKind {
	EOF,
	NewLine,
	Identifier,
	Number,

	/** "," */
	Comma,
	/** "." */
	Dot,
	/** ":" */
	Colon,
}

export type TokenLocation = { column: number, line: number };

export class Token {
	constructor(
		public kind: TokenKind,
		public loc: TokenLocation,
		/** for number, identifier */
		public value?: string,
	) { }
}

/**
 * - opts.value: for number, identifier
*/
export function TOKEN(kind: TokenKind, loc: TokenLocation, opts?: { value?: Token['value'] }): Token {
	return new Token(kind, loc, opts?.value);
}
