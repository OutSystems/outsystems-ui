import React from 'react';

/** Dark code panel with a Copy button; dims line and block comments. Styled by `.code` in the docs-page SCSS. */
export function DocsCodeBlock({ code }: { code: string }) {
	const [label, setLabel] = React.useState('Copy');

	const onCopy = React.useCallback(async () => {
		try {
			await navigator.clipboard.writeText(code);
			setLabel('Copied');
			window.setTimeout(() => setLabel('Copy'), 1400);
		} catch {
			/* ignore */
		}
	}, [code]);

	return (
		<div className="code">
			<pre>{highlightLight(code)}</pre>
			<button type="button" onClick={onCopy}>
				{label}
			</button>
		</div>
	);
}

function highlightLight(code: string): React.ReactNode {
	const parts: React.ReactNode[] = [];
	const re = /(\/\/[^\n]*|\/\*[\s\S]*?\*\/)/g;
	let last = 0;
	let m: RegExpExecArray | null;
	let key = 0;
	while ((m = re.exec(code))) {
		if (m.index > last) parts.push(code.slice(last, m.index));
		parts.push(
			<span className="c" key={key++}>
				{m[0]}
			</span>
		);
		last = m.index + m[0].length;
	}
	if (last < code.length) parts.push(code.slice(last));
	return parts.length ? parts : code;
}
