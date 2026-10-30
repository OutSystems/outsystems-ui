import React from 'react';
import type { PatternAnatomy } from './types';

type TokenKind = 'plain' | 'tag' | 'attr' | 'string' | 'comment' | 'punct';

type Token = { kind: TokenKind; text: string };

/** A token read at position `i`, and where the next one starts. */
type Match = { token: Token; next: number };

/** Tries to read one kind of token at `i`; `prev` is the token before it. */
type Matcher = (line: string, i: number, prev: Token | undefined) => Match | null;

const matchComment: Matcher = (line, i) => {
	if (!line.startsWith('<!--', i)) return null;
	const end = line.indexOf('-->', i);
	const close = end === -1 ? line.length : end + 3;
	return { token: { kind: 'comment', text: line.slice(i, close) }, next: close };
};

const matchSpace: Matcher = (line, i) => {
	const space = /^\s+/.exec(line.slice(i));
	return space ? { token: { kind: 'plain', text: space[0] }, next: i + space[0].length } : null;
};

const matchPunct: Matcher = (line, i) => {
	let text = '';
	if (line.startsWith('</', i)) text = '</';
	else if ('<>=/'.includes(line[i])) text = line[i];
	return text ? { token: { kind: 'punct', text }, next: i + text.length } : null;
};

const matchString: Matcher = (line, i) => {
	if (line[i] !== '"') return null;
	const end = line.indexOf('"', i + 1);
	const close = end === -1 ? line.length : end + 1;
	return { token: { kind: 'string', text: line.slice(i, close) }, next: close };
};

/** A word is an attribute name before `=`, a tag name after `<` / `</`, plain text otherwise. */
function wordKind(after: string, prev: Token | undefined): TokenKind {
	if (after.startsWith('=')) return 'attr';
	if (prev?.kind === 'punct' && (prev.text === '<' || prev.text === '</')) return 'tag';
	return 'plain';
}

const matchWord: Matcher = (line, i, prev) => {
	const word = /^[\w.-]+/.exec(line.slice(i));
	if (!word) return null;
	const next = i + word[0].length;
	return { token: { kind: wordKind(line.slice(next).trimStart(), prev), text: word[0] }, next };
};

/** In precedence order; anything none of them reads is a single plain character. */
const MATCHERS: readonly Matcher[] = [matchComment, matchSpace, matchPunct, matchString, matchWord];

function lexLine(line: string): Token[] {
	const tokens: Token[] = [];
	let i = 0;

	while (i < line.length) {
		const prev = tokens[tokens.length - 1];
		const match =
			MATCHERS.reduce<Match | null>((found, matcher) => found ?? matcher(line, i, prev), null) ??
			({ token: { kind: 'plain', text: line[i] }, next: i + 1 } satisfies Match);
		tokens.push(match.token);
		i = match.next;
	}

	return tokens;
}

function AnatomyCode({ source }: { source: string }) {
	const lines = source.split('\n');

	return (
		<pre className="pd-anatomy-text">
			{lines.map((line, lineIndex) => (
				<span key={lineIndex} className="pd-anatomy-text__line">
					{lexLine(line).map((token, tokenIndex) => (
						<span key={tokenIndex} className={`pd-code-tok pd-code-tok--${token.kind}`}>
							{token.text}
						</span>
					))}
					{'\n'}
				</span>
			))}
		</pre>
	);
}

export function PdAnatomy({ anatomy }: { anatomy: PatternAnatomy }) {
	return (
		<div className="pd-anatomy">
			<AnatomyCode source={anatomy.tree} />
		</div>
	);
}
