import React from 'react';
import { CopyButton } from './CopyButton';

export type VarLine = {
	label?: string;
	value: string;
};

/** Inline label + code + copy — Mobile UI Variables column pattern. */
export function VarStack({ lines }: { lines: VarLine[] }) {
	return (
		<div className="fd-var-stack">
			{lines.map((line) => (
				<div key={`${line.label ?? 'row'}-${line.value}`} className="fd-var-line">
					{line.label ? <span className="fd-var-line__label">{line.label}:</span> : null}
					<code>{line.value}</code>
					<CopyButton text={line.value} />
				</div>
			))}
		</div>
	);
}
