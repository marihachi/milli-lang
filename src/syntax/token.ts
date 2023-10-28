export enum TokenKind {
	EOF,
	NewLine,
	Identifier,

	// literal
	NumberLiteral,

	// keyword
	PrintKeyword,

	/** "%" */
	Percent,
	/** "(" */
	OpenParen,
	/** ")" */
	CloseParen,
	/** "*" */
	Asterisk,
	/** "+" */
	Plus,
	/** "-" */
	Minus,
	/** "/" */
	Slash,
	/** ";" */
	SemiColon,
	/** "=" */
	Eq,
}

export type TokenLocation = { column: number, line: number };

export class Token {
	constructor(
		public kind: TokenKind,
		public loc: TokenLocation,
		/** for number literal, string literal */
		public value?: string,
	) { }
}

/**
 * - opts.value: for number literal, string literal
*/
export function TOKEN(kind: TokenKind, loc: TokenLocation, opts?: { value?: Token['value'] }): Token {
	return new Token(kind, loc, opts?.value);
}
