import React from 'react';
import type { PatternAnatomy } from './types';

type TokenKind = 'plain' | 'tag' | 'attr' | 'string' | 'comment' | 'punct';

type Token = { kind: TokenKind; text: string };

function lexLine(line: string): Token[] {
	const tokens: Token[] = [];
	let i = 0;

	while (i < line.length) {
		if (line.startsWith('<!--', i)) {
			const end = line.indexOf('-->', i);
			const close = end === -1 ? line.length : end + 3;
			tokens.push({ kind: 'comment', text: line.slice(i, close) });
			i = close;
			continue;
		}

		if (/[\s]/.test(line[i])) {
			let j = i + 1;
			while (j < line.length && /[\s]/.test(line[j])) j++;
			tokens.push({ kind: 'plain', text: line.slice(i, j) });
			i = j;
			continue;
		}

		if (line.startsWith('</', i)) {
			tokens.push({ kind: 'punct', text: '</' });
			i += 2;
			continue;
		}

		if (line[i] === '<' || line[i] === '>' || line[i] === '=') {
			tokens.push({ kind: 'punct', text: line[i] });
			i += 1;
			continue;
		}

		if (line[i] === '/') {
			tokens.push({ kind: 'punct', text: '/' });
			i += 1;
			continue;
		}

		if (line[i] === '"') {
			let j = i + 1;
			while (j < line.length && line[j] !== '"') j++;
			tokens.push({ kind: 'string', text: line.slice(i, j + 1) });
			i = j + 1;
			continue;
		}

		const word = line.slice(i).match(/^[\w.-]+/);
		if (word) {
			const after = line.slice(i + word[0].length).trimStart();
			const prev = tokens[tokens.length - 1];
			let kind: TokenKind = 'plain';

			if (after.startsWith('=')) {
				kind = 'attr';
			} else if (prev?.kind === 'punct' && (prev.text === '<' || prev.text === '</')) {
				kind = 'tag';
			}

			tokens.push({ kind, text: word[0] });
			i += word[0].length;
			continue;
		}

		tokens.push({ kind: 'plain', text: line[i] });
		i += 1;
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
